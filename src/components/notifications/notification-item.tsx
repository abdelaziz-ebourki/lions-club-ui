import { MessageSquare, Calendar, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Notification, NotificationType } from "@/types";

const iconMap: Record<NotificationType, typeof MessageSquare> = {
  forum_reply: MessageSquare,
  event_update: Calendar,
  admin_announcement: Megaphone,
};

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto", style: "short" });

function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return rtf.format(-diffSeconds, "second");
  if (diffMinutes < 60) return rtf.format(-diffMinutes, "minute");
  if (diffHours < 24) return rtf.format(-diffHours, "hour");
  if (diffDays < 7) return rtf.format(-diffDays, "day");
  return new Date(dateString).toLocaleDateString();
}

interface NotificationItemProps {
  notification: Notification;
  onClick: (id: string) => void;
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const Icon = iconMap[notification.type];

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 rounded-none px-4 py-3 h-auto text-left",
        !notification.read && "bg-muted/50"
      )}
      onClick={() => onClick(notification.id)}
    >
      <Icon className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm truncate", !notification.read && "font-medium")}>
          {notification.title}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {notification.description}
        </p>
      </div>
      <time className="text-xs text-muted-foreground shrink-0">
        {formatRelativeTime(notification.createdAt)}
      </time>
    </Button>
  );
}
