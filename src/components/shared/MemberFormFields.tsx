import { Controller, type UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldGroup, Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { FileUpload } from "@/components/ui/file-upload";

interface MemberFormFieldsProps {
  form: UseFormReturn<{
    name: string;
    role: string;
    bio?: string;
    avatar?: File | string | null;
  }>;
  nameCount: number;
  roleCount: number;
  bioCount: number;
  showSuccess: boolean;
  mutationPending: boolean;
}

export function MemberFormFields({ form, nameCount, roleCount, bioCount, showSuccess, mutationPending }: MemberFormFieldsProps) {
  return (
    <FieldGroup className={cn("transition-all duration-500", showSuccess && "ring-2 ring-green-500/50 rounded-lg")}>
      {/* fallow-ignore-next-line code-duplication */}
      <Field data-invalid={!!form.formState.errors.name}>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <FieldContent>
          <Input id="name" placeholder="Full name" aria-invalid={!!form.formState.errors.name} {...form.register("name")} />
          <FieldError errors={[form.formState.errors.name]} />
          <span className={cn("text-body-xs", nameCount >= 100 ? "text-destructive" : nameCount >= 80 ? "text-amber-500" : "text-muted-foreground")} aria-live="polite">
            {nameCount}/100
          </span>
        </FieldContent>
      </Field>
      <Field data-invalid={!!form.formState.errors.role}>
        <FieldLabel htmlFor="role">Role</FieldLabel>
        <FieldContent>
          <Input id="role" placeholder="e.g. Treasurer, Event Lead" aria-invalid={!!form.formState.errors.role} {...form.register("role")} />
          <FieldError errors={[form.formState.errors.role]} />
          <span className={cn("text-body-xs", roleCount >= 100 ? "text-destructive" : roleCount >= 80 ? "text-amber-500" : "text-muted-foreground")} aria-live="polite">
            {roleCount}/100
          </span>
        </FieldContent>
      </Field>
      <Field data-invalid={!!form.formState.errors.bio}>
        <FieldLabel htmlFor="bio">Bio (optional)</FieldLabel>
        <FieldContent>
          <Textarea id="bio" placeholder="Short biography" rows={3} aria-invalid={!!form.formState.errors.bio} {...form.register("bio")} />
          <FieldError errors={[form.formState.errors.bio]} />
          <span className={cn("text-body-xs", bioCount >= 500 ? "text-destructive" : bioCount >= 400 ? "text-amber-500" : "text-muted-foreground")} aria-live="polite">
            {bioCount}/500
          </span>
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel htmlFor="avatar">Avatar</FieldLabel>
        <FieldContent>
          <Controller
            name="avatar"
            control={form.control}
            render={({ field, fieldState }) => (
              <FileUpload
                id="avatar"
                value={field.value ?? null}
                onChange={(file) => field.onChange(file)}
                error={fieldState.error?.message}
                loading={mutationPending}
                variant="circle"
              />
            )}
          />
        </FieldContent>
      </Field>
    </FieldGroup>
  );
}
