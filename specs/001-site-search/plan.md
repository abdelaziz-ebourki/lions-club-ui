# Implementation Plan: Site-Wide Search

**Branch**: `001-site-search` | **Date**: 2026-06-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-site-search/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add a global search bar in the site header that allows visitors and admins to
search across Events, Forum Threads, Members, and Contact Messages. Results are
displayed on a dedicated `/search` page, grouped by entity type with auth-gated
visibility for admin-only entities. Forum pages also gain inline keyword and
status filtering.

## Technical Context

**Language/Version**: TypeScript 6, React 19

**Primary Dependencies**: @tanstack/react-query v5 (data fetching),
react-router-dom v7 (search params routing)

**Storage**: REST API — search is client-side against existing endpoints
(GET /api/events, GET /api/forum/threads, GET /api/members,
GET /api/contact/messages)

**Testing**: Vitest v4 + @testing-library/react + MSW v2

**Target Platform**: Modern browsers (ES2023)

**Project Type**: Single-page application (frontend)

**Performance Goals**: Search results displayed in under 2 seconds; forum
inline filter responds within 500ms (debounced)

**Constraints**: Client-side only (no dedicated search endpoint); query
capped at 200 characters; auth state required for admin-only results

**Scale/Scope**: ~10k users, ~1000 events, ~10000 forum threads,
~500 members, ~5000 contact messages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Assessment | Status |
|-----------|-----------|--------|
| I. TDD is Non-Negotiable | All search components and pages require co-located tests in `__tests__/`. Tests first, then implementation. | ✅ Pass |
| II. Agent Skills Discipline | Use `shadcn` for search bar/result UI components, `tdd` for test workflow, `vercel-react-best-practices` for performance optimization. | ✅ Pass |
| III. MCP-First Tooling | Query `context7` for React Router search params patterns. Query `shadcn-ui` for any new component installs. | ✅ Pass |
| IV. TypeScript-First | New types (SearchQuery, SearchResult, SearchResultGroup) in `@/types`. Strict typing throughout. | ✅ Pass |
| V. Component & Design System | Search bar follows existing header pattern. Results page uses existing Card/skeleton components. | ✅ Pass |
| VI. Best Practices & Standards | Lazy-load search page. Debounce input. Respect `prefers-reduced-motion`. WCAG-compliant result announcements. | ✅ Pass |

**No violations found.** Complexity tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/001-site-search/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── search.md        # Search contract interface
└── checklists/
    └── requirements.md  # Quality checklist
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── layout/
│   │   ├── header.tsx            # (+ search bar in nav)
│   │   └── __tests__/
│   │       └── header.test.tsx   # (+ search bar tests)
│   └── search/
│       ├── search-bar.tsx        # NEW: header search input
│       ├── search-results.tsx    # NEW: results list with grouping
│       ├── search-result-item.tsx # NEW: individual result card
│       └── __tests__/
│           ├── search-bar.test.tsx
│           ├── search-results.test.tsx
│           └── search-result-item.test.tsx
├── pages/
│   ├── search/
│   │   ├── search-page.tsx       # NEW: /search route page
│   │   └── __tests__/
│   │       └── search-page.test.tsx
│   └── forum/
│       ├── threads.tsx           # (+ inline filter)
│       └── __tests__/
│           └── threads.test.tsx  # (+ filter tests)
├── lib/
│   ├── api.ts                    # (existing, no changes)
│   └── search.ts                 # NEW: client-side search logic
├── types/
│   └── index.ts                  # (+ SearchQuery, SearchResult types)
├── mocks/
│   └── handlers/
│       └── search.ts             # NEW: MSW search handler
├── config/
│   └── index.ts                  # (existing, no changes)
├── App.tsx                       # (+ /search route)
└── test/
    └── setup.ts                  # (existing, no changes)
```

**Structure Decision**: Single-project SPA (Vite + React). New `@/components/search/`
directory for search-specific components. New `@/pages/search/` for the search
page. Search logic extracted to `@/lib/search.ts`. Tests co-located in
`__tests__/` directories per existing convention.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — complexity tracking is not required.
