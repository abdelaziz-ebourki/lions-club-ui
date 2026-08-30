import { useEffect, type ReactNode } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle2, XCircle, Loader2, Clock, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEmailVerification } from "@/hooks/use-email-verification";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SEO } from "@/components/shared/SEO";
import { seoConfig } from "@/config/seo";

function VerifyEmailCard({ icon: Icon, title, iconColor, children }: { icon: LucideIcon; title: string; iconColor: string; children: ReactNode }) {
  const { t } = useTranslation(["auth", "common"]);
  return (
    <>
      <SEO {...seoConfig.verifyEmail} />
      <Breadcrumbs trail={[{ label: t("common:breadcrumbs.home"), href: "/" }, { label: t("auth:verify.title") }]} />
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-20">
        <Card className="w-full">
          <CardHeader className="text-center">
            <Icon className={`mx-auto size-12 ${iconColor}`} />
            <h1 className="font-heading text-h3 leading-none tracking-wider uppercase">{title}</h1>
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
  const { t } = useTranslation(["auth", "common"]);
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
      <VerifyEmailCard icon={XCircle} title={t("auth:verify.invalidLink")} iconColor="text-destructive">
        <p>{t("auth:verify.noToken")}</p>
      </VerifyEmailCard>
    );
  }

  if (isVerifying || verifyResult.status === "loading") {
    return (
      <VerifyEmailCard icon={Loader2} title={t("auth:verify.verifying")} iconColor="text-primary">
        <p>{t("auth:verify.wait")}</p>
      </VerifyEmailCard>
    );
  }

  if (verifyResult.status === "already-verified") {
    return (
      <VerifyEmailCard icon={CheckCircle2} title={t("auth:verify.alreadyVerified")} iconColor="text-primary">
        <p>{t("auth:verify.alreadyMsg")}</p>
        <Link to="/profile" className="inline-flex shrink-0 items-center justify-center h-10 gap-1.5 px-6 rounded-none border border-transparent bg-accent text-accent-foreground text-xs font-semibold tracking-widest uppercase hover:bg-accent/90 transition-all">{t("auth:verify.goProfile")}</Link>
      </VerifyEmailCard>
    );
  }

  if (verifyResult.status === "expired") {
    return (
      <VerifyEmailCard icon={Clock} title={t("auth:verify.expired")} iconColor="text-warning">
        <p>{t("auth:verify.expiredMsg")}</p>
        <Link to="/profile" className="inline-flex shrink-0 items-center justify-center h-10 gap-1.5 px-6 rounded-none border border-transparent bg-accent text-accent-foreground text-xs font-semibold tracking-widest uppercase hover:bg-accent/90 transition-all">{t("auth:verify.resend")}</Link>
      </VerifyEmailCard>
    );
  }

  if (verifyResult.status === "error") {
    return (
      <VerifyEmailCard icon={XCircle} title={t("auth:verify.invalidToken")} iconColor="text-destructive">
        <p>{verifyResult.message || t("auth:verify.errorMsg")}</p>
        <Link to="/profile" className="inline-flex shrink-0 items-center justify-center h-10 gap-1.5 px-6 rounded-none border border-transparent bg-accent text-accent-foreground text-xs font-semibold tracking-widest uppercase hover:bg-accent/90 transition-all">{t("auth:verify.requestNew")}</Link>
      </VerifyEmailCard>
    );
  }

  if (verifyResult.status === "success") {
    return (
      <VerifyEmailCard icon={CheckCircle2} title={t("auth:verify.success")} iconColor="text-success">
        <p>{t("auth:verify.successMsg")}</p>
        <Link to="/profile" className="inline-flex shrink-0 items-center justify-center h-10 gap-1.5 px-6 rounded-none border border-transparent bg-accent text-accent-foreground text-xs font-semibold tracking-widest uppercase hover:bg-accent/90 transition-all">{t("auth:verify.continue")}</Link>
      </VerifyEmailCard>
    );
  }

  return null;
}
