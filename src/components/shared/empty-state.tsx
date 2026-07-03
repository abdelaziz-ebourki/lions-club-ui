import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn("flex flex-col items-center justify-center py-16 text-center", className)}
    >
      {Icon && (
        <div className="mb-4 text-muted-foreground/50">
          <Icon className="size-12" />
        </div>
      )}
      <h3 className="font-heading text-h4 text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm font-body text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
