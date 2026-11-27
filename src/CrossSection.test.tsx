import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { CrossSection } from "./CrossSection";
import { locateSurfaces } from "./optics/model";
import { ZOOM_ANCHORS } from "./optics/prescription";

it("renders one finite SVG path for each element and marks the selected one", () => {
  const markup = renderToStaticMarkup(
    <CrossSection surfaces={locateSurfaces(ZOOM_ANCHORS[0].spacing)} selectedId="E15" onSelect={() => {}} />,
  );
  const paths = markup.match(/<path[^>]+data-lens="E\d{2}"[^>]*>/g);
  expect(paths).toHaveLength(19);
  expect(paths?.find((path) => path.includes('data-lens="E15"'))).toContain("glass--selected");
  expect(paths?.filter((path) => path.includes("glass--selected"))).toHaveLength(1);
  expect(markup).not.toMatch(/NaN|Infinity/);
});
