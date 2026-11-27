import type { ComponentProps } from "react";
import { CrossSection } from "./CrossSection";
import { GROUPS, LENSES, LENS_KINDS } from "./optics/elements";
import type { LensElement } from "./optics/elements";
import type { PositionedSurface } from "./optics/model";
import { ASPHERES } from "./optics/prescription";

type LensDiagramProps = ComponentProps<typeof CrossSection> & {
  focalLength: number;
  description: string;
  showElements: boolean;
};

export function LensDiagram({ focalLength, description, showElements, ...optics }: LensDiagramProps) {
  return (
    <section className="diagram-panel panel" aria-labelledby="diagram-heading">
      <div className="panel-heading">
        <div>
          <h2 id="diagram-heading">镜筒剖面</h2>
          <p>{description}</p>
        </div>
        <div className="focal-reading" aria-label="处方复算焦距">
          {focalLength.toFixed(2)} <span>mm</span>
        </div>
      </div>
      <CrossSection {...optics} />
      <div className="legend" aria-label="镜片分类图例">
        {Object.entries(LENS_KINDS).map(([kind, label]) => (
          <span key={kind}><i className={`swatch glass--${kind}`} aria-hidden="true" />{label}</span>
        ))}
        {optics.phaseSplit ? (
          <>
            <span><i className="ray-swatch ray-swatch--pupil-left" aria-hidden="true" />负半瞳</span>
            <span><i className="ray-swatch ray-swatch--pupil-right" aria-hidden="true" />正半瞳</span>
          </>
        ) : <span><i className={optics.isOffAxis ? "ray-swatch ray-swatch--off-axis" : "ray-swatch"} aria-hidden="true" />当前光束</span>}
        <span><i className="ray-swatch ray-swatch--blocked" aria-hidden="true" />截止光线</span>
      </div>
      {showElements && (
        <div className="element-tray" aria-label="按运动组选择镜片">
          {GROUPS.map((entry) => (
            <div className="element-group" role="group" key={entry.id} aria-label={`${entry.id} ${entry.name}`}>
              <span className="element-group-name" aria-hidden="true">{entry.id}</span>
              <div className="element-buttons">
                {LENSES.filter((item) => item.group === entry.id).map((item) => (
                  <button
                    type="button"
                    className={`element-button glass--${item.kind}`}
                    key={item.id}
                    aria-label={`选择镜片 ${item.id}`}
                    aria-pressed={item.id === optics.selectedId}
                    onClick={() => optics.onSelect(item.id)}
                  >
                    {item.id.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

interface LensInspectorProps {
  lens: LensElement;
  surfaces: readonly PositionedSurface[];
  onSelect: (id: string) => void;
}

export function LensInspector({ lens, surfaces, onSelect }: LensInspectorProps) {
  const group = GROUPS.find((item) => item.id === lens.group);
  const front = surfaces[lens.front - 1];
  const back = surfaces[lens.back - 1];
  const centerThickness = (back.z - front.z).toFixed(2);
  const aspheres = [lens.front, lens.back].filter((id) => ASPHERES[id]);

  return (
    <aside className="lens-panel panel" aria-label="选中镜片详情">
      <div className="lens-content" aria-live="polite">
        <div className="lens-heading">
          <div>
            <p className={`lens-kind glass--${lens.kind}`}>{LENS_KINDS[lens.kind]}</p>
            <h2>{lens.id}<span> {lens.shape}</span></h2>
          </div>
          <span className="group-chip">{lens.group}</span>
        </div>
        <p className="lens-description">{lens.role}</p>
        <dl className="lens-details">
          <div><dt>光学面</dt><dd>{lens.front}–{lens.back}</dd></div>
          <div><dt>中心厚度</dt><dd>{centerThickness} mm</dd></div>
          <div><dt>d 线折射率</dt><dd>{front.indexAfter.toFixed(5)}</dd></div>
          <div><dt>阿贝数</dt><dd>{front.abbeAfter?.toFixed(2) ?? "—"}</dd></div>
          {aspheres.length > 0 && <div><dt>非球面</dt><dd>{aspheres.join("、")} 号面</dd></div>}
          {lens.cementedTo && (
            <div>
              <dt>胶合镜片</dt>
              <dd><button className="text-button" onClick={() => onSelect(lens.cementedTo!)} type="button">{lens.cementedTo}</button></dd>
            </div>
          )}
          {lens.mechanism && <div><dt>结构特征</dt><dd>{lens.mechanism}</dd></div>}
        </dl>
        <div className="group-description">
          <h3>{group?.id} {group?.name}</h3>
          <p>{group?.description}</p>
        </div>
      </div>
    </aside>
  );
}
