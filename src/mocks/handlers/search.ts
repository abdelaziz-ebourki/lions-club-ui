import { http, HttpResponse } from "msw";
import { events } from "../data/events";
import { threads } from "../data/forum";
import { members } from "../data/members";
import { contactMessages } from "../data/contact";

export const searchHandlers = [
  http.get("/api/search", ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get("q")?.toLowerCase().trim() ?? "";
    const includeAdmin = url.searchParams.get("admin") === "true";

    if (!query) {
      return HttpResponse.json({
        groups: [],
        totalCount: 0,
      });
    }

    const matchTitle = (text: string) => text.toLowerCase().includes(query);
    const matchContent = (text: string) => text.toLowerCase().includes(query);
    const makeSnippet = (text: string) => {
      const idx = text.toLowerCase().indexOf(query);
      if (idx === -1) return text.slice(0, 150) + "...";
      const start = Math.max(0, idx - 60);
      const end = Math.min(text.length, idx + query.length + 60);
      return (start > 0 ? "..." : "") + text.slice(start, end) + (end < text.length ? "..." : "");
    };

    const eventResults = events
      .filter((e) => matchTitle(e.title) || matchContent(e.description))
      .map((e) => ({
        id: e.id,
        entityType: "event" as const,
        title: e.title,
        snippet: makeSnippet(e.description),
        url: `/events/${e.id}`,
        matchType: (matchTitle(e.title) ? "exact" : "partial") as "exact" | "partial",
        updatedAt: e.date,
      }));

    const threadResults = threads
      .filter((t) => matchTitle(t.title) || matchContent(t.content))
      .map((t) => ({
        id: t.id,
        entityType: "forum_thread" as const,
        title: t.title,
        snippet: makeSnippet(t.content),
        url: `/forum/${t.categoryId}/${t.id}`,
        matchType: (matchTitle(t.title) ? "exact" : "partial") as "exact" | "partial",
        updatedAt: t.lastActivity,
      }));

    const groups: Array<{ entityType: string; label: string; count: number; results: Array<{ id: string; entityType: string; title: string; snippet: string; url: string; matchType: string; updatedAt: string }> }> = [
      {
        entityType: "event" as const,
        label: `Events (${eventResults.length})`,
        count: eventResults.length,
        results: eventResults,
      },
      {
        entityType: "forum_thread" as const,
        label: `Forum Threads (${threadResults.length})`,
        count: threadResults.length,
        results: threadResults,
      },
    ];

    if (includeAdmin) {
      const memberResults = members
        .filter((m) => matchTitle(m.name) || (m.bio && matchContent(m.bio)))
        .map((m) => ({
          id: m.id,
          entityType: "member" as const,
          title: m.name,
          snippet: m.bio ? makeSnippet(m.bio) : "",
          url: `/admin/members/${m.id}`,
          matchType: (matchTitle(m.name) ? "exact" : "partial") as "exact" | "partial",
          updatedAt: m.joinedAt,
        }));

      const messageResults = contactMessages
        .filter((m) => matchTitle(m.subject) || matchContent(m.message))
        .map((m) => ({
          id: m.id,
          entityType: "contact_message" as const,
          title: m.subject,
          snippet: makeSnippet(m.message),
          url: `/admin/messages/${m.id}`,
          matchType: (matchTitle(m.subject) ? "exact" : "partial") as "exact" | "partial",
          updatedAt: m.createdAt,
        }));

      groups.push({
        entityType: "member" as const,
        label: `Members (${memberResults.length})`,
        count: memberResults.length,
        results: memberResults,
      });
      groups.push({
        entityType: "contact_message" as const,
        label: `Contact Messages (${messageResults.length})`,
        count: messageResults.length,
        results: messageResults,
      });
    }

    return HttpResponse.json({
      groups: groups.filter((g) => g.count > 0),
      totalCount: groups.reduce((sum, g) => sum + g.count, 0),
    });
  }),
];
