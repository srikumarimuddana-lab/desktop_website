/**
 * End-to-end edge-case suite for the Spinr backend integration.
 *
 * Covers driver signup (the bulk of it) plus the content fallbacks the FAQ
 * and legal pages depend on.
 *
 * This repo has no JS test runner, and adding one is a bigger decision than
 * this feature should make on its own. But "we handle the error cases" is not
 * a claim anyone should have to take on trust, so this script exists: it
 * stands up a stub that can be told to misbehave in each specific way the real
 * backend can, drives the site's own routes over real HTTP, and asserts what
 * an applicant would actually see.
 *
 * Run it against a production build:
 *
 *   npm run build
 *   SPINR_API_URL=http://127.0.0.1:9911 npx next start -p 3111 &
 *   node scripts/verify-spinr-integration.mjs
 *
 * The stub listens on 9911 and is switched between scenarios by POSTing to
 * its /__control endpoint, so each case exercises the real proxy code path
 * rather than a mock of it.
 */

import http from 'node:http'

const STUB_PORT = 9911
const SITE = process.env.VERIFY_SITE_URL || 'http://127.0.0.1:3111'
const GOOD_CODE = '4321'

// ── the stub ────────────────────────────────────────────────────────────────

let scenario = 'happy'

/** The backend's SpinrException wire shape: a machine token in `message`, the
 *  human sentence in `action_hint`. */
const spinrError = (code, message, hint) => ({
  success: false,
  error: { code, message, message_key: `errors.${code.toLowerCase()}`, action_hint: hint, timestamp: '2026-08-24T00:00:00Z' },
})

const authOk = (phone, { isDriver = false, prefill = {} } = {}) => ({
  token: 'stub-access-token',
  refresh_token: 'stub-refresh-token-must-be-discarded',
  user: { id: 'u1', phone, is_driver: isDriver, ...prefill },
  is_new_user: true,
  expires_in: 900,
  csrf_token: 'stub-csrf',
})

const stub = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x')
  const send = (code, body, headers = {}) => {
    res.writeHead(code, { 'Content-Type': 'application/json', ...headers })
    res.end(typeof body === 'string' ? body : JSON.stringify(body))
  }
  const read = (fn) => {
    let raw = ''
    req.on('data', (c) => (raw += c))
    req.on('end', () => fn(JSON.parse(raw || '{}')))
  }

  if (url.pathname === '/__control' && req.method === 'POST') {
    return read((b) => {
      scenario = b.scenario || 'happy'
      send(200, { scenario })
    })
  }

  if (url.pathname === '/faqs') {
    if (scenario === 'faqs_500') return send(500, { detail: 'boom' })
    if (scenario === 'faqs_empty') return send(200, [])
    if (scenario === 'faqs_garbage') return send(200, { not: 'an array' })
    return send(200, [{ id: '1', question: 'Backend FAQ question?', answer: 'Backend FAQ answer.', audience: 'both', sort_order: 0 }])
  }

  if (url.pathname === '/legal-documents') {
    if (scenario === 'legal_500') return send(500, { detail: 'boom' })
    // Published upstream but with no readable body — only a title and a date.
    if (scenario === 'legal_hollow') {
      return send(200, { audience: 'rider', type: 'tos', content: 'SPINR TERMS OF SERVICE\n\nLast updated: August 21, 2026\n', version: 4, updated_at: null })
    }
    if (scenario === 'legal_unpublished') return send(200, { audience: 'rider', type: 'tos', content: '', version: 0, updated_at: null })
    return send(200, {
      audience: 'rider',
      type: 'tos',
      content: 'SPINR TERMS OF SERVICE\n\nLast updated: August 21, 2026\n\nThis is the intro paragraph that\nwraps across two lines.\n\nFIRST SECTION\n\nBody of the first section.\n\n- bullet one\n- bullet two\n',
      version: 4,
      updated_at: '2026-08-21T00:00:00Z',
    })
  }

  if (url.pathname === '/service-areas') {
    if (scenario === 'no_areas') return send(200, [])
    return send(200, [{ id: 'area-1', name: 'Saskatoon', city: 'Saskatoon', is_active: true }])
  }

  if (url.pathname === '/vehicle-types') {
    if (scenario === 'types_500') return send(500, { detail: 'boom' })
    return send(200, [{ id: 'vt-1', name: 'Standard', is_active: true }])
  }

  if (url.pathname === '/auth/send-otp' && req.method === 'POST') {
    return read((b) => {
      if (!/^\+1\d{10}$/.test(b.phone || '')) return send(422, { detail: 'Invalid phone number' })
      if (scenario === 'otp_capped') {
        return send(429, { detail: 'A code was just sent — please wait a moment before requesting another' }, { 'Retry-After': '30' })
      }
      if (scenario === 'otp_redis_down') return send(503, { detail: 'Auth service temporarily unavailable, please try again' })
      if (scenario === 'hang') return // never respond — exercises the write timeout
      send(200, { message: 'OTP sent' })
    })
  }

  if (url.pathname === '/auth/verify-otp' && req.method === 'POST') {
    return read((b) => {
      if (scenario === 'bad_code' || b.code !== GOOD_CODE) {
        return send(400, spinrError('AUTH_OTP_INVALID', 'ERR_OTP_INVALID', 'Re-enter the 4-digit code'))
      }
      if (scenario === 'suspended') {
        return send(403, spinrError('AUTH_ACCOUNT_SUSPENDED', 'ERR_ACCOUNT_SUSPENDED', 'Contact support to restore your account'))
      }
      if (scenario === 'locked_out') {
        return send(429, spinrError('AUTH_OTP_LOCKED', 'ERR_OTP_LOCKED', 'Too many attempts — try again in 24 hours'))
      }
      if (scenario === 'no_token') return send(200, { user: {}, is_new_user: true })
      if (scenario === 'already_driver') return send(200, authOk(b.phone, { isDriver: true }))
      if (scenario === 'prefill') {
        return send(200, authOk(b.phone, { prefill: { first_name: 'Prior', last_name: 'Account', email: 'prior@example.ca' } }))
      }
      send(200, authOk(b.phone))
    })
  }

  if (url.pathname === '/drivers/register' && req.method === 'POST') {
    return read((b) => {
      if (!req.headers.authorization) return send(401, { detail: 'Not authenticated' })
      if (scenario === 'register_conflict') {
        return send(409, { detail: 'A driver account with this phone already exists. Log in to that account instead.' })
      }
      if (scenario === 'register_partial') {
        return send(503, { detail: 'Driver registration partially failed. Please try again.' })
      }
      if (scenario === 'register_hang') return // never respond — ambiguous write
      if (scenario === 'register_html') return send(502, '<html>bad gateway</html>')
      lastRegisterBody = b
      send(200, { id: 'd1', driver_code: 'SPNR-4417', status: 'pending', is_verified: false })
    })
  }

  send(404, { detail: 'not found' })
})

let lastRegisterBody = null

// ── harness ─────────────────────────────────────────────────────────────────

let passed = 0
const failures = []

function check(name, condition, detail) {
  if (condition) {
    passed++
    console.log(`  \x1b[32m✓\x1b[0m ${name}`)
  } else {
    failures.push(name)
    console.log(`  \x1b[31m✗\x1b[0m ${name}${detail ? `\n      ${detail}` : ''}`)
  }
}

async function setScenario(name) {
  await fetch(`http://127.0.0.1:${STUB_PORT}/__control`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario: name }),
  })
}

async function call(action, body, cookie) {
  const headers = { 'Content-Type': 'application/json' }
  if (cookie) headers.Cookie = cookie
  const res = await fetch(`${SITE}/api/driver-signup/${action}`, {
    method: 'POST',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
  const setCookie = res.headers.get('set-cookie')
  let data = null
  try {
    data = await res.json()
  } catch {
    /* non-JSON is itself a finding */
  }
  return { status: res.status, data, setCookie, raw: res }
}

const sessionFrom = (setCookie) => (setCookie ? setCookie.split(';')[0] : null)

const VALID_FORM = {
  first_name: 'Jordan',
  last_name: 'Lee',
  email: 'jordan@example.ca',
  city: 'Saskatoon',
  service_area_id: 'area-1',
  vehicle_make: 'Toyota',
  vehicle_model: 'Corolla',
  vehicle_year: '2019',
  license_plate: 'ABC123',
  license_number: 'SK123456',
  license_expiry_date: '2029-05-01',
}

async function verifyAndGetSession(phone = '3065550142') {
  const r = await call('verify', { phone, code: GOOD_CODE, consent_accepted: true })
  return sessionFrom(r.setCookie)
}

// ── the cases ───────────────────────────────────────────────────────────────

async function run() {
  console.log('\nInput validation')
  await setScenario('happy')
  {
    const r = await call('otp', { phone: '123' })
    check('short phone rejected before any SMS is requested', r.data?.code === 'bad_phone')
  }
  {
    const r = await call('otp', { phone: '(306) 555-0142' })
    check('loose phone formatting is normalised and accepted', r.data?.ok === true)
  }
  {
    const r = await call('otp', 'not json at all')
    check('malformed JSON body is refused, not parsed', r.data?.code === 'bad_request')
  }
  {
    const r = await call('otp', { phone: 'x'.repeat(20000) })
    check('oversized body is refused', r.data?.ok === false, JSON.stringify(r.data))
  }
  {
    const r = await call('verify', { phone: '3065550142', code: GOOD_CODE, consent_accepted: false })
    check('unticked consent is refused website-side', r.data?.code === 'consent_required')
  }
  {
    const r = await call('verify', { phone: '3065550142', code: 'abcd', consent_accepted: true })
    check('non-numeric code is refused before reaching the backend', r.data?.code === 'bad_code')
  }

  console.log('\nBackend error shapes')
  {
    const r = await call('verify', { phone: '3065550142', code: '0000', consent_accepted: true })
    check(
      'SpinrException token is never shown; action_hint is used instead',
      r.data?.message === 'Re-enter the 4-digit code',
      `got: ${JSON.stringify(r.data?.message)}`
    )
  }
  await setScenario('otp_capped')
  {
    const r = await call('otp', { phone: '3065550142' })
    check('send-cap 429 passes the backend prose through', /just sent/.test(r.data?.message || ''))
    check('send-cap 429 passes Retry-After through', r.data?.retry_after === 30, `got: ${r.data?.retry_after}`)
  }
  await setScenario('locked_out')
  {
    const r = await call('verify', { phone: '3065550142', code: GOOD_CODE, consent_accepted: true })
    check('verify lockout surfaces the 24-hour hint', /24 hours/.test(r.data?.message || ''))
  }
  await setScenario('suspended')
  {
    const r = await call('verify', { phone: '3065550142', code: GOOD_CODE, consent_accepted: true })
    check('suspended account is a blocked dead end, not a retry', r.data?.code === 'blocked')
  }
  await setScenario('otp_redis_down')
  {
    const r = await call('otp', { phone: '3065550142' })
    check("backend's own 503 wording is preferred over ours", /temporarily unavailable/.test(r.data?.message || ''))
  }
  await setScenario('no_token')
  {
    const r = await call('verify', { phone: '3065550142', code: GOOD_CODE, consent_accepted: true })
    check('a 200 with no token is treated as a fault, not a login', r.data?.ok === false && r.status === 502)
    check('no session cookie is set when the token is missing', !r.setCookie)
  }

  console.log('\nSession handling')
  await setScenario('happy')
  {
    const r = await call('verify', { phone: '3065550142', code: GOOD_CODE, consent_accepted: true })
    const c = r.setCookie || ''
    check('session cookie is HttpOnly', /HttpOnly/i.test(c))
    check('session cookie is SameSite=lax', /SameSite=lax/i.test(c))
    check('session cookie is scoped to the proxy path', /Path=\/api\/driver-signup/i.test(c))
    check('refresh token is never placed in a cookie', !/stub-refresh-token/.test(c))
    check('access token is not echoed in the JSON body', !JSON.stringify(r.data).includes('stub-access-token'))
  }
  {
    const r = await call('register', VALID_FORM)
    check('register without a session is refused', r.data?.code === 'session_expired' && r.status === 401)
  }
  {
    const session = await verifyAndGetSession()
    const ok = await call('register', VALID_FORM, session)
    check('happy path submits and returns pending', ok.data?.ok === true && ok.data?.status === 'pending')
    // What is actually guaranteed is that the browser is TOLD to drop it. The
    // token itself is a stateless JWT the backend keeps honouring until it
    // expires, so asserting that a replayed raw cookie is rejected would be
    // asserting something the design does not provide. Check the real thing.
    check(
      'a cookie-clearing header is issued on success',
      /spinr_driver_session=;|spinr_driver_session=deleted|Max-Age=0|Expires=Thu, 01 Jan 1970/i.test(ok.setCookie || ''),
      `set-cookie: ${ok.setCookie}`
    )
    check('the clearing header is scoped to the same path', /Path=\/api\/driver-signup/i.test(ok.setCookie || ''))
  }

  console.log('\nPayload hygiene')
  {
    const session = await verifyAndGetSession()
    await call('register', { ...VALID_FORM, evil_extra: 'x', is_verified: true, status: 'approved' }, session)
    const keys = Object.keys(lastRegisterBody || {})
    check('unknown fields are dropped, not forwarded', !keys.includes('evil_extra'))
    check('privileged fields cannot be injected', !keys.includes('is_verified') && !keys.includes('status'))
  }
  {
    const session = await verifyAndGetSession()
    const r = await call('register', { ...VALID_FORM, vehicle_year: '2099' }, session)
    check('impossible vehicle year is rejected server-side', r.data?.code === 'bad_year')
  }
  {
    const session = await verifyAndGetSession()
    const r = await call('register', { ...VALID_FORM, vehicle_year: 'abcd' }, session)
    check('non-numeric vehicle year is rejected server-side', r.data?.code === 'bad_year')
  }
  {
    const session = await verifyAndGetSession()
    const r = await call('register', { first_name: 'A' }, session)
    check('incomplete payload is refused', r.data?.code === 'incomplete')
  }
  {
    const session = await verifyAndGetSession()
    await call('register', { ...VALID_FORM, vehicle_color: 'z'.repeat(5000) }, session)
    check('over-long field is truncated before forwarding', (lastRegisterBody?.vehicle_color || '').length <= 120)
  }

  console.log('\nTerminal and ambiguous outcomes')
  await setScenario('already_driver')
  {
    const r = await call('verify', { phone: '3065550142', code: GOOD_CODE, consent_accepted: true })
    check('an existing driver account is signalled to the client', r.data?.already_driver === true)
  }
  await setScenario('prefill')
  {
    const r = await call('verify', { phone: '3065550142', code: GOOD_CODE, consent_accepted: true })
    check('prior account details come back as prefill', r.data?.prefill?.email === 'prior@example.ca')
  }
  await setScenario('register_conflict')
  {
    const session = await verifyAndGetSession()
    const r = await call('register', VALID_FORM, session)
    check('phone belonging to another driver is a dead end', r.data?.code === 'already_registered')
    check('conflict passes the backend instruction through', /Log in to that account/.test(r.data?.message || ''))
  }
  await setScenario('register_partial')
  {
    const session = await verifyAndGetSession()
    const r = await call('register', VALID_FORM, session)
    check('partial-failure message is surfaced, not replaced', /partially failed/.test(r.data?.message || ''))
  }
  await setScenario('register_html')
  {
    const session = await verifyAndGetSession()
    const r = await call('register', VALID_FORM, session)
    check('non-JSON gateway error still yields a clean JSON error', r.data?.ok === false && r.status >= 500)
  }

  console.log('\nTimeouts (each waits out the real write budget)')
  await setScenario('register_hang')
  {
    const session = await verifyAndGetSession()
    const started = Date.now()
    const r = await call('register', VALID_FORM, session)
    const elapsed = Date.now() - started
    check('a hung write is reported as uncertain, not failed', r.data?.code === 'submit_uncertain', JSON.stringify(r.data))
    check('uncertain message tells them how to check', /driver app/i.test(r.data?.message || ''))
    check(`write timeout fires within its budget (took ${(elapsed / 1000).toFixed(1)}s)`, elapsed < 20000)
  }
  await setScenario('hang')
  {
    const r = await call('otp', { phone: '3065550143' })
    check('a hung send-otp degrades to a retryable message', r.data?.code === 'unavailable')
    check('timeout wording differs from a flat failure', /too long/i.test(r.data?.message || ''), r.data?.message)
  }

  console.log('\nContent fallbacks')
  const page = async (path) => {
    const res = await fetch(`${SITE}${path}`)
    return { status: res.status, html: await res.text() }
  }
  await setScenario('happy')
  {
    const { html } = await page('/legal/terms')
    check('backend legal text renders with its sections', /data-sec="first-section"/.test(html))
    check('hard-wrapped lines are rejoined', /wraps across two lines/.test(html))
    check('bullets survive as list items', (html.match(/•/g) || []).length >= 2)
    check('a published document carries no DRAFT stamp', !/pending legal review/.test(html))
  }
  await setScenario('legal_hollow')
  {
    const { html } = await page('/legal/terms')
    check('a document that parses to nothing falls back instead of blanking', /pending legal review/.test(html))
    check('the fallback still renders real terms', html.length > 5000)
  }
  await setScenario('legal_unpublished')
  {
    const { html } = await page('/legal/terms')
    check('an unpublished document falls back', /pending legal review/.test(html))
  }
  await setScenario('legal_500')
  {
    const { status, html } = await page('/legal/terms')
    check('a 500 from the backend still renders the page', status === 200 && html.length > 5000)
  }
  await setScenario('happy')
  {
    const { html } = await page('/help')
    check('backend FAQs reach the help centre', /Backend FAQ question\?/.test(html))
  }
  await setScenario('faqs_garbage')
  {
    const { status, html } = await page('/help')
    check('a non-array FAQ payload falls back rather than throwing', status === 200 && html.length > 5000)
  }
  await setScenario('faqs_500')
  {
    const { status, html } = await page('/help')
    check('a 500 on FAQs falls back to the local list', status === 200 && /Spinr Pass/.test(html))
  }

  console.log('\nUnknown routes')
  {
    const r = await call('nonsense', {})
    check('unknown action is a 404, not a crash', r.status === 404)
  }
  {
    const res = await fetch(`${SITE}/api/driver-signup/register`)
    check('GET on a POST-only action is a 404', res.status === 404)
  }

  console.log(`\n${passed} passed, ${failures.length} failed`)
  if (failures.length) {
    console.log('\nFailures:')
    failures.forEach((f) => console.log(`  - ${f}`))
  }
  return failures.length === 0
}

stub.listen(STUB_PORT, async () => {
  console.log(`stub on :${STUB_PORT}, driving ${SITE}`)
  let ok = false
  try {
    ok = await run()
  } catch (e) {
    console.error('\nsuite threw:', e)
  } finally {
    stub.close()
  }
  process.exit(ok ? 0 : 1)
})
