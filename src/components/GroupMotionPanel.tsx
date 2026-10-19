import { lensGroups } from '../data/lensGroups'
import { buildLensLayout } from '../optics/lensLayout'
import type { Spacing } from '../optics/surfaces'

type GroupMotionPanelProps = {
  focal: number
  spacing: Spacing
  compact?: boolean
}

export function GroupMotionPanel({ focal, spacing, compact = false }: GroupMotionPanelProps) {
  const current = buildLensLayout(spacing)
  const wide = buildLensLayout({
    D1: 1.5,
    D2: 15.4968,
    D3: 10.63532,
    D4: 8.8967,
    D5: 9.31183,
    BF: 9.29998,
  })

  const rows = lensGroups.map((group) => {
    const currentGroup = current.groups.find((item) => item.id === group.id)
    const wideGroup = wide.groups.find((item) => item.id === group.id)
    const currentAbs = (currentGroup?.startZ ?? 0) - current.imageZ
    const wideAbs = (wideGroup?.startZ ?? 0) - wide.imageZ
    const movement = currentAbs - wideAbs
    return {
      ...group,
      movement,
      absolute: currentAbs,
    }
  })

  const maxMovement = Math.max(...rows.map((row) => Math.abs(row.movement)), 1)
  const isWide = focal <= 24

  return (
    <section
      className={`motion-panel ${compact ? 'is-compact' : ''}`}
      data-testid="motion-panel"
      aria-labelledby="motion-title"
    >
      <div className="motion-head">
        <div>
          <p className="eyebrow">ZOOM / GROUP MOTION</p>
          <h3 id="motion-title">变焦时谁在动</h3>
        </div>
        <div className="motion-meta">
          <span className="motion-focal">{focal} mm</span>
          <span className="motion-readout">以像面为 0 · 向物方为负</span>
        </div>
      </div>

      <div className="motion-badges">
        <span className="motion-badge">G3 + G6 + S 保持固定间距</span>
        <span className="motion-badge motion-badge-warn">D4 非单调：G4/G5 在块内相对运动</span>
      </div>

      <div className="motion-grid">
        {rows.map((row) => {
          const width = Math.min(100, (Math.abs(row.movement) / maxMovement) * 100)
          return (
            <article
              key={row.id}
              className={`motion-card ${row.id === 'G3' || row.id === 'G6' ? 'is-linked' : ''}`}
              data-testid={`motion-${row.id}`}
            >
              <div className="motion-card-top">
                <span className="motion-id" style={{ color: row.color }}>
                  {row.id}
                </span>
                <span className="motion-count">{row.count} 片</span>
              </div>
              <p className="motion-name">{row.name}</p>
              <p className="motion-value">
                {isWide ? '0.0' : `−${Math.abs(row.movement).toFixed(1)}`}
                <span>mm</span>
              </p>
              <div className="motion-bar" aria-hidden="true">
                <i style={{ width: `${isWide ? 0 : width}%`, background: row.color }} />
              </div>
              <p className="motion-direction">
                {isWide ? '广角基准' : '向物方'}
                {row.id === 'G3' || row.id === 'G6' ? ' · 同步' : ''}
              </p>
            </article>
          )
        })}
      </div>

      <p className="motion-footnote">
        数值由专利实施例 8 的组间隔反推；UI 焦距 24–200 mm 对应专利锚点 24.7 / 50 / 105 / 194 mm。
      </p>
    </section>
  )
}
