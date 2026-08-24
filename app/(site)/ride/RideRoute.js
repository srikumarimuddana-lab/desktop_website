/*
 * Hero backdrop for the ride page: a beaded street grid on the cream, a
 * soft river band along the top with a bridge (the Saskatoon touch),
 * and one route whose dots flow from the pulsing pickup pin, along the
 * bottom, up the right edge to the destination ring at the riverfront. The copy block owns the centre, so every mid-opacity shape
 * stays in the margins; phones (which crop the sides) still get the
 * bottom run and the pickup pin. Pure SVG + CSS; reduced motion stills
 * all of it (theme.js).
 */

const GRID_X = Array.from({ length: 13 }, (_, i) => 48 + i * 96)
const GRID_Y = Array.from({ length: 7 }, (_, i) => 56 + i * 96)

export default function RideRoute() {
  return (
    <svg
      className="sp-rroute"
      viewBox="0 0 1200 640"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <g className="sp-rr-grid" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.1 10" fill="none">
        {GRID_Y.map((y) => (
          <line key={'h' + y} x1="0" y1={y} x2="1200" y2={y} />
        ))}
        {GRID_X.map((x) => (
          <line key={'v' + x} x1={x} y1="0" x2={x} y2="640" />
        ))}
      </g>
      <path
        className="sp-rr-water"
        d="M-30,90 C260,125 640,135 1230,75"
        fill="none"
        strokeWidth="40"
        strokeLinecap="round"
      />
      <g className="sp-rr-bridge" strokeWidth="2">
        <line x1="1001" y1="58" x2="1001" y2="134" />
        <line x1="1015" y1="58" x2="1015" y2="134" />
      </g>
      <path
        className="sp-rr-path"
        d="M-30,586 H1050 V176"
        fill="none"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeDasharray="0.1 11"
      />
      <g>
        <circle className="sp-rr-ring" cx="430" cy="586" r="12" fill="none" stroke="#DB3344" strokeWidth="3" />
        <circle cx="430" cy="586" r="7" fill="#DB3344" stroke="#0B0B0B" strokeWidth="2" />
      </g>
      <g>
        <circle className="sp-rr-ring sp-rr-ring-b" cx="1050" cy="176" r="12" fill="none" stroke="#DB3344" strokeWidth="3" />
        <circle cx="1050" cy="176" r="6.5" fill="#fff" stroke="#DB3344" strokeWidth="4" />
      </g>
    </svg>
  )
}
