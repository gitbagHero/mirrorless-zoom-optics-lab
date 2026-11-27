import { LENSES } from "./elements";
import { surfaceSag, surfaceSlope, traceParaxial } from "./model";
import type { PositionedSurface } from "./model";
import { ASPHERES, STOP } from "./prescription";

export interface RayPoint {
  z: number;
  y: number;
}

type RayEnd = "sensor" | "stop" | "rim" | "reflection" | "miss";

export interface TracedRay {
  path: readonly RayPoint[];
  end: RayEnd;
  surfaceId?: number;
  pupil: number;
}

export function pupilHalf(ray: TracedRay) {
  const stopHeight = ray.path[STOP]?.y ?? 0;
  return Math.abs(stopHeight) < 1e-7 ? 0 : Math.sign(stopHeight);
}

const rimBySurface = new Map<number, number>();
for (const lens of LENSES) {
  for (const id of [lens.front, lens.back]) {
    rimBySurface.set(id, Math.min(rimBySurface.get(id) ?? Infinity, lens.drawRadius));
  }
}

function sagBound(surface: PositionedSurface, rim: number) {
  const asphere = ASPHERES[surface.id];
  const h = rim / surface.radius;
  const base = (rim * h) / (1 + Math.sqrt(1 - (asphere?.kappa ?? 1) * h ** 2));
  return Math.abs(base) + (asphere?.coefficients.reduce(
    (total, coefficient, index) => total + Math.abs(coefficient) * rim ** (4 + 2 * index), 0,
  ) ?? 0);
}

function intersection(from: RayPoint, slope: number, surface: PositionedSurface, rim: number) {
  const heightAt = (z: number) => from.y + slope * (z - from.z);
  if (!Number.isFinite(surface.radius)) {
    return surface.z >= from.z ? { z: surface.z, y: heightAt(surface.z) } : undefined;
  }
  const sag = sagBound(surface, rim) + 1e-8;
  let low = Math.max(from.z, surface.z - sag);
  let high = surface.z + sag;
  const residual = (z: number) => {
    const height = Math.max(-rim, Math.min(rim, heightAt(z)));
    return z - surface.z - surfaceSag(surface, height);
  };
  if (!(high >= low) || residual(low) > 1e-7) return undefined;
  // Extend the profile at the rim just for finding rays rejected by the finite aperture.
  for (let iteration = 0; iteration < 32 && high - low > 1e-8; iteration += 1) {
    const mid = (low + high) / 2;
    if (residual(mid) > 0) high = mid;
    else low = mid;
  }
  const z = (low + high) / 2;
  return { z, y: heightAt(z) };
}

function refract(direction: number, surface: PositionedSurface, y: number) {
  const normal = -Math.atan(surfaceSlope(surface, y));
  const sine = surface.indexBefore / surface.indexAfter * Math.sin(direction - normal);
  if (Math.abs(sine) > 1) return undefined;
  const outgoing = normal + Math.asin(sine);
  return Math.abs(outgoing) < Math.PI / 2 ? outgoing : undefined;
}

export function traceRay(
  surfaces: readonly PositionedSurface[],
  from: RayPoint,
  incidentAngle: number,
  apertureRadius: number,
  pupil = 0,
): TracedRay {
  const path = [from];
  let direction = incidentAngle;
  for (const surface of surfaces) {
    const rim = surface.id === STOP ? apertureRadius : rimBySurface.get(surface.id)!;
    const point = intersection(path[path.length - 1], Math.tan(direction), surface, rim);
    if (!point) return { path, end: "miss", surfaceId: surface.id, pupil };
    path.push(point);
    if (Math.abs(point.y) > rim + 1e-7) {
      return { path, end: surface.id === STOP ? "stop" : "rim", surfaceId: surface.id, pupil };
    }
    if (surface.indexBefore !== surface.indexAfter) {
      const outgoing = refract(direction, surface, point.y);
      if (outgoing === undefined) return { path, end: "reflection", surfaceId: surface.id, pupil };
      direction = outgoing;
    }
  }
  const last = path[path.length - 1];
  path.push({ z: 0, y: last.y - last.z * Math.tan(direction) });
  return { path, end: "sensor", pupil };
}

export function traceInfinityBundle(
  surfaces: readonly PositionedSurface[],
  incidentDegrees: number,
  entranceRadius: number,
  entranceFactor: number,
  apertureRadius: number,
  start = surfaces[0].z - 12,
) {
  return traceSubjectBundle(surfaces, incidentDegrees, Infinity, entranceRadius, entranceFactor, apertureRadius, start);
}

export function traceSubjectBundle(
  surfaces: readonly PositionedSurface[],
  incidentDegrees: number,
  distanceFromImage: number,
  entranceRadius: number,
  entranceFactor: number,
  apertureRadius: number,
  start = surfaces[0].z - 12,
) {
  const rayCount = 81;
  const fieldSlope = Math.tan(incidentDegrees * Math.PI / 180);
  const samplePlane = surfaces[0].z;
  const objectGap = distanceFromImage + samplePlane;
  const angularTransfer = traceParaxial(surfaces.slice(0, STOP), 0, 1).y;
  const chiefHeight = -angularTransfer * fieldSlope / (entranceFactor + angularTransfer / objectGap);

  return Array.from({ length: rayCount }, (_, index) => {
    const pupil = (2 * index / (rayCount - 1) - 1) * 1.25;
    const entranceHeight = chiefHeight + pupil * entranceRadius;
    const slope = fieldSlope + entranceHeight / objectGap;
    const y = entranceHeight + (start - samplePlane) * slope;
    return traceRay(surfaces, { z: start, y }, Math.atan(slope), apertureRadius, pupil);
  });
}

export function measureSpot(rays: readonly TracedRay[]) {
  const hits = rays.filter((ray) => ray.end === "sensor").map((ray) => ray.path[ray.path.length - 1].y);
  if (hits.length === 0) return { hits, centroid: null, rms: null, width: null };
  const centroid = hits.reduce((sum, hit) => sum + hit, 0) / hits.length;
  const variance = hits.reduce((sum, hit) => sum + (hit - centroid) ** 2, 0) / hits.length;
  return { hits, centroid, rms: Math.sqrt(variance), width: Math.max(...hits) - Math.min(...hits) };
}
