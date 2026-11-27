import { expect, test } from "@playwright/test";

test("selects all nineteen elements and shows prescription and group details", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "变焦镜头光学实验台" })).toBeVisible();
  await expect(page.getByText("24.72", { exact: false })).toBeVisible();
  const inspector = page.getByRole("complementary", { name: "选中镜片详情" });
  await expect(inspector.getByRole("heading", { name: "E15 正双凸" })).toBeVisible();

  const buttons = page.getByRole("button", { name: /^选择镜片 E/ });
  await expect(buttons).toHaveCount(19);
  for (let index = 0; index < 19; index += 1) {
    const id = `E${String(index + 1).padStart(2, "0")}`;
    await buttons.nth(index).click();
    await expect(buttons.nth(index)).toHaveAttribute("aria-pressed", "true");
    await expect(inspector.getByRole("heading", { name: new RegExp(`^${id} `) })).toBeVisible();
  }

  const focusLens = page.getByRole("button", { name: "选择镜片 E17" });
  await focusLens.focus();
  await page.keyboard.press("Enter");
  await expect(inspector.getByText("对焦子组", { exact: true })).toBeVisible();
  await expect(inspector.getByText("31 号面", { exact: true })).toBeVisible();
  await inspector.getByRole("button", { name: "E16", exact: true }).click();
  await expect(inspector.getByRole("heading", { name: /^E16 / })).toBeVisible();
  await expect(page.locator('[data-lens="E02"]')).toBeVisible();
  const edCenter = await page.locator('[data-lens="E02"]').boundingBox();
  if (!edCenter) throw new Error("Expected a visible E02 path");
  await page.mouse.click(edCenter.x + edCenter.width / 2, edCenter.y + edCenter.height / 2);
  await expect(inspector.getByRole("heading", { name: "E02 正双凸" })).toBeVisible();
});

test("contains the horizontal scroll to the diagram on a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const diagram = page.getByLabel("镜头剖面，可横向滚动");
  await expect(diagram).toBeVisible();
  expect(await diagram.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.getByRole("button", { name: "选择镜片 E19" }).click();
  await expect(page.getByRole("heading", { name: "E19 正双凸" })).toBeVisible();
});
