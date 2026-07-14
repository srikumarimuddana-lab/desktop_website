// Lazy Stripe.js singleton. The publishable key lives in the backend's
// app_settings table (rotatable without redeploy) and is served by the
// public GET /api/v1/settings endpoint.

import { loadStripe } from '@stripe/stripe-js'
import { apiFetch } from '@/lib/spinr-api'

let stripePromise = null
let publishableKey = null

export async function getStripeSettings() {
  const settings = await apiFetch('/api/v1/settings', { retryOn401: false })
  publishableKey = settings?.stripe_publishable_key || ''
  return { publishableKey }
}

/** Resolves to a Stripe instance, or null when Stripe is not configured
 *  (demo/local mode — the backend serves a pm_demo_card instead). */
export async function getStripe() {
  if (!stripePromise) {
    stripePromise = (async () => {
      if (publishableKey === null) await getStripeSettings()
      if (!publishableKey) return null
      return loadStripe(publishableKey)
    })()
  }
  return stripePromise
}
