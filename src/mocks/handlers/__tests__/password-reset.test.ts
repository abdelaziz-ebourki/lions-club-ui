import { describe, test, expect } from "vitest";
import { passwordResetHandlers } from "../password-reset";

describe("MSW Password Reset Handlers", () => {
  const getHandler = (method: string, path: string) =>
    (passwordResetHandlers as any[]).find((h: any) => (h.info?.method ?? h.method) === method && (h.info?.path ?? h.path) === path);

  test("POST /api/auth/forgot-password handler exists", () => {
    const handler = getHandler("POST", "/api/auth/forgot-password");
    expect(handler).toBeDefined();
  });

  test("POST /api/auth/reset-password handler exists", () => {
    const handler = getHandler("POST", "/api/auth/reset-password");
    expect(handler).toBeDefined();
  });
});
