export const LESSONS = [
  {
    title: "折射成像",
    destination: "#diagram",
    instruction: "在剖面上选中 E15，顺着一条光线看它如何通过非球面。然后收小光圈，比较像面落点和被挡下的光线。",
    observation: "曲面改变光线方向。光阑主要限制哪些光线能通过。",
  },
  {
    title: "变焦与镜组",
    destination: "#zoom",
    instruction: "从广角端切到 194 mm，再把滑杆移到两个档位之间。观察镜组位移、取景倍率和像面光斑。",
    observation: "G3、光阑和 G5 同步轴向移动，其他镜组改变量各有不同。插值位置可能出现离焦。",
  },
  {
    title: "手动对焦",
    destination: "#focus",
    instruction: "保留 1.00 m 近景，缓慢拖动对焦双片滑杆。看近轴焦点怎样跨过像面，再把滑杆停在光斑较小的位置。",
    observation: "E16/E17 沿光轴移动，像面固定。越过合焦位置后，光斑会重新扩大。",
  },
  {
    title: "自动对焦",
    destination: "#focus",
    instruction: "启动相位 AF，比较两个半瞳的像点偏移。然后切换到对比度 AF 并重新启动，观察候选位置的清晰度评分。",
    observation: "相位法用偏移判断方向，对比度法寻找清晰度峰值。两种方法都驱动同一对镜片。",
  },
] as const;

interface ExperimentGuideProps {
  activeLesson: number | null;
  onLesson: (index: number) => void;
  onClose: () => void;
  onReset: () => void;
}

export function ExperimentGuide({ activeLesson, onLesson, onClose, onReset }: ExperimentGuideProps) {
  const lesson = activeLesson === null ? null : LESSONS[activeLesson];

  return (
    <section className="panel guide-panel" aria-label="实验引导">
      <div className="guide-heading">
        <h2>选择教学场景</h2>
        <button className="control-button" type="button" onClick={onReset}>重置实验台</button>
      </div>
      <div className="lesson-selector" role="group" aria-label="四个教学实验">
        {LESSONS.map((entry, index) => (
          <button
            className="control-button"
            type="button"
            key={entry.title}
            aria-pressed={index === activeLesson}
            onClick={() => onLesson(index)}
          >
            {entry.title}
          </button>
        ))}
      </div>
      {lesson && activeLesson !== null && (
        <div className="lesson-body">
          <div aria-live="polite">
            <h3>{lesson.title}</h3>
            <p>{lesson.instruction}</p>
            <p className="lesson-observation">{lesson.observation}</p>
          </div>
          <div className="lesson-actions">
            <a className="control-button focus-action" href={lesson.destination}>打开对应实验</a>
            <button className="control-button" type="button" onClick={onClose}>跳过引导</button>
            {activeLesson < LESSONS.length - 1
              ? <button className="control-button" type="button" onClick={() => onLesson(activeLesson + 1)}>下一项实验</button>
              : <button className="control-button" type="button" onClick={onClose}>结束引导</button>}
          </div>
        </div>
      )}
    </section>
  );
}
