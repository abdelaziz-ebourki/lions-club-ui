import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Event } from "@/types";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { uploadConfig } from "@/config";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useSuccessTimer } from "@/hooks/useSuccessTimer";
import { EventFormFields } from "@/components/shared/EventFormFields";

const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title must be at most 200 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000, "Description must be at most 2000 characters"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(3, "Location is required").max(200, "Location must be at most 200 characters"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["upcoming", "ongoing", "past"]),
  image: z.union([z.instanceof(File), z.string()]).optional().nullable(),
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
      title: event.title, description: event.description, date: event.date,
      time: event.time, location: event.location, category: event.category,
      status: event.status, image: event.image,
    } : undefined,
    defaultValues: !isEditing ? {
      title: "", description: "", date: "", time: "",
      location: "", category: "", status: "upcoming", image: undefined,
    } : undefined,
  });

  const titleCount = form.watch("title").length;
  const descCount = form.watch("description").length;
  const locationCount = form.watch("location").length;
  const { showSuccess, setShowSuccess, successTimer } = useSuccessTimer();

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
          <EventFormFields
            form={form}
            titleCount={titleCount}
            descCount={descCount}
            locationCount={locationCount}
            showSuccess={showSuccess}
            mutationPending={mutation.isPending}
          />
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
