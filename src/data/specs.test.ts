import { describe, expect, it } from 'vitest'
import { lensSpec, sources } from './specs'

describe('lensSpec', () => {
  it('keeps the official 19-element / 15-group construction', () => {
    expect(lensSpec.construction.elements).toBe(19)
    expect(lensSpec.construction.groups).toBe(15)
  })

  it('keeps the official focal range and aperture', () => {
    expect(lensSpec.focal.min).toBe(24)
    expect(lensSpec.focal.max).toBe(200)
    expect(lensSpec.aperture).toBe('f/4–6.3')
  })

  it('keeps the special-element counts from the official specification', () => {
    expect(lensSpec.special).toEqual({ ed: 2, ased: 1, aspherical: 2 })
  })

  it('keeps the minimum focus distance samples ordered by focal length', () => {
    const focals = lensSpec.mfd.map((item) => item.focal)
    expect(focals).toEqual([...focals].sort((a, b) => a - b))
    expect(lensSpec.mfd[0]).toEqual({ focal: 24, distance: 0.5 })
    expect(lensSpec.mfd.at(-1)).toEqual({ focal: 200, distance: 0.7 })
  })
})

describe('sources', () => {
  it('has unique ids and https links', () => {
    const ids = sources.map((source) => source.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const source of sources) {
      expect(source.url.startsWith('https://')).toBe(true)
    }
  })

  it('includes official, patent and interview evidence', () => {
    const kinds = new Set(sources.map((source) => source.kind))
    expect(kinds).toEqual(new Set(['官方', '专利', '访谈']))
  })
})
