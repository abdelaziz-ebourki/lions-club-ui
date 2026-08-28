import { http, HttpResponse } from "msw";
import { seededUsers } from "./auth";
import type { ForgotPasswordRequest, ResetPasswordRequest } from "@/types";

// In-memory stores
const resetTokens = new Map<string, { email: string; userId: string; expiresAt: number; used?: boolean }>();
const forgotCooldown = new Map<string, number>();

// Constants for deterministic tests
export const VALID_RESET_TOKEN = "valid-reset-token";
export const EXPIRED_RESET_TOKEN = "expired-reset-token";

// Pre-seed tokens for tests
resetTokens.set(VALID_RESET_TOKEN, {
  email: "fatima@lionsclub.com",
  userId: "user-1",
  expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
});
resetTokens.set(EXPIRED_RESET_TOKEN, {
  email: "fatima@lionsclub.com",
  userId: "user-1",
  expiresAt: Date.now() - 1000, // already expired
});

export const passwordResetHandlers = [
  http.post("/api/auth/forgot-password", async ({ request }) => {
    let body: ForgotPasswordRequest;
    try {
      body = (await request.json()) as ForgotPasswordRequest;
    } catch {
      body = { email: "" };
    }
    const email = body.email?.trim() ?? "";

    if (!email) {
      return HttpResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // Basic email format check (zod-like)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return HttpResponse.json({ message: "Enter a valid email address" }, { status: 400 });
    }

    // Rate limiting: 60s cooldown per email
    const now = Date.now();
    const nextAllowed = forgotCooldown.get(email);
    if (nextAllowed && now < nextAllowed) {
      const nextResendAt = new Date(nextAllowed).toISOString();
      return HttpResponse.json(
        { message: "Too many requests. Please try again later.", error: "Too many requests. Please try again later.", nextResendAt },
        { status: 429 }
      );
    }

    // Set cooldown for next request (60s)
    const nextResendAtTime = now + 60 * 1000;
    forgotCooldown.set(email, nextResendAtTime);
    const nextResendAt = new Date(nextResendAtTime).toISOString();

    // Find user — but always return generic success to prevent enumeration
    const user = seededUsers.find((u) => u.email === email);
    if (user) {
      // Generate token for this email
      const token = `reset-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      resetTokens.set(token, {
        email: user.email,
        userId: user.id,
        expiresAt: now + 60 * 60 * 1000, // 1 hour
      });
      // Keep valid test token refreshed to avoid expiry during tests
      resetTokens.set(VALID_RESET_TOKEN, {
        email: user.email,
        userId: user.id,
        expiresAt: now + 60 * 60 * 1000,
      });
    }

    return HttpResponse.json({
      message: "If an account exists, a reset link has been sent",
      nextResendAt,
    });
  }),

  http.post("/api/auth/reset-password", async ({ request }) => {
    const url = new URL(request.url);
    const tokenFromQuery = url.searchParams.get("token");

    let body: ResetPasswordRequest;
    try {
      body = (await request.json()) as ResetPasswordRequest;
    } catch {
      body = { token: "", password: "", confirmPassword: "" };
    }

    const token = tokenFromQuery ?? body.token ?? "";
    const password = body.password ?? (body as unknown as { newPassword?: string }).newPassword ?? "";
    const confirmPassword = body.confirmPassword ?? "";

    if (!token) {
      return HttpResponse.json({ message: "Reset token is required", error: "Reset token is required" }, { status: 400 });
    }

    const record = resetTokens.get(token);
    if (!record) {
      return HttpResponse.json({ message: "Invalid reset token", error: "Invalid reset token" }, { status: 400 });
    }

    if (record.used) {
      return HttpResponse.json({ message: "Reset token has already been used", error: "Reset token has already been used" }, { status: 400 });
    }

    if (Date.now() > record.expiresAt) {
      return HttpResponse.json(
        { message: "Reset token has expired. Please request a new one.", error: "Reset token has expired. Please request a new one." },
        { status: 400 }
      );
    }

    if (!password) {
      return HttpResponse.json({ message: "Password is required", error: "Password is required" }, { status: 400 });
    }

    if (password.length < 8) {
      return HttpResponse.json({ message: "Password must be at least 8 characters", error: "Password must be at least 8 characters" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return HttpResponse.json({ message: "Passwords do not match", error: "Passwords do not match" }, { status: 400 });
    }

    // Update password in seededUsers
    const user = seededUsers.find((u) => u.id === record.userId || u.email === record.email);
    if (!user) {
      return HttpResponse.json({ message: "Invalid reset token", error: "Invalid reset token" }, { status: 400 });
    }

    (user as { password: string }).password = password;
    // Also update profile's userPasswords if needed? Handled via seededUsers for login; profile handler has separate store but not critical for this flow

    // Mark token as used (single-use)
    record.used = true;
    resetTokens.set(token, record);

    // Clear cooldown for this email so user can request again if needed (optional)
    // forgotCooldown.delete(record.email);

    return HttpResponse.json({ message: "Password has been reset successfully" });
  }),
];

// Helpers for tests to reset state
export function __resetPasswordResetState() {
  resetTokens.clear();
  forgotCooldown.clear();
  resetTokens.set(VALID_RESET_TOKEN, {
    email: "fatima@lionsclub.com",
    userId: "user-1",
    expiresAt: Date.now() + 60 * 60 * 1000,
  });
  resetTokens.set(EXPIRED_RESET_TOKEN, {
    email: "fatima@lionsclub.com",
    userId: "user-1",
    expiresAt: Date.now() - 1000,
  });
}

export function __getResetTokens() {
  return resetTokens;
}

export function __getForgotCooldown() {
  return forgotCooldown;
}
