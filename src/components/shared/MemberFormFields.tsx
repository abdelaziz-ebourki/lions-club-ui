import { Controller, type UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldGroup, Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { FileUpload } from "@/components/ui/file-upload";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("admin");
  return (
    <FieldGroup className={cn("transition-all duration-500", showSuccess && "ring-2 ring-green-500/50 rounded-lg")}>
      {/* fallow-ignore-next-line code-duplication */}
      <Field data-invalid={!!form.formState.errors.name}>
        <FieldLabel htmlFor="name">{t("members.form.fields.name")}</FieldLabel>
        <FieldContent>
          <Input id="name" placeholder={t("members.form.fields.placeholders.name")} aria-invalid={!!form.formState.errors.name} {...form.register("name")} />
          <FieldError errors={[form.formState.errors.name]} />
          <span className={cn("text-body-xs", nameCount >= 100 ? "text-destructive" : nameCount >= 80 ? "text-amber-500" : "text-muted-foreground")} aria-live="polite">
            {nameCount}/100
          </span>
        </FieldContent>
      </Field>
      <Field data-invalid={!!form.formState.errors.role}>
        <FieldLabel htmlFor="role">{t("members.form.fields.role")}</FieldLabel>
        <FieldContent>
          <Input id="role" placeholder={t("members.form.fields.placeholders.role")} aria-invalid={!!form.formState.errors.role} {...form.register("role")} />
          <FieldError errors={[form.formState.errors.role]} />
          <span className={cn("text-body-xs", roleCount >= 100 ? "text-destructive" : roleCount >= 80 ? "text-amber-500" : "text-muted-foreground")} aria-live="polite">
            {roleCount}/100
          </span>
        </FieldContent>
      </Field>
      <Field data-invalid={!!form.formState.errors.bio}>
        <FieldLabel htmlFor="bio">{t("members.form.fields.bioOptional")}</FieldLabel>
        <FieldContent>
          <Textarea id="bio" placeholder={t("members.form.fields.placeholders.bio")} rows={3} aria-invalid={!!form.formState.errors.bio} {...form.register("bio")} />
          <FieldError errors={[form.formState.errors.bio]} />
          <span className={cn("text-body-xs", bioCount >= 500 ? "text-destructive" : bioCount >= 400 ? "text-amber-500" : "text-muted-foreground")} aria-live="polite">
            {bioCount}/500
          </span>
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel htmlFor="avatar">{t("members.form.fields.avatar")}</FieldLabel>
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
