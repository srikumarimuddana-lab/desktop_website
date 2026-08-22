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

const RAIL = [
  { id: 'assistant', label: 'Ask the AI assistant' },
  ...HELP_CATEGORIES.map((c) => ({ id: c.id, label: c.title })),
  { id: 'faq', label: 'Quick answers' },
  { id: 'contact', label: 'Contact us' },
]

/* Articles the admin dashboard added that the static category lists don't
 * know about. Matched by slug so an admin edit of an existing article does
 * not produce a duplicate row on the page. */
function extraArticlesFor(categoryId, articles, staticSlugs) {
  return (articles || []).filter(
    (a) => (a.category || '').toLowerCase() === categoryId && !staticSlugs.has(a.slug)
  )
}

/* The ask box talks to the same /api/agent/search the chat widget uses, so
 * the help page and the assistant answer from one knowledge base. The
 * rider/driver toggle is not cosmetic — it is sent as user_type and steers
 * retrieval, so the two audiences get different sources for the same words. */
function AskBox() {
  const [audience, setAudience] = useState('rider')
  const [q, setQ] = useState('')
  const [state, setState] = useState({ status: 'idle' })

  const ask = async (e) => {
    e.preventDefault()
    const question = q.trim()
    if (!question || state.status === 'loading') return
    setState({ status: 'loading' })
    try {
      const res = await fetch('/api/agent/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, user_type: audience }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Search failed')
      setState({ status: 'done', answer: data.answer, sources: data.sources || [], source: data.source })
    } catch (err) {
      setState({ status: 'error', message: err.message })
    }
  }

  return (
    <form className="sp-ask" onSubmit={ask}>
      <div className="sp-ask-who" role="group" aria-label="I am a">
        <span>I am a</span>
        {['rider', 'driver'].map((a) => (
          <button
            key={a}
            type="button"
            className={audience === a ? 'on' : ''}
            aria-pressed={audience === a}
            onClick={() => setAudience(a)}
          >
            {a}
          </button>
        ))}
      </div>
      <div className="sp-ask-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={audience === 'driver' ? 'When do I get paid?' : 'What does a ride cost?'}
          aria-label="Ask a question"
        />
        <button className="sp-btn" type="submit" disabled={state.status === 'loading' || !q.trim()}>
          {state.status === 'loading' ? 'Asking…' : 'Ask'}
        </button>
      </div>

      {state.status === 'done' && (
        <div className="sp-ask-out">
          <p>{state.answer}</p>
          {state.sources?.length > 0 && (
            <p className="sp-ask-src">
              Answered from: {state.sources.map((s) => s.title).join(' · ')}
            </p>
          )}
        </div>
      )}
      {state.status === 'error' && (
        <div className="sp-ask-out sp-ask-err">
          <p>Couldn&rsquo;t reach the assistant just now — the topics below still cover most of it,
          or email support@spinr.ca.</p>
        </div>
      )}
    </form>
  )
}

export default function HelpClient({ faq = [], articles = [] }) {
  const bodyRef = useRef(null)
  const staticSlugs = new Set(HELP_CATEGORIES.flatMap((c) => c.articles.map((a) => a.slug)))
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
          <AskBox />
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
                  The box at the top of this page, the chat bubble in the corner, or
                  the app. It searches the same help material you see below and
                  answers in plain language — and in the app it can price a trip,
                  book or schedule a ride, and pull up a past receipt.
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
                {extraArticlesFor(cat.id, articles, staticSlugs).map((a) => (
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
              {faq.map(([q, a]) => (
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
