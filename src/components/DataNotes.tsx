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
                I4 阶段已接入 G5 内对焦、手动 / AF-S / AF-C、目标距离与合成目标图。对焦映射基于薄透镜近似与专利对焦行程，目标图是合成画面，不是真实照片。I5 会继续补齐分章导览与解释内容。
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
