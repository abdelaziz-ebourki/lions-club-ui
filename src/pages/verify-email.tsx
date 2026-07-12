import { useEffect, type ReactNode } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, Clock, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmailVerification } from "@/hooks/use-email-verification";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

function VerifyEmailCard({ icon: Icon, title, iconColor, children }: { icon: LucideIcon; title: string; iconColor: string; children: ReactNode }) {
  return (
    <>
      <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Verify Email" }]} />
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-20">
        <Card className="w-full">
          <CardHeader className="text-center">
            <Icon className={`mx-auto size-12 ${iconColor}`} />
            <CardTitle className="font-heading text-h3">{title}</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-body-sm text-muted-foreground space-y-4">
            {children}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { verify, isVerifying, verifyResult } = useEmailVerification();

  useEffect(() => {
    if (token && verifyResult.status === "idle") {
      verify(token);
    }
  }, [token, verify, verifyResult.status]);

  if (!token) {
    return (
      <VerifyEmailCard icon={XCircle} title="Invalid verification link" iconColor="text-destructive">
        <p>No verification token found in the URL.</p>
      </VerifyEmailCard>
    );
  }

  if (isVerifying || verifyResult.status === "loading") {
    return (
      <VerifyEmailCard icon={Loader2} title="Verifying your email..." iconColor="text-primary">
        <p>Please wait while we verify your email address.</p>
      </VerifyEmailCard>
    );
  }

  if (verifyResult.status === "already-verified") {
    return (
      <VerifyEmailCard icon={CheckCircle2} title="Already verified" iconColor="text-primary">
        <p>Your email address is already verified. You can access all features.</p>
        <Link to="/profile" className="inline-flex shrink-0 items-center justify-center h-10 gap-1.5 px-6 rounded-none border border-transparent bg-accent text-accent-foreground text-xs font-semibold tracking-widest uppercase hover:bg-accent/90 transition-all">Go to profile</Link>
      </VerifyEmailCard>
    );
  }

  if (verifyResult.status === "expired") {
    return (
      <VerifyEmailCard icon={Clock} title="Verification link expired" iconColor="text-warning">
        <p>This verification link has expired. Request a new one.</p>
        <Link to="/profile" className="inline-flex shrink-0 items-center justify-center h-10 gap-1.5 px-6 rounded-none border border-transparent bg-accent text-accent-foreground text-xs font-semibold tracking-widest uppercase hover:bg-accent/90 transition-all">Resend verification email</Link>
      </VerifyEmailCard>
    );
  }

  if (verifyResult.status === "error") {
    return (
      <VerifyEmailCard icon={XCircle} title="Invalid verification token" iconColor="text-destructive">
        <p>{verifyResult.message || "Something went wrong. Please try again."}</p>
        <Link to="/profile" className="inline-flex shrink-0 items-center justify-center h-10 gap-1.5 px-6 rounded-none border border-transparent bg-accent text-accent-foreground text-xs font-semibold tracking-widest uppercase hover:bg-accent/90 transition-all">Request new link</Link>
      </VerifyEmailCard>
    );
  }

  if (verifyResult.status === "success") {
    return (
      <VerifyEmailCard icon={CheckCircle2} title="Email verified successfully" iconColor="text-success">
        <p>Your email has been verified. You can now access all features.</p>
        <Link to="/profile" className="inline-flex shrink-0 items-center justify-center h-10 gap-1.5 px-6 rounded-none border border-transparent bg-accent text-accent-foreground text-xs font-semibold tracking-widest uppercase hover:bg-accent/90 transition-all">Continue to profile</Link>
      </VerifyEmailCard>
    );
  }

  return null;
}
