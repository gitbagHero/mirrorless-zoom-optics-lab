export type VariableGap = 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'BF'

export type Asphere = {
  kappa: number
  a4: number
  a6: number
  a8: number
  a10: number
  a12: number
}

export type PatentSurface = {
  id: number
  radius: number
  thickness: number
  nAfter: number
  abbe?: number
  variable?: VariableGap
  isStop?: boolean
  asphere?: Asphere
}

export type Spacing = Record<VariableGap, number>

export const PATENT_SPACING: Spacing = {
  D1: 1.5,
  D2: 15.4968,
  D3: 10.63532,
  D4: 8.8967,
  D5: 9.31183,
  BF: 9.29998,
}

/** US20220121021A1, Example 8, Table 8. Thickness is the distance to the next surface. */
export const PATENT_SURFACES: PatentSurface[] = [
  { id: 1, radius: 119.2532, thickness: 2.0, nAfter: 1.902, abbe: 25.26 },
  { id: 2, radius: 75.474, thickness: 6.1889, nAfter: 1.49782, abbe: 82.57 },
  { id: 3, radius: -685.9404, thickness: 0.1, nAfter: 1.0 },
  { id: 4, radius: 62.0223, thickness: 5.1009, nAfter: 1.59319, abbe: 67.9 },
  { id: 5, radius: 237.4793, thickness: 0, nAfter: 1.0, variable: 'D1' },
  { id: 6, radius: 153.6662, thickness: 1.5, nAfter: 1.816, abbe: 46.59, asphere: { kappa: 1, a4: 2.54661e-6, a6: 1.57681e-8, a8: -1.62633e-10, a10: 6.99665e-13, a12: 0 } },
  { id: 7, radius: 15.5464, thickness: 4.2474, nAfter: 1.0 },
  { id: 8, radius: -40.2333, thickness: 1.5002, nAfter: 1.8485, abbe: 43.79 },
  { id: 9, radius: 79.6309, thickness: 0.1006, nAfter: 1.0 },
  { id: 10, radius: 32.2669, thickness: 3.598, nAfter: 1.80809, abbe: 22.74 },
  { id: 11, radius: -38.3529, thickness: 0.7346, nAfter: 1.0 },
  { id: 12, radius: -22.0127, thickness: 1.5, nAfter: 1.8485, abbe: 43.79 },
  { id: 13, radius: -91.6465, thickness: 0, nAfter: 1.0, variable: 'D2' },
  { id: 14, radius: Infinity, thickness: 1.5, nAfter: 1.0, isStop: true },
  { id: 15, radius: 44.529, thickness: 2.6559, nAfter: 1.743972, abbe: 44.85 },
  { id: 16, radius: -81.3774, thickness: 0.7, nAfter: 1.0 },
  { id: 17, radius: 33.2106, thickness: 3.4046, nAfter: 1.940752, abbe: 30.99 },
  { id: 18, radius: 19.5338, thickness: 3.9016, nAfter: 1.508752, abbe: 59.7 },
  { id: 19, radius: -65.3422, thickness: 1.3372, nAfter: 1.0 },
  { id: 20, radius: -26.7545, thickness: 1.5, nAfter: 1.730111, abbe: 29.68 },
  { id: 21, radius: -101.6153, thickness: 0, nAfter: 1.0, variable: 'D3' },
  { id: 22, radius: 33.103, thickness: 6.103, nAfter: 1.487502, abbe: 70.4 },
  { id: 23, radius: -28.7765, thickness: 0.1, nAfter: 1.0 },
  { id: 24, radius: -116.0123, thickness: 3.4598, nAfter: 1.507497, abbe: 68.3 },
  { id: 25, radius: -28.0491, thickness: 1.5, nAfter: 1.910214, abbe: 32.03 },
  { id: 26, radius: -237.5876, thickness: 0.2542, nAfter: 1.0 },
  { id: 27, radius: 95.5133, thickness: 3.1295, nAfter: 1.611115, abbe: 59.13 },
  { id: 28, radius: -51.74, thickness: 0, nAfter: 1.0, variable: 'D4', asphere: { kappa: 1, a4: 2.83706e-5, a6: -3.41484e-8, a8: 2.83345e-10, a10: -4.50609e-13, a12: 0 } },
  { id: 29, radius: 333.8201, thickness: 3.4464, nAfter: 1.80809, abbe: 22.74 },
  { id: 30, radius: -49.9705, thickness: 1.5, nAfter: 1.743986, abbe: 44.82 },
  { id: 31, radius: 31.2247, thickness: 0, nAfter: 1.0, variable: 'D5', asphere: { kappa: 1, a4: -4.2477e-6, a6: 6.21761e-8, a8: -2.79037e-10, a10: 4.34156e-13, a12: 0 } },
  { id: 32, radius: -27.4502, thickness: 1.5, nAfter: 1.53118, abbe: 66.16 },
  { id: 33, radius: -59.8926, thickness: 0.1, nAfter: 1.0 },
  { id: 34, radius: 164.9552, thickness: 2.6581, nAfter: 1.749763, abbe: 27.8 },
  { id: 35, radius: -519.6427, thickness: 0, nAfter: 1.0, variable: 'BF' },
]

export type TraceSurface = PatentSurface & {
  z: number
  thickness: number
  nBefore: number
}

export function buildSurfaceSequence(spacing: Spacing = PATENT_SPACING): {
  surfaces: TraceSurface[]
  imageZ: number
} {
  let z = 0
  let nBefore = 1
  const surfaces: TraceSurface[] = PATENT_SURFACES.map((surface) => {
    const thickness = surface.variable ? spacing[surface.variable] : surface.thickness
    const traceSurface: TraceSurface = {
      ...surface,
      z,
      thickness,
      nBefore,
    }
    z += thickness
    nBefore = surface.nAfter
    return traceSurface
  })

  return {
    surfaces,
    imageZ: z,
  }
}
