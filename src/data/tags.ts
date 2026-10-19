import type { ElementTag } from './lensStructure'

export type TagMeta = {
  label: string
  short: string
  color: string
  description: string
}

export const TAG_META: Record<ElementTag, TagMeta> = {
  ED: {
    label: 'ED',
    short: 'ED',
    color: '#facc15',
    description: '低色散玻璃，抑制色差与二级光谱',
  },
  AS: {
    label: 'AS',
    short: 'AS',
    color: '#fb923c',
    description: '非球面，校正畸变、彗差和球差',
  },
  ASED: {
    label: 'ASED',
    short: 'AE',
    color: '#60a5fa',
    description: '非球面 ED，一片同时承担两种校正',
  },
  VR: {
    label: 'VR',
    short: 'VR',
    color: '#c4b5fd',
    description: '防抖子组，垂直光轴横移',
  },
  FOCUS: {
    label: 'FOCUS',
    short: 'F',
    color: '#34d399',
    description: 'G5 内对焦组，向像方移动',
  },
}
