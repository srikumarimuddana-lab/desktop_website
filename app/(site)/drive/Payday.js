'use client'

import { useEffect, useRef, useState } from 'react'

/*
 * THE PAYDAY — the drive page's centrepiece.
 *
 * A pinned ledger. As you scroll, a Friday night's trips land on it one by
 * one, the running total climbs, and the commission line sits at –$0.00 the
 * whole way — the point of the page, made with arithmetic instead of adjectives.
 * Scroll back up and the night un-happens.
 *
 * Narrow viewports and reduced motion get the finished ledger, no pinning.
 */

const clamp01 = (v) => Math.min(1, Math.max(0, v))

const TRIPS = [
  ['6:40p', 'Nutana → City Park', 11.30],
  ['7:15p', 'Broadway → YXE Airport', 18.65],
  ['8:05p', 'Riversdale → Midtown', 9.80],
  ['9:20p', 'Stonebridge → Lawson', 24.40],
  ['10:45p', 'Sutherland → Broadway', 15.96],
  ['11:30p', 'Downtown → Nutana', 13.75],
]
const TOTAL = TRIPS.reduce((a, [, , v]) => a + v, 0)

const money = (v) => `$${v.toFixed(2)}`

export default function Payday() {
  const wrapRef = useRef(null)
  const [pinned, setPinned] = useState(false)
  const [shown, setShown] = useState(0)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px) and (min-height: 600px)')
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
    if (!pinned) { setShown(TRIPS.length); return }
    let frame = 0
    const tick = () => {
      const el = wrapRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      if (travel <= 0) return
      const p = clamp01((-rect.top / travel - 0.06) / 0.8)
      setShown(Math.min(TRIPS.length, Math.floor(p * (TRIPS.length + 1))))
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

  const total = TRIPS.slice(0, shown).reduce((a, [, , v]) => a + v, 0)
  const done = shown >= TRIPS.length

  return (
    <section className={`sp-pd${pinned ? ' is-pinned' : ''}`} id="payday" ref={wrapRef}>
      <div className="sp-pd-stage">
        <div className="sp-wrap sp-pd-in">
          <div className="sp-pd-side">
            <span className="sp-kick">The arithmetic</span>
            <h2 className="sp-display sp-h2">A Friday night,<br />added up.</h2>
            <p className="sp-pd-lede">
              Six trips, one shift. Watch the only line other platforms
              would grow — and ours can&rsquo;t.
            </p>
            <div className={`sp-pd-keep${done ? ' in' : ''}`} aria-hidden={!done}>
              <b className="sp-display">{money(TOTAL)}</b>
              <span>paid out. All of it.</span>
            </div>
          </div>

          <div className="sp-pd-ledger" role="table" aria-label="A Friday night of trips">
            <div className="sp-pd-head">
              <span className="sp-display">Friday</span>
              <i>driver ledger</i>
            </div>
            <div className="sp-pd-rows">
              {TRIPS.map(([t, r, v], i) => (
                <div key={t} className={`sp-pd-row${i < shown ? ' in' : ''}`} aria-hidden={i >= shown}>
                  <span className="sp-pd-t">{t}</span>
                  <span className="sp-pd-r">{r}</span>
                  <b className="sp-display">{money(v)}</b>
                </div>
              ))}
            </div>
            <div className="sp-pd-cut">
              <span>Platform commission</span>
              <i aria-hidden="true" />
              {/* remounts on each landing so the zero visibly re-stamps */}
              <b className="sp-display" key={shown}>&minus;$0.00</b>
            </div>
            <div className="sp-pd-total">
              <span>You keep</span>
              <b className="sp-display">{money(total)}</b>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
