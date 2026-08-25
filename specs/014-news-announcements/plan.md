# Implementation Plan: News & Announcements System

**Branch**: `014-news-announcements` | **Date**: 2026-07-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/014-news-announcements/spec.md`

## Summary

Add a News & Announcements system to the Lions Club FSBM SPA. Public visitors browse paginated published articles on `/news` with detail pages at `/news/:slug`. Authenticated admins manage articles (CRUD) at `/admin/news` with title, slug, category, rich text content, excerpt, featured image, and status workflow (draft/published/archived). The homepage shows the 3 most recent published articles. All detail pages include SEO meta tags via react-helmet-async.

## Technical Context

**Language/Version**: TypeScript 6, React 19, Vite 8, ESM

**Primary Dependencies**: @tanstack/react-query v5, react-router-dom v7, react-hook-form v7 + @hookform/resolvers + Zod v4, shadcn/ui "base-sera", Tailwind v4, lucide-react, sonner (toast), @tiptap/react + @tiptap/starter-kit (rich text), react-helmet-async (SEO)

**Storage**: REST API via `@/lib/api.ts` (cookie-based auth, FormData for image upload)

**Testing**: Vitest v4 + @testing-library/react v16 + MSW v2

**Target Platform**: Modern browsers (ES2023)

**Project Type**: Web application (SPA — frontend only)

**Performance Goals**: Standard SPA — lazy-loaded admin pages via React.lazy + Suspense

**Constraints**: Must reuse existing components (AdminTable, AdminPageHeader, Breadcrumbs, EmptyState, ErrorState, FileUploadZone, page-skeleton), existing image upload infrastructure, admin layout, RequireAdmin guard, and form hook pattern. Rich text content stored as HTML.

**Scale/Scope**: Small — single entity (NewsArticle), 4 routes, homepage integration

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. TDD is Non-Negotiable | ✅ PASS | Spec has 4 user stories with independently testable acceptance criteria. Tests before implementation. |
| II. Agent Skills Discipline | ✅ PASS | Will load `tdd`, `shadcn`, `frontend-design`, `git-commit`, `vercel-react-best-practices` skills. |
| III. MCP-First Tooling | ✅ PASS | context7 for TipTap/react-helmet-async docs; shadcn-ui MCP for any new components; playwright MCP for E2E. |
| IV. TypeScript-First, Type-Safe | ✅ PASS | Strict types, no `any`, Zod v4 schemas, types in `@/types/index.ts`. |
| V. Component & Design System | ✅ PASS | Reuse existing shadcn/ui primitives, cn(), Tailwind v4, font system. |
| VI. Best Practices & Standards | ✅ PASS | WCAG 2.1 AA, React.lazy, React Query, api.ts wrapper, MSW mocks. |

No violations — no complexity tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/014-news-announcements/
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
│   │   └── NewsSkeleton.tsx    # Loading skeleton for news cards
│   └── ui/                     # No new primitives needed
├── config/
│   └── index.ts                # + newsCategories
├── hooks/
│   ├── useNewsForm.ts          # News create/edit form hook (parallel to useEventForm)
│   └── useNewsList.ts          # Public news list query hook
├── mocks/
│   ├── data/
│   │   └── news.ts             # Mock news articles
│   └── handlers/
│       └── news.ts             # MSW handlers for /api/news/* endpoints
├── pages/
│   ├── admin/
│   │   ├── admin-news.tsx      # Admin CRUD list page
│   │   └── news-form.tsx       # Admin create/edit form page
│   ├── home/
│   │   └── home.tsx            # + featured news section
│   └── news/
│       ├── news-detail.tsx     # Public single article
│       └── news.tsx            # Public paginated list
├── types/
│   └── index.ts                # + NewsArticle, NewsCategory, NewsStatus types
└── App.tsx                     # + /news, /news/:slug, /admin/news* routes
```

**Structure Decision**: Single-project SPA — new files follow existing conventions (co-located pages, hooks in `src/hooks/`, mocks in `src/mocks/`, types in `src/types/index.ts`). Routes follow event pattern (public `/news`, `/news/:slug`; admin `/admin/news`, `/admin/news/new`, `/admin/news/:id/edit`).

## Complexity Tracking

**No violations** — all principles pass. Simpler alternatives (e.g., reusing Event entity with a "news" type flag) rejected because News has distinct fields (slug, excerpt, rich text content, author reference, publish date, SEO metadata) that don't fit the Event model without significant compromise.
