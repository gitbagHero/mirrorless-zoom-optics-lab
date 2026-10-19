import { lensSpec, sources } from '../data/specs'
import { ModuleHeader } from './ModuleHeader'

const REPO_URL = 'https://github.com/gitbagHero/mirrorless-zoom-optics-lab'

export function DataNotes() {
  return (
    <section className="module data-module" aria-labelledby="data-notes-title">
      <ModuleHeader
        eyebrow="05 / DATA NOTES"
        title="数据说明与来源"
        note="模型边界、专利代理关系、官方来源与仓库地址都放在这一页。"
        titleId="data-notes-title"
      />

      <div className="notes-callout">
        <strong>模型边界</strong>
        <p>{lensSpec.disclaimer}</p>
      </div>

      <div className="data-layout">
        <div className="data-copy">
          <h2>这份页面现在是什么</h2>
          <p>
            v1.0 已完成结构、光路、变焦、对焦、六章导览与发布硬化。页面仍是基于公开专利的教学示意模型，不声称量产级复刻。
          </p>

          <h2>为什么用专利代理模型</h2>
          <p>
            官方没有公开量产镜头的完整处方。专利实施例 8 在 19 片 15 组、六组光焦度排列、G5 对焦和 G3 防抖子组上与量产镜头高度接近，适合做教学演示，但不能称为量产精确光路。起始页使用与工作台一致的镜组线框蓝图，不使用官方营销图。
          </p>

          <p className="trademark-note">
            NIKKOR 与 Nikon 是 Nikon Corporation 的商标。本项目是非官方、非商业的教学演示，不使用官方营销图，也不暗示尼康背书。
          </p>
        </div>

        <div className="data-sources">
          <h2>主要来源</h2>
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
        </div>
      </div>

      <div className="repo-block">
        <div>
          <span className="eyebrow">REPOSITORY</span>
          <h2>项目仓库</h2>
          <p>完整源码、开发计划、调研资料与发布记录都在这里。</p>
        </div>
        <a
          className="repo-link"
          data-testid="repo-link"
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
        >
          github.com/gitbagHero/mirrorless-zoom-optics-lab
        </a>
      </div>
    </section>
  )
}
