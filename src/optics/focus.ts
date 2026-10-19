import { computeEfl } from './trace'
import type { Spacing } from './surfaces'

const TRAVEL_ANCHORS = [
  { focal: 24, value: 1.31 },
  { focal: 50, value: 3.5 },
  { focal: 105, value: 5.6 },
  { focal: 200, value: 9.53 },
]

const MFD_ANCHORS = [
  { focal: 24, value: 0.5 },
  { focal: 35, value: 0.54 },
  { focal: 50, value: 0.55 },
  { focal: 70, value: 0.58 },
  { focal: 105, value: 0.65 },
  { focal: 135, value: 0.68 },
  { focal: 200, value: 0.7 },
]

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function interpolate(
  anchors: Array<{ focal: number; value: number }>,
  focal: number,
  smooth = false,
) {
  if (focal <= anchors[0].focal) return anchors[0].value
  if (focal >= anchors[anchors.length - 1].focal) return anchors[anchors.length - 1].value

  const index = anchors.findIndex((anchor) => anchor.focal >= focal)
  const previous = anchors[Math.max(0, index - 1)]
  const next = anchors[index]
  let t = (focal - previous.focal) / (next.focal - previous.focal)
  if (smooth) t = t * t * (3 - 2 * t)
  return previous.value + (next.value - previous.value) * t
}

export function focusTravelAtFocal(focal: number) {
  return interpolate(TRAVEL_ANCHORS, focal, true)
}

export function mfdAtFocal(focal: number) {
  return interpolate(MFD_ANCHORS, focal)
}

export function effectiveTargetDistance(focal: number, targetMeters: number) {
  return Math.max(targetMeters, mfdAtFocal(focal))
}

export function requiredFocusOffset(
  focal: number,
  targetMeters: number,
  spacing: Spacing,
) {
  const travel = focusTravelAtFocal(focal)
  const mfd = mfdAtFocal(focal)
  const target = effectiveTargetDistance(focal, targetMeters) * 1000
  const f = computeEfl(spacing)

  if (target <= f * 1.01) return travel

  const nearShift = (f * f) / Math.max(mfd * 1000 - f, 1)
  const imageShift = (f * f) / Math.max(target - f, 1)
  return clamp(imageShift / nearShift, 0, 1) * travel
}

export function focusStatus(focusPosition: number, idealPosition: number) {
  const error = Math.abs(focusPosition - idealPosition)
  if (error < 0.02) return '合焦'
  if (error < 0.1) return '轻微离焦'
  return '离焦'
}
