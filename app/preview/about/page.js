import { FinalCta } from '../Chrome'
import { Reveal, SplitText, Marquee } from '../Reveal'
import Manifesto from './Manifesto'
import RefuseRail from './RefuseRail'
import DollarSplit from './DollarSplit'

/*
 * DESIGN SAMPLE — /preview/about
 * The company page. Its motion identity is EDITORIAL: a marker pen that
 * sweeps through the manifesto as you read it, and a horizontal rail of the
 * things the product refuses to become. No invented dates, headcounts or
 * ride totals — everything here is a stated position, not a claimed fact.
 */

export const metadata = { title: 'About | Spinr Design Sample' }

const HOME = [
  ['Saskatoon first', 'One city, properly served, before anywhere else. There is no planned launch in another city — including Regina.'],
  ['Canadian rules, by design', 'Privacy, insurance and trip-record obligations were the starting point of the build, not a compliance pass at the end.'],
  ['Money stays here', '100% Canadian owned and operated. The fare a Saskatoon rider pays is earned by a Saskatoon driver.'],
]

export default function AboutPage() {
  return (
    <>
      {/* ── hero ── */}
      <header className="sp-ahero" id="top">
        <div className="sp-wrap">
          <span className="sp-hero-badge sp-ap" style={{ '--ap-delay': '500ms', '--ap-y': '16px' }}>
            About Spinr
          </span>
          <h1 className="sp-display sp-ahero-h">
            <SplitText text="We built the" start={90} />
            <br />
            <SplitText as="span" className="sp-ahero-hl" text="boring option." start={290} />
          </h1>
          <p className="sp-ahero-p sp-ap" style={{ '--ap-delay': '740ms', '--ap-y': '22px' }}>
            No commission. No surge. No fee you have to go looking for.
            A rideshare app that behaves the same way on a Tuesday morning
            as it does at 2am on a long weekend.
          </p>
        </div>
        <span className="sp-ahero-rule" aria-hidden="true" />
      </header>

      <Marquee items={['100% Canadian owned and operated', 'Saskatoon', '0% commission', 'flat $1 fee', 'no surge, ever']} />

      {/* ── manifesto ── */}
      <Manifesto />

      {/* ── the refusals rail ── */}
      <RefuseRail />

      {/* ── where the money goes ── */}
      <DollarSplit />

      {/* ── home ground ── */}
      <section className="sp-sec sp-home" id="home">
        <div className="sp-wrap">
          <Reveal>
            <span className="sp-kick">Home ground</span>
            <h2 className="sp-display sp-h2">Built here, for here.</h2>
          </Reveal>
          <div className="sp-home-g">
            {HOME.map(([t, p], i) => (
              <Reveal key={t} delay={i * 100} className="sp-home-card">
                <h3 className="sp-display">{t}</h3>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FinalCta
        title={<>Fewer surprises.<br />That&rsquo;s the pitch.</>}
        sub="Available in Saskatoon."
      />
    </>
  )
}
