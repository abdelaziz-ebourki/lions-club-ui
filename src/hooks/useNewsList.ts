import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { NewsArticle } from "@/types";

interface PaginatedResponse {
  data: NewsArticle[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useNewsList(page: number = 1, limit: number = 10) {
  return useQuery<PaginatedResponse>({
    queryKey: ["news", "list", page, limit],
    queryFn: () => api.get(`/news?page=${page}&limit=${limit}`),
  });
}

export function useFeaturedNews() {
  return useQuery<Omit<NewsArticle, "content">[]>({
    queryKey: ["news", "featured"],
    queryFn: () => api.get("/news/featured"),
  });
}
