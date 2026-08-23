import Link from 'next/link'
import { previewMetadata } from '@/lib/preview-content'
import { FinalCta } from '../Chrome'
import { Reveal, SplitText } from '../Reveal'

/*
 * /safety — the trust surface, rebuilt in the site design.
 *
 * Carried over from the previous page, with two deliberate changes:
 *
 *  - No named agencies. The old copy said "RCMP criminal record check" and
 *    "SGI mechanical safety inspections". Naming a specific body implies an
 *    endorsement we do not have and dates badly if a process changes, so the
 *    checks are described by what they are.
 *  - The SOS section says plainly what SOS does NOT do. It alerts contacts
 *    and offers one-tap 911; it never dials on its own and never stands in
 *    for calling 911. Overstating that is the one thing on a safety page
 *    that could actually get someone hurt.
 */

export const revalidate = 0

export async function generateMetadata() {
  return previewMetadata('/safety', {
    title: 'Safety at Spinr | Screened drivers, insured trips',
    description:
      'Every Spinr driver passes a criminal record check with vulnerable sector screening. Every vehicle is inspected annually. Every trip is covered by commercial ride-share insurance.',
  })
}

const SCREENING = [
  ['Criminal record check', 'Every driver passes one before their first trip, and again every year they keep driving.'],
  ['Vulnerable sector screening', 'The enhanced check, on top of the standard one — because riders include people who cannot easily advocate for themselves.'],
  ['Driving abstract', 'Three years of licensed experience, and a record free of major violations and Criminal Code driving offences.'],
  ['Zero tolerance', 'One confirmed report of drugs or alcohol behind the wheel ends a driver’s account permanently. There is no second warning.'],
]

const VEHICLE = [
  ['Annual mechanical inspection', 'Every car on the platform passes a full safety inspection each year, by a licensed inspector.'],
  ['Under ten years old', 'A hard cut-off, checked at onboarding and enforced as a car ages out.'],
  ['Commercial ride-share cover', 'A ride-share endorsement is required to go online, and the cover runs door to door — not just while a passenger is aboard.'],
  ['Documents that expire, block', 'Licence, insurance or registration lapses and the driver cannot go online until it is current. It is checked every single time.'],
]

const INAPP = [
  ['Share your trip', 'Send live progress to anyone you choose, on any ride, without them needing the app.'],
  ['Numbers stay private', 'Calls and messages between rider and driver are masked. Neither side ever sees the other’s number.'],
  ['Both sides are rated', 'Ratings run both ways, and accounts that fall below our threshold leave the platform — riders included.'],
  ['The route is recorded', 'Every trip is GPS-tracked, so there is a record if anything is ever disputed.'],
]

export default function SafetyPage() {
  return (
    <>
      <header className="sp-sfhero" id="top">
        <div className="sp-wrap">
          <span className="sp-hero-badge sp-ap" style={{ '--ap-delay': '460ms', '--ap-y': '16px' }}>
            Safety at Spinr
          </span>
          <h1 className="sp-display sp-sfhero-h">
            {/* no comma: a low thin glyph in Anton anti-aliases to a smudge at
                display size — the same reason it came off the home headline */}
            <SplitText text="Boring" start={100} />
            <br />
            <SplitText as="span" className="sp-sfhero-hl" text="on purpose." start={280} />
          </h1>
          <p className="sp-sfhero-p sp-ap" style={{ '--ap-delay': '700ms', '--ap-y': '22px' }}>
            A safe ride is one where nothing happens. Everything below exists so
            that stays the most likely outcome — checked before a driver ever
            picks you up, not after something goes wrong.
          </p>
        </div>
      </header>

      <section className="sp-sec sp-sf" id="drivers">
        <div className="sp-wrap">
          <Reveal>
            <span className="sp-kick">Who is driving</span>
            <h2 className="sp-display sp-h2">Four checks, before the first trip.</h2>
          </Reveal>
          <div className="sp-sf-g">
            {SCREENING.map(([t, p], i) => (
              <Reveal key={t} delay={i * 80} className="sp-sf-card">
                <span className="sp-sf-n sp-display" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="sp-display">{t}</h3>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="sp-sec sp-sf sp-sf-alt" id="vehicles">
        <div className="sp-wrap">
          <Reveal>
            <span className="sp-kick">The car itself</span>
            <h2 className="sp-display sp-h2">Road-ready, or off the road.</h2>
          </Reveal>
          <div className="sp-sf-g">
            {VEHICLE.map(([t, p], i) => (
              <Reveal key={t} delay={i * 80} className="sp-sf-card">
                <span className="sp-sf-n sp-display" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="sp-display">{t}</h3>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* the honest one — what SOS is, and what it is not */}
      <section className="sp-sec sp-sos" id="sos">
        <div className="sp-wrap sp-sos-in">
          <Reveal>
            <span className="sp-kick sp-kick-light">If something feels wrong</span>
            <h2 className="sp-display sp-h2 sp-sos-h">The SOS button, honestly.</h2>
          </Reveal>
          <div className="sp-sos-g">
            <Reveal className="sp-sos-does" delay={80}>
              <span className="sp-sos-lbl">What it does</span>
              <ul>
                <li>Alerts the emergency contacts you have saved</li>
                <li>Alerts our safety team, with your live location and trip</li>
                <li>Offers one-tap 911, already dialled, ready to send</li>
              </ul>
            </Reveal>
            <Reveal className="sp-sos-not" delay={180}>
              <span className="sp-sos-lbl">What it does not</span>
              <ul>
                <li>It does not call 911 for you</li>
                <li>It does not replace calling 911</li>
              </ul>
              <p>
                If you are in danger, call 911. The button is there to bring
                people to you faster &mdash; it is not the emergency service, and we
                will never pretend otherwise.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="sp-sec sp-sf" id="in-app">
        <div className="sp-wrap">
          <Reveal>
            <span className="sp-kick">Every trip</span>
            <h2 className="sp-display sp-h2">What runs in the background.</h2>
          </Reveal>
          <div className="sp-sf-g">
            {INAPP.map(([t, p], i) => (
              <Reveal key={t} delay={i * 80} className="sp-sf-card">
                <span className="sp-sf-n sp-display" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="sp-display">{t}</h3>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={340}>
            <p className="sp-sf-more">
              Something to report, or a question this page did not answer?{' '}
              <Link href="/help">The help centre</Link> has the detail, and{' '}
              <a href="mailto:support@spinr.ca">support@spinr.ca</a> reaches a person.
            </p>
          </Reveal>
        </div>
      </section>

      <FinalCta
        title={<>A ride where<br />nothing happens.</>}
        sub="Riding in Saskatoon."
      />
    </>
  )
}
