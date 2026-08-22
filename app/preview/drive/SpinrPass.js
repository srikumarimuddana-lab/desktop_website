'use client'

import { useEffect, useRef, useState } from 'react'

/*
 * THE SPINR PASS — the driver side of the business model.
 *
 * Spinr does not take a commission; drivers subscribe for access to the
 * platform instead. That is the argument this section has to make, and the
 * argument is arithmetic: a commission is a percentage, so it grows every
 * time the driver has a better week. A subscription does not. On a slow week
 * a percentage looks cheap; on a good week it is the most expensive thing a
 * driver pays for.
 *
 * The bars are drawn to scale from the numbers below, so the shape of the
 * claim is honest even while the price itself is still a placeholder.
 *
 * PLACEHOLDERS: price and billing period are not yet set. They render as
 * visibly bracketed slots — never invent a number here. The same wording
 * flows into the FAQ and, through lib/kb-sync.js, into the AI assistant's
 * retrieval corpus, so a made-up price would be quoted to drivers as fact.
 */

const TYPICAL_COMMISSION = 0.25

const WEEKS = [
  { k: 'A quiet week', gross: 420 },
  { k: 'A normal week', gross: 1204 },
  { k: 'A big week', gross: 1860 },
]

const money = (v) => '$' + v.toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
const MAX_TAKE = Math.max(...WEEKS.map((w) => w.gross * TYPICAL_COMMISSION))

export default function SpinrPass() {
  const ref = useRef(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setOn(true); return }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setOn(true); io.disconnect() }
    }, { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className="sp-sec sp-pass" id="pass" ref={ref}>
      <div className="sp-wrap">
        <span className="sp-kick">The Spinr Pass</span>
        <h2 className="sp-display sp-h2">A subscription, not a slice.</h2>
        <p className="sp-pass-lede">
          Spinr doesn&rsquo;t take a cut of your fares. You subscribe to the platform —
          the driver app, dispatch, in-app payments and support — for one flat amount,
          and everything you earn on top of it is yours.
        </p>

        <div className="sp-pass-price">
          <span className="sp-pass-k">Spinr Pass</span>
          <b className="sp-display">
            <mark className="sp-todo">[PRICE]</mark>
            <i>/ <mark className="sp-todo">[PERIOD]</mark></i>
          </b>
          <span className="sp-pass-note">Flat. Published. The same whether you drive ten trips or a hundred.</span>
        </div>

        <h3 className="sp-display sp-pass-h3">What a percentage would have cost you</h3>
        <div className={`sp-pass-bars${on ? ' in' : ''}`}>
          {WEEKS.map((w, i) => {
            const take = w.gross * TYPICAL_COMMISSION
            return (
              <div className="sp-pass-row" key={w.k} style={{ '--d': `${i * 120}ms` }}>
                <div className="sp-pass-row-head">
                  <span>{w.k}</span>
                  <b>{money(w.gross)} earned</b>
                </div>
                <div className="sp-pass-track">
                  <i className="sp-pass-fill" style={{ '--w': `${(take / MAX_TAKE) * 100}%` }} />
                  <span className="sp-pass-take">&minus;{money(take)}</span>
                </div>
                <div className="sp-pass-vs">
                  <span className="sp-pass-flat" />
                  Spinr Pass: <mark className="sp-todo">[PRICE]</mark>, whatever you earned
                </div>
              </div>
            )
          })}
        </div>
        <p className="sp-pass-fine">
          *A 25% commission is illustrative — rates on other platforms commonly run
          20&ndash;30% and vary by market. The point isn&rsquo;t the exact rate: it&rsquo;s that a
          percentage takes more from you the better your week goes, and a flat
          subscription doesn&rsquo;t.
        </p>
      </div>
    </section>
  )
}
