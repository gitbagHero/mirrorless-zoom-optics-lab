import { lensGroups, type GroupId } from '../data/lensGroups'
import { lensElements, type ElementTag, type LensElement } from '../data/lensStructure'
import { PATENT_SPACING, type Spacing } from './surfaces'
import { STAGE_GEOMETRY as STAGE, toStageX, toStageY } from './stageGeometry'

export type PositionedElement = LensElement & {
  groupColor: string
  startZ: number
  endZ: number
  startX: number
  endX: number
  centerX: number
  topY: number
  bottomY: number
  path: string
  primaryTag?: ElementTag
}

export type PositionedGroup = {
  id: GroupId
  name: string
  power: '+' | '−'
  color: string
  count: number
  role: string
  boxLabel: string
  note?: string
  startZ: number
  endZ: number
  minX: number
  maxX: number
  centerX: number
}

export type LensLayout = {
  elements: PositionedElement[]
  groups: PositionedGroup[]
  apertureZ: number
  apertureX: number
  imageZ: number
  imageX: number
  totalLength: number
}

function sag(radius: number, height: number) {
  const r2 = radius * radius
  const y2 = height * height
  const inside = Math.max(r2 - y2, 0)
  return radius - Math.sign(radius) * Math.sqrt(inside)
}

function makeElementPath(
  startZ: number,
  endZ: number,
  semiHeight: number,
  r1: number,
  r2: number,
  imageZ: number,
) {
  const points: string[] = []
  const steps = 24

  for (let index = 0; index <= steps; index += 1) {
    const y = -semiHeight + (2 * semiHeight * index) / steps
    const x = toStageX(startZ + sag(r1, y), imageZ)
    points.push(
      `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${toStageY(y).toFixed(2)}`,
    )
  }

  for (let index = steps; index >= 0; index -= 1) {
    const y = -semiHeight + (2 * semiHeight * index) / steps
    const x = toStageX(endZ + sag(r2, y), imageZ)
    points.push(`L ${x.toFixed(2)} ${toStageY(y).toFixed(2)}`)
  }

  return `${points.join(' ')} Z`
}

const elementById = new Map(lensElements.map((element) => [element.id, element]))
const groupColor = new Map(lensGroups.map((group) => [group.id, group.color]))

export function buildLensLayout(spacing: Spacing = PATENT_SPACING): LensLayout {
  const groupLengths = {} as Record<GroupId, number>
  const relativeStarts = new Map<string, number>()

  for (const group of lensGroups) {
    let relative = 0
    group.elementIds.forEach((elementId, index) => {
      const element = elementById.get(elementId)
      if (!element) return
      relativeStarts.set(element.id, relative)
      relative += element.thickness
      if (index < group.elementIds.length - 1) {
        relative += element.gapAfter
      }
    })
    groupLengths[group.id] = relative
  }

  const groupStarts = {} as Record<GroupId, number>
  const gaps: Record<GroupId, number> = {
    G1: 0,
    G2: spacing.D1,
    G3: spacing.D2 + STAGE.stopGap,
    G4: spacing.D3,
    G5: spacing.D4,
    G6: spacing.D5,
  }

  let previous: GroupId | null = null
  for (const group of lensGroups) {
    groupStarts[group.id] = previous
      ? groupStarts[previous] + groupLengths[previous] + gaps[group.id]
      : 0
    previous = group.id
  }

  const apertureZ = groupStarts.G2 + groupLengths.G2 + spacing.D2
  const imageZ = groupStarts.G6 + groupLengths.G6 + spacing.BF

  const elements: PositionedElement[] = lensElements.map((element) => {
    const startZ = groupStarts[element.group] + (relativeStarts.get(element.id) ?? 0)
    const endZ = startZ + element.thickness
    const startX = toStageX(startZ, imageZ)
    const endX = toStageX(endZ, imageZ)
    const primaryTag = element.tags.find(
      (tag) => tag === 'ED' || tag === 'AS' || tag === 'ASED',
    )

    return {
      ...element,
      groupColor: groupColor.get(element.group) ?? '#94a3b8',
      startZ,
      endZ,
      startX,
      endX,
      centerX: (startX + endX) / 2,
      topY: toStageY(-element.semiHeight),
      bottomY: toStageY(element.semiHeight),
      path: makeElementPath(startZ, endZ, element.semiHeight, element.r1, element.r2, imageZ),
      primaryTag,
    }
  })

  const groups: PositionedGroup[] = lensGroups.map((group) => {
    const groupElements = elements.filter((element) => element.group === group.id)
    const first = groupElements[0]
    const last = groupElements[groupElements.length - 1]
    return {
      ...group,
      startZ: groupStarts[group.id],
      endZ: groupStarts[group.id] + groupLengths[group.id],
      minX: first.startX,
      maxX: last.endX,
      centerX: (first.startX + last.endX) / 2,
    }
  })

  return {
    elements,
    groups,
    apertureZ,
    apertureX: toStageX(apertureZ, imageZ),
    imageZ,
    imageX: toStageX(imageZ, imageZ),
    totalLength: imageZ,
  }
}
