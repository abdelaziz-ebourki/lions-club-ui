import { Controller, type UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldGroup, Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { FileUpload } from "@/components/ui/file-upload";
import { useTranslation } from "react-i18next";
import { galleryCategories } from "@/config";

export interface GalleryFormValues {
  title: string;
  description?: string;
  category: string;
  eventId?: string;
  tags?: string;
  imageUrl?: string;
  image?: File | string | null;
}

interface GalleryFormFieldsProps {
  form: UseFormReturn<GalleryFormValues>;
  events: { id: string; title: string }[];
}

export function GalleryFormFields({ form, events }: GalleryFormFieldsProps) {
  const { t } = useTranslation("admin");
  return (
    <FieldGroup>
      <Field data-invalid={!!form.formState.errors.image}>
        <FieldLabel htmlFor="gallery-image">{t("gallery.form.fields.photo")}</FieldLabel>
        <FieldContent>
          <Controller
            name="image"
            control={form.control}
            render={({ field }) => (
              <FileUpload
                id="gallery-image"
                value={field.value ?? null}
                onChange={(file) => field.onChange(file)}
                aria-invalid={!!form.formState.errors.image}
              />
            )}
          />
          <FieldError errors={[form.formState.errors.image]} />
        </FieldContent>
      </Field>

      <Field data-invalid={!!form.formState.errors.title}>
        <FieldLabel htmlFor="title">{t("gallery.form.fields.title")}</FieldLabel>
        <FieldContent>
          <Input id="title" placeholder={t("gallery.form.fields.placeholders.title")} aria-invalid={!!form.formState.errors.title} {...form.register("title")} />
          <FieldError errors={[form.formState.errors.title]} />
        </FieldContent>
      </Field>

      <Field data-invalid={!!form.formState.errors.description}>
        <FieldLabel htmlFor="description">{t("gallery.form.fields.description")}</FieldLabel>
        <FieldContent>
          <Textarea id="description" rows={3} placeholder={t("gallery.form.fields.placeholders.description")} {...form.register("description")} />
          <FieldError errors={[form.formState.errors.description]} />
        </FieldContent>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field data-invalid={!!form.formState.errors.category}>
          <FieldLabel htmlFor="category">{t("gallery.form.fields.category")}</FieldLabel>
          <FieldContent>
            <Controller
              name="category"
              control={form.control}
              render={({ field }) => (
                <Select value={field.value as string} onValueChange={field.onChange}>
                  <SelectTrigger id="category" aria-label={t("gallery.form.fields.category")}>
                    <SelectValue placeholder={t("gallery.form.fields.placeholders.category")} />
                  </SelectTrigger>
                  <SelectContent>
                    {galleryCategories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[form.formState.errors.category]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="event-link">{t("gallery.form.fields.eventLink")}</FieldLabel>
          <FieldContent>
            <Controller
              name="eventId"
              control={form.control}
              render={({ field }) => (
                <Select value={(field.value as string) ?? ""} onValueChange={(v) => field.onChange(!v || v === "No event" ? "" : v)}>
                  <SelectTrigger id="event-link" aria-label={t("gallery.form.fields.eventLink")}>
                    <SelectValue placeholder={t("gallery.form.fields.placeholders.eventLink")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No event">{t("gallery.form.fields.noEvent")}</SelectItem>
                    {events.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FieldContent>
        </Field>
      </div>

      <Field data-invalid={!!form.formState.errors.tags}>
        <FieldLabel htmlFor="tags">{t("gallery.form.fields.tags")}</FieldLabel>
        <FieldContent>
          <Input id="tags" placeholder={t("gallery.form.fields.placeholders.tags")} aria-describedby="tags-hint" {...form.register("tags")} />
          <p id="tags-hint" className="text-body-xs text-muted-foreground">{t("gallery.form.fields.hints.tags")}</p>
          <FieldError errors={[form.formState.errors.tags]} />
        </FieldContent>
      </Field>
    </FieldGroup>
  );
}
