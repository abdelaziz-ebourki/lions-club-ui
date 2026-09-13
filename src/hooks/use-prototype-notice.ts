import { useCallback, useState } from "react";
import { appConfig, prototypeNoticeStorageKey } from "@/config";

function getInitialOpen(): boolean {
  if (!appConfig.isMock) return false;
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(prototypeNoticeStorageKey) !== "1";
  } catch {
    return true;
  }
}

export function usePrototypeNotice() {
  const [open, setOpen] = useState(getInitialOpen);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleContinue = useCallback(() => {
    if (dontShowAgain) {
      try {
        window.localStorage.setItem(prototypeNoticeStorageKey, "1");
      } catch {
        // ignore
      }
    }
    setOpen(false);
  }, [dontShowAgain]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        handleContinue();
        return;
      }
      setOpen(nextOpen);
    },
    [handleContinue]
  );

  return {
    open,
    setOpen,
    dontShowAgain,
    setDontShowAgain,
    handleContinue,
    handleOpenChange,
    isMock: appConfig.isMock,
  };
}
