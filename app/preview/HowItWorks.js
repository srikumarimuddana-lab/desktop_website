'use client'

import { useEffect, useRef, useState } from 'react'

/*
 * Scroll-driven "How it works".
 *
 * The interaction idea — pin the section, advance steps as you scroll, keep a
 * phone in view whose screen changes with the step — is borrowed. The structure
 * is ours: instead of a horizontal track and a tab dock, the steps hang off a
 * vertical ROUTE LINE, because a Spinr journey has stops. The line draws itself
 * as you scroll, the way a trip progresses on a map.
 *
 * Falls back to a plain stacked list when the viewport is small or the visitor
 * prefers reduced motion — no pinning, no scroll maths.
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

export default function HowItWorks() {
  const wrapRef = useRef(null)
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [pinned, setPinned] = useState(false)

  useEffect(() => {
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mqWide = window.matchMedia('(min-width: 900px)')

    const decide = () => setPinned(mqWide.matches && !mqMotion.matches)
    decide()
    mqMotion.addEventListener('change', decide)
    mqWide.addEventListener('change', decide)
    return () => {
      mqMotion.removeEventListener('change', decide)
      mqWide.removeEventListener('change', decide)
    }
  }, [])

  useEffect(() => {
    if (!pinned) { setStep(0); setProgress(0); return }
    let frame = 0

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const el = wrapRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const travel = rect.height - window.innerHeight
        if (travel <= 0) return
        const raw = (-rect.top) / travel
        const clamped = Math.min(1, Math.max(0, raw))
        setProgress(clamped)
        // three equal bands, with the last band held so step 3 stays put at the end
        setStep(Math.min(STEPS.length - 1, Math.floor(clamped * STEPS.length)))
      })
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
    <section
      className={`sp-sec sp-hiw${pinned ? ' is-pinned' : ''}`}
      id="how"
      ref={wrapRef}
    >
      <div className="sp-hiw-stage">
        <div className="sp-wrap sp-hiw-g">
          {/* ── route rail + steps ── */}
          <div className="sp-hiw-copy">
            <span className="sp-kick">How it works</span>
            <h2 className="sp-display sp-h2">Three stops, start to finish.</h2>

            <ol className="sp-route" style={{ '--p': progress }}>
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
                <Screen1 on={step === 0} />
                <Screen2 on={step === 1} />
                <Screen3 on={step === 2} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── the three app screens, built in markup rather than screenshots ── */

function Screen1({ on }) {
  return (
    <div className={`sp-scr${on ? ' on' : ''}`} aria-hidden={!on}>
      <p className="sp-scr-k">Where to?</p>
      <div className="sp-scr-field">
        <span className="sp-scr-pin" aria-hidden="true" />
        Broadway Ave
      </div>
      <ul className="sp-scr-list">
        <li><span className="sp-scr-ic" aria-hidden="true">★</span><div><b>Home</b><i>Nutana</i></div></li>
        <li><span className="sp-scr-ic" aria-hidden="true">◧</span><div><b>Work</b><i>River Landing</i></div></li>
        <li><span className="sp-scr-ic" aria-hidden="true">✈</span><div><b>YXE Airport</b><i>2 Airport Dr</i></div></li>
      </ul>
    </div>
  )
}

function Screen2({ on }) {
  return (
    <div className={`sp-scr${on ? ' on' : ''}`} aria-hidden={!on}>
      <p className="sp-scr-k">Your price</p>
      <div className="sp-scr-map sp-scr-map-sm" aria-hidden="true">
        <span className="sp-scr-route" />
        <span className="sp-scr-car" />
      </div>
      <div className="sp-scr-card">
        <div className="sp-scr-row"><span>Fare</span><b>$14.20</b></div>
        <div className="sp-scr-row"><span>Platform fee</span><b>$1.00</b></div>
        <div className="sp-scr-row"><span>GST (5%)</span><b>$0.76</b></div>
        <div className="sp-scr-row sp-scr-row-flat"><span>Surge</span><b>None</b></div>
        <div className="sp-scr-total"><span>Total</span><b>$15.96</b></div>
      </div>
      <div className="sp-scr-go">Confirm ride</div>
    </div>
  )
}

function Screen3({ on }) {
  return (
    <div className={`sp-scr${on ? ' on' : ''}`} aria-hidden={!on}>
      <p className="sp-scr-k">On the way</p>
      <div className="sp-scr-map" aria-hidden="true">
        <span className="sp-scr-route" />
        <span className="sp-scr-car" />
      </div>
      <div className="sp-scr-card sp-scr-driver">
        <div className="sp-scr-avatar" aria-hidden="true" />
        <div>
          <b>Your driver is 4 min away</b>
          <i>Grey Corolla &middot; SGI insured</i>
        </div>
      </div>
      <div className="sp-scr-go sp-scr-go-ghost">Share trip</div>
    </div>
  )
}
