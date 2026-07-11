---
description: "Task list for Responsive Tables — stacked card layout on mobile for admin tables and forum"
---

# Tasks: Responsive Tables

**Input**: `specs/008-responsive-tables/spec.md`

**Prerequisites**: spec.md

**Tests**: Tests are MANDATORY per Constitution Principle I (TDD is Non-Negotiable). Write tests FIRST, ensure they FAIL, then implement.

## Format

`[ID] [P] [Phase] Description` — `[P]` = can run in parallel (different files, no deps)

---

## Phase 1: AdminTable Component — Responsive Support

**Purpose**: Modify `AdminTable` to support a stacked card view on mobile (<640px) while keeping the table layout on desktop.

**Approach**: Add optional `mobileView` prop to `AdminTable`. When provided, AdminTable renders cards on `<sm` and the table on `≥sm`. No changes to the existing table rendering path.

- [x] T001 Read `src/components/shared/AdminTable.tsx` and its test file — understand current interface
- [x] T002 [P] Write test for `AdminTable` mobile view in `src/components/shared/__tests__/AdminTable.test.tsx` — verify `mobileView` renders on mobile viewport, table renders on desktop — **verify FAILS then PASSES**
- [x] T003 Add `mobileView?: ReactNode` prop to `AdminTable` — wrap table in `hidden sm:block` div, render `mobileView` in `block sm:hidden` div when provided

**Checkpoint**: AdminTable supports optional mobile card view with responsive toggle.

---

## Phase 2: Admin Events — Mobile Card Layout

**Purpose**: Admin events table shows Date and Category on mobile via card layout.

**Current**: `hidden md:table-cell` hides Date + Category on <768px.
**Target**: <640px → stacked card with all fields; ≥640px → full table (remove `hidden md:table-cell`).

- [x] T004 [P] Write test for admin events mobile view in `src/pages/admin/__tests__/admin-events.test.tsx` — verify card layout renders event title, date, category, status on rendered output — **verify FAILS then PASSES**
- [x] T005 Create mobile card view for events in `src/pages/admin/admin-events.tsx` — render each event as a Card with all fields (title, date, category badge, status badge, edit/delete actions), pass as `mobileView` to AdminTable
- [x] T006 Remove `hidden md:table-cell` from Date and Category `<TableHead>` and `<TableCell>` in `admin-events.tsx`

**Checkpoint**: Admin events all columns visible on all viewports; card layout on <640px.

---

## Phase 3: Admin Members — Mobile Card Layout

**Purpose**: Admin members table shows Role on mobile via card layout.

**Current**: `hidden md:table-cell` hides Role on <768px.
**Target**: <640px → stacked card with all fields; ≥640px → full table (remove `hidden md:table-cell`).

- [x] T007 [P] Write test for admin members mobile view in `src/pages/admin/__tests__/admin-members.test.tsx` — verify card layout renders member name, role, edit actions — **verify FAILS then PASSES**
- [x] T008 Create mobile card view for members in `src/pages/admin/admin-members.tsx` — render each member as a Card with name, role badge, edit action, pass as `mobileView` to AdminTable
- [x] T009 Remove `hidden md:table-cell` from Role `<TableHead>` and `<TableCell>` in `admin-members.tsx`

**Checkpoint**: Admin members all columns visible on all viewports; card layout on <640px.

---

## Phase 4: Forum Categories — Show Counts on Mobile

**Purpose**: Forum categories page shows thread and post counts on mobile.

**Current**: `hidden sm:block` hides thread/post counts on <640px.
**Target**: Always visible. Counts stack below description on mobile, sit inline on desktop.

- [x] T010 [P] Write test for forum categories mobile view in `src/pages/forum/__tests__/forum.test.tsx` — verify `threadCount` and `postCount` are visible in rendered output — **verify FAILS then PASSES**
- [x] T011 Remove `hidden sm:block` from the thread/post count div in `src/pages/forum/forum.tsx` — ensure the div stacks cleanly below the description on narrow screens

**Checkpoint**: Forum categories show thread and post counts on all viewports.

---

## Phase 5: Forum Threads — Show Last Activity on Mobile

**Purpose**: Thread list items show last activity date on mobile.

**Current**: `hidden sm:block` hides lastActivity on <640px.
**Target**: Always visible. Last activity stacks below thread metadata on mobile.

- [x] T012 [P] Write test for `ThreadListItem` mobile view in `src/components/shared/__tests__/ThreadListItem.test.tsx` — verify `lastActivity` text is visible in rendered output — **verify FAILS then PASSES**
- [x] T013 Remove `hidden sm:block` from the lastActivity div in `src/components/shared/ThreadListItem.tsx` — ensure the text wraps/stacks appropriately on narrow screens

**Checkpoint**: Thread list shows last activity date on all viewports.

---

## Phase 6: Admin Messages — Show Email and Date on Mobile

**Purpose**: Admin messages page shows sender email and date on mobile.

**Current**: `hidden sm:block` hides email/createdAt on <640px.
**Target**: Always visible. Email/date stacks below the message preview on mobile, sits inline on desktop.

- [x] T014 [P] Write test for admin messages mobile view — test should verify email and createdAt text are present in rendered output — **verify FAILS then PASSES**
- [x] T015 Remove `hidden sm:block` from the email/date div in `src/pages/admin/admin-messages.tsx` — ensure the div stacks below the message content on narrow screens

**Checkpoint**: Admin messages show email and date on all viewports.

---

## Phase 7: Verification

**Purpose**: Full test suite, type-check, lint, build.

- [x] T016 Run full test suite — `npm run test:run` — all tests pass
- [x] T017 Run TypeScript type-check — `npx tsc -b` — zero errors
- [x] T018 Run linter — `npm run lint` — passes
- [x] T019 Run build — `npm run build` — succeeds

**Checkpoint**: Feature complete and ready for merge.

---

## Summary of Changes

| File | Change |
|------|--------|
| `src/components/shared/AdminTable.tsx` | Add `mobileView` prop, wrap table in responsive container |
| `src/components/shared/__tests__/AdminTable.test.tsx` | New — test mobile/desktop rendering |
| `src/pages/admin/admin-events.tsx` | Add `mobileView` cards, remove `hidden md:table-cell` |
| `src/pages/admin/__tests__/admin-events.test.tsx` | Update — verify card fields |
| `src/pages/admin/admin-members.tsx` | Add `mobileView` cards, remove `hidden md:table-cell` |
| `src/pages/admin/__tests__/admin-members.test.tsx` | Update — verify card fields |
| `src/pages/forum/forum.tsx` | Remove `hidden sm:block` from counts |
| `src/pages/forum/__tests__/forum.test.tsx` | Update — verify counts visible |
| `src/components/shared/ThreadListItem.tsx` | Remove `hidden sm:block` from lastActivity |
| `src/components/shared/__tests__/ThreadListItem.test.tsx` | New — test lastActivity visible |
| `src/pages/admin/admin-messages.tsx` | Remove `hidden sm:block` from email/date |
| `src/pages/admin/__tests__/admin-messages.test.tsx` | New — test email/date visible |

## Execution Order

Phase 1 → Phases 2-6 (parallel) → Phase 7.
