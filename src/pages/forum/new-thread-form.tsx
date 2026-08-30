import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { ForumCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldGroup, Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useSuccessTimer } from "@/hooks/useSuccessTimer";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SEO } from "@/components/shared/SEO";
import { seoConfig } from "@/config/seo";
import { useTranslation } from "react-i18next";

export function NewThreadForm() {
  const { t } = useTranslation("forum");
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const threadSchema = z.object({
    title: z.string().min(5, t("validationTitleMin")).max(200, t("validationTitleMax")),
    content: z.string().min(10, t("validationContentMin")).max(5000, t("validationContentMax")),
  });

  type ThreadFormData = z.infer<typeof threadSchema>;

  const { data: categories } = useQuery<ForumCategory[]>({
    queryKey: ["forum-categories"],
    queryFn: () => api.get("/forum/categories"),
  });

  const categoryName = categories?.find((c) => c.id === categoryId)?.name ?? categoryId ?? "Forum";

  const form = useForm<ThreadFormData>({
    resolver: zodResolver(threadSchema),
    defaultValues: { title: "", content: "" },
  });

  const titleCount = form.watch("title").length;
  const contentCount = form.watch("content").length;
  const { showSuccess, setShowSuccess, successTimer } = useSuccessTimer();

  const mutation = useMutation({
    mutationFn: (data: ThreadFormData) => api.post(`/forum/${categoryId}/threads`, data),
  });

  function onSubmit(data: ThreadFormData) {
    mutation.mutate(data, {
      onSuccess: () => {
        toast.success(t("threadCreatedSuccess"));
        setShowSuccess(true);
        successTimer.current = setTimeout(() => navigate(`/forum/${categoryId}`), 400);
      },
      onError: () => toast.error(t("threadCreatedError")),
    });
  }

  return (
    <>
      <SEO {...seoConfig.newThread} />
      <Breadcrumbs trail={[
        { label: t("breadcrumbsHome"), href: "/" },
        { label: t("breadcrumbsForum"), href: "/forum" },
        { label: categoryName, href: `/forum/${categoryId}` },
        { label: t("newThreadTitle") },
      ]} />
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to={`/forum/${categoryId}`}>
        <Button variant="ghost" className="mb-8">
          <ArrowLeft data-icon="inline-start" /> {t("backToThreads")}
        </Button>
      </Link>

      <div className="mb-8">
        <p className="font-display text-overline text-accent">{t("newThreadTitle")}</p>
        <h1 className="font-heading text-h2 mt-1 text-foreground">
          {t("startConversation")}
        </h1>
      </div>

      {/* fallow-ignore-next-line code-duplication */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FieldGroup className={cn("transition-all duration-500", showSuccess && "ring-2 ring-green-500/50 rounded-lg")}>
          <Field data-invalid={!!form.formState.errors.title}>
            <FieldLabel htmlFor="title">{t("threadTitle")}</FieldLabel>
            <FieldContent>
              <Input
                id="title"
                placeholder={t("threadTitlePlaceholder")}
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
            <FieldLabel htmlFor="content">{t("message")}</FieldLabel>
            <FieldContent>
              <Textarea
                id="content"
                placeholder={t("messagePlaceholder")}
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
            <><Spinner className="me-2" /> {t("posting")}</>
          ) : t("postThread")}
        </Button>
      </form>
    </div>
    </>
  );
}
