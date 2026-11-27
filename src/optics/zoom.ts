import { locateSurfaces, measureParaxial, traceParaxial } from "./model";
import { STOP, ZOOM_ANCHORS } from "./prescription";
import type { SpacingKey } from "./prescription";

export const ZOOM_MINIMUM = ZOOM_ANCHORS[0].focalLength;
export const ZOOM_MAXIMUM = ZOOM_ANCHORS[ZOOM_ANCHORS.length - 1].focalLength;
export const DIAGRAM_START = locateSurfaces(ZOOM_ANCHORS[ZOOM_ANCHORS.length - 1].spacing)[0].z - 12;
export const SENSOR_WIDTH = 36;
export const SENSOR_DIAGONAL = Math.hypot(SENSOR_WIDTH, 24);

const spacingKeys: readonly SpacingKey[] = ["D1", "D2", "D3", "D4", "D5", "BF"];
const toDegrees = 180 / Math.PI;

export function zoomPose(request: number) {
  const requestedFocalLength = Math.max(ZOOM_MINIMUM, Math.min(ZOOM_MAXIMUM, request));
  const anchor = ZOOM_ANCHORS.find((item) => item.focalLength === requestedFocalLength);
  const rightIndex = Math.max(1, ZOOM_ANCHORS.findIndex((item) => item.focalLength >= requestedFocalLength));
  const left = ZOOM_ANCHORS[rightIndex - 1];
  const right = ZOOM_ANCHORS[rightIndex];
  const fraction = (requestedFocalLength - left.focalLength) / (right.focalLength - left.focalLength);
  const interpolate = (a: number, b: number) => a + (b - a) * fraction;
  const spacing = { ...left.spacing };
  for (const key of spacingKeys) spacing[key] = interpolate(left.spacing[key], right.spacing[key]);

  const surfaces = locateSurfaces(anchor?.spacing ?? spacing);
  const measurement = measureParaxial(surfaces);
  const fullApertureFNumber = anchor?.fNumber ?? interpolate(left.fNumber, right.fNumber);
  const preStop = surfaces.slice(0, STOP);
  const entranceFactor = traceParaxial(preStop, 1, 0).y;
  const entranceRadius = measurement.focalLength / (2 * fullApertureFNumber);

  return {
    anchor,
    surfaces,
    fullApertureFNumber,
    entranceRadius,
    entranceFactor,
    maxStopRadius: Math.abs(entranceFactor * entranceRadius),
    fieldAngle: (anchor?.halfAngle ?? interpolate(left.halfAngle, right.halfAngle)) * 0.24,
    diagonalAngle: 2 * Math.atan(SENSOR_DIAGONAL / (2 * measurement.focalLength)) * toDegrees,
    ...measurement,
  };
}

export function apertureForStops(pose: ReturnType<typeof zoomPose>, stops: number) {
  const scale = 2 ** (stops / 2);
  return {
    fNumber: pose.fullApertureFNumber * scale,
    radius: pose.maxStopRadius / scale,
  };
}
