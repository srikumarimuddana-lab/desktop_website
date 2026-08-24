/**
 * Read-only client for the Spinr backend (the `spinrvm` repo).
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
 * Server-side only. These calls carry no credentials (every endpoint used here
 * is public and unauthenticated on the backend), but they should not be made
 * from the browser: the responses are cached per-request by the page, and
 * exposing the backend origin to client JS buys nothing.
 */

/** Base URL of the Spinr backend, e.g. https://api-spinr.spinr.ca/api/v1 */
const RAW_BASE = process.env.SPINR_API_URL || ''

/**
 * Total budget for a backend call. Kept short on purpose: these run inside
 * server-rendered page requests, so a slow backend must cost the visitor a
 * fallback render, not a hanging page.
 */
const TIMEOUT_MS = parseInt(process.env.SPINR_API_TIMEOUT_MS || '4000', 10)

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
