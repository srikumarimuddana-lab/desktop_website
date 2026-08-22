'use client'

import { useEffect, useRef, useState } from 'react'

/*
 * "Things we refuse to build" — a horizontal rail. The section pins and
 * scroll slides the cards across, one refusal at a time. These come from the
 * product's actual guardrails, not marketing: no commission, no surge, no
 * hidden fees, no data harvesting, and no pretending SOS replaces 911.
 *
 * Narrow viewports and reduced motion get the cards stacked vertically.
 */

const clamp01 = (v) => Math.min(1, Math.max(0, v))

const REFUSALS = [
  {
    n: '01', t: 'A commission',
    p: 'Drivers keep 100% of the net fare. The platform is funded by the rider’s flat $1 fee and by corporate accounts — never by a cut of the driver’s money.',
  },
  {
    n: '02', t: 'Surge pricing',
    p: 'The same trip costs the same at 8am, at bar close, and in a January whiteout. No multiplier, no “dynamic pricing”, no asterisk.',
  },
  {
    n: '03', t: 'Hidden fees',
    p: 'Every charge on the receipt is a disclosed line item: fare, flat fee, tax, tip. If a number can’t be explained, it can’t be charged.',
  },
  {
    n: '04', t: 'Data harvesting',
    p: 'No ad SDKs, no behavioural retargeting, no selling profiles. Trip data exists to run rides and keep people safe — that’s the whole job.',
  },
  {
    n: '05', t: 'False comfort',
    p: 'The SOS button alerts your emergency contacts and our safety team, and offers one-tap 911. It never claims to replace calling 911 — nothing should.',
  },
]

export default function RefuseRail() {
  const wrapRef = useRef(null)
  const trackRef = useRef(null)
  const [pinned, setPinned] = useState(false)
  const [x, setX] = useState(0)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)')
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const decide = () => setPinned(mq.matches && !motion.matches)
    decide()
    mq.addEventListener('change', decide)
    motion.addEventListener('change', decide)
    return () => {
      mq.removeEventListener('change', decide)
      motion.removeEventListener('change', decide)
    }
  }, [])

  useEffect(() => {
    if (!pinned) { setX(0); return }
    let frame = 0
    const tick = () => {
      const el = wrapRef.current
      const track = trackRef.current
      if (!el || !track) return
      const rect = el.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      if (travel <= 0) return
      const p = clamp01((-rect.top / travel - 0.04) / 0.9)
      const max = Math.max(0, track.scrollWidth - window.innerWidth)
      setX(-p * max)
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
  }, [pinned])

  return (
    <section className={`sp-ref${pinned ? ' is-pinned' : ''}`} id="refusals" ref={wrapRef}>
      <div className="sp-ref-stage">
        <div className="sp-ref-head sp-wrap">
          <span className="sp-kick sp-kick-light">The guardrails</span>
          <h2 className="sp-display sp-h2 sp-ref-h">Things we refuse to build.</h2>
        </div>
        <div className="sp-ref-track" ref={trackRef} style={{ transform: `translateX(${x}px)` }}>
          {REFUSALS.map((r) => (
            <article className="sp-ref-card" key={r.n}>
              <span className="sp-display sp-ref-n" aria-hidden="true">{r.n}</span>
              <h3 className="sp-display">{r.t}</h3>
              <p>{r.p}</p>
              <span className="sp-ref-no sp-display" aria-hidden="true">No.</span>
            </article>
          ))}
          <div className="sp-ref-end" aria-hidden="true">
            <b className="sp-display">That&rsquo;s the whole list.</b>
            <span>It doesn&rsquo;t grow.</span>
          </div>
        </div>
      </div>
    </section>
  )
}
