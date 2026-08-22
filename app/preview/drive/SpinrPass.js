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
 * Pricing: three monthly tiers — Basic, Pro, Ultra — separated by how many
 * rides a day they allow. New drivers get 6 months free first.
 *
 * KNOWN: Basic $19.99 (introductory), Pro $49.99.
 * NOT KNOWN, rendered as bracketed slots: Ultra's price, and the rides-a-day
 * limit on all three.
 *
 * `introductory: true` renders a visible badge. That label is not decoration —
 * advertising a promotional price without saying it is promotional is
 * misleading, and this number also reaches drivers through the FAQ and, via
 * lib/kb-sync.js, through the AI assistant's answers. Never fill a bracketed
 * slot with a guess for the same reason.
 *
 * No promo end date is stated, because none was given. Do not add one.
 */

const TYPICAL_COMMISSION = 0.25
const PASS_STANDARD = 49.99

/* Monthly, to compare like with like against a monthly subscription. */
const MONTHS = [
  { k: 'A quiet month', gross: 1800 },
  { k: 'A steady month', gross: 5200 },
  { k: 'A big month', gross: 8000 },
]

const TIERS = [
  { name: 'Basic', price: '19.99', introductory: true, rides: '[N]' },
  { name: 'Pro', price: '49.99', introductory: false, rides: '[N]' },
  { name: 'Ultra', price: null, introductory: false, rides: '[N]' },
]

const money = (v) => '$' + v.toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
const MAX_TAKE = Math.max(...MONTHS.map((m) => m.gross * TYPICAL_COMMISSION))

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
          Spinr doesn&rsquo;t take a cut of your fares. You subscribe to the app —
          dispatch, in-app payments, support — for one flat amount, and everything
          you earn on top of it is yours.
        </p>

        <div className="sp-pass-price">
          <span className="sp-pass-offer sp-display">New drivers</span>
          <b className="sp-display sp-pass-free">6 months free</b>
          <span className="sp-pass-note">Then pick a plan. Flat monthly either way — never a share of a fare.</span>
        </div>

        <div className="sp-pass-tiers">
          {TIERS.map((t) => (
            <div className={`sp-pass-tier${t.introductory ? ' is-intro' : ''}`} key={t.name}>
              {t.introductory && <span className="sp-pass-badge sp-display">Introductory offer</span>}
              <span className="sp-pass-name sp-display">{t.name}</span>
              <b className="sp-display">
                {t.price ? <>${t.price}</> : <mark className="sp-todo">[PRICE]</mark>}
                <i>/month</i>
              </b>
              <span className="sp-pass-rides">
                Up to <mark className="sp-todo">[N]</mark> rides a day
              </span>
              {t.introductory && (
                <span className="sp-pass-after">Introductory rate &mdash; not the standard price.</span>
              )}
            </div>
          ))}
        </div>

        <h3 className="sp-display sp-pass-h3">What a percentage would have cost you</h3>
        <div className={`sp-pass-bars${on ? ' in' : ''}`}>
          {MONTHS.map((m, i) => {
            const take = m.gross * TYPICAL_COMMISSION
            return (
              <div className="sp-pass-row" key={m.k} style={{ '--d': `${i * 120}ms` }}>
                <div className="sp-pass-row-head">
                  <span>{m.k}</span>
                  <b>{money(m.gross)} earned</b>
                </div>
                <div className="sp-pass-track">
                  <i className="sp-pass-fill" style={{ '--w': `${(take / MAX_TAKE) * 100}%` }} />
                  <span className="sp-pass-take">&minus;{money(take)}</span>
                </div>
                <div className="sp-pass-vs">
                  <span className="sp-pass-flat" />
                  Spinr Pass (Pro): ${PASS_STANDARD} &mdash; the same, whatever you earned
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
