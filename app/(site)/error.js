'use client'

import { useEffect } from 'react'
import Link from 'next/link'

/*
 * The error boundary for every site route. There was none before, so any
 * runtime failure in a page fell through to Next's unstyled default screen —
 * off-brand, and with no way back into the site.
 *
 * Kept deliberately plain: this renders when something has already gone
 * wrong, so it depends on as little as possible. The digest is shown because
 * it is the only handle support has for matching a report to a server log,
 * and it is an opaque hash, not error detail.
 */

export default function SiteError({ error, reset }) {
  useEffect(() => {
    console.error('[site] render failed:', error?.message, error?.digest || '')
  }, [error])

  return (
    <section className="sp-sec sp-404">
      <div className="sp-wrap">
        <span className="sp-kick">Something broke</span>
        <h1 className="sp-display sp-404-h">
          That did not
          <br />
          <span className="sp-404-hl">load properly.</span>
        </h1>
        <p className="sp-404-p">
          The page failed on our side, not yours. Trying again often clears it;
          if it does not, the help centre and the app both still work.
        </p>
        <div className="sp-404-btns">
          <button className="sp-btn" type="button" onClick={() => reset()}>
            Try again
          </button>
          <Link className="sp-btn-ghost" href="/">
            Back to home
          </Link>
        </div>
        {error?.digest && <p className="sp-404-digest">Reference: {error.digest}</p>}
      </div>
    </section>
  )
}
