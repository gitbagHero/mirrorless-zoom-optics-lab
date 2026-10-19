import { groupById, lensGroups, type GroupId } from '../data/lensGroups'
import { elementById } from '../data/lensStructure'
import { TAG_META } from '../data/tags'
import type { Selection, ViewMode } from './LensStructure'

type LensInspectorProps = {
  viewMode: ViewMode
  selection: Selection
  onViewModeChange: (mode: ViewMode) => void
  onSelect: (selection: Selection) => void
}

function TagPill({ tag }: { tag: keyof typeof TAG_META }) {
  const meta = TAG_META[tag]
  return (
    <span className="tag-pill" style={{ borderColor: meta.color, color: meta.color }}>
      <i style={{ background: meta.color }} aria-hidden="true" />
      {meta.label}
    </span>
  )
}

export function LensInspector({
  viewMode,
  selection,
  onViewModeChange,
  onSelect,
}: LensInspectorProps) {
  const selectedElement = selection.kind === 'element' ? elementById[selection.id] : undefined
  const selectedGroupId =
    selection.kind === 'group' ? selection.id : elementById[selection.id].group
  const selectedGroup = groupById[selectedGroupId]

  return (
    <aside className="control-rail inspector-rail" aria-label="结构选择器">
      <div className="inspector-head">
        <div>
          <p className="eyebrow">STRUCTURE / I5</p>
          <h3>19 片结构</h3>
        </div>
        <span className="status-dot">I5</span>
      </div>

      <div className="segmented" role="group" aria-label="结构视图">
        <button
          type="button"
          className={viewMode === 'elements' ? 'is-active' : ''}
          aria-pressed={viewMode === 'elements'}
          onClick={() => onViewModeChange('elements')}
        >
          19 片结构
        </button>
        <button
          type="button"
          className={viewMode === 'groups' ? 'is-active' : ''}
          aria-pressed={viewMode === 'groups'}
          onClick={() => onViewModeChange('groups')}
        >
          6 组功能
        </button>
      </div>

      <div className="inspector-selection" data-testid="inspector-selection">
        {selectedElement ? (
          <>
            <div className="selection-topline">
              <span className="selection-id">{selectedElement.id}</span>
              <span
                className="group-badge"
                style={{
                  borderColor: selectedGroup.color,
                  color: selectedGroup.color,
                }}
              >
                {selectedGroup.id} {selectedGroup.name}
              </span>
            </div>
            <p className="selection-shape">
              {selectedElement.shape} · nd {selectedElement.nd.toFixed(5)} · νd{' '}
              {selectedElement.vd.toFixed(2)}
            </p>
            <div className="selection-tags">
              {selectedElement.tags.length > 0 ? (
                selectedElement.tags.map((tag) => <TagPill key={tag} tag={tag} />)
              ) : (
                <span className="muted-label">普通光学玻璃</span>
              )}
            </div>
            <p className="selection-role">{selectedElement.role}</p>
            <button
              type="button"
              className="text-button"
              onClick={() => onSelect({ kind: 'group', id: selectedElement.group })}
            >
              查看所属组 {selectedGroup.id} →
            </button>
          </>
        ) : (
          <>
            <div className="selection-topline">
              <span className="selection-id">{selectedGroup.id}</span>
              <span className="power-badge">光焦度 {selectedGroup.power}</span>
            </div>
            <p className="selection-shape">
              {selectedGroup.name} · {selectedGroup.count} 片 · {selectedGroup.role}
            </p>
            {selectedGroup.note ? (
              <p className="selection-note">{selectedGroup.note}</p>
            ) : null}
            <div className="element-chip-row">
              {selectedGroup.elementIds.map((elementId) => {
                const element = elementById[elementId]
                return (
                  <button
                    key={element.id}
                    type="button"
                    className="element-chip"
                    onClick={() => onSelect({ kind: 'element', id: element.id })}
                  >
                    {element.id}
                    {element.tags.length > 0 ? (
                      <span>{element.tags.map((tag) => TAG_META[tag].short).join('')}</span>
                    ) : null}
                  </button>
                )
              })}
            </div>
            <p className="selection-hint">点击任一镜片查看形状、nd/νd 和它在组里的作用。</p>
          </>
        )}
      </div>

      <div className="inspector-legend">
        <span className="muted-label">镜片标记</span>
        <div className="legend-row">
          {(Object.keys(TAG_META) as Array<keyof typeof TAG_META>).map((tag) => (
            <span key={tag} className="legend-item">
              <i style={{ background: TAG_META[tag].color }} aria-hidden="true" />
              {TAG_META[tag].label}
            </span>
          ))}
        </div>
      </div>

      <div className="group-list" aria-label="六组列表">
        {lensGroups.map((group) => (
          <button
            key={group.id}
            type="button"
            className={`group-list-item ${
              selectedGroup.id === group.id ? 'is-active' : ''
            }`}
            onClick={() => onSelect({ kind: 'group', id: group.id as GroupId })}
          >
            <span className="group-list-id" style={{ color: group.color }}>
              {group.id}
            </span>
            <span>{group.name}</span>
            <span className="group-list-count">{group.count} 片</span>
          </button>
        ))}
      </div>

      <p className="inspector-footnote">
        数据来自专利实施例 8；类型和口径为教学示意，不是量产精确结构。
      </p>
    </aside>
  )
}
