import type { GroupId } from './lensGroups'

export type ElementTag = 'ED' | 'AS' | 'ASED' | 'VR' | 'FOCUS'

export type LensElement = {
  id: string
  group: GroupId
  r1: number
  r2: number
  thickness: number
  gapAfter: number
  semiHeight: number
  nd: number
  vd: number
  shape: string
  tags: ElementTag[]
  role: string
}

export const lensElements: LensElement[] = [
  { id: 'L11', group: 'G1', r1: 119.2532, r2: 75.474, thickness: 2.0, gapAfter: 0, semiHeight: 28.0, nd: 1.902, vd: 25.26, shape: '负弯月', tags: [], role: '前组负弯月；控制前口径与广角彗差' },
  { id: 'L12', group: 'G1', r1: 75.474, r2: -685.9404, thickness: 6.1889, gapAfter: 0.1, semiHeight: 27.2, nd: 1.49782, vd: 82.57, shape: '双凸', tags: ['ED'], role: '前组主正光焦度；低色散压轴向色差' },
  { id: 'L13', group: 'G1', r1: 62.0223, r2: 237.4793, thickness: 5.1009, gapAfter: 1.5, semiHeight: 26.7, nd: 1.59319, vd: 67.9, shape: '正弯月', tags: ['ED'], role: '前组场曲/彗差校正；第二片低色散' },
  { id: 'L21', group: 'G2', r1: 153.6662, r2: 15.5464, thickness: 1.5, gapAfter: 4.2474, semiHeight: 13.0, nd: 1.816, vd: 46.59, shape: '负弯月', tags: [], role: '变倍组前片；广角畸变与彗差校正' },
  { id: 'L22', group: 'G2', r1: -40.2333, r2: 79.6309, thickness: 1.5002, gapAfter: 0.1006, semiHeight: 13.0, nd: 1.8485, vd: 43.79, shape: '双凹', tags: [], role: '变倍组主负光焦度' },
  { id: 'L23', group: 'G2', r1: 32.2669, r2: -38.3529, thickness: 3.598, gapAfter: 0.7346, semiHeight: 10.2, nd: 1.80809, vd: 22.74, shape: '双凸', tags: [], role: '变倍组内正片；平衡色差与球差' },
  { id: 'L24', group: 'G2', r1: -22.0127, r2: -91.6465, thickness: 1.5, gapAfter: 15.4968, semiHeight: 13.0, nd: 1.8485, vd: 43.79, shape: '负弯月', tags: [], role: '变倍组后片；控制出瞳与场曲' },
  { id: 'L31', group: 'G3', r1: 44.529, r2: -81.3774, thickness: 2.6559, gapAfter: 0.7, semiHeight: 10.9, nd: 1.743972, vd: 44.85, shape: '双凸', tags: [], role: '补偿组前正片；收束光圈后光束' },
  { id: 'L32', group: 'G3', r1: 33.2106, r2: 19.5338, thickness: 3.4046, gapAfter: 0, semiHeight: 13.0, nd: 1.940752, vd: 30.99, shape: '负弯月', tags: ['VR'], role: 'VR 胶合组前片；横向移动补偿抖动' },
  { id: 'L33', group: 'G3', r1: 19.5338, r2: -65.3422, thickness: 3.9016, gapAfter: 1.3372, semiHeight: 9.7, nd: 1.508752, vd: 59.7, shape: '双凸', tags: ['VR'], role: 'VR 胶合组后片；给防抖组正光焦度' },
  { id: 'L34', group: 'G3', r1: -26.7545, r2: -101.6153, thickness: 1.5, gapAfter: 10.63532, semiHeight: 13.0, nd: 1.730111, vd: 29.68, shape: '负弯月', tags: [], role: '补偿组后片；场曲与彗差平衡' },
  { id: 'L41', group: 'G4', r1: 33.103, r2: -28.7765, thickness: 6.103, gapAfter: 0.1, semiHeight: 12.7, nd: 1.487502, vd: 70.4, shape: '双凸', tags: [], role: '后组前正片；中继光焦度' },
  { id: 'L42', group: 'G4', r1: -116.0123, r2: -28.0491, thickness: 3.4598, gapAfter: 0, semiHeight: 14.0, nd: 1.507497, vd: 68.3, shape: '正弯月', tags: [], role: '与 L43 胶合；色差校正' },
  { id: 'L43', group: 'G4', r1: -28.0491, r2: -237.5876, thickness: 1.5, gapAfter: 0.2542, semiHeight: 15.0, nd: 1.910214, vd: 32.03, shape: '负弯月', tags: [], role: '与 L42 胶合；色差与场曲校正' },
  { id: 'L44', group: 'G4', r1: 95.5133, r2: -51.74, thickness: 3.1295, gapAfter: 8.8967, semiHeight: 13.0, nd: 1.611115, vd: 59.13, shape: '双凸', tags: ['AS'], role: '后组正片；非球面校正球差/彗差' },
  { id: 'L51', group: 'G5', r1: 333.8201, r2: -49.9705, thickness: 3.4464, gapAfter: 0, semiHeight: 15.6, nd: 1.80809, vd: 22.74, shape: '双凸', tags: ['FOCUS'], role: '对焦组前片；G5 向像方移动' },
  { id: 'L52', group: 'G5', r1: -49.9705, r2: 31.2247, thickness: 1.5, gapAfter: 9.31183, semiHeight: 17.0, nd: 1.743986, vd: 44.82, shape: '双凹', tags: ['ASED', 'FOCUS'], role: '对焦组后片；非球面 ED 候选，抑制对焦像差' },
  { id: 'L61', group: 'G6', r1: -27.4502, r2: -59.8926, thickness: 1.5, gapAfter: 0.1, semiHeight: 18.0, nd: 1.53118, vd: 66.16, shape: '负弯月', tags: [], role: '后组场曲校正' },
  { id: 'L62', group: 'G6', r1: 164.9552, r2: -519.6427, thickness: 2.6581, gapAfter: 9.29998, semiHeight: 18.0, nd: 1.749763, vd: 27.8, shape: '双凸', tags: [], role: '后组正片；与 L61 形成空气透镜' },
]

export const elementById = Object.fromEntries(
  lensElements.map((element) => [element.id, element]),
) as Record<string, LensElement>
