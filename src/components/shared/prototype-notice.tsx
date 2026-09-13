import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { usePrototypeNotice } from "@/hooks/use-prototype-notice";

export function PrototypeNotice() {
  const { t } = useTranslation("common");
  const { open, handleOpenChange, handleContinue, dontShowAgain, setDontShowAgain, isMock } = usePrototypeNotice();

  if (!isMock) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        aria-describedby="prototype-desc"
        className="max-w-lg gap-4"
        // prevent closing via escape from bypassing handleContinue logic — we handle via onOpenChange
      >
        <DialogHeader>
          <DialogTitle>{t("prototype.title")}</DialogTitle>
          <DialogDescription id="prototype-desc" className="sr-only">
            {t("prototype.body")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm leading-relaxed">
          <p className="text-muted-foreground">{t("prototype.body")}</p>

          <div className="rounded-md border bg-muted/30 p-3">
            <p className="font-medium text-foreground text-xs uppercase tracking-wider">{t("prototype.whatWorksTitle")}</p>
            <p className="mt-1 text-muted-foreground">{t("prototype.whatWorks")}</p>
          </div>

          <p className="text-muted-foreground">{t("prototype.whatNext")}</p>

          <div className="flex flex-wrap gap-2 pt-1">
            <a
              href="https://github.com/abdelaziz-ebourki/lions-club-api"
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              {t("prototype.links.apiRepo")}
            </a>
            <a
              href="https://github.com/abdelaziz-ebourki/lions-club-ui"
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              {t("prototype.links.uiRepo")}
            </a>
          </div>

          <label className="flex items-center gap-2 pt-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="size-4 rounded border-input accent-primary"
            />
            <span className="text-sm">{t("prototype.dismiss")}</span>
          </label>
        </div>

        <DialogFooter className="sm:justify-end">
          <Button onClick={handleContinue}>{t("prototype.continue")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
