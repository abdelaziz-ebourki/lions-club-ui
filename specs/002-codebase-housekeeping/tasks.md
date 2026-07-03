# Tasks: Codebase Housekeeping

**Input**: Design documents from `specs/002-codebase-housekeeping/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: No new tests — this is a cleanup/refactor batch. All existing tests must continue to pass.

## Phase 1: Code Quality — User Story 1 (P1) 🎯 MVP

**Goal**: Remove duplicate types, unused deps, magic numbers, dead code patterns, and naming inconsistencies.

**Independent Test**: `npx tsc -b && npm run lint && npm run test:run` — all must pass unchanged.

### Implementation for User Story 1

- [x] T001 [P] [US1] Remove duplicate `ContactMessage` interface in `src/pages/admin/admin-messages.tsx:7-15` and import canonical type from `@/types` instead
- [x] T002 [P] [US1] Extract magic number `1000 * 60 * 5` (staleTime) to a named constant `DEFAULT_STALE_TIME` in `src/App.tsx:37`
- [x] T003 [P] [US1] Extract magic number `1` (retry count) to a named constant `DEFAULT_RETRY_COUNT` in `src/App.tsx:38`
- [x] T004 [P] [US1] Extract magic numbers in `src/lib/search.ts:6,18,19,20` to named constants `MAX_QUERY_LENGTH`, `SNIPPET_FALLBACK_LENGTH`, `SNIPPET_CONTEXT_BEFORE`, `SNIPPET_CONTEXT_AFTER`
- [x] T005 [P] [US1] Extract magic number `60 * 60 * 24 * 7` (cookie maxAge) to named constant `SESSION_COOKIE_MAX_AGE` in `src/mocks/handlers/auth.ts:35`
- [x] T006 [P] [US1] Remove the `void _unused` dead code pattern from `src/pages/auth/register.tsx:38-39` — use destructuring without `_unused` variable
- [x] T007 [P] [US1] Fix lazy-export naming inconsistency in `src/App.tsx:21` — rename `ThreadListPage` to `ThreadsPage` to match exported function name `ThreadsPage`
- [x] T008 [P] [US1] Fix lazy-export naming inconsistency in `src/App.tsx:28` — rename `DashboardPage` to `AdminDashboardPage` to match exported function name `AdminDashboardPage`

**Checkpoint**: At this point, code quality issues are resolved. Run `npx tsc -b && npm run lint && npm run test:run` to verify no regressions.

---

## Phase 2: Unused Code Removal — User Story 2 (P2)

**Goal**: Remove 12 unused UI component files, 2 unused barrel files, 35+ unused sub-exports, and 1 unused type. All verified by fallow static analysis.

**Independent Test**: `fallow dead-code --format json --quiet --unused-files --unused-exports --unused-types 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); assert d['summary']['unused_files'] <= 1, f'{d[\"summary\"][\"unused_files\"]} files remain'; print('PASS')"` — only `ui/index.ts` barrel may remain flagged.

### Implementation for User Story 2

- [x] T010 [P] [US2] Remove unused component file `src/components/ui/alert.tsx` and its export from `src/components/ui/index.ts:24`
- [x] T011 [P] [US2] Remove unused component file `src/components/ui/avatar.tsx` and its export from `src/components/ui/index.ts:29`
- [x] T012 [P] [US2] Remove unused component file `src/components/ui/command.tsx` and its export from `src/components/ui/index.ts:21`
- [x] T012b [P] [US2] Remove unused dependency `cmdk` from `dependencies` in `package.json:26` (verification: `grep -r "from \"cmdk\"" src/` should return nothing — T012 removes the only consumer `command.tsx`)
- [x] T013 [P] [US2] Remove unused component file `src/components/ui/dialog.tsx` and its export from `src/components/ui/index.ts:17`
- [x] T014 [P] [US2] Remove unused component file `src/components/ui/dropdown-menu.tsx` and its export from `src/components/ui/index.ts:15`
- [x] T015 [P] [US2] Remove unused component file `src/components/ui/form.tsx` and its export from `src/components/ui/index.ts:27`
- [x] T016 [P] [US2] Remove unused component file `src/components/ui/input-group.tsx` and its export from `src/components/ui/index.ts:28`
- [x] T017 [P] [US2] Remove unused component file `src/components/ui/navigation-menu.tsx` and its export from `src/components/ui/index.ts:16`
- [x] T018 [P] [US2] Remove unused component file `src/components/ui/pagination.tsx` and its export from `src/components/ui/index.ts:25`
- [x] T019 [P] [US2] Remove unused component file `src/components/ui/scroll-area.tsx` and its export from `src/components/ui/index.ts:20`
- [x] T020 [P] [US2] Remove unused component file `src/components/ui/toggle.tsx` and its export from `src/components/ui/index.ts:22`
- [x] T021 [P] [US2] Remove unused component file `src/components/ui/toggle-group.tsx` and its export from `src/components/ui/index.ts:23`
- [x] T022 [P] [US2] Remove unused barrel file `src/components/forum/index.ts` (all component files imported directly: `thread-detail.tsx` imports from `@/components/forum/thread-header`, `@/components/forum/reply-list`, `@/components/forum/reply-form`)
- [x] T023 [P] [US2] Remove unused barrel file `src/components/search/index.ts` (component files imported directly by `search-page.tsx` and `header.tsx`)
- [x] T024 [P] [US2] Remove unused sub-exports from `src/components/ui/alert-dialog.tsx:180-182` — `AlertDialogMedia`, `AlertDialogOverlay`, `AlertDialogPortal`
- [x] T025 [P] [US2] Remove unused export `badgeVariants` from `src/components/ui/badge.tsx:50`
- [x] T026 [P] [US2] Remove unused export `buttonVariants` from `src/components/ui/button.tsx:56`
- [x] T027 [P] [US2] Remove unused exports `CardFooter`, `CardAction` from `src/components/ui/card.tsx:98,100`
- [x] T028 [P] [US2] Remove unused exports `FieldDescription`, `FieldLegend`, `FieldSeparator`, `FieldSet`, `FieldTitle` from `src/components/ui/field.tsx:228-235`
- [x] T029 [P] [US2] Remove unused exports `SelectGroup`, `SelectLabel`, `SelectScrollDownButton`, `SelectScrollUpButton`, `SelectSeparator` from `src/components/ui/select.tsx:197-202`
- [x] T030 [P] [US2] Remove unused exports `SheetClose`, `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription` from `src/components/ui/sheet.tsx:133-138`
- [x] T031 [P] [US2] Remove unused exports `TableFooter`, `TableCaption` from `src/components/ui/table.tsx:111,115`
- [x] T032 [P] [US2] Remove unused exports `TabsContent`, `tabsListVariants` from `src/components/ui/tabs.tsx:80`
- [x] T033 [P] [US2] Remove unused exports `Tooltip`, `TooltipTrigger`, `TooltipContent` from `src/components/ui/tooltip.tsx:66` (keep file — `TooltipProvider` is used in `shell.tsx`)
- [x] T034 [P] [US2] Remove unused type `SearchState` from `src/types/index.ts:96`

**Checkpoint**: Run `npx tsc -b && npm run lint && npm run test:run` to verify no regressions. Run fallow re-verification.

---

## Phase 3: Font & CSS Cleanup — User Story 3 (P3)

**Goal**: Consolidate duplicate CSS typography, extract hardcoded categories to config, fix font loading warnings.

**Independent Test**: Dev mode console shows no OTS parsing errors. Admin event form shows categories from config.

### Implementation for User Story 3

- [x] T035 [US3] Consolidate duplicate CSS typography in `src/index.css:142-144` — remove `.font-display`, `.font-heading`, `.font-body` from `@layer utilities` since `@theme inline` (lines 86-88) already generates equivalent Tailwind utilities
- [x] T036 [US3] Add `eventCategories` config array to `src/config/index.ts` with the existing hardcoded values
- [x] T037 [US3] Update `src/pages/admin/event-form.tsx` to reference categories from config instead of hardcoded string literals
- [x] T038 [US3] Investigate and remove stray font references to Playfair Display and Noto Sans — check `index.html`, `src/index.css`, and `src/` for any lingering `@import` or `<link>` tags referencing these fonts
- [x] T039 [US3] Verify font loading only includes the three intended fonts: Cinzel, Cormorant Garamond, Crimson Pro

**Checkpoint**: Run `npx tsc -b && npm run lint && npm run test:run`. Start dev server and verify no font OTS errors in console.

---

## Phase 4: Validation & Polish

**Purpose**: Final verification that all changes are correct and no regressions introduced.

- [x] T040 [P] Run full validation suite: `npx tsc -b && npm run lint && npm run test:run && npm run build`
- [x] T041 [P] Run fallow re-verification to confirm remaining unused count is minimal (only the `ui/index.ts` barrel may remain — intentionally kept)
- [x] T042 [P] Measure bundle size via `npm run build` and capture `wc -c dist/assets/*.js | tail -1` — compare against pre-cleanup baseline to confirm measurable reduction (SC-004)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (P1 — Code Quality)**: Can start immediately. All tasks are independent — no cross-phase dependencies.
- **Phase 2 (P2 — Unused Code)**: Depends on Phase 1 completion (shared files like `App.tsx`, `lib/search.ts` should be cleaned first to avoid touching the same files).
- **Phase 3 (P3 — Font & CSS)**: Depends on Phase 2 completion (src/config/index.ts will be updated).
- **Phase 4 (Validation)**: Depends on all prior phases.

### User Story Dependencies

- **User Story 1 (P1)**: Independent — no dependencies on other stories
- **User Story 2 (P2)**: Depends on US1 (same codebase, better to batch cleanup order)
- **User Story 3 (P3)**: Depends on US1 and US2 (config file setup)

### Parallel Opportunities

- All T001-T009 tasks are marked [P] — different files, no dependencies
- All T010-T034 tasks are marked [P] — all are independent file deletions/export removals
- T040 and T041 are marked [P] — can run in parallel

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Code Quality issues
2. Run validation: `npx tsc -b && npm run lint && npm run test:run`
3. This alone delivers value (removes duplicate types, dead code, magic numbers)

### Incremental Delivery

1. Complete Phase 1 → Validate → Value delivered (code quality improved)
2. Complete Phase 2 → Validate → More value (bundle size reduced, codebase smaller)
3. Complete Phase 3 → Validate → Final polish
4. Phase 4: Full validation pass

### Parallel Strategy

All tasks within each phase can be executed in parallel since they touch different files:
- Phase 1: All 9 tasks touch different files
- Phase 2: All 25 tasks touch different files
