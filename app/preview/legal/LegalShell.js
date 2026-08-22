'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

/*
 * Shared frame for the legal pages: a sticky table-of-contents rail that
 * tracks reading position, editorial body type, and — because the source
 * documents are drafts pending review by Saskatchewan counsel — a DRAFT
 * stamp that stays visible. The stamp comes off when the text has been
 * signed off, not before.
 */

export default function LegalShell({ kicker, doc, other }) {
  const bodyRef = useRef(null)
  const [active, setActive] = useState('')

  /* The active section is the LAST heading above the reading line — an
   * intersection band alone goes blank the moment you scroll past one. */
  useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    let frame = 0
    const tick = () => {
      const heads = [...el.querySelectorAll('[data-sec]')]
      if (!heads.length) return
      const line = window.innerHeight * 0.28
      let cur = heads[0].dataset.sec
      for (const h of heads) {
        if (h.getBoundingClientRect().top <= line) cur = h.dataset.sec
        else break
      }
      setActive(cur)
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => { frame = 0; tick() })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="sp-legal">
      <header className="sp-legal-hero">
        <div className="sp-wrap">
          <span className="sp-kick">{kicker}</span>
          <h1 className="sp-display sp-legal-h">{doc.docTitle.toLowerCase()}</h1>
          <p className="sp-legal-updated">
            {doc.updated || 'Last updated: [pending publication]'}
          </p>
          <span className="sp-legal-draft sp-display" role="note">
            Draft &middot; pending legal review
          </span>
        </div>
      </header>

      <div className="sp-wrap sp-legal-g">
        <nav className="sp-legal-rail" aria-label="Sections">
          <span className="sp-legal-rail-k">On this page</span>
          {doc.sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'is-on' : ''}>
              {s.title.toLowerCase()}
            </a>
          ))}
        </nav>

        <article className="sp-legal-body" ref={bodyRef}>
          {doc.intro.map((p, i) => (
            <p key={i} className="sp-legal-lede">{p}</p>
          ))}
          {doc.sections.map((s) => (
            <section key={s.id} id={s.id}>
              <h2 className="sp-display" data-sec={s.id}>{s.title.toLowerCase()}</h2>
              {s.paras.map((p, i) => <p key={i}>{p}</p>)}
            </section>
          ))}
          <div className="sp-legal-next">
            <Link className="sp-btn-ghost" href={other.href}>{other.label}</Link>
            <Link className="sp-btn-ghost" href="/preview/help">Help centre</Link>
          </div>
        </article>
      </div>
    </div>
  )
}
