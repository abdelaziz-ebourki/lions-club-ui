import { AlertTriangle, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("profile");
  if (isVerified) return null;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
      <AlertTriangle className="size-5 shrink-0" />
      <div role="status" className="flex-1">
        <p className="font-medium">{t("verification.notVerified")}</p>
        <p className="text-amber-700 dark:text-amber-300">
          {t("verification.description")}
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onResend}
        disabled={isCooldown}
        aria-label={t("verification.resend")}
      >
        {isCooldown ? (
          <>
            <Mail className="mr-1 size-4" />
            {t("verification.cooldown", { seconds: cooldownSeconds })}
          </>
        ) : (
          <>
            <Mail className="mr-1 size-4" />
            {t("verification.resend")}
          </>
        )}
      </Button>
    </div>
  );
}
