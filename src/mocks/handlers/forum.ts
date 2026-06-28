import { http, HttpResponse } from "msw";
import { categories, threads, replies } from "../data/forum";

export const forumHandlers = [
  http.get("/api/forum/categories", () => {
    return HttpResponse.json(categories);
  }),

  http.get("/api/forum/threads", ({ request }) => {
    const url = new URL(request.url);
    const categoryId = url.searchParams.get("categoryId");
    const status = url.searchParams.get("status");
    let filtered = categoryId
      ? threads.filter((t) => t.categoryId === categoryId)
      : threads;
    if (status && status !== "all") {
      filtered = filtered.filter((t) => t.status === status);
    }
    return HttpResponse.json(filtered);
  }),

  http.get("/api/forum/:categoryId/:threadId", ({ params }) => {
    const thread = threads.find((t) => t.id === params.threadId);
    if (!thread) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(thread);
  }),

  http.get("/api/forum/threads/:id", ({ params }) => {
    const thread = threads.find((t) => t.id === params.id);
    if (!thread) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(thread);
  }),

  http.post("/api/forum/threads", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const now = new Date().toISOString();
    const newThread = {
      id: `thread-${Date.now()}`,
      categoryId: body.categoryId as string,
      title: body.title as string,
      author: (body.author as string) ?? "Anonymous",
      content: body.content as string,
      createdAt: now,
      status: "normal" as const,
      replyCount: 0,
      viewCount: 0,
      lastActivity: now,
    };
    threads.unshift(newThread);
    const cat = categories.find((c) => c.id === newThread.categoryId);
    if (cat) cat.threadCount++;
    return HttpResponse.json(newThread, { status: 201 });
  }),

  http.get("/api/forum/replies", ({ request }) => {
    const url = new URL(request.url);
    const threadId = url.searchParams.get("threadId");
    if (!threadId) return HttpResponse.json([]);
    return HttpResponse.json(replies.filter((r) => r.threadId === threadId));
  }),

  http.post("/api/forum/replies", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const now = new Date().toISOString();
    const newReply = {
      id: `reply-${Date.now()}`,
      threadId: body.threadId as string,
      author: (body.author as string) ?? "Anonymous",
      content: body.content as string,
      createdAt: now,
    };
    replies.push(newReply);
    const thread = threads.find((t) => t.id === newReply.threadId);
    if (thread) {
      thread.replyCount++;
      thread.lastActivity = now;
    }
    return HttpResponse.json(newReply, { status: 201 });
  }),

  http.patch("/api/forum/threads/:id", async ({ params, request }) => {
    const thread = threads.find((t) => t.id === params.id);
    if (!thread) return new HttpResponse(null, { status: 404 });
    const body = (await request.json()) as Record<string, unknown>;
    if (typeof body.status === "string") {
      thread.status = body.status as "pinned" | "locked" | "normal" | "archived";
    }
    return HttpResponse.json(thread);
  }),

  http.delete("/api/forum/threads/:id", ({ params }) => {
    const idx = threads.findIndex((t) => t.id === params.id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    const [removed] = threads.splice(idx, 1);
    const cat = categories.find((c) => c.id === removed.categoryId);
    if (cat) cat.threadCount--;
    return HttpResponse.json({ success: true });
  }),
];