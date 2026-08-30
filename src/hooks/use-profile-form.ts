import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { UserProfile } from "@/types";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be 100 characters or less"),
  email: z.string().email("Please enter a valid email address"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export function useProfileForm(profile: UserProfile | undefined) {
  const { t } = useTranslation("profile");
  const queryClient = useQueryClient();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      name: profile?.name ?? "",
      email: profile?.email ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ProfileFormData) =>
      api.put<UserProfile>("/user/profile", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success(t("updateSuccess"));
    },
    onError: () => {
      toast.error(t("updateError"));
    },
  });

  return { form, mutation };
}
