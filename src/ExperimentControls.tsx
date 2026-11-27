import { ZOOM_ANCHORS } from "./optics/prescription";
import { ZOOM_MAXIMUM, ZOOM_MINIMUM } from "./optics/zoom";

interface ExperimentControlsProps {
  zoom: number;
  focalLength: number;
  onZoom: (value: number) => void;
  offAxis: boolean;
  fieldAngle: number;
  onFieldChange: (value: boolean) => void;
  apertureStops: number;
  fNumber: number;
  onApertureChange: (value: number) => void;
}

const sliderMax = 1000;
const zoomSpan = ZOOM_MAXIMUM - ZOOM_MINIMUM;
const anchorLabels = ["广角", "中焦 I", "中焦 II", "长焦"];
const sliderPosition = (focalLength: number) => Math.round((focalLength - ZOOM_MINIMUM) / zoomSpan * sliderMax);

export function ExperimentControls({
  zoom, focalLength, onZoom, offAxis, fieldAngle, onFieldChange, apertureStops, fNumber, onApertureChange,
}: ExperimentControlsProps) {
  return (
    <section className="experiment-controls panel" aria-label="实验控制">
      <div className="zoom-controls">
        <div className="control-heading">
          <label htmlFor="zoom-slider">变焦</label>
          <output htmlFor="zoom-slider" className="control-reading">{focalLength.toFixed(2)} mm</output>
        </div>
        <input
          type="range"
          id="zoom-slider"
          min={0}
          max={sliderMax}
          value={sliderPosition(zoom)}
          aria-valuetext={`${focalLength.toFixed(2)} 毫米`}
          onChange={(event) => {
            const position = event.currentTarget.valueAsNumber;
            const anchor = ZOOM_ANCHORS.find((item) => sliderPosition(item.focalLength) === position);
            onZoom(anchor?.focalLength ?? ZOOM_MINIMUM + position / sliderMax * zoomSpan);
          }}
        />
        <div className="zoom-anchors" role="group" aria-label="专利变焦档位">
          {ZOOM_ANCHORS.map((anchor, index) => (
            <button
              key={anchor.id}
              type="button"
              className="control-button"
              title={`${anchorLabels[index]} · 处方 ${anchor.focalLength.toFixed(2)} mm`}
              aria-pressed={zoom === anchor.focalLength}
              onClick={() => onZoom(anchor.focalLength)}
            >
              {Number(anchor.focalLength.toFixed(2))} mm
            </button>
          ))}
        </div>
      </div>
      <div className="aperture-controls">
        <div className="control-heading">
          <label htmlFor="aperture-slider">光圈</label>
          <output htmlFor="aperture-slider" className="control-reading">f/{fNumber.toFixed(2)}</output>
        </div>
        <input
          type="range"
          id="aperture-slider"
          min={0}
          max={4}
          step={0.25}
          value={apertureStops}
          aria-valuetext={`f/${fNumber.toFixed(2)}，收小 ${apertureStops} 档`}
          onChange={(event) => onApertureChange(event.currentTarget.valueAsNumber)}
        />
        <div className="scale-labels"><span>全开</span><span>收小 4 档</span></div>
      </div>
      <div className="field-controls">
        <div className="control-heading">
          <span id="field-heading">入射光束</span>
          <span className="control-reading">{(offAxis ? fieldAngle : 0).toFixed(1)}°</span>
        </div>
        <div className="field-buttons" role="group" aria-labelledby="field-heading">
          <button type="button" className="control-button" aria-pressed={!offAxis} onClick={() => onFieldChange(false)}>轴上</button>
          <button type="button" className="control-button" aria-pressed={offAxis} onClick={() => onFieldChange(true)}>离轴</button>
        </div>
        <p className="scale-labels">无穷远物点 · 单色 d 线</p>
      </div>
    </section>
  );
}
