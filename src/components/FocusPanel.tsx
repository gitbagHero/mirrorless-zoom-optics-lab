import type { FocusController, FocusMode } from '../hooks/useFocusController'
import { TargetScene } from './TargetScene'

type FocusPanelProps = {
  controller: FocusController
  focal: number
}

const MODES: Array<{ value: FocusMode; label: string }> = [
  { value: 'MF', label: '手动 MF' },
  { value: 'AF-S', label: '单次 AF-S' },
  { value: 'AF-C', label: '连续 AF-C' },
]

export function FocusPanel({ controller, focal }: FocusPanelProps) {
  const {
    mode,
    setMode,
    afState,
    position,
    targetDistance,
    rawTargetDistance,
    setTargetDistance,
    travel,
    mfd,
    currentOffset,
    idealOffset,
    blurPx,
    clarity,
    status,
    setManualPosition,
    startAfS,
    reset,
  } = controller

  const targetSliderValue = Math.max(rawTargetDistance, mfd)
  const targetPresets = [
    { label: '远景 20 m', value: 20 },
    { label: '主体 4 m', value: 4 },
    { label: `近景 ${mfd.toFixed(2)} m`, value: mfd },
  ]

  const handleMode = (next: FocusMode) => {
    if (next === 'AF-S') {
      startAfS()
      return
    }
    setMode(next)
  }

  return (
    <section className="focus-lab section-shell" id="focus" aria-labelledby="focus-title">
      <div className="section-head">
        <div>
          <p className="eyebrow">I4 / FOCUS LAB</p>
          <h2 id="focus-title">对焦实验室</h2>
        </div>
        <p className="section-note">
          G5 向像方移动完成内对焦。手动拖动对焦环，或让 AF-S / AF-C 自动寻找合焦位置。
        </p>
      </div>

      <div className="focus-grid">
        <div className="focus-controls">
          <div className="focus-block">
            <span className="focus-block-label">对焦模式</span>
            <div className="mode-row" role="group" aria-label="对焦模式">
              {MODES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={mode === item.value ? 'is-active' : ''}
                  aria-pressed={mode === item.value}
                  onClick={() => handleMode(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="focus-block">
            <span className="focus-block-label">目标距离</span>
            <div className="target-row">
              {targetPresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className={
                    Math.abs(targetDistance - preset.value) < 0.05 ? 'is-active' : ''
                  }
                  onClick={() => setTargetDistance(preset.value)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <label className="focus-slider-label">
              <span>距离</span>
              <input
                className="focus-range"
                type="range"
                aria-label="目标距离"
                min={mfd}
                max={20}
                step={0.1}
                value={targetSliderValue}
                onChange={(event) => setTargetDistance(Number(event.target.value))}
              />
              <output>{targetDistance.toFixed(2)} m</output>
            </label>
          </div>

          <div className="focus-block">
            <span className="focus-block-label">手动对焦环 / G5 位置</span>
            <label className="focus-slider-label">
              <span>MF</span>
              <input
                className="focus-range"
                type="range"
                aria-label="手动对焦"
                min={0}
                max={1}
                step={0.001}
                value={position}
                onChange={(event) => setManualPosition(Number(event.target.value))}
              />
              <output>{Math.round(position * 100)}%</output>
            </label>
            <div className="focus-travel-meta">
              <span>行程 {travel.toFixed(2)} mm</span>
              <span>G5 +{currentOffset.toFixed(2)} mm</span>
            </div>
          </div>

          <div className="focus-readouts">
            <div>
              <span>理想位置</span>
              <strong>{idealOffset.toFixed(2)} mm</strong>
            </div>
            <div>
              <span>当前误差</span>
              <strong>{Math.abs(currentOffset - idealOffset).toFixed(2)} mm</strong>
            </div>
            <div>
              <span>对焦距离</span>
              <strong>{targetDistance.toFixed(2)} m</strong>
            </div>
            <div>
              <span>焦距</span>
              <strong>{focal} mm</strong>
            </div>
          </div>

          <div className="focus-actions">
            <button type="button" className="button button-primary" onClick={startAfS}>
              AF-S 单次对焦
            </button>
            <button type="button" className="button button-secondary" onClick={reset}>
              重置
            </button>
          </div>

          <p className="focus-hint">
            对焦映射基于薄透镜近似与专利对焦行程；数值用于教学示意，不是量产镜头的实测控制曲线。
          </p>
        </div>

        <div className="focus-preview">
          <div className="preview-head">
            <div>
              <span className="focus-block-label">传感器看到的目标</span>
              <span
                className={`focus-status ${status === '合焦' ? 'is-sharp' : ''}`}
                data-testid="focus-status"
              >
                {status}
              </span>
            </div>
            <span className={`af-state af-${afState}`} data-testid="af-state">
              {mode === 'MF' ? 'MF' : mode === 'AF-C' ? 'AF-C 追焦' : 'AF-S'}
            </span>
          </div>

          <TargetScene blurPx={blurPx} targetDistance={targetDistance} />

          <div className="clarity-row">
            <div className="clarity-bar" role="progressbar" aria-label="清晰度" aria-valuenow={clarity} aria-valuemin={0} aria-valuemax={100}>
              <i style={{ width: `${clarity}%` }} />
            </div>
            <span data-testid="focus-clarity">{clarity}%</span>
          </div>
          <div className="preview-meta">
            <span>离焦模糊 {blurPx.toFixed(1)} px</span>
            <span>AF 状态 {afState}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
