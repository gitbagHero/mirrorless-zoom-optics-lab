import { ASPHERES, SURFACES } from "./prescription";
import type { SpacingKey, Surface, ZoomAnchor } from "./prescription";

export interface PositionedSurface extends Surface {
  z: number;
  indexBefore: number;
}

export function locateSurfaces(
  spacing: Readonly<Record<SpacingKey, number>>,
): PositionedSurface[] {
  let z = 0;
  let indexBefore = 1;
  const positions = SURFACES.map((surface) => {
    const position = { ...surface, z, indexBefore };
    z += typeof surface.spacing === "number" ? surface.spacing : spacing[surface.spacing];
    indexBefore = surface.indexAfter;
    return position;
  });
  return positions.map((surface) => ({ ...surface, z: surface.z - z }));
}

export function surfaceSag(surface: Surface, height: number): number {
  if (!Number.isFinite(surface.radius)) return 0;
  const h2 = height ** 2;
  const asphere = ASPHERES[surface.id];
  const kappa = asphere?.kappa ?? 1;
  const sag = (h2 / surface.radius) / (1 + Math.sqrt(1 - kappa * h2 / surface.radius ** 2));
  if (!asphere) return sag;
  return asphere.coefficients.reduce(
    (total, coefficient, index) => total + coefficient * h2 ** (index + 2),
    sag,
  );
}

export function surfaceSlope(surface: Surface, height: number): number {
  if (!Number.isFinite(surface.radius)) return 0;
  const asphere = ASPHERES[surface.id];
  const factor = Math.sqrt(1 - (asphere?.kappa ?? 1) * (height / surface.radius) ** 2);
  const slope = height / (surface.radius * factor);
  if (!asphere) return slope;
  return asphere.coefficients.reduce((total, coefficient, index) => {
    const power = 4 + 2 * index;
    return total + power * coefficient * height ** (power - 1);
  }, slope);
}

export function traceParaxial(surfaces: readonly PositionedSurface[], height: number, reducedAngle: number) {
  let y = height;
  let u = reducedAngle;
  for (let index = 0; index < surfaces.length; index += 1) {
    const surface = surfaces[index];
    u -= y * (surface.indexAfter - surface.indexBefore) / surface.radius;
    const next = surfaces[index + 1];
    if (next) y += (next.z - surface.z) * u / surface.indexAfter;
  }
  return { y, u };
}

export function measureParaxial(surfaces: readonly PositionedSurface[]) {
  const collimated = traceParaxial(surfaces, 1, 0);
  return {
    focalLength: -1 / collimated.u,
    backFocus: -collimated.y / collimated.u,
  };
}

export function checkAnchor(anchor: ZoomAnchor) {
  const infinity = locateSurfaces(anchor.spacing);
  const shortDistance = locateSurfaces({
    ...anchor.spacing,
    D4: anchor.near.D4,
    D5: anchor.near.D5,
  });
  const incidentAngle = 0.001;
  const near = traceParaxial(shortDistance, anchor.near.D0 * incidentAngle, incidentAngle);

  return {
    ...measureParaxial(infinity),
    nearImageOffset: -near.y / near.u - anchor.spacing.BF,
  };
}
