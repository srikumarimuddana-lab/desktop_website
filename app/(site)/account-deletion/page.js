import Link from 'next/link'
import { previewMetadata } from '@/lib/preview-content'
import { Reveal } from '../Reveal'

/*
 * /account-deletion — how to close a Spinr account, and what actually happens.
 *
 * The previous version of this page said deletion "permanently removed all
 * personal data, including ride history" and that it happened "immediately
 * upon confirmation". Neither is true, and the gap is not a detail:
 *
 *  - Saskatchewan transportation rules and tax law require trip records to be
 *    kept for seven years. A deletion request cannot override that, and the
 *    backend does not try to — purge_pii_retention() scrubs profile fields and
 *    leaves the trip record standing.
 *  - Profile scrubbing runs within 30 days, not instantly.
 *
 * Promising a deletion the law forbids is worse than explaining the limit, so
 * this page states the limit. If the retention windows change, they change in
 * the backend first (backend/migrations, purge_pii_retention) and here second.
 */

export const revalidate = 0

export async function generateMetadata() {
  return previewMetadata('/account-deletion', {
    title: 'Delete your Spinr account',
    description:
      'How to close your Spinr account, what is erased, and what the law requires us to keep. Profile details are scrubbed within 30 days.',
  })
}

const ERASED = [
  ['Your name and contact details', 'Name, email and phone come off your profile.'],
  ['Saved addresses', 'Home, work and any other place you saved.'],
  ['Payment methods', 'Cards are removed from your account and detached at our payment processor.'],
  ['Your login', 'The account stops working. You cannot sign back in.'],
]

const KEPT = [
  ['Trip records', '7 years', 'Required by Saskatchewan transportation rules and by tax law. This applies to every ride-share operator, not just us, and a deletion request cannot override it.'],
  ['Which driver and vehicle took which trip', '7 years', 'The same requirement — a trip record has to remain attributable to be a valid record.'],
  ['Pickup and dropoff locations', '3 years', 'Only the two ends of a trip, never the route in between. Dropped sooner than the trip record itself.'],
]

export default function AccountDeletionPage() {
  return (
    <>
      <header className="sp-adhero">
        <div className="sp-wrap">
          <span className="sp-kick">Your account</span>
          <h1 className="sp-display sp-adhero-h">Deleting your account.</h1>
          <p className="sp-adhero-p">
            You can close your Spinr account whenever you like. Here is how, and
            &mdash; more usefully &mdash; exactly what happens to your information afterwards.
          </p>
        </div>
      </header>

      <div className="sp-wrap sp-ad">
        <Reveal className="sp-ad-how">
          <h2 className="sp-display">In the app</h2>
          <ol className="sp-ad-steps">
            <li><b>Profile</b> &rarr; <b>View Profile</b> &rarr; <b>Account Information</b></li>
            <li>Choose <b>Delete My Account</b></li>
            <li>Confirm when asked</li>
          </ol>
          <p className="sp-ad-note">
            That is the fastest route and it needs nothing from us.
          </p>
        </Reveal>

        <Reveal className="sp-ad-how" delay={90}>
          <h2 className="sp-display">By email</h2>
          <p>
            If you cannot get into the app, write to{' '}
            <a href="mailto:support@spinr.ca?subject=Account%20Deletion%20Request">support@spinr.ca</a>{' '}
            with the subject <b>Account Deletion Request</b>, and include:
          </p>
          <ul className="sp-ad-list">
            <li>the phone number or email your account uses</li>
            <li>a reason, if you feel like telling us &mdash; entirely optional</li>
          </ul>
          <p className="sp-ad-note">
            We will confirm by reply. If a request arrives from an address we
            cannot match to an account, we will ask you to verify rather than
            act on it &mdash; that check protects your account from someone else.
          </p>
        </Reveal>

        <Reveal className="sp-ad-block" delay={120}>
          <h2 className="sp-display">What is erased</h2>
          <p className="sp-ad-lede">Within 30 days of your request:</p>
          <div className="sp-ad-g">
            {ERASED.map(([t, p]) => (
              <div className="sp-ad-card" key={t}>
                <span className="sp-ad-tick" aria-hidden="true">&#10003;</span>
                <h3>{t}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="sp-ad-block" delay={140}>
          <h2 className="sp-display">What we have to keep</h2>
          <p className="sp-ad-lede">
            Some records we are legally required to hold on to, and closing your
            account does not change that. We would rather say so than promise
            you an erasure we are not allowed to perform.
          </p>
          <dl className="sp-ad-keep">
            {KEPT.map(([t, span, why]) => (
              <div key={t}>
                <dt>
                  <span>{t}</span>
                  <b className="sp-display">{span}</b>
                </dt>
                <dd>{why}</dd>
              </div>
            ))}
          </dl>
          <p className="sp-ad-note">
            These records are not used to contact you, market to you, or build a
            profile of you. They sit in the ledger because the law says they
            must, and they are deleted when the window closes.
          </p>
        </Reveal>

        <Reveal className="sp-ad-foot" delay={160}>
          <p>
            The full detail is in the <Link href="/legal/privacy">privacy policy</Link>.
            For anything else, <Link href="/help">the help centre</Link> or{' '}
            <a href="mailto:support@spinr.ca">support@spinr.ca</a>.
          </p>
        </Reveal>
      </div>
    </>
  )
}
