---

description: "Task list for Batch 3: UX Polish — skeletons, empty states, remember me, RSVP, success toasts"
---

# Tasks: UX Polish

**Input**: Design documents from `specs/004-ux-polish/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/rsvp.md, quickstart.md

**Tests**: Tests are MANDATORY per Constitution Principle I (TDD is Non-Negotiable). Write tests FIRST, ensure they FAIL, then implement.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US5)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create shared component reused across multiple user stories.

- [x] T001 Create `EmptyState` component at `src/components/shared/empty-state.tsx` with `icon`, `title`, `description`, `action` props; uses lucide-react icon, `role="status"`, centered flex column layout; write test first in `src/components/shared/__tests__/empty-state.test.tsx`

**Checkpoint**: Shared `EmptyState` component ready for use by all empty-state tasks.

---

## Phase 2: Foundational

**Purpose**: No blocking prerequisites — all stories are independent component/page changes.

**⚠️ CRITICAL**: No foundational infrastructure needed. Skeleton and EmptyState component already exist or are created in Phase 1.

- [ ] T002 [P] Read and understand existing skeleton pattern in `src/pages/forum/forum.tsx` and `src/pages/forum/threads.tsx` — use as template for admin pages
- [ ] T003 [P] Read and understand existing `PageSkeleton` at `src/components/shared/page-skeleton.tsx` — use for admin list pages

**Checkpoint**: Foundation clear — user story implementation can begin.

---

## Phase 3: User Story 1 — Loading Skeletons (Priority: P1) 🎯 MVP

**Goal**: All 5 list pages show skeleton placeholders while data loads. Forum and forum-threads already have skeletons; focus on the 3 missing: admin events, admin members, and verify existing.

**Independent Test**: Navigate to admin events/members pages with simulated loading and verify `Skeleton` elements are rendered before content replaces them.

### Tests for User Story 1 (MANDATORY per Constitution Principle I) ⚠️

- [x] T004 [P] [US1] Write test for skeleton loading on admin events page in `src/pages/admin/__tests__/admin-events.test.tsx` — verify `Skeleton` elements render when query is loading — **verified FAILS then PASSES**
- [x] T005 [P] [US1] Write test for skeleton loading on admin members page in `src/pages/admin/__tests__/admin-members.test.tsx` — verify `Skeleton` elements render when query is loading — **verified FAILS then PASSES**

### Implementation for User Story 1

- [x] T006 [US1] Add skeleton loading state to admin events page in `src/pages/admin/admin-events.tsx` — integrate `isLoading` from `useQuery`; render `Skeleton` in table row format; use `aria-busy="true"` — **verify T004 PASSES**
- [x] T007 [US1] Add skeleton loading state to admin members page in `src/pages/admin/admin-members.tsx` — same pattern as admin events — **verify T005 PASSES**
- [ ] T008 [US1] Verify existing skeleton on forum categories page (`src/pages/forum/forum.tsx`) already renders during loading
- [ ] T009 [US1] Verify existing skeleton on forum threads page (`src/pages/forum/threads.tsx`) already renders during loading
- [ ] T010 [US1] Verify existing skeleton on search results (`src/components/search/search-results.tsx`) already renders during `isSearching`

**Checkpoint**: All 5 list pages show skeleton placeholders during loading. User Story 1 testable independently.

---

## Phase 4: User Story 2 — Empty States (Priority: P1)

**Goal**: All 5 empty-state scenarios display helpful messages with CTAs using the shared `EmptyState` component.

**Independent Test**: Navigate to any empty list page and verify empty state with icon, message, and CTA renders.

### Tests for User Story 2 (MANDATORY per Constitution Principle I) ⚠️

- [ ] T011 [P] [US2] Write test for empty state on admin events page in `src/pages/admin/__tests__/admin-events.test.tsx` — verify "No projects yet" and "Create your first project" CTA render when `data` is empty — **verify FAILS**
- [ ] T012 [P] [US2] Write test for empty state on admin members page in `src/pages/admin/__tests__/admin-members.test.tsx` — verify "No members yet" and "Add your first member" CTA render when `data` is empty — **verify FAILS**
- [ ] T013 [P] [US2] Write test for empty state on forum categories page in `src/pages/forum/__tests__/forum.test.tsx` — verify "No discussions yet" and "Start a discussion" render when categories are empty — **verify FAILS**
- [ ] T014 [P] [US2] Write test for empty state on forum threads page in `src/pages/forum/__tests__/threads.test.tsx` — verify existing empty message is upgraded to `EmptyState` component — **verify FAILS**
- [ ] T015 [P] [US2] Write test for empty state on thread detail page in `src/pages/forum/__tests__/thread-detail.test.tsx` — verify "No replies yet" and "Be the first to reply" render when replies are empty — **verify FAILS**
- [ ] T016 [P] [US2] Write test for empty state on search results in `src/components/search/__tests__/search-results.test.tsx` — verify existing inline empty state is upgraded to `EmptyState` component — **verify FAILS**

### Implementation for User Story 2

- [ ] T017 [US2] Add empty state to admin events page in `src/pages/admin/admin-events.tsx` — render `<EmptyState icon={CalendarX} title="No projects yet" description="Create your first community project." action={<Link to="/admin/events/new"><Button>Create your first project</Button></Link>} />` when `events` array is empty — **verify T011 PASSES**
- [ ] T018 [US2] Add empty state to admin members page in `src/pages/admin/admin-members.tsx` — render `<EmptyState icon={Users} title="No members yet" description="Add your first club member." action={<Link to="/admin/members/new"><Button>Add your first member</Button></Link>} />` when `members` array is empty — **verify T012 PASSES**
- [ ] T019 [US2] Upgrade empty state on forum categories page in `src/pages/forum/forum.tsx` — replace inline `<p>No categories yet...</p>` with `<EmptyState>` component showing "No categories yet" per FR-010b — **verify T013 PASSES**
- [ ] T020 [US2] Upgrade empty state on forum threads page in `src/pages/forum/threads.tsx` — replace existing "No threads yet. Start the conversation." with `<EmptyState icon={...} title="No discussions yet" description="Be the first to start a discussion." action={...} />` per FR-008 — **verify T014 PASSES**
- [ ] T021 [US2] Add empty state for replies on thread detail page in `src/pages/forum/thread-detail.tsx` — render `EmptyState` for empty replies list — **verify T015 PASSES**
- [ ] T022 [US2] Upgrade empty state on search results in `src/components/search/search-results.tsx` — replace inline "No results found" div with `<EmptyState icon={SearchX} title="No results found" description="Try different keywords or browse the forum." />` — **verify T016 PASSES**

**Checkpoint**: All 5 empty-state scenarios render helpful messages with CTAs. User Story 2 testable independently.

---

## Phase 5: User Story 3 — Remember Me (Priority: P2)

**Goal**: Login form offers "Remember me" checkbox; checking it persists session across browser restarts.

**Independent Test**: Login form renders "Remember me" checkbox below password field. Checking it stores `localStorage` flag.

### Tests for User Story 3 (MANDATORY per Constitution Principle I) ⚠️

- [ ] T023 [US3] Write test for "Remember me" checkbox in `src/pages/auth/__tests__/login.test.tsx` — verify checkbox renders below password field, checking it stores `remember_me` in localStorage, unchecking removes it — **verify FAILS**

### Implementation for User Story 3

- [ ] T024 [US3] Add "Remember me" checkbox to login form in `src/pages/auth/login.tsx` — add checkbox input below password field using `Field` component pattern; on change, set/remove `remember_me` in `localStorage`; on form submit, pass flag to API (header or query param) — **verify T023 PASSES**

**Checkpoint**: Login form has "Remember me" checkbox; localStorage flag managed on check/uncheck.

---

## Phase 6: User Story 4 — RSVP Button (Priority: P2)

**Goal**: Event detail page shows "Join Event" button; clicking it records RSVP and changes state to "Going"; past events hide button; unauthenticated users redirected to login.

**Independent Test**: View event detail, click "Join Event", verify button changes to "Going". View past event, verify no button.

### Tests for User Story 4 (MANDATORY per Constitution Principle I) ⚠️

- [ ] T025 [P] [US4] Write test for RSVP button rendering in `src/pages/events/__tests__/event-detail.test.tsx` — verify "Join Event" button shows for upcoming event when `hasRsvpd` is false — **verify FAILS**
- [ ] T026 [P] [US4] Write test for RSVP click flow in event detail test — verify clicking "Join Event" triggers mutation and button changes to "Going" — **verify FAILS**
- [ ] T027 [P] [US4] Write test for RSVP button hidden on past events in event detail test — verify button is not shown when event status is past — **verify FAILS**
- [ ] T028 [P] [US4] Write test for unauthenticated RSVP click in event detail test — verify unauthorized visitor is redirected to `/login?return=/events/:id` — **verify FAILS**

### Implementation for User Story 4

- [ ] T029 [US4] Add RSVP button to event detail page in `src/pages/events/event-detail.tsx` — render "Join Event" button when `hasRsvpd` is false and event is upcoming; show "Going" (disabled) when `hasRsvpd` is true; hide button for past events — **verify T025, T027 PASS**
- [ ] T030 [US4] Implement RSVP mutation in event detail page — use `useMutation` to call `api.post("/events/${id}/rsvp", {})`; on success, update query cache or refetch event; on error, show error toast and reset button; use local optimistic state if backend endpoint unavailable — **verify T026 PASSES**
- [ ] T031 [US4] Implement auth gate for RSVP click — on "Join Event" click, check auth state; if unauthenticated, navigate to `/login?return=/events/${id}` — **verify T028 PASSES**
- [ ] T032 [US4] Augment `Event` type in `src/types/index.ts` with optional `rsvpCount` and `hasRsvpd` fields

**Checkpoint**: Event detail page has full RSVP flow. User Story 4 testable independently.

---

## Phase 7: User Story 5 — Success Toasts (Priority: P3)

**Goal**: Login and registration show success toast before navigating to home page.

**Independent Test**: Submit valid login credentials, verify "Welcome back!" toast appears. Register new account, verify "Account created successfully!" toast appears.

### Tests for User Story 5 (MANDATORY per Constitution Principle I) ⚠️

- [ ] T033 [US5] Write test for login success toast in `src/pages/auth/__tests__/login.test.tsx` — verify toast is called with "Welcome back!" on successful login — **verify FAILS**
- [ ] T034 [US5] Write test for register success toast in `src/pages/auth/__tests__/register.test.tsx` — verify toast is called with "Account created successfully!" on successful registration — **verify FAILS**

### Implementation for User Story 5

- [ ] T035 [US5] Add success toast to login in `src/pages/auth/login.tsx` — replace `window.location.reload()` with `toast.success("Welcome back!")` followed by `navigate("/")` — **verify T033 PASSES**
- [ ] T036 [US5] Add success toast to register in `src/pages/auth/register.tsx` — replace `window.location.reload()` with `toast.success("Account created successfully!")` followed by `navigate("/")` — **verify T034 PASSES**

**Checkpoint**: Both login and register show success toasts. User Story 5 testable independently.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Verification, type-checking, and final validation across all stories.

- [ ] T037 [P] Run full test suite — `npm run test:run` — all 160+ tests must pass (existing + new)
- [ ] T038 [P] Run TypeScript type-check — `npx tsc -b` — zero errors
- [ ] T039 [P] Run linter — `npm run lint` — passes (excluding pre-existing errors)
- [ ] T040 [P] Run quickstart validation scenarios from `specs/004-ux-polish/quickstart.md`
- [ ] T041 Run build — `npm run build` — production build succeeds

**Checkpoint**: All acceptance criteria verified. Feature complete and ready for merge.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: No dependencies — research-only, can run parallel with Phase 1
- **User Stories (Phase 3–7)**: All depend on Phase 1 (EmptyState component for US2)
  - US1, US3, US4, US5 have no inter-story dependencies
  - US2 depends on Phase 1 (EmptyState component)
  - Stories can proceed sequentially (P1 → P2 → P3) or in parallel
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1) — Skeletons**: Independent — no phase/story dependencies beyond Setup
- **US2 (P1) — Empty States**: Depends on Phase 1 (EmptyState component)
- **US3 (P2) — Remember Me**: Independent
- **US4 (P2) — RSVP**: Independent (may need Event type augmentation in T032)
- **US5 (P3) — Success Toasts**: Independent

### Within Each User Story

- Tests MUST be written and FAIL before implementation (per Constitution Principle I)
- Component/page modifications before state management
- Story complete before moving to next priority

### Parallel Opportunities

- All test-writing tasks within a story marked [P] can run in parallel
- US1 and US3 can proceed in parallel after Phase 1
- US4 and US5 can proceed in parallel after Phase 1

---

## Parallel Example: Phase 1 + Phase 2

```bash
# Create EmptyState component:
Task: "T001 — Create EmptyState component at src/components/shared/empty-state.tsx"

# Research existing patterns (can run alongside T001):
Task: "T002 — Read skeleton pattern from src/pages/forum/forum.tsx"
Task: "T003 — Read PageSkeleton from src/components/shared/page-skeleton.tsx"
```

## Parallel Example: Phase 3 (US1)

```bash
# Write tests in parallel:
Task: "T004 — Write admin-events skeleton test"
Task: "T005 — Write admin-members skeleton test"

# Implement after tests pass (sequential):
Task: "T006 — Implement admin-events skeleton"
Task: "T007 — Implement admin-members skeleton"
```

## Parallel Example: Phase 4 (US2)

```bash
# Write all empty-state tests in parallel:
Task: "T011 — Admin events empty state test"
Task: "T012 — Admin members empty state test"
Task: "T013 — Forum categories empty state test"
Task: "T014 — Forum threads empty state test"
Task: "T015 — Thread detail empty state test"
Task: "T016 — Search results empty state test"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (EmptyState)
2. Complete Phase 3: US1 (Loading Skeletons)
3. **STOP and VALIDATE**: Test US1 independently
4. Deploy/demo if ready — skeletons alone improve UX significantly

### Incremental Delivery

1. Setup + US1 → MVP: Skeletons on all list pages
2. Add US2 → Empty states on all pages with CTAs
3. Add US3 → Remember me on login
4. Add US4 → RSVP on event detail
5. Add US5 → Success toasts on auth forms
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Developer A completes Phase 1 (EmptyState component)
2. Once Phase 1 is done:
   - Developer A: US1 (skeletons) + US2 (empty states)
   - Developer B: US3 (remember me) + US4 (RSVP)
   - Developer C: US5 (success toasts)
3. Polish phase validates everything together

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group using `git-commit` skill
- Stop at any checkpoint to validate story independently
- Load `tdd`, `shadcn`, `git-commit` skills before starting implementation
- Refer to `contracts/rsvp.md` for RSVP API contract details
- Refer to `data-model.md` for component props and state models
- Refer to `quickstart.md` for validation scenarios
