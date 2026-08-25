/*
 * Read the mobile-app backend's FAQ set directly from its Supabase project.
 *
 * Why this rather than an HTTP call to spinrvm: there is no public FAQ
 * endpoint. The only /faqs route is backend/routes/admin/faqs.py, mounted at
 * /api/v1/admin/faqs behind get_admin_user + require_module("support"). Using
 * it would mean putting an admin credential in this marketing site's
 * environment, and admin JWTs are fully trusted by that backend (role, email
 * and modules are read straight from the claims) — far too much authority for
 * a public website, and the token expires hourly besides.
 *
 * The `faqs` table already carries an RLS policy, "Public read faqs", that
 * grants SELECT to everyone WHERE is_active = true, and no insert, update or
 * delete policy. So the project's anon key can read exactly the published
 * question set and nothing else, which is precisely the access this needs.
 * Verified against the live database: 55 active rows readable as `anon`, and
 * an attempted insert as `anon` was refused.
 *
 * Config (both from the backend's Supabase project, NOT this website's):
 *   BACKEND_SUPABASE_URL
 *   BACKEND_SUPABASE_ANON_KEY   <- the anon/publishable key, never the service key
 *
 * Returns null on any failure so the caller keeps its existing fallback chain.
 */

const BASE = (process.env.BACKEND_SUPABASE_URL || '').replace(/\/+$/, '')
const KEY = process.env.BACKEND_SUPABASE_ANON_KEY || ''
const TIMEOUT_MS = parseInt(process.env.BACKEND_SUPABASE_TIMEOUT_MS || '4000', 10)

export function isBackendFaqsConfigured() {
  return Boolean(BASE && KEY)
}

/* A service key here would hand a public website full write access to the
 * backend's database. It is a different shape from an anon key (role
 * "service_role" in the JWT payload), so it is worth catching rather than
 * trusting a deployment not to paste the wrong one. */
const KEY_LOOKS_LIKE_SERVICE_ROLE = (() => {
  try {
    const payload = JSON.parse(Buffer.from(KEY.split('.')[1], 'base64').toString())
    return payload?.role === 'service_role'
  } catch {
    return false
  }
})()

if (KEY_LOOKS_LIKE_SERVICE_ROLE) {
  console.error(
    '[backend-faqs] BACKEND_SUPABASE_ANON_KEY appears to be a service_role key. ' +
      'Refusing to use it — set the anon/publishable key instead.'
  )
}

/**
 * @param {{audience?: 'rider'|'driver', category?: string, limit?: number}} opts
 * @returns {Promise<Array<[string,string]>|null>} null = unavailable
 */
export async function fetchBackendFaqs({ audience, category, limit } = {}) {
  if (!isBackendFaqsConfigured() || KEY_LOOKS_LIKE_SERVICE_ROLE) return null

  const params = new URLSearchParams()
  params.set('select', 'question,answer,category,audience,sort_order')
  params.set('is_active', 'eq.true')
  // 'both' rows belong to either audience; a driver-only answer must never
  // reach a rider page, which is the whole reason for reading this table.
  if (audience === 'rider' || audience === 'driver') {
    params.set('audience', `in.(${audience},both)`)
  }
  if (category) params.set('category', `eq.${category}`)
  params.set('order', 'sort_order.asc,created_at.desc')
  if (typeof limit === 'number') params.set('limit', String(limit))

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(`${BASE}/rest/v1/faqs?${params}`, {
      signal: controller.signal,
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, Accept: 'application/json' },
      cache: 'no-store',
    })
    if (!res.ok) {
      console.error(`[backend-faqs] responded ${res.status}`)
      return null
    }
    const rows = await res.json()
    if (!Array.isArray(rows) || rows.length === 0) return null
    const pairs = rows
      .filter((r) => r && r.question && r.answer)
      .map((r) => [String(r.question), String(r.answer)])
    return pairs.length ? pairs : null
  } catch (e) {
    console.error(
      '[backend-faqs] failed:',
      e.name === 'AbortError' ? `timed out after ${TIMEOUT_MS}ms` : e.message
    )
    return null
  } finally {
    clearTimeout(timer)
  }
}
