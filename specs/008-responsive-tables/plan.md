# Implementation Plan: Responsive Tables

**Feature**: `008-responsive-tables`
**Spec**: `specs/008-responsive-tables/spec.md`
**Created**: 2026-07-14
**Status**: Planning Complete

## Technical Context

### Stack & Environment

| Dimension | Choice |
|-----------|--------|
| Language | TypeScript 6 (strict mode) |
| Framework | React 19, Vite 8, ESM |
| Styling | Tailwind v4 (responsive utilities for breakpoints) |
| Components | shadcn/ui `Card`, `Table` primitives; existing `AdminTable` |
| Breakpoints | `sm` (640px) for table↔card switch |

### Architecture

Extend the existing `AdminTable` component with a `mobileCardRenderer` prop. Apply the same card-layout pattern to forum tables. The approach is CSS-driven with minimal React changes:

```
Desktop ≥640px:  Normal <table> rendering (unchanged)
Mobile <640px:   <table> rows → flex card layout with data-label pseudo-elements
```

### Table Inventory

| Table | Component | Current Mobile Behavior | Fields Hidden on Mobile |
|-------|-----------|------------------------|------------------------|
| Forum categories | ForumTable (or plain `<table>`) | `hidden sm:block` | Thread count, post count |
| Forum threads | ForumTable (or plain `<table>`) | `hidden sm:block` | Last activity date |
| Admin events | AdminTable | `hidden md:table-cell` | Date, category |
| Admin members | AdminTable | `hidden md:table-cell` | Role |
| Admin messages | AdminTable | `hidden sm:block` | Email, date |

### Unknowns (Resolved in research.md)

| Unknown | Resolution |
|---------|------------|
| Breakpoint for card layout | 640px (Tailwind `sm`) — matches existing patterns |
| Card layout implementation | CSS `display: block` on `<tr>`, `display: flex` on `<td>`, labels via `::before` pseudo-elements with `data-label` |
| Forum table component | Extend or wrap with same card pattern — regardless of component, same CSS approach |
| AdminTable changes | Add `mobileCardRenderer` prop for custom card content per row |

## Constitution Check

| Principle | Compliance | Notes |
|-----------|------------|-------|
| I. TDD is Non-Negotiable | ✅ PASS | Acceptance scenarios are viewport-size testable |
| II. Agent Skills Discipline | ✅ PASS | `shadcn` skill if new Card variants needed; `web-design-guidelines` for responsive review |
| III. MCP-First Tooling | ✅ PASS | shadcn-ui MCP for Card component docs if needed |
| IV. TypeScript-First | ✅ PASS | No new types needed — pure presentational change |
| V. Design System Discipline | ✅ PASS | Uses existing Card components and Tailwind responsive utilities |
| VI. Best Practices | ✅ PASS | Mobile-first responsive design, WCAG-compatible pseudo-element labels |

**Gate**: PASS — no violations found.

## Phases

### Phase 0: Setup & Research ✅

- [x] Industry best practices for responsive tables → CSS `display: block` + `::before` labels
- [x] Breakpoint analysis → 640px covers all phone viewports
- [x] Component inventory → 3 AdminTable + 2 forum tables
- [x] Document decisions in `research.md`

### Phase 1: Design ✅

- [x] No new data entities needed
- [x] Quickstart validation guide created

### Phase 2: Implementation Tasks (TBD)

```
P1  Extend AdminTable with mobileCardRenderer prop
P1  Implement card layout CSS (block/flex approach with data-label pseudo-elements)
P1  Apply card layout to admin events page
P1  Apply card layout to admin members page
P1  Apply card layout to admin messages page
P1  Apply card layout to forum categories page
P1  Apply card layout to forum threads page
P1  Remove stale hidden utility classes (hidden sm:block, hidden md:table-cell)
P1  Write tests verifying responsive behavior
P2  Test on real mobile viewports (375px–428px)
```

### Phase 3: Verification

- Verify all 5 tables show complete data at 375px viewport width
- Verify all 5 tables maintain existing layout at ≥768px viewport width
- Verify no data is hidden on any viewport
- `npm run test:run` — no regressions
- `npx tsc -b` — zero errors
- `npm run lint` — zero warnings

## Complexity & Risk

| Risk | Impact | Mitigation |
|------|--------|------------|
| CSS card layout breaks table semantics | Medium | Use `role="row"`/`role="cell"` ARIA attributes to preserve screen reader semantics |
| Forum uses different table component | Low | Same CSS pattern applies regardless of component — inspect and apply |
| Long text breaks card layout | Low | Use `text-ellipsis` + `overflow-hidden` on card details |
| Tablet viewports get wrong layout | Low | Clear breakpoint at 640px — tablets (768px+) always get table layout |

## Artifacts

- `specs/008-responsive-tables/spec.md` — feature specification
- `specs/008-responsive-tables/research.md` — technology research & decisions
- `specs/008-responsive-tables/plan.md` — this file
- `specs/008-responsive-tables/quickstart.md` — validation guide
