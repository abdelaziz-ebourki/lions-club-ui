import { http, HttpResponse } from "msw";
import { newsArticles } from "../data/news";
import { parseBody } from "../utils";
import type { NewsCategory, NewsStatus } from "@/types";

const articles = [...newsArticles];

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function generateUniqueSlug(baseSlug: string): string {
  let slug = baseSlug;
  let counter = 1;
  while (articles.some((a) => a.slug === slug)) {
    counter++;
    slug = `${baseSlug}-${counter}`;
  }
  return slug;
}

export const newsHandlers = [
  http.get("/api/news/admin", () => {
    return HttpResponse.json([...articles].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
  }),

  http.get("/api/news/admin/:id", ({ params }) => {
    const article = articles.find((a) => a.id === params.id);
    if (!article) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(article);
  }),

  http.get("/api/news", ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const limit = parseInt(url.searchParams.get("limit") ?? "10", 10);
    const published = articles
      .filter((a) => a.status === "published")
      .sort((a, b) => new Date(b.publishedAt ?? b.createdAt).getTime() - new Date(a.publishedAt ?? a.createdAt).getTime());
    const total = published.length;
    const start = (page - 1) * limit;
    const data = published.slice(start, start + limit).map(({ content: _content, ...rest }) => rest);
    return HttpResponse.json({ data, total, page, limit, totalPages: Math.ceil(total / limit) });
  }),

  http.get("/api/news/featured", () => {
    const featured = articles
      .filter((a) => a.status === "published")
      .sort((a, b) => new Date(b.publishedAt ?? b.createdAt).getTime() - new Date(a.publishedAt ?? a.createdAt).getTime())
      .slice(0, 3)
      .map(({ content: _content, ...rest }) => rest);
    return HttpResponse.json(featured);
  }),

  http.get("/api/news/:slug", ({ params }) => {
    const article = articles.find((a) => a.slug === params.slug && a.status === "published");
    if (!article) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(article);
  }),

  http.post("/api/news", async ({ request }) => {
    const body = await parseBody(request);
    const now = new Date().toISOString();
    const baseSlug = (body.slug as string) || slugify(body.title as string);
    const slug = generateUniqueSlug(baseSlug);
    const newArticle = {
      id: `news-${Date.now()}`,
      title: body.title as string,
      slug,
      content: body.content as string,
      excerpt: (body.excerpt as string) ?? "",
      featuredImage: (body.featuredImage as string) ?? undefined,
      category: (body.category as NewsCategory) ?? "News",
      status: (body.status as NewsStatus) ?? "draft",
      authorId: "admin-1",
      authorName: "Ahmed Benali",
      publishedAt: body.status === "published" ? now : undefined,
      createdAt: now,
      updatedAt: now,
    };
    articles.push(newArticle);
    return HttpResponse.json(newArticle, { status: 201 });
  }),

  http.put("/api/news/:id", async ({ params, request }) => {
    const idx = articles.findIndex((a) => a.id === params.id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    const body = await parseBody(request);
    const now = new Date().toISOString();
    let slug = articles[idx].slug;
    if (body.slug && body.slug !== articles[idx].slug) {
      slug = generateUniqueSlug(body.slug as string);
    } else if (body.title && body.title !== articles[idx].title && !body.slug) {
      slug = generateUniqueSlug(slugify(body.title as string));
    }
    articles[idx] = {
      ...articles[idx],
      ...body,
      slug,
      featuredImage: (body.featuredImage as string) ?? articles[idx].featuredImage,
      publishedAt: body.status === "published" && !articles[idx].publishedAt ? now : articles[idx].publishedAt,
      updatedAt: now,
    };
    return HttpResponse.json(articles[idx]);
  }),

  http.delete("/api/news/:id", ({ params }) => {
    const idx = articles.findIndex((a) => a.id === params.id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    articles.splice(idx, 1);
    return HttpResponse.json({ success: true });
  }),
];
