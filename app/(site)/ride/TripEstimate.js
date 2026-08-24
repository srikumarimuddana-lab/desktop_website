'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

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

/*
 * This used to price the trip here, from those constants, against an OSRM
 * distance. They were invented: they knew nothing about surge, area fees, tax,
 * minimum fares or vehicle type, so the range shown had no relationship to
 * what a rider was actually charged.
 *
 * Now the search just resolves two addresses to coordinates and hands off to
 * /ride/estimate, which asks the backend's own fare engine — the same one the
 * app quotes from — and renders the answer on a map. No fare arithmetic
 * survives in this file, and none should come back.
 */

export default function TripEstimate() {
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [pickupAt, setPickupAt] = useState(null)
  const [dropoffAt, setDropoffAt] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [field, setField] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const boxRef = useRef(null)
  const router = useRouter()

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

  /**
   * Hand off to /ride/estimate, which asks the backend for the real fare and
   * draws the route. Coordinates go in the URL so the quote is linkable and
   * the estimate page prices exactly the points that were picked here — no
   * second geocode, which could resolve somewhere slightly different.
   */
  const goToEstimate = () => {
    if (!pickupAt || !dropoffAt) {
      setError('Pick both a pickup and a destination from the suggestions.')
      return
    }
    setError(null)
    setBusy(true)
    const params = new URLSearchParams({
      flat: Number(pickupAt.lat).toFixed(6),
      flng: Number(pickupAt.lon).toFixed(6),
      tlat: Number(dropoffAt.lat).toFixed(6),
      tlng: Number(dropoffAt.lon).toFixed(6),
      from: pickup.slice(0, 120),
      to: dropoff.slice(0, 120),
    })
    router.push(`/ride/estimate?${params.toString()}`)
  }

  const swap = () => {
    setPickup(dropoff); setDropoff(pickup)
    setPickupAt(dropoffAt); setDropoffAt(pickupAt)
    setError(null)
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

      <button type="button" className="sp-btn sp-est-go" onClick={goToEstimate} disabled={busy}>
        {busy ? 'Getting prices…' : 'See prices'}
      </button>

      {error && <p className="sp-est-err" role="alert">{error}</p>}

    </div>
  )
}
