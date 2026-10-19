import type { ModuleId } from '../app/modules'
import { lensSpec } from '../data/specs'
import { ModuleHeader } from './ModuleHeader'

type OverviewSectionProps = {
  onNavigate: (module: ModuleId) => void
}

export function OverviewSection({ onNavigate }: OverviewSectionProps) {
  return (
    <section className="module overview-module" aria-labelledby="overview-title">
      <ModuleHeader
        eyebrow="MIRRORLESS ZOOM OPTICS LAB / OVERVIEW"
        title="把一支 24–200mm 变焦镜头，拆成可以理解的光路。"
        note="从 19 片镜片开始，看到变焦时谁在移动、对焦时 G5 如何把像面拉回清晰。"
        titleId="overview-title"
      />

      <div className="overview-grid">
        <div className="overview-copy">
          <p className="overview-lede">
            这是一个以 NIKKOR Z 24-200mm f/4-6.3 VR 为研究案例的交互式光学教学项目。
            结构、光路、变焦、对焦与说明被拆成独立工作区，通过左侧菜单切换。
          </p>

          <div className="chip-row" aria-label="关键规格">
            <span className="chip chip-teal">19 片 / 15 组</span>
            <span className="chip chip-amber">24–200 mm</span>
            <span className="chip chip-violet">IF 内对焦</span>
            <span className="chip chip-rose">专利代理模型</span>
          </div>

          <div className="overview-actions">
            <button type="button" className="button button-primary" onClick={() => onNavigate('workbench')}>
              进入工作台
            </button>
            <button type="button" className="button button-secondary" onClick={() => onNavigate('guide')}>
              打开导览
            </button>
            <button type="button" className="button button-secondary" onClick={() => onNavigate('data')}>
              数据说明
            </button>
          </div>

          <div className="overview-facts">
            <div>
              <span>结构</span>
              <strong>19 片 / 15 组</strong>
            </div>
            <div>
              <span>变焦</span>
              <strong>六个透镜组全动</strong>
            </div>
            <div>
              <span>对焦</span>
              <strong>G5 内对焦</strong>
            </div>
          </div>
        </div>

        <aside className="spec-card" aria-label="镜头关键数据">
          <div className="spec-card-head">
            <span className="eyebrow">LENS / SPEC</span>
            <span className="status-dot">v1.0</span>
          </div>
          <p className="spec-name">{lensSpec.shortName}</p>
          <div className="spec-metrics">
            <div>
              <strong>19</strong>
              <span>片镜片</span>
            </div>
            <div>
              <strong>15</strong>
              <span>组结构</span>
            </div>
            <div>
              <strong>8.3×</strong>
              <span>变焦比</span>
            </div>
            <div>
              <strong>570g</strong>
              <span>重量</span>
            </div>
          </div>
          <dl className="spec-list">
            <div>
              <dt>卡口</dt>
              <dd>{lensSpec.mount}</dd>
            </div>
            <div>
              <dt>光圈</dt>
              <dd>{lensSpec.aperture}</dd>
            </div>
            <div>
              <dt>对焦</dt>
              <dd>{lensSpec.focus}</dd>
            </div>
            <div>
              <dt>防抖</dt>
              <dd>{lensSpec.vr}</dd>
            </div>
          </dl>
        </aside>
      </div>

      <div className="overview-boundary">
        <span className="overview-boundary-mark">!</span>
        <p>
          教学示意模型，不是尼康官方光学仿真，也不是量产镜头的精确 CAD。所有运动与合成画面都带有边界说明。
        </p>
        <button type="button" className="text-button" onClick={() => onNavigate('data')}>
          查看数据边界 →
        </button>
      </div>
    </section>
  )
}
