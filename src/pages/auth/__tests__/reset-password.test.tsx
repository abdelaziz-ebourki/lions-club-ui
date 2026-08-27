import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ResetPasswordPage } from "../reset-password";
import { describe, test, expect, vi, beforeEach } from "vitest";

vi.mock("@/hooks/use-password-reset", () => ({
  usePasswordReset: vi.fn(),
}));

import { usePasswordReset } from "@/hooks/use-password-reset";

function renderWithRouter(ui: React.ReactElement, initialEntries = ["/reset-password?token=valid-reset-token"]) {
  return render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>);
}

describe("ResetPasswordPage", () => {
  const mockReset = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePasswordReset).mockReturnValue({
      forgot: vi.fn(),
      reset: mockReset,
      isCooldown: false,
      cooldownSeconds: 0,
      isForgotPending: false,
      isResetPending: false,
    } as any);
  });

  test("renders reset password form when token present", () => {
    renderWithRouter(<ResetPasswordPage />);
    expect(screen.getAllByText(/reset password/i).length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/^new password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument();
  });

  test("shows invalid reset link when no token", () => {
    renderWithRouter(<ResetPasswordPage />, ["/reset-password"]);
    expect(screen.getByText(/invalid reset link/i)).toBeInTheDocument();
    expect(screen.getByText(/no reset token found/i)).toBeInTheDocument();
    expect(screen.getByText(/request new link/i)).toBeInTheDocument();
  });

  test("shows validation error for short password", async () => {
    renderWithRouter(<ResetPasswordPage />);
    fireEvent.change(screen.getByLabelText(/^new password$/i), { target: { value: "short" } });
    fireEvent.change(screen.getByLabelText(/confirm new password/i), { target: { value: "short" } });
    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));
    expect(await screen.findByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    expect(mockReset).not.toHaveBeenCalled();
  });

  test("shows validation error when passwords do not match", async () => {
    renderWithRouter(<ResetPasswordPage />);
    fireEvent.change(screen.getByLabelText(/^new password$/i), { target: { value: "newPassword123" } });
    fireEvent.change(screen.getByLabelText(/confirm new password/i), { target: { value: "different123" } });
    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));
    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    expect(mockReset).not.toHaveBeenCalled();
  });

  test("calls reset with token and passwords on submit", async () => {
    renderWithRouter(<ResetPasswordPage />);
    fireEvent.change(screen.getByLabelText(/^new password$/i), { target: { value: "newPassword123" } });
    fireEvent.change(screen.getByLabelText(/confirm new password/i), { target: { value: "newPassword123" } });
    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));
    await waitFor(() => expect(mockReset).toHaveBeenCalledWith("valid-reset-token", { password: "newPassword123", confirmPassword: "newPassword123" }));
  });

  test('shows spinner and "Resetting..." during pending', () => {
    vi.mocked(usePasswordReset).mockReturnValue({
      forgot: vi.fn(),
      reset: mockReset,
      isCooldown: false,
      cooldownSeconds: 0,
      isForgotPending: false,
      isResetPending: true,
    } as any);
    renderWithRouter(<ResetPasswordPage />);
    const btn = screen.getByRole("button", { name: /resetting/i });
    expect(btn).toBeDisabled();
    expect(btn.querySelector("svg")).toBeInTheDocument();
  });

  test('renders "Back to login" link', () => {
    renderWithRouter(<ResetPasswordPage />);
    expect(screen.getByText(/back to login/i)).toBeInTheDocument();
  });
});
