import { describe, expect, it } from 'vitest'
import { buildLensLayout } from './lensLayout'
import { ZOOM_ANCHORS, patentFocalAt, spacingAtFocal } from './zoom'
import { computeEfl } from './trace'

describe('zoom spacing', () => {
  it('returns the wide and tele patent spacings at the UI endpoints', () => {
    expect(spacingAtFocal(24)).toEqual(ZOOM_ANCHORS[0].spacing)
    expect(spacingAtFocal(200)).toEqual(ZOOM_ANCHORS[3].spacing)
  })

  it('maps UI endpoints to the patent focal anchors', () => {
    expect(patentFocalAt(24)).toBe(24.7)
    expect(patentFocalAt(50)).toBe(50)
    expect(patentFocalAt(105)).toBe(105)
    expect(patentFocalAt(200)).toBe(194)
  })

  it('keeps D4 non-monotonic across the four anchors', () => {
    const d4 = ZOOM_ANCHORS.map((anchor) => anchor.spacing.D4)
    expect(d4[0]).toBeGreaterThan(d4[1])
    expect(d4[1]).toBeLessThan(d4[2])
    expect(d4[2]).toBeGreaterThan(d4[3])
  })

  it('computes EFL at the anchors', () => {
    expect(computeEfl(spacingAtFocal(24))).toBeCloseTo(24.7, 1)
    expect(computeEfl(spacingAtFocal(50))).toBeCloseTo(50.0, 1)
    expect(computeEfl(spacingAtFocal(105))).toBeCloseTo(105.0, 1)
    expect(computeEfl(spacingAtFocal(200))).toBeCloseTo(194.0, 1)
  })
})

describe('group layout', () => {
  it('keeps the G3/G6 block spacing constant', () => {
    for (const focal of [24, 50, 105, 200]) {
      const layout = buildLensLayout(spacingAtFocal(focal))
      const g3 = layout.groups.find((group) => group.id === 'G3')
      const g6 = layout.groups.find((group) => group.id === 'G6')
      expect(g3).toBeDefined()
      expect(g6).toBeDefined()
      expect((g6?.startZ ?? 0) - (g3?.startZ ?? 0)).toBeCloseTo(61.84, 1)
    }
  })

  it('matches the derived group movements at the tele end', () => {
    const wide = buildLensLayout(spacingAtFocal(24))
    const tele = buildLensLayout(spacingAtFocal(200))
    const movements = Object.fromEntries(
      tele.groups.map((group) => {
        const start = wide.groups.find((item) => item.id === group.id)
        const current = group.startZ - tele.imageZ
        const base = (start?.startZ ?? 0) - wide.imageZ
        return [group.id, Number((current - base).toFixed(1))]
      }),
    )

    expect(movements).toEqual({
      G1: -69.8,
      G2: -17.0,
      G3: -31.0,
      G4: -40.1,
      G5: -47.5,
      G6: -31.0,
    })
  })
})
