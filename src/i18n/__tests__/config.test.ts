import { describe, test, expect } from "vitest";
import i18n, { supportedLngs } from "../config";

describe("i18n config", () => {
  test("supports en, fr, ar", () => {
    expect(supportedLngs).toEqual(["en", "fr", "ar"]);
  });

  test("initializes with fallback en", () => {
    expect(i18n.isInitialized).toBe(true);
    expect(i18n.language).toBeDefined();
  });

  test("has common namespace with site name", () => {
    expect(i18n.getResourceBundle("en", "common")).toHaveProperty("site.name", "Lions Club FSBM");
    expect(i18n.getResourceBundle("fr", "common")).toHaveProperty("site.name");
    expect(i18n.getResourceBundle("ar", "common")).toHaveProperty("site.name");
  });

  test("dir is rtl for ar and ltr for en/fr", () => {
    expect(i18n.dir("ar")).toBe("rtl");
    expect(i18n.dir("en")).toBe("ltr");
    expect(i18n.dir("fr")).toBe("ltr");
  });

  test("t translates nav.home", () => {
    expect(i18n.t("nav.home", { lng: "en" })).toBe("Home");
    expect(i18n.t("nav.home", { lng: "fr" })).toBe("Accueil");
    expect(i18n.t("nav.home", { lng: "ar" })).toBe("الرئيسية");
  });

  test("changes language and persists to localStorage and html attrs", async () => {
    await i18n.changeLanguage("fr");
    expect(i18n.language).toBe("fr");
    expect(document.documentElement.lang).toBe("fr");
    expect(document.documentElement.dir).toBe("ltr");
    expect(localStorage.getItem("i18nextLng")).toBe("fr");

    await i18n.changeLanguage("ar");
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
    expect(localStorage.getItem("i18nextLng")).toBe("ar");

    await i18n.changeLanguage("en");
  });
});
