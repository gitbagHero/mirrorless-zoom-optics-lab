import { describe, expect, it } from "vitest";
import { LENSES } from "./elements";
import { checkAnchor, locateSurfaces, surfaceSag } from "./model";
import { ASPHERES, STOP, SURFACES, ZOOM_ANCHORS } from "./prescription";

describe("WO2020157904A1 reference example 12", () => {
  it("preserves the glass interfaces and official diagram classification", () => {
    const surfaces = locateSurfaces(ZOOM_ANCHORS[0].spacing);
    expect(surfaces).toHaveLength(35);
    expect(surfaces.filter((surface) => surface.indexBefore !== surface.indexAfter)).toHaveLength(34);
    expect(surfaces.filter((surface) => surface.indexBefore > 1 && surface.indexAfter > 1)
      .map((surface) => surface.id)).toEqual([19, 24, 27, 30]);
    expect(surfaces[STOP - 1]).toMatchObject({ id: STOP, indexBefore: 1, indexAfter: 1, radius: Infinity });
    expect(Object.keys(ASPHERES)).toEqual(["28", "31", "33"]);
    expect(LENSES).toHaveLength(19);
    expect(LENSES.filter((lens) => lens.kind !== "standard").map((lens) => lens.id))
      .toEqual(["E02", "E03", "E15", "E17", "E18"]);
  });

  it.each(ZOOM_ANCHORS)("reproduces $id focal length, back focus and close focus", (anchor) => {
    const result = checkAnchor(anchor);
    expect(Math.abs(result.focalLength - anchor.focalLength)).toBeLessThan(0.001);
    expect(Math.abs(result.backFocus - anchor.spacing.BF)).toBeLessThan(0.001);
    expect(Math.abs(result.nearImageOffset)).toBeLessThan(0.001);
  });

  it("draws finite, ordered surfaces across the estimated rims at the wide anchor", () => {
    const surfaces = locateSurfaces(ZOOM_ANCHORS[0].spacing);
    for (const lens of LENSES) {
      const front = surfaces[lens.front - 1];
      const back = surfaces[lens.back - 1];
      expect(front.indexAfter).toBeGreaterThan(1);
      for (let sample = 0; sample <= 30; sample += 1) {
        const h = sample * lens.drawRadius / 30;
        expect(back.z + surfaceSag(back, h), lens.id).toBeGreaterThan(front.z + surfaceSag(front, h));
      }
    }
    for (let index = 1; index < LENSES.length; index += 1) {
      const prev = LENSES[index - 1];
      const next = LENSES[index];
      if (prev.back === next.front) {
        expect(prev.drawRadius).toBe(next.drawRadius);
        continue;
      }
      const back = surfaces[prev.back - 1];
      const front = surfaces[next.front - 1];
      const commonRim = Math.min(prev.drawRadius, next.drawRadius);
      for (let sample = 0; sample <= 30; sample += 1) {
        const h = sample * commonRim / 30;
        expect(front.z + surfaceSag(front, h), `${prev.id} / ${next.id}`)
          .toBeGreaterThan(back.z + surfaceSag(back, h));
      }
    }
    expect(surfaceSag(SURFACES[27], 0)).toBe(0);
  });
});
