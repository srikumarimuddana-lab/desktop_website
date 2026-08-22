import Image from 'next/image'
import { Anton, Instrument_Serif } from 'next/font/google'
import { APP_URLS } from '@/lib/app-links'
import FareCalc from './FareCalc'
import PhoneFan from './PhoneFan'
import HowItWorks from './HowItWorks'
import AiChat from './AiChat'
import {
  Reveal, CountUp, Marquee, Tilt,
  SplitText, ScrollProgress, StickyCta, RevealFooter, Cursor,
} from './Reveal'

/*
 * DESIGN SAMPLE — /preview
 * A ledger-paper + hard-offset-shadow treatment of the Spinr homepage,
 * in the spirit of the reference site the team liked. Not linked from the
 * live site, not in the sitemap, and it replaces nothing.
 */

const display = Anton({ subsets: ['latin'], weight: '400', variable: '--sp-display' })
const editorial = Instrument_Serif({ subsets: ['latin'], weight: '400', style: 'italic', variable: '--sp-serif' })

export const metadata = {
  title: 'Design Sample | Spinr',
  description: 'Internal design sample. Not a live page.',
  robots: { index: false, follow: false },
}

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
    <main className={`sp ${display.variable} ${editorial.variable}`}>
      <style>{CSS}</style>
      <ScrollProgress />
      <Cursor />

      <div className="sp-stage">
        {/* ── Floating pill nav ─────────────────────────────── */}
        <nav className="sp-nav">
          <a href="#top" className="sp-nav-logo" aria-label="Spinr home">
            <Image src="/logo.webp" alt="Spinr" width={92} height={30} priority />
          </a>
          <div className="sp-nav-links">
            <a href="#why">Why Spinr</a>
            <a href="#how">How it works</a>
            <a href="#math">The math</a>
            <a href="#ai" className="sp-nav-ai"><span aria-hidden="true">&#10022;</span>AI assistant</a>
          </div>
          <div className="sp-nav-cta">
            <a className="sp-btn-ghost" href="#drive">Drive</a>
            <a className="sp-btn" href="#get">Get Spinr</a>
          </div>
        </nav>

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
              <a className="sp-btn" href="#get">Start driving</a>
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

        {/* ── Final CTA ─────────────────────────────────────── */}
        <section className="sp-sec sp-final" id="get">
          <div className="sp-wrap sp-final-in">
            <div>
              <h2 className="sp-display sp-final-h">
                Ridesharing that keeps its
                <br />hands out of the fare.
              </h2>
              <p className="sp-final-p">
                Available in Saskatoon. <span className="sp-editorial">100% Canadian owned and operated.</span>
              </p>
              <div className="sp-final-btns">
                <span className="sp-btn">App Store</span>
                <span className="sp-btn-ghost sp-btn-ghost-dark">Google Play</span>
              </div>
            </div>
            <Tilt className="sp-qr" max={5}>
              <Image src="/spinr_qr_code.png" alt="Scan to download Spinr" width={150} height={150} />
            </Tilt>
          </div>
        </section>

      </div>

      {/* ── Footer ────────────────────────────────────────── */}
      <RevealFooter>
        <footer className="sp-foot">
          <div className="sp-wrap sp-foot-in">
            <div className="sp-foot-lead">
              <Image src="/logo.webp" alt="Spinr" width={120} height={38} className="sp-foot-logo" />
              <p className="sp-display sp-foot-lock">Fair for drivers.</p>
              <p>Canada&rsquo;s own rideshare. Serving Saskatoon.</p>
            </div>
            <div>
              <h4>Riders</h4>
              <nav><a href="#how">How it works</a><a href="#math">The math</a><a href="#faq">FAQ</a></nav>
            </div>
            <div>
              <h4>Drivers</h4>
              <nav><a href="#drive">Start driving</a><a href="#drive">Requirements</a></nav>
            </div>
          </div>
          <div className="sp-wrap sp-foot-base">
            <span>Saskatoon, SK &middot; support@spinr.ca</span>
            <span className="sp-foot-flag">Design sample &middot; /preview &middot; not linked from the live site</span>
          </div>
        </footer>
      </RevealFooter>

      <StickyCta />
    </main>
  )
}

/* ────────────────────────────────────────────────────────────
   Scoped design system. Everything is namespaced under .sp so
   this sample can never leak into the live pages.
   ──────────────────────────────────────────────────────────── */
const CSS = `
.sp{
  --ink:#0B0B0B; --ink-6:#4A4A4A; --ink-5:#757370; --ink-4:#9C9890;
  --paper:#F3EEE2; --paper-50:#FAF7EF; --paper-3:#E6DCC9; --white:#fff;
  --red:#DC3848; --red-7:#B41E31; --red-1:#FFE7EA;
  --sky:#A8E1DE; --sun:#FFC60B;
  --hard:5px 5px 0 var(--ink);
  --hard-sm:3px 3px 0 var(--ink);
  --hard-lg:8px 8px 0 var(--ink);
  --snap:cubic-bezier(.34,1.56,.64,1);
  --spring:cubic-bezier(.2,1.1,.3,1);
  background:#FEFEFE; color:var(--ink);
  font-family:var(--font-inter,system-ui),system-ui,sans-serif;
}
.sp *{box-sizing:border-box}
.sp img{max-width:100%}
.sp-display{font-family:var(--sp-display),"Arial Narrow",sans-serif;font-weight:400;text-transform:uppercase;letter-spacing:.005em;line-height:.92}
.sp-editorial{font-family:var(--sp-serif),Georgia,serif;font-style:italic;text-transform:none;letter-spacing:0}
.sp-wrap{max-width:1180px;margin:0 auto;padding:0 clamp(18px,4vw,44px)}
.sp-sec{padding-block:clamp(56px,7vw,104px)}
.sp-stage [id]{scroll-margin-top:clamp(92px,12vh,120px)}
.sp-h2{font-size:clamp(30px,5vw,58px);margin:0 0 clamp(24px,3vw,42px);text-wrap:balance}
.sp-accent{color:var(--red)}
.sp-kick{display:inline-block;font-family:var(--sp-display),sans-serif;text-transform:uppercase;letter-spacing:.16em;font-size:13px;color:var(--red);margin-bottom:14px}
.sp-lede{margin:0;font-size:clamp(15px,1.25vw,18px);line-height:1.6;color:var(--ink-6);max-width:48ch}

/* buttons — the hard-shadow signature */
.sp-btn{display:inline-flex;align-items:center;gap:9px;padding:14px 26px;border-radius:999px;
  border:2px solid var(--ink);background:var(--red);color:#fff;font-weight:700;font-size:15px;
  box-shadow:-4px 4px 0 var(--ink);text-decoration:none;cursor:pointer;
  transition:transform .14s,box-shadow .14s}
.sp-btn:hover{transform:translate(-2px,2px);box-shadow:-2px 2px 0 var(--ink);color:#fff}
.sp-btn:active{transform:translate(-4px,4px);box-shadow:none}
.sp-btn-ghost{display:inline-flex;align-items:center;padding:13px 22px;border-radius:999px;
  border:2px solid var(--ink);background:#fff;color:var(--ink);font-weight:700;font-size:15px;text-decoration:none;
  transition:transform .14s}
.sp-btn-ghost:hover{transform:translateY(-2px);color:var(--ink)}
.sp-btn-ghost-dark{background:transparent;color:#fff;border-color:#fff}

/* ── nav ── */
.sp-nav{position:sticky;top:clamp(12px,2.4vw,24px);z-index:60;width:min(1180px,calc(100% - clamp(24px,5vw,56px)));
  margin:clamp(12px,2.4vw,24px) auto 0;display:flex;align-items:center;gap:14px;
  padding:9px 10px 9px 24px;border-radius:999px;border:2px solid var(--ink);
  background:rgba(251,249,243,.86);backdrop-filter:blur(14px) saturate(1.2);
  box-shadow:var(--hard-sm)}
.sp-nav-logo{display:flex;align-items:center;flex:0 0 auto}
.sp-nav-logo img{height:26px;width:auto}
.sp-nav-links{display:none;gap:22px;margin-left:auto;font-size:14.5px;font-weight:600}
.sp-nav-links a{color:var(--ink);opacity:.72;text-decoration:none}
.sp-nav-links a:hover{opacity:1}
.sp-nav-links a.sp-nav-ai{display:inline-flex;align-items:center;gap:7px;opacity:1;font-weight:800;
  background:var(--sun);border:2px solid var(--ink);border-radius:999px;padding:5px 13px;
  box-shadow:-2px 2px 0 var(--ink);transition:transform .16s var(--snap)}
.sp-nav-links a.sp-nav-ai:hover{transform:translateY(-1px)}
.sp-nav-cta{display:flex;align-items:center;gap:9px;margin-left:auto}
.sp-nav-cta .sp-btn,.sp-nav-cta .sp-btn-ghost{padding:11px 20px;font-size:14px;box-shadow:-3px 3px 0 var(--ink)}
.sp-nav-cta .sp-btn-ghost{box-shadow:none}
@media(min-width:900px){.sp-nav-links{display:flex}.sp-nav-cta{margin-left:0}}
@media(max-width:600px){.sp-nav-cta .sp-btn-ghost{display:none}}

/* ── hero: type on mint, a yellow shelf under it, phones straddling both ── */
.sp-hero{position:relative;margin:clamp(12px,2vw,28px);border-radius:clamp(24px,2.8vw,40px);
  overflow:hidden;border:2px solid var(--ink);background:var(--sky);
  margin-top:calc(-1 * clamp(52px,7vw,74px));
  padding:clamp(108px,15vh,166px) clamp(18px,4vw,44px) 0;text-align:center}
.sp-hero-shelf{position:absolute;left:-2px;right:-2px;bottom:-2px;height:clamp(132px,19vw,250px);
  background:#FFF6AE;border:2px solid var(--ink);border-bottom:0;
  border-radius:clamp(26px,3vw,44px) clamp(26px,3vw,44px) 0 0}
.sp-hero-copy{position:relative;z-index:2;max-width:1020px;margin:0 auto}
.sp-hero-badge{display:inline-flex;align-items:center;background:#fff;border:2px solid var(--ink);
  border-radius:999px;padding:8px 17px;font-size:11.5px;font-weight:800;letter-spacing:.06em;
  text-transform:uppercase;box-shadow:var(--hard-sm)}
.sp-hero-h{font-size:clamp(40px,8vw,102px);color:var(--ink);text-wrap:balance;
  margin:clamp(16px,2.4vw,26px) 0 clamp(20px,3vw,30px)}
.sp-hero-hl{color:var(--red)}
.sp-hero-btns{display:flex;justify-content:center;flex-wrap:wrap;gap:12px}

/* ── the phone fan ── */
.sp-fan{position:relative;z-index:3;display:flex;justify-content:center;
  height:clamp(292px,36vw,486px);margin-top:clamp(20px,3.4vw,42px)}
.sp-fan-p{position:absolute;top:0;width:clamp(146px,15.5vw,214px);aspect-ratio:9/19;
  border:3px solid var(--ink);border-radius:clamp(18px,2vw,28px);background:var(--paper-50);
  box-shadow:6px 6px 0 var(--ink);overflow:hidden;transform-origin:50% 92%;
  display:flex;flex-direction:column;
  opacity:0;transition:opacity .55s ease var(--ap-delay,0ms)}
.sp-fan.ready .sp-fan-p{opacity:1}
.sp-fan-notch{position:absolute;top:7px;left:50%;margin-left:-17%;width:34%;height:8px;
  background:var(--ink);border-radius:999px;z-index:5}
.sp-fan-tag{position:absolute;z-index:6;right:clamp(2px,4vw,88px);top:clamp(-6px,1vw,18px);
  background:var(--sun);color:var(--ink);border:2px solid var(--ink);
  border-radius:999px;padding:9px 16px;font-size:15px;letter-spacing:.03em;box-shadow:4px 4px 0 var(--ink);
  opacity:0;transform:rotate(-9deg) scale(.55);
  transition:opacity .4s ease 1120ms,transform .5s var(--spring) 1120ms}
.sp-fan.ready .sp-fan-tag{opacity:1;transform:rotate(-9deg) scale(1)}

/* ── the little screens inside the fan ── */
.sp-fs{flex:1;min-height:0;display:flex;flex-direction:column;gap:6px;padding:22px 9px 10px}
.sp-fs-hi{margin:0;font-size:12px;letter-spacing:.05em;color:var(--red)}
.sp-fs-field{display:flex;align-items:center;gap:6px;background:#fff;border:2px solid var(--ink);
  border-radius:9px;padding:7px 8px;font-size:9.5px;font-weight:700}
.sp-fs-pin{width:7px;height:7px;border-radius:999px;background:var(--red);flex:0 0 auto}
.sp-fs-chips{display:flex;gap:5px}
.sp-fs-chips span{flex:1;text-align:center;background:var(--sun);border:2px solid var(--ink);
  border-radius:999px;padding:4px 0;font-size:8.5px;font-weight:800}
.sp-fs-map{flex:1;min-height:34px;border:2px solid var(--ink);border-radius:10px;overflow:hidden}
.sp-fs-go{text-align:center;background:var(--red);color:#fff;border:2px solid var(--ink);
  border-radius:999px;padding:7px;font-weight:800;font-size:9.5px}
.sp-fs-go-ghost{background:#fff;color:var(--ink)}
.sp-fs-card{background:#fff;border:2px solid var(--ink);border-radius:10px;padding:8px}
.sp-fs-card-sun{background:var(--sun)}
.sp-fs-k{font-size:7.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-5)}
.sp-fs-big{display:block;font-size:22px;line-height:1;margin:3px 0 5px}
.sp-fs-row{display:flex;align-items:center;font-size:9px;font-weight:600;color:var(--ink-6);padding:2px 0}
.sp-fs-row b{margin-left:auto;font-family:var(--sp-display),sans-serif;font-weight:400;font-size:10.5px;color:var(--ink)}
.sp-fs-row-red b{color:var(--red)}
.sp-fs-tot{display:flex;align-items:center;margin-top:5px;padding-top:5px;
  border-top:1.5px dashed rgba(11,11,11,.3);font-size:7.5px;font-weight:800;letter-spacing:.08em;
  text-transform:uppercase;color:var(--ink-5)}
.sp-fs-tot b{margin-left:auto;font-family:var(--sp-display),sans-serif;font-weight:400;font-size:14px;
  color:var(--ink);letter-spacing:0}
.sp-fs-keep{background:var(--sun);border:2px solid var(--ink);border-radius:10px;padding:7px 8px}
.sp-fs-keep span{display:block;font-size:7.5px;font-weight:800;letter-spacing:.1em;
  text-transform:uppercase;color:var(--ink-6)}
.sp-fs-keep b{display:block;font-size:19px;line-height:1;margin-top:2px}
.sp-fs-thread{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:flex-end;
  gap:5px;overflow:hidden}
.sp-fs-bub{max-width:90%;border:2px solid var(--ink);border-radius:9px;padding:5px 7px;
  font-size:8.5px;line-height:1.35}
.sp-fs-bub-you{align-self:flex-end;background:var(--red);color:#fff}
.sp-fs-bub-ai{align-self:flex-start;background:#fff}
.sp-fs-typing{display:flex;gap:3px;padding:7px}
.sp-fs-typing i{width:4px;height:4px;border-radius:999px;background:var(--ink-4);animation:sp-typ 1.1s infinite}
.sp-fs-typing i:nth-child(2){animation-delay:.18s}
.sp-fs-typing i:nth-child(3){animation-delay:.36s}
.sp-fs-input{background:#fff;border:2px solid var(--ink);border-radius:999px;padding:6px 9px;
  font-size:8.5px;color:var(--ink-4)}
.sp-fs-toggle{display:flex;align-items:center;gap:6px;background:#D7F5E2;border:2px solid var(--ink);
  border-radius:999px;padding:6px 9px;font-size:9px;font-weight:800}
.sp-fs-toggle i{width:9px;height:9px;border-radius:999px;background:#12B76A;
  border:1.5px solid var(--ink);flex:0 0 auto}
.sp-fs-bars{display:flex;align-items:flex-end;gap:3px;height:34px;margin-top:6px}
.sp-fs-bars i{flex:1;background:var(--red);border:1.5px solid var(--ink);border-radius:3px 3px 0 0}
@media(max-width:700px){
  /* no room beside the phones down here — the sticker sits above them */
  .sp-fan-tag{top:-12px;right:4px;font-size:12.5px;padding:7px 12px}
}
@media(prefers-reduced-motion:reduce){
  .sp-fs-typing{display:none}
  .sp-fan-p,.sp-fan-tag{transition:none}
}

/* ── trust band: the numbers on one ledger row, the screening on its own ── */
.sp-band{border-block:2px solid var(--ink);background:var(--paper-50)}
.sp-band-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));
  gap:clamp(16px,2.6vw,34px);padding-block:clamp(26px,3.2vw,40px)}
.sp-stat{display:flex;flex-direction:column;gap:5px;padding-left:14px;border-left:3px solid var(--ink)}
.sp-stat b{font-size:clamp(30px,3.4vw,46px);line-height:.88}
.sp-stat > span{font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-5)}
.sp-band-foot{display:flex;align-items:center;flex-wrap:wrap;gap:12px clamp(14px,2vw,22px);
  padding-block:clamp(16px,2vw,22px) clamp(22px,2.8vw,30px);border-top:2px dashed rgba(11,11,11,.25)}
.sp-band-lbl{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.18em;color:var(--ink-5)}
.sp-band-names{display:flex;gap:9px;flex-wrap:wrap}
.sp-band-names i{font-style:normal;font-weight:700;font-size:12.5px;color:var(--ink);
  background:#fff;border:2px solid var(--ink);border-radius:999px;padding:7px 14px;
  box-shadow:2px 2px 0 var(--ink)}

/* ── letter-by-letter headline reveal; words stay whole so lines wrap ── */
.sp-split{display:inline}
.sp-split-w{display:inline-block;white-space:nowrap}
.sp-split-c{display:inline-block;transform:translateY(26px);opacity:.001;
  transition:transform .66s var(--spring) var(--c-delay,0ms),opacity .36s ease var(--c-delay,0ms)}
.sp-split.in .sp-split-c{transform:none;opacity:1}
@media(prefers-reduced-motion:reduce){
  .sp-split-c{transform:none;opacity:1;transition:none}
}

/* ── on-load entrance ladder: each piece springs in behind the last ── */
.sp-ap{animation:sp-ap .8s var(--spring) both;animation-delay:var(--ap-delay,0ms)}
@keyframes sp-ap{
  from{opacity:.001;transform:translateY(var(--ap-y,60px)) scale(var(--ap-s,1)) rotate(var(--ap-r,0deg))}
  to{opacity:1;transform:none}
}
@media(prefers-reduced-motion:reduce){.sp-ap{animation:none}}

/* ── scroll progress ── */
.sp-progress{position:fixed;top:0;left:0;right:0;height:7px;z-index:90;
  background:var(--paper-3);border-bottom:2px solid var(--ink);pointer-events:none}
.sp-progress i{display:block;height:100%;background:var(--red);transform-origin:0 50%;
  transform:scaleX(0);transition:transform .08s linear}

/* ── ticker: outlined wood-type, the neobrutalist staple ── */
.sp-mq{overflow:hidden;background:var(--ink);border-bottom:2px solid var(--ink);padding-block:clamp(8px,1.2vw,14px)}
.sp-mq-track{display:inline-flex;white-space:nowrap;animation:sp-mq 34s linear infinite;will-change:transform}
.sp-mq-track.rev{animation-direction:reverse}
.sp-mq:hover .sp-mq-track{animation-play-state:paused}
.sp-mq-track span{display:inline-flex;align-items:center;font-size:clamp(26px,4vw,54px);line-height:1;
  color:transparent;-webkit-text-stroke:2px var(--paper);padding-right:.35em}
.sp-mq-track span:nth-child(even){color:var(--sun);-webkit-text-stroke:0}
.sp-mq-dot{display:inline-block;width:.22em;height:.22em;border-radius:999px;background:var(--red);margin-left:.35em}
@keyframes sp-mq{to{transform:translateX(-50%)}}
@media(prefers-reduced-motion:reduce){.sp-mq-track{animation:none}}

/* ── AI assistant ── */
.sp-ai{background:var(--ink);color:var(--paper);border-block:2px solid var(--ink);position:relative}
.sp-ai.is-pinned{min-height:300vh;padding-block:0}
.sp-ai-stage{display:flex;align-items:center}
.sp-ai-stage > .sp-wrap{width:100%}
.sp-ai.is-pinned .sp-ai-stage{position:sticky;top:0;height:100vh}
.sp-ai:not(.is-pinned) .sp-ai-stage{padding-block:clamp(56px,7vw,104px)}
.sp-ai-g{display:grid;gap:clamp(30px,5vw,72px);align-items:center}
@media(min-width:900px){.sp-ai-g{grid-template-columns:1.05fr .95fr}}
.sp-kick-light{color:var(--sun)}
.sp-ai-h{font-size:clamp(30px,5vw,58px);margin:0 0 18px;color:#fff}
.sp-ai-hl{color:var(--sun)}
.sp-ai-lede{margin:0 0 clamp(22px,2.6vw,30px);font-size:clamp(15px,1.25vw,18px);line-height:1.6;
  color:rgba(255,255,255,.78);max-width:46ch}
.sp-ai-groups{display:grid;grid-template-columns:1fr 1fr;gap:clamp(16px,2vw,26px);
  margin:0 0 clamp(20px,2.4vw,28px)}
@media(max-width:620px){.sp-ai-groups{grid-template-columns:1fr}}
.sp-ai-group{border:2px solid rgba(255,255,255,.22);border-radius:16px;padding:15px 16px;background:rgba(255,255,255,.04)}
.sp-ai-gk{margin:0 0 10px;font-size:13px;letter-spacing:.1em;color:var(--sun)}
.sp-ai-group ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.sp-ai-group li{display:flex;align-items:flex-start;gap:9px;font-size:13.5px;line-height:1.4;
  font-weight:600;color:rgba(255,255,255,.88)}
.sp-ai-group li span{flex:0 0 auto;margin-top:1px;width:19px;height:19px;border-radius:999px;background:var(--sun);
  color:var(--ink);border:2px solid var(--ink);display:grid;place-items:center;font-size:10px;font-weight:900}
.sp-ai-fine{margin:0;font-size:12.5px;line-height:1.55;color:rgba(255,255,255,.5);max-width:44ch}

.sp-ai-phone{position:relative;display:flex;justify-content:center}
.sp-ai-sticker{position:absolute;top:-18px;right:clamp(0px,3vw,22px);z-index:4;transform:rotate(-9deg);
  background:var(--sun);color:var(--ink);border:2px solid var(--ink);border-radius:999px;
  padding:10px 17px;font-size:14.5px;letter-spacing:.03em;box-shadow:4px 4px 0 var(--ink)}
.sp-ai-frame{position:relative;width:clamp(250px,26vw,310px);aspect-ratio:9/18.5;display:flex;flex-direction:column;
  border:3px solid var(--ink);border-radius:clamp(30px,3vw,42px);background:var(--paper-50);overflow:hidden;
  box-shadow:10px 12px 0 var(--sun)}
.sp-ai-notch{position:absolute;top:12px;left:50%;transform:translateX(-50%);width:32%;height:18px;
  background:var(--ink);border-radius:999px;z-index:5}
.sp-ai-head{display:flex;align-items:center;gap:9px;padding:40px 16px 12px;font-size:13px;font-weight:800;
  color:var(--ink);border-bottom:2px solid var(--ink)}
.sp-eyes{width:26px;height:26px;flex:0 0 auto;border-radius:999px;border:2px solid var(--ink);
  background:var(--sky);display:inline-flex;align-items:center;justify-content:center;gap:3px}
.sp-eyes i{width:8px;height:9px;border-radius:999px;background:#fff;border:1.5px solid var(--ink);
  display:grid;place-items:center}
.sp-eyes b{width:4px;height:4px;border-radius:999px;background:var(--ink);transition:transform .1s linear}
.sp-ai-thread{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:flex-end;
  gap:9px;padding:14px 13px;overflow:hidden}
.sp-caret-ai{background:var(--ink);height:12px;vertical-align:-1px}
.sp-bub{max-width:88%;border:2px solid var(--ink);border-radius:14px;padding:9px 12px;font-size:12.5px;line-height:1.4;
  opacity:0;transform:translateY(10px) scale(.97);
  transition:opacity .32s ease,transform .4s var(--snap)}
.sp-bub.in{opacity:1;transform:none}
.sp-bub-you{align-self:flex-end;background:var(--red);color:#fff;border-bottom-right-radius:5px}
.sp-bub-ai{align-self:flex-start;background:#fff;color:var(--ink);border-bottom-left-radius:5px;box-shadow:var(--hard-sm)}
.sp-bub-tool{display:block;font-family:var(--sp-display),monospace;font-size:9.5px;letter-spacing:.06em;
  color:var(--red);background:var(--red-1);border:1px solid var(--ink);border-radius:5px;
  padding:2px 6px;margin-bottom:6px;width:fit-content}
.sp-bub-typing{display:flex;gap:4px;padding:12px}
.sp-bub-typing i{width:6px;height:6px;border-radius:999px;background:var(--ink-4);animation:sp-typ 1.1s infinite}
.sp-bub-typing i:nth-child(2){animation-delay:.18s}
.sp-bub-typing i:nth-child(3){animation-delay:.36s}
@keyframes sp-typ{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}
@media(prefers-reduced-motion:reduce){.sp-bub-typing{display:none}.sp-bub{opacity:1;transform:none}}
.sp-ai-input{display:flex;align-items:center;margin:0 13px 14px;padding:10px 12px;background:#fff;
  border:2px solid var(--ink);border-radius:999px;font-size:12.5px;color:var(--ink-4);font-weight:600}
.sp-ai-send{margin-left:auto;width:24px;height:24px;border-radius:999px;background:var(--red);color:#fff;
  display:grid;place-items:center;font-size:12px;font-weight:900}

/* QR sticker rotates with scroll */
.sp-qr{transition:transform .12s linear}

/* ── docked CTA: rides up out of the page once the hero is behind you,
      and drops back down when the real CTA arrives ── */
.sp-dock{position:fixed;left:50%;bottom:calc(clamp(14px,3vh,26px) + var(--dock-lift,0px));z-index:70;
  display:inline-flex;align-items:center;gap:11px;padding:8px 10px;max-width:calc(100vw - 20px);
  border:2px solid var(--ink);border-radius:999px;background:var(--paper-50);
  box-shadow:5px 5px 0 var(--ink);
  transform:translate(-50%,130px);opacity:0;pointer-events:none;
  transition:transform .62s var(--spring),opacity .3s ease}
.sp-dock.up{transform:translate(-50%,0);opacity:1;pointer-events:auto}
.sp-dock-ai{display:flex;align-items:center;gap:10px;padding:5px 14px 5px 6px;border-radius:999px;
  color:var(--ink);text-decoration:none;transition:background .16s ease}
.sp-dock-ai:hover{background:var(--red-1);color:var(--ink)}
.sp-dock-spark{width:31px;height:31px;flex:0 0 auto;border-radius:999px;border:2px solid var(--ink);
  background:var(--sky);display:grid;place-items:center;font-size:14px}
.sp-dock-ai b{display:block;font-size:13px;line-height:1.15;white-space:nowrap}
.sp-dock-ai i{display:block;font-style:normal;font-size:11px;color:var(--ink-5);white-space:nowrap}
.sp-dock-rule{width:2px;height:30px;flex:0 0 auto;background:rgba(11,11,11,.15)}
.sp-dock-note{font-size:11px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;
  color:var(--ink-5);white-space:nowrap}
.sp-dock-btn{padding:11px 18px;font-size:13px;box-shadow:-3px 3px 0 var(--ink);white-space:nowrap}
.sp-dock .sp-btn-ghost.sp-dock-btn{box-shadow:none}
@media(max-width:860px){
  .sp-dock-note,.sp-dock-rule{display:none}
  .sp-dock-ai i{display:none}
  .sp-dock-ai{padding:4px 10px 4px 4px}
}
@media(max-width:560px){
  .sp-dock{gap:7px;padding:6px}
  .sp-dock-ai b{display:none}
  .sp-dock-ai{padding:2px}
  .sp-dock-btn{padding:11px 14px;font-size:12.5px}
}
@media(prefers-reduced-motion:reduce){.sp-dock{transition:none}}

/* ── pointer: a drawn arrow with the tip on the hotspot ── */
.sp-cursor-on,.sp-cursor-on *{cursor:none !important}
.sp-cur{position:fixed;inset:0;z-index:200;pointer-events:none;opacity:0;transition:opacity .2s ease}
.sp-cursor-live .sp-cur{opacity:1}
.sp-cur-arrow{position:absolute;top:0;left:0;display:block;margin:-3px 0 0 -3px}
.sp-cur-arrow svg{display:block;transform-origin:4px 3px;
  transition:transform .18s var(--snap)}
.sp-cur-arrow svg path{transition:fill .18s ease}
.sp-cur-arrow.hot svg{transform:rotate(-10deg) scale(1.28)}
.sp-cur-arrow.hot svg path{fill:var(--sun)}
.sp-cur-arrow.down svg path{fill:var(--red)}
.sp-cur-arrow.down svg{transform:scale(.82)}
.sp-cur-arrow.hot.down svg{transform:rotate(-10deg) scale(1.05)}

/* ── the page rides over a footer pinned to the bottom of the viewport;
      RevealFooter drops back to a normal in-flow footer when it can't ── */
.sp-stage{position:relative;z-index:1;background:#FEFEFE}
.sp-footlayer.pinned{position:fixed;left:0;right:0;bottom:0;z-index:0}
`
