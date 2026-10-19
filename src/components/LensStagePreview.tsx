type GroupSpec = {
  id: string
  power: '+' | '−'
  name: string
  count: number
  x: number
  width: number
  color: string
}

const GROUPS: GroupSpec[] = [
  { id: 'G1', power: '+', name: '前组', count: 3, x: 70, width: 150, color: '#38bdf8' },
  { id: 'G2', power: '−', name: '变倍', count: 4, x: 240, width: 176, color: '#f59e0b' },
  { id: 'G3', power: '+', name: '补偿 / VR', count: 4, x: 500, width: 170, color: '#a78bfa' },
  { id: 'G4', power: '+', name: '中继', count: 4, x: 690, width: 170, color: '#fb7185' },
  { id: 'G5', power: '−', name: '对焦', count: 2, x: 880, width: 96, color: '#34d399' },
  { id: 'G6', power: '−', name: '后组', count: 2, x: 996, width: 84, color: '#60a5fa' },
]

function LensGlyph({ x, color }: { x: number; color: string }) {
  return (
    <g>
      <ellipse
        cx={x}
        cy={214}
        rx={7}
        ry={46}
        fill={color}
        fillOpacity={0.16}
        stroke={color}
        strokeOpacity={0.6}
      />
      <line
        x1={x}
        y1={170}
        x2={x}
        y2={258}
        stroke={color}
        strokeOpacity={0.28}
        strokeDasharray="2 4"
      />
    </g>
  )
}

export function LensStagePreview() {
  return (
    <div className="stage-scroll" data-testid="lens-stage-preview">
      <svg
        className="lens-stage-svg"
        viewBox="0 0 1120 430"
        role="img"
        aria-labelledby="stage-title stage-desc"
      >
        <title id="stage-title">六组镜头的静态结构预览</title>
        <desc id="stage-desc">
          从物体侧到像面依次为 G1 正组、G2 负组、光圈、G3 正组、G4 正组、G5
          负对焦组、G6 负后组。这是 I0 阶段的静态示意，I1 将接入 19 片专利处方结构。
        </desc>

        <defs>
          <pattern id="stage-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path
              d="M 28 0 L 0 0 0 28"
              fill="none"
              stroke="rgba(148, 197, 255, 0.12)"
              strokeWidth="1"
            />
          </pattern>
          <filter id="ray-glow" x="-20%" y="-40%" width="140%" height="180%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="stage-fade" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#08111f" stopOpacity="0" />
            <stop offset="0.08" stopColor="#08111f" stopOpacity="0.7" />
            <stop offset="0.92" stopColor="#08111f" stopOpacity="0.7" />
            <stop offset="1" stopColor="#08111f" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="1120" height="430" fill="#08111f" />
        <rect width="1120" height="430" fill="url(#stage-grid)" />
        <rect width="1120" height="430" fill="url(#stage-fade)" opacity="0.35" />

        <text x="34" y="48" className="stage-kicker">
          STATIC LAYOUT PREVIEW
        </text>
        <text x="34" y="72" className="stage-subkicker">
          物体侧 → 像面 / 六组功能分区
        </text>

        <line
          x1="34"
          y1="214"
          x2="1084"
          y2="214"
          stroke="rgba(148, 197, 255, 0.35)"
          strokeDasharray="4 10"
        />

        {GROUPS.map((group) => {
          const step = group.count > 1 ? (group.width - 34) / (group.count - 1) : 0
          const start = group.x + 17
          const glyphs = Array.from({ length: group.count }, (_, index) => (
            <LensGlyph key={`${group.id}-${index}`} x={start + index * step} color={group.color} />
          ))

          return (
            <g key={group.id}>
              <rect
                x={group.x}
                y={150}
                width={group.width}
                height={128}
                rx={18}
                fill={group.color}
                fillOpacity={0.06}
                stroke={group.color}
                strokeOpacity={0.26}
              />
              <text
                x={group.x + group.width / 2}
                y={136}
                textAnchor="middle"
                className="stage-group-label"
                fill={group.color}
              >
                {group.id} {group.power}
              </text>
              <text
                x={group.x + group.width / 2}
                y={304}
                textAnchor="middle"
                className="stage-group-name"
              >
                {group.name}
              </text>
              <text
                x={group.x + group.width / 2}
                y={324}
                textAnchor="middle"
                className="stage-group-count"
              >
                {group.count} 片
              </text>
              {glyphs}
            </g>
          )
        })}

        <g>
          <line
            x1="470"
            y1="164"
            x2="470"
            y2="264"
            stroke="rgba(226, 232, 240, 0.45)"
            strokeWidth="2"
          />
          <circle cx="470" cy="214" r="15" fill="#08111f" stroke="rgba(226, 232, 240, 0.5)" />
          <text x="470" y="140" textAnchor="middle" className="stage-group-label" fill="#e2e8f0">
            S
          </text>
          <text x="470" y="304" textAnchor="middle" className="stage-group-count">
            光圈
          </text>
        </g>

        <g filter="url(#ray-glow)">
          <path
            d="M 30 214 C 190 214, 280 214, 470 214 S 820 214, 1084 214"
            fill="none"
            stroke="#5eead4"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M 30 150 C 210 150, 300 214, 470 214 S 820 214, 1084 214"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M 30 278 C 210 278, 300 214, 470 214 S 820 214, 1084 214"
            fill="none"
            stroke="#c4b5fd"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          />
        </g>

        <line x1="1084" y1="148" x2="1084" y2="280" stroke="#e2e8f0" strokeWidth="2.5" />
        <text x="1084" y="136" textAnchor="middle" className="stage-group-label" fill="#e2e8f0">
          像面
        </text>
        <circle cx="1084" cy="214" r="4.5" fill="#5eead4" />
        <circle cx="1084" cy="214" r="10" fill="none" stroke="#5eead4" strokeOpacity="0.4" />

        <g className="stage-annotation">
          <rect x="34" y="356" width="253" height="42" rx="12" fill="rgba(148, 197, 255, 0.08)" />
          <text x="48" y="382" fill="#bae6fd">
            I0 静态示意 · I1 接入 19 片处方
          </text>
        </g>
      </svg>
      <p className="stage-scroll-hint">左右滑动查看完整光路</p>
      <div className="stage-mobile-legend" aria-label="六组快速索引">
        {GROUPS.map((group) => (
          <span key={group.id}>
            <i style={{ background: group.color }} aria-hidden="true" />
            {group.id} {group.name}
          </span>
        ))}
      </div>
    </div>
  )
}
