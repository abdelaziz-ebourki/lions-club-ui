import { Controller, type UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldGroup, Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { FileUpload } from "@/components/ui/file-upload";
import { eventCategories } from "@/config";

interface EventFormFieldsProps {
  form: UseFormReturn<{
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    category: string;
    status: "upcoming" | "ongoing" | "past";
    image?: File | string | null;
  }>;
  titleCount: number;
  descCount: number;
  locationCount: number;
  showSuccess: boolean;
  mutationPending: boolean;
}

export function EventFormFields({ form, titleCount, descCount, locationCount, showSuccess, mutationPending }: EventFormFieldsProps) {
  return (
    <FieldGroup className={cn("transition-all duration-500", showSuccess && "ring-2 ring-green-500/50 rounded-lg")}>
      {/* fallow-ignore-next-line code-duplication */}
      <Field data-invalid={!!form.formState.errors.title}>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <FieldContent>
          <Input id="title" placeholder="Event title" aria-invalid={!!form.formState.errors.title} {...form.register("title")} />
          <FieldError errors={[form.formState.errors.title]} />
          <span className={cn("text-body-xs", titleCount >= 200 ? "text-destructive" : titleCount >= 160 ? "text-amber-500" : "text-muted-foreground")} aria-live="polite">
            {titleCount}/200
          </span>
        </FieldContent>
      </Field>
      <Field data-invalid={!!form.formState.errors.description}>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <FieldContent>
          <Textarea id="description" placeholder="Describe the event" rows={4} aria-invalid={!!form.formState.errors.description} {...form.register("description")} />
          <FieldError errors={[form.formState.errors.description]} />
          <span className={cn("text-body-xs", descCount >= 2000 ? "text-destructive" : descCount >= 1600 ? "text-amber-500" : "text-muted-foreground")} aria-live="polite">
            {descCount}/2000
          </span>
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel htmlFor="image">Event Image</FieldLabel>
        <FieldContent>
          <Controller
            name="image"
            control={form.control}
            render={({ field, fieldState }) => (
              <FileUpload
                id="image"
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
        <Field data-invalid={!!form.formState.errors.date}>
          <FieldLabel htmlFor="date">Date</FieldLabel>
          <FieldContent>
            <Input id="date" type="date" aria-invalid={!!form.formState.errors.date} {...form.register("date")} />
            <FieldError errors={[form.formState.errors.date]} />
          </FieldContent>
        </Field>
        <Field data-invalid={!!form.formState.errors.time}>
          <FieldLabel htmlFor="time">Time</FieldLabel>
          <FieldContent>
            <Input id="time" type="time" aria-invalid={!!form.formState.errors.time} {...form.register("time")} />
            <FieldError errors={[form.formState.errors.time]} />
          </FieldContent>
        </Field>
      </div>
      <Field data-invalid={!!form.formState.errors.location}>
        <FieldLabel htmlFor="location">Location</FieldLabel>
        <FieldContent>
          <Input id="location" placeholder="Event location" aria-invalid={!!form.formState.errors.location} {...form.register("location")} />
          <FieldError errors={[form.formState.errors.location]} />
          <span className={cn("text-body-xs", locationCount >= 200 ? "text-destructive" : locationCount >= 160 ? "text-amber-500" : "text-muted-foreground")} aria-live="polite">
            {locationCount}/200
          </span>
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
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger aria-label="Category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventCategories.map((cat) => (
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
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger aria-label="Status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="past">Past</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[form.formState.errors.status]} />
          </FieldContent>
        </Field>
      </div>
    </FieldGroup>
  );
}
