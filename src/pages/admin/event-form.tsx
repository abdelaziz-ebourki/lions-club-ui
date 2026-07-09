import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Event } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldGroup, Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { FileUpload } from "@/components/ui/file-upload";
import { uploadConfig } from "@/config";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { eventCategories } from "@/config";

const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title must be at most 200 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000, "Description must be at most 2000 characters"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(3, "Location is required").max(200, "Location must be at most 200 characters"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["upcoming", "ongoing", "past"]),
  image: z.union([z.instanceof(File), z.string()]).optional(),
}).superRefine((data, ctx) => {
  if (data.image instanceof File) {
    if (!uploadConfig.acceptedTypes.includes(data.image.type)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select a valid image file (PNG, JPG, WebP)", path: ["image"] });
    }
    if (data.image.size > uploadConfig.maxSize) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "File size must be under 5MB", path: ["image"] });
    }
  }
});

type EventFormData = z.infer<typeof eventSchema>;

export function EventFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const { data: event } = useQuery<Event>({
    queryKey: ["event", id],
    queryFn: () => api.get(`/events/${id}`),
    enabled: isEditing,
  });

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    values: event ? {
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      status: event.status,
      image: event.image,
    } : undefined,
    defaultValues: !isEditing ? {
      title: "", description: "", date: "", time: "",
      location: "", category: "", status: "upcoming", image: undefined,
    } : undefined,
  });

  const titleCount = form.watch("title").length;
  const descCount = form.watch("description").length;
  const locationCount = form.watch("location").length;
  const [showSuccess, setShowSuccess] = useState(false);
  const successTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => void clearTimeout(successTimer.current), []);

  const mutation = useMutation({
    mutationFn: (data: EventFormData) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("date", data.date);
      formData.append("time", data.time);
      formData.append("location", data.location);
      formData.append("category", data.category);
      formData.append("status", data.status);
      if (data.image instanceof File) {
        formData.append("image", data.image);
      } else if (data.image) {
        formData.append("image", data.image);
      }
      return api.upload(
        isEditing ? `/events/${id!}` : "/events",
        formData,
        isEditing ? "PUT" : undefined,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success(isEditing ? "Project updated successfully." : "Project created successfully.");
      setShowSuccess(true);
      successTimer.current = setTimeout(() => navigate("/admin/events"), 400);
    },
    onError: () => toast.error("Failed to save project."),
  });

  function onSubmit(data: EventFormData) {
    mutation.mutate(data);
  }

  return (
    <div>
      <Link to="/admin/events">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft data-icon="inline-start" /> Back to Events
        </Button>
      </Link>

      <div className="mb-8">
        <p className="font-display text-overline text-accent">
          {isEditing ? "Edit" : "New"} Project
        </p>
        <h1 className="font-heading text-h2 mt-1 text-foreground">
          {isEditing ? "Edit Project" : "Create Project"}
        </h1>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <FieldGroup className={cn("transition-all duration-500", showSuccess && "ring-2 ring-green-500/50 rounded-lg")}>
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
          <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto">
            {mutation.isPending ? (
              <><Spinner className="mr-2" /> Saving...</>
            ) : isEditing ? "Update Project" : "Create Project"}
          </Button>
        </form>
      </div>
    </div>
  );
}
