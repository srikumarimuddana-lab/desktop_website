import Link from 'next/link'
import { previewMetadata } from '@/lib/preview-content'
import { FinalCta } from '../../Chrome'
import { Reveal } from '../../Reveal'

/*
 * /drive/requirements — the detail behind the four cards on /drive.
 *
 * SOURCE OF TRUTH: the eligibility rules the backend actually enforces at
 * onboarding and on every go_online call. The retired /support/requirements
 * page disagreed with them on four points — it said two years of driving
 * history (three is enforced), that every licence class 1–5 was accepted
 * (Class 5 is the standard route and 1–4 need separate approval), that
 * vehicles had to be model-year 2017 or newer (the rule is an age, under ten
 * years, which moves each year), and it stated a minimum age of 25 that
 * appears in no other surface and no backend check.
 *
 * Confirmed with the owner on 2026-08-23: the backend's rules are
 * authoritative. If any of these change they change in the backend first —
 * see the Saskatchewan Regulatory section of the backend CLAUDE.md — and here
 * second, alongside /drive and /safety, which state the same things shorter.
 */

export const revalidate = 0

export async function generateMetadata() {
  return previewMetadata('/drive/requirements', {
    title: 'Driver and vehicle requirements | Spinr',
    description:
      'What you need to drive with Spinr in Saskatoon: a full Class 5 licence held three years, a criminal record check with vulnerable sector screening, a vehicle under ten years old, and ride-share insurance.',
  })
}

const DRIVER = [
  [
    'A full Class 5 licence',
    'The standard Saskatchewan licence. A learner or novice licence does not qualify. Class 1 to 4 holders can drive with Spinr, but need separate approval first — start the application and we will walk you through it.',
  ],
  [
    'Three years of licensed experience',
    'Counted from when you were fully licensed, not from when you first held a learner permit. Experience earned outside Canada can count; bring the documentation and we will review it.',
  ],
  [
    'A clean driving record',
    'No major violations in the past three years, and no Criminal Code driving offences. We check the abstract at onboarding and again each year.',
  ],
  [
    'A criminal record check',
    'Including vulnerable sector screening. Renewed annually for as long as you keep driving — not once at signup and forgotten.',
  ],
]

const VEHICLE = [
  [
    'Under ten years old',
    'An age, not a fixed model year, so the cut-off moves with the calendar. A car that ages past ten years comes off the platform.',
  ],
  [
    'Four doors, four or more passenger seats',
    'Every seat with a working seatbelt. Two-door cars do not qualify.',
  ],
  [
    'Passes an annual safety inspection',
    'A full mechanical inspection by a licensed inspector, every twelve months.',
  ],
  [
    'Sound condition, clean title',
    'Good cosmetic and mechanical order. Salvage, rebuilt and non-repairable titles are not eligible, and neither are taxis, stretch limousines or most rental vehicles.',
  ],
]

const DOCS = [
  ['Driver’s licence', 'Front and back, current and unexpired.'],
  ['Driving abstract', 'Dated within the last 30 days.'],
  ['Vehicle registration', 'In your name, or with documented permission to drive it.'],
  ['Insurance with a ride-share endorsement', 'Standard personal cover is not enough — the policy has to carry the ride-share endorsement.'],
  ['Annual inspection certificate', 'From a licensed inspector.'],
  ['Criminal record check', 'With vulnerable sector screening.'],
]

export default function RequirementsPage() {
  return (
    <>
      <header className="sp-rqhero">
        <div className="sp-wrap">
          <nav className="sp-ans-crumb" aria-label="Breadcrumb">
            <Link href="/drive">Driving with Spinr</Link>
            <span aria-hidden="true">/</span>
            <span className="sp-rqhero-here">Requirements</span>
          </nav>
          <h1 className="sp-display sp-rqhero-h">What you&rsquo;ll need.</h1>
          <p className="sp-rqhero-p">
            Everything checked before your first trip, and most of it checked
            again every year. Nothing here is a surprise later.
          </p>
        </div>
      </header>

      <section className="sp-sec sp-rq" id="driver">
        <div className="sp-wrap">
          <Reveal>
            <span className="sp-kick">You</span>
            <h2 className="sp-display sp-h2">Driver requirements.</h2>
          </Reveal>
          <dl className="sp-rq-list">
            {DRIVER.map(([t, p], i) => (
              <Reveal as="div" key={t} delay={i * 70}>
                <dt className="sp-display">{t}</dt>
                <dd>{p}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="sp-sec sp-rq sp-rq-alt" id="vehicle">
        <div className="sp-wrap">
          <Reveal>
            <span className="sp-kick">Your car</span>
            <h2 className="sp-display sp-h2">Vehicle requirements.</h2>
          </Reveal>
          <dl className="sp-rq-list">
            {VEHICLE.map(([t, p], i) => (
              <Reveal as="div" key={t} delay={i * 70}>
                <dt className="sp-display">{t}</dt>
                <dd>{p}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="sp-sec sp-rq" id="documents">
        <div className="sp-wrap">
          <Reveal>
            <span className="sp-kick">To upload</span>
            <h2 className="sp-display sp-h2">Six documents.</h2>
            <p className="sp-lede sp-rq-lede">
              All of it goes in from your phone during the application. If one
              expires while you are driving, you cannot go online again until it
              is current &mdash; the check runs every single time.
            </p>
          </Reveal>
          <div className="sp-rq-docs">
            {DOCS.map(([t, p], i) => (
              <Reveal key={t} delay={i * 60} className="sp-rq-doc">
                <span className="sp-rq-doc-n sp-display" aria-hidden="true">{i + 1}</span>
                <div>
                  <b>{t}</b>
                  <span>{p}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={420}>
            <p className="sp-rq-more">
              Not sure whether something you have qualifies? Ask{' '}
              <Link href="/help">the help centre</Link> or write to{' '}
              <a href="mailto:support@spinr.ca">support@spinr.ca</a> before you
              apply &mdash; it is quicker than finding out halfway through.
            </p>
          </Reveal>
        </div>
      </section>

      <FinalCta
        store="driver"
        title={<>Everything checked.<br />Then you drive.</>}
        sub="Driving in Saskatoon."
      />
    </>
  )
}
