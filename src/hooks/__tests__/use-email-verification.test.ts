import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEmailVerification } from "../use-email-verification";

vi.mock("@tanstack/react-query", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useMutation: vi.fn((opts: Record<string, any>) => ({
    mutateAsync: vi.fn(async () => {
      if (opts?.onSuccess) opts.onSuccess();
    }),
    isPending: false,
    reset: vi.fn(),
    mutate: vi.fn(),
  })),
}));

vi.mock("@/lib/api", () => ({
  api: { post: vi.fn() },
}));

vi.mock("@/contexts/auth", () => ({
  useAuth: vi.fn(() => ({
    isEmailVerified: false,
    refreshUser: vi.fn(),
  })),
}));

describe("useEmailVerification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  test("returns isVerified from auth context", () => {
    const { result } = renderHook(() => useEmailVerification());
    expect(result.current.isVerified).toBe(false);
  });

  test("resend starts cooldown and counts down", async () => {
    const { result } = renderHook(() => useEmailVerification());

    await act(async () => {
      await result.current.resend();
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
});
