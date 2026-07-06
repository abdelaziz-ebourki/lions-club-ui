import { describe, test, expect, vi, beforeEach } from "vitest";
import { AuthError } from "@/types";

vi.unmock("@/lib/api");

import { api } from "@/lib/api";

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("api 401 interception", () => {
  test("throws AuthError on 401 response", async () => {
    const mockResponse = new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockResponse);

    await expect(api.get("/test")).rejects.toThrow(AuthError);
  });

  test("dispatches auth:expired event on 401", async () => {
    const mockResponse = new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockResponse);

    const dispatchSpy = vi.spyOn(window, "dispatchEvent");

    try {
      await api.get("/test");
    } catch {
      // Expected
    }

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: "auth:expired" })
    );
  });

  test("throws standard Error on non-401 error", async () => {
    const mockResponse = new Response(JSON.stringify({ message: "Not Found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockResponse);

    await expect(api.get("/test")).rejects.toThrow(Error);
    await expect(api.get("/test")).rejects.not.toThrow(AuthError);
  });

  test("does not dispatch auth:expired on non-401 error", async () => {
    const mockResponse = new Response(JSON.stringify({ message: "Not Found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockResponse);

    const dispatchSpy = vi.spyOn(window, "dispatchEvent");

    try {
      await api.get("/test");
    } catch {
      // Expected
    }

    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
