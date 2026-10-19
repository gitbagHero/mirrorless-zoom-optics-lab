import { describe, expect, it } from 'vitest'
import {
  effectiveTargetDistance,
  focusTravelAtFocal,
  mfdAtFocal,
  requiredFocusOffset,
} from './focus'
import { spacingAtFocal } from './zoom'
import { traceRays } from './trace'

describe('focus model', () => {
  it('uses the patent focus travel at the zoom endpoints', () => {
    expect(focusTravelAtFocal(24)).toBeCloseTo(1.31, 2)
    expect(focusTravelAtFocal(200)).toBeCloseTo(9.53, 2)
  })

  it('uses the official MFD table', () => {
    expect(mfdAtFocal(24)).toBe(0.5)
    expect(mfdAtFocal(50)).toBe(0.55)
    expect(mfdAtFocal(200)).toBe(0.7)
    expect(effectiveTargetDistance(200, 0.5)).toBe(0.7)
  })

  it('requires the full travel at MFD and less at 4 m', () => {
    const wide = spacingAtFocal(24)
    const travel = focusTravelAtFocal(24)
    expect(requiredFocusOffset(24, 0.5, wide)).toBeCloseTo(travel, 2)
    expect(requiredFocusOffset(24, 4, wide)).toBeGreaterThan(0)
    expect(requiredFocusOffset(24, 4, wide)).toBeLessThan(travel)
    expect(requiredFocusOffset(24, 20, wide)).toBeLessThan(
      requiredFocusOffset(24, 4, wide),
    )
  })
})

describe('finite object tracing', () => {
  it('reduces image-plane spread when G5 is moved to the ideal focus offset', () => {
    const spacing = spacingAtFocal(200)
    const offset = requiredFocusOffset(200, 4, spacing)
    const focusedSpacing = {
      ...spacing,
      D4: spacing.D4 + offset,
      D5: spacing.D5 - offset,
    }
    const spread = (rays: ReturnType<typeof import('./trace').traceRays>) =>
      Math.max(...rays.map((ray) => Math.abs(ray.points.at(-1)?.y ?? 0)))

    const unfocused = spread(traceRays([-4, 0, 4], 0, spacing, 4000))
    const focused = spread(traceRays([-4, 0, 4], 0, focusedSpacing, 4000))

    expect(focused).toBeLessThan(unfocused)
  })
})
