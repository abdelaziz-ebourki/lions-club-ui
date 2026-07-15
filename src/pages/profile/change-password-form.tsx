import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export function PasswordChangeForm() {
  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: PasswordFormData) =>
      api.put("/user/password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }),
    onSuccess: () => {
      toast.success("Password updated successfully");
      form.reset();
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to update password";
      toast.error(message);
    },
  });

  function onSubmit(data: PasswordFormData) {
    mutation.mutate(data);
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="font-heading text-h4">Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field orientation="vertical">
            <FieldLabel htmlFor="currentPassword">Current Password</FieldLabel>
            <FieldContent>
              <Input id="currentPassword" type="password" {...form.register("currentPassword")} aria-invalid={!!form.formState.errors.currentPassword} />
              <FieldError errors={[form.formState.errors.currentPassword]} />
            </FieldContent>
          </Field>

          <Field orientation="vertical">
            <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
            <FieldContent>
              <Input id="newPassword" type="password" {...form.register("newPassword")} aria-invalid={!!form.formState.errors.newPassword} />
              <FieldError errors={[form.formState.errors.newPassword]} />
            </FieldContent>
          </Field>

          <Field orientation="vertical">
            <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
            <FieldContent>
              <Input id="confirmPassword" type="password" {...form.register("confirmPassword")} aria-invalid={!!form.formState.errors.confirmPassword} />
              <FieldError errors={[form.formState.errors.confirmPassword]} />
            </FieldContent>
          </Field>

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <><Spinner /> Updating...</> : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
