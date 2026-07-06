import { useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useSessionTimeout(onExpired?: () => void) {
  const navigate = useNavigate();
  const onExpiredRef = useRef(onExpired);

  useEffect(() => {
    onExpiredRef.current = onExpired;
  });

  const handleSessionExpired = useCallback(() => {
    onExpiredRef.current?.();
    toast.error("Your session has expired. Please log in again.");
    const returnUrl = window.location.pathname;
    if (returnUrl !== "/login") {
      navigate(`/login?return=${encodeURIComponent(returnUrl)}`);
    }
  }, [navigate]);

  useEffect(() => {
    window.addEventListener("auth:expired", handleSessionExpired);
    return () => window.removeEventListener("auth:expired", handleSessionExpired);
  }, [handleSessionExpired]);

  return { handleSessionExpired };
}
