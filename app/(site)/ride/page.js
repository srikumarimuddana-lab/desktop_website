import { APP_URLS } from '@/lib/app-links'
import { FinalCta } from '../Chrome'
import { getFaqs, previewMetadata } from '@/lib/preview-content'
import { pickFaqs } from '@/lib/faq-fallback'
import SafeHtml from '@/components/ui/SafeHtml'
import { Reveal, SplitText } from '../Reveal'
import RideJourney from './RideJourney'
import RideRoute from './RideRoute'
import TripEstimate from './TripEstimate'

/*
 * /ride — the rider page.
 * The rider page. Its motion identity is THE TRIP: one pinned, full-bleed
 * map that plays a single ride end to end as you scroll. Everything else on
 * the page stays quieter so the journey owns the middle.
 */

export const revalidate = 0

export async function generateMetadata() {
  return previewMetadata('/ride', {
    title: 'Ride with Spinr | Flat fee, no surge, ever',
    description: 'See every line of the fare before you book — no surge multiplier, and the only fee Spinr keeps is a flat $1. Riding in Saskatoon with a proudly Canadian platform.',
  })
}

const LINES = [
  {
    k: 'Ride fare (12.4 km)',
    v: '$14.20',
    to: 'your driver', toCls: 'drv',
    note: 'Base + distance + time. All of it goes to your driver.',
  },
  {
    k: 'Booking fee',
    v: '$1.00',
    to: 'Spinr', toCls: 'us',
    note: 'The only line on this receipt Spinr keeps. Flat, forever.',
  },
  {
    k: 'Insurance fee',
    v: '$0.50*',
    to: 'the insurer', toCls: 'thru',
    note: 'Commercial ride-share coverage for the whole trip — collected and passed straight through.',
  },
  {
    k: 'City & infrastructure fees',
    v: '$0.30*',
    to: 'your city', toCls: 'thru',
    note: 'Charged only where your city sets one — at the city\u2019s rate, under the city\u2019s name.',
  },
  {
    k: 'Airport surcharge',
    v: '\u2014',
    to: 'the airport', toCls: 'thru',
    note: 'Only when a trip touches the airport — named on the estimate before you book.',
    dim: true,
  },
  {
    k: 'Surge',
    v: 'None',
    note: 'Not discounted. Not waived this week. Not a thing here.',
    red: true,
  },
  {
    k: 'GST (5%)',
    v: '$0.80',
    to: 'the government', toCls: 'thru',
    note: 'Tax on its own line, the way a receipt should.',
  },
]

const SAFETY = [
  ['Screened drivers', 'Criminal record check with vulnerable sector screening, renewed annually.'],
  ['Insured trips', 'Commercial ride-share insurance covers the whole trip, door to door.'],
  ['Share your ride', 'Send live trip progress to anyone you choose, for any ride.'],
  ['Help on hand', 'An SOS button alerts your emergency contacts and our safety team, and offers one-tap 911 — it never replaces calling 911.'],
]

/* Fallback only — rider FAQs are read from the CMS at request time. */
const FAQ_FALLBACK = pickFaqs([
  'What fees can appear on my receipt?',
  'Which of these fees does Spinr keep?',
  'What if my driver takes a longer route?',
  'Can I book ahead?',
  'Do I need cash for a tip?',
])

export default async function RidePage() {
  const faq = await getFaqs({ categories: ['rider'], limit: 6, fallback: FAQ_FALLBACK })
  return (
    <>
      {/* ── hero ── */}
      <header className="sp-rhero" id="top">
        <RideRoute />
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
                  <div className={`sp-anat-row${l.red ? ' is-red' : ''}${l.dim ? ' is-dim' : ''}`}>
                    <span>{l.k}</span>
                    {l.to && <em className={`sp-anat-to ${l.toCls}`}>&rarr; {l.to}</em>}
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
                  <b className="sp-display">$16.80</b>
                </div>
                <p className="sp-anat-note sp-editorial">*Sample amounts — your estimate shows the exact fees for your trip before you book.</p>
              </Reveal>
              <Reveal delay={640} className="sp-anat-line">
                <div className="sp-anat-keep" aria-label="Of this receipt, Spinr keeps $1.00">
                  <span>Of all this, Spinr keeps</span>
                  <b className="sp-display">$1.00</b>
                </div>
              </Reveal>
              <span className="sp-anat-tear" aria-hidden="true" />
            </div>
          </div>
          <Reveal delay={120}>
            <p className="sp-anat-vow">
              Spinr keeps exactly one line of this receipt: the $1 booking fee.
              Every other charge is collected for someone else — the fare for your
              driver, insurance for the insurer, city fees for your city, tax for the
              government — and passed straight through, <em className="sp-editorial">never marked up</em>.
              If a fee isn&rsquo;t on this list, we can&rsquo;t charge it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── price your own trip ── */}
      <section className="sp-sec sp-estsec" id="estimate">
        <div className="sp-wrap">
          <Reveal>
            <span className="sp-kick">Before you book</span>
            <h2 className="sp-display sp-h2">Price your own trip.</h2>
            <p className="sp-lede sp-estsec-lede">
              Two addresses, a real driving distance, and the same maths the app
              uses. No account, no app, no catch.
            </p>
          </Reveal>
          <Reveal delay={90}>
            <TripEstimate />
          </Reveal>
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
            {faq.map(([q, a], i) => (
              <Reveal as="details" key={q} delay={i * 60}>
                <summary>
                  <span className="sp-display">{q}</span>
                  <span className="sp-faq-ic" aria-hidden="true" />
                </summary>
                <SafeHtml className="sp-faq-a" content={a} />
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
