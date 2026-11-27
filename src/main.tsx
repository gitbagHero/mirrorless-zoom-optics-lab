import { createRoot } from "react-dom/client";
import { StrictMode, useEffect, useMemo, useRef, useState } from "react";
import { ExperimentControls, ZoomControl } from "./ExperimentControls";
import { ExperimentGuide } from "./ExperimentGuide";
import { FocusControls, subjectLabel } from "./FocusControls";
import type { FocusPlayback } from "./FocusControls";
import { LensDiagram, LensInspector } from "./LensDiagram";
import { GroupMotion, SpotPanel, TargetPanel } from "./Observations";
import { INITIAL_SHAKE, VibrationReduction } from "./VibrationReduction";
import { LENSES } from "./optics/elements";
import { clampFocusOffset, FOCUS_PRESETS, focusRange, imagePlaneOffset, moveFocusDoublet, solveAutofocus, traceFocusScene } from "./optics/focus";
import type { FocusMode } from "./optics/focus";
import { measureSpot } from "./optics/rays";
import { apertureForStops, zoomPose, ZOOM_MINIMUM } from "./optics/zoom";
import "./styles.css";

const wideSurfaces = zoomPose(ZOOM_MINIMUM).surfaces;
const sourcing = {
  product: "https://imaging.nikon.com/imaging/lineup/lens/z-mount/z_24-200mmf4-63_vr/",
  prescription: "https://patents.google.com/patent/WO2020157904A1/ja",
  autofocus: "https://onlinemanual.nikonimglib.com/z5/en/15_technical_notes_08.html",
};

const modules = {
  guide: { label: "实验引导", description: "从折射成像、变焦与对焦中选择一项实验。" },
  diagram: { label: "镜头剖面与成像", description: "逐片查看镜片，观察光圈与入射方向怎样改变像面落点。" },
  zoom: { label: "变焦与镜组", description: "移动变焦滑杆，对比各组的轴向位移与取景变化。" },
  focus: { label: "对焦实验", description: "改变主体距离，比较手动对焦、相位检测与对比度检测。" },
  vr: { label: "镜头防抖", description: "观察防抖双片横向移动时，像点怎样回到参考位置。" },
  references: { label: "模型资料", description: "查阅镜头规格、参考处方与演示模型的适用范围。" },
} as const;

type ModuleId = keyof typeof modules;

function readModule(): ModuleId {
  const id = window.location.hash.slice(1);
  return Object.hasOwn(modules, id) ? id as ModuleId : "diagram";
}

function LensMark() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.6 2.3 17 15.4m2.4-9.9H4.6M21.7 14.4 14.4 1.7M14.4 21.7 7 8.6M4.6 18.5h14.8M2.3 9.6l7.3 12.7" />
    </svg>
  );
}

function App() {
  const [activeModule, setActiveModule] = useState(readModule);
  const mainRef = useRef<HTMLElement>(null);
  const [selectedId, setSelectedId] = useState("E15");
  const [zoom, setZoom] = useState(ZOOM_MINIMUM);
  const [offAxis, setOffAxis] = useState(false);
  const [apertureStops, setApertureStops] = useState(0);
  const [subjectDistance, setSubjectDistance] = useState(Infinity);
  const [mode, setMode] = useState<FocusMode>("manual");
  const [focusOffset, setFocusOffset] = useState(0);
  const focusPosition = useRef(0);
  const [playback, setPlayback] = useState<FocusPlayback | null>(null);
  const [afRequest, setAfRequest] = useState(0);
  const [activeLesson, setActiveLesson] = useState<number | null>(null);
  const [shake, setShake] = useState(INITIAL_SHAKE);
  const [vrEnabled, setVrEnabled] = useState(false);
  const pose = useMemo(() => zoomPose(zoom), [zoom]);
  const aperture = apertureForStops(pose, apertureStops);
  const scene = useMemo(() => ({
    pose, subjectDistance, incidentDegrees: offAxis ? pose.fieldAngle : 0, apertureRadius: aperture.radius,
  }), [pose, subjectDistance, offAxis, aperture.radius]);
  const effectiveOffset = clampFocusOffset(focusOffset, pose);
  const surfaces = useMemo(() => moveFocusDoublet(pose.surfaces, effectiveOffset), [pose.surfaces, effectiveOffset]);
  const rays = useMemo(() => traceFocusScene(scene, surfaces), [scene, surfaces]);
  const spot = useMemo(() => measureSpot(rays), [rays]);
  const imageOffset = imagePlaneOffset(surfaces, subjectDistance);

  useEffect(() => {
    const onNavigate = () => {
      setActiveModule(readModule());
      window.scrollTo(0, 0);
      mainRef.current?.focus({ preventScroll: true });
    };
    window.addEventListener("hashchange", onNavigate);
    return () => window.removeEventListener("hashchange", onNavigate);
  }, []);

  useEffect(() => {
    if (mode === "manual" || afRequest === 0) return;
    let timeout = window.setTimeout(() => {
      const result = solveAutofocus(scene, mode, focusPosition.current);
      const showStep = (step: number) => {
        const next = result.steps[step].offset;
        focusPosition.current = next;
        setFocusOffset(next);
        setPlayback({ result, step });
        if (step + 1 < result.steps.length) {
          timeout = window.setTimeout(() => showStep(step + 1), mode === "phase" ? 220 : 75);
        }
      };
      showStep(0);
    }, 140);
    return () => window.clearTimeout(timeout);
  }, [afRequest, mode, scene]);

  const updateFocus = (position: number) => {
    focusPosition.current = position;
    setFocusOffset(position);
  };

  const applyLesson = (lesson: number | null) => {
    setActiveLesson(lesson);
    setZoom(ZOOM_MINIMUM);
    setApertureStops(0);
    setOffAxis(false);
    setAfRequest(0);
    setPlayback(null);
    updateFocus(0);
    const isFocusLesson = lesson === 2 || lesson === 3;
    setSubjectDistance(isFocusLesson ? FOCUS_PRESETS[0].distance : Infinity);
    setMode(lesson === 3 ? "phase" : "manual");
    setSelectedId(isFocusLesson ? "E16" : lesson === 1 ? "E01" : "E15");
    if (lesson === null) {
      setShake(INITIAL_SHAKE);
      setVrEnabled(false);
    }
  };
  const lens = LENSES.find((item) => item.id === selectedId) ?? LENSES[0];
  const module = modules[activeModule];
  const diagram = (
    <LensDiagram
      surfaces={surfaces}
      selectedId={selectedId}
      onSelect={setSelectedId}
      rays={rays}
      apertureRadius={aperture.radius}
      isOffAxis={offAxis}
      phaseSplit={mode === "phase"}
      focalLength={pose.focalLength}
      description={`${pose.anchor ? `专利档位 ${pose.anchor.id}` : "连续变焦 · 插值位置"} · ${subjectLabel(subjectDistance)}`}
      showElements={activeModule === "diagram"}
    />
  );
  const spotPanel = <SpotPanel rays={rays} spot={spot} offAxis={offAxis} />;
  const targetPanel = <TargetPanel focalLength={pose.focalLength} diagonalAngle={pose.diagonalAngle} rms={spot.rms} />;

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <a className="brand" href="#diagram">
            <span className="brand-mark"><LensMark /></span>
            <span>镜头实验室<span className="brand-english" lang="en">Mirrorless Zoom Optics Lab</span></span>
          </a>
          <nav aria-label="模块菜单">
            {Object.entries(modules).map(([id, entry]) => (
              <a key={id} href={`#${id}`} aria-current={id === activeModule ? "page" : undefined}>
                {entry.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="layout" id="main" ref={mainRef} tabIndex={-1} aria-labelledby="page-title">
        <section className="intro">
          <div>
            <p className="product-name" lang="en">NIKKOR Z 24–200mm f/4–6.3 VR</p>
            <h1 id="page-title">{module.label}</h1>
            <p className="intro-copy">{module.description}</p>
          </div>
          {activeModule === "diagram" && (
            <dl className="product-specs" aria-label="量产镜头规格">
              <div><dt>量产焦距</dt><dd>24–200 <small>mm</small></dd></div>
              <div><dt>镜片 / 光学组</dt><dd>19 / 15</dd></div>
            </dl>
          )}
        </section>

        {activeModule === "guide" && (
          <ExperimentGuide
            activeLesson={activeLesson}
            onLesson={applyLesson}
            onClose={() => setActiveLesson(null)}
            onReset={() => applyLesson(null)}
          />
        )}

        {activeModule === "diagram" && (
          <div className="module-grid">
            <div className="module-stack">
              <ExperimentControls
                offAxis={offAxis}
                fieldAngle={pose.fieldAngle}
                onFieldChange={(value) => {
                  if (value === offAxis) return;
                  setPlayback(null);
                  setOffAxis(value);
                }}
                apertureStops={apertureStops}
                fNumber={aperture.fNumber}
                onApertureChange={(value) => {
                  if (value === apertureStops) return;
                  setPlayback(null);
                  setApertureStops(value);
                }}
              />
              {diagram}
            </div>
            <div className="module-stack">
              <LensInspector lens={lens} surfaces={surfaces} onSelect={setSelectedId} />
              {spotPanel}
            </div>
          </div>
        )}

        {activeModule === "zoom" && (
          <div className="module-grid">
            <div className="module-stack">
              <ZoomControl
                zoom={zoom}
                focalLength={pose.focalLength}
                onZoom={(value) => {
                  if (value === zoom) return;
                  setPlayback(null);
                  updateFocus(clampFocusOffset(focusPosition.current, zoomPose(value)));
                  setZoom(value);
                }}
              />
              {diagram}
            </div>
            <div className="module-stack">
              <GroupMotion surfaces={pose.surfaces} wideSurfaces={wideSurfaces} selectedGroup={lens.group} onSelect={setSelectedId} />
              {targetPanel}
            </div>
          </div>
        )}

        {activeModule === "focus" && (
          <div className="module-grid module-grid--focus">
            <div className="module-stack">
              <FocusControls
                mode={mode}
                onModeChange={(value) => {
                  if (value === mode) return;
                  setPlayback(null);
                  setAfRequest(0);
                  setMode(value);
                }}
                subjectDistance={subjectDistance}
                onSubjectChange={(value) => {
                  if (value === subjectDistance) return;
                  setPlayback(null);
                  setSubjectDistance(value);
                }}
                offset={effectiveOffset}
                limits={focusRange(pose)}
                onFocusChange={(position) => {
                  setSelectedId("E16");
                  updateFocus(position);
                }}
                imageOffset={imageOffset}
                onAutofocus={() => {
                  setPlayback(null);
                  setSelectedId("E16");
                  setAfRequest((request) => request + 1);
                }}
                playback={playback}
                autofocusArmed={afRequest > 0}
              />
              {diagram}
            </div>
            <div className="module-stack">
              {spotPanel}
              {targetPanel}
            </div>
          </div>
        )}

        {activeModule === "vr" && (
          <VibrationReduction
            shake={shake}
            enabled={vrEnabled}
            onShake={setShake}
            onToggle={() => setVrEnabled((enabled) => !enabled)}
            onInspect={() => setSelectedId("E09")}
          />
        )}

        {activeModule === "references" && (
          <section className="references panel" aria-labelledby="references-heading">
            <div>
              <h2 id="references-heading">处方与模型边界</h2>
              <p>
                镜片分类参考尼康量产剖面。轴向间距、曲率与玻璃参数取自尼康专利参考实施例 12，图中镜片口径为示意估计。
                15 个光学组用于统计光学组成，图中的 G1–G5 描述专利设计里的运动分组。
                连续位置在专利档位间插值，可能出现离焦。光阑开口由处方 f 值估算，测试图使用近轴对角视角及几何光斑模拟。
                自动对焦根据当前仿真的分瞳落点或测试图评分驱动对焦双片，镜片位置及 AF 行程用于教学。
              </p>
            </div>
            <ul className="source-links">
              <li><a href={sourcing.product} target="_blank" rel="noreferrer">尼康官方镜组与规格</a></li>
              <li><a href={sourcing.prescription} target="_blank" rel="noreferrer">WO2020157904A1 · 表 12</a></li>
              <li><a href={sourcing.autofocus} target="_blank" rel="noreferrer">尼康 Z 5 · 混合 AF 规格</a></li>
            </ul>
          </section>
        )}
      </main>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
