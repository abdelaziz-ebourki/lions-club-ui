import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { GalleryItem, GalleryCategory } from "@/types";

interface PaginatedGalleryResponse {
  data: GalleryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GalleryFilters {
  category?: GalleryCategory | "";
  eventId?: string | "";
}

export function useGalleryList(page: number = 1, limit: number = 12, filters: GalleryFilters = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (filters.category) params.set("category", filters.category);
  if (filters.eventId) params.set("eventId", filters.eventId);
  return useQuery<PaginatedGalleryResponse>({
    queryKey: ["gallery", "list", page, limit, filters.category ?? null, filters.eventId ?? null],
    queryFn: () => api.get(`/gallery?${params.toString()}`),
    placeholderData: keepPreviousData,
  });
}

export function useGalleryItem(id?: string) {
  return useQuery<GalleryItem>({
    queryKey: ["gallery", "detail", id],
    queryFn: () => api.get(`/gallery/${id}`),
    enabled: !!id,
    retry: false,
  });
}
