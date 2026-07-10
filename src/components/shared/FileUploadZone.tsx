import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { Upload, X } from "lucide-react";

interface FileUploadZoneProps {
  loading: boolean;
  previewUrl: string | null;
  variant: "square" | "circle";
  onRemove: (e: React.MouseEvent) => void;
}

export function FileUploadZone({ loading, previewUrl, variant, onRemove }: FileUploadZoneProps) {
  if (loading) {
    return <Spinner size={24} />;
  }

  if (previewUrl) {
    return (
      <div className="relative size-full">
        <img
          src={previewUrl}
          alt="Selected image preview"
          className={cn(
            "size-full object-cover",
            variant === "circle" ? "rounded-full" : "rounded-md",
          )}
          style={{ maxHeight: variant === "circle" ? 128 : 192 }}
        />
        <button
          type="button"
          onClick={onRemove}
          className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border transition-colors hover:bg-muted"
          aria-label="Remove image"
        >
          <X className="size-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 text-muted-foreground">
      <Upload className="size-8" aria-hidden="true" />
      <p className="text-body-sm font-medium">
        Drop image here or click to browse
      </p>
      <p className="text-body-xs">PNG, JPG, WebP up to 5MB</p>
    </div>
  );
}
