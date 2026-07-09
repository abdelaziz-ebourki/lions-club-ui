import { useState, useRef, useCallback, type DragEvent } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { Upload, X } from "lucide-react";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPT_STRING = ".png,.jpg,.jpeg,.webp";

interface FileUploadProps {
  value: File | string | null;
  onChange: (file: File | null) => void;
  variant?: "square" | "circle";
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  id?: string;
}

export function FileUpload({
  value,
  onChange,
  variant = "square",
  disabled = false,
  loading = false,
  error,
  id,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  const displayError = error ?? internalError;

  const previewUrl = value instanceof File ? URL.createObjectURL(value) : value;

  const validateFile = useCallback((file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Please select a valid image file (PNG, JPG, WebP)";
    }
    if (file.size > MAX_SIZE) {
      return "File size must be under 5MB";
    }
    return null;
  }, []);

  function handleFile(file: File) {
    setInternalError(null);
    const validationError = validateFile(file);
    if (validationError) {
      setInternalError(validationError);
      return;
    }
    onChange(file);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (disabled || loading) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    setInternalError(null);
    if (inputRef.current) inputRef.current.value = "";
    onChange(null);
  }

  function handleClick() {
    if (disabled || loading) return;
    if (value instanceof File || value) return;
    inputRef.current?.click();
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        role="button"
        tabIndex={0}
        id={id}
        aria-label="Upload image"
        aria-invalid={!!displayError}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClick(); }}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-input bg-transparent p-6 transition-colors hover:border-ring",
          dragOver && "border-ring bg-muted/50",
          disabled && "pointer-events-none cursor-not-allowed opacity-50",
          loading && "pointer-events-none cursor-wait",
          variant === "circle" && "rounded-full",
          displayError && "border-destructive",
        )}
      >
        {loading ? (
          <Spinner size={24} />
        ) : previewUrl ? (
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
              onClick={handleRemove}
              className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border transition-colors hover:bg-muted"
              aria-label="Remove image"
            >
              <X className="size-3" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Upload className="size-8" aria-hidden="true" />
            <p className="text-body-sm font-medium">
              Drop image here or click to browse
            </p>
            <p className="text-body-xs">PNG, JPG, WebP up to 5MB</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_STRING}
        className="hidden"
        onChange={handleInputChange}
        disabled={disabled || loading}
        aria-hidden="true"
      />

      {displayError && (
        <p className="text-body-xs text-destructive" role="alert">
          {displayError}
        </p>
      )}
    </div>
  );
}
