import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = ["", "work/", "work/fenergo/", "work/vesta/", "work/oddlings/", "work/savetheplanet/", "experience/", "about/", "contact/", "lab/", "writing/", "writing/hybrid-workflow-cli-mcp-agents/", "writing/software-engineering-in-the-age-of-ai/", "updates/", "updates/aws-ml-specialty-and-current-ai-focus/", "updates/fenergo-ai-initiative/", "updates/first-months-at-fenergo/"];

function trackErrors(page) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("requestfailed", (r) => errors.push(`failed: ${r.url()}`));
  page.on("response", (r) => r.status() >= 400 && errors.push(`${r.status()}: ${r.url()}`));
  return errors;
}

for (const path of PAGES) {
  test(`/${path} loads cleanly, has no horizontal overflow and passes axe`, async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    // Reveal everything so axe evaluates final colours, not mid-animation ones.
    await page.evaluate(() => document.querySelectorAll("[data-reveal],[data-split]").forEach((el) => el.classList.add("is-in")));
    await page.waitForTimeout(1300);
    const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
  });
}

test("homepage communicates identity and puts work and CV above the fold", async ({ page }) => {
  await page.goto("");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("MARCO LADEIRA");
  await expect(page.getByText("Associate Software Engineer at Fenergo")).toBeVisible();
  for (const name of ["See the work", "Download CV"]) await expect(page.getByRole("link", { name }).first()).toBeInViewport();
  await expect(page.locator('a[href^="mailto:"]').first()).toHaveAttribute("href", "mailto:marcoladeirawork@gmail.com");
});

test("the portfolio uses a text wordmark and puts Fenergo before the products", async ({ page }) => {
  await page.goto("");
  await expect(page.locator(".brand")).toHaveText("MARCO LADEIRA");
  await expect(page.locator(".brand svg")).toHaveCount(0);
  const main = page.locator("main");
  const cases = main.locator('a[href*="/work/"]:not([href$="/work/"])');
  await expect(cases.first()).toContainText("Fenergo");
  await expect(main.locator("[data-schematic]")).toHaveCount(0);
});

test("theme toggle switches and persists across navigation", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("");
  await page.locator("[data-theme-toggle]").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.goto("about/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("[data-theme-toggle]")).toHaveAttribute("aria-label", "Switch to light theme");
});

test("mobile menu opens, traps nothing, and closes with Escape", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Desktop shows the full navigation");
  await page.goto("");
  const toggle = page.locator("[data-nav-toggle]");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Experience", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Experience", exact: true }).click();
  await expect(page).toHaveURL(/experience\/$/);
});

test("CV downloads as a PDF from the header and the legacy URL", async ({ page, request }) => {
  await page.goto("");
  const href = await page.locator(".nav__cv a").getAttribute("href");
  for (const url of [href, "/MarcoLadeiraWebsite/assets/cv.pdf"]) {
    const res = await request.get(url);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("pdf");
  }
});

test("legacy URLs keep working", async ({ page }) => {
  await page.goto("now/");
  await expect(page).toHaveURL(/about\/#now$/);
  await page.goto("updates/portfolio-redesign-march-2026/");
  await expect(page).toHaveURL(/writing\/$/);
  const res = await page.goto("this-does-not-exist/");
  expect(res.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("here any more");
});

test("back and forward navigation restore pages", async ({ page }) => {
  await page.goto("");
  await page.locator('a[href$="work/vesta/"]').first().click();
  await expect(page).toHaveURL(/work\/vesta\/$/);
  await page.goBack();
  await expect(page).toHaveURL(/MarcoLadeiraWebsite\/$/);
  await page.goForward();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Vesta");
});

test("Capacity Lab recomputes live and reacts to failures", async ({ page }) => {
  await page.goto("lab/");
  const peak = page.locator('[data-out="peakRps"]');
  await expect(peak).toHaveText("83k");
  const workload = page.locator("[data-lab-workload]");
  if ((await workload.getAttribute("open")) === null) await workload.locator("summary").click();
  await page.locator("#preset").selectOption("small-saas");
  await expect(peak).not.toHaveText("83k");
  await page.locator("#preset").selectOption("social-feed");
  await page.getByLabel("Cache goes cold").check();
  await expect(page.locator("[data-lab-verdict]")).toContainText("past 100%");
  await expect(page.locator('tr[data-tier="replica"]')).toHaveAttribute("data-level", "over");
  await page.getByLabel("Database primary fails over").check();
  await expect(page.locator("[data-lab-verdict]")).toContainText("failover");
  await page.locator("#dau").fill("");
  await expect(page.locator("[data-lab-error]")).toBeVisible();
});

test("keyboard users can skip to content and reach the case-study contents", async ({ page, isMobile, browserName }) => {
  await page.goto("work/oddlings/");
  // The iPhone WebKit preset skips links with Tab. Check activation with the link focused.
  if (browserName === "webkit") await page.locator(".skip").focus();
  else await page.keyboard.press("Tab");
  await expect(page.locator(".skip")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  if (!isMobile) await expect(page.getByRole("navigation", { name: "On this page" })).toBeVisible();
});

test("content is visible immediately with reduced motion and without JavaScript", async ({ browser }) => {
  const reduced = await browser.newContext({ reducedMotion: "reduce" });
  const p1 = await reduced.newPage();
  await p1.goto("http://localhost:4173/MarcoLadeiraWebsite/work/");
  await expect(p1.locator(".feature").first()).toHaveCSS("opacity", "1");
  await reduced.close();
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  const p2 = await nojs.newPage();
  await p2.goto("http://localhost:4173/MarcoLadeiraWebsite/");
  await expect(p2.locator(".feature").first()).toHaveCSS("opacity", "1");
  await expect(p2.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Experience", exact: true })).toBeVisible();
  await nojs.close();
});

test("no page overflows horizontally at 320px", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 320, height: 640 } });
  const page = await ctx.newPage();
  for (const path of PAGES) {
    await page.goto(`http://localhost:4173/MarcoLadeiraWebsite/${path}`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
  await ctx.close();
});

test("Oddlings rules demo: a correct swap is confirmed by the checker", async ({ page }) => {
  await page.goto("work/oddlings/");
  const demo = page.locator("[data-verifier]");
  await expect(demo).toBeVisible();
  await page.locator("[data-vf-hint]").click();
  const hinted = page.locator(".vf-cell.is-hint");
  await expect(hinted).toHaveCount(2);
  await hinted.nth(0).click();
  await hinted.nth(1).click();
  await expect(page.locator("[data-vf-out]")).toContainText("Fixed");
  await expect(page.locator("[data-vf-next]")).toBeFocused();
  await expect(page.locator("[data-vf-hint]")).toBeDisabled();
  await page.locator("[data-vf-next]").click();
  await expect(page.locator("[data-vf-out]")).toContainText("Checker:");
  await expect(page.locator(".vf-cell").first()).toBeFocused();
});

test("dark theme passes axe on every page", async ({ browser }) => {
  const ctx = await browser.newContext({ colorScheme: "dark" });
  const page = await ctx.newPage();
  for (const path of PAGES) {
    await page.goto(`http://localhost:4173/MarcoLadeiraWebsite/${path}`);
    await page.evaluate(() => document.querySelectorAll("[data-reveal],[data-split]").forEach((el) => el.classList.add("is-in")));
    await page.waitForTimeout(700);
    const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(axe.violations.map((v) => `${path} ${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
  }
  await ctx.close();
});
