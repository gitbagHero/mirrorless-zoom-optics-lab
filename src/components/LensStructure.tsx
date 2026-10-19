import type { KeyboardEvent } from 'react'
import { lensGroups, type GroupId } from '../data/lensGroups'
import { elementById, type ElementTag } from '../data/lensStructure'
import { TAG_META } from '../data/tags'
import { buildLensLayout, type LensLayout, type PositionedGroup } from '../optics/lensLayout'
import { STAGE_GEOMETRY as STAGE } from '../optics/stageGeometry'
import type { Spacing } from '../optics/surfaces'
import { computeEfl, type RayMode } from '../optics/trace'
import { RayCanvas } from './RayCanvas'

export type ViewMode = 'elements' | 'groups'
export type Selection =
  | { kind: 'element'; id: string }
  | { kind: 'group'; id: GroupId }

type LensStructureProps = {
  viewMode: ViewMode
  selection: Selection
  onSelect: (selection: Selection) => void
  rayMode: RayMode
  showRays: boolean
  onRayModeChange: (mode: RayMode) => void
  onShowRaysChange: (show: boolean) => void
  spacing: Spacing
  zoomSpacing: Spacing
  objectDistanceMm: number
  focal: number
  onFocalChange: (focal: number) => void
}

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
  layout,
  selection,
  onSelect,
  showElementLabels,
}: {
  layout: LensLayout
  selection: Selection
  onSelect: (selection: Selection) => void
  showElementLabels: boolean
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
            {showElementLabels ? (
              <>
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
              </>
            ) : null}
          </g>
        )
      })}

      <ApertureAndPlane layout={layout} />
    </g>
  )
}

function GroupView({
  layout,
  selection,
  onSelect,
}: {
  layout: LensLayout
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

      <ApertureAndPlane layout={layout} />
    </g>
  )
}

function ApertureAndPlane({ layout }: { layout: LensLayout }) {
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

export function LensStructure({
  viewMode,
  selection,
  onSelect,
  rayMode,
  showRays,
  onRayModeChange,
  onShowRaysChange,
  spacing,
  zoomSpacing,
  objectDistanceMm,
  focal,
  onFocalChange,
}: LensStructureProps) {
  const layout = buildLensLayout(spacing)
  const efl = computeEfl(zoomSpacing)

  return (
    <div className="structure-wrap" data-testid="lens-structure">
      <div className="zoom-control">
        <div className="zoom-head">
          <span className="zoom-label">FOCAL LENGTH / 焦距</span>
          <output className="zoom-value" htmlFor="focal-range">
            {focal} <span>mm</span>
          </output>
        </div>
        <input
          id="focal-range"
          className="zoom-range"
          type="range"
          aria-label="焦距"
          min={24}
          max={200}
          step={1}
          value={focal}
          onChange={(event) => onFocalChange(Number(event.target.value))}
        />
        <div className="zoom-scale" aria-hidden="true">
          {[24, 35, 50, 70, 105, 135, 200].map((value) => (
            <span
              key={value}
              style={{ left: `${((value - 24) / (200 - 24)) * 100}%` }}
            >
              {value}
            </span>
          ))}
        </div>
        <span className="zoom-anchor">UI 24–200 mm · 专利锚点 24.7 / 50 / 105 / 194</span>
      </div>

      <div className="ray-toolbar">
        <span className="ray-toolbar-label">光路</span>
        <div className="ray-mode-group" role="group" aria-label="光线预设">
          {([
            ['onAxis', '轴上'],
            ['offAxis', '轴外'],
            ['fan', '光线扇'],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={rayMode === value ? 'is-active' : ''}
              aria-pressed={rayMode === value}
              onClick={() => onRayModeChange(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="ray-toggle">
          <input
            type="checkbox"
            checked={showRays}
            onChange={(event) => onShowRaysChange(event.target.checked)}
          />
          显示光线
        </label>
        <span className="ray-efl" data-testid="efl-value">
          EFL (∞) {efl.toFixed(2)} mm
        </span>
      </div>

      <div className="stage-scroll">
        <div className="structure-canvas-wrap">
          <RayCanvas
            mode={rayMode}
            showRays={showRays}
            spacing={spacing}
            objectDistanceMm={objectDistanceMm}
          />
          <svg
            className="structure-svg"
            viewBox={`0 0 ${STAGE.width} ${STAGE.height}`}
            role="group"
            aria-label="19 片 15 组镜头结构示意"
          >
            <defs>
              <filter id="structure-glow" x="-20%" y="-40%" width="140%" height="180%">
                <feGaussianBlur stdDeviation="2.4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

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
              <ElementView layout={layout} selection={selection} onSelect={onSelect} showElementLabels={focal <= 105} />
            ) : (
              <GroupView layout={layout} selection={selection} onSelect={onSelect} />
            )}

            <text x="34" y="420" className="stage-annotation-text">
              轴向按专利间距 · 径向比例放大 · 形状按专利半径示意
            </text>
          </svg>
        </div>
        <p className="stage-scroll-hint">左右滑动查看完整结构</p>
      </div>

      <StructureLegend selection={selection} onSelect={onSelect} viewMode={viewMode} />
    </div>
  )
}
