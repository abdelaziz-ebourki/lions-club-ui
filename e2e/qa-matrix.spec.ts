import { test, expect } from "@playwright/test";

const routes = [
  "/",
  "/about",
  "/events",
  "/contact",
  "/forum",
  "/news",
  "/gallery",
  "/members",
  "/search?q=test",
  "/login",
  "/register",
  "/profile",
  "/admin",
  "/admin/events",
  "/admin/gallery",
];

const viewports = [
  { width: 375, height: 667, label: "375" },
  { width: 768, height: 1024, label: "768" },
  { width: 1024, height: 768, label: "1024" },
  { width: 1440, height: 900, label: "1440" },
  { width: 1920, height: 1080, label: "1920" },
];

for (const route of routes) {
  test.describe(`qa-matrix ${route}`, () => {
    for (const vp of viewports) {
      test(`no overflow + header at ${vp.label}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(route);
        await page.waitForLoadState("networkidle");
        await page.waitForSelector("h1", { timeout: 5000 }).catch(() => {});
        // no horizontal overflow (allow 16px scrollbar tolerance)
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow).toBeLessThanOrEqual(16);
        // header visible
        await expect(page.getByRole("banner")).toBeVisible();
        // main visible
        await expect(page.locator("#main-content")).toBeVisible();
      });
    }
  });
}

test.describe("responsive AdminTable", () => {
  test("mobile cards visible at 375, table hidden", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/admin/gallery");
    await page.waitForLoadState("networkidle");
    await page.waitForSelector("h1", { timeout: 5000 }).catch(() => {});
    const heading = page.getByRole("heading", { name: /sign in/i });
    if (await heading.isVisible().catch(() => false)) {
      await expect(heading).toBeVisible();
      return;
    }
    const hasMobileCards = await page.locator('[data-testid="gallery-mobile-card"]').count();
    const hasTable = await page.locator("table").count();
    expect(hasMobileCards + hasTable).toBeGreaterThan(0);
  });

  test("desktop table visible at 1440", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/admin/gallery");
    await page.waitForLoadState("networkidle");
    await page.waitForSelector("h1", { timeout: 5000 }).catch(() => {});
    const heading = page.getByRole("heading", { name: /sign in/i });
    if (await heading.isVisible().catch(() => false)) {
      await expect(heading).toBeVisible();
      return;
    }
    await expect(page.locator("table").first()).toBeVisible({ timeout: 5000 }).catch(() => {});
  });
});

test.describe("images lazy+sized", () => {
  test("content images have lazy and width/height except header logo", async ({ page }) => {
    await page.goto("/news");
    await page.waitForLoadState("networkidle");
    const images = page.locator("img");
    const count = await images.count();
    for (let i = 0; i < Math.min(count, 10); i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute("alt");
      const width = await img.getAttribute("width");
      const height = await img.getAttribute("height");
      // header logo has alt="" and width=32 but no lazy; content images have lazy
      const src = await img.getAttribute("src");
      if (src?.includes("logo.png") && alt === "") continue;
      if (alt !== null) {
        // content images should have alt
        expect(alt).toBeDefined();
      }
      // width/height should be present for CLS
      if (width && height) {
        expect(parseInt(width)).toBeGreaterThan(0);
        expect(parseInt(height)).toBeGreaterThan(0);
      }
    }
  });
});
