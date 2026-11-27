import { traceParaxial } from "./model";
import type { PositionedSurface } from "./model";
import { measureSpot, pupilHalf, traceSubjectBundle } from "./rays";
import type { TracedRay } from "./rays";
import { DIAGRAM_START } from "./zoom";
import type { zoomPose } from "./zoom";

export type FocusMode = "manual" | "phase" | "contrast";
type AutofocusMode = Exclude<FocusMode, "manual">;

export const SUBJECT_MIN = 250;
export const SUBJECT_MAX = 40000;
export const FOCUS_PRESETS = [
  { label: "近景", distance: 1000 },
  { label: "中景", distance: 3000 },
  { label: "远景", distance: 12000 },
  { label: "无穷远", distance: Infinity },
] as const;

export interface FocusScene {
  pose: ReturnType<typeof zoomPose>;
  subjectDistance: number;
  incidentDegrees: number;
  apertureRadius: number;
}

export interface FocusReading {
  offset: number;
  phaseGap: number | null;
  contrast: number | null;
  rms: number | null;
}

export interface AutofocusResult {
  steps: readonly FocusReading[];
  outcome: "locked" | "limited" | "insufficient";
  direction: "towardImage" | "towardObject" | "hold";
}

const firstFocusFace = 29;
const lastFocusFace = 31;
const phaseTolerance = 0.004;
const inspectionTolerance = 0.12;

export function focusRange(pose: FocusScene["pose"]) {
  return { min: -Math.max(1, 0.20 * pose.closeFocusTravel), max: pose.closeFocusTravel };
}

export function clampFocusOffset(offset: number, pose: FocusScene["pose"]) {
  const { min, max } = focusRange(pose);
  return Math.min(max, Math.max(min, offset));
}

export function moveFocusDoublet(surfaces: readonly PositionedSurface[], offset: number) {
  return surfaces.map((surface) => (
    surface.id >= firstFocusFace && surface.id <= lastFocusFace ? { ...surface, z: surface.z + offset } : surface
  ));
}

export function traceFocusScene(scene: FocusScene, surfaces: readonly PositionedSurface[]) {
  return traceSubjectBundle(
    surfaces,
    scene.incidentDegrees,
    scene.subjectDistance,
    scene.pose.entranceRadius,
    scene.pose.entranceFactor,
    scene.apertureRadius,
    DIAGRAM_START,
  );
}

export function imagePlaneOffset(surfaces: readonly PositionedSurface[], subjectDistance: number) {
  const slope = 1 / (subjectDistance + surfaces[0].z);
  const paraxial = traceParaxial(surfaces, 1, slope);
  return surfaces[surfaces.length - 1].z - paraxial.y / paraxial.u;
}

function pupilDifference(rays: readonly TracedRay[]) {
  let positive = 0;
  let negative = 0;
  let positiveCount = 0;
  let negativeCount = 0;
  for (const ray of rays) {
    if (ray.end !== "sensor") continue;
    const half = pupilHalf(ray);
    if (half === 0) continue;
    const imageHeight = ray.path[ray.path.length - 1].y;
    if (half > 0) {
      positive += imageHeight;
      positiveCount += 1;
    } else {
      negative += imageHeight;
      negativeCount += 1;
    }
  }
  return positiveCount >= 2 && negativeCount >= 2 ? positive / positiveCount - negative / negativeCount : null;
}

function chartContrast(rms: number | null, hitCount: number) {
  if (rms === null || hitCount < 5) return null;
  // Approximate how an RMS-sized Gaussian blur reduces modulation of three target line pitches.
  const frequencies = [0.5, 4, 12];
  const response = frequencies.reduce((total, frequency) => (
    total + Math.exp(-0.5 * (2 * Math.PI * frequency * rms) ** 2)
  ), 0);
  return response / frequencies.length;
}

function focusReading(rays: readonly TracedRay[], offset: number): FocusReading {
  const spot = measureSpot(rays);
  return {
    offset,
    phaseGap: pupilDifference(rays),
    contrast: chartContrast(spot.rms, spot.hits.length),
    rms: spot.rms,
  };
}

function directionBetween(start: number, end: number): AutofocusResult["direction"] {
  if (Math.abs(end - start) < 1e-5) return "hold";
  return end > start ? "towardImage" : "towardObject";
}

export function solveAutofocus(scene: FocusScene, mode: AutofocusMode, initialOffset: number): AutofocusResult {
  const { min, max } = focusRange(scene.pose);
  const read = (offset: number) => focusReading(traceFocusScene(scene, moveFocusDoublet(scene.pose.surfaces, offset)), offset);
  const initial = read(clampFocusOffset(initialOffset, scene.pose));
  const steps = [initial];

  if (mode === "phase") {
    let lower = read(min);
    let upper = read(max);
    if (initial.phaseGap === null || lower.phaseGap === null || upper.phaseGap === null) {
      return { steps, outcome: "insufficient", direction: "hold" };
    }
    let best = [initial, lower, upper].reduce((a, b) => Math.abs(a.phaseGap!) <= Math.abs(b.phaseGap!) ? a : b);
    const bracketed = lower.phaseGap * upper.phaseGap <= 0;
    if (bracketed && Math.abs(initial.phaseGap) > phaseTolerance) {
      if (lower.phaseGap * initial.phaseGap <= 0) upper = initial;
      else lower = initial;
      for (let i = 0; i < 12 && Math.abs(best.phaseGap!) > phaseTolerance; i += 1) {
        const fraction = -lower.phaseGap! / (upper.phaseGap! - lower.phaseGap!);
        const position = lower.offset + (upper.offset - lower.offset) * Math.max(0.14, Math.min(0.86, fraction));
        const candidate = read(position);
        if (candidate.phaseGap === null) break;
        steps.push(candidate);
        if (Math.abs(candidate.phaseGap) < Math.abs(best.phaseGap!)) best = candidate;
        if (lower.phaseGap! * candidate.phaseGap <= 0) upper = candidate;
        else lower = candidate;
      }
    }
    if (steps[steps.length - 1] !== best) steps.push(best);
    return {
      steps,
      outcome: Math.abs(best.phaseGap!) <= phaseTolerance ? "locked" : "limited",
      direction: directionBetween(initial.offset, best.offset),
    };
  }

  const sample = (first: number, last: number, divisions: number) => (
    Array.from({ length: divisions + 1 }, (_, index) => read(first + (last - first) * index / divisions))
  );
  const coarse = sample(min, max, 10);
  steps.push(...coarse);
  let best = coarse.reduce((a, b) => (a.contrast ?? -1) >= (b.contrast ?? -1) ? a : b, initial);
  if (best.contrast === null) return { steps: [initial], outcome: "insufficient", direction: "hold" };

  let span = (max - min) / 10;
  for (let refinement = 0; refinement < 2; refinement += 1) {
    const fine = sample(Math.max(min, best.offset - span), Math.min(max, best.offset + span), 6);
    steps.push(...fine);
    best = fine.reduce((a, b) => (a.contrast ?? -1) >= (b.contrast ?? -1) ? a : b, best);
    span /= 3;
  }
  if (steps[steps.length - 1] !== best) steps.push(best);

  const atBoundary = best.offset - min < span || max - best.offset < span;
  const residual = imagePlaneOffset(moveFocusDoublet(scene.pose.surfaces, best.offset), scene.subjectDistance);
  return {
    steps,
    outcome: atBoundary && Math.abs(residual) > inspectionTolerance ? "limited" : "locked",
    direction: directionBetween(initial.offset, best.offset),
  };
}

export function describeImageFocus(offset: number) {
  if (!Number.isFinite(offset)) return "近轴焦点不在有限位置";
  if (Math.abs(offset) < inspectionTolerance) return "接近合焦";
  return offset < 0 ? "近轴焦点在像面前" : "近轴焦点在像面后";
}
