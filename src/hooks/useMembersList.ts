import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Member } from "@/types";

export function useMembersList() {
  return useQuery<Member[]>({
    queryKey: ["members"],
    queryFn: () => api.get("/members"),
    select: (data) =>
      [...(data as Member[])].sort(
        (a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
      ),
  });
}

export function useMember(id?: string) {
  return useQuery<Member>({
    queryKey: ["member", id],
    queryFn: () => api.get(`/members/${id}`),
    enabled: !!id,
    retry: false,
  });
}
