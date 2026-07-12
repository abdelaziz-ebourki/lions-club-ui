# Implementation Plan: Breadcrumb Navigation

**Branch**: `011-breadcrumbs` | **Date**: 2026-07-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/011-breadcrumbs/spec.md`

## Summary

Add a reusable breadcrumb trail to all non-home/public pages (login/register excluded) using the per-page props pattern. The shadcn `Breadcrumb` component (just installed) provides the UI primitives; a shared `Breadcrumbs` wrapper component in `@/components/shared/` provides the prop API (`trail`). Each page renders `<Breadcrumbs trail={...} />` above its content section. Dynamic labels (thread title, event title) are fetched from existing API data and passed as trail segments. API failures fall back to "Unknown". WCAG 2.1 AA via `<nav aria-label="breadcrumb">` + `aria-current="page"`.

## Technical Context

**Language/Version**: TypeScript 6, React 19, Vite 8, ESM

**Primary Dependencies**: react-router-dom v7 (navigation), lucide-react (ChevronRightIcon), Tailwind v4 (styling), @/components/ui/breadcrumb.tsx (shadcn primitives — already installed)

**Storage**: N/A

**Testing**: Vitest v4 + @testing-library/react v16

**Target Platform**: Modern browsers (ES2023)

**Project Type**: Web application (SPA, client-side rendered)

**Performance Goals**: N/A — component is <20 DOM nodes, no measurable perf impact

**Constraints**: WCAG 2.1 AA compliance (`<nav aria-label="breadcrumb">` + `aria-current="page"`); follow shadcn compound component pattern

**Scale/Scope**: ~15 pages to update (forum, events, admin, about, contact, search, profile, 404), 1 reusable component, 1 type definition

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Gate I — TDD is Non-Negotiable**: PASS (no violation)
- Tests written first for `<Breadcrumbs>` component and each page integration

**Gate II — Agent Skills Discipline**: PASS (no violation)
- Load `tdd`, `git-commit`, `shadcn`, `frontend-design`, `web-design-guidelines`, `vercel-react-best-practices` before implementation

**Gate III — MCP-First Tooling**: PASS (no violation)
- shadcn-ui MCP queried for breadcrumb component docs
- context7 MCP available for react-router-dom patterns if needed

**Gate IV — TypeScript-First**: PASS (no violation)
- Strict typing, no `any`, types in `@/types/index.ts`

**Gate V — Component & Design System Discipline**: PASS (no violation)
- Uses installed shadcn breadcrumb primitives, `cn()`, Tailwind v4

**Gate VI — Best Practices**: PASS (no violation)
- WCAG 2.1 AA via nav landmark + aria-current, React.lazy already in use

**Result**: All gates pass. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/011-breadcrumbs/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── shared/
│   │   ├── Breadcrumbs.tsx        # Shared wrapper component
│   │   └── __tests__/
│   │       └── Breadcrumbs.test.tsx
│   └── ui/
│       └── breadcrumb.tsx         # shadcn primitives (already installed)
├── pages/
│   ├── forum/
│   │   ├── forum.tsx              # + <Breadcrumbs trail={["Home", "Forum"]} />
│   │   ├── threads.tsx            # + <Breadcrumbs trail={["Home", "Forum", categoryName]} />
│   │   ├── thread-detail.tsx      # + <Breadcrumbs trail={["Home", "Forum", categoryName, threadTitle]} />
│   │   └── new-thread-form.tsx    # + <Breadcrumbs trail={["Home", "Forum", categoryName, "New Thread"]} />
│   ├── events/
│   │   ├── events.tsx             # + <Breadcrumbs trail={["Home", "Events"]} />
│   │   └── event-detail.tsx      # + <Breadcrumbs trail={["Home", "Events", eventTitle]} />
│   ├── admin/
│   │   ├── dashboard.tsx          # + <Breadcrumbs trail={["Home", "Admin", "Dashboard"]} />
│   │   ├── admin-events.tsx       # + <Breadcrumbs trail={["Home", "Admin", "Events"]} />
│   │   ├── admin-members.tsx      # + <Breadcrumbs trail={["Home", "Admin", "Members"]} />
│   │   ├── admin-messages.tsx     # + <Breadcrumbs trail={["Home", "Admin", "Messages"]} />
│   │   ├── admin-forum.tsx        # + <Breadcrumbs trail={["Home", "Admin", "Forum"]} />
│   │   ├── event-form.tsx         # + <Breadcrumbs trail={["Home", "Admin", "Events", verb]} />
│   │   └── member-form.tsx        # + <Breadcrumbs trail={["Home", "Admin", "Members", verb]} />
│   ├── about.tsx                  # + <Breadcrumbs trail={["Home", "About"]} />
│   ├── contact.tsx                # + <Breadcrumbs trail={["Home", "Contact"]} />
│   ├── search.tsx                 # + <Breadcrumbs trail={["Home", "Search"]} />
│   ├── profile.tsx                # + <Breadcrumbs trail={["Home", "Profile"]} />
│   └── not-found.tsx              # + <Breadcrumbs trail={["Home", "Page Not Found"]} />
└── types/
    └── index.ts                   # + BreadcrumbSegment type
```

**Structure Decision**: Single SPA project. Shared component in `@/components/shared/`, shadcn primitives in `@/components/ui/`, types in `@/types/index.ts`. Each page renders its own `<Breadcrumbs>` inline, matching the existing `PageHero`/`AdminPageHeader` pattern.

## Complexity Tracking

No violations found. Table left empty.
