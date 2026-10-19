import type { FocusController } from '../hooks/useFocusController'

type FocusGroupViewerProps = {
  controller: FocusController
  focal: number
}

export function FocusGroupViewer({ controller, focal }: FocusGroupViewerProps) {
  const { position, idealPosition, currentOffset, idealOffset, travel, status, afState, mode } =
    controller
  const g5X = 172 + position * 176
  const idealX = 172 + idealPosition * 176
  const progress = Math.round(position * 100)

  return (
    <div className="focus-group-viewer" data-testid="focus-group-viewer" data-position={position.toFixed(3)}>
      <svg
        viewBox="0 0 640 360"
        role="img"
        aria-label={`G5 对焦组当前位置 ${progress}%，相对位移 ${currentOffset.toFixed(2)} 毫米，目标距离 ${controller.targetDistance.toFixed(2)} 米`}
      >
        <defs>
          <linearGradient id="g5-lens" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#34d399" stopOpacity="0.12" />
            <stop offset="0.5" stopColor="#34d399" stopOpacity="0.4" />
            <stop offset="1" stopColor="#34d399" stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id="focus-rail" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#94a3b8" stopOpacity="0.2" />
            <stop offset="1" stopColor="#34d399" stopOpacity="0.8" />
          </linearGradient>
          <filter id="g5-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <text x="30" y="34" className="focus-viewer-kicker">
          G5 FOCUS GROUP / L51 + L52
        </text>
        <text x="30" y="54" className="focus-viewer-title">
          对焦组位移 · {focal} mm
        </text>
        <text x="610" y="40" textAnchor="end" className="focus-viewer-mode">
          {mode} · {afState}
        </text>

        <line x1="40" y1="180" x2="610" y2="180" className="focus-viewer-axis" />

        <g className="focus-fixed-group focus-fixed-g4">
          <rect x="66" y="102" width="58" height="156" rx="12" />
          <text x="95" y="158" textAnchor="middle">G4</text>
          <text x="95" y="178" textAnchor="middle" className="focus-fixed-sub">固定参考</text>
        </g>

        <g className="focus-fixed-group focus-fixed-g6">
          <rect x="468" y="102" width="58" height="156" rx="12" />
          <text x="497" y="158" textAnchor="middle">G6</text>
          <text x="497" y="178" textAnchor="middle" className="focus-fixed-sub">固定参考</text>
        </g>

        <line x1="590" y1="76" x2="590" y2="300" className="focus-image-plane" />
        <text x="590" y="66" textAnchor="middle" className="focus-viewer-label">像面</text>

        <line x1="172" y1="80" x2="172" y2="288" className="focus-zero-line" />
        <text x="172" y="72" textAnchor="middle" className="focus-viewer-label">∞</text>
        <text x="348" y="72" textAnchor="middle" className="focus-viewer-label">近</text>

        <line x1={idealX} y1="92" x2={idealX} y2="264" className="focus-ideal-line" />
        <text x={idealX} y="84" textAnchor="middle" className="focus-ideal-label">目标</text>

        <g transform={`translate(${g5X} 0)`} className="focus-g5-group" filter="url(#g5-glow)">
          <rect x="-38" y="94" width="76" height="172" rx="12" className="focus-g5-bracket" />
          <path
            d="M -28 108 C -4 138 -4 202 -28 232 C -12 202 -12 138 -28 108 Z"
            className="focus-g5-lens"
          />
          <path
            d="M -2 108 C -18 138 -18 202 -2 232 C 18 202 18 138 -2 108 Z"
            className="focus-g5-lens focus-g5-lens-second"
          />
          <line x1="-28" y1="180" x2="18" y2="180" className="focus-g5-axis" />
          <text x="0" y="286" textAnchor="middle" className="focus-g5-label">G5 · L51 + L52</text>
        </g>

        <g className="focus-travel-rail">
          <line x1="172" y1="312" x2="348" y2="312" />
          <line x1="172" y1="306" x2="172" y2="318" />
          <line x1="348" y1="306" x2="348" y2="318" />
          <line x1="172" y1="312" x2={g5X} y2="312" className="focus-travel-fill" />
          <circle cx={g5X} cy="312" r="5" className="focus-travel-knob" />
          <text x="172" y="334" textAnchor="middle" className="focus-travel-label">∞</text>
          <text x="348" y="334" textAnchor="middle" className="focus-travel-label">近</text>
          <text x="260" y="334" textAnchor="middle" className="focus-travel-readout">
            {progress}% · {currentOffset.toFixed(2)} mm
          </text>
        </g>

        <text x="30" y="352" className="focus-viewer-foot">
          行程 {travel.toFixed(2)} mm · 目标位置 {idealOffset.toFixed(2)} mm · {status}
        </text>
        <text x="610" y="352" textAnchor="end" className="focus-viewer-foot">
          向像方 →
        </text>
      </svg>
    </div>
  )
}
