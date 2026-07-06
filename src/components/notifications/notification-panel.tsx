import { BellOff, CheckCheck } from "lucide-react";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { NotificationItem } from "./notification-item";
import type { Notification } from "@/types";

interface NotificationPanelProps {
  notifications: Notification[];
  unreadCount: number;
  onNotificationClick: (id: string) => void;
  onMarkAllRead: () => void;
  onClose: () => void;
}

export function NotificationPanel({
  notifications,
  unreadCount,
  onNotificationClick,
  onMarkAllRead,
  onClose,
}: NotificationPanelProps) {
  return (
    <Sheet open onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-sm p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="font-heading text-base font-semibold">
            Notifications
          </span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllRead}
              aria-label="Mark all notifications as read"
              className="text-xs gap-1"
            >
              <CheckCheck className="size-3.5" />
              Mark all read
            </Button>
          )}
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-4rem)]" role="list">
          {notifications.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={BellOff}
                title="No new notifications"
                description="You're all caught up!"
              />
            </div>
          ) : (
            notifications.slice(0, 50).map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={onNotificationClick}
              />
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
