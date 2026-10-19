import { useState } from 'react'
import { guideChapters, guideGlossary, guideLinks, type GuidePreset } from '../data/guide'
import { ModuleHeader } from './ModuleHeader'

type GuideSectionProps = {
  onTryThis: (preset: GuidePreset) => void
}

type GuideView = string

const glossaryKey = 'glossary'
const boundaryKey = 'boundary'

export function GuideSection({ onTryThis }: GuideSectionProps) {
  const [activeView, setActiveView] = useState<GuideView>(guideChapters[0].id)
  const chapter = guideChapters.find((item) => item.id === activeView)

  return (
    <section className="module guide-module" aria-labelledby="guide-title">
      <ModuleHeader
        eyebrow="04 / FIELD GUIDE"
        title="从操作到原理"
        note="六章短导览，一次读一章。每章都有一个 Try this，会直接切到对应工作区。"
        titleId="guide-title"
      />

      <div className="guide-reader">
        <nav className="guide-reader-nav" aria-label="导览章节">
          {guideChapters.map((item) => (
            <button
              key={item.id}
              type="button"
              className={activeView === item.id ? 'is-active' : ''}
              aria-current={activeView === item.id ? 'page' : undefined}
              data-testid={`guide-nav-${item.id}`}
              onClick={() => setActiveView(item.id)}
            >
              <span className="guide-nav-number" style={{ color: item.color }}>
                {item.number}
              </span>
              <span>
                <strong>{item.title}</strong>
                <small>{item.kicker}</small>
              </span>
            </button>
          ))}
          <button
            type="button"
            className={activeView === glossaryKey ? 'is-active' : ''}
            aria-current={activeView === glossaryKey ? 'page' : undefined}
            data-testid="guide-nav-glossary"
            onClick={() => setActiveView(glossaryKey)}
          >
            <span className="guide-nav-number">A</span>
            <span>
              <strong>术语速查</strong>
              <small>GLOSSARY</small>
            </span>
          </button>
          <button
            type="button"
            className={activeView === boundaryKey ? 'is-active' : ''}
            aria-current={activeView === boundaryKey ? 'page' : undefined}
            data-testid="guide-nav-boundary"
            onClick={() => setActiveView(boundaryKey)}
          >
            <span className="guide-nav-number">B</span>
            <span>
              <strong>模型边界</strong>
              <small>BOUNDARY</small>
            </span>
          </button>
        </nav>

        <div className="guide-reader-content">
          {chapter ? (
            <article className="guide-reader-card">
              <div className="guide-reader-top">
                <span className="guide-reader-number" style={{ color: chapter.color }}>
                  {chapter.number}
                </span>
                <span className="guide-reader-kicker">{chapter.kicker}</span>
              </div>
              <h2>{chapter.title}</h2>
              <p className="guide-reader-summary">{chapter.summary}</p>
              <ul className="guide-reader-points">
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
          ) : null}

          {activeView === glossaryKey ? (
            <article className="guide-reader-card">
              <div className="guide-reader-top">
                <span className="guide-reader-number">A</span>
                <span className="guide-reader-kicker">GLOSSARY</span>
              </div>
              <h2>术语速查</h2>
              <dl className="guide-reader-glossary">
                {guideGlossary.map((item) => (
                  <div key={item.term}>
                    <dt>{item.term}</dt>
                    <dd>{item.text}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ) : null}

          {activeView === boundaryKey ? (
            <article className="guide-reader-card guide-reader-boundary">
              <div className="guide-reader-top">
                <span className="guide-reader-number">B</span>
                <span className="guide-reader-kicker">BOUNDARY</span>
              </div>
              <h2>这是一个示意模型</h2>
              <p>
                页面用公开专利实施例 8 做教学代理，不声称复刻量产镜头的每一片玻璃、每一条凸轮曲线或每一次实测对焦。
              </p>
              <p>
                轴向按专利间距，径向比例放大；光路是二维子午面追迹；合成目标图用于演示离焦，不是真实照片。
              </p>
              <div className="guide-links">
                <a href={guideLinks.research} target="_blank" rel="noreferrer">
                  光学调研
                </a>
                <a href={guideLinks.plan} target="_blank" rel="noreferrer">
                  开发计划
                </a>
              </div>
            </article>
          ) : null}
        </div>
      </div>
    </section>
  )
}
