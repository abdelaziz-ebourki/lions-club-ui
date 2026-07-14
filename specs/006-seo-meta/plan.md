# Implementation Plan: SEO Improvements

**Feature**: `006-seo-meta`
**Spec**: `specs/006-seo-meta/spec.md`
**Created**: 2026-07-14
**Status**: Planning Complete

## Technical Context

### Stack & Environment

| Dimension | Choice |
|-----------|--------|
| Language | TypeScript 6 (strict mode) |
| Framework | React 19, Vite 8, ESM |
| Routing | react-router-dom v7 (BrowserRouter) |
| Data fetching | @tanstack/react-query v5 |
| Rendering | Pure client-side SPA (no SSR/SSG) |
| Head management | `react-helmet-async` (to be installed) |
| Styling | Tailwind v4 (no impact on SEO) |

### Architecture

```
AppProviders
  └─ QueryClientProvider
    └─ ThemeProvider
      └─ BrowserRouter
        └─ HelmetProvider          ← NEW
          └─ Toaster
            └─ AuthProvider
              └─ ErrorBoundary
                └─ Routes
```

Each page component will either:
- Use `useSEOMeta(config)` hook directly, OR
- Render `<SEOMetaHead config={config} />` component

A central `seoConfig.ts` registry maps route patterns to their metadata (static strings or data-driven resolvers).

### Key Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| `react-helmet-async` | latest | Concurrent-safe head management |
| `@/types/index.ts` | existing | Extend with `SEOMetadata` type |
| `@/config/index.ts` | existing | `siteConfig` for fallback values |

### Route Inventory

- **12 static/metadata-only routes** — Home, Events, Forum, About, Contact, Login, Register, Profile, Verify Email, Search, New Thread, 404
- **3 dynamic-detail routes** — Event detail (`/events/:id`), Category thread list (`/forum/:categoryId`), Thread detail (`/forum/:categoryId/:threadId`)
- **~9 admin routes** — Excluded from SEO (noindex + generic title)

### Unknowns (Resolved in research.md)

| Unknown | Resolution |
|---------|------------|
| Head management library | `react-helmet-async` |
| Image fallback for OG | `/logo.png` (already exists in `public/` and referenced in `index.html`) |
| react-helmet-async conflict | Resolved: spec assumption updated to use `react-helmet-async` |
| Tracking parameters exclusion | `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `fbclid`, `gclid`, `ref` |
| Admin route SEO | `noindex` applied to all `/admin/*` routes; auth-gated pages (profile, verify-email) also noindex |
| Special character handling | No sanitization needed (React handles it) |
| Admin route SEO | Excluded with noindex |
| Loading state titles | Static fallback until data loads |

## Constitution Check

| Principle | Compliance | Notes |
|-----------|------------|-------|
| I. TDD is Non-Negotiable | ✅ PASS | Tests written before implementation; acceptance scenarios in spec are testable |
| II. Agent Skills Discipline | ✅ PASS | `tdd`, `vercel-react-best-practices`, `shadcn` skills loaded as needed |
| III. MCP-First Tooling | ✅ PASS | Context7 queried for `react-helmet-async` API docs; shadcn-ui MCP not needed |
| IV. TypeScript-First | ✅ PASS | `SEOMetadata` type defined; no `any`; Zod not needed (SEO is display-only) |
| V. Design System Discipline | ✅ PASS | No new UI components — only head management (no visual impact) |
| VI. Best Practices | ✅ PASS | Lazy-loaded routes handled; React Query for dynamic data; no raw fetch() |

**Gate**: PASS — no violations found.

## Phases

### Phase 0: Setup & Research ✅

- [x] Run research on head management library → `react-helmet-async`
- [x] Investigate existing types → `Event`, `ForumThread` already sufficient
- [x] Explore routing structure → 15 public routes, 9 admin routes
- [x] Verify `og:image` fallback → `/logo.png` exists in `public/`
- [x] Document decisions in `research.md`

### Phase 1: Design & Contracts ✅

- [x] Define `SEOMetadata` data model → `data-model.md`
- [x] Map all routes to SEO metadata → page metadata table in data-model.md
- [x] Create quickstart validation guide → `quickstart.md`

### Phase 2: Implementation Tasks (TBD — to be generated in tasks.md)

Task breakdown (generated in next phase):

```
P1  Install react-helmet-async
P1  Add SEOMetadata type to @/types/index.ts
P1  Create useSEOMeta hook (central head management)
P1  Add HelmetProvider to AppProviders
P1  Create seoConfig.ts route-to-metadata registry
P1  Write tests for useSEOMeta hook
P1  Integrate SEO into Shell layout (static routes via registry)
P1  Integrate SEO into EventDetailPage (dynamic)
P1  Integrate SEO into ThreadDetailPage (dynamic)
P1  Integrate SEO into ForumThreadsPage (dynamic category)
P1  Integrate SEO into SearchPage (query-based)
P1  Handle admin routes (noindex + generic title)
P1  Handle auth-gated pages (profile, verify-email — noindex)
P1  Add twitter:site (@lionsclubfsbm) to all pages
P1  Write E2E tests verifying acceptance scenarios
P2  Clean up stale index.html meta tags (keep static base only)
P2  Verify Lighthouse/Debugger output
```

### Phase 3: Verification (TBD)

- Run `npm run test:run` — all SEO-related tests pass
- Run `npx tsc -b` — zero errors
- Run `npm run lint` — zero warnings
- Manually verify acceptance scenarios per quickstart.md
- Verify OG tags via Facebook Sharing Debugger / X Card Validator

## Complexity & Risk

| Risk | Impact | Mitigation |
|------|--------|------------|
| `react-helmet-async` usage in concurrent mode | Medium | Follow official docs; test with React.StrictMode |
| Lazy-loaded page timing for SEO | Low | Fallback title shown during Suspense; updates after data resolves |
| Race conditions on rapid route changes | Low | `react-helmet-async` deduplicates by `helmet` key |
| No SSR means limited SEO for non-JS crawlers | Accepted | Out of scope per spec; documented assumption |

## Artifacts

- `specs/006-seo-meta/spec.md` — feature specification (updated with clarifications)
- `specs/006-seo-meta/research.md` — technology research & decisions
- `specs/006-seo-meta/data-model.md` — data model & route metadata table
- `specs/006-seo-meta/quickstart.md` — validation guide
- `specs/006-seo-meta/plan.md` — this file
