// Twilio SMS helper — graceful no-op when env vars are not configured.
//
// Required env vars (set in Vercel + .env.local):
//   TWILIO_ACCOUNT_SID
//   TWILIO_AUTH_TOKEN
//   one of:
//     TWILIO_FROM_NUMBER          (e.g. +13065550123)
//     TWILIO_MESSAGING_SERVICE_SID (e.g. MGxxxxxxxx)

export function isTwilioConfigured() {
  const hasCreds = !!process.env.TWILIO_ACCOUNT_SID && !!process.env.TWILIO_AUTH_TOKEN
  const hasSender =
    !!process.env.TWILIO_FROM_NUMBER || !!process.env.TWILIO_MESSAGING_SERVICE_SID
  return hasCreds && hasSender
}

// Normalize a phone number to E.164. Defaults to +1 (Canada/US) if missing.
export function toE164(phone) {
  if (!phone) return null
  const trimmed = String(phone).trim()
  if (/^\+\d{8,15}$/.test(trimmed)) return trimmed
  const digits = trimmed.replace(/\D/g, '')
  if (!digits) return null
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return null
}

// Low-level sender — POSTs to Twilio's REST API using fetch (no dep).
async function sendOne({ to, body }) {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_FROM_NUMBER
  const serviceSid = process.env.TWILIO_MESSAGING_SERVICE_SID

  const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`
  const params = new URLSearchParams()
  params.set('To', to)
  params.set('Body', body)
  if (serviceSid) {
    params.set('MessagingServiceSid', serviceSid)
  } else if (from) {
    params.set('From', from)
  }

  const auth = Buffer.from(`${sid}:${token}`).toString('base64')
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = data?.message || `Twilio error (status ${res.status})`
    throw new Error(msg)
  }
  return { sid: data.sid, status: data.status || 'queued' }
}

// Public API. Returns { ok, status, error }.
export async function sendSms({ to, body }) {
  if (!isTwilioConfigured()) {
    return { ok: false, status: 'skipped', error: 'Twilio not configured' }
  }
  const normalized = toE164(to)
  if (!normalized) {
    return { ok: false, status: 'failed', error: 'Invalid phone number' }
  }
  if (!body || typeof body !== 'string') {
    return { ok: false, status: 'failed', error: 'Empty SMS body' }
  }
  try {
    const result = await sendOne({ to: normalized, body })
    return { ok: true, status: result.status, error: null }
  } catch (err) {
    return { ok: false, status: 'failed', error: err.message || 'send failed' }
  }
}
