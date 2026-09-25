'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/*
 * One scroll listener and one pointer listener that give the whole site its
 * sense of depth, instead of every section wiring up its own:
 *
 *   heroes   --hero-p  0 at rest, 1 once the hero has scrolled away (parallax)
 *            --mx/--my -1..1 pointer position over the hero, eased (3D fan)
 *   .sp-roll --cover   0..1 how far the next sticky card has slid over this
 *                      one, so a covered card sinks back instead of just
 *                      being painted over
 *   :root    --mq-skew the ticker leans into fast scrolling and settles back
 *            [data-sp-scrolled] once the page has moved, for the nav
 *   cards    pointer-following 3D tilt on anything in TILT
 *
 * Everything writes CSS variables or inline transforms directly — no React
 * state, so a scroll frame never re-renders a component. The loop only runs
 * while something is still moving and stops once it settles.
 *
 * Under prefers-reduced-motion only the nav flag is kept (a colour change,
 * not movement). Tilt needs a real hovering pointer; touch gets none.
 */

const HEROES = '.sp-hero, .sp-rhero, .sp-dhero, .sp-ahero, .sp-sfhero, .sp-help-hero'
const TILT = [
  '.sp-tickets', '.sp-drive-art', '.sp-safe-card', '.sp-req-card', '.sp-cmp-card',
  '.sp-steps-card', '.sp-home-card', '.sp-rq-doc', '.sp-sf-card', '[data-tilt]',
].join(', ')
const MAX_TILT = 7 // degrees
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

export default function Depth() {
  const path = usePathname()

  useEffect(() => {
    const root = document.documentElement
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches

    const setFlag = () => {
      const on = window.scrollY > 40
      if (on !== root.hasAttribute('data-sp-scrolled')) root.toggleAttribute('data-sp-scrolled', on)
    }
    setFlag()
    if (still) {
      window.addEventListener('scroll', setFlag, { passive: true })
      return () => window.removeEventListener('scroll', setFlag)
    }

    /* Re-queried per route: the template remounts the page on navigation. */
    const heroes = Array.from(document.querySelectorAll(HEROES)).map((el) => ({
      el, mx: 0, my: 0, tx: 0, ty: 0, p: -1,
    }))
    const stacks = Array.from(document.querySelectorAll('.sp-roll')).map((el) =>
      Array.from(el.querySelectorAll(':scope > .sp-rcard'))
    )

    let frame = 0
    let lastY = window.scrollY
    let skew = 0
    let skewTarget = 0
    let tilted = null
    const releaseTimers = new WeakMap()

    const write = (el, name, v) => {
      const s = v.toFixed(3)
      if (el.style.getPropertyValue(name) !== s) el.style.setProperty(name, s)
    }

    const tick = () => {
      frame = 0
      let moving = false

      setFlag()

      // ticker lean — follows scroll speed, eases back to upright
      const y = window.scrollY
      skewTarget = clamp((y - lastY) * -0.3, -9, 9)
      lastY = y
      skew += (skewTarget - skew) * 0.18
      if (Math.abs(skew) < 0.02 && skewTarget === 0) skew = 0
      else moving = true
      root.style.setProperty('--mq-skew', `${skew.toFixed(2)}deg`)

      const vh = window.innerHeight
      for (const h of heroes) {
        const r = h.el.getBoundingClientRect()
        if (r.bottom < -vh || r.top > vh * 2) continue
        const p = clamp(-r.top / Math.max(1, r.height), 0, 1)
        if (Math.abs(p - h.p) > 0.0005) { h.p = p; write(h.el, '--hero-p', p) }
        h.mx += (h.tx - h.mx) * 0.1
        h.my += (h.ty - h.my) * 0.1
        if (Math.abs(h.tx - h.mx) > 0.002 || Math.abs(h.ty - h.my) > 0.002) moving = true
        write(h.el, '--mx', h.mx)
        write(h.el, '--my', h.my)
      }

      for (const cards of stacks) {
        for (let i = 0; i < cards.length; i++) {
          const cur = cards[i]
          const next = cards[i + 1]
          let cover = 0
          if (next) {
            const a = cur.getBoundingClientRect()
            const b = next.getBoundingClientRect()
            cover = clamp(1 - (b.top - a.top) / Math.max(1, a.height), 0, 1)
          }
          write(cur, '--cover', cover)
        }
      }

      if (moving) frame = requestAnimationFrame(tick)
    }
    const kick = () => { if (!frame) frame = requestAnimationFrame(tick) }

    /* ── pointer: hero parallax target + card tilt ── */
    const release = (el) => {
      if (!el) return
      el.classList.remove('sp-tilting')
      el.style.transition = 'transform .7s var(--spring)'
      el.style.transform = ''
      clearTimeout(releaseTimers.get(el))
      releaseTimers.set(el, setTimeout(() => { el.style.transition = '' }, 720))
    }

    const onMove = (e) => {
      const t = e.target instanceof Element ? e.target : null
      const over = t ? t.closest(HEROES) : null
      for (const h of heroes) {
        if (h.el === over) {
          const r = h.el.getBoundingClientRect()
          h.tx = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1)
          h.ty = clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1)
        } else {
          h.tx = 0
          h.ty = 0
        }
      }

      let card = t ? t.closest(TILT) : null
      // a card still sliding in from a Reveal keeps its entrance transform
      if (card && card.classList.contains('sp-rv') && !card.classList.contains('in')) card = null
      if (card !== tilted) {
        release(tilted)
        tilted = card
        if (card) {
          clearTimeout(releaseTimers.get(card))
          card.classList.add('sp-tilting')
          card.style.transition = 'transform .16s ease-out'
        }
      }
      if (card) {
        const r = card.getBoundingClientRect()
        const px = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1)
        const py = clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1)
        card.style.transform =
          `perspective(900px) rotateX(${(-py * MAX_TILT).toFixed(2)}deg) ` +
          `rotateY(${(px * MAX_TILT).toFixed(2)}deg) scale3d(1.02,1.02,1.02)`
      }
      kick()
    }
    const onLeave = () => {
      for (const h of heroes) { h.tx = 0; h.ty = 0 }
      release(tilted)
      tilted = null
      kick()
    }

    kick()
    window.addEventListener('scroll', kick, { passive: true })
    window.addEventListener('resize', kick)
    if (fine) {
      window.addEventListener('pointermove', onMove, { passive: true })
      document.addEventListener('pointerleave', onLeave)
    }
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', kick)
      window.removeEventListener('resize', kick)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      if (tilted) { tilted.classList.remove('sp-tilting'); tilted.style.transform = ''; tilted.style.transition = '' }
      root.style.removeProperty('--mq-skew')
    }
  }, [path])

  return null
}
