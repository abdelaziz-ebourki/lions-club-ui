import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

vi.unmock("@/contexts/auth");

import { AuthProvider } from "../auth";
import { api } from "@/lib/api";
import { toast } from "sonner";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

beforeEach(() => {
  vi.restoreAllMocks();
  mockNavigate.mockClear();
  (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({
    id: "user-1",
    name: "Test User",
    email: "test@test.com",
    role: "member",
    emailVerified: true,
  });
});

function renderAuthProvider(pathname = "/profile") {
  Object.defineProperty(window, "location", {
    value: { pathname },
    writable: true,
    configurable: true,
  });
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <AuthProvider>
        <div data-testid="child">content</div>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("AuthContext 401 listener", () => {
  test("shows session expired toast on auth:expired event", async () => {
    const toastSpy = vi.spyOn(toast, "error");
    renderAuthProvider();

    await act(async () => {
      window.dispatchEvent(new CustomEvent("auth:expired"));
    });

    expect(toastSpy).toHaveBeenCalledWith(
      "Your session has expired. Please log in again."
    );
  });

  test("redirects to /login with returnUrl on auth:expired event", async () => {
    renderAuthProvider("/profile");

    await act(async () => {
      window.dispatchEvent(new CustomEvent("auth:expired"));
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      "/login?return=%2Fprofile"
    );
  });

  test("does not redirect when already on /login", async () => {
    renderAuthProvider("/login");

    await act(async () => {
      window.dispatchEvent(new CustomEvent("auth:expired"));
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("does not crash when auth:expired fires before auth is initialized", async () => {
    renderAuthProvider();

    await act(async () => {
      window.dispatchEvent(new CustomEvent("auth:expired"));
    });
  });
});
