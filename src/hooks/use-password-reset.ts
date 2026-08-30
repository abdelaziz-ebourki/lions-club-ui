import { useState, useCallback, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import type { ForgotPasswordRequest, ResetPasswordRequest } from "@/types";

const COOLDOWN_SECONDS = 60;

export function usePasswordReset() {
  const { t } = useTranslation("auth");
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const forgotMutation = useMutation({
    mutationFn: (email: string) => api.post<ForgotPasswordRequest>("/auth/forgot-password", { email }, { skipAuthExpired: true }),
    onSuccess: () => {
      toast.success(t("forgot.success"));
      setIsCooldown(true);
      setCooldownSeconds(COOLDOWN_SECONDS);
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCooldownSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsCooldown(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    onError: (error: unknown) => {
      const message = error instanceof ApiError || error instanceof Error ? error.message : t("forgot.success");
      // Handle 429 with nextResendAt? Just toast generic
      toast.error(message);
    },
  });

  const resetMutation = useMutation({
    mutationFn: ({ token, password, confirmPassword }: ResetPasswordRequest) =>
      api.post<ResetPasswordRequest>(`/auth/reset-password?token=${encodeURIComponent(token)}`, { password, confirmPassword } as ResetPasswordRequest, { skipAuthExpired: true }),
    onSuccess: () => {
      toast.success(t("reset.success"));
    },
    onError: (error: unknown) => {
      const message = error instanceof ApiError || error instanceof Error ? error.message : t("errors:generic");
      toast.error(message);
    },
  });

  const forgot = useCallback(async (email: string) => await forgotMutation.mutateAsync(email), [forgotMutation]);
  const reset = useCallback(
    async (token: string, data: { password: string; confirmPassword: string }) =>
      await resetMutation.mutateAsync({ token, ...data }),
    [resetMutation]
  );

  return {
    forgot,
    reset,
    isCooldown,
    cooldownSeconds,
    isForgotPending: forgotMutation.isPending,
    isResetPending: resetMutation.isPending,
  };
}
