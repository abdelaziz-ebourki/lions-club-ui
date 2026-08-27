import { useEffect, useState } from "react";
import { Lightbox } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import type { GalleryItem } from "@/types";
import { Badge } from "@/components/ui/badge";

interface LightboxViewerProps {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
}

export function LightboxViewer({ items, index, onClose }: LightboxViewerProps) {
  const [current, setCurrent] = useState(index);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const safeIndex = Math.min(Math.max(current, 0), Math.max(items.length - 1, 0));
  const item = items[safeIndex];
  if (!item) return null;

  return (
    <>
      <Lightbox
        open
        close={onClose}
        index={safeIndex}
        slides={items.map((i) => ({ src: i.imageUrl }))}
        carousel={{ finite: false }}
        animation={{ swipe: 250 }}
        controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
        on={{ view: (props) => setCurrent(props.index) }}
      />

      <div
        className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
        data-testid="lightbox-metadata"
      >
        <div
          role="figure"
          aria-label={`Photo details: ${item.title}`}
          className="pointer-events-auto max-w-xl rounded-xl bg-background/95 px-5 py-3 text-foreground shadow-2xl ring-1 ring-border"
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Badge variant="accent">{item.category}</Badge>
            <p className="font-heading text-lg leading-tight">{item.title}</p>
            <span className="text-body-xs text-muted-foreground">
              Uploaded {new Date(item.uploadedAt).toLocaleDateString()}
            </span>
          </div>
          {item.description && (
            <p className="mt-1 text-body-sm text-muted-foreground">{item.description}</p>
          )}
          {item.tags.length > 0 && (
            <ul className="mt-1 flex flex-wrap gap-1" aria-label="Tags">
              {item.tags.map((tag) => (
                <li key={tag} className="rounded-full bg-muted px-2 py-0.5 text-body-xs text-muted-foreground">
                  #{tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
