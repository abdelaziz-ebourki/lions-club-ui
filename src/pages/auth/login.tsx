import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/auth";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldGroup, Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { AuthEmailField } from "@/components/shared/AuthEmailField";
import { AuthCardFields } from "@/components/shared/AuthCardFields";
import { SEO } from "@/components/shared/SEO";
import { seoConfig } from "@/config/seo";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { t } = useTranslation("auth");
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();

  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem("remember_me") === "true");

  const mutation = useMutation({
    mutationFn: (data: LoginFormData & { remember_me?: boolean }) => api.post("/auth/login", data),
    onSuccess: async () => {
      await refreshUser();
      toast.success(t("login.success"));
      navigate(searchParams.get("return") || "/");
    },
  });

  function onSubmit(data: LoginFormData) {
    mutation.mutate({ ...data, remember_me: rememberMe }, {
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : t("login.error"));
      },
    });
  }

  return (
    <>
      <SEO {...seoConfig.login} />
      <AuthCardFields overline={t("login.overline")} title={t("login.title")} description={t("login.description")}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FieldGroup>
          <AuthEmailField form={form} />
          <Field data-invalid={!!form.formState.errors.password}>
            <FieldLabel htmlFor="password" className="after:content-['*'] after:ml-0.5 after:text-destructive">{t("login.password")}</FieldLabel>
            <FieldContent>
              <Input id="password" type="password" placeholder={t("login.passwordPlaceholder")} aria-invalid={!!form.formState.errors.password} aria-required="true" {...form.register("password")} autoComplete="current-password" />
              <FieldError errors={[form.formState.errors.password]} />
            </FieldContent>
          </Field>
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-primary underline underline-offset-4 hover:text-accent">
              {t("login.forgotPassword")}
            </Link>
          </div>
          <Field orientation="horizontal">
            <FieldLabel>
              <input
                type="checkbox"
                data-slot="checkbox"
                role="checkbox"
                checked={rememberMe}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setRememberMe(checked);
                  if (checked) {
                    localStorage.setItem("remember_me", "true");
                  } else {
                    localStorage.removeItem("remember_me");
                  }
                }}
              />
              {t("login.rememberMe")}
            </FieldLabel>
          </Field>
        </FieldGroup>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? (
            <><Spinner className="mr-2" /> {t("login.submitting")}</>
          ) : t("login.submit")}
        </Button>
      </form>
      <p className="mt-4 text-center text-body-sm text-muted-foreground">
        {t("login.noAccount")}{" "}
        <Link to="/register" className="text-primary underline underline-offset-4 hover:text-accent">
          {t("login.registerHere")}
        </Link>
      </p>
      </AuthCardFields>
    </>
  );
}
