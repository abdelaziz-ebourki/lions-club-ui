import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSessionTimeout } from "../use-session-timeout";

const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockToastError = vi.hoisted(() => vi.fn());

vi.mock("sonner", () => ({
  toast: { error: mockToastError },
}));

describe("useSessionTimeout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("redirects to /login?return= on auth:expired", () => {
    renderHook(() => useSessionTimeout());

    window.dispatchEvent(new CustomEvent("auth:expired"));

    expect(mockNavigate).toHaveBeenCalledWith("/login?return=%2F");
  });

  test("does not redirect when already on /login", () => {
    const originalPathname = window.location.pathname;
    Object.defineProperty(window, "location", {
      value: { pathname: "/login" },
      writable: true,
    });

    renderHook(() => useSessionTimeout());

    window.dispatchEvent(new CustomEvent("auth:expired"));

    expect(mockNavigate).not.toHaveBeenCalled();

    Object.defineProperty(window, "location", {
      value: { pathname: originalPathname },
      writable: true,
    });
  });

  test("calls onExpired callback when provided", () => {
    const onExpired = vi.fn();
    renderHook(() => useSessionTimeout(onExpired));

    window.dispatchEvent(new CustomEvent("auth:expired"));

    expect(onExpired).toHaveBeenCalled();
  });

  test("shows toast on session expired", () => {
    renderHook(() => useSessionTimeout());

    window.dispatchEvent(new CustomEvent("auth:expired"));

    expect(mockToastError).toHaveBeenCalledWith(
      "Your session has expired. Please log in again."
    );
  });
});
