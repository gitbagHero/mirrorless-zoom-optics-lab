import { useState, type CSSProperties, type PointerEvent } from 'react'

type LandingPageProps = {
  exiting: boolean
  onEnter: () => void
}

type Tilt = { x: number; y: number }

export function LandingPage({ exiting, onEnter }: LandingPageProps) {
  const [tilt, setTilt] = useState<Tilt>({ x: -4, y: -10 })

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: -4 - py * 4, y: -10 + px * 8 })
  }

  const resetTilt = () => setTilt({ x: -4, y: -10 })

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
        <p className="eyebrow landing-eyebrow">NIKKOR Z 24-200 / OPTICS LAB</p>
        <h1 className="landing-title">看见一支变焦镜头的内部。</h1>
        <p className="landing-subtitle">
          从真实外观进入光学剖面，观察 19 片镜片如何变焦与对焦。
        </p>

        <button
          type="button"
          className="landing-lens-button"
          aria-label="进入工作台，查看镜头剖面"
          onClick={onEnter}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetTilt}
        >
          <span className="landing-lens-shadow" aria-hidden="true" />
          <span
            className="landing-lens"
            style={
              {
                '--tilt-x': `${tilt.x}deg`,
                '--tilt-y': `${tilt.y}deg`,
              } as CSSProperties
            }
            aria-hidden="true"
          >
            <span className="landing-lens-body">
              <span className="landing-lens-front">
                <span className="landing-lens-glass" />
                <span className="landing-lens-front-text">NIKKOR Z · 67</span>
              </span>
              <span className="landing-lens-zoom" />
              <span className="landing-lens-focus" />
              <span className="landing-lens-rear">
                <span className="landing-lens-mark">24-200/4-6.3</span>
                <span className="landing-lens-switch" />
              </span>
              <span className="landing-lens-mount" />
            </span>
            <span className="landing-lens-highlight" />
          </span>
        </button>

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
