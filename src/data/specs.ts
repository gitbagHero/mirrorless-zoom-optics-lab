export type Source = {
  id: string
  label: string
  kind: '官方' | '专利' | '访谈'
  url: string
  note: string
}

export const lensSpec = {
  name: 'NIKKOR Z 24-200mm f/4-6.3 VR',
  shortName: 'NIKKOR Z 24-200',
  mount: 'Nikon Z',
  focal: {
    min: 24,
    max: 200,
    label: '24–200 mm',
  },
  aperture: 'f/4–6.3',
  construction: {
    elements: 19,
    groups: 15,
  },
  special: {
    ed: 2,
    ased: 1,
    aspherical: 2,
  },
  focus: 'IF 内对焦',
  vr: '镜头位移式 VR · VCM · 5.0 档',
  weight: '约 570 g',
  filter: '67 mm',
  mfd: [
    { focal: 24, distance: 0.5 },
    { focal: 35, distance: 0.54 },
    { focal: 50, distance: 0.55 },
    { focal: 70, distance: 0.58 },
    { focal: 105, distance: 0.65 },
    { focal: 135, distance: 0.68 },
    { focal: 200, distance: 0.7 },
  ],
  modelLabel: '专利实施例 8 代理模型',
  disclaimer:
    '基于尼康公开专利实施例与官方规格的教学示意模型，不是尼康官方光学仿真，也不是量产镜头的精确 CAD。',
} as const

export const sources: Source[] = [
  {
    id: 'nikon-product',
    label: 'NIKKOR Z 24-200mm f/4-6.3 VR 产品页',
    kind: '官方',
    url: 'https://imaging.nikon.com/imaging/lineup/lens/z-mount/z_24-200mmf4-63_vr/',
    note: '规格、19 片 15 组、ED/AS/ASED、MTF 与结构图入口。',
  },
  {
    id: 'nikon-spec-jp',
    label: 'Nikon 日本规格页',
    kind: '官方',
    url: 'https://nij.nikon.com/products/lineup/nikkor/zmount/nikkor_z_24-200mm_f4-63_vr/spec.html',
    note: 'IF、VR VCM、最近对焦距离分档、光圈与重量。',
  },
  {
    id: 'nikon-manual',
    label: 'NIKKOR Z 24-200 官方镜头手册',
    kind: '官方',
    url: 'https://onlinemanual.nikonimglib.com/z5/en/16_kit_lens_manual_02.html',
    note: '控制环、MF/AF 行为、VR、无镜头侧开关、IF。',
  },
  {
    id: 'nikon-glossary',
    label: 'NIKKOR 镜头术语表',
    kind: '官方',
    url: 'https://imaging.nikon.com/imaging/lineup/lens/glossary/',
    note: 'ED、AS、ASED、IF、VR、STM、电磁光圈等术语。',
  },
  {
    id: 'nikon-z-mount',
    label: 'Nikon Z 卡口 FAQ',
    kind: '官方',
    url: 'https://nij.nikon.com/support/faq/products/article?articleNo=000056478',
    note: 'Z 卡口内径 55 mm、法兰距 16 mm。',
  },
  {
    id: 'patent-us',
    label: 'US20220121021A1（实施例 8）',
    kind: '专利',
    url: 'https://patents.google.com/patent/US20220121021A1/en',
    note: '六组结构、35 面处方、G5 对焦、G3 VR 子组、变焦锚点。',
  },
  {
    id: 'interview-fengniao',
    label: '尼克尔 Z 24-200 开发者访谈',
    kind: '访谈',
    url: 'https://m.fengniao.com/document/5362611.html',
    note: 'STM、焦点呼吸、VR 与 Z 卡口后组设计意图。',
  },
]
