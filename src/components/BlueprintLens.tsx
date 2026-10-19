import { buildLensLayout } from '../optics/lensLayout'
import { spacingAtFocal } from '../optics/zoom'

export function BlueprintLens() {
  const layout = buildLensLayout(spacingAtFocal(50))
  const frontX = Math.min(...layout.elements.map((element) => element.startX))
  const backX = layout.imageX

  return (
    <svg
      className="blueprint-lens-svg"
      viewBox="0 0 980 440"
      role="img"
      aria-label="NIKKOR Z 24-200 光学镜组蓝图，50 毫米焦距"
    >
      <defs>
        <pattern id="bp-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#5eead4" strokeOpacity="0.08" strokeWidth="1" />
        </pattern>
        <pattern id="bp-grid-major" width="120" height="120" patternUnits="userSpaceOnUse">
          <path d="M 120 0 L 0 0 0 120" fill="none" stroke="#5eead4" strokeOpacity="0.13" strokeWidth="1" />
        </pattern>
        <radialGradient id="bp-glow" cx="50%" cy="50%" r="60%">
          <stop offset="0" stopColor="#22d3ee" stopOpacity="0.08" />
          <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
        <filter id="bp-soft-glow" x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="980" height="440" fill="url(#bp-grid)" />
      <rect width="980" height="440" fill="url(#bp-grid-major)" />
      <rect width="980" height="440" fill="url(#bp-glow)" />

      <text x="34" y="36" className="bp-kicker">PATENT EXAMPLE 8 / OPTICAL SECTION</text>
      <text x="34" y="58" className="bp-subkicker">19 ELEMENTS · 15 GROUPS · 6 FUNCTIONAL GROUPS</text>
      <text x="946" y="36" textAnchor="end" className="bp-kicker">DRAWING 24-200 / REV 1.0</text>
      <text x="946" y="58" textAnchor="end" className="bp-subkicker">FOCAL 50 mm · SCALE 4.72 px/mm</text>

      <line x1="34" y1={STAGE_CENTER} x2="946" y2={STAGE_CENTER} className="bp-axis" />
      <text x="34" y={STAGE_CENTER - 8} className="bp-axis-label">OPTICAL AXIS / 光轴</text>

      {layout.groups.map((group) => (
        <g key={group.id}>
          <text x={group.centerX} y="88" textAnchor="middle" className="bp-group-label" fill={group.color}>
            {group.id} {group.power}
          </text>
          <path
            d={`M ${group.minX} 108 v 8 H ${group.maxX} v -8`}
            fill="none"
            stroke={group.color}
            strokeOpacity="0.55"
            strokeWidth="1.1"
          />
        </g>
      ))}

      {layout.elements.map((element) => (
        <g key={element.id}>
          <path
            d={element.path}
            fill={element.groupColor}
            fillOpacity={element.group === 'G5' ? 0.16 : 0.07}
            stroke={element.groupColor}
            strokeWidth={element.group === 'G5' ? 1.6 : 1}
            strokeOpacity={element.group === 'G5' ? 0.95 : 0.8}
            filter={element.group === 'G5' ? 'url(#bp-soft-glow)' : undefined}
          />
          <line
            x1={element.centerX}
            y1={element.topY}
            x2={element.centerX}
            y2={element.bottomY}
            stroke={element.groupColor}
            strokeOpacity="0.22"
            strokeWidth="0.7"
          />
        </g>
      ))}

      <line x1={layout.apertureX} y1="118" x2={layout.apertureX} y2="330" className="bp-aperture" />
      <circle cx={layout.apertureX} cy={STAGE_CENTER} r="16" className="bp-aperture-ring" />
      <text x={layout.apertureX} y="108" textAnchor="middle" className="bp-label">S / STOP</text>

      <line x1={layout.imageX} y1="104" x2={layout.imageX} y2="340" className="bp-image-plane" />
      <text x={layout.imageX} y="92" textAnchor="middle" className="bp-label">像面 / IMAGE</text>
      <text x={layout.imageX} y="354" textAnchor="middle" className="bp-label">SENSOR</text>

      <line x1={frontX} y1="382" x2={backX} y2="382" className="bp-dimension" />
      <line x1={frontX} y1="374" x2={frontX} y2="390" className="bp-dimension" />
      <line x1={backX} y1="374" x2={backX} y2="390" className="bp-dimension" />
      <text x={(frontX + backX) / 2} y="402" textAnchor="middle" className="bp-dimension-text">
        OPTICAL TRACK / 19E · 15G
      </text>
      <text x={frontX} y="420" className="bp-foot">OBJECT SIDE / 物方</text>
      <text x={backX} y="420" textAnchor="end" className="bp-foot">IMAGE SIDE / 像方</text>
    </svg>
  )
}

const STAGE_CENTER = 235
