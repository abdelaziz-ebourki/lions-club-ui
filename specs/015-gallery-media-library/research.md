# Research & Decisions: Gallery & Media Library

**Feature**: 015-gallery-media-library | **Date**: 2026-08-25

## R1: Lightbox library

**Decision**: `yet-another-react-lightbox` (YARL)

**Rationale**: Actively maintained, zero-dependency, first-class React 19 compatibility, built-in keyboard navigation (arrows/Escape), touch/swipe support, focus management on open/close, and a plugin ecosystem (Thumbnails, Zoom, Counter). Directly satisfies FR-007–FR-011 including the accessibility requirements without hand-rolling a focus trap.

**Alternatives considered**:
- `react-photo-album` — a *layout* library, not a lightbox; its paired lightbox IS yet-another-react-lightbox. Rejected for layout use (see R2) but its docs pair naturally with YARL.
- Hand-rolled dialog via shadcn `Dialog` — would require custom focus trap, arrow-key handling, swipe detection, and wrap-around index logic; higher bug surface for exactly the behaviors YARL ships tested.
- `react-image-lightbox` — unmaintained (last release years ago); React 19 peer warnings.

## R2: Grid layout approach

**Decision**: Plain Tailwind CSS grid using the existing card pattern (`grid gap-6 sm:grid-cols-2 lg:grid-cols-3` with shadcn `Card`), identical to NewsPage/EventsPage.

**Rationale**: Constitution V (design-system discipline) — the site already has a validated responsive card-grid idiom; masonry/justified layouts introduce a foreign visual language and an extra dependency.

**Alternatives considered**: `react-photo-album` justified/masonry rows — visually appealing for photo-heavy walls but inconsistent with the rest of the site and harder to keep accessible at spec level; revisit only if design asks for it later.

## R3: Upload progress reporting

**Decision**: Indeterminate progress indicator driven by mutation pending state (spinner + disabled controls inside `FileUpload loading={isPending}`).

**Rationale**: The existing transport is `fetch` via `@/lib/api.ts`, which exposes no upload-progress events. Adding an XHR wrapper solely for percentage progress violates simplicity for v1; FR-013 requires "visible upload progress", which an honest indeterminate state satisfies. `FileUpload` already implements drag-drop, browse, blob preview, type/size validation (PNG/JPEG/WebP, 5 MB) — reuse as-is.

**Alternatives considered**: XMLHttpRequest upload wrapper in api.ts — new infrastructure, duplicated auth/error handling, real percentages that are misleadingly fast/slow on small club images; deferred until a real need exists.

## R4: Thumbnails

**Decision**: Treat `thumbnailUrl` as optional end-to-end; grid cards render `thumbnailUrl ?? imageUrl`. Mock data includes some items without thumbnails to exercise the fallback.

**Rationale**: Spec FR-020 makes thumbnails SHOULD-level; the frontend cannot generate them reliably (canvas downscaling adds complexity for no visible benefit while backend support is undecided). Fallback keeps every path green.

**Alternatives considered**: Client-side canvas thumbnail generation at upload time — extra async work, memory pressure on large images, and duplicate storage concerns; better owned by the eventual backend/upload pipeline (Cloudinary/S3 transforms per issue notes).

## R5: Deep-linkable detail view (`/gallery/:id`)

**Decision**: `/gallery/:id` renders the same public gallery page with the lightbox auto-opened for that item; closing the lightbox navigates back to `/gallery`. Invalid ids show the 404-style state per edge case.

**Rationale**: Avoids building two surfaces for one behavior; deep links (shares, refreshes) land directly in the viewer; browser Back behaves intuitively. Matches issue AC "Gallery detail: /gallery/:id (lightbox/modal view)".

**Alternatives considered**: Dedicated detail page — duplicates metadata rendering, loses "navigate within filtered set" continuity, and splits SEO/meta handling in two.

## R6: Page titles under React 19 (carried lesson from 014)

**Decision**: Set `document.title` imperatively via effect when the lightbox opens with an item ("{title} | Lions Club FSBM"); do NOT render `<title>` inside react-helmet-async. Helmet remains available for meta description tags only.

**Rationale**: Discovered during 014 E2E validation: react-helmet-async's `<title>` is left empty under React 19's hoistable-element handling while meta tags still work. Applying the established pattern from day one avoids re-fixing a known bug.

## R7: MSW handler ordering & state

**Decision**: Register admin routes (`/api/gallery/admin`, `/api/gallery/admin/:id`, `/api/gallery/upload`) before parameterized public routes (`/api/gallery/:id`) — same fix validated in 014 (T027). Handlers keep module-scoped arrays seeded from `mocks/data/gallery.ts`.

**Rationale**: MSW matches in registration order; `:id` would otherwise swallow `/admin`. Known constraint: module state resets on full page reloads (dev-only concern) — E2E scripts must avoid reloads mid-flow or re-seed accordingly.

## R8: Filtering implementation

**Decision**: Server-style query parameters sent by hooks (`?category=Event&eventId=...&page=1&limit=12`) with MSW filtering server-side; React Query caches per filter+page combination.

**Rationale**: Keeps public hook API contract-shaped for the real future backend, mirrors pagination approach from 014, and makes filter changes natural cache keys. Empty-result filtering yields the empty state per FR-005.

**Alternatives considered**: Client-side filtering of a full fetch — unbounded payload growth as gallery grows; contradicts pagination decision.
