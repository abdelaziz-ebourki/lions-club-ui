import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { UserProfile } from "@/types";

interface AvatarUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AvatarUploadModal({ open, onOpenChange }: AvatarUploadModalProps) {
  const { t } = useTranslation("profile");
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (avatarFile: File) => {
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      return api.upload<UserProfile>("/user/profile", formData, "PUT");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success(t("avatar.success"));
      setFile(null);
      onOpenChange(false);
    },
    onError: () => {
      toast.error(t("avatar.error"));
    },
  });

  function handleConfirm() {
    if (!file) return;
    mutation.mutate(file);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!mutation.isPending) onOpenChange(v); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("avatar.title")}</DialogTitle>
          <DialogDescription>
            {t("avatar.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <FileUpload
            value={file}
            onChange={(f) => setFile(f)}
            variant="circle"
            loading={mutation.isPending}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
            {t("avatar.cancel")}
          </Button>
          <Button onClick={handleConfirm} disabled={!file || mutation.isPending}>
            {mutation.isPending ? <><Spinner /> {t("avatar.uploading")}</> : t("avatar.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
