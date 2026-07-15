import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { UseFormReturn } from "react-hook-form";
import type { ProfileFormData } from "@/hooks/use-profile-form";

interface ProfileFormProps {
  form: UseFormReturn<ProfileFormData>;
  mutation: { isPending: boolean };
  onSubmit: (data: ProfileFormData) => void;
  onCancel: () => void;
}

export function ProfileForm({ form, mutation, onSubmit, onCancel }: ProfileFormProps) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Field orientation="vertical">
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <FieldContent>
          <Input id="name" {...form.register("name")} aria-invalid={!!form.formState.errors.name} />
          <FieldError errors={[form.formState.errors.name]} />
        </FieldContent>
      </Field>

      <Field orientation="vertical">
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <FieldContent>
          <Input id="email" type="email" {...form.register("email")} aria-invalid={!!form.formState.errors.email} />
          <FieldError errors={[form.formState.errors.email]} />
        </FieldContent>
      </Field>

      <div className="flex gap-3">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? <><Spinner /> Saving...</> : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={mutation.isPending}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
