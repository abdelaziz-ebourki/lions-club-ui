import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { UserProfile } from "@/types";

export function useProfileQuery() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: () => api.get<UserProfile>("/user/profile"),
  });
}
