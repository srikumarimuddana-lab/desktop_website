'use client'

import { useEffect, useRef, useState } from 'react'

/*
 * The manifesto: belief lines that a marker pen sweeps through as they cross
 * the reading line. Scroll back up and the highlights lift again. Under
 * reduced motion every line is simply lit.
 */

const LINES = [
  ['A ride is a simple thing.', 'Someone drives, someone pays, everyone gets home.'],
  ['The person doing the driving should be paid like it.', 'All of the fare. Not most of it.'],
  ['The person riding should know the price.', 'Before they book. Down to the tax line.'],
  ['And the company in the middle should charge like a company —', 'a flat dollar for the platform, out in the open — not a growing slice of someone else’s shift.'],
]

export default function Manifesto() {
  const ref = useRef(null)
  const [lit, setLit] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLit(LINES.length)
      return
    }
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const el = ref.current
        if (!el) return
        const items = [...el.querySelectorAll('.sp-man-line')]
        const focus = window.innerHeight * 0.62
        let n = 0
        items.forEach((li, i) => {
          if (li.getBoundingClientRect().top < focus) n = i + 1
        })
        setLit(n)
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
    <section className="sp-sec sp-man" id="beliefs" ref={ref}>
      <div className="sp-wrap sp-man-in">
        <span className="sp-kick">What we believe</span>
        {LINES.map(([strong, rest], i) => (
          <p key={i} className={`sp-man-line${i < lit ? ' lit' : ''}`}>
            <strong className="sp-display">{strong}</strong>{' '}
            <span className="sp-editorial">{rest}</span>
          </p>
        ))}
      </div>
    </section>
  )
}
