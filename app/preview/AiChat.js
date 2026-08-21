'use client'

import { useEffect, useRef, useState } from 'react'

/*
 * "Just ask" — promotes the AI assistant that ships in the Spinr app.
 *
 * Every capability named here maps to a tool actually registered in
 * backend/ai/tools_*.py (get_fare_quote, propose_ride_booking,
 * get_ride_receipt, get_wallet_balance, escalate_to_support, …).
 *
 * The privacy line is deliberately specific. backend/ai/pii.py strips phone
 * numbers, emails, payment card numbers and GPS coordinates before a message
 * reaches the provider — it does NOT claim to catch names, so neither do we.
 *
 * The thread below plays itself when scrolled into view.
 */

const THREAD = [
  { who: 'you', text: 'how much to the airport from Broadway?' },
  { who: 'ai',  text: 'About $28.40 — fare, the $1 platform fee and GST. No surge.', tool: 'get_fare_quote' },
  { who: 'you', text: 'book it for 6am tomorrow' },
  { who: 'ai',  text: 'Scheduled for 6:00am. I’ll send the driver details the night before.', tool: 'propose_ride_booking' },
  { who: 'you', text: 'what did my trip last Friday cost?' },
  { who: 'ai',  text: 'Fri 15 Aug, Nutana → Midtown, $18.65. Want the receipt?', tool: 'get_ride_history' },
]

/* Grouped to match the tools actually registered in backend/ai/tools_*.py */
const GROUPS = [
  {
    k: 'Book a ride',
    items: ['Quote a fare before you book', 'Book it, or schedule it for later', 'Find a place or use a saved one'],
  },
  {
    k: 'Your past rides',
    items: ['Pull up any previous trip', 'What a ride cost and why', 'Send you the receipt'],
  },
  {
    k: 'Money',
    items: ['Wallet balance and transactions', 'Promos available to you'],
  },
  {
    k: 'Everything else',
    items: ['Track the ride you’re on now', 'Answer questions about Spinr', 'Hand you to a human when it should'],
  },
]

export default function AiChat() {
  const ref = useRef(null)
  const [shown, setShown] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setShown(THREAD.length); return }

    let timers = []
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      THREAD.forEach((_, i) => {
        timers.push(setTimeout(() => setShown(i + 1), 450 + i * 850))
      })
    }, { threshold: 0.35 })
    io.observe(el)
    return () => { io.disconnect(); timers.forEach(clearTimeout) }
  }, [])

  return (
    <section className="sp-sec sp-ai" id="ai" ref={ref}>
      <div className="sp-wrap sp-ai-g">
        <div>
          <span className="sp-kick sp-kick-light">In the app</span>
          <h2 className="sp-display sp-h2 sp-ai-h">
            Don&rsquo;t tap through menus.
            <br />
            <span className="sp-ai-hl">Just ask.</span>
          </h2>
          <p className="sp-ai-lede">
            Spinr&rsquo;s assistant is built into the app. Ask it to price a trip, book
            or schedule the ride, or pull up what you paid three Fridays ago —
            in plain language, no menus.
          </p>

          <div className="sp-ai-groups">
            {GROUPS.map((g) => (
              <div className="sp-ai-group" key={g.k}>
                <h3 className="sp-display sp-ai-gk">{g.k}</h3>
                <ul>
                  {g.items.map((c) => (
                    <li key={c}><span aria-hidden="true">&#10003;</span>{c}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="sp-ai-fine">
            Phone numbers, email addresses, card numbers and GPS coordinates are
            stripped from your message before it reaches the model.
          </p>
        </div>

        {/* chat mock */}
        <div className="sp-ai-phone">
          <div className="sp-ai-frame">
            <span className="sp-ai-notch" aria-hidden="true" />
            <div className="sp-ai-head">
              <span className="sp-ai-dot" aria-hidden="true" />
              Spinr Assistant
            </div>
            <div className="sp-ai-thread">
              {THREAD.map((m, i) => (
                <div
                  key={i}
                  className={`sp-bub sp-bub-${m.who}${i < shown ? ' in' : ''}`}
                >
                  {m.tool && <span className="sp-bub-tool">{m.tool}</span>}
                  {m.text}
                </div>
              ))}
              {shown < THREAD.length && (
                <div className="sp-bub sp-bub-ai in sp-bub-typing" aria-hidden="true">
                  <i /><i /><i />
                </div>
              )}
            </div>
            <div className="sp-ai-input" aria-hidden="true">
              Ask anything<span className="sp-ai-send">&#8593;</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
