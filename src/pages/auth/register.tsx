import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FieldGroup, Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: Omit<RegisterFormData, "confirmPassword">) => api.post("/auth/register", data),
    onSuccess: () => {
      toast.success("Account created successfully!");
      navigate("/");
    },
  });

  function onSubmit({ confirmPassword: _confirmPassword, ...data }: RegisterFormData) {
    mutation.mutate(data, {
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : "Registration failed. Please try again.");
      },
    });
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-20">
      <Card className="w-full">
        <CardHeader className="text-center">
          <p className="font-display text-overline text-accent mb-1">
            Join Us
          </p>
          <CardTitle className="font-heading text-h3">Create an Account</CardTitle>
          <CardDescription className="text-body-sm">
            Register to join projects, participate in discussions, and connect with fellow members.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <FieldGroup>
              <Field data-invalid={!!form.formState.errors.name}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <FieldContent>
                  <Input id="name" placeholder="Your full name" aria-invalid={!!form.formState.errors.name} {...form.register("name")} autoComplete="name" />
                  <FieldError errors={[form.formState.errors.name]} />
                </FieldContent>
              </Field>
              <Field data-invalid={!!form.formState.errors.email}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <FieldContent>
                  <Input id="email" type="email" placeholder="your@email.com" aria-invalid={!!form.formState.errors.email} {...form.register("email")} autoComplete="email" spellCheck={false} />
                  <FieldError errors={[form.formState.errors.email]} />
                </FieldContent>
              </Field>
              <Field data-invalid={!!form.formState.errors.password}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <FieldContent>
                  <Input id="password" type="password" placeholder="At least 6 characters" aria-invalid={!!form.formState.errors.password} {...form.register("password")} autoComplete="new-password" />
                  <FieldError errors={[form.formState.errors.password]} />
                </FieldContent>
              </Field>
              <Field data-invalid={!!form.formState.errors.confirmPassword}>
                <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                <FieldContent>
                  <Input id="confirmPassword" type="password" placeholder="Repeat your password" aria-invalid={!!form.formState.errors.confirmPassword} {...form.register("confirmPassword")} autoComplete="new-password" />
                  <FieldError errors={[form.formState.errors.confirmPassword]} />
                </FieldContent>
              </Field>
            </FieldGroup>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <><Spinner className="mr-2" /> Creating account...</>
              ) : "Create Account"}
            </Button>
          </form>
          <p className="mt-4 text-center text-body-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary underline underline-offset-4 hover:text-accent">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
