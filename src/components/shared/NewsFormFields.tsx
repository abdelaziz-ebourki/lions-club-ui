import { Controller, type UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldGroup, Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { FileUpload } from "@/components/ui/file-upload";
import { newsCategories } from "@/config";
import { RichTextEditor } from "@/components/shared/RichTextEditor";

interface NewsFormFieldsProps {
  form: UseFormReturn<{
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    featuredImage?: File | string | null;
    category: "Announcement" | "News" | "Event Recap" | "Press Release";
    status: "draft" | "published" | "archived";
    publishedAt?: string | null;
  }>;
  title: string;
  excerpt: string;
  handleTitleChange: (value: string) => void;
  handleSlugChange: (value: string) => void;
  showSuccess: boolean;
  mutationPending: boolean;
}

export function NewsFormFields({ form, title, excerpt, handleTitleChange, handleSlugChange, showSuccess, mutationPending }: NewsFormFieldsProps) {
  return (
    <FieldGroup className={cn("transition-all duration-500", showSuccess && "ring-2 ring-green-500/50 rounded-lg")}>
      <Field data-invalid={!!form.formState.errors.title}>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <FieldContent>
          <Input
            id="title"
            placeholder="Article title"
            aria-invalid={!!form.formState.errors.title}
            {...form.register("title", { onChange: (e) => handleTitleChange(e.target.value) })}
          />
          <FieldError errors={[form.formState.errors.title]} />
          <span className={cn("text-body-xs", title.length >= 200 ? "text-destructive" : title.length >= 160 ? "text-amber-500" : "text-muted-foreground")} aria-live="polite">
            {title.length}/200
          </span>
        </FieldContent>
      </Field>

      <Field data-invalid={!!form.formState.errors.slug}>
        <FieldLabel htmlFor="slug">Slug</FieldLabel>
        <FieldContent>
          <Controller
            name="slug"
            control={form.control}
            render={({ field }) => (
              <Input
                id="slug"
                placeholder="article-slug"
                aria-invalid={!!form.formState.errors.slug}
                value={field.value}
                onChange={(e) => handleSlugChange(e.target.value)}
              />
            )}
          />
          <FieldError errors={[form.formState.errors.slug]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="featuredImage">Featured Image</FieldLabel>
        <FieldContent>
          <Controller
            name="featuredImage"
            control={form.control}
            render={({ field, fieldState }) => (
              <FileUpload
                id="featuredImage"
                value={field.value ?? null}
                onChange={(file) => field.onChange(file)}
                error={fieldState.error?.message}
                loading={mutationPending}
              />
            )}
          />
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
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger aria-label="Category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {newsCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[form.formState.errors.category]} />
          </FieldContent>
        </Field>

        <Field data-invalid={!!form.formState.errors.status}>
          <FieldLabel htmlFor="status">Status</FieldLabel>
          <FieldContent>
            <Controller
              name="status"
              control={form.control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger aria-label="Status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[form.formState.errors.status]} />
          </FieldContent>
        </Field>

        <Field data-invalid={!!form.formState.errors.publishedAt}>
          <FieldLabel htmlFor="publishedAt">Publish Date <span className="text-muted-foreground text-body-xs">(optional)</span></FieldLabel>
          <FieldContent>
            <Controller
              name="publishedAt"
              control={form.control}
              render={({ field }) => (
                <Input
                  id="publishedAt"
                  type="datetime-local"
                  value={field.value ? field.value.slice(0, 16) : ""}
                  onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value).toISOString() : null)}
                  disabled={mutationPending}
                />
              )}
            />
            <FieldError errors={[form.formState.errors.publishedAt]} />
          </FieldContent>
        </Field>
      </div>

      <Field data-invalid={!!form.formState.errors.content}>
        <FieldLabel htmlFor="content">Content</FieldLabel>
        <FieldContent>
          <Controller
            name="content"
            control={form.control}
            render={({ field }) => (
              <RichTextEditor value={field.value} onChange={field.onChange} />
            )}
          />
          <FieldError errors={[form.formState.errors.content]} />
        </FieldContent>
      </Field>

      <Field data-invalid={!!form.formState.errors.excerpt}>
        <FieldLabel htmlFor="excerpt">Excerpt <span className="text-muted-foreground text-body-xs">(optional)</span></FieldLabel>
        <FieldContent>
          <Textarea id="excerpt" placeholder="Brief summary of the article" rows={3} aria-invalid={!!form.formState.errors.excerpt} {...form.register("excerpt")} />
          <FieldError errors={[form.formState.errors.excerpt]} />
          <span className={cn("text-body-xs", excerpt.length >= 500 ? "text-destructive" : excerpt.length >= 400 ? "text-amber-500" : "text-muted-foreground")} aria-live="polite">
            {excerpt.length}/500
          </span>
        </FieldContent>
      </Field>
    </FieldGroup>
  );
}
