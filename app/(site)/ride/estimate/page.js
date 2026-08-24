import Link from 'next/link'
import { previewMetadata } from '@/lib/preview-content'
import { fetchPublicEstimate, isSpinrApiConfigured } from '@/lib/spinr-api'
import EstimateClient from './EstimateClient'

/*
 * /ride/estimate — the fare result, on its own page.
 *
 * Uber's price estimator works this way and it is the right shape: the search
 * happens on /ride, and submitting lands you on a page whose URL *is* the
 * trip. That makes a quote linkable and shareable ("here's what it costs from
 * mine to yours"), back/forward behave, and the page can be rendered on the
 * server instead of flashing a spinner.
 *
 * The trip rides in the query string as coordinates plus display labels:
 *
 *   /ride/estimate?flat=52.13&flng=-106.67&tlat=52.15&tlng=-106.63
 *                 &from=8th+St+E&to=Midtown+Plaza
 *
 * Coordinates rather than addresses because the backend prices on coordinates
 * and re-geocoding here would risk pricing a different point than the one the
 * visitor picked. The labels are display-only and never reach the backend.
 *
 * The price comes from the backend's own fare engine — the same one the rider
 * app quotes from. This page does NO fare arithmetic. The numbers that used to
 * live in TripEstimate.js (MIN_PER_KM 1.2, MAX_PER_KM 2.0, MIN_FARE 4.0) were
 * invented and knew nothing about surge, area fees, tax or vehicle type.
 */

export const revalidate = 0

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams
  const from = typeof sp?.from === 'string' ? sp.from.slice(0, 60) : ''
  const to = typeof sp?.to === 'string' ? sp.to.slice(0, 60) : ''
  const trip = from && to ? `${from} to ${to}` : 'your trip'
  return previewMetadata('/ride/estimate', {
    title: `Fare estimate for ${trip} | Spinr`,
    description:
      'See what a Spinr ride costs before you book — the real fare from our own pricing, with every charge named. No surge, ever.',
    // A quote page is generated per trip and has no standalone value in an
    // index; /ride is the page that should rank.
    robots: { index: false, follow: true },
  })
}

/** Parse and bound a coordinate from the query string. */
function coord(value, max) {
  const n = Number(value)
  if (!Number.isFinite(n) || Math.abs(n) > max) return null
  return n
}

function readTrip(sp) {
  const lat1 = coord(sp?.flat, 90)
  const lng1 = coord(sp?.flng, 180)
  const lat2 = coord(sp?.tlat, 90)
  const lng2 = coord(sp?.tlng, 180)
  if (lat1 === null || lng1 === null || lat2 === null || lng2 === null) return null
  return {
    pickup: { lat: lat1, lng: lng1 },
    dropoff: { lat: lat2, lng: lng2 },
    // Labels are echoed straight back into the page, so they are bounded here
    // and rendered as text by React — never as markup.
    fromLabel: typeof sp.from === 'string' ? sp.from.slice(0, 120) : 'Pickup',
    toLabel: typeof sp.to === 'string' ? sp.to.slice(0, 120) : 'Destination',
  }
}

/** Turn a backend outcome into the one thing the page needs: what to say. */
function readOutcome(result) {
  if (result.ok) return { kind: 'ok' }
  if (result.status === 400) {
    // The engine raises OUTSIDE_SERVICE_AREA for a trip it will not price.
    // That is a real answer, not a failure — say it plainly and do not imply
    // Spinr is coming to wherever they asked about.
    return {
      kind: 'out_of_area',
      message:
        'That trip is outside the area Spinr covers. We operate in Saskatoon — if your pickup or destination is beyond it, we cannot quote the ride.',
    }
  }
  if (result.status === 503) {
    return { kind: 'unavailable', message: 'Fare estimates are unavailable right now. Please try again shortly.' }
  }
  if (result.status === 429) {
    return { kind: 'unavailable', message: 'A lot of people are pricing trips right now. Give it a minute and try again.' }
  }
  if (result.reason === 'timeout') {
    return { kind: 'unavailable', message: 'That took too long to price. Please try again in a moment.' }
  }
  return { kind: 'unavailable', message: 'We could not price that trip just now. Please try again shortly.' }
}

export default async function EstimatePage({ searchParams }) {
  const sp = await searchParams
  const trip = readTrip(sp)

  if (!trip) {
    return (
      <Shell>
        <p className="sp-fe-lede">
          We could not read that trip. <Link href="/ride">Search for a fare</Link> and we will price it.
        </p>
      </Shell>
    )
  }

  if (!isSpinrApiConfigured()) {
    return (
      <Shell>
        <EstimateClient trip={trip} outcome={{ kind: 'unavailable', message: 'Fare estimates are unavailable right now.' }} />
      </Shell>
    )
  }

  const result = await fetchPublicEstimate({ pickup: trip.pickup, dropoff: trip.dropoff })
  const outcome = readOutcome(result)
  const estimates = outcome.kind === 'ok' ? result.data?.estimates || [] : []

  return (
    <Shell>
      <EstimateClient
        trip={trip}
        outcome={estimates.length === 0 && outcome.kind === 'ok' ? { kind: 'no_options', message: 'No vehicle types are available for that trip right now.' } : outcome}
        estimates={estimates}
        routePolyline={result.data?.route_polyline || null}
      />
    </Shell>
  )
}

function Shell({ children }) {
  return (
    <section className="sp-sec sp-fe-sec">
      <div className="sp-wrap sp-fe-wrap">{children}</div>
    </section>
  )
}
