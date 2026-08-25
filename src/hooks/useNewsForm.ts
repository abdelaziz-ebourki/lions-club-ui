import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { uploadConfig, newsCategories } from "@/config";
import type { NewsArticle } from "@/types";
import { useSuccessTimer } from "@/hooks/useSuccessTimer";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

const newsSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title must be at most 200 characters"),
  slug: z.string().min(1, "Slug is required").max(250)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  content: z.string().min(1, "Content is required").transform((val) => stripHtml(val)).refine((val) => val.length > 0, "Content is required"),
  excerpt: z.string().max(500, "Excerpt must be at most 500 characters").optional().or(z.literal("")),
  featuredImage: z.union([z.instanceof(File), z.string()]).optional().nullable(),
  category: z.enum(newsCategories),
  status: z.enum(["draft", "published", "archived"]),
  publishedAt: z.string().datetime({ offset: true }).optional().nullable(),
}).superRefine((data, ctx) => {
  if (data.featuredImage instanceof File) {
    if (!uploadConfig.acceptedTypes.includes(data.featuredImage.type)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select a valid image file (PNG, JPG, WebP)", path: ["featuredImage"] });
    }
    if (data.featuredImage.size > uploadConfig.maxSize) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "File size must be under 5MB", path: ["featuredImage"] });
    }
  }
});

type NewsFormData = z.infer<typeof newsSchema>;

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function useNewsForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const { data: article } = useQuery<NewsArticle>({
    queryKey: ["news", "admin", id],
    queryFn: () => api.get(`/news/admin/${id}`),
    enabled: isEditing,
  });

  const form = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    values: article ? {
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt,
      featuredImage: article.featuredImage,
      category: article.category,
      status: article.status,
      publishedAt: article.publishedAt ?? null,
    } : undefined,
    defaultValues: !isEditing ? {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      featuredImage: undefined,
      category: "News",
      status: "draft",
      publishedAt: null,
    } : undefined,
  });

  const title = form.watch("title") ?? "";
  const slug = form.watch("slug") ?? "";
  const content = form.watch("content") ?? "";
  const excerpt = form.watch("excerpt") ?? "";
  const { showSuccess, setShowSuccess, successTimer } = useSuccessTimer();

  const slugTouched = React.useRef(false);

  function handleTitleChange(value: string) {
    const currentSlug = form.getValues("slug");
    const expectedSlug = slugify(value);
    // Only auto-update slug if user hasn't manually edited it
    if ((!isEditing && !slugTouched.current) || (isEditing && currentSlug === slugify(article?.title ?? ""))) {
      form.setValue("slug", expectedSlug, { shouldValidate: false });
    }
  }

  function handleSlugChange(value: string) {
    slugTouched.current = value.length > 0;
    form.setValue("slug", value, { shouldValidate: true });
  }

  const mutation = useMutation({
    mutationFn: (data: NewsFormData) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("content", data.content);
      formData.append("excerpt", data.excerpt ?? "");
      formData.append("category", data.category);
      formData.append("status", data.status);
      if (data.publishedAt) {
        formData.append("publishedAt", data.publishedAt);
      }
      if (data.featuredImage instanceof File) {
        formData.append("featuredImage", data.featuredImage);
      } else if (data.featuredImage) {
        formData.append("featuredImage", data.featuredImage);
      }
      return api.upload(
        isEditing ? `/news/${id!}` : "/news",
        formData,
        isEditing ? "PUT" : undefined,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toast.success(isEditing ? "Article updated successfully." : "Article created successfully.");
      setShowSuccess(true);
      successTimer.current = setTimeout(() => navigate("/admin/news"), 400);
    },
    onError: () => toast.error("Failed to save article."),
  });

  function onSubmit(data: NewsFormData) {
    mutation.mutate(data);
  }

  return {
    form,
    mutation,
    onSubmit,
    showSuccess,
    title,
    slug,
    content,
    excerpt,
    publishedAt: form.watch("publishedAt"),
    handleTitleChange,
    handleSlugChange,
    isEditing,
    article,
  };
}
