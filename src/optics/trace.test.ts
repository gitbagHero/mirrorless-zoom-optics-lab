import { describe, expect, it } from 'vitest'
import { computeEfl, traceBundle, traceRays } from './trace'

describe('ray tracing', () => {
  it('computes the wide-angle EFL from the patent prescription', () => {
    expect(computeEfl()).toBeCloseTo(24.7, 1)
  })

  it('traces on-axis rays through all surfaces to the image plane', () => {
    const bundle = traceBundle('onAxis')
    expect(bundle.rays).toHaveLength(3)
    for (const ray of bundle.rays) {
      expect(ray.valid).toBe(true)
      expect(ray.clipped).toBe(false)
      expect(ray.points.at(-1)?.image).toBe(true)
    }
  })

  it('traces off-axis and fan presets without NaN points', () => {
    for (const mode of ['offAxis', 'fan'] as const) {
      const bundle = traceBundle(mode)
      for (const ray of bundle.rays) {
        expect(ray.points.length).toBeGreaterThan(2)
        for (const point of ray.points) {
          expect(Number.isFinite(point.z)).toBe(true)
          expect(Number.isFinite(point.y)).toBe(true)
        }
      }
    }
  })
})

describe('EFL across the four patent zoom anchors', () => {
  const spacings = [
    { label: '24.7mm', expected: 24.7, spacing: { D1: 1.50000, D2: 15.49680, D3: 10.63532, D4: 8.89670, D5: 9.31183, BF: 9.29998 } },
    { label: '50mm', expected: 50.0, spacing: { D1: 18.29170, D2: 10.23739, D3: 4.97092, D4: 4.43383, D5: 19.43911, BF: 20.64280 } },
    { label: '105mm', expected: 105.0, spacing: { D1: 34.70486, D2: 4.55937, D3: 1.81398, D4: 5.19646, D5: 21.83341, BF: 36.83273 } },
    { label: '194mm', expected: 194.0, spacing: { D1: 54.28408, D2: 1.50000, D3: 1.50000, D4: 1.51052, D5: 25.83333, BF: 40.29998 } },
  ]

  for (const item of spacings) {
    it(`matches ${item.label}`, () => {
      expect(computeEfl(item.spacing)).toBeCloseTo(item.expected, 1)
    })
  }
})

describe('batch tracing', () => {
  it('traces a 50-ray batch without non-finite points', () => {
    const heights = Array.from({ length: 50 }, (_, index) => -8 + (16 * index) / 49)
    const rays = traceRays(heights, 0)
    expect(rays).toHaveLength(50)
    for (const ray of rays) {
      expect(ray.points.length).toBeGreaterThan(2)
      for (const point of ray.points) {
        expect(Number.isFinite(point.z)).toBe(true)
        expect(Number.isFinite(point.y)).toBe(true)
      }
    }
  })
})
