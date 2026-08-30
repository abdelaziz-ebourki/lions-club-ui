import { describe, test, expect } from "vitest";
import { formatDate, formatNumber } from "../format";

describe("format", () => {
  test("formatDate en", () => {
    const d = "2024-01-15T12:00:00Z";
    const result = formatDate(d, "en");
    expect(result).toMatch(/January.*15.*2024/);
  });

  test("formatDate fr", () => {
    const d = "2024-01-15T12:00:00Z";
    const result = formatDate(d, "fr");
    expect(result).toMatch(/15.*janvier.*2024/i);
  });

  test("formatDate ar", () => {
    const d = "2024-01-15T12:00:00Z";
    const result = formatDate(d, "ar");
    expect(result).not.toBe("");
  });

  test("formatNumber en", () => {
    expect(formatNumber(1234567, "en")).toMatch(/1,234,567/);
  });

  test("formatNumber fr", () => {
    const result = formatNumber(1234567, "fr");
    expect(result).toMatch(/1.*234.*567/);
  });
});
