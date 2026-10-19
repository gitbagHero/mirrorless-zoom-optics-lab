type TargetSceneProps = {
  blurPx: number
  targetDistance: number
}

export function TargetScene({ blurPx, targetDistance }: TargetSceneProps) {
  return (
    <div className="target-scene-wrap">
      <div
        className="target-scene"
        data-testid="target-scene"
        style={{ filter: `blur(${blurPx.toFixed(2)}px)` }}
      >
        <svg viewBox="0 0 420 250" role="img" aria-label="合成对焦目标图">
          <defs>
            <linearGradient id="target-sky" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#0b1b33" />
              <stop offset="1" stopColor="#123453" />
            </linearGradient>
            <linearGradient id="target-hill" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#0f766e" />
              <stop offset="1" stopColor="#134e4a" />
            </linearGradient>
            <radialGradient id="target-sun" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#fde68a" />
              <stop offset="0.65" stopColor="#f59e0b" />
              <stop offset="1" stopColor="#b45309" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="420" height="250" fill="url(#target-sky)" />
          <circle cx="330" cy="58" r="34" fill="url(#target-sun)" />
          <path d="M0 178 L82 104 L148 178 Z" fill="#1d4ed8" opacity="0.55" />
          <path d="M78 178 L168 82 L258 178 Z" fill="url(#target-hill)" />
          <path d="M204 178 L302 116 L420 178 Z" fill="#0e7490" opacity="0.65" />
          <rect y="178" width="420" height="72" fill="#071426" />

          <g stroke="#dbeafe" strokeOpacity="0.35" strokeWidth="1">
            <line x1="28" y1="28" x2="28" y2="222" />
            <line x1="392" y1="28" x2="392" y2="222" />
            <line x1="28" y1="28" x2="392" y2="28" />
            <line x1="28" y1="222" x2="392" y2="222" />
          </g>

          <g>
            <rect x="44" y="44" width="76" height="44" rx="7" fill="#f8fafc" />
            <rect x="50" y="50" width="14" height="14" fill="#172033" />
            <rect x="70" y="50" width="14" height="14" fill="#172033" />
            <rect x="90" y="50" width="14" height="14" fill="#172033" />
            <rect x="50" y="70" width="14" height="10" fill="#172033" />
            <rect x="70" y="70" width="14" height="10" fill="#172033" />
            <rect x="90" y="70" width="14" height="10" fill="#172033" />
          </g>

          <g transform="translate(210 112)">
            <circle cx="0" cy="0" r="34" fill="#f8fafc" fillOpacity="0.94" />
            <circle cx="0" cy="0" r="24" fill="#0b1220" />
            <circle cx="0" cy="0" r="12" fill="#5eead4" />
            <path d="M-16 -7 L0 8 L16 -7" fill="none" stroke="#08111f" strokeWidth="4" />
          </g>

          <text
            x="210"
            y="178"
            textAnchor="middle"
            fill="#f8fafc"
            fontFamily="SFMono-Regular, Menlo, monospace"
            fontSize="16"
            fontWeight="800"
            letterSpacing="2"
          >
            MZOL / 24-200
          </text>
          <text x="210" y="198" textAnchor="middle" fill="#93c5fd" fontSize="9">
            synthetic focus target · {targetDistance.toFixed(2)} m
          </text>

          <g fill="#f8fafc" fillOpacity="0.8">
            <rect x="44" y="196" width="4" height="20" />
            <rect x="52" y="200" width="4" height="16" />
            <rect x="60" y="192" width="4" height="24" />
            <rect x="68" y="204" width="4" height="12" />
            <rect x="76" y="198" width="4" height="18" />
          </g>
        </svg>
      </div>
      <span className="target-scene-caption">合成目标图 · 非真实照片</span>
    </div>
  )
}
