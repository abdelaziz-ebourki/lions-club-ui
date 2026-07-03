import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldGroup, Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const threadSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200, "Title must be at most 200 characters"),
  content: z.string().min(10, "Content must be at least 10 characters").max(5000, "Content must be at most 5000 characters"),
});

type ThreadFormData = z.infer<typeof threadSchema>;

export function NewThreadForm() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const form = useForm<ThreadFormData>({
    resolver: zodResolver(threadSchema),
    defaultValues: { title: "", content: "" },
  });

  const titleCount = form.watch("title").length;
  const contentCount = form.watch("content").length;
  const [showSuccess, setShowSuccess] = useState(false);
  const successTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => void clearTimeout(successTimer.current), []);

  const mutation = useMutation({
    mutationFn: (data: ThreadFormData) => api.post(`/forum/${categoryId}/threads`, data),
  });

  function onSubmit(data: ThreadFormData) {
    mutation.mutate(data, {
      onSuccess: () => {
        toast.success("Thread created successfully!");
        setShowSuccess(true);
        successTimer.current = setTimeout(() => navigate(`/forum/${categoryId}`), 400);
      },
      onError: () => toast.error("Failed to create thread. Please try again."),
    });
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to={`/forum/${categoryId}`}>
        <Button variant="ghost" className="mb-8">
          <ArrowLeft data-icon="inline-start" /> Back to Threads
        </Button>
      </Link>

      <div className="mb-8">
        <p className="font-display text-overline text-accent">New Thread</p>
        <h1 className="font-heading text-h2 mt-1 text-foreground">
          Start a Conversation
        </h1>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FieldGroup className={cn("transition-all duration-500", showSuccess && "ring-2 ring-green-500/50 rounded-lg")}>
          <Field data-invalid={!!form.formState.errors.title}>
            <FieldLabel htmlFor="title">Thread Title</FieldLabel>
            <FieldContent>
              <Input
                id="title"
                placeholder="What would you like to discuss?"
                aria-invalid={!!form.formState.errors.title}
                {...form.register("title")}
                autoComplete="off"
              />
              <FieldError errors={[form.formState.errors.title]} />
              <span className={cn("text-body-xs", titleCount >= 200 ? "text-destructive" : titleCount >= 160 ? "text-amber-500" : "text-muted-foreground")} aria-live="polite">
                {titleCount}/200
              </span>
            </FieldContent>
          </Field>
          <Field data-invalid={!!form.formState.errors.content}>
            <FieldLabel htmlFor="content">Message</FieldLabel>
            <FieldContent>
              <Textarea
                id="content"
                placeholder="Share your thoughts with the community..."
                rows={8}
                aria-invalid={!!form.formState.errors.content}
                {...form.register("content")}
                autoComplete="off"
              />
              <FieldError errors={[form.formState.errors.content]} />
              <span className={cn("text-body-xs", contentCount >= 5000 ? "text-destructive" : contentCount >= 4000 ? "text-amber-500" : "text-muted-foreground")} aria-live="polite">
                {contentCount}/5000
              </span>
            </FieldContent>
          </Field>
        </FieldGroup>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? (
            <><Spinner className="mr-2" /> Posting...</>
          ) : "Post Thread"}
        </Button>
      </form>
    </div>
  );
}
