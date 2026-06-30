---

description: "Task list for implementing site-wide search across Events, Forum Threads, Members, and Contact Messages"
---

# Tasks: Site-Wide Search

**Input**: Design documents from `specs/001-site-search/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are MANDATORY for every feature per Constitution Principle I (TDD is Non-Negotiable). Write tests FIRST, ensure they FAIL, then implement.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- All paths use `@/` alias (e.g., `@/types/index.ts`) per existing project convention

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Add search entity types to `@/types/index.ts` (SearchQuery, SearchResult, SearchResultGroup, SearchState interfaces per data-model.md)
- [X] T002 [P] Create `@/components/search/` directory with `index.ts` barrel export
- [X] T003 [P] Create MSW search handler in `@/mocks/handlers/search.ts` with mock data for events, forum threads, members, and contact messages (auth-gated for members/messages)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Implement client-side search logic in `@/lib/search.ts`: sanitize query (trim, truncate to 200 chars), substring match on title/content fields, exact-match priority over partial, group results by entity type, auth-gate members and messages behind `user?.role === "admin"`

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 - Global Search (Priority: P1) 🎯 MVP

**Goal**: A search bar in the site header, accessible from every page. Typing a query and pressing Enter navigates to `/search?q=query`.

**Independent Test**: Navigate to any page, type a query in the header search bar, press Enter → lands on `/search?q=query` with results displayed. Empty query → `/search` with prompt. Escape → input cleared and focus removed.

### Tests for User Story 1 (MANDATORY per Constitution Principle I) ⚠️

> **MANDATORY: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T005 [P] [US1] Write SearchBar tests in `@/components/search/__tests__/search-bar.test.tsx` (renders input in header, submits on Enter navigating to `/search?q=query`, Escape clears input and removes focus, empty query navigates to `/search`, input caps at 200 characters)

### Implementation for User Story 1

- [X] T006 [US1] Implement SearchBar component in `@/components/search/search-bar.tsx`
- [X] T007 [US1] Integrate SearchBar into `@/components/layout/header.tsx`
- [X] T008 [P] [US1] Update header tests in `@/components/layout/__tests__/header.test.tsx` (verify search bar renders inside header component)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Search Results Page (Priority: P1)

**Goal**: Search results grouped by entity type (Events, Forum Threads, Members, Contact Messages) with section headings and result counts. Auth-gated visibility: Members and Messages only for admin users.

**Independent Test**: Search for a known term that exists in event titles and forum thread titles → verify both appear in their respective groups with correct headings (e.g., "Events (2)", "Forum Threads (1)"). Non-admin sees only Events + Forum Threads. Admin sees all 4 groups.

### Tests for User Story 2 (MANDATORY per Constitution Principle I) ⚠️

- [X] T009 [P] [US2] Write SearchResultItem tests in `@/components/search/__tests__/search-result-item.test.tsx` (renders title, snippet, entity type label, and link to detail page)
- [X] T010 [P] [US2] Write SearchResults tests in `@/components/search/__tests__/search-results.test.tsx` (grouped display with headings and counts, no-results empty state, network error state with retry button, admin sees 4 groups, non-admin sees 2 groups)
- [X] T011 [P] [US2] Write SearchPage tests in `@/pages/search/__tests__/search-page.test.tsx` (reads `?q=` search param from URL, calls search logic, shows loading skeleton during fetch, empty state when no query, "No results found" when no matches, admin sees all 4 entity groups, non-admin sees 2 groups, result clicks navigate to detail pages)

### Implementation for User Story 2

- [X] T012 [P] [US2] Implement SearchResultItem component in `@/components/search/search-result-item.tsx`
- [X] T013 [US2] Implement SearchResults component in `@/components/search/search-results.tsx` (depends on T012)
- [X] T014 [US2] Implement SearchPage in `@/pages/search/search-page.tsx` (uses useSearchParams, useAuth, imports search logic from @/lib/search, renders SearchResults with auth-gated data, handles loading/empty/error states)
- [X] T015 [US2] Register `/search` route in `@/App.tsx` with `React.lazy()` + `Suspense` (follows existing lazy-loading pattern)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Search Within Forum (Priority: P2)

**Goal**: On forum pages, users can filter threads by keyword, category, or status without leaving the forum section. Results filter in real-time as the user types.

**Independent Test**: Navigate to a forum page, type in the inline filter input → thread list filters in real-time. Apply a category and status filter → only threads matching both criteria are shown.

### Tests for User Story 3 (MANDATORY per Constitution Principle I) ⚠️

- [X] T016 [P] [US3] Write forum filter tests in `@/pages/forum/__tests__/threads.test.tsx` (keyword input filters threads in real-time, category dropdown narrows results, status dropdown filters active/pinned/locked/archived, combined category + status filter works correctly)

### Implementation for User Story 3

- [X] T017 [US3] Add inline keyword filter input to `@/pages/forum/threads.tsx`
- [X] T018 [US3] Add category and status filter dropdowns to forum page

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T019 [P] Add 300ms debounce to search bar input for rapid successive searches
- [X] T020 [P] Add loading skeleton and error boundary around search results
- [X] T021 Run `npm run lint && npx tsc -b` for type safety and lint compliance
- [X] T022 Run `npm run test:run` to verify all tests pass (existing + new)
- [ ] T023 Validate against `specs/001-site-search/quickstart.md` manual scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories proceed sequentially in priority order (P1 → P1 → P2)
  - US1 (Global Search) must complete before US2 (Results Page) since results page depends on search navigation
  - US3 (Forum Filter) is independent of US1/US2
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **User Story 2 (P1)**: Depends on US1 (search bar navigates to results page) — but independently testable by navigating directly to `/search?q=term`
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) — Independent of US1/US2

### Within Each User Story

- Tests MUST be written and FAIL before implementation (per Constitution Principle I)
- Types before logic
- Components before page integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel
- All tests for a user story marked [P] can run in parallel
- Components within a story marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
npx vitest run src/components/search/__tests__/search-bar.test.tsx
npx vitest run src/components/layout/__tests__/header.test.tsx
```

## Parallel Example: User Story 2

```bash
# Launch all tests for User Story 2 together:
npx vitest run src/components/search/__tests__/search-result-item.test.tsx
npx vitest run src/components/search/__tests__/search-results.test.tsx
npx vitest run src/pages/search/__tests__/search-page.test.tsx

# Launch all implementation components together (after tests pass):
# (T012, T013, T014, T015 — T013 depends on T012, so T012 first)
```

## Parallel Example: User Story 3

```bash
# Launch tests:
npx vitest run src/pages/forum/__tests__/threads.test.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 — Global Search
4. **STOP and VALIDATE**: Search bar in header, navigates to `/search?q=query`
5. Deploy/demo if ready

### Recommended Initial Scope (US1 + US2)

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (Global Search) → Test independently
3. Add User Story 2 (Results Page) → Test independently
4. **STOP and VALIDATE**: End-to-end search with grouped results and auth gating (both P1 stories)
5. Deploy/demo

### Full Delivery (All Stories)

1. Complete Phases 1–4 (US1 + US2) → Core search functionality
2. Add User Story 3 (Forum Filter) → Test independently
3. Complete Polish phase
4. Final validation against quickstart.md

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (Red-Green-Refactor)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Use `git-commit` skill for all commits (conventional commit format)
- Query `context7` MCP for React Router search params patterns
- Query `shadcn-ui` MCP for any new component installs (e.g., input, command, dialog)
- Load `tdd` skill before each implementation session
- See `.specify/memory/constitution.md` for full governance rules
