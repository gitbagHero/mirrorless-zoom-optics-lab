export const STAGE_GEOMETRY = {
  width: 980,
  height: 440,
  x0: 50,
  centerY: 235,
  axialScale: 7.5,
  radialScale: 3.15,
  stopGap: 1.5,
  elementLabelTop: 352,
  tagLabelTop: 390,
} as const

export function toStageX(z: number) {
  return STAGE_GEOMETRY.x0 + z * STAGE_GEOMETRY.axialScale
}

export function toStageY(y: number) {
  return STAGE_GEOMETRY.centerY + y * STAGE_GEOMETRY.radialScale
}
