import { lensSpec, sources } from '../data/specs'

export function DataNotes() {
  return (
    <section className="data-notes section-shell" id="data-notes" aria-labelledby="data-notes-title">
      <details className="notes-card">
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
                I0 阶段先建立页面外壳、设计系统和数据边界。主舞台是六组结构的静态示意，I1
                会把它替换为 19 片专利处方结构，I2–I4 再接入逐面折射、变焦和对焦。
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
