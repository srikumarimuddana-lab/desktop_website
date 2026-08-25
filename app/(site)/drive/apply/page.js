import { previewMetadata } from '@/lib/preview-content'
import { fetchServiceAreas, isSpinrApiConfigured } from '@/lib/spinr-api'
import ApplyClient from './ApplyClient'

/*
 * /drive/apply — start a driver application, against the real backend.
 *
 * Until now /drive said "apply in the app" and that was the whole route in.
 * This page creates the actual account and the actual `drivers` row through
 * the existing spinrvm APIs (auth/send-otp, auth/verify-otp, drivers/register,
 * all proxied by app/api/driver-signup/), so an applicant who starts here
 * shows up in the admin dashboard as a pending driver immediately.
 *
 * It does NOT finish the application, and says so plainly at the end rather
 * than implying otherwise. Licence, insurance and inspection photos and the
 * criminal-record-check consent are collected in the driver app — they need a
 * camera and a published consent document — so this page's last step is a
 * hand-off, not a confirmation of approval.
 *
 * What is deliberately NOT collected here: gender. The backend accepts it and
 * the app asks for it, but PIPEDA wants every field tied to a stated purpose
 * and there is no purpose for it on a public web form. The app can ask.
 *
 * The service-area list is fetched server-side so the city field offers real
 * choices rather than free text — which is also how the page avoids hardcoding
 * Saskatoon a second time.
 */

export const revalidate = 0

export async function generateMetadata() {
  return previewMetadata('/drive/apply', {
    title: 'Start your driver application | Spinr',
    description:
      'Apply to drive with Spinr in Saskatoon. Keep 100% of the net fare — Spinr never takes a share of what you earn. Takes about ten minutes.',
  })
}

export default async function DriverApplyPage() {
  // null (backend unreachable) and [] (configured but empty) are different
  // problems, and the client renders a different message for each: one is
  // "try again shortly", the other is "we are not open where you are yet".
  // A backend that answers badly logs itself in lib/spinr-api; an UNSET
  // SPINR_API_URL used to be silent, which is the likeliest cause of the
  // "applications are unavailable" fallback on a fresh deploy and the hardest
  // to see. Say so in the server log rather than only in the visitor's copy.
  const configured = isSpinrApiConfigured()
  if (!configured) {
    console.error(
      '[drive/apply] SPINR_API_URL is not set — the application form cannot be ' +
        'shown and every visitor sees the unavailable fallback'
    )
  }
  const areas = configured ? await fetchServiceAreas() : null

  return (
    <ApplyClient
      serviceAreas={(areas || []).map((a) => ({ id: a.id, name: a.name, city: a.city || a.name }))}
      backendReachable={areas !== null}
    />
  )
}
