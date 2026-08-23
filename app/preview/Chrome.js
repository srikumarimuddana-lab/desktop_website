'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { APP_URLS } from '@/lib/app-links'
import { Tilt } from './Reveal'

/* The shared shell pieces: nav, final CTA, footer. */

const LINKS = [
  ['/preview/ride', 'Ride'],
  ['/preview/drive', 'Drive'],
  ['/preview/about', 'About'],
  ['/preview/help', 'Help'],
]

export function SiteNav() {
  const path = usePathname()
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)
  const btnRef = useRef(null)

  const close = () => setOpen(false)

  /* Navigating closes it. Route changes are the whole point of the menu, so
     leaving it open over the new page would cover what you just asked for. */
  useEffect(close, [path])

  /* Past 900px the links are back in the bar; an open panel there is a
     leftover, so a resize past the breakpoint dismisses it. */
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 900px)')
    wide.addEventListener('change', close)
    return () => wide.removeEventListener('change', close)
  }, [])

  useEffect(() => {
    if (!open) return

    /* Hold the page still and mute the docked CTA underneath — the panel is
       an overlay, and a page scrolling behind one reads as broken. */
    const root = document.documentElement
    const prev = document.body.style.overflow
    root.classList.add('sp-menu-open')
    document.body.style.overflow = 'hidden'

    const first = panelRef.current?.querySelector('a')
    first?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') {
        close()
        btnRef.current?.focus()
        return
      }
      if (e.key !== 'Tab') return
      // keep Tab inside the panel and its button, so nothing behind the
      // overlay can be reached without seeing it
      const stops = [btnRef.current, ...(panelRef.current?.querySelectorAll('a') || [])].filter(Boolean)
      if (!stops.length) return
      const edge = e.shiftKey ? stops[0] : stops[stops.length - 1]
      if (document.activeElement === edge) {
        e.preventDefault()
        ;(e.shiftKey ? stops[stops.length - 1] : stops[0]).focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      root.classList.remove('sp-menu-open')
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <>
      <nav className="sp-nav">
        <Link href="/preview" className="sp-nav-logo" aria-label="Spinr home">
          <Image src="/logo.webp" alt="Spinr" width={92} height={30} priority />
        </Link>
        <div className="sp-nav-links">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} aria-current={path === href ? 'page' : undefined}
                  className={path === href ? 'is-here' : ''}>
              {label}
            </Link>
          ))}
          <Link href="/preview#ai" className="sp-nav-ai">
            <span aria-hidden="true">&#10022;</span>AI assistant
          </Link>
        </div>
        <div className="sp-nav-cta">
          <a className="sp-btn" href="#get">Get Spinr</a>
          <button ref={btnRef} type="button" onClick={() => setOpen((v) => !v)}
                  className={`sp-burger${open ? ' is-open' : ''}`}
                  aria-expanded={open} aria-controls="sp-menu"
                  aria-label={open ? 'Close menu' : 'Open menu'}>
            <span className="sp-burger-box" aria-hidden="true"><i /><i /><i /></span>
          </button>
        </div>

        {open && (
          <div className="sp-menu" id="sp-menu" ref={panelRef}>
            <span className="sp-menu-kick">Go to</span>
            {LINKS.map(([href, label], i) => (
              <Link key={href} href={href} className="sp-menu-row" style={{ '--i': i }}
                    aria-current={path === href ? 'page' : undefined}>
                <span className="sp-display">{label}</span>
                <b aria-hidden="true">&rarr;</b>
              </Link>
            ))}
            <Link href="/preview#ai" className="sp-menu-ai" style={{ '--i': LINKS.length }}>
              <span aria-hidden="true">&#10022;</span>Ask the AI assistant
            </Link>
          </div>
        )}
      </nav>

      {open && <div className="sp-menu-scrim" onClick={close} aria-hidden="true" />}
    </>
  )
}

/* Every page ends on the same red room — only the words change. The #get id
 * is what the docked CTA watches for. */
export function FinalCta({ title, sub, store = 'rider' }) {
  const urls = APP_URLS[store] || APP_URLS.rider
  return (
    <section className="sp-sec sp-final" id="get">
      <div className="sp-wrap sp-final-in">
        <div>
          <h2 className="sp-display sp-final-h">{title}</h2>
          <p className="sp-final-p">
            {sub} <span className="sp-editorial">Proudly Canadian. Fair, both ways.</span>
          </p>
          <div className="sp-final-btns">
            <a className="sp-btn" href={urls.ios} target="_blank" rel="noopener noreferrer">App Store</a>
            <a className="sp-btn-ghost sp-btn-ghost-dark" href={urls.android} target="_blank" rel="noopener noreferrer">Google Play</a>
          </div>
        </div>
        <Tilt className="sp-qr" max={5}>
          <Image src="/spinr_qr_code.png" alt="Scan to download Spinr" width={150} height={150} />
        </Tilt>
      </div>
    </section>
  )
}

export function SiteFooter() {
  return (
    <footer className="sp-foot">
      <div className="sp-wrap sp-foot-in">
        <div className="sp-foot-lead">
          <Image src="/logo.webp" alt="Spinr" width={120} height={38} className="sp-foot-logo" />
          <p className="sp-display sp-foot-lock">Fair, both ways.</p>
          <p>Canada&rsquo;s own rideshare. Serving Saskatoon.</p>
        </div>
        <div>
          <h3>Riders</h3>
          <nav>
            <Link href="/preview/ride">Riding with Spinr</Link>
            <Link href="/preview#math">The math</Link>
            <Link href="/preview#faq">FAQ</Link>
          </nav>
        </div>
        <div>
          <h3>Drivers</h3>
          <nav>
            <Link href="/preview/drive">Start driving</Link>
            <Link href="/preview/about">About Spinr</Link>
          </nav>
        </div>
        <div>
          <h3>Support</h3>
          <nav>
            <Link href="/preview/help">Help centre</Link>
            <Link href="/preview/legal/terms">Terms of service</Link>
            <Link href="/preview/legal/privacy">Privacy policy</Link>
          </nav>
        </div>
      </div>
      <div className="sp-wrap sp-foot-base">
        <span>Saskatoon, SK &middot; support@spinr.ca</span>
        <span className="sp-foot-flag">Design sample &middot; /preview &middot; not linked from the live site</span>
      </div>
    </footer>
  )
}
