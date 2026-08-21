'use client'

import { useEffect, useRef } from 'react'

/*
 * The map behind the in-app screens. Drawn rather than screenshotted, so it
 * stays sharp at any size and carries no real GPS trace — a straight red line
 * on a grid read as a wireframe, not a map.
 *
 * Saskatoon-shaped on purpose: a river cutting the grid on the diagonal, a
 * bridge where the avenue crosses it, parkland on both banks.
 *
 * `t` (0..1) draws the route and walks the car along it. The car is positioned
 * with getPointAtLength rather than a CSS motion path so it lands exactly on
 * the same curve the route is stroked from.
 */

const ROUTE = 'M34 268 C 44 232, 30 208, 58 186 S 104 168, 118 132 S 140 74, 166 44'

/* Two windows onto the same city. 'full' is the portrait screen; 'wide' is a
 * letterbox crop for the short map above a price card, framed so the river and
 * the bridge carry it without the pins, which fall outside. */
const VIEW = { full: '0 0 200 300', wide: '4 146 192 84' }

export default function AppMap({ t = 0, className = '', pins = true, route = true, view = 'full' }) {
  const clamped = Math.min(1, Math.max(0, t))
  const pathRef = useRef(null)
  const carRef = useRef(null)

  useEffect(() => {
    const path = pathRef.current
    const car = carRef.current
    if (!path || !car) return // no route drawn: nothing to walk along
    const len = path.getTotalLength()
    const at = len * clamped
    const a = path.getPointAtLength(Math.max(0, at - 2))
    const b = path.getPointAtLength(Math.min(len, at + 2))
    const deg = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + 90
    car.setAttribute('transform', `translate(${b.x.toFixed(2)} ${b.y.toFixed(2)}) rotate(${deg.toFixed(1)})`)
  }, [clamped])

  return (
    <svg
      className={`sp-map ${className}`.trim()}
      viewBox={VIEW[view] || VIEW.full}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="200" height="300" fill="#E7DFCF" />

      {/* parkland */}
      <rect x="6" y="14" width="50" height="42" rx="9" fill="#D3E6BE" />
      <rect x="128" y="228" width="78" height="64" rx="10" fill="#D3E6BE" />
      <rect x="150" y="96" width="46" height="34" rx="8" fill="#D3E6BE" />

      {/* the river, on the diagonal */}
      <path
        d="M-12 236 C 34 214, 58 176, 104 152 S 172 108, 212 96 L212 132 C 176 144, 128 176, 106 198 S 34 268, -12 282 Z"
        fill="#B6DDE6"
      />
      <path
        d="M-12 236 C 34 214, 58 176, 104 152 S 172 108, 212 96"
        fill="none" stroke="#8FC6D3" strokeWidth="1.5"
      />

      {/* street grid */}
      <g stroke="#FAF7EF" strokeLinecap="square" fill="none">
        <g strokeWidth="4.5">
          <path d="M0 34 H200" /><path d="M0 78 H200" /><path d="M0 122 H200" />
          <path d="M0 166 H200" /><path d="M0 210 H200" /><path d="M0 254 H200" />
          <path d="M28 0 V300" /><path d="M72 0 V300" /><path d="M116 0 V300" /><path d="M160 0 V300" />
        </g>
        {/* the avenue */}
        <path d="M-6 292 L206 26" strokeWidth="9" />
      </g>

      {/* the bridge: railings either side of the avenue, across the water */}
      <g stroke="rgba(11,11,11,.42)" strokeWidth="1.6" strokeLinecap="round">
        <path d="M43.3 238.1 L111.1 153.1" /><path d="M35.5 231.9 L103.3 146.9" />
      </g>

      {/* route: ghost underneath, then the live line drawn by t */}
      {route && (
        <>
          <path ref={pathRef} d={ROUTE} fill="none" stroke="rgba(11,11,11,.17)" strokeWidth="6" strokeLinecap="round" />
          <path
            d={ROUTE} fill="none" stroke="#DC3848" strokeWidth="5" strokeLinecap="round"
            pathLength="1" strokeDasharray="1" strokeDashoffset={1 - clamped}
          />
        </>
      )}

      {pins && route && (
        <>
          {/* pickup */}
          <circle cx="34" cy="268" r="7" fill="#fff" stroke="#0B0B0B" strokeWidth="2.5" />
          <circle cx="34" cy="268" r="2.6" fill="#0B0B0B" />
          {/* destination */}
          <path d="M166 30 c6.6 0 12 5.4 12 12 0 8.6-12 20-12 20s-12-11.4-12-20c0-6.6 5.4-12 12-12z"
                fill="#FFC60B" stroke="#0B0B0B" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="166" cy="42" r="4" fill="#0B0B0B" />
        </>
      )}

      {/* the car */}
      <g ref={carRef} style={{ display: route ? undefined : 'none' }}>
        <rect x="-9" y="-12.5" width="18" height="25" rx="6" fill="#fff" />
        <rect x="-7.2" y="-10.7" width="14.4" height="21.4" rx="4.8" fill="#0B0B0B" />
        <rect x="-5" y="-8.2" width="10" height="7" rx="2.5" fill="#A8E1DE" />
        <rect x="-5" y="1.4" width="10" height="5.4" rx="2.1" fill="#57575A" />
      </g>
    </svg>
  )
}
