import { describe, expect, it } from "vitest";
import {
  describeImageFocus, focusRange, imagePlaneOffset, moveFocusDoublet, solveAutofocus, SUBJECT_MIN, traceFocusScene,
} from "./focus";
import type { FocusScene } from "./focus";
import { ZOOM_ANCHORS } from "./prescription";
import { measureSpot } from "./rays";
import { apertureForStops, zoomPose, ZOOM_MAXIMUM, ZOOM_MINIMUM } from "./zoom";

function sceneFor(focalLength: number, distance: number, offAxis = false, stops = 0): FocusScene {
  const pose = zoomPose(focalLength);
  return {
    pose,
    subjectDistance: distance,
    incidentDegrees: offAxis ? pose.fieldAngle : 0,
    apertureRadius: apertureForStops(pose, stops).radius,
  };
}

describe("internal focusing", () => {
  it.each(ZOOM_ANCHORS)("reproduces $id near focus with only faces 29–31 translating", (anchor) => {
    const pose = zoomPose(anchor.focalLength);
    const offset = focusRange(pose).max;
    const moved = moveFocusDoublet(pose.surfaces, offset);
    const distanceFromImage = anchor.near.D0 - pose.surfaces[0].z;
    expect(Math.abs(imagePlaneOffset(moved, distanceFromImage))).toBeLessThan(0.001);
    expect(moved.filter((surface, index) => surface.z !== pose.surfaces[index].z)
      .map((surface) => surface.id)).toEqual([29, 30, 31]);
    expect(moved[30].z - moved[28].z).toBeCloseTo(pose.surfaces[30].z - pose.surfaces[28].z, 10);
  });

  it("passes through focus when the ring crosses the near subject's correct setting", () => {
    const scene = sceneFor(ZOOM_MINIMUM, 1000);
    const start = scene.pose.surfaces;
    const nearFocus = moveFocusDoublet(start, 0.34);
    const pastFocus = moveFocusDoublet(start, focusRange(scene.pose).max);
    expect(describeImageFocus(imagePlaneOffset(start, scene.subjectDistance))).toContain("像面后");
    expect(describeImageFocus(imagePlaneOffset(nearFocus, scene.subjectDistance))).toBe("接近合焦");
    expect(describeImageFocus(imagePlaneOffset(pastFocus, scene.subjectDistance))).toContain("像面前");

    const rms = (surfaces: typeof start) => measureSpot(traceFocusScene(scene, surfaces)).rms!;
    expect(rms(nearFocus)).toBeLessThan(rms(start) / 10);
    expect(rms(nearFocus)).toBeLessThan(rms(pastFocus) / 10);
  });
});

describe("autofocus demonstrations", () => {
  it.each([ZOOM_MINIMUM, ZOOM_MAXIMUM])("converges from both sides at focal anchor %s", (focalLength) => {
    const scene = sceneFor(focalLength, 1000);
    const limits = focusRange(scene.pose);
    for (const mode of ["phase", "contrast"] as const) {
      const objectSideStart = solveAutofocus(scene, mode, limits.min);
      const imageSideStart = solveAutofocus(scene, mode, limits.max);
      const first = objectSideStart.steps.at(-1)!;
      const second = imageSideStart.steps.at(-1)!;
      expect(objectSideStart.outcome).toBe("locked");
      expect(imageSideStart.outcome).toBe("locked");
      expect(objectSideStart.direction).toBe("towardImage");
      expect(imageSideStart.direction).toBe("towardObject");
      expect(Math.abs(first.offset - second.offset)).toBeLessThan(0.04);
      expect(first.rms!).toBeLessThan(objectSideStart.steps[0].rms! / 5);
      expect(second.rms!).toBeLessThan(imageSideStart.steps[0].rms! / 5);
      if (mode === "phase") expect(Math.abs(second.phaseGap!)).toBeLessThanOrEqual(0.004);
      else expect(second.contrast!).toBeGreaterThan(imageSideStart.steps[0].contrast!);
    }
  });

  it.each([ZOOM_MINIMUM, ZOOM_MAXIMUM])("reports an out-of-travel subject at focal anchor %s", (focalLength) => {
    const scene = sceneFor(focalLength, SUBJECT_MIN);
    for (const mode of ["phase", "contrast"] as const) {
      const solution = solveAutofocus(scene, mode, 0);
      expect(solution.outcome).toBe("limited");
      expect(solution.steps.at(-1)!.offset).toBeCloseTo(focusRange(scene.pose).max, 6);
    }
  });

  it("reacquires an off-axis subject during continuous zoom with a stopped-down aperture", () => {
    const scene = sceneFor(35, 3000, true, 3);
    for (const mode of ["phase", "contrast"] as const) {
      const solution = solveAutofocus(scene, mode, 0);
      expect(solution.outcome).toBe("locked");
      expect(solution.steps.at(-1)!.offset).toBeLessThan(0);
      expect(solution.steps.at(-1)!.rms!).toBeLessThan(0.005);
    }
  });
});
