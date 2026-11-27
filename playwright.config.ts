import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: "http://127.0.0.1:4267" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "system-chrome", use: { ...devices["Desktop Chrome"], channel: "chrome" } },
  ],
  webServer: {
    command: "npm exec -- vite preview --host 127.0.0.1 --port 4267 --strictPort",
    url: "http://127.0.0.1:4267",
  },
});
