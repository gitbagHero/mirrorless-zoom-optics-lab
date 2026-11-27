import { expect, test } from "@playwright/test";

test("opens all four teaching scenes, exits the guide, and resets the workbench", async ({ page }) => {
  await page.goto("./#guide");
  const menu = page.getByRole("navigation", { name: "模块菜单" });
  const guide = page.getByRole("region", { name: "实验引导" });
  const focus = page.getByRole("region", { name: "对焦实验" });
  const group = guide.getByRole("group", { name: "四个教学实验" });
  const stages = ["折射成像", "变焦与镜组", "手动对焦", "自动对焦"];
  const destinations = ["#diagram", "#zoom", "#focus", "#focus"];
  await expect(group.getByRole("button")).toHaveCount(4);
  await expect(guide.getByRole("button", { name: "跳过引导" })).toHaveCount(0);
  await group.getByRole("button", { name: stages[0] }).click();
  for (const [index, title] of stages.entries()) {
    await expect(guide.getByRole("heading", { name: title })).toBeVisible();
    await expect(group.getByRole("button", { name: title })).toHaveAttribute("aria-pressed", "true");
    await guide.getByRole("link", { name: "打开对应实验" }).click();
    await expect(page).toHaveURL(new RegExp(`${destinations[index]}$`));
    await expect(guide).toHaveCount(0);
    if (index === 0) await expect(page.getByRole("button", { name: "选择镜片 E15" })).toHaveAttribute("aria-pressed", "true");
    if (index === 1) await expect(page.getByRole("region", { name: "镜组位移" })).toBeVisible();
    if (index === 2) {
      await expect(focus.getByRole("slider", { name: "主体距离" })).toHaveAttribute("aria-valuetext", "1.00 m");
      await expect(focus.getByRole("button", { name: "MF 手动" })).toHaveAttribute("aria-pressed", "true");
    }
    if (index === 3) await expect(focus.getByRole("button", { name: "AF 相位" })).toHaveAttribute("aria-pressed", "true");
    await menu.getByRole("link", { name: "实验引导" }).click();
    if (index < stages.length - 1) await guide.getByRole("button", { name: "下一项实验" }).click();
  }
  await guide.getByRole("button", { name: "跳过引导" }).click();
  await expect(guide.getByRole("heading", { name: "自动对焦" })).toHaveCount(0);
  await menu.getByRole("link", { name: "对焦实验" }).click();
  await expect(focus.getByRole("button", { name: "AF 相位" })).toHaveAttribute("aria-pressed", "true");
  await menu.getByRole("link", { name: "变焦与镜组" }).click();
  await page.getByRole("button", { name: "194 mm", exact: true }).click();
  await menu.getByRole("link", { name: "实验引导" }).click();
  await guide.getByRole("button", { name: "重置实验台" }).click();
  await menu.getByRole("link", { name: "对焦实验" }).click();
  await expect(page.getByLabel("处方复算焦距")).toContainText("24.72");
  await expect(focus.getByRole("slider", { name: "主体距离" })).toHaveAttribute("aria-valuetext", "无穷远");
  await expect(focus.getByLabel("对焦双片位移")).toHaveText("0.000 mm");
  await expect(focus.getByRole("button", { name: "MF 手动" })).toHaveAttribute("aria-pressed", "true");
  await menu.getByRole("link", { name: "镜头剖面与成像" }).click();
  await expect(page.getByRole("button", { name: "选择镜片 E15" })).toHaveAttribute("aria-pressed", "true");
});

test("explores stabilization and its physical doublet on a landscape tablet", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("./#vr");
  const menu = page.getByRole("navigation", { name: "模块菜单" });
  const vr = page.getByRole("region", { name: "镜头防抖 VR" });
  const spot = vr.locator(".vr-image-dot");
  const slider = vr.getByRole("slider", { name: "机身俯仰扰动" });
  const toggle = vr.getByRole("button", { name: "VR 补偿" });
  await expect(spot).toHaveAttribute("cy", "87");
  await slider.press("End");
  await expect(spot).toHaveAttribute("cy", "99");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(spot).toHaveAttribute("cy", "75");
  await expect(vr.locator(".vr-ghost-dot")).toHaveAttribute("cy", "99");
  await vr.getByRole("link", { name: "在主剖面查看 E09/E10" }).click();
  await expect(page.getByRole("button", { name: "选择镜片 E09" })).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1024);
  await menu.getByRole("link", { name: "镜头防抖" }).click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(slider).toHaveAttribute("aria-valuetext", "2.0 度");
  await menu.getByRole("link", { name: "实验引导" }).click();
  await page.getByRole("button", { name: "重置实验台" }).click();
  await menu.getByRole("link", { name: "镜头防抖" }).click();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expect(spot).toHaveAttribute("cy", "87");
});

test("shows one module at a time within a laptop viewport and supports module URLs", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("./");
  const menu = page.getByRole("navigation", { name: "模块菜单" });
  const current = menu.locator('[aria-current="page"]');
  const moduleRegions = ["实验引导", "成像控制", "变焦控制", "对焦实验", "镜头防抖 VR", "处方与模型边界"];
  const modules = ["实验引导", "镜头剖面与成像", "变焦与镜组", "对焦实验", "镜头防抖", "模型资料"];

  await expect(current).toHaveText("镜头剖面与成像");
  await expect(menu.getByRole("link")).toHaveCount(modules.length);
  for (const [index, label] of modules.entries()) {
    await menu.getByRole("link", { name: label, exact: true }).click();
    await expect(current).toHaveText(label);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(label);
    for (const [regionIndex, name] of moduleRegions.entries()) {
      if (index === regionIndex) await expect(page.getByRole("region", { name, exact: true })).toBeVisible();
      else await expect(page.getByRole("region", { name, exact: true })).toHaveCount(0);
    }
    if (index === 0) await page.getByRole("button", { name: "折射成像", exact: true }).click();
    if (index === 1) await page.getByRole("button", { name: "选择镜片 E17" }).click();
    if (index === 2) await page.getByRole("button", { name: "194 mm", exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1366);
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(768);
  }
  await page.goBack();
  await expect(current).toHaveText("镜头防抖");
  await page.goForward();
  await expect(current).toHaveText("模型资料");
  await page.reload();
  await expect(current).toHaveText("模型资料");
});
