'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { APP_URLS } from '@/lib/app-links'

/*
 * The result: map on one side, ride options on the other.
 *
 * Every number on this page came from the backend's fare engine. Nothing here
 * multiplies, adds or rounds a fare — it formats what it was given. That is
 * the point of the whole change: the previous estimator did its own arithmetic
 * from constants nobody maintained, so it could disagree with the app.
 */

// Leaflet touches `window` at module scope, so the map only ever loads in the
// browser. The placeholder keeps the layout from jumping when it arrives.
const RouteMap = dynamic(() => import('./RouteMap'), {
  ssr: false,
  loading: () => <div className="sp-fe-map sp-fe-map-loading" aria-hidden="true" />,
})

/** Amounts arrive as exact decimal strings from the backend (Decimal, never
 *  float). Prefix them; never re-parse and re-round, which is how a displayed
 *  price starts drifting from a charged one. */
function money(value) {
  const s = String(value ?? '').trim()
  if (!s) return null
  return s.startsWith('$') ? s : `$${s}`
}

function minutes(n) {
  const v = Number(n)
  if (!Number.isFinite(v) || v <= 0) return null
  return `${Math.round(v)} min`
}

export default function EstimateClient({ trip, outcome, estimates = [], routePolyline = null }) {
  const [selected, setSelected] = useState(0)
  const [showBreakdown, setShowBreakdown] = useState(false)

  const chosen = estimates[selected] || null
  const surging = Number(chosen?.surge_multiplier || 1) > 1

  const points = useMemo(
    () => (Array.isArray(routePolyline) && routePolyline.length > 1 ? routePolyline : null),
    [routePolyline]
  )

  const failed = outcome && outcome.kind !== 'ok'

  return (
    <>
      <header className="sp-fe-head">
        <span className="sp-kick">Fare estimate</span>
        <h1 className="sp-display sp-fe-h">
          {trip.fromLabel} <span className="sp-fe-arrow" aria-hidden="true">→</span> {trip.toLabel}
        </h1>
        <p className="sp-fe-sub">
          <Link href="/ride">Change this trip</Link>
        </p>
      </header>

      <div className="sp-fe-grid">
        <div className="sp-fe-mapcol">
          <RouteMap pickup={trip.pickup} dropoff={trip.dropoff} points={points} approximate={!points} />
          {/* No road route means the drawn line is our own straight guess. Said
              here rather than inside RouteMap, which is ssr:false — an accuracy
              caveat should not wait for a JS bundle to appear. */}
          {!points && !failed && (
            <p className="sp-fe-map-note">
              Straight-line preview — we could not draw the road route for this trip. The price
              still reflects the real driving distance.
            </p>
          )}
        </div>

        <div className="sp-fe-panel">
          {failed ? (
            <div className="sp-fe-empty">
              <h2 className="sp-display">
                {outcome.kind === 'out_of_area' ? 'Outside our area' : 'No price right now'}
              </h2>
              <p>{outcome.message}</p>
              <Link className="sp-btn" href="/ride">
                Try another trip
              </Link>
            </div>
          ) : (
            <>
              <ul className="sp-fe-tiers">
                {estimates.map((est, i) => {
                  const total = money(est.grand_total ?? est.total_fare)
                  const eta = minutes(est.eta_minutes)
                  return (
                    <li key={est.vehicle_type?.id || i}>
                      <button
                        type="button"
                        className={`sp-fe-tier${i === selected ? ' is-on' : ''}`}
                        onClick={() => setSelected(i)}
                        aria-pressed={i === selected}
                      >
                        <span className="sp-fe-tier-main">
                          <b className="sp-display">{est.vehicle_type?.name || 'Ride'}</b>
                          <span className="sp-fe-tier-meta">
                            {est.vehicle_type?.capacity ? `${est.vehicle_type.capacity} seats` : null}
                            {est.vehicle_type?.capacity && eta ? ' · ' : null}
                            {/* Availability is a coarse yes/no from the backend —
                                it never tells the public how many drivers there are. */}
                            {eta ? `${eta} away` : est.available === false ? 'None nearby right now' : null}
                          </span>
                        </span>
                        <span className="sp-fe-tier-price sp-display">{total || '—'}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>

              {chosen && (
                <div className="sp-fe-detail">
                  <dl className="sp-fe-rows">
                    <div>
                      <dt>Distance</dt>
                      <dd>{chosen.distance_km != null ? `${Number(chosen.distance_km).toFixed(1)} km` : '—'}</dd>
                    </div>
                    <div>
                      <dt>Trip time</dt>
                      <dd>{minutes(chosen.duration_minutes) || '—'}</dd>
                    </div>
                    <div>
                      <dt>Booking fee</dt>
                      <dd>{money(chosen.booking_fee) || '—'}</dd>
                    </div>
                    {surging && (
                      <div>
                        <dt>Busy right now</dt>
                        <dd>{Number(chosen.surge_multiplier).toFixed(2)}&times;</dd>
                      </div>
                    )}
                  </dl>

                  {Array.isArray(chosen.fare_breakdown) && chosen.fare_breakdown.length > 0 && (
                    <>
                      <button
                        type="button"
                        className="sp-fe-toggle"
                        onClick={() => setShowBreakdown((v) => !v)}
                        aria-expanded={showBreakdown}
                      >
                        {showBreakdown ? 'Hide the full breakdown' : 'See every charge'}
                      </button>
                      {showBreakdown && (
                        <dl className="sp-fe-rows sp-fe-rows-full">
                          {chosen.fare_breakdown.map((line, i) => (
                            <div key={`${line.label}-${i}`}>
                              <dt>{line.label}</dt>
                              <dd>{money(line.amount) || line.amount}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                    </>
                  )}
                </div>
              )}

              <div className="sp-fe-cta">
                <p className="sp-fe-cta-lede">
                  Booking happens in the Spinr app. Get it, sign in with your number, and this trip
                  is a few taps away.
                </p>
                <div className="sp-fe-cta-btns">
                  <a className="sp-btn" href={APP_URLS.rider.ios} target="_blank" rel="noopener noreferrer">
                    Get the app for iPhone
                  </a>
                  <a className="sp-btn-ghost" href={APP_URLS.rider.android} target="_blank" rel="noopener noreferrer">
                    Get it on Android
                  </a>
                </div>
              </div>

              {/* Deliberately says nothing about surge when the multiplier is 1.
                  The site's marketing copy says "no surge pricing" while the
                  backend runs a live surge engine with a 2.5x cap, so any
                  general claim here would contradict one or the other. When the
                  quote IS elevated the page says so plainly; when it is not, it
                  simply does not raise the subject. */}
              <p className="sp-fe-fine">
                An estimate. It reflects the route and the rates in force right now, and does not
                know about traffic, a changed destination, extra stops, or waiting time. The app
                shows the exact figure before you confirm &mdash; and that is the figure you pay.
                Every charge is named on your receipt.
                {surging ? ' Demand is high right now, so this quote is above the usual rate.' : ''}
              </p>
            </>
          )}
        </div>
      </div>
    </>
  )
}
