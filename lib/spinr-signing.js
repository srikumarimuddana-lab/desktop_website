/**
 * Signs this site's server-to-server calls to the Spinr backend.
 *
 * The backend enforces Firebase App Check on /api/*, which only a registered
 * mobile build can satisfy. This site calls the backend from its own server
 * (never from the visitor's browser), so without a way to identify itself
 * every call 401s. The backend's counterpart is spinrvm
 * backend/core/web_caller.py: a valid signature lets an allow-listed route
 * past App Check, and the visitor IP inside it becomes the backend's
 * rate-limit key — otherwise every visitor shares Vercel's egress IP.
 *
 *   canonical = "v1\n{ts}\n{METHOD}\n{path}\n{query}\n{sha256hex(body)}\n{clientIp}"
 *   X-Spinr-Web-Signature = "v1=" + hex(HMAC-SHA256(secret, canonical))
 *
 * The format must match web_caller.py byte for byte. Both sides pin the same
 * golden vector (scripts/verify-web-signing.mjs and
 * backend/tests/test_web_caller_signature.py) — change one, change both.
 *
 * Pure and dependency-free so a plain `node` script can import it. It holds
 * no secret itself; lib/spinr-api.js passes one in. Never import this into a
 * client component: a secret that reaches the browser is a public secret.
 */
import { createHash, createHmac } from 'node:crypto'

export const MIN_SECRET_LEN = 32
const MAX_CLIENT_IP_LEN = 64

export function canonicalString({ ts, method, path, query, body, clientIp }) {
  const bodyHash = createHash('sha256').update(body || '').digest('hex')
  return ['v1', String(ts), method.toUpperCase(), path, query, bodyHash, clientIp].join('\n')
}

/**
 * Headers to attach to a backend request, or {} when there is no usable
 * secret — the request then goes out unsigned, exactly as before signing
 * existed, and the backend treats it as any other caller.
 *
 * `url` is the full URL the request goes to; the signed path and query are
 * taken from it so they cannot drift from what is actually sent. `body` must
 * be the exact string sent, not the object it came from.
 */
export function signingHeaders({ secret, method, url, body = '', clientIp = '', now = Date.now() }) {
  if (!secret || secret.length < MIN_SECRET_LEN) return {}
  const u = new URL(url)
  const ip = typeof clientIp === 'string' && clientIp.length <= MAX_CLIENT_IP_LEN ? clientIp : ''
  const ts = Math.floor(now / 1000)
  const canonical = canonicalString({
    ts,
    method,
    path: u.pathname,
    query: u.search.replace(/^\?/, ''),
    body,
    clientIp: ip,
  })
  return {
    'X-Spinr-Web-Timestamp': String(ts),
    'X-Spinr-Web-Client-IP': ip,
    'X-Spinr-Web-Signature': 'v1=' + createHmac('sha256', secret).update(canonical).digest('hex'),
  }
}

/**
 * The visitor's IP as Vercel reports it. Vercel overwrites x-forwarded-for
 * and x-real-ip at its edge, so on Vercel these are not client-spoofable.
 */
export function clientIpFrom(request) {
  const fwd = request.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return request.headers.get('x-real-ip') || ''
}
