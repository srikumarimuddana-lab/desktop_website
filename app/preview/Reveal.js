'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import { APP_URLS } from '@/lib/app-links'

/* Shared scroll primitives for the sample page.
 * All of them no-op under prefers-reduced-motion: content is simply present. */

function useInView(ref, { once = true, threshold = 0.2 } = {}) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) setInView(false)
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, once, threshold])
  return inView
}

/** Slides up into place, with an optional stagger index. */
export function Reveal({ children, delay = 0, as: Tag = 'div', className = '', ...rest }) {
  const ref = useRef(null)
  const inView = useInView(ref)
  return (
    <Tag
      ref={ref}
      className={`sp-rv${inView ? ' in' : ''} ${className}`.trim()}
      style={{ '--rv-delay': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** Counts a number up when it scrolls into view. Prefix/suffix stay put. */
export function CountUp({ to, prefix = '', suffix = '', duration = 1100, decimals = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref)
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVal(to)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setVal(to * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration])

  return (
    <span ref={ref}>
      {prefix}
      {val.toFixed(decimals)}
      {suffix}
    </span>
  )
}

/** Endless ticker. Duplicated once so the loop has no seam. */
export function Marquee({ items, reverse = false }) {
  const run = [...items, ...items]
  return (
    <div className="sp-mq" aria-hidden="true">
      <div className={`sp-mq-track${reverse ? ' rev' : ''}`}>
        {run.map((t, i) => (
          <span key={i} className="sp-display">
            {t}
            <i className="sp-mq-dot" />
          </span>
        ))}
      </div>
    </div>
  )
}

/** Tilts slightly as it passes through the viewport. */
export function Tilt({ children, max = 3, className = '' }) {
  const ref = useRef(null)
  const [deg, setDeg] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        const mid = r.top + r.height / 2
        const p = (mid - window.innerHeight / 2) / window.innerHeight // -0.5..0.5-ish
        setDeg(Math.max(-1, Math.min(1, p)) * max)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [max])

  return (
    <div ref={ref} className={className} style={{ transform: `rotate(${deg.toFixed(2)}deg)` }}>
      {children}
    </div>
  )
}

/** Headline that assembles itself letter by letter as it scrolls in.
 *  Words stay whole so the line still wraps normally, and the readable
 *  string is kept on the wrapper for screen readers — the per-letter
 *  spans are hidden from them. Plain text under prefers-reduced-motion. */
export function SplitText({ text, as: Tag = 'span', className = '', step = 16, start = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { threshold: 0.05 })
  const words = String(text).split(' ')
  let n = -1
  return (
    <Tag ref={ref} className={`sp-split${inView ? ' in' : ''} ${className}`.trim()} aria-label={text}>
      {words.map((w, wi) => (
        <Fragment key={wi}>
          <span className="sp-split-w" aria-hidden="true">
            {Array.from(w).map((ch, ci) => {
              n += 1
              return (
                <span className="sp-split-c" key={ci} style={{ '--c-delay': `${start + n * step}ms` }}>
                  {ch}
                </span>
              )
            })}
          </span>
          {wi < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  )
}

/** Thick scroll-progress bar pinned to the top of the page. */
export function ScrollProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const h = document.documentElement.scrollHeight - window.innerHeight
        setP(h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0)
      })
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
    <div className="sp-progress" aria-hidden="true">
      <i style={{ transform: `scaleX(${p})` }} />
    </div>
  )
}

/** The bar docked to the bottom edge: the two app stores, and a way into the
 *  in-app assistant. Rides up out of the page once the hero is behind you, and
 *  drops back down when the real CTA arrives so the two never sit on screen
 *  together. */
export function StickyCta({ href = '#get' }) {
  const ref = useRef(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    let frame = 0
    let atCta = false
    const apply = () => {
      // the root layout parks a cookie banner on the bottom edge; sit above it
      const banner = document.querySelector('.CookieConsent')
      if (ref.current) {
        ref.current.style.setProperty('--dock-lift', `${banner ? banner.offsetHeight + 10 : 0}px`)
      }
      setShow(window.scrollY > window.innerHeight * 0.7 && !atCta)
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        apply()
      })
    }
    const target = document.querySelector(href)
    const io = target
      ? new IntersectionObserver(
          ([e]) => {
            atCta = e.isIntersecting
            apply()
          },
          { threshold: 0.12 }
        )
      : null
    if (io && target) io.observe(target)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      if (io) io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [href])

  const tab = show ? 0 : -1
  return (
    <div ref={ref} className={`sp-dock${show ? ' up' : ''}`}>
      <a className="sp-dock-ai" href="#ai" tabIndex={tab}>
        <span className="sp-dock-spark" aria-hidden="true">&#10022;</span>
        <span>
          <b>Ask the assistant</b>
          <i>Book, price, look up a trip</i>
        </span>
      </a>
      <span className="sp-dock-rule" aria-hidden="true" />
      <span className="sp-dock-note">Get the app</span>
      <a className="sp-btn sp-dock-btn" href={APP_URLS.rider.ios} tabIndex={tab}
         target="_blank" rel="noopener noreferrer">App&nbsp;Store</a>
      <a className="sp-btn-ghost sp-dock-btn" href={APP_URLS.rider.android} tabIndex={tab}
         target="_blank" rel="noopener noreferrer">Google&nbsp;Play</a>
    </div>
  )
}

/** Replaces the system pointer with a dot and a ring that trails it, the ring
 *  swelling over anything clickable. Desktop pointers only, and skipped
 *  entirely under prefers-reduced-motion — hiding the real cursor is not
 *  something to do to someone who has asked for less movement. */
export function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || still.matches) return

    const root = document.documentElement
    root.classList.add('sp-cursor-on')
    setOn(true)

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let rx = x
    let ry = y
    let raf = 0
    let seen = false

    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      if (!seen) { seen = true; rx = x; ry = y; root.classList.add('sp-cursor-live') }
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      const hot = e.target instanceof Element
        ? e.target.closest('a, button, summary, [role="button"], input, .sp-k')
        : null
      if (ringRef.current) ringRef.current.classList.toggle('hot', Boolean(hot))
    }
    const loop = () => {
      rx += (x - rx) * 0.19
      ry += (y - ry) * 0.19
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    const press = (v) => () => ringRef.current && ringRef.current.classList.toggle('down', v)
    const leave = () => root.classList.remove('sp-cursor-live')
    const enter = () => seen && root.classList.add('sp-cursor-live')

    raf = requestAnimationFrame(loop)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', press(true))
    window.addEventListener('pointerup', press(false))
    document.addEventListener('pointerleave', leave)
    document.addEventListener('pointerenter', enter)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', press(true))
      window.removeEventListener('pointerup', press(false))
      document.removeEventListener('pointerleave', leave)
      document.removeEventListener('pointerenter', enter)
      root.classList.remove('sp-cursor-on', 'sp-cursor-live')
    }
  }, [])

  if (!on) return null
  return (
    <div className="sp-cur" aria-hidden="true">
      <i ref={ringRef} className="sp-cur-ring"><b /></i>
      <i ref={dotRef} className="sp-cur-dot" />
    </div>
  )
}

/** Pins the footer to the bottom of the viewport and lets the page slide up
 *  off it, so the last screenful is uncovered rather than scrolled to.
 *  Falls back to an ordinary in-flow footer when the effect would misbehave:
 *  reduced motion, narrow screens, or a footer taller than the viewport. */
export function RevealFooter({ children }) {
  const ref = useRef(null)
  const [h, setH] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const narrow = window.matchMedia('(max-width: 760px)')
    const measure = () => {
      const height = el.offsetHeight
      const ok = !reduce.matches && !narrow.matches && height < window.innerHeight * 0.85
      setH(ok ? height : 0)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <>
      <div className="sp-footgap" style={{ height: h ? `${h}px` : 0 }} aria-hidden="true" />
      <div ref={ref} className={`sp-footlayer${h ? ' pinned' : ''}`}>
        {children}
      </div>
    </>
  )
}
