import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
      toast.success("Avatar updated successfully");
      setFile(null);
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to upload avatar");
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
          <DialogTitle>Change Avatar</DialogTitle>
          <DialogDescription>
            Select a new profile picture. PNG, JPEG, or WebP up to 5MB.
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
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!file || mutation.isPending}>
            {mutation.isPending ? <><Spinner /> Uploading...</> : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
