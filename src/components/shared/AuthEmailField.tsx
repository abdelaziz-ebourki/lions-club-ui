import type { UseFormReturn, FieldValues } from "react-hook-form";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface AuthEmailFieldProps<TForm extends FieldValues> {
  form: UseFormReturn<TForm>;
}

export function AuthEmailField<TForm extends FieldValues>({ form }: AuthEmailFieldProps<TForm>) {
  const error = form.formState.errors.email as { message?: string } | undefined;
  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <FieldContent>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          aria-invalid={!!error}
          {...(form.register as UseFormReturn<FieldValues>["register"])("email")}
          autoComplete="email"
          spellCheck={false}
        />
        <FieldError errors={error ? [error] : []} />
      </FieldContent>
    </Field>
  );
}
