import { describe, expect, it } from "vitest";
import { LENSES } from "./elements";
import { surfaceSag, surfaceSlope } from "./model";
import { STOP, ZOOM_ANCHORS } from "./prescription";
import { measureSpot, traceInfinityBundle, traceRay } from "./rays";
import { apertureForStops, zoomPose, ZOOM_MAXIMUM, ZOOM_MINIMUM } from "./zoom";

function bundle(pose: ReturnType<typeof zoomPose>, degrees: number, stops: number) {
  return traceInfinityBundle(
    pose.surfaces,
    degrees,
    pose.entranceRadius,
    pose.entranceFactor,
    apertureForStops(pose, stops).radius,
  );
}

describe("sequential geometric ray tracing", () => {
  it.each(ZOOM_ANCHORS)("traces axis and field rays at $id and clips monotonically at the stop", (anchor) => {
    const pose = zoomPose(anchor.focalLength);
    const open = bundle(pose, 0, 0);
    const closed = bundle(pose, 0, 3);
    const openSpot = measureSpot(open);
    const closedSpot = measureSpot(closed);
    const offAxis = measureSpot(bundle(pose, pose.fieldAngle, 0));

    expect(openSpot.hits.length).toBeGreaterThan(30);
    expect(closedSpot.hits.length).toBeGreaterThan(10);
    expect(closedSpot.hits.length).toBeLessThan(openSpot.hits.length);
    expect(closed.filter((ray) => ray.end === "stop").length)
      .toBeGreaterThan(open.filter((ray) => ray.end === "stop").length);
    expect(openSpot.centroid).toBeCloseTo(0, 8);
    expect(offAxis.hits.length).toBeGreaterThan(15);
    expect(Math.abs(offAxis.centroid!)).toBeGreaterThan(1);
    expect(open.some((ray) => ray.end === "miss")).toBe(false);

    const chief = traceRay(pose.surfaces, { z: pose.surfaces[0].z - 12, y: 0 }, 0, pose.maxStopRadius);
    expect(chief.end).toBe("sensor");
    expect(chief.path).toHaveLength(37);
    expect(chief.path[36]).toEqual({ z: 0, y: 0 });
    expect(open.some((ray) => ray.surfaceId === STOP)).toBe(true);
  });

  it("intersects actual aspheres and satisfies Snell's law across glass-to-glass interfaces", () => {
    const pose = zoomPose(ZOOM_MINIMUM);
    const ray = traceRay(pose.surfaces, { z: pose.surfaces[0].z - 12, y: 1 }, 0, pose.maxStopRadius);
    expect(ray.end).toBe("sensor");
    for (const surface of pose.surfaces) {
      const from = ray.path[surface.id - 1];
      const hit = ray.path[surface.id];
      const to = ray.path[surface.id + 1];
      expect(hit.z).toBeCloseTo(surface.z + surfaceSag(surface, hit.y), 6);
      const incoming = Math.atan2(hit.y - from.y, hit.z - from.z);
      const outgoing = Math.atan2(to.y - hit.y, to.z - hit.z);
      const normal = -Math.atan(surfaceSlope(surface, hit.y));
      expect(surface.indexBefore * Math.sin(incoming - normal))
        .toBeCloseTo(surface.indexAfter * Math.sin(outgoing - normal), 6);
    }
  });
});

describe("continuous zoom", () => {
  it("reproduces all four exact anchor positions and focal lengths", () => {
    for (const anchor of ZOOM_ANCHORS) {
      const pose = zoomPose(anchor.focalLength);
      expect(pose.anchor).toBe(anchor);
      expect(Math.abs(pose.focalLength - anchor.focalLength)).toBeLessThan(0.001);
      expect(Math.abs(pose.backFocus - anchor.spacing.BF)).toBeLessThan(0.001);
    }
  });

  it("keeps the linked groups in step and the paraxial focal length increasing over the interval", () => {
    const firstPose = zoomPose(ZOOM_MINIMUM);
    const initial = firstPose.surfaces;
    let last = firstPose;
    for (let i = 1; i <= 96; i += 1) {
      const pose = zoomPose(ZOOM_MINIMUM + (ZOOM_MAXIMUM - ZOOM_MINIMUM) * i / 96);
      const shift = pose.surfaces[15].z - initial[15].z;
      expect(pose.surfaces[14].z - initial[14].z).toBeCloseTo(shift, 4);
      expect(pose.surfaces[31].z - initial[31].z).toBeCloseTo(shift, 4);
      for (let index = 1; index < pose.surfaces.length; index += 1) {
        expect(pose.surfaces[index].z).toBeGreaterThan(pose.surfaces[index - 1].z);
      }
      expect(pose.focalLength).toBeGreaterThan(last.focalLength);
      expect(pose.diagonalAngle).toBeLessThan(last.diagonalAngle);
      expect(pose.maxStopRadius).toBeGreaterThan(0);
      last = pose;
    }
  });

  it("keeps sampled glass profiles separated and both bundles valid between anchors", () => {
    for (let sample = 0; sample <= 12; sample += 1) {
      const pose = zoomPose(ZOOM_MINIMUM + (ZOOM_MAXIMUM - ZOOM_MINIMUM) * sample / 12);
      for (let index = 1; index < LENSES.length; index += 1) {
        const previous = LENSES[index - 1];
        const next = LENSES[index];
        if (previous.back === next.front) continue;
        const back = pose.surfaces[previous.back - 1];
        const front = pose.surfaces[next.front - 1];
        const commonRim = Math.min(previous.drawRadius, next.drawRadius);
        for (let level = 0; level <= 8; level += 1) {
          const h = commonRim * level / 8;
          expect(front.z + surfaceSag(front, h)).toBeGreaterThan(back.z + surfaceSag(back, h));
        }
      }

      for (const angle of [0, pose.fieldAngle]) {
        const open = bundle(pose, angle, 0);
        const stoppedDown = bundle(pose, angle, 4);
        expect(open.every((ray) => ray.end !== "miss")).toBe(true);
        expect(measureSpot(open).hits.length).toBeGreaterThan(30);
        expect(measureSpot(stoppedDown).hits.length).toBeGreaterThan(5);
        expect(measureSpot(stoppedDown).hits.length).toBeLessThan(measureSpot(open).hits.length);
      }
    }
  });
});
