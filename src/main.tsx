import { createRoot } from "react-dom/client";
import { StrictMode, useMemo, useState } from "react";
import { CrossSection } from "./CrossSection";
import { ExperimentControls } from "./ExperimentControls";
import { GroupMotion, SpotPanel, TargetPanel } from "./Observations";
import { GROUPS, LENSES, LENS_KINDS } from "./optics/elements";
import { ASPHERES } from "./optics/prescription";
import { measureSpot, traceInfinityBundle } from "./optics/rays";
import { apertureForStops, DIAGRAM_START, zoomPose, ZOOM_MINIMUM } from "./optics/zoom";
import "./styles.css";

const wideSurfaces = zoomPose(ZOOM_MINIMUM).surfaces;
const sourcing = {
  product: "https://imaging.nikon.com/imaging/lineup/lens/z-mount/z_24-200mmf4-63_vr/",
  prescription: "https://patents.google.com/patent/WO2020157904A1/ja",
};

function LensMark() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.6 2.3 17 15.4m2.4-9.9H4.6M21.7 14.4 14.4 1.7M14.4 21.7 7 8.6M4.6 18.5h14.8M2.3 9.6l7.3 12.7" />
    </svg>
  );
}

function App() {
  const [selectedId, setSelectedId] = useState("E15");
  const [zoom, setZoom] = useState(ZOOM_MINIMUM);
  const [offAxis, setOffAxis] = useState(false);
  const [apertureStops, setApertureStops] = useState(0);
  const pose = useMemo(() => zoomPose(zoom), [zoom]);
  const aperture = apertureForStops(pose, apertureStops);
  const rays = useMemo(() => traceInfinityBundle(
    pose.surfaces,
    offAxis ? pose.fieldAngle : 0,
    pose.entranceRadius,
    pose.entranceFactor,
    aperture.radius,
    DIAGRAM_START,
  ), [pose, offAxis, aperture.radius]);
  const spot = useMemo(() => measureSpot(rays), [rays]);
  const lens = LENSES.find((item) => item.id === selectedId) ?? LENSES[0];
  const group = GROUPS.find((item) => item.id === lens.group);
  const front = pose.surfaces[lens.front - 1];
  const back = pose.surfaces[lens.back - 1];
  const centerThickness = (back.z - front.z).toFixed(2);
  const aspheres = [lens.front, lens.back].filter((id) => ASPHERES[id]);

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <a className="brand" href="#main">
            <span className="brand-mark"><LensMark /></span>
            <span>镜头实验室<span className="brand-english" lang="en">Mirrorless Zoom Optics Lab</span></span>
          </a>
          <nav aria-label="页内导航">
            <a href="#diagram">镜头剖面</a>
            <a href="#references">模型资料</a>
          </nav>
        </div>
      </header>

      <main className="layout" id="main">
        <section className="intro" aria-labelledby="page-title">
          <div>
            <p className="product-name" lang="en">NIKKOR Z 24–200mm f/4–6.3 VR</p>
            <h1 id="page-title">变焦镜头光学实验台</h1>
            <p className="intro-copy">移动镜组、改变光圈，沿着每一面折射曲面观察光线怎样到达像面。</p>
          </div>
          <dl className="product-specs" aria-label="量产镜头规格">
            <div><dt>量产焦距</dt><dd>24–200 <small>mm</small></dd></div>
            <div><dt>镜片 / 光学组</dt><dd>19 / 15</dd></div>
          </dl>
        </section>

        <ExperimentControls
          zoom={zoom}
          focalLength={pose.focalLength}
          onZoom={setZoom}
          offAxis={offAxis}
          fieldAngle={pose.fieldAngle}
          onFieldChange={setOffAxis}
          apertureStops={apertureStops}
          fNumber={aperture.fNumber}
          onApertureChange={setApertureStops}
        />

        <div className="workspace">
          <section className="diagram-panel panel" id="diagram" aria-labelledby="diagram-heading">
            <div className="panel-heading">
              <div>
                <h2 id="diagram-heading">镜筒剖面</h2>
                <p>{pose.anchor ? `专利档位 ${pose.anchor.id}` : "连续变焦 · 插值位置"} · 无穷远</p>
              </div>
              <div className="focal-reading" aria-label="处方复算焦距">
                {pose.focalLength.toFixed(2)} <span>mm</span>
              </div>
            </div>
            <CrossSection
              surfaces={pose.surfaces}
              selectedId={selectedId}
              onSelect={setSelectedId}
              rays={rays}
              apertureRadius={aperture.radius}
              isOffAxis={offAxis}
            />
            <div className="legend" aria-label="镜片分类图例">
              {Object.entries(LENS_KINDS).map(([kind, label]) => (
                <span key={kind}><i className={`swatch glass--${kind}`} aria-hidden="true" />{label}</span>
              ))}
              <span><i className={offAxis ? "ray-swatch ray-swatch--off-axis" : "ray-swatch"} aria-hidden="true" />当前光束</span>
              <span><i className="ray-swatch ray-swatch--blocked" aria-hidden="true" />截止光线</span>
            </div>
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
                        aria-pressed={item.id === selectedId}
                        onClick={() => setSelectedId(item.id)}
                      >
                        {item.id.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

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
                    <dd><button className="text-button" onClick={() => setSelectedId(lens.cementedTo!)} type="button">{lens.cementedTo}</button></dd>
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

          <div className="observations">
            <SpotPanel rays={rays} spot={spot} offAxis={offAxis} />
            <TargetPanel focalLength={pose.focalLength} diagonalAngle={pose.diagonalAngle} rms={spot.rms} />
          </div>
          <GroupMotion surfaces={pose.surfaces} wideSurfaces={wideSurfaces} selectedGroup={lens.group} onSelect={setSelectedId} />
        </div>

        <section className="references panel" id="references" aria-labelledby="references-heading">
          <div>
            <h2 id="references-heading">模型资料</h2>
            <p>
              镜片分类参考尼康量产剖面。轴向间距、曲率与玻璃参数取自尼康专利参考实施例 12，图中镜片口径为示意估计。
              15 个光学组用于统计光学组成，图中的 G1–G5 描述专利设计里的运动分组。
              连续位置在专利档位间插值，可能出现离焦。光阑开口由处方 f 值估算，测试图使用近轴对角视角及几何光斑模拟。
            </p>
          </div>
          <ul className="source-links">
            <li><a href={sourcing.product} target="_blank" rel="noreferrer">尼康官方镜组与规格</a></li>
            <li><a href={sourcing.prescription} target="_blank" rel="noreferrer">WO2020157904A1 · 表 12</a></li>
          </ul>
        </section>
      </main>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
