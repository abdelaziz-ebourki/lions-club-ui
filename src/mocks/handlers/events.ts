import { http, HttpResponse } from "msw";
import { events } from "../data/events";

async function parseBody(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const obj: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      obj[key] = value instanceof File ? value.name : value;
    }
    return obj;
  }
  return (await request.json()) as Record<string, unknown>;
}

export const eventHandlers = [
  http.get("/api/events", ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const filtered = status
      ? events.filter((e) => e.status === status)
      : events;
    return HttpResponse.json(filtered);
  }),

  http.get("/api/events/:id", ({ params }) => {
    const event = events.find((e) => e.id === params.id);
    if (!event) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(event);
  }),

  http.post("/api/events", async ({ request }) => {
    const body = await parseBody(request);
    const newEvent = {
      id: `event-${Date.now()}`,
      title: body.title as string,
      description: body.description as string,
      date: body.date as string,
      time: body.time as string,
      location: body.location as string,
      category: (body.category as string) ?? "General",
      status: (body.status as "upcoming" | "ongoing" | "past") ?? "upcoming",
      image: (body.image as string) ?? undefined,
    };
    events.push(newEvent);
    return HttpResponse.json(newEvent, { status: 201 });
  }),

  http.put("/api/events/:id", async ({ params, request }) => {
    const idx = events.findIndex((e) => e.id === params.id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    const body = await parseBody(request);
    events[idx] = { ...events[idx], ...body } as (typeof events)[number];
    return HttpResponse.json(events[idx]);
  }),

  http.delete("/api/events/:id", ({ params }) => {
    const idx = events.findIndex((e) => e.id === params.id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    events.splice(idx, 1);
    return HttpResponse.json({ success: true });
  }),
];
