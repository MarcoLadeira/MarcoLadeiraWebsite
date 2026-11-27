import { defineConfig, devices } from "@playwright/test";

// Chromium by default (uses a local Chrome when CHROME_PATH is set, e.g. in sandboxes
// without Playwright's browser downloads). ALL_BROWSERS=1 adds Firefox and WebKit.
const chrome = process.env.CHROME_PATH ? { launchOptions: { executablePath: process.env.CHROME_PATH } } : {};
const projects = [
  { name: "chromium-desktop", use: { ...devices["Desktop Chrome"], ...chrome } },
  { name: "chromium-mobile", use: { ...devices["Pixel 7"], ...chrome } },
];
if (process.env.ALL_BROWSERS) {
  projects.push({ name: "firefox", use: devices["Desktop Firefox"] }, { name: "webkit-iphone", use: devices["iPhone 14"] });
}

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  reporter: [["list"]],
  use: { baseURL: "http://localhost:4173/MarcoLadeiraWebsite/", trace: "retain-on-failure" },
  webServer: { command: "node scripts/serve.mjs 4173", url: "http://localhost:4173/MarcoLadeiraWebsite/", reuseExistingServer: true },
  projects,
});
