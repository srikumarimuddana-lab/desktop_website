import { previewMetadata, SITE_URL } from '@/lib/preview-content'
import { FinalCta } from '../Chrome'
import { Reveal, SplitText, Marquee } from '../Reveal'
import CanadaDots from '../CanadaDots'
import Manifesto from './Manifesto'
import RefuseRail from './RefuseRail'
import DollarSplit from './DollarSplit'
import JsonLdInjector from '@/components/seo/JsonLdInjector'

/*
 * /about
 * The company page. Its motion identity is EDITORIAL: a marker pen that
 * sweeps through the manifesto as you read it, and a horizontal rail of the
 * things the product refuses to become. No invented dates, headcounts or
 * ride totals — everything here is a stated position, not a claimed fact.
 */

// Every field here mirrors what's already published on the home page's own
// Organization JSON-LD (app/(site)/page.js) — nothing invented for this page.
// AboutPage.mainEntity is the standard schema.org way to point an about page
// at the entity it describes.
const ABOUT_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Spinr',
  url: `${SITE_URL}/about`,
  description: 'Spinr is a proudly Canadian rideshare platform: no commission on a driver’s fare, a flat $1 rider fee, and no surge pricing.',
  mainEntity: {
    '@type': 'Organization',
    name: 'Spinr',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'A Canadian rideshare platform. Drivers keep 100% of the net fare, riders pay a flat $1 fee, and there is no surge pricing.',
    areaServed: {
      '@type': 'City',
      name: 'Saskatoon',
      containedInPlace: { '@type': 'AdministrativeArea', name: 'Saskatchewan' },
    },
  },
}

export const revalidate = 0

export async function generateMetadata() {
  return previewMetadata('/about', {
    title: 'About Spinr | Proudly Canadian rideshare',
    description: 'Spinr is a proudly Canadian rideshare platform: no commission on a driver’s fare, a flat $1 rider fee, and no surge pricing. Built around Canadian privacy and insurance rules from the start.',
  })
}

const HOME = [
  ['Saskatoon first', 'One city, served properly, before the next one. Everything here has to work here before it works anywhere.'],
  ['Canadian rules, by design', 'Privacy, insurance and trip-record obligations were the starting point of the build, not a compliance pass at the end.'],
  ['Money stays here', 'Proudly Canadian. The fare a Saskatoon rider pays is earned by a Saskatoon driver.'],
]

export default function AboutPage() {
  return (
    <>
      <JsonLdInjector data={ABOUT_JSONLD} />

      {/* ── hero ── */}
      <header className="sp-ahero" id="top">
        <CanadaDots />
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

      <Marquee items={['Proudly Canadian', 'fair, both ways', 'Saskatoon', '0% commission', 'flat $1 fee', 'no surge, ever']} />

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
              <Reveal key={t} delay={i * 100} className="sp-home-card" variant="flip">
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
