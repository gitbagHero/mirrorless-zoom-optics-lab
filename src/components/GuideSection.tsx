import { guideChapters, guideGlossary, guideLinks, type GuidePreset } from '../data/guide'

type GuideSectionProps = {
  onTryThis: (preset: GuidePreset) => void
}

export function GuideSection({ onTryThis }: GuideSectionProps) {
  return (
    <section className="guide section-shell" id="guide" aria-labelledby="guide-title">
      <div className="section-head">
        <div>
          <p className="eyebrow">I5 / FIELD GUIDE</p>
          <h2 id="guide-title">从操作到原理</h2>
        </div>
        <p className="section-note">
          六章短导览。每章都有一个“Try this”，会把上方工作台切到对应状态。
        </p>
      </div>

      <div className="guide-grid">
        {guideChapters.map((chapter) => (
          <article
            key={chapter.id}
            className="guide-card"
            style={{ borderTopColor: chapter.color }}
          >
            <div className="guide-card-top">
              <span className="guide-number" style={{ color: chapter.color }}>
                {chapter.number}
              </span>
              <span className="guide-kicker">{chapter.kicker}</span>
            </div>
            <h3>{chapter.title}</h3>
            <p className="guide-summary">{chapter.summary}</p>
            <ul className="guide-points">
              {chapter.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <button
              type="button"
              className="guide-try"
              data-testid={`guide-try-${chapter.id}`}
              onClick={() => onTryThis(chapter.preset)}
            >
              {chapter.tryLabel}
              <span aria-hidden="true"> →</span>
            </button>
          </article>
        ))}
      </div>

      <div className="guide-lower">
        <div className="guide-glossary">
          <div className="guide-lower-head">
            <p className="eyebrow">GLOSSARY</p>
            <h3>术语速查</h3>
          </div>
          <dl>
            {guideGlossary.map((item) => (
              <div key={item.term}>
                <dt>{item.term}</dt>
                <dd>{item.text}</dd>
              </div>
            ))}
          </dl>
        </div>

        <aside className="guide-boundary">
          <p className="eyebrow">READ THIS FIRST</p>
          <h3>这是一个示意模型</h3>
          <p>
            页面用公开专利实施例 8 做教学代理，不声称复刻量产镜头的每一片玻璃、每一条凸轮曲线或每一次实测对焦。
          </p>
          <div className="guide-links">
            <a href={guideLinks.research} target="_blank" rel="noreferrer">
              光学调研
            </a>
            <a href={guideLinks.plan} target="_blank" rel="noreferrer">
              开发计划
            </a>
            <a href="#data-notes">全部来源</a>
          </div>
        </aside>
      </div>
    </section>
  )
}
