import { Controller, type UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldGroup, Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { FileUpload } from "@/components/ui/file-upload";
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
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="gallery-image">Photo</FieldLabel>
        <FieldContent>
          <Controller
            name="image"
            control={form.control}
            render={({ field }) => (
              <FileUpload
                id="gallery-image"
                value={field.value ?? null}
                onChange={(file) => field.onChange(file)}
              />
            )}
          />
        </FieldContent>
      </Field>

      <Field data-invalid={!!form.formState.errors.title}>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <FieldContent>
          <Input id="title" placeholder="Photo title" aria-invalid={!!form.formState.errors.title} {...form.register("title")} />
          <FieldError errors={[form.formState.errors.title]} />
        </FieldContent>
      </Field>

      <Field data-invalid={!!form.formState.errors.description}>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <FieldContent>
          <Textarea id="description" rows={3} placeholder="Optional caption" {...form.register("description")} />
          <FieldError errors={[form.formState.errors.description]} />
        </FieldContent>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field data-invalid={!!form.formState.errors.category}>
          <FieldLabel htmlFor="category">Category</FieldLabel>
          <FieldContent>
            <Controller
              name="category"
              control={form.control}
              render={({ field }) => (
                <Select value={field.value as string} onValueChange={field.onChange}>
                  <SelectTrigger id="category" aria-label="Category">
                    <SelectValue placeholder="Select category" />
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
          <FieldLabel htmlFor="event-link">Event link</FieldLabel>
          <FieldContent>
            <Controller
              name="eventId"
              control={form.control}
              render={({ field }) => (
                <Select value={(field.value as string) ?? ""} onValueChange={(v) => field.onChange(!v || v === "No event" ? "" : v)}>
                  <SelectTrigger id="event-link" aria-label="Event link">
                    <SelectValue placeholder="No event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No event">No event</SelectItem>
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
        <FieldLabel htmlFor="tags">Tags</FieldLabel>
        <FieldContent>
          <Input id="tags" placeholder="gala, fundraising" aria-describedby="tags-hint" {...form.register("tags")} />
          <p id="tags-hint" className="text-body-xs text-muted-foreground">Comma-separated — duplicates removed automatically.</p>
          <FieldError errors={[form.formState.errors.tags]} />
        </FieldContent>
      </Field>
    </FieldGroup>
  );
}
