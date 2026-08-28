import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ForgotPasswordPage } from "../forgot-password";
import { describe, test, expect, vi, beforeEach } from "vitest";

vi.mock("@/hooks/use-password-reset", () => ({
  usePasswordReset: vi.fn(),
}));

import { usePasswordReset } from "@/hooks/use-password-reset";

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("ForgotPasswordPage", () => {
  const mockForgot = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePasswordReset).mockReturnValue({
      forgot: mockForgot,
      reset: vi.fn(),
      isCooldown: false,
      cooldownSeconds: 0,
      isForgotPending: false,
      isResetPending: false,
    } as any);
  });

  test("renders forgot password form", () => {
    renderWithRouter(<ForgotPasswordPage />);
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your@email.com/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
  });

  test("shows validation error for invalid email", async () => {
    renderWithRouter(<ForgotPasswordPage />);
    fireEvent.click(screen.getByRole("button", { name: /send reset link/i }));
    expect(await screen.findByText(/enter a valid email address/i)).toBeInTheDocument();
    expect(mockForgot).not.toHaveBeenCalled();
  });

  test("calls forgot with email on submit", async () => {
    renderWithRouter(<ForgotPasswordPage />);
    fireEvent.change(screen.getByPlaceholderText(/your@email.com/i), { target: { value: "fatima@lionsclub.com" } });
    fireEvent.click(screen.getByRole("button", { name: /send reset link/i }));
    await waitFor(() => expect(mockForgot).toHaveBeenCalledWith("fatima@lionsclub.com"));
  });

  test('shows spinner and "Sending link..." during pending', () => {
    vi.mocked(usePasswordReset).mockReturnValue({
      forgot: mockForgot,
      reset: vi.fn(),
      isCooldown: false,
      cooldownSeconds: 0,
      isForgotPending: true,
      isResetPending: false,
    } as any);
    renderWithRouter(<ForgotPasswordPage />);
    const btn = screen.getByRole("button", { name: /sending link/i });
    expect(btn).toBeDisabled();
    expect(btn.querySelector("svg")).toBeInTheDocument();
  });

  test("disables button and shows cooldown when rate limited", () => {
    vi.mocked(usePasswordReset).mockReturnValue({
      forgot: mockForgot,
      reset: vi.fn(),
      isCooldown: true,
      cooldownSeconds: 45,
      isForgotPending: false,
      isResetPending: false,
    } as any);
    renderWithRouter(<ForgotPasswordPage />);
    const btn = screen.getByRole("button", { name: /resend available in 45s/i });
    expect(btn).toBeDisabled();
  });

  test('renders "Back to login" link', () => {
    renderWithRouter(<ForgotPasswordPage />);
    expect(screen.getByText(/back to login/i)).toBeInTheDocument();
  });
});
