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
        {/* Side view of an ordinary hatchback — deliberately ordinary, since
            that is what a rideshare car is. No roof light: that reads taxi,
            which Spinr is not.

            The wheel arches are part of the body outline rather than notches
            cut from a rectangle, the glass follows the pillar rake, and the
            tyres are a shade lighter than the asphalt so the car does not
            dissolve into the road it is driving on. */}
        <svg viewBox="0 0 300 122" role="presentation">
          <ellipse cx="150" cy="110" rx="108" ry="7" fill="rgba(11,11,11,.16)" />

          {/* wells first — the arches are openings onto these, so no sky
              shows through the gap above each tyre */}
          <circle cx="78" cy="86" r="23" fill="var(--ink)" />
          <circle cx="222" cy="86" r="23" fill="var(--ink)" />

          <g stroke="var(--ink)" strokeWidth="4.5" strokeLinejoin="round" strokeLinecap="round">
            <path
              fill="var(--red)"
              d="M24 84 L22 68 Q22 58 32 55 L68 50 L100 26 Q104 22 111 22
                 L174 22 Q182 22 186 25 L212 50 L252 56 Q268 58 274 66
                 L277 76 Q278 84 272 84 L244 84
                 A22 22 0 0 0 200 84 L100 84
                 A22 22 0 0 0 56 84 Z"
            />

            <path fill="var(--sky)" d="M77 49 L102 27 L127 27 L127 49 Z" />
            <path fill="var(--sky)" d="M134 27 L181 27 L202 49 L134 49 Z" />

            <path d="M130 51 L130 80" strokeWidth="3" />
            <rect x="141" y="57" width="16" height="6" rx="3" fill="var(--red-7)" strokeWidth="3" />

            <rect x="262" y="62" width="13" height="9" rx="3.5" fill="var(--sun)" strokeWidth="3.5" />
            <rect x="24" y="60" width="10" height="9" rx="3.5" fill="#FFB3BB" strokeWidth="3.5" />
          </g>

          {/* wheels last, in front of the arch edge, turning with distance
              travelled rather than with the clock */}
          <g className="sp-road-wheel">
            <circle cx="78" cy="86" r="19" fill="#33322F" stroke="var(--ink)" strokeWidth="4" />
            <circle cx="78" cy="86" r="8.5" fill="var(--paper-50)" stroke="var(--ink)" strokeWidth="3" />
            <path d="M78 79v14M71 86h14" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <g className="sp-road-wheel">
            <circle cx="222" cy="86" r="19" fill="#33322F" stroke="var(--ink)" strokeWidth="4" />
            <circle cx="222" cy="86" r="8.5" fill="var(--paper-50)" stroke="var(--ink)" strokeWidth="3" />
            <path d="M222 79v14M215 86h14" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
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
