import { http, HttpResponse } from "msw";
import { galleryItems } from "../data/gallery";
import { parseBody } from "../utils";
import type { GalleryCategory } from "@/types";

const items = [...galleryItems];

function normalizeTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  return [...new Set(tags.map((t) => String(t).trim()).filter((t) => t.length > 0))];
}

export const galleryHandlers = [
  http.get("/api/gallery/admin", () => {
    return HttpResponse.json(
      [...items].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()),
    );
  }),

  http.get("/api/gallery/admin/:id", ({ params }) => {
    const item = items.find((i) => i.id === params.id);
    if (!item) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(item);
  }),

  http.post("/api/gallery/upload", async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return HttpResponse.json({ message: "Missing file" }, { status: 400 });
    }
    const id = `upload-${Date.now()}`;
    return HttpResponse.json(
      {
        imageUrl: `/uploads/gallery/${id}-${file.name}`,
        thumbnailUrl: `/uploads/gallery/${id}-thumb-${file.name}`,
      },
      { status: 201 },
    );
  }),

  http.get("/api/gallery", ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const limit = parseInt(url.searchParams.get("limit") ?? "12", 10);
    const category = url.searchParams.get("category");
    const eventId = url.searchParams.get("eventId");

    let filtered = [...items].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    );
    if (category) filtered = filtered.filter((i) => i.category === category);
    if (eventId) filtered = filtered.filter((i) => i.eventId === eventId);

    const total = filtered.length;
    const start = (page - 1) * limit;
    return HttpResponse.json({
      data: filtered.slice(start, start + limit),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  }),

  http.post("/api/gallery", async ({ request }) => {
    const body = await parseBody(request);
    if (!body.title || !body.category || !body.imageUrl) {
      return HttpResponse.json({ message: "title, category and imageUrl are required" }, { status: 400 });
    }
    const now = new Date().toISOString();
    const newItem = {
      id: `gallery-${Date.now()}`,
      title: body.title as string,
      description: (body.description as string) || undefined,
      imageUrl: body.imageUrl as string,
      thumbnailUrl: (body.thumbnailUrl as string) || undefined,
      category: body.category as GalleryCategory,
      eventId: (body.eventId as string) || undefined,
      tags: normalizeTags(body.tags),
      uploadedAt: now,
      uploadedBy: "admin-1",
    };
    items.push(newItem);
    return HttpResponse.json(newItem, { status: 201 });
  }),

  http.get("/api/gallery/:id", ({ params }) => {
    const item = items.find((i) => i.id === params.id);
    if (!item) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(item);
  }),

  http.patch("/api/gallery/:id", async ({ params, request }) => {
    const idx = items.findIndex((i) => i.id === params.id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    const body = await parseBody(request);
    items[idx] = {
      ...items[idx],
      ...body,
      tags: body.tags !== undefined ? normalizeTags(body.tags) : items[idx].tags,
    };
    return HttpResponse.json(items[idx]);
  }),

  http.delete("/api/gallery/:id", ({ params }) => {
    const idx = items.findIndex((i) => i.id === params.id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    items.splice(idx, 1);
    return HttpResponse.json({ success: true });
  }),
];
