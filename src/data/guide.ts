export type GuidePreset =
  | 'structure'
  | 'zoom'
  | 'focus'
  | 'autofocus'
  | 'elements'
  | 'model'

export type GuideChapter = {
  id: string
  number: string
  kicker: string
  title: string
  summary: string
  points: string[]
  tryLabel: string
  preset: GuidePreset
  color: string
}

export const guideChapters: GuideChapter[] = [
  {
    id: 'structure',
    number: '01',
    kicker: 'STRUCTURE',
    title: '为什么是 19 片 15 组',
    summary:
      '高倍率变焦不是把镜片堆在一起，而是把“收光、变倍、补偿、对焦、平场”拆给不同组完成。',
    points: [
      '19 片分成 6 个功能组，15 组包含胶合面计数。',
      'G1 收光，G2 主变倍，G3/G4 补偿像差，G5 对焦，G6 平场。',
      '组越多，越能分别处理互相矛盾的像差与体积约束。',
    ],
    tryLabel: '切到结构视图',
    preset: 'structure',
    color: '#38bdf8',
  },
  {
    id: 'zoom',
    number: '02',
    kicker: 'ZOOM',
    title: '变焦：六组如何分工',
    summary:
      '从 24 mm 到 200 mm，六组都沿光轴移动；G3、G6 和光圈保持固定间距，像一个整体块。',
    points: [
      'G1 向前伸出最多，G2 行程最小。',
      'G4/G5 在 G3–G6 块内做相对运动，D4 不是单调变化。',
      '“谁在动”面板用毫米显示当前焦距下的组行程。',
    ],
    tryLabel: '切到 200 mm + 6 组',
    preset: 'zoom',
    color: '#f59e0b',
  },
  {
    id: 'focus',
    number: '03',
    kicker: 'FOCUS',
    title: '对焦：G5 内对焦',
    summary:
      'G5 是 L51 + L52 胶合的小组。它向像方移动，改变物距共轭；镜筒长度不变。',
    points: [
      '对焦组只有两片胶合，质量小，适合 STM 快速驱动。',
      '专利近距行程从广角约 1.31 mm 增至长焦约 9.53 mm。',
      '对焦会轻微改变有效焦距，页面用 EFL(∞) 保持变焦标尺。',
    ],
    tryLabel: '切到 105 mm 对焦',
    preset: 'focus',
    color: '#a78bfa',
  },
  {
    id: 'autofocus',
    number: '04',
    kicker: 'MF / AF',
    title: '手动 vs 机器对焦',
    summary:
      '手动对焦由控制环给出电子信号，自动对焦由机身计算误差并驱动 G5。两者最终都落到同一个对焦组。',
    points: [
      'MF：拖动对焦环，G5 位置由你决定。',
      'AF-S：一次驱动，轻微过冲后锁定。',
      'AF-C：目标或焦距变化时持续追焦；页面用目标距离模拟。',
    ],
    tryLabel: '切到 200 mm AF-C',
    preset: 'autofocus',
    color: '#e11d48',
  },
  {
    id: 'elements',
    number: '05',
    kicker: 'GLASS / AS',
    title: 'ED / AS / ASED 在解决什么',
    summary:
      'ED 处理色差，非球面处理畸变、彗差和球差；非球面 ED 用一片同时承担两类校正。',
    points: [
      '官方结构图中前组有两片 ED，后部有非球面与非球面 ED。',
      'L12/L13 是 ED；L44 是非球面；L52 是非球面 ED 的候选。',
      '逐片对应关系是推断，页面明确标注“待核对”。',
    ],
    tryLabel: '选中 L12 看 ED',
    preset: 'elements',
    color: '#0f766e',
  },
  {
    id: 'model',
    number: '06',
    kicker: 'BOUNDARY',
    title: '如何读这个示意模型',
    summary:
      '页面用专利实施例 8 做代理模型，不是尼康官方仿真，也不是量产镜头的精确 CAD。',
    points: [
      'UI 焦距 24–200 mm 对应专利锚点 24.7 / 50 / 105 / 194 mm。',
      '轴向按专利间距，径向比例放大；光路是二维子午面追迹。',
      '合成目标图用于演示离焦，不是真实照片或实测样张。',
    ],
    tryLabel: '打开数据说明',
    preset: 'model',
    color: '#6d4aff',
  },
]

export const guideGlossary = [
  { term: '变倍组 / variator', text: '主要负责改变焦距与放大率的组；本设计是 G2。' },
  { term: '补偿组 / compensator', text: '把变倍后漂移的像面拉回并压像差的组。' },
  { term: '对焦组', text: '改变物距共轭的组；本设计是 G5。' },
  { term: 'IF 内对焦', text: '对焦时镜筒总长不变，只移动内部组。' },
  { term: 'EFL', text: '有效焦距；页面用 EFL(∞) 标出变焦锚点。' },
  { term: '弥散 / 离焦', text: '像点没有会聚到传感器，表现为模糊光斑。' },
]

export const guideLinks = {
  research:
    'https://github.com/gitbagHero/mirrorless-zoom-optics-lab/blob/dsh-dev/docs/research/nikkor-z-24-200-research.md',
  plan: 'https://github.com/gitbagHero/mirrorless-zoom-optics-lab/blob/dsh-dev/docs/development-plan.md',
}
