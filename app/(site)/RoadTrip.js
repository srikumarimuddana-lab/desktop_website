'use client'

import { useEffect, useRef, useState } from 'react'

/*
 * THE DRIVE — a car that crosses the page as you scroll past it.
 *
 * The rest of the home page is scroll-driven (the sticky why-cards, the
 * how-it-works rail), so this uses the same idea rather than adding a loop
 * that plays whether you are looking or not: the car's position IS your
 * scroll position through the section. Scroll back and it reverses.
 *
 * Everything is drawn — flat fills, 2px ink outlines, no photography — to
 * match the phones and the receipt elsewhere on the site.
 *
 * Under prefers-reduced-motion the whole thing is static: the car is parked
 * at the pin it was driving toward, wheels still, skyline still. That is the
 * end state of the animation, so nothing is lost by not seeing it move.
 */

const clamp01 = (v) => Math.min(1, Math.max(0, v))

export default function RoadTrip() {
  const ref = useRef(null)
  const [t, setT] = useState(0)
  const [still, setStill] = useState(false)

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const decide = () => setStill(motion.matches)
    decide()
    motion.addEventListener('change', decide)
    return () => motion.removeEventListener('change', decide)
  }, [])

  useEffect(() => {
    if (still) { setT(1); return }
    let frame = 0
    const tick = () => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      /* 0 as the section's top reaches the bottom of the screen, 1 by the time
         the section sits centred in the viewport — NOT when it leaves the top,
         or the car would reach the pin after you had already scrolled past and
         nobody would see it arrive. It then stays parked for the rest of the
         way out. Works at any viewport height. */
      const span = (window.innerHeight + r.height) / 2
      setT(clamp01((window.innerHeight - r.top) / span))
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => { frame = 0; tick() })
    }
    tick()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [still])

  /* Ease into the pickup rather than arriving at full speed, and stop short of
     the pin so the car sits beside it instead of on top of it. */
  const eased = t < 0.82 ? t / 0.82 * 0.88 : 0.88 + (1 - Math.pow(1 - (t - 0.82) / 0.18, 3)) * 0.12
  const arrived = t > 0.9

  return (
    <section
      className={`sp-road${arrived ? ' is-there' : ''}`}
      ref={ref}
      style={{ '--t': eased }}
      aria-label="A Spinr car driving across Saskatoon to a pickup"
    >
      <div className="sp-road-sky" aria-hidden="true">
        {/* skyline drifts the other way, slower — depth without a parallax library */}
        <div className="sp-road-city">
          <svg viewBox="0 0 900 120" preserveAspectRatio="none" role="presentation">
            <path
              fill="currentColor"
              d="M0 120V74h34V52h26v22h30V38h40v36h26V60h34v14h44V30h34v44h30V56h40v18h28V44h38v30h32V62h30v12h44V34h36v40h26V58h34v16h40V46h34v28h30V64h30v10h44V40h38v34h28V60h32v14h44v46z"
            />
          </svg>
        </div>
      </div>

      <div className="sp-road-strip" aria-hidden="true">
        <span className="sp-road-dashes" />
      </div>

      {/* where the rider is waiting */}
      <div className="sp-road-pin" aria-hidden="true">
        <svg viewBox="0 0 34 46" role="presentation">
          <path
            d="M17 2c8.3 0 15 6.5 15 14.6C32 27 17 44 17 44S2 27 2 16.6C2 8.5 8.7 2 17 2Z"
            fill="var(--red)" stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round"
          />
          <circle cx="17" cy="16.5" r="5.4" fill="var(--paper-50)" stroke="var(--ink)" strokeWidth="3" />
        </svg>
      </div>

      <div className="sp-road-car" aria-hidden="true">
        <span className="sp-road-puff" />
        <svg viewBox="0 0 210 96" role="presentation">
          {/* shadow first, so the body sits on it */}
          <ellipse cx="105" cy="88" rx="76" ry="6" fill="rgba(11,11,11,.18)" />

          <g stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
            {/* greenhouse */}
            <path d="M56 44 70 20h68l20 24Z" fill="var(--sky)" />
            <path d="M104 21v23" strokeWidth="3.5" />
            {/* body */}
            <path
              d="M18 46h174a8 8 0 0 1 8 8v14a6 6 0 0 1-6 6h-14a22 22 0 0 0-44 0H66a22 22 0 0 0-44 0H14a6 6 0 0 1-6-6V56a10 10 0 0 1 10-10Z"
              fill="var(--red)"
            />
            {/* roof sign — the bit that says taxi without saying taxi */}
            <rect x="86" y="8" width="38" height="14" rx="5" fill="var(--sun)" />
            {/* headlight, tail light */}
            <rect x="188" y="52" width="13" height="10" rx="4" fill="var(--sun)" />
            <rect x="9" y="52" width="11" height="10" rx="4" fill="#FFE7EA" />
          </g>

          {/* wheels spin with distance travelled, not with the clock */}
          <g className="sp-road-wheel" style={{ '--cx': '44px', '--cy': '68px' }}>
            <circle cx="44" cy="68" r="20" fill="var(--ink)" />
            <circle cx="44" cy="68" r="8.5" fill="var(--paper-50)" stroke="var(--ink)" strokeWidth="3" />
            <path d="M44 60v16M36 68h16" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
          </g>
          <g className="sp-road-wheel" style={{ '--cx': '166px', '--cy': '68px' }}>
            <circle cx="166" cy="68" r="20" fill="var(--ink)" />
            <circle cx="166" cy="68" r="8.5" fill="var(--paper-50)" stroke="var(--ink)" strokeWidth="3" />
            <path d="M166 60v16M158 68h16" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* the headline changes with the car, not just the sub-line — "four
          minutes away / your driver is here" read as a contradiction */}
      <p className="sp-road-cap sp-display">
        <span>{arrived ? 'Your driver is here' : 'Four minutes away'}</span>
        <i>{arrived ? 'Broadway & 8th' : 'On the way to you'}</i>
      </p>
    </section>
  )
}
