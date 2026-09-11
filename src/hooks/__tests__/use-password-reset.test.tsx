import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePasswordReset } from "../use-password-reset";

vi.mock("@tanstack/react-query", () => ({
   
  useMutation: vi.fn((opts: Record<string, any>) => ({
    mutateAsync: vi.fn(async () => {
      if (opts?.onSuccess) opts.onSuccess({ message: "ok", nextResendAt: new Date(Date.now() + 60 * 1000).toISOString() });
    }),
    isPending: false,
    reset: vi.fn(),
    mutate: vi.fn(),
  })),
}));

vi.mock("@/lib/api", () => ({
  api: { post: vi.fn() },
}));

describe("usePasswordReset", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  test("initial state no cooldown", () => {
    const { result } = renderHook(() => usePasswordReset());
    expect(result.current.isCooldown).toBe(false);
    expect(result.current.cooldownSeconds).toBe(0);
  });

  test("forgot starts 60s cooldown and counts down", async () => {
    const { result } = renderHook(() => usePasswordReset());

    await act(async () => {
      await result.current.forgot("fatima@lionsclub.com");
    });

    expect(result.current.isCooldown).toBe(true);
    expect(result.current.cooldownSeconds).toBe(60);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.cooldownSeconds).toBe(59);

    act(() => {
      vi.advanceTimersByTime(59000);
    });
    expect(result.current.isCooldown).toBe(false);
    expect(result.current.cooldownSeconds).toBe(0);
  });

  test("reset mutation exists", async () => {
    const { result } = renderHook(() => usePasswordReset());
    expect(result.current.reset).toBeDefined();
    await act(async () => {
      await result.current.reset("valid-reset-token", { password: "newPassword123", confirmPassword: "newPassword123" });
    });
    expect(result.current.isResetPending).toBe(false);
  });

  test("reset sends the token in the request body per the API contract", async () => {
    const { api } = await import("@/lib/api");
    const { useMutation: mockedUseMutation } = await import("@tanstack/react-query");
    renderHook(() => usePasswordReset());
    const resetCall = vi.mocked(mockedUseMutation).mock.calls
      .find(([opts]: any[]) => String(opts?.mutationFn).includes("reset-password"));
    expect(resetCall).toBeDefined();
    const mutationFn = resetCall![0].mutationFn as (vars: {
      token: string; password: string; confirmPassword: string;
    }) => Promise<unknown>;
    await act(async () => {
      await mutationFn({ token: "tok-123", password: "newPassword123", confirmPassword: "newPassword123" });
    });
    expect(vi.mocked(api.post)).toHaveBeenCalledWith(
      "/auth/reset-password",
      { token: "tok-123", password: "newPassword123", confirmPassword: "newPassword123" },
      expect.objectContaining({ skipAuthExpired: true })
    );
  });
});
