interface VibrationReductionProps {
  shake: number;
  enabled: boolean;
  onShake: (value: number) => void;
  onToggle: () => void;
  onInspect: () => void;
}

export const INITIAL_SHAKE = 1;

export function VibrationReduction({ shake, enabled, onShake, onToggle, onInspect }: VibrationReductionProps) {
  const axis = 75;
  const displacedImage = axis + shake * 12;
  const glassShift = enabled ? -shake * 6 : 0;
  const image = enabled ? axis : displacedImage;

  return (
    <section className="panel vr-panel" aria-label="镜头防抖 VR">
      <div className="vr-copy">
        <h2>机身抖动与像点补偿</h2>
        <p>机身抖动会使像点偏离原位置。G3 中的胶合双片 E09/E10 垂直于光轴移动，让像点向参考位置回移。</p>
        <div className="control-heading">
          <label htmlFor="shake-slider">机身俯仰扰动</label>
          <output className="control-reading" htmlFor="shake-slider">{shake.toFixed(1)}°</output>
        </div>
        <input
          id="shake-slider"
          type="range"
          min={-2}
          max={2}
          step={0.1}
          value={shake}
          aria-valuetext={`${shake.toFixed(1)} 度`}
          onChange={(event) => onShake(event.currentTarget.valueAsNumber)}
        />
        <div className="vr-actions">
          <button className="control-button" type="button" aria-pressed={enabled} onClick={onToggle}>
            VR 补偿
          </button>
          <a className="vr-inspect" href="#diagram" onClick={onInspect}>在主剖面查看 E09/E10</a>
        </div>
      </div>
      <figure className="vr-figure">
        <svg viewBox="0 0 385 148" role="img" aria-label="防抖双片横向移动，补偿像点偏移的示意图">
          <path d="M16 75H366" className="vr-axis" />
          <path d="M167 20V122" className="vr-travel" />
          <path d="M321 22V122 M316 22H326 M316 122H326" className="vr-sensor" />
          <text x="20" y="33">倾斜入射光</text>
          <text x="167" y="137" textAnchor="middle">E09 / E10</text>
          <text x="321" y="137" textAnchor="middle">像面</text>
          <circle cx="321" cy={axis} r="5" className="vr-reference-dot" />
          <g transform={`translate(0 ${glassShift})`}>
            <path d="M169 49 Q142 75 169 101 H176 Q159 75 176 49 Z" className="vr-glass-negative" />
            <path d="M176 49 H184 Q201 75 184 101 H176 Q159 75 176 49 Z" className="vr-glass-positive" />
          </g>
          <path d={`M20 ${axis - 16 - shake * 7} L167 ${axis - 5} L321 ${image}`} className="vr-ray" />
          <path d={`M20 ${axis + 7 - shake * 7} L167 ${axis + 6} L321 ${image}`} className="vr-ray" />
          {enabled && <circle cx="321" cy={displacedImage} r="3" className="vr-ghost-dot" />}
          <circle cx="321" cy={image} r="3.5" className="vr-image-dot" />
        </svg>
        <figcaption>
          {enabled ? "补偿已开启，像点回到参考位置。" : "补偿已关闭，像点随扰动偏移。"} 理想补偿示意。
        </figcaption>
      </figure>
    </section>
  );
}
