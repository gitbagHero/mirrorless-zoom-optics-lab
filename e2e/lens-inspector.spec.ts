import { expect, test } from "@playwright/test";

test("selects all nineteen elements and shows prescription and group details", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { name: "变焦镜头光学实验台" })).toBeVisible();
  await expect(page.getByLabel("处方复算焦距")).toContainText("24.72");
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
  const edLens = page.locator('[data-lens="E02"]');
  await expect(edLens).toBeVisible();
  await edLens.scrollIntoViewIfNeeded();
  const edCenter = await edLens.boundingBox();
  if (!edCenter) throw new Error("Expected a visible E02 path");
  await page.mouse.click(edCenter.x + edCenter.width / 2, edCenter.y + edCenter.height / 2);
  await expect(inspector.getByRole("heading", { name: "E02 正双凸" })).toBeVisible();
});

test("contains the horizontal scroll to the diagram on a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  const diagram = page.getByLabel("镜头剖面，可横向滚动");
  await expect(diagram).toBeVisible();
  expect(await diagram.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.getByRole("button", { name: "选择镜片 E19" }).click();
  await expect(page.getByRole("heading", { name: "E19 正双凸" })).toBeVisible();
});

test("updates the optical result on zoom, field and aperture changes", async ({ page }) => {
  await page.goto("./");
  const view = page.getByLabel("处方复算焦距");
  const spot = page.getByRole("region", { name: "像面光斑" });
  const testChart = page.getByRole("region", { name: "教学测试图" });
  const motion = page.getByRole("region", { name: "镜组位移" });
  const hits = () => spot.locator("dd").first();
  const zoomSlider = page.getByRole("slider", { name: "变焦" });

  await expect(view).toContainText("24.72");
  const initialHits = await hits().innerText();
  await page.getByRole("slider", { name: "光圈" }).press("End");
  expect(parseInt(await hits().innerText())).toBeLessThan(parseInt(initialHits));

  await page.getByRole("button", { name: "194 mm", exact: true }).click();
  await expect(view).toContainText("194.00");
  await expect(page.getByText("专利档位 T", { exact: false })).toBeVisible();
  await expect(testChart.getByText("取景倍率 7.85×", { exact: false })).toBeVisible();
  await expect(motion.getByRole("button", { name: "查看 G1 镜组" })).toContainText("62.38");
  await motion.getByRole("button", { name: "查看 G1 镜组" }).click();
  await expect(page.getByRole("heading", { name: /^E01 / })).toBeVisible();

  await zoomSlider.press("ArrowLeft");
  await expect(page.getByText("连续变焦 · 插值位置", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "离轴", exact: true }).click();
  await expect(page.getByRole("button", { name: "离轴", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(spot.locator(".spot-hit--off-axis").first()).toBeVisible();
});

test("moves the focus doublet manually and runs both autofocus methods", async ({ page }) => {
  await page.goto("./");
  const focus = page.getByRole("region", { name: "对焦实验" });
  const offset = focus.getByLabel("对焦双片位移");
  const status = focus.getByLabel("自动对焦状态");
  const focusSlider = focus.getByRole("slider", { name: "对焦双片 E16/E17" });
  await focus.getByRole("button", { name: "近景", exact: true }).click();
  await expect(page.getByText("近轴焦点在像面后")).toBeVisible();
  await focusSlider.press("Home");
  await expect(offset).toHaveText("-1.000 mm");
  await focusSlider.press("End");
  await expect(offset).toHaveText("0.805 mm");
  await expect(page.getByText("近轴焦点在像面前")).toBeVisible();

  await focus.getByRole("button", { name: "AF 相位" }).click();
  await focus.getByRole("button", { name: "启动自动对焦" }).click();
  await expect(status).toHaveText("已合焦");
  await expect(focus.getByText("向物方移动")).toBeVisible();
  await expect(page.getByText("负半瞳", { exact: true })).toBeVisible();

  await focus.getByRole("button", { name: "AF 对比度" }).click();
  await focus.getByRole("button", { name: "中景", exact: true }).click();
  await focus.getByRole("button", { name: "启动自动对焦" }).click();
  await expect(status).toHaveText("已合焦");
  await expect(focus.getByText("停在最高评分位置")).toBeVisible();
  await focus.getByRole("slider", { name: "主体距离" }).press("Home");
  await expect(status).toHaveText("超出可对焦范围");
});
