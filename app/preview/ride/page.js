import { APP_URLS } from '@/lib/app-links'
import { FinalCta } from '../Chrome'
import { Reveal, SplitText } from '../Reveal'
import RideJourney from './RideJourney'

/*
 * DESIGN SAMPLE — /preview/ride
 * The rider page. Its motion identity is THE TRIP: one pinned, full-bleed
 * map that plays a single ride end to end as you scroll. Everything else on
 * the page stays quieter so the journey owns the middle.
 */

export const metadata = { title: 'Ride | Spinr Design Sample' }

const LINES = [
  {
    k: 'Base + distance + time',
    v: '$14.20',
    note: 'What the trip itself costs. All of it goes to your driver.',
  },
  {
    k: 'Platform fee',
    v: '$1.00',
    note: 'Flat. The only thing Spinr charges — it never scales with the fare.',
  },
  {
    k: 'GST (5%)',
    v: '$0.76',
    note: 'Shown as its own line, the way a receipt should.',
  },
  {
    k: 'Surge',
    v: 'None',
    note: 'Not discounted. Not waived this week. Not a thing here.',
    red: true,
  },
]

const SAFETY = [
  ['Screened drivers', 'Criminal record check with vulnerable sector screening, renewed annually.'],
  ['Insured trips', 'Commercial ride-share insurance covers the whole trip, door to door.'],
  ['Share your ride', 'Send live trip progress to anyone you choose, for any ride.'],
  ['Help on hand', 'An SOS button alerts your emergency contacts and our safety team, and offers one-tap 911 — it never replaces calling 911.'],
]

const FAQ = [
  ['What if my driver takes a longer route?', 'The price you accepted is the price you pay. A detour is our problem to sort out with the driver, not a surprise on your receipt.'],
  ['Can I book ahead?', 'Yes — schedule a ride for later and we dispatch it when the time comes. Scheduled rides are never surge-priced, because nothing is.'],
  ['Do I need cash for a tip?', 'Tips are in the app and optional. 100% of a tip goes to the driver, always.'],
]

export default function RidePage() {
  return (
    <>
      {/* ── hero ── */}
      <header className="sp-rhero" id="top">
        <div className="sp-wrap">
          <span className="sp-hero-badge sp-ap" style={{ '--ap-delay': '520ms', '--ap-y': '16px' }}>
            Riding with Spinr
          </span>
          <h1 className="sp-display sp-rhero-h">
            <SplitText text="The price is the" start={100} />
            <br />
            <SplitText as="span" className="sp-rhero-hl" text="whole story." start={340} />
          </h1>
          <p className="sp-rhero-p sp-ap" style={{ '--ap-delay': '780ms', '--ap-y': '22px' }}>
            See the full fare before you book, watch your driver arrive,
            and pay exactly what you agreed to. That&rsquo;s the product.
          </p>
          <div className="sp-hero-btns sp-ap" style={{ '--ap-delay': '900ms', '--ap-y': '26px' }}>
            <a className="sp-btn" href={APP_URLS.rider.ios} target="_blank" rel="noopener noreferrer">App Store</a>
            <a className="sp-btn-ghost" href={APP_URLS.rider.android} target="_blank" rel="noopener noreferrer">Google Play</a>
          </div>
        </div>
        <span className="sp-rhero-road" aria-hidden="true"><i /><i /><i /></span>
      </header>

      {/* ── the trip ── */}
      <RideJourney />

      {/* ── anatomy of the fare ── */}
      <section className="sp-sec sp-anat" id="fare">
        <div className="sp-wrap">
          <Reveal>
            <span className="sp-kick">The receipt</span>
            <h2 className="sp-display sp-h2">Anatomy of a fare.</h2>
          </Reveal>
          <div className="sp-anat-g">
            <div className="sp-anat-paper">
              <p className="sp-display sp-anat-head">Broadway &rarr; YXE Airport</p>
              {LINES.map((l, i) => (
                <Reveal key={l.k} delay={i * 110} className="sp-anat-line">
                  <div className={`sp-anat-row${l.red ? ' is-red' : ''}`}>
                    <span>{l.k}</span>
                    <i aria-hidden="true" />
                    <b className="sp-display">{l.v}</b>
                  </div>
                  <p className="sp-anat-note sp-editorial">{l.note}</p>
                </Reveal>
              ))}
              <Reveal delay={520} className="sp-anat-line">
                <div className="sp-anat-row sp-anat-total">
                  <span>Total</span>
                  <i aria-hidden="true" />
                  <b className="sp-display">$15.96</b>
                </div>
                <p className="sp-anat-note sp-editorial">Of which $14.20 — the whole fare — goes to the driver.</p>
              </Reveal>
              <span className="sp-anat-tear" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* ── safety ── */}
      <section className="sp-sec sp-safe" id="safety">
        <div className="sp-wrap">
          <Reveal>
            <span className="sp-kick sp-kick-light">Safety</span>
            <h2 className="sp-display sp-h2 sp-safe-h">Boring, by design.</h2>
          </Reveal>
          <div className="sp-safe-g">
            {SAFETY.map(([t, p], i) => (
              <Reveal key={t} delay={i * 90} className="sp-safe-card">
                <span className="sp-safe-n sp-display" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="sp-display">{t}</h3>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── rider FAQ ── */}
      <section className="sp-sec" id="faq">
        <div className="sp-wrap sp-faqwrap">
          <div className="sp-faq-head">
            <h2 className="sp-display sp-faq-h">Fair questions</h2>
            <span className="sp-faq-arrow" aria-hidden="true">&darr;</span>
          </div>
          <div className="sp-faq">
            {FAQ.map(([q, a], i) => (
              <Reveal as="details" key={q} delay={i * 60}>
                <summary>
                  <span className="sp-display">{q}</span>
                  <span className="sp-faq-ic" aria-hidden="true" />
                </summary>
                <div className="sp-faq-a">{a}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FinalCta
        title={<>Your next ride knows<br />exactly what it costs.</>}
        sub="Riding in Saskatoon."
      />
    </>
  )
}
