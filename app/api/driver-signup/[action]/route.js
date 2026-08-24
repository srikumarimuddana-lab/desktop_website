import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  isSpinrApiConfigured,
  toE164,
  sendDriverOtp,
  verifyDriverOtp,
  registerDriver,
  fetchServiceAreas,
  fetchVehicleTypes,
} from '@/lib/spinr-api'

/*
 * Driver signup — server-side proxy to the Spinr backend.
 *
 * Everything here exists so the browser never holds a driver's bearer token.
 * The page posts to these handlers, they call spinrvm server-to-server, and
 * the access token goes into an httpOnly cookie that client JavaScript cannot
 * read. Consequences worth knowing:
 *
 *  - No CORS entry is needed on the backend for signup. These are
 *    server-to-server calls with no Origin header, which also means the
 *    backend's CSRF middleware treats them as exempt (it only enforces for
 *    browser-originated requests). Our own CSRF protection is the SameSite
 *    cookie plus the fact that every state-changing call here is same-origin.
 *  - The refresh token is deliberately DISCARDED. A 30-day refresh credential
 *    on a marketing site is a liability with no matching benefit: the flow
 *    verifies the phone and registers within seconds, so a 15-minute access
 *    token is more than enough. Nothing here can silently extend a session.
 *
 * Rate limiting, and its honest limitation:
 *   send-otp is metered 6/minute PER CLIENT IP on the backend. Because we
 *   proxy, every website applicant arrives from the same Vercel egress IP and
 *   therefore shares one bucket. We do NOT forge CF-Connecting-IP to work
 *   around that — the backend treats that header as authoritative, and
 *   spoofing it from here would hand a bypass to anyone who could reach this
 *   route. Instead we meter per real client IP on this side, and rely on the
 *   backend's per-destination-phone cap (a 30s minimum interval plus an hourly
 *   ceiling) as the real abuse control, which is keyed on the phone number and
 *   so is unaffected by the shared IP. At driver-signup volumes the shared
 *   6/minute bucket is ample; if a campaign ever pushes past it, the fix is a
 *   trusted-caller mechanism on the backend, not a forged header here.
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SESSION_COOKIE = 'spinr_driver_session'

/** Ceiling on the session cookie regardless of what the backend reports, so a
 *  longer-lived token upstream cannot silently widen the window here. */
const MAX_SESSION_SECONDS = 20 * 60

// Per-IP metering on this side. In-process, so it resets on cold start and is
// per-instance rather than global — the same shape as the chat route's limiter
// above it. It exists to stop one visitor burning the shared upstream bucket,
// not to be an authoritative control.
const OTP_WINDOW_MS = 10 * 60 * 1000
const OTP_MAX_PER_WINDOW = 5
const otpHits = new Map()

function rateLimited(ip) {
  const now = Date.now()
  const entry = otpHits.get(ip)
  if (!entry || now - entry.start > OTP_WINDOW_MS) {
    otpHits.set(ip, { count: 1, start: now })
    return false
  }
  entry.count += 1
  return entry.count > OTP_MAX_PER_WINDOW
}

// Unbounded Maps are how a long-lived serverless instance leaks. Sweep on a
// timer rather than per request so a burst does not also pay for the sweep.
setInterval(() => {
  const now = Date.now()
  for (const [k, v] of otpHits) if (now - v.start > OTP_WINDOW_MS * 2) otpHits.delete(k)
}, OTP_WINDOW_MS).unref?.()

function clientIp(request) {
  const fwd = request.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}

function fail(code, message, status = 400) {
  return NextResponse.json({ ok: false, code, message }, { status })
}

/** Machine tokens like ERR_OTP_INVALID or AUTH_REQUIRED. The backend returns
 *  these as the `message` on some errors; they are for clients to branch on,
 *  never for an applicant to read. */
function looksLikeErrorCode(text) {
  return /^[A-Z][A-Z0-9_]*$/.test(text.trim())
}

/**
 * Pull a message an applicant can act on out of a backend error.
 *
 * There are two response shapes and they are not interchangeable:
 *   - FastAPI HTTPException  -> { detail: "A code was just sent — wait a moment" }
 *   - SpinrException         -> { success: false, error: { message, message_key,
 *                                 action_hint, code } }
 * The first carries prose written for users. The second's `message` is often a
 * token (ERR_OTP_INVALID) with the human sentence in `action_hint` instead, so
 * the hint is preferred and a token-shaped message is discarded in favour of
 * our own copy. Showing someone "ERR_OTP_INVALID" is not an error message.
 */
function backendMessage(result, fallback) {
  const data = result?.data
  const detail = data?.detail
  if (typeof detail === 'string' && detail.trim() && !looksLikeErrorCode(detail)) {
    return detail.slice(0, 300)
  }
  if (detail && typeof detail.message === 'string' && !looksLikeErrorCode(detail.message)) {
    return detail.message.slice(0, 300)
  }
  const err = data?.error
  if (err && typeof err.action_hint === 'string' && err.action_hint.trim()) {
    return err.action_hint.slice(0, 300)
  }
  if (err && typeof err.message === 'string' && err.message.trim() && !looksLikeErrorCode(err.message)) {
    return err.message.slice(0, 300)
  }
  return fallback
}

// ── handlers ────────────────────────────────────────────────────────────────

async function handleOtp(request) {
  const body = await request.json().catch(() => null)
  const phone = toE164(body?.phone)
  if (!phone) return fail('bad_phone', 'Enter a 10-digit Canadian mobile number.')

  if (rateLimited(clientIp(request))) {
    return fail('rate_limited', 'Too many code requests. Try again in a few minutes.', 429)
  }

  const result = await sendDriverOtp(phone)
  if (!result.ok) {
    if (result.status === 429) return fail('rate_limited', backendMessage(result, 'Too many code requests — please wait a moment.'), 429)
    if (result.status === 400 || result.status === 422) return fail('bad_phone', backendMessage(result, 'That number was not accepted.'))
    return fail('unavailable', 'We could not send a code just now. Please try again shortly.', 503)
  }
  return NextResponse.json({ ok: true })
}

async function handleVerify(request) {
  const body = await request.json().catch(() => null)
  const phone = toE164(body?.phone)
  const code = String(body?.code || '').trim()

  if (!phone) return fail('bad_phone', 'Enter a 10-digit Canadian mobile number.')
  if (!/^\d{4}$/.test(code)) return fail('bad_code', 'Enter the 4-digit code we sent you.')
  // The backend enforces this only when creating a brand-new account, but the
  // website must never submit a signup without the box actually ticked.
  if (!body?.consent_accepted) {
    return fail('consent_required', 'Please accept the Terms of Service and Privacy Policy to continue.')
  }

  const result = await verifyDriverOtp({ phone, code, consentAccepted: true })
  if (!result.ok) {
    if (result.status === 400) return fail('bad_code', backendMessage(result, 'That code is not right. Check it and try again.'))
    if (result.status === 429) return fail('rate_limited', backendMessage(result, 'Too many attempts. Try again later.'), 429)
    return fail('unavailable', 'We could not verify that code just now. Please try again shortly.', 503)
  }

  const token = result.data?.token
  if (!token) {
    // A 2xx with no token is a contract violation, not a user error — do not
    // pretend the code was wrong.
    console.error('[driver-signup] verify-otp returned 200 without a token')
    return fail('unavailable', 'Something went wrong on our side. Please try again.', 502)
  }

  const maxAge = Math.min(Number(result.data?.expires_in) || MAX_SESSION_SECONDS, MAX_SESSION_SECONDS)
  const jar = await cookies()
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/driver-signup',
    maxAge,
  })

  // Echo back only what the form needs to prefill — never the token, and never
  // the whole user object.
  const user = result.data?.user || {}
  return NextResponse.json({
    ok: true,
    is_new_user: Boolean(result.data?.is_new_user),
    already_driver: Boolean(user.is_driver),
    prefill: {
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
    },
  })
}

/** Fields /drivers/register accepts. Anything else the client sends is dropped
 *  here rather than forwarded — the backend has its own allowlist, but this
 *  route should not be a way to probe what it will take. */
const REGISTER_FIELDS = [
  'first_name',
  'last_name',
  'email',
  'gender',
  'city',
  'service_area_id',
  'vehicle_type_id',
  'vehicle_make',
  'vehicle_model',
  'vehicle_color',
  'vehicle_year',
  'license_plate',
  'vehicle_vin',
  'license_number',
  'license_expiry_date',
]

const REQUIRED_FIELDS = ['first_name', 'last_name', 'email', 'city', 'vehicle_make', 'vehicle_model', 'vehicle_year']

async function handleRegister(request) {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (!token) {
    // Either they never verified, or the short session lapsed. The form keeps
    // its own state, so the client can send them back to the code step and
    // resubmit without retyping anything.
    return fail('session_expired', 'Your verification expired. Please confirm your phone number again.', 401)
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') return fail('bad_request', 'Something went wrong. Please try again.')

  const payload = {}
  for (const key of REGISTER_FIELDS) {
    const value = body[key]
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      payload[key] = typeof value === 'string' ? value.trim() : value
    }
  }
  const missing = REQUIRED_FIELDS.filter((f) => !payload[f])
  if (missing.length) return fail('incomplete', 'Some required details are missing.', 400)

  const result = await registerDriver(token, payload)
  if (!result.ok) {
    if (result.status === 401) {
      jar.delete({ name: SESSION_COOKIE, path: '/api/driver-signup' })
      return fail('session_expired', 'Your verification expired. Please confirm your phone number again.', 401)
    }
    // 409: the phone already belongs to a different driver account. The
    // backend's message tells them to log in to that account instead — pass it
    // through rather than inventing one.
    if (result.status === 409) return fail('already_registered', backendMessage(result, 'A driver account already exists for this number.'), 409)
    return fail('unavailable', 'We could not submit your application just now. Please try again shortly.', 503)
  }

  // The application is in. Clear the session immediately — it has no further
  // use on this site, and leaving a live driver token in the browser after the
  // one action it was minted for would be careless.
  jar.delete({ name: SESSION_COOKIE, path: '/api/driver-signup' })

  return NextResponse.json({
    ok: true,
    status: result.data?.status || 'pending',
    driver_code: result.data?.driver_code || null,
  })
}

/** Service areas, and the vehicle types available in one. Public backend data,
 *  no session involved — the form needs it to offer real choices rather than a
 *  free-text city box. */
async function handleOptions(request) {
  const areaId = new URL(request.url).searchParams.get('service_area_id')
  const [areas, vehicleTypes] = await Promise.all([
    fetchServiceAreas(),
    areaId ? fetchVehicleTypes(areaId) : Promise.resolve(null),
  ])
  return NextResponse.json({
    ok: true,
    service_areas: (areas || []).map((a) => ({ id: a.id, name: a.name, city: a.city || a.name })),
    vehicle_types: (vehicleTypes || []).map((v) => ({ id: v.id, name: v.name })),
  })
}

// ── dispatch ────────────────────────────────────────────────────────────────

const POST_ACTIONS = { otp: handleOtp, verify: handleVerify, register: handleRegister }

export async function POST(request, { params }) {
  const { action } = await params
  const handler = POST_ACTIONS[action]
  if (!handler) return fail('not_found', 'Unknown action.', 404)
  if (!isSpinrApiConfigured()) {
    // Loud, because a misconfigured deploy silently swallowing applications is
    // far worse than a visible error.
    console.error('[driver-signup] SPINR_API_URL is not set — cannot take applications')
    return fail('unavailable', 'Applications are temporarily unavailable. Please use the Spinr driver app.', 503)
  }
  try {
    return await handler(request)
  } catch (e) {
    console.error(`[driver-signup] ${action} threw:`, e.message)
    return fail('unavailable', 'Something went wrong. Please try again.', 500)
  }
}

export async function GET(request, { params }) {
  const { action } = await params
  if (action !== 'options') return fail('not_found', 'Unknown action.', 404)
  try {
    return await handleOptions(request)
  } catch (e) {
    console.error('[driver-signup] options threw:', e.message)
    return NextResponse.json({ ok: true, service_areas: [], vehicle_types: [] })
  }
}
