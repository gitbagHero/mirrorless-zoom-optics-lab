import { describeImageFocus, FOCUS_PRESETS, SUBJECT_MAX, SUBJECT_MIN } from "./optics/focus";
import type { AutofocusResult, FocusMode } from "./optics/focus";

export interface FocusPlayback {
  result: AutofocusResult;
  step: number;
}

interface FocusControlsProps {
  mode: FocusMode;
  onModeChange: (mode: FocusMode) => void;
  subjectDistance: number;
  onSubjectChange: (distance: number) => void;
  offset: number;
  limits: { min: number; max: number };
  onFocusChange: (offset: number) => void;
  imageOffset: number;
  onAutofocus: () => void;
  playback: FocusPlayback | null;
  autofocusArmed: boolean;
}

const modeLabels: Record<FocusMode, string> = { manual: "MF 手动", phase: "AF 相位", contrast: "AF 对比度" };
const steps = 240;
const distanceRatio = SUBJECT_MAX / SUBJECT_MIN;
const outcomeLabels = { locked: "已合焦", limited: "超出可对焦范围", insufficient: "通过光线不足" };
const directions = { towardImage: "向像方移动", towardObject: "向物方移动", hold: "保持位置" };

export function subjectLabel(distance: number) {
  return Number.isFinite(distance) ? `${(distance / 1000).toFixed(2)} m` : "无穷远";
}

function axisOffset(offset: number, decimalPlaces = 2) {
  if (!Number.isFinite(offset)) return "—";
  return `${(Math.abs(offset) < 0.5 * 10 ** -decimalPlaces ? 0 : offset).toFixed(decimalPlaces)} mm`;
}

export function FocusControls({
  mode, onModeChange, subjectDistance, onSubjectChange, offset, limits, onFocusChange,
  imageOffset, onAutofocus, playback, autofocusArmed,
}: FocusControlsProps) {
  const index = Number.isFinite(subjectDistance)
    ? Math.round(steps * Math.log(subjectDistance / SUBJECT_MIN) / Math.log(distanceRatio))
    : steps;
  const focusTravel = limits.max - limits.min;
  // Integer ticks let native Home and End reach both physical limits despite floating-point rounding.
  const focusTicks = Math.ceil(focusTravel * 1000);
  const focusTick = Math.round((offset - limits.min) / focusTravel * focusTicks);
  const playing = playback !== null && playback.step < playback.result.steps.length - 1;
  const reading = playback?.result.steps[playback.step];
  const doesPhase = mode === "phase";
  const shouldRefocus = autofocusArmed && playback === null;
  const status = playing ? (doesPhase ? "估计相位差，调整镜片" : "采样清晰度，搜索峰值")
    : playback ? outcomeLabels[playback.result.outcome] : shouldRefocus ? "等待重新测量" : "等待启动";

  return (
    <section className="panel focus-panel" aria-label="对焦实验">
      <div className="focus-heading">
        <h2>对焦控制</h2>
        <div className="focus-modes" role="group" aria-label="对焦模式">
          {(Object.keys(modeLabels) as FocusMode[]).map((key) => (
            <button key={key} className="control-button" type="button" aria-pressed={key === mode} onClick={() => onModeChange(key)}>
              {modeLabels[key]}
            </button>
          ))}
        </div>
      </div>
      <div className="focus-layout">
        <div className="subject-controls">
          <div className="control-heading">
            <label htmlFor="subject-slider">主体距离</label>
            <output className="control-reading" htmlFor="subject-slider">{subjectLabel(subjectDistance)}</output>
          </div>
          <input
            id="subject-slider"
            type="range"
            min={0}
            max={steps}
            value={index}
            aria-valuetext={subjectLabel(subjectDistance)}
            onChange={(event) => onSubjectChange(SUBJECT_MIN * distanceRatio ** (event.currentTarget.valueAsNumber / steps))}
          />
          <div className="subject-presets" role="group" aria-label="主体距离预设">
            {FOCUS_PRESETS.map((preset) => (
              <button key={preset.label} className="control-button" type="button"
                aria-pressed={subjectDistance === preset.distance} onClick={() => onSubjectChange(preset.distance)}>
                {preset.label}
              </button>
            ))}
          </div>
          <p className="scale-labels">从像面起量。剖面仅画出靠近镜头的光线。</p>
        </div>
        <div className="manual-controls">
          <div className="control-heading">
            <label htmlFor="focus-slider">对焦双片 E16/E17</label>
            <output className="control-reading" aria-label="对焦双片位移">{axisOffset(offset, 3)}</output>
          </div>
          <input
            id="focus-slider"
            type="range"
            min={0}
            max={focusTicks}
            step={1}
            value={focusTick}
            disabled={mode !== "manual"}
            aria-valuetext={axisOffset(offset, 3)}
            onChange={(event) => {
              const tick = event.currentTarget.valueAsNumber;
              const position = tick === focusTicks ? limits.max : limits.min + focusTravel * (tick / focusTicks);
              onFocusChange(position);
            }}
          />
          <div className="scale-labels"><span>向物方</span><span>向像方</span></div>
          <div className="focus-reading">
            <span>{describeImageFocus(imageOffset)}</span>
            <strong>{axisOffset(imageOffset)}</strong>
          </div>
          <p className="scale-labels">近轴焦点相对像面的位置。</p>
        </div>
        {mode !== "manual" && (
          <div className="autofocus-controls">
            <div className="control-heading">
              <span>{doesPhase ? "分瞳位置差" : "测试图对比度"}</span>
              <strong className="control-reading">
                {doesPhase
                  ? reading?.phaseGap == null ? "—" : `${(reading.phaseGap * 1000).toFixed(1)} µm`
                  : reading?.contrast == null ? "—" : `${(reading.contrast * 100).toFixed(1)}%`}
              </strong>
            </div>
            <div className="autofocus-status">
              <button className="control-button focus-action" type="button" onClick={onAutofocus}>
                {playing ? "重新启动 AF" : "启动自动对焦"}
              </button>
              <span role="status" aria-label="自动对焦状态">{status}</span>
            </div>
            {playback && (
              <p className="scale-labels autofocus-step">
                <span>测量 {playback.step + 1} / {playback.result.steps.length}</span>
                <span>{doesPhase ? directions[playback.result.direction] : playing ? "比较候选位置" : "停在最高评分位置"}</span>
              </p>
            )}
            <p className="scale-labels">
              {doesPhase ? "比较两侧半瞳在像面的平均落点，判断调焦方向。"
                : "用几何光斑估算线对对比度，比较不同镜组位置的评分。"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
