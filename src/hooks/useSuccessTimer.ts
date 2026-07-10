import { useState, useRef, useEffect } from "react";

export function useSuccessTimer() {
  const [showSuccess, setShowSuccess] = useState(false);
  const successTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => void clearTimeout(successTimer.current), []);

  return { showSuccess, setShowSuccess, successTimer };
}
