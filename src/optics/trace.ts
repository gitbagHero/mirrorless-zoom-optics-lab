import {
  PATENT_SPACING,
  buildSurfaceSequence,
  type Asphere,
  type Spacing,
  type TraceSurface,
} from './surfaces'

export type RayMode = 'onAxis' | 'offAxis' | 'fan'

export type Vec2 = { z: number; y: number }

export type TracePoint = Vec2 & {
  surface?: number
  image?: boolean
}

export type TracedRay = {
  id: string
  color: string
  points: TracePoint[]
  clipped: boolean
  valid: boolean
  failure?: string
}

export type TraceBundle = {
  mode: RayMode
  rays: TracedRay[]
  efl: number
  imageZ: number
  stopRadius: number
  surfaces: TraceSurface[]
  objectDistanceMm: number
}

const STOP_RADIUS = 10.5
const START_DISTANCE = 30

function normalize(vector: Vec2): Vec2 {
  const length = Math.hypot(vector.z, vector.y)
  if (length === 0) return { z: 1, y: 0 }
  return { z: vector.z / length, y: vector.y / length }
}

function dot(a: Vec2, b: Vec2) {
  return a.z * b.z + a.y * b.y
}

function sag(radius: number, height: number, asphere?: Asphere) {
  if (!Number.isFinite(radius)) return 0
  const y2 = height * height
  const r2 = radius * radius
  const conic = asphere?.kappa ?? 0
  const root = Math.sqrt(Math.max(1 - ((1 + conic) * y2) / r2, 0))
  let value = y2 / (radius * (1 + root))
  if (asphere) {
    value +=
      asphere.a4 * y2 * y2 +
      asphere.a6 * y2 * y2 * y2 +
      asphere.a8 * y2 * y2 * y2 * y2 +
      asphere.a10 * y2 * y2 * y2 * y2 * y2 +
      asphere.a12 * y2 * y2 * y2 * y2 * y2 * y2
  }
  return value
}

function sagSlope(radius: number, height: number, asphere?: Asphere) {
  const epsilon = 0.001
  return (sag(radius, height + epsilon, asphere) - sag(radius, height - epsilon, asphere)) /
    (2 * epsilon)
}

function intersectSphere(
  origin: Vec2,
  direction: Vec2,
  surface: TraceSurface,
) {
  const centerZ = surface.z + surface.radius
  const oz = origin.z - centerZ
  const oy = origin.y
  const b = 2 * (oz * direction.z + oy * direction.y)
  const c = oz * oz + oy * oy - surface.radius * surface.radius
  const discriminant = b * b - 4 * c
  if (discriminant < 0) return null

  const root = Math.sqrt(discriminant)
  const candidates = [(-b - root) / 2, (-b + root) / 2]
    .filter((value) => value > 1e-7)
    .sort((a, bValue) => a - bValue)

  return candidates[0] ?? null
}

function intersectAsphere(
  origin: Vec2,
  direction: Vec2,
  surface: TraceSurface,
) {
  if (!surface.asphere) return intersectSphere(origin, direction, surface)

  const sphereT = intersectSphere(origin, direction, surface)
  if (sphereT === null) return null
  let t: number = sphereT

  for (let iteration = 0; iteration < 10; iteration += 1) {
    const z = origin.z + t * direction.z
    const y = origin.y + t * direction.y
    const targetZ = surface.z + sag(surface.radius, y, surface.asphere)
    const f = z - targetZ
    const slope = sagSlope(surface.radius, y, surface.asphere)
    const derivative = direction.z - slope * direction.y
    if (Math.abs(derivative) < 1e-9) break
    const next: number = t - f / derivative
    if (!Number.isFinite(next) || next <= 1e-7) break
    t = next
    if (Math.abs(f) < 1e-7) break
  }

  return t
}

function intersectSurface(
  origin: Vec2,
  direction: Vec2,
  surface: TraceSurface,
) {
  if (surface.isStop || !Number.isFinite(surface.radius)) {
    if (Math.abs(direction.z) < 1e-9) return null
    const t = (surface.z - origin.z) / direction.z
    return t > 1e-7 ? t : null
  }

  return surface.asphere
    ? intersectAsphere(origin, direction, surface)
    : intersectSphere(origin, direction, surface)
}

function surfaceNormal(
  point: Vec2,
  surface: TraceSurface,
) {
  if (surface.isStop || !Number.isFinite(surface.radius)) {
    return { z: -1, y: 0 }
  }

  if (surface.asphere) {
    const slope = sagSlope(surface.radius, point.y, surface.asphere)
    return normalize({ z: 1, y: -slope })
  }

  const centerZ = surface.z + surface.radius
  return normalize({
    z: point.z - centerZ,
    y: point.y,
  })
}

function refract(
  direction: Vec2,
  normal: Vec2,
  n1: number,
  n2: number,
) {
  let n = normal
  let cosI = -dot(n, direction)
  if (cosI < 0) {
    n = { z: -n.z, y: -n.y }
    cosI = -cosI
  }

  const eta = n1 / n2
  const k = 1 - eta * eta * (1 - cosI * cosI)
  if (k < 0) return null

  const cosT = Math.sqrt(k)
  return normalize({
    z: eta * direction.z + (eta * cosI - cosT) * n.z,
    y: eta * direction.y + (eta * cosI - cosT) * n.y,
  })
}

function traceSingleRay(
  id: string,
  heightAtFirst: number,
  angle: number,
  color: string,
  surfaces: TraceSurface[],
  imageZ: number,
  objectDistanceMm = Infinity,
): TracedRay {
  const first = surfaces[0]
  const last = surfaces[surfaces.length - 1]
  let startZ: number
  let startY: number
  let startDirection: Vec2

  if (Number.isFinite(objectDistanceMm) && objectDistanceMm > 0) {
    const objectZ = first.z - objectDistanceMm
    const slope = heightAtFirst / Math.max(first.z - objectZ, 1)
    startZ = first.z - START_DISTANCE
    startY = slope * (startZ - objectZ)
    startDirection = normalize({ z: 1, y: slope })
  } else {
    startZ = first.z - START_DISTANCE
    startY = heightAtFirst - Math.tan(angle) * (first.z - startZ)
    startDirection = normalize({ z: Math.cos(angle), y: Math.sin(angle) })
  }

  let origin = { z: startZ, y: startY }
  let direction = startDirection
  const points: TracePoint[] = [{ ...origin }]
  let clipped = false
  let valid = true
  let failure: string | undefined

  for (const surface of surfaces) {
    const t = intersectSurface(origin, direction, surface)
    if (t === null) {
      valid = false
      failure = `miss surface ${surface.id}`
      break
    }

    const hit = {
      z: origin.z + t * direction.z,
      y: origin.y + t * direction.y,
    }

    if (!Number.isFinite(hit.z) || !Number.isFinite(hit.y)) {
      valid = false
      failure = `nan at surface ${surface.id}`
      break
    }

    origin = hit
    points.push({ ...hit, surface: surface.id })

    if (surface.isStop) {
      if (Math.abs(hit.y) > STOP_RADIUS) {
        clipped = true
        break
      }
      continue
    }

    if (surface.nBefore !== surface.nAfter) {
      const normal = surfaceNormal(hit, surface)
      const nextDirection = refract(direction, normal, surface.nBefore, surface.nAfter)
      if (!nextDirection) {
        valid = false
        failure = `total internal reflection at surface ${surface.id}`
        break
      }
      direction = nextDirection
    }
  }

  if (valid && !clipped && imageZ > origin.z && direction.z > 0) {
    const t = (imageZ - origin.z) / direction.z
    if (t > 0 && Number.isFinite(t)) {
      origin = {
        z: imageZ,
        y: origin.y + t * direction.y,
      }
      points.push({ ...origin, image: true })
    }
  }

  if (origin.z < last.z) {
    valid = false
    failure = failure ?? 'stopped before final surface'
  }

  return { id, color, points, clipped, valid, failure }
}

export function computeEfl(spacing: Spacing = PATENT_SPACING) {
  const { surfaces } = buildSurfaceSequence(spacing)
  let height = 1
  let slope = 0
  let n = 1

  for (const surface of surfaces) {
    if (!surface.isStop && Number.isFinite(surface.radius) && surface.nBefore !== surface.nAfter) {
      const power = (surface.nAfter - surface.nBefore) / surface.radius
      const nextSlope = (n * slope - height * power) / surface.nAfter
      height += surface.thickness * nextSlope
      slope = nextSlope
      n = surface.nAfter
    } else {
      height += surface.thickness * slope
    }
  }

  return Math.abs(1 / slope)
}

export function traceRays(
  heights: number[],
  angle = 0,
  spacing: Spacing = PATENT_SPACING,
  objectDistanceMm = Infinity,
): TracedRay[] {
  const { surfaces, imageZ } = buildSurfaceSequence(spacing)
  const palette = ['#fbbf24', '#5eead4', '#c4b5fd', '#f472b6', '#93c5fd']
  return heights.map((height, index) =>
    traceSingleRay(
      `ray-${index}`,
      height,
      angle,
      palette[index % palette.length],
      surfaces,
      imageZ,
      objectDistanceMm,
    ),
  )
}

export function traceBundle(
  mode: RayMode = 'onAxis',
  spacing: Spacing = PATENT_SPACING,
  objectDistanceMm = Infinity,
): TraceBundle {
  const samples =
    mode === 'fan'
      ? [-6, -4, -2, 0, 2, 4, 6]
      : mode === 'offAxis'
        ? [-2, 0, 2]
        : [-4, 0, 4]
  const angle = mode === 'offAxis' ? 0.03 : 0
  const { surfaces, imageZ } = buildSurfaceSequence(spacing)

  return {
    mode,
    rays: traceRays(samples, angle, spacing, objectDistanceMm).map((ray) => ({
      ...ray,
      id: `${mode}-${ray.id}`,
    })),
    efl: computeEfl(spacing),
    imageZ,
    stopRadius: STOP_RADIUS,
    surfaces,
    objectDistanceMm,
  }
}
