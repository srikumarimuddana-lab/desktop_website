import Image from 'next/image'
import { APP_URLS } from '@/lib/app-links'
import FareCalc from './FareCalc'
import PhoneFan from './PhoneFan'
import HowItWorks from './HowItWorks'
import AiChat from './AiChat'
import { FinalCta } from './Chrome'
import { Reveal, CountUp, Marquee, SplitText } from './Reveal'

/*
 * DESIGN SAMPLE — /preview home.
 * A ledger-paper + hard-offset-shadow treatment of the Spinr homepage.
 * Shell (nav, footer, dock, cursor, stylesheet) lives in layout.js.
 */

const STATS = [
  { to: 0,   suffix: '%',  l: 'commission, forever' },
  { to: 1,   prefix: '$',  l: 'flat fee per trip' },
  { to: 1,   suffix: '\u00D7', decimals: 1, l: 'surge, always' },
  { to: 100, suffix: '%',  l: 'of net fare to the driver' },
]

const WHY = [
  {
    t: 'Make every fare count',
    p: 'Drivers keep 100% of the net fare. No per-trip cut, no rising take rate, no penalty for going offline.',
    bg: '#FFE7EA', ink: '#7A1024', border: '#E08795', art: 'receipt',
  },
  {
    t: 'The price you saw is the price you pay',
    p: 'No surge multiplier waiting at checkout. Same trip, same fare — rush hour, last call, or a January whiteout.',
    bg: '#DBF3F1', ink: '#0F4C5C', border: '#2E7BA6', art: 'surge',
  },
  {
    t: '100% Canadian owned and operated',
    p: 'Every driver is background-checked and carries commercial ride-share insurance for the whole trip.',
    bg: '#FFEFC9', ink: '#6E4E00', border: '#C79A1E', art: 'verify',
  },
]

const RECEIPT = [
  ['Fare', '$14.20', false],
  ['Platform fee', '$1.00', false],
  ['Surge', 'None', false],
  ['Driver keeps', '$14.20', true],
]

const SURGE = [
  ['Tuesday, 9am', '$15.20'],
  ['Friday, 2am', '$15.20'],
  ['Blizzard, \u221230\u00B0', '$15.20'],
]

const VERIFY = [
  'Criminal record check',
  'Vulnerable sector screening',
  'Commercial ride-share insurance',
  'Full licence, 3+ years driving',
]

function CardArt({ kind }) {
  if (kind === 'surge') {
    return (
      <div className="sp-tickets">
        {SURGE.map(([when, price]) => (
          <span className="sp-ticket" key={when}><b>{when}</b><i>{price}</i></span>
        ))}
        <span className="sp-ticket sp-ticket-win"><b>Surge multiplier</b><i>1.0&times;</i></span>
      </div>
    )
  }
  if (kind === 'verify') {
    return (
      <div className="sp-tickets">
        {VERIFY.map((v) => (
          <span className="sp-ticket sp-ticket-check" key={v}><b>{v}</b><i aria-hidden="true">&#10003;</i></span>
        ))}
      </div>
    )
  }
  return (
    <div className="sp-tickets">
      {RECEIPT.map(([k, v, win]) => (
        <span className={`sp-ticket${win ? ' sp-ticket-win' : ''}`} key={k}><b>{k}</b><i>{v}</i></span>
      ))}
    </div>
  )
}

const FAQ = [
  ['Where can I use Spinr?', 'Spinr is available in Saskatoon, Saskatchewan. There is no planned launch in any other city at this time.'],
  ['What does a ride actually cost?', 'The fare, plus a flat $1 platform fee. That fee does not scale with your distance, your fare, or the time of day, and there is no surge multiplier on top of it.'],
  ['How do drivers keep 100%?', 'Spinr takes 0% commission on consumer rides. The platform is funded by the flat rider fee and by corporate accounts — never by a cut of the driver’s fare.'],
  ['Who is driving me?', 'Every driver passes a criminal record check with vulnerable sector screening, holds a full driver\u2019s licence with at least three years of experience, and carries commercial ride-share insurance.'],
  ['Is Spinr Canadian?', 'Yes — 100% Canadian owned and operated, with a support team based in Saskatchewan.'],
]

export default function PreviewPage() {
  return (
    <>
        {/* ── Hero ──────────────────────────────────────────── */}
        <header className="sp-hero" id="top">
          <span className="sp-hero-shelf" aria-hidden="true" />

          <div className="sp-hero-copy">
            <span className="sp-hero-badge sp-ap" style={{ '--ap-delay': '620ms', '--ap-y': '18px' }}>
              100% Canadian owned and operated &middot; Saskatoon
            </span>
            <h1 className="sp-display sp-hero-h">
              <SplitText text="Every fare," start={120} />
              <br />
              <SplitText as="span" className="sp-hero-hl" text="straight to the driver." start={300} />
            </h1>
            <div className="sp-hero-btns sp-ap" style={{ '--ap-delay': '740ms', '--ap-y': '26px' }}>
              <a className="sp-btn" href={APP_URLS.rider.ios} target="_blank" rel="noopener noreferrer">
                App Store
              </a>
              <a className="sp-btn-ghost" href={APP_URLS.rider.android} target="_blank" rel="noopener noreferrer">
                Google Play
              </a>
            </div>
          </div>

          <PhoneFan />
        </header>

        {/* ── Trust band ────────────────────────────────────── */}
        <section className="sp-band">
          <div className="sp-wrap">
            <div className="sp-band-stats">
              {STATS.map((s, i) => (
                <Reveal className="sp-stat" key={s.l} delay={i * 90}>
                  <b className="sp-display">
                    <CountUp to={s.to} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals || 0} />
                  </b>
                  <span>{s.l}</span>
                </Reveal>
              ))}
            </div>
            <div className="sp-band-foot">
              <span className="sp-band-lbl">Every driver is screened</span>
              <div className="sp-band-names">
                <i>Criminal record check</i>
                <i>Vulnerable sector screening</i>
                <i>Commercial ride-share insurance</i>
                <i>Annual vehicle inspection</i>
              </div>
            </div>
          </div>
        </section>

        {/* ── ticker ────────────────────────────────────────── */}
        <Marquee items={['0% commission', 'flat $1 fee', 'no surge, ever', '100% Canadian owned and operated', 'Saskatoon']} />

        {/* ── Why Spinr — sticky stacking cards ─────────────── */}
        <section className="sp-sec" id="why">
          <div className="sp-wrap">
            <h2 className="sp-display sp-h2">
              <SplitText text="Why ride with" />{' '}
              <SplitText as="span" className="sp-accent" text="Spinr." start={230} />
            </h2>
            <div className="sp-roll">
              {WHY.map((c, i) => (
                <article
                  key={c.t}
                  className="sp-rcard"
                  style={{ '--i': i, '--pc': c.bg, '--tc': c.ink, '--bd': c.border }}
                >
                  <div className="sp-rcard-copy">
                    <span className="sp-rcard-n sp-display">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="sp-display sp-rcard-h">{c.t}</h3>
                    <p className="sp-rcard-p">{c.p}</p>
                  </div>
                  <div className="sp-rcard-art">
                    <CardArt kind={c.art} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works — scroll-driven ─────────────────── */}
        <HowItWorks />

        {/* ── AI assistant ──────────────────────────────────── */}
        <AiChat />


        {/* ── The math / calculator ─────────────────────────── */}
        <section className="sp-sec sp-calc" id="math">
          <div className="sp-wrap">
            <FareCalc />
          </div>
        </section>

        {/* ── Drivers ───────────────────────────────────────── */}
        <section className="sp-sec sp-drive" id="drive">
          <div className="sp-wrap sp-drive-g">
            <div className="sp-drive-art">
              <Image src="/driver_feature.png" alt="A Spinr driver" width={900} height={700} sizes="(max-width: 900px) 90vw, 520px" />
            </div>
            <div>
              <span className="sp-kick">For drivers</span>
              <h2 className="sp-display sp-h2">Keep every dollar you earn.</h2>
              <ul className="sp-ticks">
                <li>0% commission — permanently, not as a promotion</li>
                <li>Set your own schedule, work when you want</li>
                <li>See the fare before you accept the trip</li>
              </ul>
              <a className="sp-btn" href="/preview/drive">Start driving</a>
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────── */}
        <section className="sp-sec" id="faq">
          <div className="sp-wrap sp-faqwrap">
            <div className="sp-faq-head">
              <h2 className="sp-display sp-faq-h">FAQ</h2>
              <span className="sp-faq-arrow" aria-hidden="true">↓</span>
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
          title={<>Ridesharing that keeps its<br />hands out of the fare.</>}
          sub="Available in Saskatoon."
        />

    </>
  )
}
