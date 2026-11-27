import { expect, test } from "@playwright/test";

test("opens all four teaching scenes, exits the guide, and resets the workbench", async ({ page }) => {
  await page.goto("./");
  const guide = page.getByRole("region", { name: "实验引导" });
  const focus = page.getByRole("region", { name: "对焦实验" });
  const group = guide.getByRole("group", { name: "四个教学实验" });
  const stages = ["折射成像", "变焦与镜组", "手动对焦", "自动对焦"];
  await expect(group.getByRole("button")).toHaveCount(4);
  await expect(guide.getByRole("button", { name: "跳过引导" })).toHaveCount(0);
  await group.getByRole("button", { name: stages[0] }).click();
  for (const [index, title] of stages.entries()) {
    await expect(guide.getByRole("heading", { name: title })).toBeVisible();
    await expect(group.getByRole("button", { name: title })).toHaveAttribute("aria-pressed", "true");
    if (index === 2) {
      await expect(focus.getByRole("slider", { name: "主体距离" })).toHaveAttribute("aria-valuetext", "1.00 m");
      await expect(focus.getByRole("button", { name: "MF 手动" })).toHaveAttribute("aria-pressed", "true");
    }
    if (index === 3) await expect(focus.getByRole("button", { name: "AF 相位" })).toHaveAttribute("aria-pressed", "true");
    if (index < stages.length - 1) await guide.getByRole("button", { name: "下一项实验" }).click();
  }
  await guide.getByRole("button", { name: "跳过引导" }).click();
  await expect(guide.getByRole("heading", { name: "自动对焦" })).toHaveCount(0);
  await expect(focus.getByRole("button", { name: "AF 相位" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "194 mm", exact: true }).click();
  await guide.getByRole("button", { name: "重置实验台" }).click();
  await expect(page.getByLabel("处方复算焦距")).toContainText("24.72");
  await expect(focus.getByRole("slider", { name: "主体距离" })).toHaveAttribute("aria-valuetext", "无穷远");
  await expect(focus.getByLabel("对焦双片位移")).toHaveText("0.000 mm");
  await expect(focus.getByRole("button", { name: "MF 手动" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "选择镜片 E15" })).toHaveAttribute("aria-pressed", "true");
});

test("explores stabilization and its physical doublet on a landscape tablet", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("./");
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
  await page.getByRole("button", { name: "重置实验台" }).click();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expect(spot).toHaveAttribute("cy", "87");
});
