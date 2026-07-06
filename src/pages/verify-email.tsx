import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmailVerification } from "@/hooks/use-email-verification";

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
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-20">
        <Card className="w-full">
          <CardHeader className="text-center">
            <XCircle className="mx-auto size-12 text-destructive" />
            <CardTitle className="font-heading text-h3">Invalid verification link</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-body-sm text-muted-foreground">
            <p>No verification token found in the URL.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isVerifying || verifyResult.status === "loading") {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-20">
        <Card className="w-full">
          <CardHeader className="text-center">
            <Loader2 className="mx-auto size-12 animate-spin text-primary" />
            <CardTitle className="font-heading text-h3">Verifying your email...</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-body-sm text-muted-foreground">
            <p>Please wait while we verify your email address.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verifyResult.status === "already-verified") {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-20">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CheckCircle2 className="mx-auto size-12 text-primary" />
            <CardTitle className="font-heading text-h3">Already verified</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-body-sm text-muted-foreground space-y-4">
            <p>Your email address is already verified. You can access all features.</p>
            <Link to="/profile" className="inline-flex shrink-0 items-center justify-center h-10 gap-1.5 px-6 rounded-none border border-transparent bg-accent text-accent-foreground text-xs font-semibold tracking-widest uppercase hover:bg-accent/90 transition-all">Go to profile</Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verifyResult.status === "expired") {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-20">
        <Card className="w-full">
          <CardHeader className="text-center">
            <Clock className="mx-auto size-12 text-warning" />
            <CardTitle className="font-heading text-h3">Verification link expired</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-body-sm text-muted-foreground space-y-4">
            <p>This verification link has expired. Request a new one.</p>
            <Link to="/profile" className="inline-flex shrink-0 items-center justify-center h-10 gap-1.5 px-6 rounded-none border border-transparent bg-accent text-accent-foreground text-xs font-semibold tracking-widest uppercase hover:bg-accent/90 transition-all">Resend verification email</Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verifyResult.status === "error") {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-20">
        <Card className="w-full">
          <CardHeader className="text-center">
            <XCircle className="mx-auto size-12 text-destructive" />
            <CardTitle className="font-heading text-h3">Invalid verification token</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-body-sm text-muted-foreground space-y-4">
            <p>{verifyResult.message || "Something went wrong. Please try again."}</p>
            <Link to="/profile" className="inline-flex shrink-0 items-center justify-center h-10 gap-1.5 px-6 rounded-none border border-transparent bg-accent text-accent-foreground text-xs font-semibold tracking-widest uppercase hover:bg-accent/90 transition-all">Request new link</Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verifyResult.status === "success") {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-20">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CheckCircle2 className="mx-auto size-12 text-success" />
            <CardTitle className="font-heading text-h3">Email verified successfully</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-body-sm text-muted-foreground space-y-4">
            <p>Your email has been verified. You can now access all features.</p>
            <Link to="/profile" className="inline-flex shrink-0 items-center justify-center h-10 gap-1.5 px-6 rounded-none border border-transparent bg-accent text-accent-foreground text-xs font-semibold tracking-widest uppercase hover:bg-accent/90 transition-all">Continue to profile</Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
