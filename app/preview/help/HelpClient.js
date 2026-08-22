'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import SafeHtml from '@/components/ui/SafeHtml'
import { HELP_CATEGORIES, ARTICLE_CONTENT } from '@/constants/helpTopics'

/*
 * The consolidated help page: help topics, FAQ and support in one place,
 * with a reading rail that tracks where you are. Content comes from the
 * same sources the live help centre uses — constants/helpTopics.js for
 * categories and article bodies, live /help/article/ routes for the
 * articles that only exist there.
 */

const FAQ = [
  ['What does a ride actually cost?', 'The ride fare, a flat $1 booking fee — the only fee Spinr keeps — plus pass-through charges where they apply (insurance, city or airport fees) and tax, each shown by name before you book. No surge multiplier, ever.'],
  ['Which fees does Spinr keep?', 'One: the $1 booking fee. The fare goes to your driver, the insurance fee to the insurer, city and airport fees to the city and airport, tax to the government — collected and passed through, never marked up.'],
  ['How does 0% commission work?', 'Drivers keep 100% of the net fare. The platform runs on the rider’s flat $1 booking fee and corporate accounts — never on a cut of the driver’s money.'],
  ['Where can I use Spinr?', 'Spinr is available in Saskatoon, Saskatchewan. There is no planned launch in any other city at this time.'],
  ['Who is driving me?', 'Every driver passes a criminal record check with vulnerable sector screening, holds a full driver’s licence with at least three years of experience, and carries commercial ride-share insurance.'],
  ['Can the AI assistant book for me?', 'Yes — ask it to price a trip, book or schedule a ride, pull up a past receipt, or check your wallet. It hands you to a human when it should.'],
]

const RAIL = [
  { id: 'assistant', label: 'Ask the AI assistant' },
  ...HELP_CATEGORIES.map((c) => ({ id: c.id, label: c.title })),
  { id: 'faq', label: 'Quick answers' },
  { id: 'contact', label: 'Contact us' },
]

export default function HelpClient() {
  const bodyRef = useRef(null)
  const [active, setActive] = useState('assistant')

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
    <div className="sp-help">
      <header className="sp-help-hero">
        <div className="sp-wrap">
          <span className="sp-kick">Help centre</span>
          <h1 className="sp-display sp-help-h">How can we help?</h1>
          <p className="sp-help-lede">
            Everything about riding, driving and your account — in one place.
          </p>
        </div>
      </header>

      <div className="sp-wrap sp-help-g">
        <nav className="sp-legal-rail sp-help-rail" aria-label="Help sections">
          <span className="sp-legal-rail-k">Jump to</span>
          {RAIL.map((r) => (
            <a key={r.id} href={`#${r.id}`} className={active === r.id ? 'is-on' : ''}>{r.label}</a>
          ))}
        </nav>

        <div className="sp-help-body" ref={bodyRef}>
          {/* fastest route first */}
          <section id="assistant" className="sp-help-ai">
            <h2 className="sp-display" data-sec="assistant">The fastest answer</h2>
            <div className="sp-help-ai-card">
              <span className="sp-help-ai-spark" aria-hidden="true">&#10022;</span>
              <div>
                <b>Ask the AI assistant</b>
                <p>
                  In the app, or the chat bubble in the corner of this page. It can
                  price a trip, book or schedule a ride, pull up a past receipt —
                  and it hands you to a human when it should.
                </p>
              </div>
            </div>
          </section>

          {HELP_CATEGORIES.map((cat) => (
            <section key={cat.id} id={cat.id} className="sp-help-cat">
              <h2 className="sp-display" data-sec={cat.id}>{cat.title}</h2>
              <p className="sp-help-cat-p">{cat.description}</p>

              {cat.articles.filter((a) => ARTICLE_CONTENT[a.id]).map((a) => (
                <details key={a.id} className="sp-help-art">
                  <summary>
                    <span className="sp-display">{a.title}</span>
                    <span className="sp-faq-ic" aria-hidden="true" />
                  </summary>
                  <SafeHtml className="sp-help-art-body" content={ARTICLE_CONTENT[a.id].content} />
                </details>
              ))}

              <ul className="sp-help-links">
                {cat.articles.filter((a) => !ARTICLE_CONTENT[a.id]).map((a) => (
                  <li key={a.id}>
                    <Link href={`/help/article/${a.slug}`}>{a.title}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section id="faq" className="sp-help-cat">
            <h2 className="sp-display" data-sec="faq">Quick answers</h2>
            <div className="sp-faq">
              {FAQ.map(([q, a]) => (
                <details key={q}>
                  <summary>
                    <span className="sp-display">{q}</span>
                    <span className="sp-faq-ic" aria-hidden="true" />
                  </summary>
                  <div className="sp-faq-a">{a}</div>
                </details>
              ))}
            </div>
          </section>

          <section id="contact" className="sp-help-contact">
            <h2 className="sp-display" data-sec="contact">Still stuck? A human, then.</h2>
            <div className="sp-help-contact-g">
              <a className="sp-help-contact-card" href="mailto:support@spinr.ca">
                <span className="sp-display">Email us</span>
                <p>support@spinr.ca — include your trip date if it&rsquo;s about a ride.</p>
              </a>
              <div className="sp-help-contact-card">
                <span className="sp-display">In the app</span>
                <p>Support &rarr; chat with us. Your trip details come along automatically.</p>
              </div>
              <Link className="sp-help-contact-card" href="/account-deletion">
                <span className="sp-display">Leaving?</span>
                <p>Request account deletion — we keep only what the law requires.</p>
              </Link>
            </div>
            <p className="sp-help-legal-links">
              The fine print: <Link href="/preview/legal/terms">Terms of service</Link>
              {' '}&middot;{' '}
              <Link href="/preview/legal/privacy">Privacy policy</Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
