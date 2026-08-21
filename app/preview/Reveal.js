'use client'

import { useEffect, useRef, useState } from 'react'

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
