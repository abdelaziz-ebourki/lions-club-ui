import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { AuthEmailField } from "@/components/shared/AuthEmailField";
import { AuthCardFields } from "@/components/shared/AuthCardFields";
import { usePasswordReset } from "@/hooks/use-password-reset";

const forgotSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export function ForgotPasswordPage() {
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
    <AuthCardFields
      overline="Reset Password"
      title="Forgot Password"
      description="Enter your email and we'll send you a reset link."
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FieldGroup>
          <AuthEmailField form={form} />
        </FieldGroup>
        <Button type="submit" disabled={isDisabled}>
          {isForgotPending ? (
            <>
              <Spinner className="mr-2" /> Sending link...
            </>
          ) : isCooldown ? (
            <>Resend available in {cooldownSeconds}s</>
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>
      <p className="mt-4 text-center text-body-sm text-muted-foreground">
        <Link to="/login" className="text-primary underline underline-offset-4 hover:text-accent">
          Back to login
        </Link>
      </p>
    </AuthCardFields>
  );
}
