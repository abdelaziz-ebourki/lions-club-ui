import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { XCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldGroup, Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Reset Password" }]} />
        <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-20">
          <Card className="w-full">
            <CardHeader className="text-center">
              <XCircle className="mx-auto size-12 text-destructive" />
              <CardTitle className="font-heading text-h3">Invalid reset link</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-body-sm text-muted-foreground space-y-4">
              <p>No reset token found in the URL.</p>
              <Link
                to="/forgot-password"
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-none border bg-accent px-6 text-xs font-semibold tracking-widest uppercase text-accent-foreground"
              >
                Request new link
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
      <AuthCardFields overline="Set New Password" title="Reset Password" description="Create a new password for your account.">
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FieldGroup>
          <Field data-invalid={!!form.formState.errors.password}>
            <FieldLabel htmlFor="password">New Password</FieldLabel>
            <FieldContent>
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                aria-invalid={!!form.formState.errors.password}
                {...form.register("password")}
                autoComplete="new-password"
              />
              <FieldError errors={[form.formState.errors.password]} />
            </FieldContent>
          </Field>
          <Field data-invalid={!!form.formState.errors.confirmPassword}>
            <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
            <FieldContent>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                aria-invalid={!!form.formState.errors.confirmPassword}
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
              <Spinner className="mr-2" /> Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
      <p className="mt-4 text-center text-body-sm text-muted-foreground">
        <Link to="/login" className="text-primary underline underline-offset-4 hover:text-accent">
          Back to login
        </Link>
      </p>
      </AuthCardFields>
    </>
  );
}
