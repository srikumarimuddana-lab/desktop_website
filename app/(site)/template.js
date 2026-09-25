'use client'

import { useEffect, useState } from 'react'

/*
 * Page transitions. A template (unlike the layout) remounts on every
 * navigation, so this is where a new page gets its entrance: a red and a
 * yellow panel wipe up off the screen and the page settles in behind them.
 *
 * Never on the first load. The visitor who just arrived from a search result
 * gets the page immediately — the curtain is for moving between pages, not a
 * splash screen in front of the first one. `navigated` is module state, so it
 * is only ever flipped in the browser; the server render always matches the
 * first client render.
 *
 * The curtain sits outside the animated wrapper on purpose: a transform on an
 * ancestor would pin a position:fixed child to that ancestor, not the screen.
 * Both are skipped under prefers-reduced-motion (see theme.js).
 */

let navigated = false

export default function SiteTemplate({ children }) {
  const [enter] = useState(() => navigated)

  useEffect(() => {
    navigated = true
  }, [])

  return (
    <>
      {enter ? (
        <div className="sp-curtain" aria-hidden="true">
          <i className="sp-curtain-sun" />
          <i className="sp-curtain-red">
            <span className="sp-display">Spinr</span>
          </i>
        </div>
      ) : null}
      <div className={`sp-page${enter ? ' is-enter' : ''}`}>{children}</div>
    </>
  )
}
