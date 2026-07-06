import { AlertTriangle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmailVerificationBannerProps {
  isVerified: boolean;
  isCooldown: boolean;
  cooldownSeconds: number;
  onResend: () => void;
}

export function EmailVerificationBanner({
  isVerified,
  isCooldown,
  cooldownSeconds,
  onResend,
}: EmailVerificationBannerProps) {
  if (isVerified) return null;

  return (
    <div
      role="status"
      className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200"
    >
      <AlertTriangle className="size-5 shrink-0" />
      <div className="flex-1">
        <p className="font-medium">Email not verified</p>
        <p className="text-amber-700 dark:text-amber-300">
          Please verify your email address to access all features.
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onResend}
        disabled={isCooldown}
        aria-label="Resend verification email"
      >
        {isCooldown ? (
          <>
            <Mail className="mr-1 size-4" />
            Resend available in {cooldownSeconds}s
          </>
        ) : (
          <>
            <Mail className="mr-1 size-4" />
            Resend verification email
          </>
        )}
      </Button>
    </div>
  );
}
