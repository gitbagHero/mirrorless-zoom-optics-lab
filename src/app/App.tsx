import { useState } from 'react'
import { DataNotes } from '../components/DataNotes'
import { LensInspector } from '../components/LensInspector'
import { LensStructure, type Selection, type ViewMode } from '../components/LensStructure'
import { elementById } from '../data/lensStructure'
import { lensSpec } from '../data/specs'

const ROADMAP = [
  { id: 'I0', title: '基础与设计系统', status: 'done', note: '已完成' },
  { id: 'I1', title: '19 片结构与六组', status: 'active', note: '当前' },
  { id: 'I2', title: '光路引擎', status: 'queued', note: '下一步' },
  { id: 'I3', title: '变焦运动', status: 'queued', note: '待开始' },
  { id: 'I4', title: '对焦与合成成像', status: 'queued', note: '待开始' },
  { id: 'I5', title: '分章导览', status: 'queued', note: '待开始' },
  { id: 'I6', title: '发布硬化与 v1.0', status: 'queued', note: '待开始' },
] as const

const REPO_URL = 'https://github.com/gitbagHero/mirrorless-zoom-optics-lab'
const PLAN_URL = `${REPO_URL}/blob/dsh-dev/docs/development-plan.md`

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  )
}

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('elements')
  const [selection, setSelection] = useState<Selection>({ kind: 'group', id: 'G1' })

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    if (mode === 'groups' && selection.kind === 'element') {
      setSelection({ kind: 'group', id: elementById[selection.id].group })
    }
  }

  return (
    <div className="app">
      <a className="skip-link" href="#workbench">
        跳到工作台
      </a>

      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top" aria-label="Mirrorless Zoom Optics Lab 首页">
            <BrandMark />
            <span className="brand-copy">
              <strong>MZOL</strong>
              <small>Mirrorless Zoom Optics Lab</small>
            </span>
          </a>

          <nav className="site-nav" aria-label="主导航">
            <a href="#workbench">工作台</a>
            <a href="#principles">怎么读</a>
            <a href="#roadmap">路线</a>
            <a href="#data-notes">数据说明</a>
          </nav>

          <div className="header-meta">
            <span className="build-badge">v0.2 · I1</span>
            <a className="ghost-link" href={REPO_URL} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero section-shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">OPTICS LAB / BUILD 0.2</p>
            <h1 id="hero-title">
              <span className="hero-line">把一支 24–200mm</span>
              <span className="hero-line">变焦镜头，</span>
              <span className="hero-line">
                <span className="highlight">拆成可以理解的光路。</span>
              </span>
            </h1>
            <p className="hero-lede">
              从 19 片镜片开始，看到变焦时谁在移动、对焦时 G5 如何把像面拉回清晰。
              这是一个基于公开专利与官方规格的教学示意模型。
            </p>
            <div className="chip-row" aria-label="关键规格">
              <span className="chip chip-teal">19 片 / 15 组</span>
              <span className="chip chip-amber">24–200 mm</span>
              <span className="chip chip-violet">IF 内对焦</span>
              <span className="chip chip-rose">专利代理模型</span>
            </div>
            <div className="hero-actions">
              <a className="button button-primary" href="#workbench">
                先看工作台
              </a>
              <a className="button button-secondary" href={PLAN_URL} target="_blank" rel="noreferrer">
                查看开发计划
              </a>
            </div>
          </div>

          <aside className="spec-card" aria-label="镜头关键数据">
            <div className="spec-card-head">
              <span className="eyebrow">LENS / SPEC</span>
              <span className="status-dot">I1</span>
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
        </section>

        <section className="workbench section-shell" id="workbench" aria-labelledby="workbench-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">01 / WORKBENCH</p>
              <h2 id="workbench-title">光学工作台</h2>
            </div>
            <p className="section-note">
              I1 已接入 19 片专利处方结构与六组双视图；I2 接光路，I3/I4 接变焦与对焦。
            </p>
          </div>

          <div className="workbench-grid">
            <article className="stage-card" aria-label="镜头光路静态预览">
              <div className="stage-topbar">
                <div>
                  <span className="stage-title">镜头侧视 / 19 片结构</span>
                  <span className="stage-subtitle">专利实施例 8 · 点击镜片或组</span>
                </div>
                <span className="stage-status">I1 STRUCTURE</span>
              </div>
              <LensStructure
                viewMode={viewMode}
                selection={selection}
                onSelect={setSelection}
              />
              <div className="stage-footer">
                <span className="pulse-dot" aria-hidden="true" />
                <span>轴向间距压缩，形状按专利半径绘制；I2 接入逐面折射与实际光线。</span>
              </div>
            </article>

            <LensInspector
              viewMode={viewMode}
              selection={selection}
              onViewModeChange={handleViewModeChange}
              onSelect={setSelection}
            />
          </div>
        </section>

        <section className="principles section-shell" id="principles" aria-labelledby="principles-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">02 / HOW TO READ</p>
              <h2 id="principles-title">先看懂，再动手</h2>
            </div>
            <p className="section-note">这个项目的目标不是“像”，而是让每个运动都有光学上的理由。</p>
          </div>

          <div className="principle-grid">
            <article className="principle-card">
              <span className="principle-index">A</span>
              <h3>19 片不是堆料</h3>
              <p>
                前组收光、G2 变倍、G3/G4 补偿像差、G5 对焦、G6 平场。每一组都在解决另一组制造出来的问题。
              </p>
            </article>
            <article className="principle-card">
              <span className="principle-index">B</span>
              <h3>变焦时六组都在动</h3>
              <p>
                专利实施例 8 中，G3、G6 和光圈是一个整体块；G4/G5 在块内做相对运动，所以不能简单画成直线滑动。
              </p>
            </article>
            <article className="principle-card">
              <span className="principle-index">C</span>
              <h3>对焦只动 G5</h3>
              <p>
                G5 是两片胶合的小组，向内移动完成 IF 对焦。镜头总长不变，STM 可以快速、安静地驱动它。
              </p>
            </article>
          </div>
        </section>

        <section className="roadmap section-shell" id="roadmap" aria-labelledby="roadmap-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">03 / ROADMAP</p>
              <h2 id="roadmap-title">v1.0 开发路线</h2>
            </div>
            <p className="section-note">每个增量独立验收；通过后更新计划状态并推送 dsh-dev。</p>
          </div>

          <div className="roadmap-grid">
            {ROADMAP.map((item) => (
              <article
                key={item.id}
                className={`roadmap-card ${item.status === 'active' ? 'is-active' : ''}`}
              >
                <div className="roadmap-card-top">
                  <span className="roadmap-id">{item.id}</span>
                  <span className={`roadmap-status ${item.status}`}>{item.note}</span>
                </div>
                <h3>{item.title}</h3>
              </article>
            ))}
          </div>
        </section>

        <DataNotes />
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <strong>Mirrorless Zoom Optics Lab</strong>
            <p>非官方、非商业教学演示。基于公开专利与官方规格，不是量产镜头精确仿真。</p>
          </div>
          <div className="footer-meta">
            <span>v0.2 · I1</span>
            <a href={PLAN_URL} target="_blank" rel="noreferrer">
              开发计划
            </a>
            <a href={REPO_URL} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
