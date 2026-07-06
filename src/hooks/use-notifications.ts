import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Notification } from "@/types";

interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}

export function useNotifications() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery<NotificationsResponse>({
    queryKey: ["notifications"],
    queryFn: () => api.get<NotificationsResponse>("/notifications"),
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => api.put(`/notifications/${id}/read`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => api.put("/notifications/read-all", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    notifications: data?.notifications ?? [],
    unreadCount: data?.unreadCount ?? 0,
    isLoading,
    isError,
    error,
    refetch,
    markAsRead: markAsReadMutation.mutate,
    markAllRead: markAllReadMutation.mutate,
    isMarkingRead: markAsReadMutation.isPending,
    isMarkingAllRead: markAllReadMutation.isPending,
  };
}
