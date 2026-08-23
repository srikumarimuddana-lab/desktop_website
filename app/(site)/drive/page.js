import Link from 'next/link'
import { previewMetadata } from '@/lib/preview-content'
import { APP_URLS } from '@/lib/app-links'
import { FinalCta } from '../Chrome'
import { Reveal, SplitText } from '../Reveal'
import PhoneFan from '../PhoneFan'
import Payday from './Payday'
import SpinrPass from './SpinrPass'

/*
 * DESIGN SAMPLE — /drive
 * The driver page. Its motion identity is THE PAYDAY: a pinned ledger where a
 * Friday night's trips land one by one and the commission line never moves.
 * Uses the DRIVER app store links, not the rider ones.
 */

export const revalidate = 0

export async function generateMetadata() {
  return previewMetadata('/drive', {
    title: 'Drive | Spinr Design Sample',
    description: 'Keep 100% of the fare. Design sample.',
  })
}

const COMPARE = {
  typical: [
    ['Fare', '$20.00'],
    ['Platform commission (~25%)*', '−$5.00'],
    ['You keep', '$15.00'],
  ],
  spinr: [
    ['Fare', '$20.00'],
    ['Platform commission', '−$0.00'],
    ['You keep', '$20.00'],
  ],
}

const REQS = [
  ['Full driver’s licence', 'Held for three years or more.'],
  ['Background check', 'Criminal record check with vulnerable sector screening, renewed annually.'],
  ['A roadworthy car', 'Under ten years old, with an annual inspection.'],
  ['Ride-share insurance', 'A commercial ride-share endorsement on your policy.'],
]

const STEPS = [
  ['Apply in the app', 'Ten minutes, from your phone. No office visit.'],
  ['Get screened', 'Background check and vehicle inspection — we walk you through both.'],
  ['Go online', 'Take your first trip and keep the whole fare.'],
]

export default function DrivePage() {
  return (
    <>
      {/* ── hero ── */}
      <header className="sp-dhero" id="top">
        <div className="sp-wrap sp-dhero-in">
          <div>
            <span className="sp-hero-badge sp-ap" style={{ '--ap-delay': '520ms', '--ap-y': '16px' }}>
              Driving with Spinr
            </span>
            <h1 className="sp-display sp-dhero-h">
              <SplitText text="You drive." start={100} />
              <br />
              <SplitText as="span" className="sp-dhero-hl" text="You keep it." start={300} />
            </h1>
            <p className="sp-dhero-p sp-ap" style={{ '--ap-delay': '760ms', '--ap-y': '22px' }}>
              Spinr never takes a percentage of your fare — the number you accept is
              the number you are paid. Independent, on your own schedule, in Saskatoon.
            </p>
            <div className="sp-hero-btns sp-dhero-btns sp-ap" style={{ '--ap-delay': '880ms', '--ap-y': '26px' }}>
              <a className="sp-btn" href={APP_URLS.driver.ios} target="_blank" rel="noopener noreferrer">
                Driver app &middot; App Store
              </a>
              <a className="sp-btn-ghost" href={APP_URLS.driver.android} target="_blank" rel="noopener noreferrer">
                Google Play
              </a>
            </div>
          </div>
          <div className="sp-dhero-fan">
            <PhoneFan force="driver" />
          </div>
        </div>
      </header>

      {/* ── the payday ── */}
      <Payday />

      {/* ── what Spinr actually charges ── */}
      <SpinrPass />

      {/* ── side by side ── */}
      <section className="sp-sec sp-cmp" id="compare">
        <div className="sp-wrap">
          <Reveal>
            <span className="sp-kick">Same trip, two receipts</span>
            <h2 className="sp-display sp-h2">Spot the difference.</h2>
          </Reveal>
          <div className="sp-cmp-g">
            <Reveal className="sp-cmp-card sp-cmp-them" delay={60}>
              <h3 className="sp-display">A typical app</h3>
              {COMPARE.typical.map(([k, v]) => (
                <div key={k} className="sp-cmp-row"><span>{k}</span><b className="sp-display">{v}</b></div>
              ))}
            </Reveal>
            <Reveal className="sp-cmp-card sp-cmp-us" delay={180}>
              <h3 className="sp-display">Spinr</h3>
              {COMPARE.spinr.map(([k, v]) => (
                <div key={k} className="sp-cmp-row"><span>{k}</span><b className="sp-display">{v}</b></div>
              ))}
              <span className="sp-cmp-badge sp-display" aria-hidden="true">+$5.00 / trip</span>
            </Reveal>
          </div>
          <p className="sp-cmp-fine">
            *Illustrative — commissions on other platforms commonly run in the 20&ndash;30% range and vary by market.
            Spinr&rsquo;s $0.00 is not illustrative.
          </p>
        </div>
      </section>

      {/* ── requirements ── */}
      <section className="sp-sec sp-req" id="requirements">
        <div className="sp-wrap">
          <Reveal>
            <span className="sp-kick">Before you start</span>
            <h2 className="sp-display sp-h2">What you&rsquo;ll need.</h2>
          </Reveal>
          <div className="sp-req-g">
            {REQS.map(([t, p], i) => (
              <Reveal key={t} delay={i * 90} className="sp-req-card">
                <span className="sp-req-check" aria-hidden="true">&#10003;</span>
                <h3 className="sp-display">{t}</h3>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
          <p className="sp-req-more">
            <Link href="/drive/requirements">The full list, in detail &rarr;</Link>
          </p>
        </div>
      </section>

      {/* ── three steps ── */}
      <section className="sp-sec sp-steps" id="start">
        <div className="sp-wrap">
          <Reveal>
            <span className="sp-kick sp-kick-light">Getting started</span>
            <h2 className="sp-display sp-h2 sp-steps-h">Three steps to your first fare.</h2>
          </Reveal>
          <ol className="sp-steps-g">
            {STEPS.map(([t, p], i) => (
              <Reveal as="li" key={t} delay={i * 120} className="sp-steps-card">
                <span className="sp-display sp-steps-n">{i + 1}</span>
                <h3 className="sp-display">{t}</h3>
                <p>{p}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <FinalCta
        store="driver"
        title={<>Your car. Your hours.<br />Your fare.</>}
        sub="Driving in Saskatoon."
      />
    </>
  )
}
