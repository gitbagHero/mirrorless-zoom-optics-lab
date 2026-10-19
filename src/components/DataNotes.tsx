import { lensSpec, sources } from '../data/specs'

type DataNotesProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DataNotes({ open = false, onOpenChange }: DataNotesProps) {
  return (
    <section className="data-notes section-shell" id="data-notes" aria-labelledby="data-notes-title">
      <details
        className="notes-card"
        open={open}
        onToggle={(event) => onOpenChange?.(event.currentTarget.open)}
      >
        <summary>
          <span>
            <span className="eyebrow">DATA NOTES</span>
            <span className="notes-title" id="data-notes-title">
              数据说明与来源
            </span>
          </span>
          <span className="notes-summary-hint">展开 / 收起</span>
        </summary>

        <div className="notes-body">
          <div className="notes-callout">
            <strong>模型边界</strong>
            <p>{lensSpec.disclaimer}</p>
          </div>

          <div className="notes-grid">
            <div>
              <h3>这份页面现在是什么</h3>
              <p>
                v1.0 已完成六章导览、术语速查与“Try this”状态预设，覆盖结构、变焦、对焦、手动/AF、特殊镜片与模型边界。页面仍是基于公开专利的教学示意模型，不声称量产级复刻。
              </p>
            </div>
            <div>
              <h3>为什么用专利代理模型</h3>
              <p>
                官方没有公开量产镜头的完整处方。专利实施例 8 在 19 片 15
                组、六组光焦度排列、G5 对焦和 G3 防抖子组上与量产镜头高度接近，适合做教学演示，但不能称为量产精确光路。
              </p>
            </div>
          </div>

          <h3 className="sources-heading">主要来源</h3>
          <ul className="source-list">
            {sources.map((source) => (
              <li key={source.id}>
                <span className={`source-kind source-kind-${source.kind}`}>{source.kind}</span>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.label}
                </a>
                <span className="source-note">{source.note}</span>
              </li>
            ))}
          </ul>

          <p className="trademark-note">
            NIKKOR 与 Nikon 是 Nikon Corporation 的商标。本项目是非官方、非商业的教学演示，不使用官方营销图，也不暗示尼康背书。
          </p>
        </div>
      </details>
    </section>
  )
}
