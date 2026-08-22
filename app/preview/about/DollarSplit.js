'use client'

import { useEffect, useRef, useState } from 'react'

/*
 * Where the money goes: a single fare bar that splits itself when it comes
 * into view. Deliberately shows the platform's own slice at zero, because
 * that is the number the rest of the site is built on.
 */

const PARTS = [
  { k: 'To the driver', v: 100, cls: 'drv' },
  { k: 'Spinr’s cut of the fare', v: 0, cls: 'cut' },
]

export default function DollarSplit() {
  const ref = useRef(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setOn(true); return }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setOn(true); io.disconnect() }
    }, { threshold: 0.35 })
    io.observe(el.querySelector('.sp-split-bar') || el)
    return () => io.disconnect()
  }, [])

  return (
    <section className="sp-sec sp-split" id="money" ref={ref}>
      <div className="sp-wrap">
        <span className="sp-kick">Where the money goes</span>
        <h2 className="sp-display sp-h2">Follow one fare.</h2>

        <div className={`sp-split-bar${on ? ' in' : ''}`} aria-hidden="true">
          <span className="sp-split-fill" />
          <b className="sp-display">$14.20</b>
        </div>

        <dl className="sp-split-legend">
          {PARTS.map((p) => (
            <div key={p.k} className={`sp-split-item ${p.cls}`}>
              <dt>{p.k}</dt>
              <dd className="sp-display">{p.v}%</dd>
            </div>
          ))}
        </dl>

        <p className="sp-split-note">
          Spinr is paid by the rider&rsquo;s flat <strong>$1</strong> platform fee and by
          corporate accounts — a fixed amount that doesn&rsquo;t care how long your trip
          was or what time you took it. That is the entire business model, and it is
          the reason the driver&rsquo;s column can read 100%.
        </p>
      </div>
    </section>
  )
}
