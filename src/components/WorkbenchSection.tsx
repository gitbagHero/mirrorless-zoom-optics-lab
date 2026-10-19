import type { RayMode } from '../optics/trace'
import type { Spacing } from '../optics/surfaces'
import { GroupMotionPanel } from './GroupMotionPanel'
import { LensInspector } from './LensInspector'
import { LensStructure, type Selection, type ViewMode } from './LensStructure'
import { ModuleHeader } from './ModuleHeader'

export type WorkbenchTab = 'structure' | 'motion'

type WorkbenchSectionProps = {
  focal: number
  spacing: Spacing
  focusSpacing: Spacing
  objectDistanceMm: number
  viewMode: ViewMode
  selection: Selection
  rayMode: RayMode
  showRays: boolean
  showShell: boolean
  tab: WorkbenchTab
  onTabChange: (tab: WorkbenchTab) => void
  onFocalChange: (focal: number) => void
  onViewModeChange: (mode: ViewMode) => void
  onSelect: (selection: Selection) => void
  onRayModeChange: (mode: RayMode) => void
  onShowRaysChange: (show: boolean) => void
  onShowShellChange: (show: boolean) => void
}

export function WorkbenchSection({
  focal,
  spacing,
  focusSpacing,
  objectDistanceMm,
  viewMode,
  selection,
  rayMode,
  showRays,
  showShell,
  tab,
  onTabChange,
  onFocalChange,
  onViewModeChange,
  onSelect,
  onRayModeChange,
  onShowRaysChange,
  onShowShellChange,
}: WorkbenchSectionProps) {
  return (
    <section className="module workbench-module" aria-labelledby="workbench-title">
      <ModuleHeader
        eyebrow="02 / WORKBENCH"
        title="光学工作台"
        note="镜头舞台保持常驻；右侧在“结构说明”和“变焦运动”之间切换，一次只显示一个子面板。"
        titleId="workbench-title"
      />

      <div className="workbench-grid">
        <article className="stage-card" aria-label="镜头光路静态预览">
          <div className="stage-topbar">
            <div>
              <span className="stage-title">镜头侧视 / 19 片结构</span>
              <span className="stage-subtitle">专利实施例 8 · 点击镜片或组</span>
            </div>
            <span className="stage-status">v1.0 RELEASE</span>
          </div>

          <LensStructure
            viewMode={viewMode}
            selection={selection}
            onSelect={onSelect}
            rayMode={rayMode}
            showRays={showRays}
            showShell={showShell}
            onRayModeChange={onRayModeChange}
            onShowRaysChange={onShowRaysChange}
            onShowShellChange={onShowShellChange}
            spacing={focusSpacing}
            zoomSpacing={spacing}
            objectDistanceMm={objectDistanceMm}
            focal={focal}
            onFocalChange={onFocalChange}
          />

          <div className="stage-footer">
            <span className="pulse-dot" aria-hidden="true" />
            <span>
              轴向按专利间距，形状按专利半径；EFL(∞) 随焦距变化，宽角端 24.70 / 长焦端 194.00 与专利锚点一致。对焦会移动 G5，当前焦点下的光线从目标距离追迹。外壳为示意剖切：前筒 1.0×、中筒 0.65× 同步前移，外套固定，单节筒长不变；不是量产镜筒结构。实线为有效光线，虚线为裁切或未到像面。
            </span>
          </div>
        </article>

        <div className="workbench-side">
          <div className="workbench-tabs" role="tablist" aria-label="工作台子面板">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'structure'}
              aria-controls="workbench-structure"
              className={tab === 'structure' ? 'is-active' : ''}
              onClick={() => onTabChange('structure')}
            >
              结构说明
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'motion'}
              aria-controls="workbench-motion"
              className={tab === 'motion' ? 'is-active' : ''}
              onClick={() => onTabChange('motion')}
            >
              变焦运动
            </button>
          </div>

          <div
            id={tab === 'structure' ? 'workbench-structure' : 'workbench-motion'}
            role="tabpanel"
            className="workbench-tab-panel"
          >
            {tab === 'structure' ? (
              <LensInspector
                viewMode={viewMode}
                selection={selection}
                onViewModeChange={onViewModeChange}
                onSelect={onSelect}
              />
            ) : (
              <GroupMotionPanel focal={focal} spacing={spacing} compact />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
