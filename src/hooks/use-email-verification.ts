import { useState, useCallback, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/auth";

const COOLDOWN_SECONDS = 60;

export type VerifyResult =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success" }
  | { status: "already-verified" }
  | { status: "expired" }
  | { status: "error"; message: string };

export function useEmailVerification() {
  const { isEmailVerified, refreshUser } = useAuth();
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [verifyResult, setVerifyResult] = useState<VerifyResult>({ status: "idle" });
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const resendMutation = useMutation({
    mutationFn: () => api.post("/auth/resend-verification", {}),
    onSuccess: () => {
      toast.success("Verification email sent");
      setIsCooldown(true);
      setCooldownSeconds(COOLDOWN_SECONDS);
      intervalRef.current = setInterval(() => {
        setCooldownSeconds((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsCooldown(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    onError: () => {
      toast.error("Failed to send verification email. Please try again.");
    },
  });

  const verifyMutation = useMutation({
    mutationFn: (token: string) => api.post(`/auth/verify-email?token=${encodeURIComponent(token)}`, {}),
    onSuccess: () => {
      if (isEmailVerified) {
        setVerifyResult({ status: "already-verified" });
        toast.success("Email already verified");
      } else {
        setVerifyResult({ status: "success" });
        toast.success("Email verified successfully");
      }
      refreshUser();
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      const message = error?.response?.data?.error ?? "";
      if (message.toLowerCase().includes("expired")) {
        setVerifyResult({ status: "expired" });
      } else {
        setVerifyResult({ status: "error", message });
      }
    },
  });

  const resend = useCallback(async () => {
    await resendMutation.mutateAsync();
  }, [resendMutation]);

  const verify = useCallback(async (token: string) => {
    setVerifyResult({ status: "loading" });
    return verifyMutation.mutateAsync(token);
  }, [verifyMutation]);

  return {
    isVerified: isEmailVerified,
    isCooldown,
    cooldownSeconds,
    resend,
    verify,
    isVerifying: verifyMutation.isPending,
    verifyResult,
  };
}
