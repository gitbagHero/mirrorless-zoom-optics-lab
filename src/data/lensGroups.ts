export type GroupId = 'G1' | 'G2' | 'G3' | 'G4' | 'G5' | 'G6'

export type LensGroup = {
  id: GroupId
  name: string
  power: '+' | '−'
  color: string
  count: number
  role: string
  boxLabel: string
  elementIds: string[]
  note?: string
}

export const lensGroups: LensGroup[] = [
  {
    id: 'G1',
    name: '前组',
    power: '+',
    color: '#38bdf8',
    count: 3,
    role: '聚光、决定视角与入瞳',
    boxLabel: '聚光',
    elementIds: ['L11', 'L12', 'L13'],
  },
  {
    id: 'G2',
    name: '变倍',
    power: '−',
    color: '#f59e0b',
    count: 4,
    role: '主变倍组，改变系统放大率',
    boxLabel: '变倍',
    elementIds: ['L21', 'L22', 'L23', 'L24'],
  },
  {
    id: 'G3',
    name: '补偿 / VR',
    power: '+',
    color: '#a78bfa',
    count: 4,
    role: '补偿像面；L32+L33 为 VR 子组',
    boxLabel: '补偿 / VR',
    elementIds: ['L31', 'L32', 'L33', 'L34'],
    note: 'L32 + L33 横向移动',
  },
  {
    id: 'G4',
    name: '中继',
    power: '+',
    color: '#fb7185',
    count: 4,
    role: '中继与像差补偿；与 G3 做相对运动',
    boxLabel: '中继',
    elementIds: ['L41', 'L42', 'L43', 'L44'],
  },
  {
    id: 'G5',
    name: '对焦',
    power: '−',
    color: '#34d399',
    count: 2,
    role: 'G5 向像方移动完成 IF 对焦',
    boxLabel: '对焦',
    elementIds: ['L51', 'L52'],
    note: '内对焦组',
  },
  {
    id: 'G6',
    name: '后组',
    power: '−',
    color: '#60a5fa',
    count: 2,
    role: '场曲/后焦校正；与 G3、光圈同块',
    boxLabel: '平场',
    elementIds: ['L61', 'L62'],
  },
]

export const groupById = Object.fromEntries(
  lensGroups.map((group) => [group.id, group]),
) as Record<GroupId, LensGroup>
