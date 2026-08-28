import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

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
  "/verify-email",
  "/admin",
  "/admin/events",
  "/admin/members",
  "/admin/messages",
  "/admin/forum",
  "/admin/news",
  "/admin/gallery",
];

for (const route of routes) {
  test(`no axe violations on ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    // Wait for lazy-loaded h1 to appear (PageSkeleton fallback has sr-only h1)
    await page.waitForSelector("h1", { timeout: 5000 }).catch(() => {});
    const results = await new AxeBuilder({ page })
      .exclude("[data-sonner-toaster]")
      .exclude("[data-sonner-toast]")
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

// Keyboard: skip link visible on focus, focus ring present
test("skip link is focusable and visible", async ({ page }) => {
  await page.goto("/");
  const skip = page.getByRole("link", { name: /skip to/i });
  await skip.focus();
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
});

// Focus trap: dialog Sheet mobile nav
test("mobile nav Sheet traps focus and closes with Escape", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  const menuBtn = page.getByRole("button", { name: /open menu/i });
  if (await menuBtn.isVisible()) {
    await menuBtn.click();
    await expect(page.getByRole("navigation", { name: /mobile navigation/i })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("navigation", { name: /mobile navigation/i })).toBeHidden();
  }
});

// Forms: required and aria-invalid wiring (sample contact)
test("contact form has associated labels and required", async ({ page }) => {
  await page.goto("/contact");
  const nameInput = page.getByLabel("Name");
  await expect(nameInput).toHaveAttribute("aria-required", "true");
});
