/*
 * Hero backdrop for the drive page: an earnings line that only ever
 * goes up. A beaded step-line climbs from a small start dot to a
 * pulsing "current total" marker, its beads flowing upward along the
 * path; a quiet beaded baseline grounds it as a chart. Positioned by
 * theme.js into the hero's open sky - the upper-right quadrant above
 * the phone fan on desktop, the top band under the nav on phones - so
 * it never sits behind copy. Reduced motion stills all of it.
 */

export default function EarnLine() {
  return (
    <svg
      className="sp-dchart"
      viewBox="0 0 600 150"
      preserveAspectRatio="xMidYMin meet"
      aria-hidden="true"
      focusable="false"
    >
      <line className="sp-dc-base" x1="15" y1="140" x2="585" y2="140"
        strokeWidth="2" strokeLinecap="round" strokeDasharray="0.1 8" fill="none" />
      <path
        className="sp-dc-line"
        d="M20,132 H90 V114 H170 V100 H260 V82 H350 V70 H440 V46 H530 V34 H562"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="0.1 9"
      />
      <circle cx="20" cy="132" r="3.5" fill="#0B0B0B" opacity=".45" />
      <g>
        <circle className="sp-dc-ring" cx="575" cy="34" r="10" fill="none" stroke="#DB3344" strokeWidth="2.5" />
        <circle cx="575" cy="34" r="5.5" fill="#DB3344" stroke="#0B0B0B" strokeWidth="2" />
      </g>
    </svg>
  )
}
