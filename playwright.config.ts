import { defineConfig, devices } from "@playwright/test";

declare const process: { env: { PLAYWRIGHT_SITE_URL?: string } };

const localUrl = "http://127.0.0.1:4267/";
const publishedUrl = process.env.PLAYWRIGHT_SITE_URL;
const publishedSite = publishedUrl ? new URL(publishedUrl) : null;
if (
  publishedSite?.hostname === "gitbaghero.github.io"
  && /^\/mirrorless-zoom-optics-lab(?:\/|$)/.test(publishedSite.pathname)
) {
  throw new Error("PLAYWRIGHT_SITE_URL points to the existing lens lab, not the GPT release site.");
}

export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: publishedUrl ? `${publishedUrl.replace(/\/$/, "")}/` : localUrl },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "system-chrome", use: { ...devices["Desktop Chrome"], channel: "chrome" } },
  ],
  webServer: publishedUrl ? undefined : {
    command: "npm exec -- vite preview --host 127.0.0.1 --port 4267 --strictPort",
    url: localUrl,
  },
});
