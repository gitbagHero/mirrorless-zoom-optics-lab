import { BlueprintLens } from './BlueprintLens'

type LandingPageProps = {
  exiting: boolean
  onEnter: () => void
}

export function LandingPage({ exiting, onEnter }: LandingPageProps) {
  return (
    <main className={`landing-page ${exiting ? 'is-exiting' : ''}`}>
      <header className="landing-topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="brand-copy">
            <strong>MZOL</strong>
            <small>Mirrorless Zoom Optics Lab</small>
          </span>
        </div>
        <span className="landing-version">v1.0.0</span>
      </header>

      <div className="landing-content">
        <p className="eyebrow landing-eyebrow">NIKKOR Z 24-200 / OPTICAL BLUEPRINT</p>
        <h1 className="landing-title">看见一支变焦镜头的内部。</h1>
        <p className="landing-subtitle">
          从 19 片镜组的设计剖面进入，观察变焦、对焦与像面关系。
        </p>

        <div className="landing-blueprint">
          <span className="blueprint-corner blueprint-corner-tl" aria-hidden="true" />
          <span className="blueprint-corner blueprint-corner-tr" aria-hidden="true" />
          <span className="blueprint-corner blueprint-corner-bl" aria-hidden="true" />
          <span className="blueprint-corner blueprint-corner-br" aria-hidden="true" />
          <BlueprintLens />
        </div>

        <div className="landing-blueprint-meta">
          <span>DRAWING 01 / OPTICAL SECTION</span>
          <span>NIKKOR Z 24-200 · 19E / 15G</span>
          <span>50 mm / PATENT EXAMPLE 8</span>
        </div>

        <button type="button" className="landing-enter" onClick={onEnter}>
          进入工作台
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <p className="landing-caption">
        非官方教学示意 · 光学结构基于公开专利与官方规格
      </p>
      {exiting ? <span className="landing-scan" aria-hidden="true" /> : null}
    </main>
  )
}
