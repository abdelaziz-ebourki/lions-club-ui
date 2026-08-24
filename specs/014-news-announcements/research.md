# Research: News & Announcements System

## Rich Text Editor: @tiptap/react + @tiptap/starter-kit

**Decision**: Use **Tiptap** (based on ProseMirror) as the rich text editor.

**Rationale**:
- Headless, framework-agnostic — no opinionated UI, integrates cleanly with the existing shadcn/ui design system
- First-class React support via `@tiptap/react` with `useEditor` hook
- StarterKit includes bold, italic, headings, lists, links, code blocks — all required formatting
- Content stored as HTML, renderable on the public detail page via `editor.getHTML()`
- Active community, well-maintained (8561 code snippets on Context7, High reputation)
- Can be isolated in a separate component to prevent unnecessary re-renders with react-hook-form

**Integration Pattern**:
- Create a `RichTextEditor` wrapper component that accepts `value` (HTML string) and `onChange` callbacks
- Use `useEditor` inside the component with `StarterKit` extension
- Sync content to react-hook-form via `onUpdate` callback calling `field.onChange(editor.getHTML())`
- Store content as HTML string in the form state and API payload

**Alternatives Considered**:
- **react-quill**: Larger bundle, less flexible styling, harder to integrate with shadcn/ui
- **slate**: More complex API, steeper learning curve for simple use case
- **Plain textarea**: Loses rich text formatting entirely — not viable per spec requirements

---

## SEO Meta Tags: react-helmet-async

**Decision**: Use **react-helmet-async** for dynamic SEO meta tags.

**Rationale**:
- Industry standard for React SPA SEO (46 code snippets, High reputation, 86 benchmark score)
- Declarative JSX API: `<Helmet><title>...</title><meta ... /></Helmet>`
- Supports all required tags: `<title>`, `<meta name="description">`, `og:title`, `og:description`, `og:type`, `og:image`
- `prioritizeSeoTags` flag ensures SEO-critical tags are rendered early
- Thread-safe for React 19+

**Integration Pattern**:
- Add `<HelmetProvider>` in `AppProviders.tsx` wrapping the app
- On news detail page, use `<Helmet>` with article-specific title, description, OG tags
- Use `titleTemplate` for consistent branding (e.g., `"Lions Club FSBM — %s"`)

**Alternatives Considered**:
- **react-document-meta**: Less maintained, no React 19 support
- **Custom useEffect for document.title**: Only handles title, not meta/OG tags

---

## Image Upload Pattern

**Decision**: Reuse existing `FileUploadZone` component and `api.upload()` from `@/lib/api.ts`.

**Rationale**:
- Already used by Event create/edit forms — proven pattern
- `FileUploadZone` handles loading, preview, and remove states
- `api.upload()` sends `FormData` with `credentials: "include"` for cookie auth
- Upload config (accepted types, max size) already defined in `@/config/index.ts`
- No new image upload infrastructure needed (confirmed in spec assumptions)

**Integration Pattern**:
- Same as `useEventForm`: image field is `z.union([z.instanceof(File), z.string()]).optional().nullable()`
- On form submit, use `FormData` + `api.upload()` to send the file
- Existing image displays via string URL; new images sent as `File` objects

---

## Routing Structure

**Decision**: Follow existing route patterns from events feature.

```
/news                    → NewsListPage     (within Shell layout, eagerly loaded)
/news/:slug              → NewsDetailPage   (lazy-loaded with Suspense)
/admin/news              → AdminNewsPage    (lazy-loaded, within admin layout)
/admin/news/new          → NewsFormPage     (lazy-loaded, within admin layout)
/admin/news/:id/edit     → NewsFormPage     (lazy-loaded, within admin layout)
```

---

## Pagination

**Decision**: Offset-based pagination via `?page=1&limit=10` query params.

**Rationale**:
- Simple to implement on both client and mock server
- API returns `{ data: NewsArticle[], total: number, page: number, limit: number }`
- Client uses `page` state to fetch next/prev pages
- Pagination controls: "Previous" / "Next" buttons, page indicator
- 10 per page default (per spec)

---

## Slug Uniqueness

**Decision**: Auto-generate slug from title on the client (lowercase, replace spaces/special chars with hyphens). Backend appends numeric suffix (`-2`, `-3`, etc.) for duplicates. Slug field is editable by admin.

---

## HelmetProvider Setup

**Decision**: Add `HelmetProvider` to `AppProviders.tsx` wrapping the existing provider tree.

```tsx
import { HelmetProvider } from "react-helmet-async";

export function AppProviders({ children }) {
  return (
    <HelmetProvider>
      {/* existing providers */}
    </HelmetProvider>
  );
}
```

---

## MSW Mock Pattern

**Decision**: Follow existing MSW handler pattern from `src/mocks/handlers/events.ts`.

- `GET /api/news?page=1&limit=10` — paginated published articles
- `GET /api/news/:slug` — single article by slug (returns 404 if not found)
- `GET /api/news/admin` — all articles (admin view, all statuses)
- `POST /api/news` — create article (FormData)
- `PUT /api/news/:id` — update article (FormData)
- `DELETE /api/news/:id` — delete article
- `GET /api/news/featured` — top 3 published articles for homepage
