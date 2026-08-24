/**
 * Client for the Spinr backend (the `spinrvm` repo).
 *
 * Why this exists: the FAQs and legal documents riders and drivers see in the
 * app are edited in the spinrvm admin dashboard, and until now the website
 * kept its own separate copies in its own Supabase project. The same question
 * could be answered one way in the app and another way here, and a policy
 * edited in spinrvm never reached this site at all.
 *
 * So spinrvm is now the source of truth, with the website CMS as the fallback
 * layer beneath it:
 *
 *     spinrvm API  ->  website Supabase (/spinr-internal)  ->  hardcoded draft
 *
 * That ordering is deliberate. The CMS readers in lib/preview-content.js and
 * the drafts in app/(site)/legal/content.js stay exactly as they are, and stay
 * wired up — a spinrvm outage, a slow response or an unset SPINR_API_URL must
 * degrade to the old behaviour, never to an empty help centre or a blank
 * legal page. Legal text in particular has to render.
 *
 * Server-side only, and increasingly load-bearing: the content readers below
 * hit public unauthenticated endpoints, but the driver-signup calls at the
 * bottom of this file carry a bearer token. Nothing here may be imported into
 * a client component. The token lives in an httpOnly cookie set by
 * app/api/driver-signup/, is passed in server-side, and never reaches client
 * JavaScript.
 *
 * Two error conventions live here on purpose, because the callers need
 * different things:
 *   - content readers return null on any failure, so a page has exactly one
 *     "fall back to the CMS" branch
 *   - signup calls return { ok, status, data }, because an applicant must be
 *     told whether the code was wrong or the number was rate limited
 */

/** Base URL of the Spinr backend, e.g. https://api-spinr.spinr.ca/api/v1 */
const RAW_BASE = process.env.SPINR_API_URL || ''

/**
 * Total budget for a backend call. Kept short on purpose: these run inside
 * server-rendered page requests, so a slow backend must cost the visitor a
 * fallback render, not a hanging page.
 */
const TIMEOUT_MS = parseInt(process.env.SPINR_API_TIMEOUT_MS || '4000', 10)

/**
 * Budget for a signup write (send-otp, verify-otp, drivers/register).
 *
 * Deliberately much larger than the read budget above, and NOT the same knob.
 * A content read is a single indexed select and 4s is generous; a write is
 * not. verify-otp hashes and checks the code, may create a user row, issues
 * and stores an access + refresh token pair, and queues a Meta event.
 * drivers/register does a collision lookup, encrypts PII, inserts, and
 * updates the users row. On a cold instance those do not reliably finish in
 * 4s, and timing them out would fail an application that was about to
 * succeed — or worse, that already had.
 */
const WRITE_TIMEOUT_MS = parseInt(process.env.SPINR_WRITE_TIMEOUT_MS || '15000', 10)

export function isSpinrApiConfigured() {
  return Boolean(RAW_BASE)
}

function buildUrl(path, params) {
  const base = RAW_BASE.replace(/\/+$/, '')
  const url = new URL(`${base}${path}`)
  for (const [k, v] of Object.entries(params || {})) {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v))
  }
  return url.toString()
}

/**
 * GET a public backend endpoint. Returns null on ANY failure — unset base URL,
 * timeout, non-2xx, malformed JSON — so every caller has exactly one
 * "fall back to the CMS" branch to write rather than a matrix of error cases.
 *
 * Failures are logged, not swallowed silently: a website serving stale content
 * because the backend is unreachable is a thing someone needs to be able to
 * see in the Vercel logs.
 */
async function getJson(path, params) {
  if (!isSpinrApiConfigured()) return null

  const url = buildUrl(path, params)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
      // Content is edited in the spinrvm admin dashboard and must appear here
      // without a deploy — the same no-store rule the CMS readers follow.
      cache: 'no-store',
    })
    if (!res.ok) {
      console.error(`[spinr-api] ${path} responded ${res.status}`)
      return null
    }
    return await res.json()
  } catch (e) {
    // AbortError is the timeout above; anything else is DNS/TLS/network.
    console.error(`[spinr-api] ${path} failed:`, e.name === 'AbortError' ? `timed out after ${TIMEOUT_MS}ms` : e.message)
    return null
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Active FAQs from the backend, as the [question, answer] pairs the site's
 * components already take.
 *
 * `audience` maps onto the backend's own rider/driver/both tagging: asking for
 * "rider" returns rider-tagged plus both-tagged rows, never driver-only ones.
 * That tagging is the reason to prefer this over the website's flat table —
 * driver-only policy no longer has to be manually kept off rider pages.
 *
 * Ordering is the backend's (sort_order, then newest first); `limit` trims
 * after that, so the admin's ordering decides what a shortened list shows.
 *
 * @param {{audience?: 'rider'|'driver', category?: string, limit?: number}} opts
 * @returns {Promise<Array<[string,string]>|null>} null = unavailable, use fallback
 */
export async function fetchFaqs({ audience, category, limit } = {}) {
  const rows = await getJson('/faqs', { audience, category })
  if (!Array.isArray(rows) || rows.length === 0) return null
  const pairs = rows
    .filter((r) => r && r.question && r.answer)
    .map((r) => [String(r.question), String(r.answer)])
  if (pairs.length === 0) return null
  return typeof limit === 'number' ? pairs.slice(0, limit) : pairs
}

/**
 * Legal document types the backend serves. 'tos' and 'privacy' fall back to a
 * legacy single-blob setting on the backend side when no per-audience row is
 * published; the rest return empty content until an admin publishes one, which
 * this client reports as null so the caller keeps its own copy.
 */
export const LEGAL_DOC_TYPES = [
  'tos',
  'privacy',
  'community-guidelines',
  'non-discrimination',
  'accessibility',
  'cancellation-fees',
  'promotions-referral',
  'insurance-periods',
  'deactivation-appeals',
  'background-check-consent',
]

/**
 * One legal document for an (audience, type) pair.
 *
 * Returns null when the document exists but is unpublished — the backend
 * answers those with `content: ""` and `version: 0` rather than a 404, and an
 * empty legal page is worse than a slightly older one, so empty is treated as
 * "not available" and the caller falls back.
 *
 * @param {{audience?: 'rider'|'driver', type: string}} opts
 * @returns {Promise<{content: string, version: number, updatedAt: string|null}|null>}
 */
export async function fetchLegalDocument({ audience = 'rider', type }) {
  if (!LEGAL_DOC_TYPES.includes(type)) return null
  const doc = await getJson('/legal-documents', { audience, type })
  const content = (doc?.content || '').trim()
  if (!content) return null
  return {
    content,
    version: doc.version || 0,
    updatedAt: doc.updated_at || null,
  }
}

/**
 * Ask the backend's public assistant (POST /ai/public-chat).
 *
 * This is the same provider, model and FAQ corpus the in-app assistant uses —
 * chosen in the spinrvm admin dashboard — rather than this site's own
 * retrieval stack. It is anonymous and stateless on the backend: nothing is
 * persisted for a website visitor, so the transcript is replayed on each turn.
 *
 * Returns null on any failure so the caller can fall back to the local RAG
 * pipeline. A 503 here is the ordinary case, not an exception: the backend
 * ships the surface dark behind `ai_public_chat_enabled`, so until an admin
 * enables it every call comes back 503 and the site keeps answering the way
 * it always did.
 *
 * @param {{message: string, history?: Array<{role: string, content: string}>,
 *          visitorType?: 'rider'|'driver', timeoutMs?: number}} opts
 */
export async function askSpinrAssistant({ message, history, visitorType, timeoutMs } = {}) {
  if (!isSpinrApiConfigured() || !message) return null

  // An LLM turn is slower than a content read, so this gets its own budget
  // rather than the 4s one above — but still bounded, because the visitor is
  // waiting on it.
  const budget = timeoutMs || parseInt(process.env.SPINR_AI_TIMEOUT_MS || '20000', 10)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), budget)
  try {
    const res = await fetch(buildUrl('/ai/public-chat'), {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({
        message,
        // The backend caps and re-validates this; trimming here just avoids
        // shipping a long transcript it would only discard.
        history: (history || []).slice(-8).map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: String(m.content || '').slice(0, 2000),
        })),
        visitor_type: visitorType === 'driver' ? 'driver' : 'rider',
      }),
    })
    if (!res.ok) {
      // 503 = the surface is switched off backend-side. Expected while dark,
      // so it is logged at a lower volume than a real failure.
      if (res.status === 503) console.info('[spinr-api] public assistant is disabled backend-side')
      else console.error(`[spinr-api] public assistant responded ${res.status}`)
      return null
    }
    const data = await res.json()
    const reply = (data?.reply || '').trim()
    return reply ? { reply, provider: data.provider || null, model: data.model || null } : null
  } catch (e) {
    console.error(
      '[spinr-api] public assistant failed:',
      e.name === 'AbortError' ? `timed out after ${budget}ms` : e.message
    )
    return null
  } finally {
    clearTimeout(timer)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Driver signup
//
// These differ from every reader above in one important way: they must NOT
// collapse failures to null. A wrong OTP, a rate limit, a phone already
// registered to another driver — the applicant has to be told which, so these
// return { ok, status, data } and let the caller map it to a message.
//
// They are also the only calls here that carry a credential, so they are
// reached exclusively from Next.js route handlers (app/api/driver-signup/).
// The bearer token lives in an httpOnly cookie and is passed in server-side;
// it never reaches client JavaScript.
// ─────────────────────────────────────────────────────────────────────────────

/** POST with a bounded timeout. Never throws — network faults come back as
 *  { ok: false, status: 0 } so a caller has one shape to handle. */
async function postJson(path, body, { token, timeoutMs } = {}) {
  if (!isSpinrApiConfigured()) return { ok: false, status: 0, data: null, reason: 'unconfigured' }

  const budget = timeoutMs || WRITE_TIMEOUT_MS
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), budget)
  try {
    const headers = { 'Content-Type': 'application/json', Accept: 'application/json' }
    if (token) headers.Authorization = `Bearer ${token}`
    const res = await fetch(buildUrl(path), {
      method: 'POST',
      signal: controller.signal,
      headers,
      cache: 'no-store',
      body: JSON.stringify(body),
    })
    let data = null
    try {
      data = await res.json()
    } catch {
      // A 502/504 from an edge proxy is HTML, not JSON. Not worth logging as a
      // parse failure — the status is what the caller acts on.
    }
    if (!res.ok) console.error(`[spinr-api] ${path} responded ${res.status}`)
    // The backend sets Retry-After on its OTP send-cap 429s. Passing it up
    // lets the UI count down accurately instead of guessing at 30s.
    const retryAfter = parseInt(res.headers.get('retry-after') || '', 10)
    return { ok: res.ok, status: res.status, data, retryAfter: Number.isFinite(retryAfter) ? retryAfter : null }
  } catch (e) {
    console.error(
      `[spinr-api] ${path} failed:`,
      e.name === 'AbortError' ? `timed out after ${budget}ms` : e.message
    )
    return { ok: false, status: 0, data: null, reason: e.name === 'AbortError' ? 'timeout' : 'network' }
  } finally {
    clearTimeout(timer)
  }
}

/** Digits -> the E.164 the backend's schema requires (^\+1\d{10}$), or null.
 *  Validated here as well as on the backend so an obvious typo costs a round
 *  trip rather than an SMS: send-otp is metered per destination number. */
export function toE164(input) {
  const digits = String(input || '').replace(/\D/g, '')
  const ten = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits
  return ten.length === 10 ? `+1${ten}` : null
}

/** Send the signup OTP. `phone` must already be E.164. */
export function sendDriverOtp(phone) {
  return postJson('/auth/send-otp', { phone })
}

/**
 * Verify the OTP and get a session.
 *
 * client_app: 'driver' matters — both apps authenticate through this one
 * endpoint, and without the hint every signup is reported to Meta as a rider
 * acquisition. It affects conversion reporting only, never the role assigned.
 *
 * consent_accepted carries the applicant's ToS/Privacy checkbox. The backend
 * enforces it only on the branch that creates a brand-new account; a returning
 * driver's consent was captured at their original signup.
 */
export function verifyDriverOtp({ phone, code, consentAccepted }) {
  return postJson('/auth/verify-otp', {
    phone,
    code,
    client_app: 'driver',
    consent_accepted: Boolean(consentAccepted),
  })
}

/**
 * Create (or update) the driver record for the verified user.
 *
 * The backend sets status 'pending' and is_verified false, and flips
 * users.role to 'driver'. It is an upsert, so an applicant who resubmits
 * updates their row rather than colliding with it.
 */
export function registerDriver(token, payload) {
  return postJson('/drivers/register', payload, { token })
}

/** Active top-level service areas (airport zones excluded backend-side). */
export async function fetchServiceAreas() {
  const rows = await getJson('/service-areas')
  return Array.isArray(rows) ? rows.filter((r) => r && r.id && r.name) : null
}

/** Vehicle types, narrowed to those with pricing configured for an area.
 *  Without the filter an applicant can pick a type that has no fare set up
 *  for where they drive, which fails later at ride creation. */
export async function fetchVehicleTypes(serviceAreaId) {
  const rows = await getJson('/vehicle-types', { service_area_id: serviceAreaId })
  return Array.isArray(rows) ? rows.filter((r) => r && r.id && r.name) : null
}
