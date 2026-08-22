'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { APP_URLS } from '@/lib/app-links'
import { Tilt } from './Reveal'

/* The shared shell pieces: nav, final CTA, footer. Client only for the sake
 * of usePathname — there is no other state here. */

const LINKS = [
  ['/preview/ride', 'Ride'],
  ['/preview/drive', 'Drive'],
  ['/preview/about', 'About'],
  ['/preview/help', 'Help'],
]

export function SiteNav() {
  const path = usePathname()
  return (
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
      </div>
    </nav>
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
          <h4>Riders</h4>
          <nav>
            <Link href="/preview/ride">Riding with Spinr</Link>
            <Link href="/preview#math">The math</Link>
            <Link href="/preview#faq">FAQ</Link>
          </nav>
        </div>
        <div>
          <h4>Drivers</h4>
          <nav>
            <Link href="/preview/drive">Start driving</Link>
            <Link href="/preview/about">About Spinr</Link>
          </nav>
        </div>
        <div>
          <h4>Support</h4>
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
