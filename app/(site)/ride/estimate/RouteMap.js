'use client'

import { useEffect, useRef } from 'react'

/*
 * The route map.
 *
 * Leaflet over OpenStreetMap tiles — no API key, which matters because this
 * site has no Google Maps credential and putting one in a public marketing
 * bundle to draw a line would be the wrong trade. The site already leans on
 * the OSM ecosystem for geocoding (Nominatim), so this is consistent.
 *
 * The line drawn is NOT our own guess at the route. `points` is the polyline
 * the backend got from Google Directions and priced the trip on, already
 * decoded to [[lat, lng], ...] server-side. So the shape on screen is the
 * shape the fare was calculated from — if we drew our own route it could
 * disagree with the number beside it.
 *
 * Leaflet is imported dynamically inside the effect because it touches
 * `window` at module scope and would break the server render otherwise. The
 * parent loads this component with ssr:false for the same reason.
 */

/** Fallback when Directions gave us no polyline: a straight pickup→dropoff
 *  line, so the map still shows the trip rather than an empty city. */
function fallbackLine(pickup, dropoff) {
  return [
    [pickup.lat, pickup.lng],
    [dropoff.lat, dropoff.lng],
  ]
}

export default function RouteMap({ pickup, dropoff, points, approximate }) {
  const holder = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    let map

    ;(async () => {
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')
      if (cancelled || !holder.current || mapRef.current) return

      map = L.map(holder.current, {
        // A fare preview is for reading, not exploring. Scroll-wheel zoom on a
        // map embedded mid-page hijacks the page scroll, which is the single
        // most irritating thing an embedded map can do.
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: true,
      })
      mapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        // ODbL requires attribution. Leaflet renders it bottom-right.
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      const line = points && points.length > 1 ? points : fallbackLine(pickup, dropoff)

      L.polyline(line, {
        color: '#DB3344',
        weight: 5,
        opacity: 0.9,
        // Dashed when we are drawing our own straight line rather than the
        // road route, so the map does not imply a precision it does not have.
        dashArray: approximate ? '8 8' : null,
        lineJoin: 'round',
      }).addTo(map)

      const pin = (fill) =>
        L.divIcon({
          className: 'sp-map-pin-wrap',
          html: `<span class="sp-map-pin" style="--pin:${fill}"></span>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        })

      L.marker([pickup.lat, pickup.lng], { icon: pin('#0B0B0B'), title: 'Pickup' }).addTo(map)
      L.marker([dropoff.lat, dropoff.lng], { icon: pin('#DB3344'), title: 'Destination' }).addTo(map)

      map.fitBounds(L.latLngBounds(line), { padding: [42, 42], maxZoom: 15 })
    })()

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [pickup, dropoff, points, approximate])

  // The "this line is approximate" caveat deliberately lives in the parent,
  // not here: this component is loaded with ssr:false, so anything inside it
  // is invisible until hydration. A statement about how accurate the route is
  // should be in the server-rendered markup, not gated behind a JS bundle.
  return (
    <div className="sp-fe-map">
      <div ref={holder} className="sp-fe-map-canvas" role="img" aria-label="Map of the route from pickup to destination" />
    </div>
  )
}
