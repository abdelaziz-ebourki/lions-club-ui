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

  test("throws AuthError but does not dispatch auth:expired on 401 when skipAuthExpired is set", async () => {
    const mockResponse = new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockResponse);

    const dispatchSpy = vi.spyOn(window, "dispatchEvent");

    await expect(api.get("/test", { skipAuthExpired: true })).rejects.toThrow(AuthError);
    expect(dispatchSpy).not.toHaveBeenCalled();
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

  test("attaches HTTP status to non-401 errors", async () => {
    const mockResponse = new Response(JSON.stringify({ message: "Not Found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockResponse);

    const error = (await api.get("/test").catch((e) => e)) as Error & { status?: number };
    expect(error).toBeInstanceOf(Error);
    expect(error.status).toBe(404);
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

  test("surfaces the server message on 401 instead of a generic one", async () => {
    const mockResponse = new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockResponse);

    const error = await api.get("/test").catch((e) => e);
    expect(error).toBeInstanceOf(AuthError);
    expect((error as Error).message).toBe("Invalid credentials");
  });

  test("keeps the default message when a 401 has no body", async () => {
    const mockResponse = new Response("", {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockResponse);

    const error = await api.get("/test").catch((e) => e);
    expect(error).toBeInstanceOf(AuthError);
    expect((error as Error).message).toBe("Session expired");
  });
});
