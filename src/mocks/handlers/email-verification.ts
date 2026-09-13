import { http, HttpResponse } from "msw";
import { withRealisticDelay } from "../utils";

const VALID_TOKEN = "valid-token-abc123";
const EXPIRED_TOKEN = "expired-token-xyz789";
const VERIFIED_TOKENS = new Set<string>();

export const emailVerificationHandlers = [
  http.post("/api/auth/verify-email", async ({ request }) => {
    await withRealisticDelay();
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!token || token === "invalid") {
      return HttpResponse.json(
        { success: false, error: "Invalid verification link." },
        { status: 400 }
      );
    }

    if (token === EXPIRED_TOKEN) {
      return HttpResponse.json(
        {
          success: false,
          error: "Verification link has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    if (token === VALID_TOKEN || VERIFIED_TOKENS.has(token)) {
      VERIFIED_TOKENS.add(token);
      return HttpResponse.json({
        success: true,
        message: "Email verified successfully",
      });
    }

    return HttpResponse.json(
      { success: false, error: "Invalid verification link." },
      { status: 400 }
    );
  }),

  http.post("/api/auth/resend-verification", async () => {
    await withRealisticDelay();
    return HttpResponse.json({
      success: true,
      message: "Verification email sent",
      nextResendAt: new Date(Date.now() + 60 * 1000).toISOString(),
    });
  }),
];