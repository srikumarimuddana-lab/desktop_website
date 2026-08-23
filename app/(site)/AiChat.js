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
 * Scroll drives the conversation. The section pins, and how far you are
 * through it decides which message is on screen, whether the assistant is
 * still thinking, and how much of its answer has been typed. Scroll back and
 * the thread rewinds. Where pinning isn't safe — narrow or short viewports,
 * reduced motion — the thread plays itself once on a timer instead.
 */

const THREAD = [
  { who: 'you', text: 'how much to the airport from Broadway?' },
  { who: 'ai',  text: 'About $28.40 all-in — ride fare, the $1 booking fee, the airport surcharge and GST. No surge.', tool: 'get_fare_quote' },
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

const clamp01 = (v) => Math.min(1, Math.max(0, v))

/* A question is sent in one gesture; an answer has to be thought about and
 * typed. Weighting the timeline that way keeps scroll from stalling on a line
 * the reader took in at a glance. */
const WEIGHT = THREAD.map((m) => (m.who === 'ai' ? 1.7 : 0.55))
const CUM = WEIGHT.reduce((acc, w, i) => [...acc, (acc[i - 1] || 0) + w], [])
const SPAN = CUM[CUM.length - 1]

/** progress 0..1 over the whole thread -> which message, and how far into it */
function atProgress(p) {
  const at = clamp01(p) * SPAN
  let i = CUM.findIndex((c) => at < c)
  if (i < 0) i = THREAD.length - 1
  const from = i ? CUM[i - 1] : 0
  return { i, local: clamp01((at - from) / WEIGHT[i]) }
}

/* The assistant's eyes follow the pointer. Pure decoration — it sits behind
 * aria-hidden, only runs on a fine pointer, and holds still under
 * prefers-reduced-motion. */
function Eyes() {
  const ref = useRef(null)
  const [d, setD] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    let frame = 0
    const onMove = (e) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        const dist = Math.hypot(dx, dy) || 1
        const reach = Math.min(1, dist / 240)
        setD({ x: (dx / dist) * 2.4 * reach, y: (dy / dist) * 2 * reach })
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  const pupil = { transform: `translate(${d.x.toFixed(2)}px, ${d.y.toFixed(2)}px)` }
  return (
    <span ref={ref} className="sp-eyes" aria-hidden="true">
      <i><b style={pupil} /></i>
      <i><b style={pupil} /></i>
    </span>
  )
}

export default function AiChat() {
  const wrapRef = useRef(null)
  const threadRef = useRef(null)
  const [pinned, setPinned] = useState(false)
  /* idx = message being delivered; local = 0..1 through that message */
  const [idx, setIdx] = useState(0)
  const [local, setLocal] = useState(0)

  useEffect(() => {
    // pinning needs the room for a full-height stage next to the phone
    const mq = window.matchMedia('(min-width: 1100px) and (min-height: 760px)')
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const decide = () => setPinned(mq.matches && !motion.matches)
    decide()
    mq.addEventListener('change', decide)
    motion.addEventListener('change', decide)
    return () => {
      mq.removeEventListener('change', decide)
      motion.removeEventListener('change', decide)
    }
  }, [])

  /* pinned: scroll is the transport for the conversation */
  useEffect(() => {
    if (!pinned) return
    let frame = 0
    const tick = () => {
      const el = wrapRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      if (travel <= 0) return
      // a lead-in and a hold at the end, so the last answer isn't cut off
      const p = clamp01((-rect.top / travel - 0.05) / 0.82)
      const { i, local: l } = atProgress(p)
      setIdx(i)
      setLocal(l)
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
  }, [pinned])

  /* unpinned: play it through once when it comes into view */
  useEffect(() => {
    if (pinned) return
    const el = wrapRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIdx(THREAD.length - 1); setLocal(1); return
    }
    const timers = []
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      THREAD.forEach((_, i) => {
        timers.push(setTimeout(() => { setIdx(i); setLocal(0) }, 400 + i * 1500))
        timers.push(setTimeout(() => setLocal(1), 400 + i * 1500 + 900))
      })
    }, { threshold: 0.3 })
    io.observe(el)
    return () => { io.disconnect(); timers.forEach(clearTimeout) }
  }, [pinned])

  /* keep the newest message in the phone's viewport */
  useEffect(() => {
    const el = threadRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [idx, local])

  const active = THREAD[idx]
  const thinking = active.who === 'ai' && local < 0.3
  const typedLen = active.who === 'ai'
    ? Math.round(clamp01((local - 0.3) / 0.55) * active.text.length)
    : active.text.length

  return (
    <section className={`sp-sec sp-ai${pinned ? ' is-pinned' : ''}`} id="ai" ref={wrapRef}>
      <div className="sp-ai-stage">
        <div className="sp-wrap sp-ai-g">
          <div>
            <span className="sp-kick sp-kick-light">In the app</span>
            <h2 className="sp-display sp-h2 sp-ai-h">
              Don&rsquo;t tap through menus.
              <br />
              <span className="sp-ai-hl">Just ask.</span>
            </h2>
            <p className="sp-ai-lede">
              Spinr&rsquo;s AI assistant is built into the app. Ask it to price a trip, book
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
            <span className="sp-ai-sticker sp-display" aria-hidden="true">Ask&nbsp;anything</span>
            <div className="sp-ai-frame">
              <span className="sp-ai-notch" aria-hidden="true" />
              <div className="sp-ai-head">
                <Eyes />
                Spinr AI Assistant
              </div>
              <div className="sp-ai-thread" ref={threadRef}>
                {THREAD.map((m, i) => {
                  if (i > idx) return null
                  const current = i === idx
                  if (current && thinking) return null
                  const text = current ? m.text.slice(0, typedLen) : m.text
                  return (
                    <div key={i} className={`sp-bub sp-bub-${m.who} in`}>
                      {m.tool && <span className="sp-bub-tool">{m.tool}</span>}
                      {text}
                      {current && text.length < m.text.length && (
                        <i className="sp-caret sp-caret-ai" aria-hidden="true" />
                      )}
                    </div>
                  )
                })}
                {thinking && (
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
      </div>
    </section>
  )
}
