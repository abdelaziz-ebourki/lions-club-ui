import { http, HttpResponse } from "msw";
import type { Notification } from "@/types";

const seededNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "forum_reply",
    title: "New reply in 'Event Planning'",
    description: "Ahmed replied: 'I can help with venue setup'",
    targetUrl: "/forum/cat-1/thread-42",
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-2",
    type: "event_update",
    title: "Community Cleanup rescheduled",
    description: "The event has been moved to Saturday",
    targetUrl: "/events/event-3",
    read: false,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-3",
    type: "admin_announcement",
    title: "New membership drive",
    description: "We're launching a membership drive next month",
    targetUrl: "/",
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

let notifications = [...seededNotifications];

export const notificationHandlers = [
  http.get("/api/notifications", ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit")) || 20;

    const sorted = [...notifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const limited = sorted.slice(0, limit);
    const unreadCount = notifications.filter((n) => !n.read).length;

    return HttpResponse.json({ notifications: limited, unreadCount });
  }),

  http.put("/api/notifications/read-all", () => {
    notifications = notifications.map((n) => ({ ...n, read: true }));
    return HttpResponse.json({ success: true });
  }),

  http.put("/api/notifications/:id/read", ({ params }) => {
    const { id } = params;
    notifications = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    return HttpResponse.json({ success: true });
  }),
];
