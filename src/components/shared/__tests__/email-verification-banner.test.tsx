import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmailVerificationBanner } from "../email-verification-banner";

const mockResend = vi.fn();

function renderBanner(props?: { isVerified?: boolean }) {
  return render(
    <EmailVerificationBanner
      isVerified={props?.isVerified ?? false}
      isCooldown={false}
      cooldownSeconds={0}
      onResend={mockResend}
    />
  );
}

describe("EmailVerificationBanner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("shows banner when email is not verified", () => {
    renderBanner({ isVerified: false });
    expect(screen.getByText("Email not verified")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /resend verification email/i })).toBeInTheDocument();
  });

  test("does not render when email is verified", () => {
    const { container } = renderBanner({ isVerified: true });
    expect(container.firstChild).toBeNull();
  });

  test("calls onResend when button is clicked", async () => {
    const user = userEvent.setup();
    renderBanner({ isVerified: false });
    await user.click(screen.getByRole("button", { name: /resend verification email/i }));
    expect(mockResend).toHaveBeenCalledTimes(1);
  });

  test("shows cooldown countdown when isCooldown is true", () => {
    render(
      <EmailVerificationBanner
        isVerified={false}
        isCooldown={true}
        cooldownSeconds={45}
        onResend={mockResend}
      />
    );
    expect(screen.getByText(/Resend available in 45s/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /resend verification email/i })).toBeDisabled();
  });
});
