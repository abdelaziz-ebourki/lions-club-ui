import { useAuth } from "@/contexts/auth";
import { useEmailVerification } from "@/hooks/use-email-verification";
import { EmailVerificationBanner } from "@/components/shared/email-verification-banner";

interface RequireVerifiedEmailProps {
  children: React.ReactNode;
}

export function RequireVerifiedEmail({ children }: RequireVerifiedEmailProps) {
  const { isAuthenticated } = useAuth();
  const { isVerified, isCooldown, cooldownSeconds, resend } = useEmailVerification();

  if (!isAuthenticated) return <>{children}</>;

  if (!isVerified) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <EmailVerificationBanner
          isVerified={isVerified}
          isCooldown={isCooldown}
          cooldownSeconds={cooldownSeconds}
          onResend={resend}
        />
        <p className="mt-4 text-center text-body-sm text-muted-foreground">
          Please verify your email to access this section.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
