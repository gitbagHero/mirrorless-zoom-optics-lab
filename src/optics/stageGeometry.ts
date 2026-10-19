export const STAGE_GEOMETRY = {
  width: 980,
  height: 440,
  imageX: 940,
  centerY: 235,
  axialScale: 4.72,
  radialScale: 3.15,
  stopGap: 1.5,
  elementLabelTop: 352,
  tagLabelTop: 390,
} as const

export function toStageX(z: number, imageZ: number) {
  return STAGE_GEOMETRY.imageX - (imageZ - z) * STAGE_GEOMETRY.axialScale
}

export function toStageY(y: number) {
  return STAGE_GEOMETRY.centerY + y * STAGE_GEOMETRY.radialScale
}
