import { useState, useCallback, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import type { ForgotPasswordRequest, ResetPasswordRequest } from "@/types";

const COOLDOWN_SECONDS = 60;

export function usePasswordReset() {
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
      toast.success("If an account exists, a reset link has been sent to your email");
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
      const message = error instanceof ApiError || error instanceof Error ? error.message : "Failed to send reset link";
      // Handle 429 with nextResendAt? Just toast generic
      toast.error(message);
    },
  });

  const resetMutation = useMutation({
    mutationFn: ({ token, password, confirmPassword }: ResetPasswordRequest) =>
      api.post<ResetPasswordRequest>(`/auth/reset-password?token=${encodeURIComponent(token)}`, { password, confirmPassword } as ResetPasswordRequest, { skipAuthExpired: true }),
    onSuccess: () => {
      toast.success("Password has been reset successfully");
    },
    onError: (error: unknown) => {
      const message = error instanceof ApiError || error instanceof Error ? error.message : "Failed to reset password";
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
