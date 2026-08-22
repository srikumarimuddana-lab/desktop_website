'use client'

import { useEffect, useRef, useState } from 'react'
import AppMap from '../AppMap'

/*
 * THE TRIP — the ride page's centrepiece.
 *
 * One journey, told on one canvas. The section pins for four viewports and
 * scroll plays a single ride end to end on a full-bleed map: ask, see the
 * price, ride, arrive. The route draws continuously underneath while the
 * stage cards swap on top, and the camera leans in and out per stage.
 *
 * Where pinning isn't right — narrow viewports, reduced motion — the same
 * four stages stand as a plain row of cards, each with its own still map.
 */

const clamp01 = (v) => Math.min(1, Math.max(0, v))

const STAGES = [
  {
    k: 'Ask',
    t: 'Say where you’re going',
    p: 'Type it, tap a saved place, or just ask the AI assistant.',
    ty: '-136vh',
  },
  {
    k: 'Price',
    t: 'The full fare, before you book',
    p: 'Itemised to the dollar. If you don’t like it, you haven’t bought it.',
    ty: '-92vh',
  },
  {
    k: 'Ride',
    t: 'Watch your driver come to you',
    p: 'Live on the map, with the trip shareable to anyone you choose.',
    ty: '-46vh',
  },
  {
    k: 'Arrive',
    t: 'Pay what you saw',
    p: 'The number on the receipt is the number you agreed to. Every time.',
    ty: '0vh',
  },
]

/* how far along the route each stage ends */
const ROUTE_AT = [0, 0.22, 0.86, 1]

export default function RideJourney() {
  const wrapRef = useRef(null)
  const [mode, setMode] = useState('still')   // pinned | still
  const [stage, setStage] = useState(0)
  const [local, setLocal] = useState(0)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 980px) and (min-height: 640px)')
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const decide = () => setMode(mq.matches && !motion.matches ? 'pinned' : 'still')
    decide()
    mq.addEventListener('change', decide)
    motion.addEventListener('change', decide)
    return () => {
      mq.removeEventListener('change', decide)
      motion.removeEventListener('change', decide)
    }
  }, [])

  useEffect(() => {
    if (mode !== 'pinned') return
    let frame = 0
    const tick = () => {
      const el = wrapRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      if (travel <= 0) return
      const p = clamp01((-rect.top / travel - 0.04) / 0.88)
      const scaled = p * STAGES.length
      const i = Math.min(STAGES.length - 1, Math.floor(scaled))
      setStage(i)
      setLocal(clamp01(scaled - i))
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
  }, [mode])

  if (mode !== 'pinned') {
    return (
      <section className="sp-sec sp-jn-flat" id="trip">
        <div className="sp-wrap">
          <span className="sp-kick">The trip</span>
          <h2 className="sp-display sp-h2">One ride, start to finish.</h2>
          <div className="sp-jn-grid">
            {STAGES.map((s, i) => (
              <article className="sp-jn-card is-on" key={s.k}>
                <div className="sp-jn-map"><AppMap t={ROUTE_AT[i]} /></div>
                <span className="sp-jn-n sp-display">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="sp-display">{s.t}</h3>
                <p>{s.p}</p>
                <StageExtra i={i} local={1} />
              </article>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const routeT = ROUTE_AT[stage] + (ROUTE_AT[Math.min(stage + 1, 3)] - ROUTE_AT[stage]) * local
  const s = STAGES[stage]

  return (
    <section className="sp-jn" id="trip" ref={wrapRef}>
      <div className="sp-jn-stage">
        {/* the canvas: a city taller than the screen; the camera travels
            north across it as the trip progresses */}
        <div className="sp-jn-canvas" style={{ transform: `translateY(${s.ty})` }}>
          <AppMap t={routeT} dense />
        </div>
        <span className="sp-jn-grain" aria-hidden="true" />

        {/* header strip */}
        <div className="sp-jn-head">
          <span className="sp-kick">The trip</span>
          <h2 className="sp-display">One ride, start to finish.</h2>
          <div className="sp-jn-dots" aria-hidden="true">
            {STAGES.map((st, i) => (
              <span key={st.k} className={i === stage ? 'on' : i < stage ? 'done' : ''}>{st.k}</span>
            ))}
          </div>
        </div>

        {/* the stage card */}
        <div className="sp-jn-rail">
          {STAGES.map((st, i) => (
            <article className={`sp-jn-card${i === stage ? ' is-on' : ''}`} key={st.k} aria-hidden={i !== stage}>
              <span className="sp-jn-n sp-display">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="sp-display">{st.t}</h3>
              <p>{st.p}</p>
              <StageExtra i={i} local={i === stage ? local : i < stage ? 1 : 0} />
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}

/* the live bit inside each stage card */
const DEST = 'Broadway Ave'

function StageExtra({ i, local }) {
  if (i === 0) {
    const typed = DEST.slice(0, Math.round(clamp01(local * 1.6) * DEST.length))
    return (
      <div className="sp-jn-field">
        <i className="sp-jn-pin" aria-hidden="true" />
        {typed}
        {typed.length < DEST.length && <i className="sp-caret" aria-hidden="true" />}
      </div>
    )
  }
  if (i === 1) {
    const rows = [['Ride fare', '$14.20'], ['Booking fee', '$1.00'], ['GST (5%)', '$0.76']]
    return (
      <div className="sp-jn-receipt">
        {rows.map(([k, v], r) => (
          <div key={k} className={`sp-jn-row${local > 0.02 + r * 0.1 ? ' in' : ''}`}>
            <span>{k}</span><b>{v}</b>
          </div>
        ))}
        <div className={`sp-jn-row sp-jn-tot${local > 0.4 ? ' in' : ''}`}><span>Total</span><b>$15.96</b></div>
      </div>
    )
  }
  if (i === 2) {
    const mins = Math.max(1, Math.ceil(6 - local * 5))
    return (
      <div className="sp-jn-driver">
        <span className="sp-jn-avatar" aria-hidden="true" />
        <div>
          <b>{mins} min away</b>
          <i>Grey Corolla &middot; Fully insured</i>
        </div>
      </div>
    )
  }
  return (
    <div className={`sp-jn-stamp sp-display${local > 0.1 ? ' in' : ''}`}>
      $15.96 <span>as quoted</span>
    </div>
  )
}
