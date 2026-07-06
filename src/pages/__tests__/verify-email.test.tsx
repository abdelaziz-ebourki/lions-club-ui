import { describe, test, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { VerifyEmailPage } from "../verify-email";

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn((opts: Record<string, unknown>) => ({
    mutateAsync: vi.fn(async () => {
      const onSuccess = opts?.onSuccess as (() => void) | undefined;
      onSuccess?.();
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

function renderWithRouter(initialEntries: string[] = ["/verify-email?token=valid-token-abc123"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <VerifyEmailPage />
    </MemoryRouter>
  );
}

describe("VerifyEmailPage", () => {
  test("shows error when no token is provided", () => {
    renderWithRouter(["/verify-email"]);
    expect(screen.getByText(/invalid verification link/i)).toBeInTheDocument();
  });

  test("renders title", async () => {
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByText(/email verified successfully/i)).toBeInTheDocument();
    });
  });
});
