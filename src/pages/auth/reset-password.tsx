import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { XCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldGroup, Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AuthCardFields } from "@/components/shared/AuthCardFields";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SEO } from "@/components/shared/SEO";
import { seoConfig } from "@/config/seo";
import { usePasswordReset } from "@/hooks/use-password-reset";

const resetSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetFormData = z.infer<typeof resetSchema>;

export function ResetPasswordPage() {
  const { t } = useTranslation(["auth", "common"]);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { reset, isResetPending } = usePasswordReset();

  const form = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(data: ResetFormData) {
    if (!token) return;
    await reset(token, { password: data.password, confirmPassword: data.confirmPassword });
    navigate("/login");
  }

  if (!token) {
    return (
      <>
        <SEO {...seoConfig.resetPassword} />
        <Breadcrumbs trail={[{ label: t("common:breadcrumbs.home"), href: "/" }, { label: t("reset.title") }]} />
        <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-20">
          <Card className="w-full">
            <CardHeader className="text-center">
              <XCircle className="mx-auto size-12 text-destructive" aria-hidden="true" />
              <h1 className="font-heading text-h3 leading-none tracking-wider uppercase">{t("reset.invalid")}</h1>
            </CardHeader>
            <CardContent className="text-center text-body-sm text-muted-foreground space-y-4">
              <p>{t("reset.noToken")}</p>
              <Link
                to="/forgot-password"
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-none border bg-accent px-6 text-xs font-semibold tracking-widest uppercase text-accent-foreground"
              >
                {t("reset.requestNew")}
              </Link>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO {...seoConfig.resetPassword} />
      <AuthCardFields overline={t("reset.overline")} title={t("reset.title")} description={t("reset.description")}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FieldGroup>
          <Field data-invalid={!!form.formState.errors.password}>
            <FieldLabel htmlFor="password" className="after:content-['*'] after:ml-0.5 after:text-destructive">{t("reset.newPassword")}</FieldLabel>
            <FieldContent>
              <Input
                id="password"
                type="password"
                placeholder={t("reset.passwordPlaceholder")}
                aria-invalid={!!form.formState.errors.password}
                aria-required="true"
                {...form.register("password")}
                autoComplete="new-password"
              />
              <FieldError errors={[form.formState.errors.password]} />
            </FieldContent>
          </Field>
          <Field data-invalid={!!form.formState.errors.confirmPassword}>
            <FieldLabel htmlFor="confirmPassword" className="after:content-['*'] after:ml-0.5 after:text-destructive">{t("reset.confirmNewPassword")}</FieldLabel>
            <FieldContent>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t("reset.confirmPlaceholder")}
                aria-invalid={!!form.formState.errors.confirmPassword}
                aria-required="true"
                {...form.register("confirmPassword")}
                autoComplete="new-password"
              />
              <FieldError errors={[form.formState.errors.confirmPassword]} />
            </FieldContent>
          </Field>
        </FieldGroup>
        <Button type="submit" disabled={isResetPending}>
          {isResetPending ? (
            <>
              <Spinner className="mr-2" /> {t("reset.submitting")}
            </>
          ) : (
            t("reset.submit")
          )}
        </Button>
      </form>
      <p className="mt-4 text-center text-body-sm text-muted-foreground">
        <Link to="/login" className="text-primary underline underline-offset-4 hover:text-accent">
          {t("reset.backToLogin")}
        </Link>
      </p>
      </AuthCardFields>
    </>
  );
}
