import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { galleryCategories } from "@/config";
import type { GalleryItem } from "@/types";
import type { GalleryFormValues } from "@/components/shared/GalleryFormFields";

const gallerySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title must be at most 200 characters"),
  description: z.string().max(1000, "Description must be at most 1000 characters").optional().or(z.literal("")),
  category: z.enum(galleryCategories as unknown as [string, ...string[]], { message: "Please select a category" }),
  eventId: z.string().optional(),
  tags: z.string().max(300, "Tags must be at most 300 characters").optional().or(z.literal("")),
  imageUrl: z.string().optional(),
  image: z.union([z.instanceof(File), z.string()]).optional().nullable(),
});

function normalizeTags(raw: string | undefined): string[] {
  if (!raw) return [];
  return [...new Set(raw.split(",").map((t) => t.trim()).filter((t) => t.length > 0))];
}

export function useGalleryForm() {
  const [showSuccess, setShowSuccess] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const { data: item } = useQuery<GalleryItem>({
    queryKey: ["gallery", "admin", id],
    queryFn: () => api.get(`/gallery/admin/${id}`),
    enabled: isEditing,
    retry: false,
  });

  const form = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    values: item ? {
      title: item.title,
      description: item.description ?? "",
      category: item.category,
      eventId: item.eventId ?? "",
      tags: item.tags.join(", "),
      imageUrl: item.imageUrl,
      image: null,
    } : undefined,
    defaultValues: !isEditing ? {
      title: "",
      description: "",
      category: "" as GalleryFormValues["category"],
      eventId: "",
      tags: "",
      imageUrl: "",
      image: null,
    } : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (data: GalleryFormValues) => {
      let imageUrl = data.imageUrl ?? "";
      let thumbnailUrl: string | undefined;
      if (data.image instanceof File) {
        const fd = new FormData();
        fd.append("file", data.image);
        const res = await api.upload<{ imageUrl: string; thumbnailUrl?: string }>("/gallery/upload", fd);
        imageUrl = res.imageUrl;
        thumbnailUrl = res.thumbnailUrl;
      }
      if (!imageUrl && !(data.image instanceof File)) {
        throw new Error("Image is required");
      }
      const payload = {
        title: data.title,
        description: data.description || undefined,
        category: data.category,
        eventId: data.eventId || null,
        tags: normalizeTags(data.tags),
        imageUrl,
        ...(thumbnailUrl ? { thumbnailUrl } : {}),
      };
      return isEditing
        ? api.patch(`/gallery/${id}`, payload)
        : api.post("/gallery", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast.success(isEditing ? "Item updated successfully." : "Photo uploaded successfully.");
      setShowSuccess(true);
      timeoutRef.current = window.setTimeout(() => navigate("/admin/gallery"), 400);
    },
    onError: (error) => {
      if (error instanceof Error && error.message === "Image is required") {
        form.setError("image", { message: "Image is required" });
        return;
      }
      toast.error("Failed to save item.");
    },
  });

  function onSubmit(data: GalleryFormValues) {
    mutation.mutate(data);
  }

  return { form, mutation, onSubmit, showSuccess, isEditing };
}
