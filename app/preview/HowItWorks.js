'use client'

import { useEffect, useRef, useState } from 'react'
import AppMap from './AppMap'

/*
 * Scroll-driven "How it works".
 *
 * The interaction idea — pin the section, advance steps as you scroll, keep a
 * phone in view whose screen changes with the step — is borrowed. The structure
 * is ours: instead of a horizontal track and a tab dock, the steps hang off a
 * vertical ROUTE LINE, because a Spinr journey has stops. The line draws itself
 * as you scroll, the way a trip progresses on a map.
 *
 * Scroll drives two things, not one: which step is active, AND how far through
 * that step you are. The second is what makes the phone feel live — the address
 * types itself, the price builds a row at a time, the car drives the route.
 *
 * Narrow screens and reduced-motion visitors get the unpinned layout, but the
 * phone still follows along: the step nearest the middle of the viewport is the
 * one on screen.
 */

const STEPS = [
  {
    n: '01',
    t: 'Set your destination',
    p: 'Open the app and enter where you are going. Saved places are one tap away.',
  },
  {
    n: '02',
    t: 'See the price first',
    p: 'The full fare appears before you confirm — itemised down to the tax, with no surge line to find later.',
  },
  {
    n: '03',
    t: 'Ride',
    p: 'Track your driver in real time and share the trip with whoever you like.',
  },
]

const clamp01 = (v) => Math.min(1, Math.max(0, v))

export default function HowItWorks() {
  const wrapRef = useRef(null)
  const listRef = useRef(null)
  const [step, setStep] = useState(0)
  const [local, setLocal] = useState(0)
  const [progress, setProgress] = useState(0)
  /* 'pinned' pins the stage and reads the whole timeline off it; 'flow' keeps
   * the normal layout but still lets scroll pick the step; 'still' is the
   * reduced-motion resting state, where scrolling changes nothing. */
  const [mode, setMode] = useState('still')
  const pinned = mode === 'pinned'

  useEffect(() => {
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mqWide = window.matchMedia('(min-width: 900px)')

    const decide = () =>
      setMode(mqMotion.matches ? 'still' : mqWide.matches ? 'pinned' : 'flow')
    decide()
    mqMotion.addEventListener('change', decide)
    mqWide.addEventListener('change', decide)
    return () => {
      mqMotion.removeEventListener('change', decide)
      mqWide.removeEventListener('change', decide)
    }
  }, [])

  useEffect(() => {
    if (mode === 'still') {
      setStep(0); setLocal(1); setProgress(1)
      return
    }
    let frame = 0

    /* Pinned: the section is 3 viewports tall and the stage sticks. How far we
     * are through it is the whole timeline. */
    const pinnedTick = () => {
      const el = wrapRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      if (travel <= 0) return
      const p = clamp01(-rect.top / travel)
      const scaled = p * STEPS.length
      const i = Math.min(STEPS.length - 1, Math.floor(scaled))
      setProgress(p)
      setStep(i)
      setLocal(clamp01(scaled - i))
    }

    /* Unpinned: no timeline to read, so the step nearest a focus line drives
     * the phone, and its own travel past that line drives the detail. */
    const flowTick = () => {
      const list = listRef.current
      if (!list) return
      const items = [...list.querySelectorAll('li')]
      if (!items.length) return
      const focus = window.innerHeight * 0.45
      let best = 0
      let bestDist = Infinity
      items.forEach((li, i) => {
        const r = li.getBoundingClientRect()
        const d = Math.abs(r.top + r.height / 2 - focus)
        if (d < bestDist) { bestDist = d; best = i }
      })
      const r = items[best].getBoundingClientRect()
      setStep(best)
      setLocal(clamp01((focus + r.height * 0.6 - r.top) / (r.height * 1.2)))
      setProgress((best + 1) / STEPS.length)
    }

    const tick = mode === 'pinned' ? pinnedTick : flowTick
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

  return (
    <section
      className={`sp-sec sp-hiw${pinned ? ' is-pinned' : ''}${mode === 'still' ? ' is-still' : ''}`}
      id="how"
      ref={wrapRef}
    >
      <div className="sp-hiw-stage">
        <div className="sp-wrap sp-hiw-g">
          {/* ── route rail + steps ── */}
          <div className="sp-hiw-copy">
            <span className="sp-kick">How it works</span>
            <h2 className="sp-display sp-h2">Three stops, start to finish.</h2>

            <ol className="sp-route" style={{ '--p': progress }} ref={listRef}>
              <span className="sp-route-line" aria-hidden="true">
                <i className="sp-route-fill" />
              </span>
              {STEPS.map((s, i) => (
                <li
                  key={s.n}
                  className={i === step ? 'is-on' : i < step ? 'is-done' : ''}
                  aria-current={i === step ? 'step' : undefined}
                >
                  <span className="sp-route-dot" aria-hidden="true" />
                  <div className="sp-route-tx">
                    <span className="sp-display sp-route-n">{s.n}</span>
                    <b>{s.t}</b>
                    <p>{s.p}</p>
                  </div>
                </li>
              ))}
            </ol>

            <a className="sp-btn sp-hiw-cta" href="#get">Get Spinr</a>
          </div>

          {/* ── phone ── */}
          <div className="sp-hiw-phone">
            <div className="sp-hiw-frame">
              <span className="sp-hiw-notch" aria-hidden="true" />
              <div className="sp-hiw-screens">
                <Screen1 on={step === 0} t={step === 0 ? local : 1} />
                <Screen2 on={step === 1} t={step === 1 ? local : step > 1 ? 1 : 0} />
                <Screen3 on={step === 2} t={step === 2 ? local : 0} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── the three app screens, built in markup rather than screenshots ── */

const DEST = 'Broadway Ave'

function Screen1({ on, t }) {
  const typed = DEST.slice(0, Math.round(clamp01(t * 2.2) * DEST.length))
  const rows = [
    ['★', 'Home', 'Nutana'],
    ['◧', 'Work', 'River Landing'],
    ['✈', 'YXE Airport', '2 Airport Dr'],
  ]
  return (
    <div className={`sp-scr${on ? ' on' : ''}`} aria-hidden={!on}>
      <p className="sp-scr-k">Where to?</p>
      <div className="sp-scr-field">
        <span className="sp-scr-pin" aria-hidden="true" />
        {typed}
        {typed.length < DEST.length && <i className="sp-caret" aria-hidden="true" />}
      </div>
      <ul className="sp-scr-list">
        {rows.map(([ic, a, b], i) => (
          <li key={a} className={t > 0.34 + i * 0.16 ? 'in' : ''}>
            <span className="sp-scr-ic" aria-hidden="true">{ic}</span>
            <div><b>{a}</b><i>{b}</i></div>
          </li>
        ))}
      </ul>
      <div className="sp-scr-mapwrap">
        <AppMap route={false} pins={false} />
      </div>
    </div>
  )
}

const PRICE = [
  ['Fare', '$14.20'],
  ['Platform fee', '$1.00'],
  ['GST (5%)', '$0.76'],
  ['Surge', 'None'],
]

function Screen2({ on, t }) {
  return (
    <div className={`sp-scr${on ? ' on' : ''}`} aria-hidden={!on}>
      <p className="sp-scr-k">Your price</p>
      <div className="sp-scr-mapwrap sp-scr-mapwrap-sm">
        <AppMap t={clamp01(t * 1.5)} pins={false} view="wide" />
      </div>
      <div className="sp-scr-card">
        {PRICE.map(([k, v], i) => (
          <div
            key={k}
            className={`sp-scr-row${k === 'Surge' ? ' sp-scr-row-flat' : ''}${t > 0.18 + i * 0.13 ? ' in' : ''}`}
          >
            <span>{k}</span><b>{v}</b>
          </div>
        ))}
        <div className={`sp-scr-total${t > 0.72 ? ' in' : ''}`}><span>Total</span><b>$15.96</b></div>
      </div>
      <div className="sp-scr-go">Confirm ride</div>
    </div>
  )
}

function Screen3({ on, t }) {
  const mins = Math.max(1, Math.ceil(6 - t * 5))
  return (
    <div className={`sp-scr${on ? ' on' : ''}`} aria-hidden={!on}>
      <p className="sp-scr-k">On the way</p>
      <div className="sp-scr-mapwrap">
        <AppMap t={t} />
      </div>
      <div className="sp-scr-card sp-scr-driver">
        <div className="sp-scr-avatar" aria-hidden="true" />
        <div>
          <b>Your driver is {mins} min away</b>
          <i>Grey Corolla &middot; SGI insured</i>
        </div>
      </div>
      <div className="sp-scr-bar" aria-hidden="true"><i style={{ transform: `scaleX(${clamp01(t)})` }} /></div>
      <div className="sp-scr-go sp-scr-go-ghost">Share trip</div>
    </div>
  )
}
