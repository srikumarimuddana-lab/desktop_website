'use client'

import { useEffect, useRef, useState } from 'react'
import { APP_URLS, detectPlatform } from '@/lib/app-links'

/*
 * The live trip estimator, carried across from the previous /ride page.
 *
 * It geocodes both ends with Nominatim and measures the driving route with
 * OSRM — both free, both open, no key. The fare maths is unchanged from the
 * old calculator: distance-only, $1.20–$2.00 per km, a $4.00 floor, plus the
 * airport surcharge where it applies.
 *
 * Two fixes came with the move:
 *  - the airport test looked for "yqr", which is REGINA. Spinr serves
 *    Saskatoon, so a trip to YXE never picked up the surcharge and a trip to
 *    an airport we do not serve would have. It tests yxe now.
 *  - a stray console.log on every render is gone.
 *
 * The range is honest about being a range: it is a straight distance estimate
 * and does not know about time in traffic, so it is labelled an estimate and
 * the app is named as the place you see the real number before booking.
 */

const MIN_PER_KM = 1.2
const MAX_PER_KM = 2.0
const MIN_FARE = 4.0
const AIRPORT_SURCHARGE = 2.0
const BOOKING_FEE = 1.0

const money = (n) => '$' + n.toFixed(2)

export default function TripEstimate() {
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [pickupAt, setPickupAt] = useState(null)
  const [dropoffAt, setDropoffAt] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [field, setField] = useState(null)
  const [busy, setBusy] = useState(false)
  /* which store to lead with; resolved after mount so SSR stays stable */
  const [platform, setPlatform] = useState('ios')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const boxRef = useRef(null)

  // one lookup per pause in typing, not one per keystroke — Nominatim asks
  // for no more than a request a second and this is a public instance
  useEffect(() => {
    const term = field === 'pickup' ? pickup : field === 'dropoff' ? dropoff : ''
    if (!field || term.trim().length < 3) { setSuggestions([]); return }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(term + ' Saskatchewan')}&countrycodes=ca&limit=5`
        )
        if (!res.ok) throw new Error(`geocode ${res.status}`)
        setSuggestions(await res.json())
      } catch (e) {
        console.error('[estimate] address lookup failed:', e.message)
        setSuggestions([])
      }
    }, 500)
    return () => clearTimeout(t)
  }, [pickup, dropoff, field])

  useEffect(() => {
    const away = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setSuggestions([]) }
    document.addEventListener('pointerdown', away)
    return () => document.removeEventListener('pointerdown', away)
  }, [])

  const choose = (item) => {
    if (field === 'pickup') { setPickup(item.display_name); setPickupAt(item) }
    else { setDropoff(item.display_name); setDropoffAt(item) }
    setSuggestions([])
    setField(null)
  }

  useEffect(() => { setPlatform(detectPlatform()) }, [])

  const estimate = async () => {
    if (!pickupAt || !dropoffAt) { setError('Pick both ends from the suggestions.'); return }
    setBusy(true); setError(null); setResult(null)
    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${pickupAt.lon},${pickupAt.lat};${dropoffAt.lon},${dropoffAt.lat}?overview=false`
      )
      if (!res.ok) throw new Error(`route ${res.status}`)
      const data = await res.json()
      const metres = data?.routes?.[0]?.distance
      if (!metres) throw new Error('no route')
      const km = metres / 1000

      const airport = /\b(airport|yxe)\b/i.test(dropoff)
      const surcharge = airport ? AIRPORT_SURCHARGE : 0
      const low = Math.max(km * MIN_PER_KM + surcharge, MIN_FARE)
      const high = Math.max(km * MAX_PER_KM + surcharge, MIN_FARE)
      setResult({ km, low, high, airport, flat: low === high })
    } catch (e) {
      console.error('[estimate] route failed:', e.message)
      setError('Could not measure that trip. Try two distinct Saskatoon addresses.')
    } finally {
      setBusy(false)
    }
  }

  const swap = () => {
    setPickup(dropoff); setDropoff(pickup)
    setPickupAt(dropoffAt); setDropoffAt(pickupAt)
    setResult(null)
  }

  return (
    <div className="sp-est" ref={boxRef}>
      <div className="sp-est-fields">
        <label className="sp-est-field">
          <span>From</span>
          <input
            value={pickup}
            onChange={(e) => { setPickup(e.target.value); setPickupAt(null); setField('pickup') }}
            onFocus={() => setField('pickup')}
            placeholder="Pickup address"
            autoComplete="off"
          />
        </label>

        <button type="button" className="sp-est-swap" onClick={swap} aria-label="Swap pickup and destination">
          <span aria-hidden="true">&#8645;</span>
        </button>

        <label className="sp-est-field">
          <span>To</span>
          <input
            value={dropoff}
            onChange={(e) => { setDropoff(e.target.value); setDropoffAt(null); setField('dropoff') }}
            onFocus={() => setField('dropoff')}
            placeholder="Where to?"
            autoComplete="off"
          />
        </label>

        {suggestions.length > 0 && (
          <ul className="sp-est-list">
            {suggestions.map((s) => (
              <li key={s.place_id}>
                <button type="button" onClick={() => choose(s)}>{s.display_name}</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button type="button" className="sp-btn sp-est-go" onClick={estimate} disabled={busy}>
        {busy ? 'Measuring…' : 'Estimate this trip'}
      </button>

      {error && <p className="sp-est-err" role="alert">{error}</p>}

      {result && (
        <div className="sp-est-out">
          <div className="sp-est-headline">
            <span className="sp-est-k">Fare estimate</span>
            <b className="sp-display">
              {result.flat ? money(result.low) : `${money(result.low)} – ${money(result.high)}`}
            </b>
          </div>
          <dl className="sp-est-rows">
            <div><dt>Driving distance</dt><dd>{result.km.toFixed(1)} km</dd></div>
            <div><dt>To your driver</dt><dd>all of it</dd></div>
            <div><dt>Booking fee</dt><dd>{money(BOOKING_FEE)}</dd></div>
            {result.airport && <div><dt>Airport surcharge</dt><dd>{money(AIRPORT_SURCHARGE)}</dd></div>}
            <div><dt>Surge</dt><dd>never</dd></div>
          </dl>
          <p className="sp-est-fine">
            A distance estimate, so it does not know about traffic. The {money(BOOKING_FEE)} booking
            fee, tax and any city fee are added at checkout, each named. The app shows
            the exact number before you confirm &mdash; and it is the number you pay.
          </p>
          {/* this estimate is list price: it cannot see an account's promos */}
          <p className="sp-est-fine sp-est-promo">
            This estimate is before any discount. Promo codes and other offers are
            applied in the app, so what you actually pay can be less.
          </p>
          {/* the estimate is the pitch; the app is where the trip actually happens */}
          <div className="sp-est-cta">
            <a
              className="sp-btn"
              href={APP_URLS.rider[platform]}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book this trip in the app
            </a>
            <a
              className="sp-btn-ghost"
              href={APP_URLS.rider[platform === 'ios' ? 'android' : 'ios']}
              target="_blank"
              rel="noopener noreferrer"
            >
              {platform === 'ios' ? 'Google Play' : 'App Store'}
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
