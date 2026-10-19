import type { KeyboardEvent } from 'react'
import { lensGroups, type GroupId } from '../data/lensGroups'
import {
  elementById,
  lensElements,
  type ElementTag,
  type LensElement,
} from '../data/lensStructure'
import { TAG_META } from '../data/tags'

export type ViewMode = 'elements' | 'groups'
export type Selection =
  | { kind: 'element'; id: string }
  | { kind: 'group'; id: GroupId }

type LensStructureProps = {
  viewMode: ViewMode
  selection: Selection
  onSelect: (selection: Selection) => void
}

const STAGE = {
  width: 980,
  height: 440,
  x0: 60,
  centerY: 235,
  axialScale: 10.4,
  radialScale: 3.15,
  airGapScale: 0.42,
  elementLabelTop: 352,
  tagLabelTop: 390,
}

type PositionedElement = LensElement & {
  groupColor: string
  startX: number
  endX: number
  centerX: number
  topY: number
  bottomY: number
  path: string
  primaryTag?: ElementTag
}

type PositionedGroup = {
  id: GroupId
  name: string
  power: '+' | '−'
  color: string
  count: number
  role: string
  boxLabel: string
  note?: string
  minX: number
  maxX: number
  centerX: number
}

type Layout = {
  elements: PositionedElement[]
  groups: PositionedGroup[]
  apertureX: number
  imageX: number
}

function sag(radius: number, height: number) {
  const r2 = radius * radius
  const y2 = height * height
  const inside = Math.max(r2 - y2, 0)
  return radius - Math.sign(radius) * Math.sqrt(inside)
}

function makeElementPath(
  startX: number,
  endX: number,
  semiHeight: number,
  r1: number,
  r2: number,
) {
  const points: string[] = []
  const steps = 24
  const centerY = STAGE.centerY

  for (let index = 0; index <= steps; index += 1) {
    const y = -semiHeight + (2 * semiHeight * index) / steps
    const x = startX + sag(r1, y) * STAGE.axialScale
    points.push(
      `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${(centerY + y * STAGE.radialScale).toFixed(2)}`,
    )
  }

  for (let index = steps; index >= 0; index -= 1) {
    const y = -semiHeight + (2 * semiHeight * index) / steps
    const x = endX + sag(r2, y) * STAGE.axialScale
    points.push(`L ${x.toFixed(2)} ${(centerY + y * STAGE.radialScale).toFixed(2)}`)
  }

  return `${points.join(' ')} Z`
}

function getLayout(): Layout {
  let cursor = 0
  const groupColor = new Map(lensGroups.map((group) => [group.id, group.color]))

  const elements: PositionedElement[] = lensElements.map((element) => {
    const startX = STAGE.x0 + cursor * STAGE.axialScale
    const endX = startX + element.thickness * STAGE.axialScale
    const primaryTag = element.tags.find((tag) => tag === 'ED' || tag === 'AS' || tag === 'ASED')
    const positioned: PositionedElement = {
      ...element,
      groupColor: groupColor.get(element.group) ?? '#94a3b8',
      startX,
      endX,
      centerX: (startX + endX) / 2,
      topY: STAGE.centerY - element.semiHeight * STAGE.radialScale,
      bottomY: STAGE.centerY + element.semiHeight * STAGE.radialScale,
      path: makeElementPath(startX, endX, element.semiHeight, element.r1, element.r2),
      primaryTag,
    }
    cursor += element.thickness + element.gapAfter * STAGE.airGapScale
    return positioned
  })

  const groups: PositionedGroup[] = lensGroups.map((group) => {
    const groupElements = elements.filter((element) => element.group === group.id)
    const first = groupElements[0]
    const last = groupElements[groupElements.length - 1]
    return {
      ...group,
      minX: first.startX,
      maxX: last.endX,
      centerX: (first.startX + last.endX) / 2,
    }
  })

  const g2 = groups.find((group) => group.id === 'G2')
  const g3 = groups.find((group) => group.id === 'G3')
  const apertureX = g2 && g3 ? g2.maxX + (g3.minX - g2.maxX) * 0.72 : 0

  return {
    elements,
    groups,
    apertureX,
    imageX: STAGE.x0 + cursor * STAGE.axialScale,
  }
}

const layout = getLayout()

function onActivate(event: KeyboardEvent<SVGGElement>, action: () => void) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    action()
  }
}

function GroupBracket({
  group,
  selected,
  onSelect,
}: {
  group: PositionedGroup
  selected: boolean
  onSelect: () => void
}) {
  const y = 116
  const tick = 8
  return (
    <g
      className={`group-hit ${selected ? 'is-selected' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={`选择 ${group.id} ${group.name}，${group.count} 片，光焦度 ${group.power}`}
      onClick={onSelect}
      onKeyDown={(event) => onActivate(event, onSelect)}
    >
      <rect
        x={group.minX - 5}
        y={84}
        width={group.maxX - group.minX + 10}
        height={46}
        fill="transparent"
      />
      <text
        x={group.centerX}
        y={96}
        textAnchor="middle"
        className="group-label"
        fill={group.color}
      >
        {group.id} {group.power}
      </text>
      <text x={group.centerX} y={110} textAnchor="middle" className="group-sub-label">
        {group.name} · {group.count} 片
      </text>
      <path
        className="group-bracket"
        d={`M ${group.minX} ${y} v ${tick} H ${group.maxX} v -${tick}`}
        fill="none"
        stroke={group.color}
        strokeWidth={selected ? 2.4 : 1.2}
        strokeOpacity={selected ? 0.95 : 0.45}
      />
    </g>
  )
}

function ElementView({
  selection,
  onSelect,
}: {
  selection: Selection
  onSelect: (selection: Selection) => void
}) {
  const selectedElementId = selection.kind === 'element' ? selection.id : undefined
  const selectedGroupId =
    selection.kind === 'group' ? selection.id : elementById[selection.id].group

  return (
    <g>
      {layout.groups.map((group) => (
        <GroupBracket
          key={group.id}
          group={group}
          selected={selectedGroupId === group.id}
          onSelect={() => onSelect({ kind: 'group', id: group.id })}
        />
      ))}

      {layout.elements.map((element, index) => {
        const selected = selectedElementId === element.id
        const inSelectedGroup = selectedGroupId === element.group
        const tag = element.primaryTag ? TAG_META[element.primaryTag] : undefined
        const stroke = tag?.color ?? element.groupColor
        const labelY = STAGE.elementLabelTop + (index % 2) * 13

        return (
          <g
            key={element.id}
            className={`element-hit ${selected ? 'is-selected' : ''} ${
              inSelectedGroup ? 'is-group-selected' : ''
            }`}
            role="button"
            tabIndex={0}
            aria-label={`选择 ${element.id}，${element.group} 组，${element.shape}，${element.tags
              .map((item) => TAG_META[item].label)
              .join('、') || '普通镜片'}`}
            data-testid={`element-${element.id}`}
            onClick={() => onSelect({ kind: 'element', id: element.id })}
            onKeyDown={(event) =>
              onActivate(event, () => onSelect({ kind: 'element', id: element.id }))
            }
          >
            <path
              className="element-shape"
              d={element.path}
              fill={element.groupColor}
              fillOpacity={selected ? 0.4 : inSelectedGroup ? 0.22 : 0.14}
              stroke={stroke}
              strokeWidth={selected ? 2.6 : tag ? 1.8 : 1.1}
              strokeOpacity={selected ? 1 : 0.85}
            />
            <path
              className="element-hit-area"
              d={element.path}
              fill="transparent"
              stroke="transparent"
              strokeWidth={10}
            />
            <text x={element.centerX} y={labelY} textAnchor="middle" className="element-label">
              {element.id}
            </text>
            {tag ? (
              <text
                x={element.centerX}
                y={STAGE.tagLabelTop}
                textAnchor="middle"
                className="element-tag"
                fill={tag.color}
              >
                {tag.label}
              </text>
            ) : null}
          </g>
        )
      })}

      <ApertureAndPlane />
    </g>
  )
}

function GroupView({
  selection,
  onSelect,
}: {
  selection: Selection
  onSelect: (selection: Selection) => void
}) {
  const selectedGroupId =
    selection.kind === 'group' ? selection.id : elementById[selection.id].group

  return (
    <g>
      {layout.groups.map((group) => {
        const selected = selectedGroupId === group.id
        const width = group.maxX - group.minX
        const count = group.count
        const dotGap = width / (count + 1)

        return (
          <g
            key={group.id}
            className={`group-box-hit ${selected ? 'is-selected' : ''}`}
            role="button"
            tabIndex={0}
            aria-label={`选择 ${group.id} ${group.name}，${count} 片，${group.role}`}
            data-testid={`group-${group.id}`}
            onClick={() => onSelect({ kind: 'group', id: group.id })}
            onKeyDown={(event) =>
              onActivate(event, () => onSelect({ kind: 'group', id: group.id }))
            }
          >
            <rect
              x={group.minX}
              y={160}
              width={Math.max(width, 42)}
              height={150}
              rx={18}
              fill={group.color}
              fillOpacity={selected ? 0.2 : 0.1}
              stroke={group.color}
              strokeWidth={selected ? 2.6 : 1.2}
              strokeOpacity={selected ? 1 : 0.58}
            />
            <text x={group.centerX} y={190} textAnchor="middle" className="group-box-id">
              {group.id} {group.power}
            </text>
            <text x={group.centerX} y={213} textAnchor="middle" className="group-box-name">
              {group.name}
            </text>
            <text x={group.centerX} y={236} textAnchor="middle" className="group-box-count">
              {count} 片
            </text>
            {Array.from({ length: count }, (_, index) => (
              <circle
                key={`${group.id}-dot-${index}`}
                cx={group.minX + dotGap * (index + 1)}
                cy={268}
                r={4.5}
                fill={group.color}
                fillOpacity={0.8}
              />
            ))}
            <text x={group.centerX} y={294} textAnchor="middle" className="group-box-note">
              {group.note ?? group.boxLabel}
            </text>
          </g>
        )
      })}

      <ApertureAndPlane />
    </g>
  )
}

function ApertureAndPlane() {
  return (
    <g>
      <line
        x1={layout.apertureX}
        y1={148}
        x2={layout.apertureX}
        y2={326}
        stroke="#cbd5e1"
        strokeOpacity={0.45}
        strokeWidth={1.4}
      />
      <circle
        cx={layout.apertureX}
        cy={STAGE.centerY}
        r={17}
        fill="#08111f"
        stroke="#cbd5e1"
        strokeOpacity={0.65}
        strokeWidth={1.4}
      />
      {Array.from({ length: 7 }, (_, index) => {
        const angle = (Math.PI * 2 * index) / 7
        return (
          <line
            key={`blade-${index}`}
            x1={layout.apertureX}
            y1={STAGE.centerY}
            x2={layout.apertureX + Math.cos(angle) * 14}
            y2={STAGE.centerY + Math.sin(angle) * 14}
            stroke="#cbd5e1"
            strokeOpacity={0.45}
            strokeWidth={1}
          />
        )
      })}
      <text x={layout.apertureX} y={138} textAnchor="middle" className="plane-label">
        S
      </text>

      <line
        x1={layout.imageX}
        y1={126}
        x2={layout.imageX}
        y2={342}
        stroke="#e2e8f0"
        strokeWidth={2.4}
      />
      <rect
        x={layout.imageX - 4}
        y={158}
        width={8}
        height={154}
        rx={3}
        fill="#e2e8f0"
        fillOpacity={0.2}
      />
      <text x={layout.imageX} y={112} textAnchor="middle" className="plane-label">
        像面
      </text>
      <text x={layout.imageX} y={365} textAnchor="middle" className="plane-sub-label">
        传感器
      </text>
    </g>
  )
}

function StructureLegend({
  selection,
  onSelect,
  viewMode,
}: {
  selection: Selection
  onSelect: (selection: Selection) => void
  viewMode: ViewMode
}) {
  const selectedGroupId =
    selection.kind === 'group' ? selection.id : elementById[selection.id].group

  return (
    <div className="structure-legend" aria-label="六组快速索引与图例">
      <div className="group-chip-row">
        {lensGroups.map((group) => (
          <button
            key={group.id}
            type="button"
            className={`group-chip ${selectedGroupId === group.id ? 'is-active' : ''}`}
            aria-pressed={selectedGroupId === group.id}
            onClick={() => onSelect({ kind: 'group', id: group.id })}
          >
            <i style={{ background: group.color }} aria-hidden="true" />
            {group.id} {group.name}
            <span>{group.count} 片</span>
          </button>
        ))}
      </div>

      <div className="tag-chip-row">
        <span className="legend-caption">特殊镜片</span>
        {(['ED', 'AS', 'ASED', 'VR', 'FOCUS'] as ElementTag[]).map((tag) => (
          <span key={tag} className="tag-chip">
            <i style={{ background: TAG_META[tag].color }} aria-hidden="true" />
            {TAG_META[tag].label}
          </span>
        ))}
        <span className="legend-note">
          {viewMode === 'elements' ? '点击镜片或组查看说明' : '点击组块查看说明'}
        </span>
      </div>
    </div>
  )
}

export function LensStructure({ viewMode, selection, onSelect }: LensStructureProps) {
  return (
    <div className="structure-wrap" data-testid="lens-structure">
      <div className="stage-scroll">
        <svg
          className="structure-svg"
          viewBox={`0 0 ${STAGE.width} ${STAGE.height}`}
          role="group"
          aria-label="19 片 15 组镜头结构示意"
        >
          <defs>
            <pattern id="structure-grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path
                d="M 28 0 L 0 0 0 28"
                fill="none"
                stroke="rgba(148, 197, 255, 0.1)"
                strokeWidth="1"
              />
            </pattern>
            <filter id="structure-glow" x="-20%" y="-40%" width="140%" height="180%">
              <feGaussianBlur stdDeviation="2.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width={STAGE.width} height={STAGE.height} fill="#08111f" />
          <rect width={STAGE.width} height={STAGE.height} fill="url(#structure-grid)" />

          <text x="34" y="42" className="stage-kicker">
            PATENT EXAMPLE 8 / 19 ELEMENTS
          </text>
          <text x="34" y="64" className="stage-subkicker">
            19 片 · 15 组 · 六组功能分区 · 示意口径
          </text>

          <line
            x1="34"
            y1={STAGE.centerY}
            x2={layout.imageX + 24}
            y2={STAGE.centerY}
            stroke="rgba(148, 197, 255, 0.3)"
            strokeDasharray="4 10"
          />

          {viewMode === 'elements' ? (
            <ElementView selection={selection} onSelect={onSelect} />
          ) : (
            <GroupView selection={selection} onSelect={onSelect} />
          )}

          <text x="34" y="420" className="stage-annotation-text">
            轴向间距压缩 · 径向比例放大 · 形状按专利半径示意
          </text>
        </svg>
        <p className="stage-scroll-hint">左右滑动查看完整结构</p>
      </div>

      <StructureLegend selection={selection} onSelect={onSelect} viewMode={viewMode} />
    </div>
  )
}
