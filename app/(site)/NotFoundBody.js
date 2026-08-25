import Link from 'next/link'

/*
 * The body of every 404 on the site, shared by two entry points:
 *   app/not-found.js        — unmatched URLs, which render under the ROOT
 *                             layout and so must bring the shell themselves
 *   app/(site)/not-found.js — notFound() from a site route (a legal doc, a
 *                             help answer or a promotion that is not there),
 *                             which already sits inside the site layout
 *
 * A 404's job is to get someone out of the dead end, so it offers the places
 * people actually arrive looking for rather than a lone "back to home".
 */

const WAYS_OUT = [
  { href: '/ride', label: 'Riding with Spinr' },
  { href: '/drive', label: 'Driving with Spinr' },
  { href: '/help', label: 'Help centre' },
]

export default function NotFoundBody() {
  return (
    <section className="sp-sec sp-404">
      <div className="sp-wrap">
        <span className="sp-kick">Error 404</span>
        <h1 className="sp-display sp-404-h">
          This page took
          <br />
          <span className="sp-404-hl">a wrong turn.</span>
        </h1>
        <p className="sp-404-p">
          The address you followed does not lead anywhere on Spinr. It may have
          moved, or the link that brought you here may be out of date.
        </p>
        <div className="sp-404-btns">
          <Link className="sp-btn" href="/">
            Back to home
          </Link>
          <Link className="sp-btn-ghost" href="/help">
            Search the help centre
          </Link>
        </div>
        <ul className="sp-404-ways">
          {WAYS_OUT.map((w) => (
            <li key={w.href}>
              <Link href={w.href}>{w.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
