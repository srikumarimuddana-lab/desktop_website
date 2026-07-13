// Spinr backend API client (browser-only).
//
// Talks to the spinrvm FastAPI backend (NEXT_PUBLIC_BACKEND_URL) — a fully
// separate system from the website's Supabase CMS. The website never holds
// spinrvm database credentials; everything goes through this REST client.
//
// Session model (matches the backend as-built):
//   - refresh_token: HTTP-only cookie set by the backend (30 days, rotated).
//   - access token: 15-min JWT kept in JS memory only, sent as Bearer.
//     Re-minted on page load via POST /auth/refresh (cookie-authenticated).
//   - csrf_token: returned in JSON by verify-otp/refresh; echoed as the
//     X-CSRF-Token header on state-changing requests (double-submit; the
//     matching cookie is host-scoped to the API domain).
//
// Auth session endpoints use the /api/portal/auth namespace because that
// prefix is App-Check-exempt for browser clients (same pattern as the
// company portal). send-otp / verify-otp use /api/v1 (already exempt).

const BASE_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/$/, '');

const CSRF_STORAGE_KEY = 'spinr_csrf';
const SESSION_HINT_KEY = 'spinr_has_session';

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token || null;
}

export function getCsrfToken() {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(CSRF_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setCsrfToken(token) {
  if (typeof window === 'undefined') return;
  try {
    if (token) window.localStorage.setItem(CSRF_STORAGE_KEY, token);
    else window.localStorage.removeItem(CSRF_STORAGE_KEY);
  } catch {
    // Storage unavailable (private mode) — CSRF token stays memory-only
    // via the last AuthResponse; refresh-on-load will re-mint it.
  }
}

export function hasSessionHint() {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(SESSION_HINT_KEY) === '1';
  } catch {
    return false;
  }
}

export function setSessionHint(present) {
  if (typeof window === 'undefined') return;
  try {
    if (present) window.localStorage.setItem(SESSION_HINT_KEY, '1');
    else window.localStorage.removeItem(SESSION_HINT_KEY);
  } catch {
    // Best-effort hint only.
  }
}

export class SpinrApiError extends Error {
  constructor(message, { status, code, detail } = {}) {
    super(message);
    this.name = 'SpinrApiError';
    this.status = status ?? 0;
    this.code = code ?? null;
    this.detail = detail ?? null;
  }
}

function extractError(status, body) {
  // FastAPI shapes: {detail: "msg"} | {detail: {code, message}} |
  // {detail: [{msg}, ...]} (validation) — normalize all of them.
  const detail = body && typeof body === 'object' ? body.detail : null;
  if (typeof detail === 'string') {
    return new SpinrApiError(detail, { status, detail });
  }
  if (detail && typeof detail === 'object' && !Array.isArray(detail)) {
    return new SpinrApiError(detail.message || detail.error || 'Request failed', {
      status,
      code: detail.code || null,
      detail,
    });
  }
  if (Array.isArray(detail) && detail.length > 0) {
    return new SpinrApiError(detail[0].msg || 'Invalid request', { status, detail });
  }
  return new SpinrApiError(`Request failed (${status})`, { status });
}

async function parseJsonSafe(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// Single-flight refresh: concurrent 401s share one in-flight refresh call.
let refreshPromise = null;

async function doRefresh() {
  const response = await fetch(`${BASE_URL}/api/portal/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  });
  const body = await parseJsonSafe(response);
  if (!response.ok) {
    throw extractError(response.status, body);
  }
  setAccessToken(body.token);
  if (body.csrf_token) setCsrfToken(body.csrf_token);
  setSessionHint(true);
  return body;
}

export async function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

function clearSession() {
  setAccessToken(null);
  setCsrfToken(null);
  setSessionHint(false);
}

/**
 * Fetch wrapper for the Spinr backend.
 *
 * @param {string} path - API path beginning with /api/...
 * @param {object} [options]
 * @param {string} [options.method]
 * @param {object|FormData} [options.body] - plain objects are JSON-encoded;
 *   FormData is passed through (multipart, browser sets the boundary).
 * @param {string} [options.idempotencyKey]
 * @param {boolean} [options.retryOn401=true]
 */
export async function apiFetch(path, options = {}) {
  const { method = 'GET', body, idempotencyKey, retryOn401 = true } = options;

  const headers = {};
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  if (method !== 'GET' && method !== 'HEAD') {
    const csrf = getCsrfToken();
    if (csrf) headers['X-CSRF-Token'] = csrf;
  }
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;

  let encodedBody;
  if (body instanceof FormData) {
    encodedBody = body; // browser sets multipart Content-Type + boundary
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    encodedBody = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    credentials: 'include',
    headers,
    body: encodedBody,
  });

  if (response.status === 401 && retryOn401) {
    try {
      await refreshSession();
    } catch (refreshError) {
      clearSession();
      throw new SpinrApiError('Your session has expired. Please log in again.', {
        status: 401,
        code: 'session_expired',
        detail: refreshError.detail,
      });
    }
    return apiFetch(path, { ...options, retryOn401: false });
  }

  const parsed = await parseJsonSafe(response);
  if (!response.ok) {
    throw extractError(response.status, parsed);
  }
  return parsed;
}

// ── Auth helpers ─────────────────────────────────────────────────────────

/** @param {string} phone E.164, e.g. +13065551234 */
export function sendOtp(phone) {
  return apiFetch('/api/v1/auth/send-otp', {
    method: 'POST',
    body: { phone },
    retryOn401: false,
  });
}

/** Applies the returned session (access token, csrf, hint) before resolving. */
export async function verifyOtp(phone, code) {
  const auth = await apiFetch('/api/v1/auth/verify-otp', {
    method: 'POST',
    body: { phone, code },
    retryOn401: false,
  });
  setAccessToken(auth.token);
  if (auth.csrf_token) setCsrfToken(auth.csrf_token);
  setSessionHint(true);
  return auth;
}

export function getMe() {
  return apiFetch('/api/portal/auth/me');
}

export async function logout() {
  try {
    await apiFetch('/api/portal/auth/logout', { method: 'POST', retryOn401: false });
  } finally {
    clearSession();
  }
}
