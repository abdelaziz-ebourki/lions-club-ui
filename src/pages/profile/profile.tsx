import { useAuth } from "@/contexts/auth";
import { useEmailVerification } from "@/hooks/use-email-verification";
import { EmailVerificationBanner } from "@/components/shared/email-verification-banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export function ProfilePage() {
  const { user } = useAuth();
  const { isVerified, isCooldown, cooldownSeconds, resend } = useEmailVerification();

  if (!user) return null;

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "—";

  return (
    <>
      <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Profile" }]} />
      <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-heading text-h2 mb-8">Profile</h1>

      <div className="mb-6">
        <EmailVerificationBanner
          isVerified={isVerified}
          isCooldown={isCooldown}
          cooldownSeconds={cooldownSeconds}
          onResend={resend}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-h4">Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-overline text-muted-foreground text-xs tracking-widest uppercase">Name</p>
            <p className="text-body">{user.name}</p>
          </div>
          <div>
            <p className="text-overline text-muted-foreground text-xs tracking-widest uppercase">Email</p>
            <p className="text-body">{user.email}</p>
          </div>
          <div>
            <p className="text-overline text-muted-foreground text-xs tracking-widest uppercase">Role</p>
            <p className="text-body capitalize">{user.role}</p>
          </div>
          <div>
            <p className="text-overline text-muted-foreground text-xs tracking-widest uppercase">Member since</p>
            <p className="text-body">{memberSince}</p>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
}
