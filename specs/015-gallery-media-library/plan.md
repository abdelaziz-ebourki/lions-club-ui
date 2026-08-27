# Implementation Plan: Gallery & Media Library

**Branch**: `015-gallery-media-library` | **Date**: 2026-08-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/015-gallery-media-library/spec.md`

## Summary

Add a Gallery & Media Library to the Lions Club FSBM SPA. Public visitors browse a responsive photo grid at `/gallery` with category/event filters and an accessible lightbox viewer (keyboard + swipe). Authenticated admins manage items at `/admin/gallery` with drag-and-drop upload, preview, metadata editing (title, description, category, event link, tags), and confirmation-guarded deletion. The homepage is not modified in this feature.

## Technical Context

**Language/Version**: TypeScript 6, React 19, Vite 8, ESM

**Primary Dependencies**: @tanstack/react-query v5, react-router-dom v7, react-hook-form v7 + @hookform/resolvers + Zod v4, shadcn/ui "base-sera", Tailwind v4, lucide-react, sonner (toast), yet-another-react-lightbox (lightbox viewer)

**Storage**: REST API via `@/lib/api.ts` (cookie-based auth, FormData for image upload)

**Testing**: Vitest v4 + @testing-library/react v16 + MSW v2

**Target Platform**: Modern browsers (ES2023), touch devices for swipe

**Project Type**: Web application (SPA — frontend only)

**Performance Goals**: Standard SPA — lazy-loaded admin pages via React.lazy + Suspense; public grid paginated at 12 items/page

**Constraints**: Must reuse existing components (AdminTable, AdminPageHeader, Breadcrumbs, EmptyState, ErrorState, FileUpload, PageHero, page-skeleton patterns), existing image upload infrastructure (`FileUpload` primitive with built-in PNG/JPEG/WebP + 5 MB validation), admin layout, RequireAdmin guard, and form hook pattern (`useNewsForm` parallel). Thumbnails optional — full image fallback required.

**Scale/Scope**: Small — single entity (GalleryItem), 3 routes (`/gallery`, `/gallery/:id`, `/admin/gallery*`), no new backend beyond mock handlers

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. TDD is Non-Negotiable | ✅ PASS | Spec has 3 user stories with independently testable acceptance criteria; test tasks precede implementation tasks. Browser E2E validation during implementation (014 lesson). |
| II. Agent Skills Discipline | ✅ PASS | Will load `tdd`, `shadcn`, `frontend-design`, `git-commit`, `vercel-react-best-practices`, `webapp-testing` skills. |
| III. MCP-First Tooling | ✅ PASS | Query shadcn-ui MCP before any new UI component; playwright MCP for browser validation of acceptance scenarios. |
| IV. TypeScript-First, Type-Safe | ✅ PASS | Strict types, no `any`, Zod v4 schemas for the gallery form, types in `@/types/index.ts`. Note: `erasableSyntaxOnly` forbids constructor parameter properties. |
| V. Component & Design System | ✅ PASS | Grid uses existing Tailwind card-grid pattern (as NewsPage); lightbox styled to match theme; `cn()` everywhere. |
| VI. Best Practices & Standards | ✅ PASS | WCAG 2.1 AA focus trap in lightbox (FR-009–011), React.lazy admin routes, React Query caching, api.ts wrapper only, MSW mocks shared dev/test. |

No violations — no complexity tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/015-gallery-media-library/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api-contracts.md
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── shared/
│   │   ├── GallerySkeleton.tsx    # Loading skeleton for grid cards
│   │   └── LightboxViewer.tsx     # Accessible lightbox wrapper (yet-another-react-lightbox) with metadata slide
├── config/
│   └── index.ts                   # + galleryCategories ("Event", "Project", "Team", "Community", "Partner")
├── hooks/
│   ├── useGalleryList.ts          # Public list query hook (pagination + filters)
│   └── useGalleryForm.ts          # Admin create/edit form hook (parallel to useNewsForm)
├── mocks/
│   ├── data/gallery.ts            # Mock gallery items
│   └── handlers/gallery.ts        # MSW REST handlers for /api/gallery/* (admin routes registered before :id)
├── pages/
│   ├── admin/
│   │   ├── admin-gallery.tsx      # Admin CRUD list page
│   │   └── gallery-form.tsx       # Admin create/edit form page
│   └── gallery/
│       └── gallery.tsx            # Public filterable grid + lightbox (deep-link /gallery/:id opens it)
├── types/index.ts                 # + GalleryItem, GalleryCategory types
└── App.tsx                        # + /gallery, /gallery/:id, /admin/gallery*, /admin/gallery/new, /admin/gallery/:id/edit routes
```

**Structure Decision**: Single-project SPA following the exact conventions validated in 014-news-announcements: co-located pages under `pages/`, hooks in `hooks/`, mocks in `mocks/`, shared components in `components/shared/`, types in `types/index.ts`, routes in `App.tsx` (public eager or lazy like news; admin lazy within RequireAdmin layout).

## Complexity Tracking

**No violations** — all principles pass. Alternatives considered and rejected: `react-photo-album` masonry layout (breaks design-system consistency with existing Tailwind card grids; plain CSS grid reuses the NewsPage pattern); XHR-based byte-exact upload progress (fetch-based infra lacks progress events; indeterminate pending-state indicator satisfies FR-013 without new transport code).
