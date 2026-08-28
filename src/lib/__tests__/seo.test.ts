import { describe, test, expect, beforeEach, vi } from "vitest";
import { getCanonicalUrl, truncateDescription } from "@/lib/seo";

describe("seo helpers", () => {
  describe("truncateDescription", () => {
    test("returns original if under 160 chars", () => {
      const text = "Short description";
      expect(truncateDescription(text)).toBe(text);
    });

    test("truncates to 160 chars", () => {
      const long = "a".repeat(200);
      expect(truncateDescription(long)).toHaveLength(160);
      expect(truncateDescription(long)).toBe("a".repeat(160));
    });

    test("trims whitespace after truncation", () => {
      const long = "a".repeat(159) + "  b  ";
      expect(truncateDescription(long)).toBe("a".repeat(159));
    });

    test("handles undefined / empty", () => {
      expect(truncateDescription("")).toBe("");
      expect(truncateDescription(undefined as unknown as string)).toBe("");
    });
  });

  describe("getCanonicalUrl", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    test("returns origin + pathname", () => {
      Object.defineProperty(window, "location", {
        value: new URL("https://example.com/about"),
        writable: true,
      });
      expect(getCanonicalUrl()).toBe("https://example.com/about");
    });

    test("strips tracking params (utm_*, fbclid, gclid, ref)", () => {
      Object.defineProperty(window, "location", {
        value: new URL("https://example.com/events?utm_source=google&utm_medium=cpc&fbclid=123&gclid=abc&ref=share&utm_campaign=test"),
        writable: true,
      });
      expect(getCanonicalUrl()).toBe("https://example.com/events");
    });

    test("preserves meaningful params like q for search", () => {
      Object.defineProperty(window, "location", {
        value: new URL("https://example.com/search?q=test&utm_source=google"),
        writable: true,
      });
      expect(getCanonicalUrl()).toBe("https://example.com/search?q=test");
    });

    test("preserves multiple meaningful params excluding tracking", () => {
      Object.defineProperty(window, "location", {
        value: new URL("https://example.com/search?q=test&page=2&utm_campaign=hi"),
        writable: true,
      });
      const url = getCanonicalUrl();
      expect(url).toContain("q=test");
      expect(url).toContain("page=2");
      expect(url).not.toContain("utm_campaign");
    });

    test("handles location without origin (jsdom) gracefully", () => {
      Object.defineProperty(window, "location", {
        value: new URL("http://localhost:5173/contact"),
        writable: true,
      });
      expect(getCanonicalUrl()).toBe("http://localhost:5173/contact");
    });
  });
});
