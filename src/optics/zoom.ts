import { PATENT_SPACING, type Spacing } from './surfaces'

export type ZoomAnchor = {
  focal: number
  patentFocal: number
  label: string
  spacing: Spacing
}

const ANCHOR_50: Spacing = {
  D1: 18.2917,
  D2: 10.23739,
  D3: 4.97092,
  D4: 4.43383,
  D5: 19.43911,
  BF: 20.6428,
}

const ANCHOR_105: Spacing = {
  D1: 34.70486,
  D2: 4.55937,
  D3: 1.81398,
  D4: 5.19646,
  D5: 21.83341,
  BF: 36.83273,
}

const ANCHOR_200: Spacing = {
  D1: 54.28408,
  D2: 1.5,
  D3: 1.5,
  D4: 1.51052,
  D5: 25.83333,
  BF: 40.29998,
}

export const ZOOM_ANCHORS: ZoomAnchor[] = [
  { focal: 24, patentFocal: 24.7, label: '24 mm', spacing: PATENT_SPACING },
  { focal: 50, patentFocal: 50, label: '50 mm', spacing: ANCHOR_50 },
  { focal: 105, patentFocal: 105, label: '105 mm', spacing: ANCHOR_105 },
  { focal: 200, patentFocal: 194, label: '200 mm', spacing: ANCHOR_200 },
]

export const MIN_FOCAL = ZOOM_ANCHORS[0].focal
export const MAX_FOCAL = ZOOM_ANCHORS[ZOOM_ANCHORS.length - 1].focal

function clampFocal(focal: number) {
  return Math.min(MAX_FOCAL, Math.max(MIN_FOCAL, focal))
}

function smoothstep(t: number) {
  const clamped = Math.min(1, Math.max(0, t))
  return clamped * clamped * (3 - 2 * clamped)
}

export function spacingAtFocal(focal: number): Spacing {
  const value = clampFocal(focal)
  if (value <= MIN_FOCAL) return { ...ZOOM_ANCHORS[0].spacing }
  if (value >= MAX_FOCAL) return { ...ZOOM_ANCHORS[ZOOM_ANCHORS.length - 1].spacing }

  const index = ZOOM_ANCHORS.findIndex((anchor) => anchor.focal >= value)
  const previous = ZOOM_ANCHORS[Math.max(0, index - 1)]
  const next = ZOOM_ANCHORS[index]
  const t = smoothstep((value - previous.focal) / (next.focal - previous.focal))
  const spacing = {} as Spacing

  for (const key of Object.keys(PATENT_SPACING) as Array<keyof Spacing>) {
    spacing[key] = previous.spacing[key] + (next.spacing[key] - previous.spacing[key]) * t
  }

  return spacing
}

export function patentFocalAt(focal: number) {
  const value = clampFocal(focal)
  if (value <= MIN_FOCAL) return ZOOM_ANCHORS[0].patentFocal
  if (value >= MAX_FOCAL) return ZOOM_ANCHORS[ZOOM_ANCHORS.length - 1].patentFocal

  const index = ZOOM_ANCHORS.findIndex((anchor) => anchor.focal >= value)
  const previous = ZOOM_ANCHORS[Math.max(0, index - 1)]
  const next = ZOOM_ANCHORS[index]
  const t = (value - previous.focal) / (next.focal - previous.focal)
  return previous.patentFocal + (next.patentFocal - previous.patentFocal) * t
}
