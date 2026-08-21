import Image from 'next/image'
import { Anton, Instrument_Serif } from 'next/font/google'
import FareCalc from './FareCalc'
import HowItWorks from './HowItWorks'
import AiChat from './AiChat'
import {
  Reveal, CountUp, Marquee, Tilt,
  SplitText, ScrollProgress, StickyCta, RevealFooter,
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
    p: 'Every driver is background-checked and carries SGI-compliant commercial coverage for the whole trip.',
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
  'Vulnerable sector check',
  'SGI ride-share insurance',
  'Class 5, 3+ years licensed',
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
  ['Who is driving me?', 'Every driver passes a criminal record check with a vulnerable sector check, holds a valid Class 5 licence with at least three years of experience, and carries SGI ride-share insurance.'],
  ['Is Spinr Canadian?', 'Yes — 100% Canadian owned and operated, with a support team based in Saskatchewan.'],
]

export default function PreviewPage() {
  return (
    <main className={`sp ${display.variable} ${editorial.variable}`}>
      <style>{CSS}</style>
      <ScrollProgress />

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
          </div>
          <div className="sp-nav-cta">
            <a className="sp-btn-ghost" href="#drive">Drive</a>
            <a className="sp-btn" href="#get">Get Spinr</a>
          </div>
        </nav>

        {/* ── Hero ──────────────────────────────────────────── */}
        <header className="sp-hero" id="top">
          <div className="sp-hero-bg">
            <Image
              src="/happy_rider.png"
              alt="A Spinr rider"
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: 'center 35%' }}
            />
          </div>
          <div className="sp-hero-scrim" />

          <div className="sp-hero-copy">
            <h1 className="sp-display sp-hero-h">
              <SplitText text="Every fare," start={120} />
              <br />
              <SplitText as="span" className="sp-hero-hl" text="straight to the driver." start={330} />
            </h1>
            <a className="sp-btn sp-hero-cta sp-ap" style={{ '--ap-delay': '900ms', '--ap-y': '30px' }} href="#get">
              Get Spinr
            </a>
          </div>

          {/* floating receipt chips */}
          <div className="sp-chips" aria-hidden="true">
            <div className="sp-chip sp-chip-fare sp-ap" style={{ '--ap-delay': '1040ms', '--ap-y': '44px', '--ap-r': '-4deg' }}>
              <span className="sp-chip-k">This trip</span>
              <div className="sp-chip-rows">
                <div><span>Fare</span><b>$14.20</b></div>
                <div><span>Platform fee</span><b>$1.00</b></div>
                <div><span>Surge</span><b>None</b></div>
              </div>
              <div className="sp-chip-total"><span>Total</span><b>$15.20</b></div>
            </div>
            <div className="sp-chip sp-chip-keep sp-ap" style={{ '--ap-delay': '1220ms', '--ap-y': '44px', '--ap-r': '5deg' }}>
              <span className="sp-chip-k">Driver keeps</span>
              <b className="sp-chip-big">$14.20</b>
              <span className="sp-chip-sub">100% of net fare</span>
            </div>
          </div>
        </header>

        {/* ── Trust band ────────────────────────────────────── */}
        <section className="sp-band">
          <div className="sp-wrap sp-band-in">
            {STATS.map((s, i) => (
              <Reveal className="sp-stat" key={s.l} delay={i * 90}>
                <b className="sp-display">
                  <CountUp to={s.to} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals || 0} />
                </b>
                <span>{s.l}</span>
              </Reveal>
            ))}
            <span className="sp-band-lbl">verified by</span>
            <div className="sp-band-names">
              <i>SGI</i><i>RCMP record check</i><i>Vulnerable sector check</i>
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
.sp-nav-cta{display:flex;align-items:center;gap:9px;margin-left:auto}
.sp-nav-cta .sp-btn,.sp-nav-cta .sp-btn-ghost{padding:11px 20px;font-size:14px;box-shadow:-3px 3px 0 var(--ink)}
.sp-nav-cta .sp-btn-ghost{box-shadow:none}
@media(min-width:900px){.sp-nav-links{display:flex}.sp-nav-cta{margin-left:0}}
@media(max-width:600px){.sp-nav-cta .sp-btn-ghost{display:none}}

/* ── hero ── */
.sp-hero{position:relative;margin:clamp(12px,2vw,28px);border-radius:clamp(24px,2.8vw,40px);
  overflow:hidden;border:2px solid var(--ink);min-height:min(84vh,760px);
  display:flex;align-items:flex-end;margin-top:calc(-1 * clamp(52px,7vw,74px));padding-top:clamp(120px,16vh,180px)}
.sp-hero-bg{position:absolute;inset:0}
.sp-hero-scrim{position:absolute;inset:0;background:linear-gradient(0deg,rgba(11,11,11,.80) 0%,rgba(11,11,11,.46) 32%,rgba(11,11,11,.12) 60%,transparent 84%),linear-gradient(90deg,rgba(11,11,11,.62) 0%,rgba(11,11,11,.30) 38%,transparent 66%)}
.sp-hero-copy{position:relative;z-index:2;padding:clamp(24px,4vw,56px);max-width:min(720px,86%)}
.sp-hero-h{font-size:clamp(38px,6.4vw,88px);color:var(--paper-50);margin:0 0 clamp(22px,3vw,32px);text-shadow:0 2px 20px rgba(11,11,11,.5)}
.sp-hero-hl{color:var(--sun)}
.sp-hero-cta{font-size:clamp(15px,1.3vw,17px)}
.sp-chips{position:absolute;right:clamp(16px,3vw,40px);top:clamp(90px,14vh,150px);z-index:3;display:none;flex-direction:column;gap:16px;align-items:flex-end}
@media(min-width:1000px){.sp-chips{display:flex}}
.sp-chip{background:rgba(255,255,255,.96);border:2px solid var(--ink);border-radius:16px;
  box-shadow:-5px 5px 0 var(--ink);padding:14px 17px;backdrop-filter:blur(6px)}
.sp-chip-k{display:block;font-size:10.5px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--ink-5)}
.sp-chip-fare{min-width:250px}
.sp-chip-rows{margin-top:9px;display:flex;flex-direction:column;gap:6px}
.sp-chip-rows div{display:flex;align-items:center;gap:10px;font-size:13px;font-weight:600;color:var(--ink-6)}
.sp-chip-rows b{margin-left:auto;font-family:var(--sp-display),sans-serif;font-weight:400;font-size:15px;color:var(--ink)}
.sp-chip-total{display:flex;align-items:center;margin-top:9px;padding-top:8px;border-top:1.5px dashed rgba(11,11,11,.28);font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-5)}
.sp-chip-total b{margin-left:auto;font-family:var(--sp-display),sans-serif;font-weight:400;font-size:20px;color:var(--ink);letter-spacing:0}
.sp-chip-keep{background:var(--sun)}
.sp-chip-big{display:block;font-family:var(--sp-display),sans-serif;font-size:34px;line-height:.9;margin-top:6px}
.sp-chip-sub{display:block;font-size:11.5px;font-weight:700;margin-top:5px}

/* ── trust band ── */
.sp-band{border-block:2px solid var(--ink);background:var(--paper-50)}
.sp-band-in{display:flex;align-items:center;flex-wrap:wrap;gap:clamp(18px,3vw,40px);padding-block:clamp(22px,3vw,34px)}
.sp-stat{display:flex;flex-direction:column;gap:3px}
.sp-stat b{font-size:clamp(28px,3.2vw,44px);line-height:.88}
.sp-stat > span{font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-5)}
.sp-band-lbl{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.2em;color:var(--ink-4);margin-left:auto}
.sp-band-names{display:flex;gap:clamp(12px,2vw,26px);flex-wrap:wrap}
.sp-band-names i{font-style:normal;font-weight:800;font-size:13px;letter-spacing:.04em;color:var(--ink-6);
  border:2px solid var(--ink);border-radius:999px;padding:6px 13px;background:#fff}

/* ── sticky stacking cards ── */
.sp-roll{display:flex;flex-direction:column;gap:clamp(36px,6vh,72px);padding-bottom:clamp(30px,9vh,110px)}
.sp-rcard{position:sticky;top:calc(clamp(88px,11vh,124px) + var(--i) * 16px);
  display:grid;grid-template-columns:1.05fr .95fr;min-height:clamp(300px,34vw,400px);
  border:2px solid var(--bd);border-radius:24px;overflow:hidden;background:var(--pc);color:var(--tc);
  box-shadow:0 22px 44px -20px rgba(11,11,11,.42)}
.sp-rcard-copy{display:flex;flex-direction:column;justify-content:center;gap:14px;padding:clamp(26px,3.4vw,52px)}
.sp-rcard-n{font-size:clamp(30px,3vw,44px);opacity:.42;line-height:1}
.sp-rcard-h{font-size:clamp(26px,3.2vw,46px);margin:0;text-wrap:balance}
.sp-rcard-p{margin:0;font-size:clamp(15px,1.1vw,17.5px);line-height:1.55;max-width:38ch;opacity:.9}
.sp-rcard-art{position:relative;display:flex;align-items:center;justify-content:center;padding:clamp(20px,3vw,40px);background:rgba(255,255,255,.28)}
.sp-tickets{display:flex;flex-direction:column;gap:10px;width:100%;max-width:330px}
.sp-ticket{display:flex;align-items:center;gap:12px;background:#fff;border:2px solid var(--ink);border-radius:13px;
  padding:11px 15px;box-shadow:-4px 4px 0 var(--ink);font-size:13.5px;color:var(--ink)}
.sp-ticket b{font-weight:700}
.sp-ticket i{margin-left:auto;font-style:normal;font-family:var(--sp-display),sans-serif;font-size:16px}
.sp-ticket-win{background:var(--sun)}
.sp-ticket-check i{color:#1F8A4C;font-family:inherit;font-size:17px;font-weight:900}
@media(max-width:760px){
  .sp-roll{gap:22px;padding-bottom:18px}
  .sp-rcard{grid-template-columns:1fr;min-height:0;top:clamp(74px,10vh,96px);border-radius:18px}
  .sp-rcard-art{order:-1;padding:20px}
}
@media(prefers-reduced-motion:reduce){.sp-rcard{position:static}}

/* ── how it works: pinned route + phone ── */
.sp-hiw{background:var(--paper-50);border-block:2px solid var(--ink);position:relative}
.sp-hiw.is-pinned{min-height:300vh;padding-block:0}
.sp-hiw-stage{display:flex;align-items:center}
.sp-hiw.is-pinned .sp-hiw-stage{position:sticky;top:0;height:100vh}
.sp-hiw-g{display:grid;gap:clamp(28px,5vw,64px);align-items:center;width:100%}
@media(min-width:900px){.sp-hiw-g{grid-template-columns:1.05fr .95fr}}

/* route rail */
.sp-route{position:relative;list-style:none;margin:clamp(22px,3vw,32px) 0 clamp(26px,3.2vw,38px);padding:0 0 0 46px;
  display:flex;flex-direction:column;gap:clamp(18px,2.4vw,30px)}
.sp-route-line{position:absolute;left:15px;top:10px;bottom:10px;width:3px;border-radius:999px;background:rgba(11,11,11,.14);overflow:hidden}
.sp-route-fill{position:absolute;left:0;top:0;width:100%;border-radius:999px;background:var(--red);
  height:calc(var(--p,0) * 100%);transition:height .18s linear}
.sp-route li{position:relative;display:flex;gap:14px;align-items:flex-start;opacity:.42;transition:opacity .35s ease}
.sp-route li.is-on,.sp-route li.is-done{opacity:1}
.sp-route-dot{position:absolute;left:-46px;top:2px;width:32px;height:32px;border-radius:999px;
  border:2px solid var(--ink);background:#fff;display:grid;place-items:center;
  transition:background .3s ease,transform .3s var(--snap)}
.sp-route-dot::after{content:"";width:10px;height:10px;border-radius:999px;background:rgba(11,11,11,.2);transition:background .3s ease}
.sp-route li.is-done .sp-route-dot{background:var(--sun)}
.sp-route li.is-done .sp-route-dot::after{background:var(--ink)}
.sp-route li.is-on .sp-route-dot{background:var(--red);transform:scale(1.14)}
.sp-route li.is-on .sp-route-dot::after{background:#fff}
.sp-route-n{display:block;font-size:14px;color:var(--red);line-height:1;margin-bottom:4px}
.sp-route-tx b{display:block;font-size:clamp(17px,1.6vw,20px);font-weight:800}
.sp-route-tx p{margin:5px 0 0;font-size:14.5px;line-height:1.55;color:var(--ink-6);max-width:40ch}

/* phone */
.sp-hiw-phone{display:flex;justify-content:center}
.sp-hiw-frame{position:relative;width:clamp(230px,25vw,300px);aspect-ratio:9/19;
  border:3px solid var(--ink);border-radius:clamp(30px,3vw,42px);overflow:hidden;
  background:var(--paper-50);box-shadow:var(--hard-lg)}
.sp-hiw-notch{position:absolute;top:12px;left:50%;transform:translateX(-50%);width:32%;height:18px;
  background:var(--ink);border-radius:999px;z-index:5}
.sp-hiw-screens{position:absolute;inset:0}
.sp-scr{position:absolute;inset:0;padding:46px 16px 18px;display:flex;flex-direction:column;gap:11px;
  opacity:0;transform:translateY(10px);transition:opacity .32s ease,transform .38s var(--snap);pointer-events:none}
.sp-scr.on{opacity:1;transform:none}
.sp-scr-k{margin:0;font-family:var(--sp-display),sans-serif;text-transform:uppercase;letter-spacing:.12em;
  font-size:11px;color:var(--red)}
.sp-scr-field{display:flex;align-items:center;gap:9px;background:#fff;border:2px solid var(--ink);border-radius:12px;
  padding:12px 13px;font-size:14px;font-weight:700;box-shadow:var(--hard-sm)}
.sp-scr-pin{width:10px;height:10px;border-radius:999px;background:var(--red);flex:0 0 auto}
.sp-scr-list{list-style:none;margin:4px 0 0;padding:0;display:flex;flex-direction:column;gap:9px}
.sp-scr-list li{display:flex;align-items:center;gap:10px;background:#fff;border:2px solid var(--ink);
  border-radius:12px;padding:9px 11px}
.sp-scr-ic{width:26px;height:26px;flex:0 0 auto;border-radius:8px;border:2px solid var(--ink);background:var(--sun);
  display:grid;place-items:center;font-size:12px}
.sp-scr-list b{display:block;font-size:13px;line-height:1.15}
.sp-scr-list i{display:block;font-style:normal;font-size:11px;color:var(--ink-5)}
.sp-scr-card{background:#fff;border:2px solid var(--ink);border-radius:14px;padding:12px 13px;box-shadow:var(--hard-sm)}
.sp-scr-row{display:flex;align-items:center;font-size:12.5px;font-weight:600;color:var(--ink-6);padding:4px 0}
.sp-scr-row b{margin-left:auto;font-family:var(--sp-display),sans-serif;font-weight:400;font-size:14px;color:var(--ink)}
.sp-scr-row-flat b{color:var(--red)}
.sp-scr-total{display:flex;align-items:center;margin-top:7px;padding-top:8px;border-top:1.5px dashed rgba(11,11,11,.3);
  font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-5)}
.sp-scr-total b{margin-left:auto;font-family:var(--sp-display),sans-serif;font-weight:400;font-size:19px;color:var(--ink);letter-spacing:0}
.sp-scr-go{margin-top:auto;text-align:center;background:var(--red);color:#fff;border:2px solid var(--ink);
  border-radius:999px;padding:12px;font-weight:800;font-size:13.5px}
.sp-scr-go-ghost{background:#fff;color:var(--ink)}
.sp-scr-map{position:relative;flex:1;min-height:0;border:2px solid var(--ink);border-radius:14px;
  background:repeating-linear-gradient(0deg,#EFEADF 0 22px,#E6DCC9 22px 23px),repeating-linear-gradient(90deg,transparent 0 30px,rgba(11,11,11,.06) 30px 31px);
  overflow:hidden}
.sp-scr-route{position:absolute;left:16%;top:74%;width:64%;height:3px;background:var(--red);border-radius:999px;
  transform:rotate(-38deg);transform-origin:left center}
.sp-scr-car{position:absolute;left:16%;top:74%;width:13px;height:13px;border-radius:999px;background:var(--ink);
  border:2px solid #fff;transform:translate(-50%,-50%)}
.sp-scr-map-sm{flex:0 0 auto;height:34%}
.sp-scr-driver{display:flex;align-items:center;gap:10px}
.sp-scr-avatar{width:34px;height:34px;flex:0 0 auto;border-radius:999px;border:2px solid var(--ink);background:var(--sky)}
.sp-scr-driver b{display:block;font-size:12.5px;line-height:1.2}
.sp-scr-driver i{display:block;font-style:normal;font-size:11px;color:var(--ink-5);margin-top:2px}
.sp-hiw-cta{margin-top:4px}

/* unpinned fallback: plain stacked list, everything visible */
.sp-hiw:not(.is-pinned) .sp-route li{opacity:1}
.sp-hiw:not(.is-pinned) .sp-route-fill{height:100%}
.sp-hiw:not(.is-pinned) .sp-route-dot{background:var(--sun)}
.sp-hiw:not(.is-pinned) .sp-route-dot::after{background:var(--ink)}
.sp-hiw:not(.is-pinned) .sp-scr{position:relative;opacity:1;transform:none}
.sp-hiw:not(.is-pinned) .sp-scr:not(.on){display:none}
.sp-hiw:not(.is-pinned) .sp-hiw-stage{padding-block:clamp(56px,7vw,104px)}

/* ── calculator ── */
.sp-calc{background:#FFF3CF;border-bottom:2px solid var(--ink)}
.sp-calcwrap{display:grid;gap:clamp(30px,5vw,72px);align-items:center}
@media(min-width:900px){.sp-calcwrap{grid-template-columns:1.02fr .98fr}}
.sp-readout{margin-top:clamp(22px,3vw,32px);background:var(--paper-50);border:2px solid var(--ink);
  border-radius:18px;padding:clamp(18px,2.2vw,26px);box-shadow:var(--hard)}
.sp-readout-k{font-size:11.5px;font-weight:800;letter-spacing:.13em;text-transform:uppercase;color:var(--ink-5)}
.sp-readout-n{display:block;font-family:var(--sp-display),sans-serif;font-weight:400;font-size:clamp(40px,4.6vw,66px);line-height:.9;color:var(--red);margin-top:6px}
.sp-readout-row{display:flex;align-items:baseline;gap:12px;font-size:14px;font-weight:600;color:var(--ink-6);
  border-top:1.5px dotted rgba(11,11,11,.26);padding-top:11px;margin-top:11px}
.sp-readout-row b{margin-left:auto;font-family:var(--sp-display),sans-serif;font-weight:400;font-size:20px;color:var(--ink)}
.sp-readout-win b{color:var(--red)}
.sp-readout-fine{margin:14px 0 0;font-size:12.5px;font-weight:600;color:var(--ink-5)}
.sp-calcvis{display:flex;justify-content:center}
.sp-machine{position:relative;width:min(340px,100%);display:flex;flex-direction:column;gap:14px;
  background:linear-gradient(#FDF7E8,#F3EAD5 60%,#EADFC2);border:3px solid var(--ink);border-radius:22px;
  padding:clamp(18px,1.9vw,24px);
  box-shadow:10px 12px 0 rgba(11,11,11,.82),inset 0 3px 0 rgba(255,255,255,.75),inset 0 -8px 0 rgba(11,11,11,.09)}
.sp-screw{position:absolute;width:9px;height:9px;border-radius:50%;border:1.5px solid var(--ink);
  background:radial-gradient(circle at 35% 30%,#FFF8E4 0 25%,#C9B98F 60%,#8F7F58)}
.sp-screw-1{top:9px;left:9px}.sp-screw-2{top:9px;right:9px}.sp-screw-3{bottom:9px;left:9px}.sp-screw-4{bottom:9px;right:9px}
.sp-machine-top{display:flex;align-items:center;justify-content:space-between}
.sp-machine-brand{font-family:var(--sp-display),sans-serif;font-size:17px;letter-spacing:.1em;color:var(--red)}
.sp-leds{display:flex;gap:7px}
.sp-leds i{width:11px;height:11px;border-radius:999px;border:1.5px solid rgba(11,11,11,.55);background:#C9B98F}
.sp-leds i.on{background:#3ADB76}
.sp-lcd{background:linear-gradient(#140A10,#241626 70%,#2E1B30);border:2.5px solid var(--ink);border-radius:10px;
  padding:14px 16px;box-shadow:inset 0 4px 10px rgba(0,0,0,.75),0 2px 0 rgba(255,255,255,.55)}
.sp-lcd-k{display:block;font-family:var(--sp-display),sans-serif;letter-spacing:.14em;font-size:11px;color:var(--sun)}
.sp-lcd-amt{display:flex;align-items:baseline;gap:8px;margin-top:6px}
.sp-lcd-amt b{font-family:var(--sp-display),sans-serif;font-weight:400;font-size:clamp(32px,3.2vw,44px);line-height:.9;
  color:var(--sun);font-variant-numeric:tabular-nums;text-shadow:0 0 14px rgba(255,198,11,.45);overflow-wrap:anywhere}
.sp-lcd-amt span{font-size:12px;font-weight:800;color:rgba(255,255,255,.5)}
.sp-modes{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.sp-modes button{appearance:none;border:2px solid var(--ink);border-radius:999px;background:var(--paper-3);
  min-height:44px;padding:9px 8px;font:inherit;font-weight:800;font-size:13px;color:var(--ink);cursor:pointer;
  transition:transform .18s var(--snap),box-shadow .18s,background .15s,color .15s}
.sp-modes button:hover{transform:translateY(-2px);box-shadow:var(--hard-sm)}
.sp-modes button.on{background:var(--red);color:#fff;transform:translateY(-2px);box-shadow:var(--hard-sm)}
.sp-keys{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.sp-keys button{appearance:none;display:grid;place-items:center;min-height:48px;border-radius:10px;
  background:linear-gradient(#FFFBEE,#FBF4E2 55%,#EFE3C6);border:2px solid var(--ink);
  box-shadow:0 4px 0 #C9B98F,0 4px 0 2px var(--ink),inset 0 2px 0 rgba(255,255,255,.8);
  font-family:var(--sp-display),sans-serif;font-weight:400;font-size:18px;color:var(--ink);cursor:pointer;
  transition:transform .12s var(--snap),box-shadow .12s,filter .15s;margin-bottom:6px}
.sp-keys button:hover{filter:brightness(1.05)}
.sp-keys button.kp,.sp-keys button:active{transform:translateY(4px);
  box-shadow:0 0 0 #C9B98F,0 0 0 2px var(--ink),inset 0 2px 4px rgba(0,0,0,.16)}
.sp-keys .sp-k-fn{background:linear-gradient(#F6C7BD,#E9A99C)}
.sp-keys .sp-k-zero{grid-column:span 2}
.sp-keys .sp-k-go{grid-column:span 2;background:linear-gradient(#E9566A,var(--red) 55%,var(--red-7));color:#fff;
  box-shadow:0 4px 0 #8E1626,0 4px 0 2px var(--ink),inset 0 2px 0 rgba(255,255,255,.3);
  text-transform:uppercase;letter-spacing:.04em;font-size:16px}

/* ── drivers ── */
.sp-drive{border-bottom:2px solid var(--ink)}
.sp-drive-g{display:grid;gap:clamp(28px,5vw,64px);align-items:center}
@media(min-width:900px){.sp-drive-g{grid-template-columns:.95fr 1.05fr}}
.sp-drive-art{border:2px solid var(--ink);border-radius:24px;overflow:hidden;box-shadow:var(--hard-lg);background:var(--paper-3)}
.sp-drive-art img{display:block;width:100%;height:auto}
.sp-ticks{list-style:none;margin:0 0 clamp(26px,3vw,34px);padding:0;display:flex;flex-direction:column;gap:12px}
.sp-ticks li{position:relative;padding-left:32px;font-size:15.5px;font-weight:600;line-height:1.45;color:var(--ink-6)}
.sp-ticks li::before{content:"✓";position:absolute;left:0;top:0;width:22px;height:22px;border-radius:999px;
  border:2px solid var(--ink);background:var(--sun);color:var(--ink);display:grid;place-items:center;font-size:12px;font-weight:900}

/* ── FAQ ── */
.sp-faqwrap{max-width:1000px}
.sp-faq-head{display:flex;align-items:center;gap:18px;margin-bottom:clamp(22px,3vw,38px)}
.sp-faq-h{font-size:clamp(38px,6vw,72px);margin:0}
.sp-faq-arrow{width:clamp(44px,4vw,58px);height:clamp(44px,4vw,58px);border-radius:999px;border:2px solid var(--ink);
  background:var(--sun);display:grid;place-items:center;font-size:22px;font-weight:900;box-shadow:var(--hard-sm)}
.sp-faq{display:flex;flex-direction:column;gap:12px}
.sp-faq details{background:var(--paper-50);border:2px solid var(--ink);border-radius:18px;overflow:hidden;box-shadow:var(--hard-sm)}
.sp-faq details[open]{background:#fff}
.sp-faq summary{list-style:none;display:flex;align-items:center;gap:18px;cursor:pointer;
  padding:clamp(18px,2.4vw,28px) clamp(18px,2.6vw,32px);font-size:clamp(17px,1.9vw,26px)}
.sp-faq summary::-webkit-details-marker{display:none}
.sp-faq-ic{margin-left:auto;flex:0 0 auto;position:relative;width:clamp(34px,3.2vw,44px);height:clamp(34px,3.2vw,44px);
  border-radius:999px;border:2px solid var(--red);background:var(--red);transition:transform .28s var(--snap),background .2s}
.sp-faq-ic::before,.sp-faq-ic::after{content:"";position:absolute;top:50%;left:50%;background:#fff;border-radius:2px;transform:translate(-50%,-50%)}
.sp-faq-ic::before{width:42%;height:2.5px}
.sp-faq-ic::after{width:2.5px;height:42%}
.sp-faq details[open] .sp-faq-ic{transform:rotate(135deg);background:var(--sun);border-color:var(--ink)}
.sp-faq details[open] .sp-faq-ic::before,.sp-faq details[open] .sp-faq-ic::after{background:var(--ink)}
.sp-faq-a{padding:0 clamp(18px,2.6vw,32px) clamp(20px,2.8vw,30px);max-width:74ch;font-size:15.5px;line-height:1.62;color:var(--ink-6)}

/* ── final CTA ── */
.sp-final{background:var(--red);color:#fff;border-block:2px solid var(--ink)}
.sp-final-in{display:flex;flex-wrap:wrap;gap:34px;align-items:center;justify-content:space-between}
.sp-final-h{font-size:clamp(32px,5.4vw,72px);margin:0 0 16px}
.sp-final-p{margin:0 0 28px;font-size:clamp(16px,1.4vw,20px);color:rgba(255,255,255,.86)}
.sp-final-btns{display:flex;gap:12px;flex-wrap:wrap}
.sp-final .sp-btn{background:#fff;color:var(--ink)}
.sp-final .sp-btn:hover{color:var(--ink)}
.sp-qr{background:#fff;border:2px solid var(--ink);border-radius:18px;padding:14px;box-shadow:var(--hard)}
.sp-qr img{display:block}

/* ── footer ── */
.sp-foot{background:var(--ink);color:var(--paper)}
.sp-foot-in{display:grid;grid-template-columns:1.6fr 1fr 1fr;gap:clamp(20px,3vw,40px);padding-block:clamp(38px,5vw,64px)}
.sp-foot-logo{height:30px;width:auto;filter:brightness(0) invert(1)}
.sp-foot-lock{margin:14px 0 8px;font-family:var(--sp-display),sans-serif;font-size:clamp(20px,2vw,26px);color:var(--sun)}
.sp-foot-lead p:last-child{margin:0;font-size:15px;line-height:1.5;opacity:.72;max-width:30ch}
.sp-foot h4{margin:0 0 12px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.2em;opacity:.5}
.sp-foot nav{display:flex;flex-direction:column;gap:9px}
.sp-foot nav a{color:inherit;font-size:14.5px;font-weight:600;opacity:.82;text-decoration:none}
.sp-foot nav a:hover{opacity:1;color:var(--sun)}
.sp-foot-base{display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;
  padding-block:18px 28px;font-size:12.5px;font-weight:600;opacity:.6;border-top:1px solid rgba(255,255,255,.16)}
.sp-foot-flag{background:rgba(255,255,255,.1);border-radius:999px;padding:5px 12px}
@media(max-width:820px){.sp-foot-in{grid-template-columns:1fr 1fr}}
@media(max-width:480px){.sp-foot-in{grid-template-columns:1fr}}

/* ── scroll primitives ── */
.sp-rv{opacity:0;transform:translateY(26px);
  transition:opacity .6s ease var(--rv-delay,0ms),transform .7s var(--snap) var(--rv-delay,0ms)}
.sp-rv.in{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.sp-rv{opacity:1;transform:none;transition:none}}

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
.sp-ai{background:var(--ink);color:var(--paper);border-block:2px solid var(--ink);overflow:hidden}
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

.sp-ai-phone{display:flex;justify-content:center}
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
.sp-ai-thread{flex:1;min-height:0;display:flex;flex-direction:column;gap:9px;padding:14px 13px;overflow:hidden}
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
  display:inline-flex;align-items:center;gap:16px;padding:8px 8px 8px 22px;
  border:2px solid var(--ink);border-radius:999px;background:var(--paper-50);
  box-shadow:5px 5px 0 var(--ink);
  transform:translate(-50%,130px);opacity:0;pointer-events:none;
  transition:transform .62s var(--spring),opacity .3s ease}
.sp-dock.up{transform:translate(-50%,0);opacity:1;pointer-events:auto}
.sp-dock-note{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;
  color:var(--ink-5);white-space:nowrap}
.sp-dock-btn{padding:12px 22px;font-size:14px;box-shadow:-3px 3px 0 var(--ink)}
@media(max-width:640px){
  .sp-dock{gap:0;padding:0;border:0;background:transparent;box-shadow:none}
  .sp-dock-note{display:none}
  .sp-dock-btn{padding:15px 30px;font-size:16px;box-shadow:4px 4px 0 var(--ink)}
}
@media(prefers-reduced-motion:reduce){.sp-dock{transition:none}}

/* ── the page rides over a footer pinned to the bottom of the viewport;
      RevealFooter drops back to a normal in-flow footer when it can't ── */
.sp-stage{position:relative;z-index:1;background:#FEFEFE}
.sp-footlayer.pinned{position:fixed;left:0;right:0;bottom:0;z-index:0}
`
