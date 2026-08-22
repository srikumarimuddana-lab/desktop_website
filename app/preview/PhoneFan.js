'use client'

import { useEffect, useRef, useState } from 'react'
import AppMap from './AppMap'

/*
 * The hero visual: three phones stacked like a hand of cards, which fan apart
 * as you scroll off the hero. Drawn, not screenshotted — same reason as the
 * map, and it keeps the hero honest: what you see is the product, not a stock
 * photograph of someone who is not a Spinr rider.
 *
 * Two casts, picked at random on each load, because the same page shouldn't
 * always tell the same half of the story:
 *   rider  — what the app does for someone getting a lift, assistant included
 *   driver — what it looks like from the seat that keeps 100% of the fare
 *
 * The pick happens after mount, so the server and the first client render
 * agree; the fan is held back until it is made, so nothing swaps under you.
 */

const clamp01 = (v) => Math.min(1, Math.max(0, v))

/* stacked (0) -> fanned (1). x in % of a phone's own width. */
const LAYOUT = [
  { x: [-20, -104], y: [44, 14], r: [-7, -14], s: [0.86, 0.9], z: 1 },
  { x: [0, 0],      y: [0, 0],   r: [-2, -3],  s: [1, 1],      z: 3 },
  { x: [20, 104],   y: [56, 26], r: [6, 13],   s: [0.82, 0.88], z: 2 },
]

const mix = (pair, t) => pair[0] + (pair[1] - pair[0]) * t

export default function PhoneFan({ force }) {
  const ref = useRef(null)
  const [spread, setSpread] = useState(0)
  /* how far apart they are allowed to travel — a narrow hero would push the
   * outer two off their own panel at full spread */
  const [reach, setReach] = useState(1)
  const [cast, setCast] = useState(null)

  useEffect(() => {
    setCast(force || (Math.random() < 0.5 ? 'rider' : 'driver'))
  }, [force])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSpread(1) // no travel, but show them apart rather than in a heap
      setReach(window.innerWidth >= 900 ? 1 : window.innerWidth >= 640 ? 0.72 : 0.46)
      return
    }
    let frame = 0
    const tick = () => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      setSpread(clamp01((window.innerHeight * 0.62 - r.top) / (window.innerHeight * 0.62)))
      setReach(window.innerWidth >= 900 ? 1 : window.innerWidth >= 640 ? 0.72 : 0.46)
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => { frame = 0; tick() })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const screens = cast === 'driver' ? DRIVER : RIDER

  return (
    <div className={`sp-fan${cast ? ' ready' : ''}`} ref={ref} data-cast={cast || undefined}>
      {screens.map((Screen, i) => {
        const l = LAYOUT[i]
        return (
          <div
            key={i}
            className="sp-fan-p"
            style={{
              zIndex: l.z,
              '--ap-delay': `${820 + i * 130}ms`,
              transform:
                `translate(${(mix(l.x, spread) * reach).toFixed(2)}%, ${mix(l.y, spread).toFixed(1)}px)` +
                ` rotate(${mix(l.r, spread).toFixed(2)}deg) scale(${mix(l.s, spread).toFixed(3)})`,
            }}
          >
            <span className="sp-fan-notch" aria-hidden="true" />
            <div className="sp-fs">{cast ? <Screen /> : null}</div>
          </div>
        )
      })}

      <span className="sp-fan-tag sp-display" aria-hidden="true">
        {cast === 'driver' ? 'You keep 100%' : 'Just ask'}
      </span>
    </div>
  )
}

/* ── rider cast ───────────────────────────────────────────── */

function RiderHome() {
  return (
    <>
      <p className="sp-fs-hi sp-display">Where to?</p>
      <div className="sp-fs-field"><i className="sp-fs-pin" />Broadway Ave</div>
      <div className="sp-fs-chips">
        <span>Home</span><span>YXE</span><span>Work</span>
      </div>
      <div className="sp-fs-map"><AppMap route={false} pins={false} /></div>
      <div className="sp-fs-go">See the price</div>
    </>
  )
}

function RiderAi() {
  return (
    <>
      <p className="sp-fs-hi sp-display">Assistant</p>
      <div className="sp-fs-thread">
        <span className="sp-fs-bub sp-fs-bub-you">book me 6am to the airport</span>
        <span className="sp-fs-bub sp-fs-bub-ai">Done — 6:00am, $28.40 all in.</span>
        <span className="sp-fs-bub sp-fs-bub-you">what did Friday cost?</span>
        <span className="sp-fs-bub sp-fs-bub-ai sp-fs-typing"><i /><i /><i /></span>
      </div>
      <div className="sp-fs-input">Ask anything</div>
    </>
  )
}

function RiderReceipt() {
  return (
    <>
      <p className="sp-fs-hi sp-display">Receipt</p>
      <div className="sp-fs-card">
        <div className="sp-fs-row"><span>Fare</span><b>$14.20</b></div>
        <div className="sp-fs-row"><span>Platform fee</span><b>$1.00</b></div>
        <div className="sp-fs-row"><span>GST</span><b>$0.76</b></div>
        <div className="sp-fs-row sp-fs-row-red"><span>Surge</span><b>None</b></div>
        <div className="sp-fs-tot"><span>Total</span><b>$15.96</b></div>
      </div>
      <div className="sp-fs-keep">
        <span>Driver keeps</span>
        <b className="sp-display">$14.20</b>
      </div>
      <div className="sp-fs-go sp-fs-go-ghost">Email receipt</div>
    </>
  )
}

const RIDER = [RiderReceipt, RiderHome, RiderAi]

/* ── driver cast ──────────────────────────────────────────── */

function DriverOnline() {
  return (
    <>
      <p className="sp-fs-hi sp-display">You&rsquo;re online</p>
      <div className="sp-fs-toggle"><i />Taking trips</div>
      <div className="sp-fs-card">
        <div className="sp-fs-k">Today</div>
        <b className="sp-fs-big sp-display">$186.40</b>
        <div className="sp-fs-row"><span>9 trips</span><b>7h 20m</b></div>
      </div>
      <div className="sp-fs-map"><AppMap route={false} pins={false} /></div>
    </>
  )
}

function DriverOffer() {
  return (
    <>
      <p className="sp-fs-hi sp-display">New trip</p>
      <div className="sp-fs-card sp-fs-card-sun">
        <div className="sp-fs-k">You earn</div>
        <b className="sp-fs-big sp-display">$14.20</b>
        <div className="sp-fs-row"><span>4 min away</span><b>12.4 km</b></div>
      </div>
      <div className="sp-fs-map"><AppMap t={0.45} /></div>
      <div className="sp-fs-go">Accept</div>
    </>
  )
}

function DriverWeek() {
  const bars = [42, 68, 30, 84, 56, 96, 74]
  return (
    <>
      <p className="sp-fs-hi sp-display">This week</p>
      <div className="sp-fs-card">
        <div className="sp-fs-k">Paid out</div>
        <b className="sp-fs-big sp-display">$1,204</b>
        <div className="sp-fs-bars" aria-hidden="true">
          {bars.map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}
        </div>
      </div>
      <div className="sp-fs-keep">
        <span>Commission taken</span>
        <b className="sp-display">$0.00</b>
      </div>
      <div className="sp-fs-go sp-fs-go-ghost">Statement</div>
    </>
  )
}

const DRIVER = [DriverWeek, DriverOffer, DriverOnline]
