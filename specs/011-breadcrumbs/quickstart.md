# Quickstart: Breadcrumb Navigation Validation

**Phase**: Phase 1 — Design & Contracts
**Date**: 2026-07-11

## Prerequisites

- Node.js 20+, npm
- Dev server running: `npm run dev`
- MSW auto-starts with dev server

## Setup

No additional setup required. The feature is entirely frontend — no backend endpoints needed.

## Quick Validation Scenarios

### 1. Component Unit Test

```bash
npx vitest run src/components/shared/__tests__/Breadcrumbs.test.tsx
```

**Expected**: Tests pass covering:
- Renders correct number of segments
- Last segment has `aria-current="page"` and is not a link
- Internal segments are clickable links
- Empty trail renders nothing
- Long labels are truncated with ellipsis
- Renders inside `<nav aria-label="breadcrumb">`

### 2. Page-Level Integration Tests

```bash
npx vitest run src/pages/forum/__tests__/
npx vitest run src/pages/events/__tests__/
npx vitest run src/pages/admin/__tests__/
```

**Expected**: Each page's test verifies the breadcrumb trail matches the expected segments.

### 3. Visual Spot Check

> **Note**: MSW runs in dev mode. Before browsing, log in via `/login` with `admin@lionsclub.com` / `admin123`, or set the `auth_token` cookie to `admin-1` to skip login.

Navigate to these pages and verify breadcrumbs appear:

| Page | Expected Trail |
|------|----------------|
| `/about` | Home > About |
| `/contact` | Home > Contact |
| `/search` | Home > Search |
| `/profile` | Home > Profile |
| `/verify-email` | Home > Verify Email |
| `/forum` | Home > Forum |
| `/forum/cat-1` (category) | Home > Forum > General Discussion |
| `/forum/cat-1/thread-1` (thread) | Home > Forum > General Discussion > Welcome to the new Lions Club FSBM Forum! |
| `/forum/cat-1/new` (new thread) | Home > Forum > General Discussion > New Thread |
| `/events` | Home > Events |
| `/events/1` | Home > Events > Annual Charity Gala 2026 |
| `/admin` | Home > Admin > Dashboard |
| `/admin/events` | Home > Admin > Events |
| `/admin/events/new` | Home > Admin > Events > New Event |
| `/admin/members` | Home > Admin > Members |
| `/admin/members/new` | Home > Admin > Members > New Member |
| `/admin/messages` | Home > Admin > Messages |
| `/admin/forum` | Home > Admin > Forum |
| `/*` (404) | Home > Page Not Found |
| `/login` | _(no breadcrumbs)_ |
| `/register` | _(no breadcrumbs)_ |
| `/` (home) | _(no breadcrumbs)_ |

### 4. Accessibility Check

Use browser dev tools or axe DevTools to verify:
- Breadcrumb region has `role="navigation"` / `<nav>` with `aria-label="breadcrumb"`
- Last segment has `aria-current="page"`
- Internal segments are focusable `<a>` elements
- Keyboard navigation: Tab through segments works

## Key Files

| File | Purpose |
|------|---------|
| `src/components/shared/Breadcrumbs.tsx` | Shared wrapper component |
| `src/components/ui/breadcrumb.tsx` | shadcn primitives (installed) |
| `src/types/index.ts` | `BreadcrumbSegment` type |
| `specs/011-breadcrumbs/data-model.md` | Entity definitions |
| `specs/011-breadcrumbs/contracts/breadcrumb-contracts.md` | Trail definitions per route |

## Related Test Files

| Test | Location |
|------|----------|
| Breadcrumbs component | `src/components/shared/__tests__/Breadcrumbs.test.tsx` |
| Page integration tests | Co-located in each page's `__tests__/` directory |
