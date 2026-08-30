import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { AuthEmailField } from "@/components/shared/AuthEmailField";
import { AuthCardFields } from "@/components/shared/AuthCardFields";
import { SEO } from "@/components/shared/SEO";
import { seoConfig } from "@/config/seo";
import { usePasswordReset } from "@/hooks/use-password-reset";

const forgotSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export function ForgotPasswordPage() {
  const { t } = useTranslation("auth");
  const form = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const { forgot, isCooldown, cooldownSeconds, isForgotPending } = usePasswordReset();

  async function onSubmit(data: ForgotFormData) {
    await forgot(data.email);
  }

  const isDisabled = isForgotPending || isCooldown;

  return (
    <>
      <SEO {...seoConfig.forgotPassword} />
      <AuthCardFields
        overline={t("forgot.overline")}
        title={t("forgot.title")}
        description={t("forgot.description")}
      >
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FieldGroup>
          <AuthEmailField form={form} />
        </FieldGroup>
        <Button type="submit" disabled={isDisabled}>
          {isForgotPending ? (
            <>
              <Spinner className="mr-2" /> {t("forgot.submitting")}
            </>
          ) : isCooldown ? (
            <>{t("forgot.cooldown", { seconds: cooldownSeconds })}</>
          ) : (
            t("forgot.submit")
          )}
        </Button>
      </form>
      <p className="mt-4 text-center text-body-sm text-muted-foreground">
        <Link to="/login" className="text-primary underline underline-offset-4 hover:text-accent">
          {t("forgot.backToLogin")}
        </Link>
      </p>
      </AuthCardFields>
    </>
  );
}
