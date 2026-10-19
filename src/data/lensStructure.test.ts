import { describe, expect, it } from 'vitest'
import { lensGroups } from './lensGroups'
import { lensElements } from './lensStructure'

describe('lens structure data', () => {
  it('contains 19 elements in 6 optical groups', () => {
    expect(lensElements).toHaveLength(19)
    expect(lensGroups).toHaveLength(6)
    expect(lensGroups.reduce((sum, group) => sum + group.count, 0)).toBe(19)
  })

  it('keeps the per-group element counts from the patent example', () => {
    const counts = Object.fromEntries(
      lensGroups.map((group) => [
        group.id,
        lensElements.filter((element) => element.group === group.id).length,
      ]),
    )

    expect(counts).toEqual({ G1: 3, G2: 4, G3: 4, G4: 4, G5: 2, G6: 2 })
  })

  it('keeps the special-element tags used by the I1 view', () => {
    const tagCounts = lensElements.flatMap((element) => element.tags)
    expect(tagCounts.filter((tag) => tag === 'ED')).toHaveLength(2)
    expect(tagCounts.filter((tag) => tag === 'AS')).toHaveLength(1)
    expect(tagCounts.filter((tag) => tag === 'ASED')).toHaveLength(1)
    expect(tagCounts.filter((tag) => tag === 'VR')).toHaveLength(2)
    expect(tagCounts.filter((tag) => tag === 'FOCUS')).toHaveLength(2)
  })

  it('has positive thickness and valid surface data for every element', () => {
    for (const element of lensElements) {
      expect(element.thickness).toBeGreaterThan(0)
      expect(element.semiHeight).toBeGreaterThan(0)
      expect(element.nd).toBeGreaterThan(1)
      expect(element.vd).toBeGreaterThan(20)
      expect(lensGroups.some((group) => group.id === element.group)).toBe(true)
    }
  })
})
