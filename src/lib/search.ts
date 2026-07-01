import { api } from "@/lib/api";
import type { Event, ForumThread, Member, ContactMessage } from "@/types";
import type { SearchQuery, SearchResult, SearchResultGroup, EntityType } from "@/types";

export function sanitizeQuery(raw: string): SearchQuery {
  const sanitized = raw.trim().slice(0, 200);
  return {
    raw,
    sanitized,
    length: sanitized.length,
    isEmpty: sanitized.length === 0,
  };
}

function makeSnippet(text: string, query: string): string {
  const lower = text.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx === -1) return text.slice(0, 150) + (text.length > 150 ? "..." : "");
  const start = Math.max(0, idx - 60);
  const end = Math.min(text.length, idx + query.length + 60);
  return (start > 0 ? "..." : "") + text.slice(start, end) + (end < text.length ? "..." : "");
}

function matchFields<T>(
  items: T[],
  query: string,
  titleField: keyof T,
  contentField: keyof T,
  mapResult: (item: T, matchType: "exact" | "partial") => SearchResult,
): SearchResult[] {
  const lowerQuery = query.toLowerCase();
  const exact: SearchResult[] = [];
  const partial: SearchResult[] = [];

  for (const item of items) {
    const title = String(item[titleField] ?? "");
    const content = String(item[contentField] ?? "");
    const titleMatch = title.toLowerCase().includes(lowerQuery);
    const contentMatch = content.toLowerCase().includes(lowerQuery);

    if (titleMatch) {
      exact.push(mapResult(item, "exact"));
    } else if (contentMatch) {
      partial.push(mapResult(item, "partial"));
    }
  }

  const sortByDate = (a: SearchResult, b: SearchResult) =>
    b.updatedAt.localeCompare(a.updatedAt);

  exact.sort(sortByDate);
  partial.sort(sortByDate);

  return [...exact, ...partial];
}

function makeGroup(entityType: EntityType, label: string, results: SearchResult[]): SearchResultGroup {
  return {
    entityType,
    label: `${label} (${results.length})`,
    count: results.length,
    results,
  };
}

export async function searchAll(
  query: string,
  isAdmin: boolean,
): Promise<{ groups: SearchResultGroup[]; totalCount: number }> {
  const parsed = sanitizeQuery(query);
  if (parsed.isEmpty) {
    return { groups: [], totalCount: 0 };
  }

  const [events, threads] = await Promise.all([
    api.get<Event[]>("/events"),
    api.get<ForumThread[]>("/forum/threads"),
  ]);

  const eventResults = matchFields(
    events,
    parsed.sanitized,
    "title",
    "description",
    (e, matchType) => ({
      id: e.id,
      entityType: "event" as const,
      title: e.title,
      snippet: makeSnippet(e.description, parsed.sanitized),
      url: `/events/${e.id}`,
      matchType,
      updatedAt: e.date,
    }),
  );

  const threadResults = matchFields(
    threads,
    parsed.sanitized,
    "title",
    "content",
    (t, matchType) => ({
      id: t.id,
      entityType: "forum_thread" as const,
      title: t.title,
      snippet: makeSnippet(t.content, parsed.sanitized),
      url: `/forum/${t.categoryId}/${t.id}`,
      matchType,
      updatedAt: t.lastActivity,
    }),
  );

  const groups: SearchResultGroup[] = [];

  if (eventResults.length > 0) {
    groups.push(makeGroup("event", "Events", eventResults));
  }
  if (threadResults.length > 0) {
    groups.push(makeGroup("forum_thread", "Forum Threads", threadResults));
  }

  if (isAdmin) {
    const [membersResult, messagesResult] = await Promise.all([
      api.get<Member[]>("/members"),
      api.get<ContactMessage[]>("/contact"),
    ]);

    const memberResults = matchFields(
      membersResult,
      parsed.sanitized,
      "name",
      "bio",
      (m, matchType) => ({
        id: m.id,
        entityType: "member" as const,
        title: m.name,
        snippet: m.bio ? makeSnippet(m.bio, parsed.sanitized) : "",
        url: `/admin/members/${m.id}`,
        matchType,
        updatedAt: m.joinedAt,
      }),
    );

    const messageResults = matchFields(
      messagesResult,
      parsed.sanitized,
      "subject",
      "message",
      (m, matchType) => ({
        id: m.id,
        entityType: "contact_message" as const,
        title: m.subject,
        snippet: makeSnippet(m.message, parsed.sanitized),
        url: `/admin/messages/${m.id}`,
        matchType,
        updatedAt: m.createdAt,
      }),
    );

    if (memberResults.length > 0) {
      groups.push(makeGroup("member", "Members", memberResults));
    }
    if (messageResults.length > 0) {
      groups.push(makeGroup("contact_message", "Contact Messages", messageResults));
    }
  }

  const totalCount = groups.reduce((sum, g) => sum + g.count, 0);
  return { groups, totalCount };
}
