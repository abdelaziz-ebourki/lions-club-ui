# Tasks: Performance Optimization (007-performance)

**Input**: Design documents from `specs/007-performance/` (spec.md, plan.md, research.md, quickstart.md)

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, quickstart.md

**Tests**: Tests are MANDATORY for every task group per Constitution Principle I (TDD is Non-Negotiable). Write tests FIRST, ensure they FAIL, then implement. Co-locate in `__tests__/` next to the component/page. Use Vitest + @testing-library/react + MSW.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Skill loading and test-harness verification before any implementation

- [x] T001 Load `tdd` skill and `vercel-react-best-practices` skill before implementation (Constitution II/VI). Files: `.agents/skills/tdd/SKILL.md`, `.agents/skills/vercel-react-best-practices/SKILL.md`
- [x] T002 [P] Verify test tooling is wired: confirm `vitest.config.ts` and `src/mocks/browser.ts` (MSW) are active and that `__tests__/` co-location is picked up by running `npm run test:run` to establish a green baseline (no regressions)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared test helper used by all User Story 1 image tests

**⚠️ CRITICAL**: User Story 1 tests depend on this helper

- [x] T003 [P] Create shared image-assertion test helper `src/test-utils/image-assertions.ts` exporting `expectImagesLazyAndSized(container)` that asserts every `<img>` within `container` has `loading="lazy"` and explicit `width` + `height` attributes. Used by all US1 tests.

**Checkpoint**: Foundation ready — User Story 1 implementation can begin

---

## Phase 3: User Story 1 - Images load efficiently (Priority: P1) 🎯 MVP

**Goal**: Every `<img>` in the app uses `loading="lazy"` and explicit `width`/`height` (FR-001..003, FR-008). No format conversion, no `fetchpriority` (per Q1=A clarification).

**Independent Test**: Open DevTools Network tab, reload, and verify below-fold images are NOT fetched on initial load; `document.querySelectorAll('img').forEach(img => assert img.loading === 'lazy' && img.hasAttribute('width') && img.hasAttribute('height'))`.

### Tests for User Story 1 (MANDATORY per Constitution Principle I) ⚠️

> **MANDATORY: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T004 [P] [US1] Add failing assertion to `src/components/layout/__tests__/header.test.tsx`: header logo `<img>` (src="/logo.png") has `loading="lazy"` and `width`/`height` (use `expectImagesLazyAndSized` helper)
- [x] T005 [P] [US1] Add failing assertion to `src/components/layout/__tests__/footer.test.tsx`: footer logo `<img>` has `loading="lazy"` and `width`/`height`
- [x] T006 [P] [US1] Create `src/pages/about/__tests__/about.test.tsx`: render About page within `AppProviders` + `MemoryRouter` + MSW handlers (`src/mocks/handlers/members.ts`); assert member avatar `<img>` (about.tsx:146) is lazy + has explicit dimensions (80×80)
- [x] T007 [P] [US1] Create `src/pages/events/__tests__/events.test.tsx`: render Events page with `AppProviders` + MSW (`src/mocks/handlers/events.ts`); assert each event card `<img>` (events.tsx:69) is lazy + has explicit dimensions
- [x] T008 [P] [US1] Create `src/pages/events/__tests__/event-detail.test.tsx`: render EventDetail (with route param) within `AppProviders` + MSW; assert hero `<img>` (event-detail.tsx:109) is lazy + has explicit dimensions
- [x] T009 [P] [US1] Create `src/components/shared/__tests__/FileUploadZone.test.tsx`: render `FileUploadZone` with a `previewUrl`; assert preview `<img>` (FileUploadZone.tsx:20) is lazy + has explicit dimensions

### Implementation for User Story 1

- [x] T010 [P] [US1] Add `loading="lazy"` to header logo `<img>` in `src/components/layout/header.tsx:47` (width/height already present)
- [x] T011 [P] [US1] Add `loading="lazy"` to footer logo `<img>` in `src/components/layout/footer.tsx:47` (width/height already present)
- [x] T012 [P] [US1] Add `loading="lazy"` and explicit `width={80} height={80}` to member avatar `<img>` in `src/pages/about/about.tsx:146`
- [x] T013 [P] [US1] Add `loading="lazy"` and explicit `width`/`height` reflecting the 192px-tall display box to event card `<img>` in `src/pages/events/events.tsx:69`
- [x] T014 [P] [US1] Add `loading="lazy"` and explicit `width`/`height` reflecting the max-400px display box to hero `<img>` in `src/pages/events/event-detail.tsx:109`
- [x] T015 [P] [US1] Add `loading="lazy"` and explicit `width`/`height` to preview `<img>` in `src/components/shared/FileUploadZone.tsx:20`
- [x] T016 [US1] Run `npm run test:run` scoped to US1 tests and confirm green; run `npx tsc -b` (zero errors)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Components avoid unnecessary re-renders (Priority: P2)

**Goal**: `ReplyItem` re-renders only when its own data changes; `ReplyForm` typing updates only the character counter, not the whole form (FR-004, FR-005).

**Independent Test**: React DevTools Profiler — adding a new reply does not re-render existing `ReplyItem`s; typing in the reply textarea re-renders only the counter element, not the `ReplyForm` root.

### Tests for User Story 2 (MANDATORY per Constitution Principle I) ⚠️

- [x] T017 [P] [US2] Add failing test to `src/components/forum/__tests__/reply-item.test.tsx`: wrap `ReplyItem` in a parent whose state changes; assert the `ReplyItem` render function is NOT called again when only the parent/sibling state changes (use a render-count spy / `jest.fn` tracking the component body)
- [x] T018 [P] [US2] Add failing test to `src/components/forum/__tests__/reply-form.test.tsx`: simulate typing into the textarea and assert only the character-counter subtree re-renders (spy on the form root render vs. a counter child render)

### Implementation for User Story 2

- [x] T019 [US2] Wrap `ReplyItem` with `React.memo` in `src/components/forum/reply-item.tsx` (export `memo(ReplyItem)`); confirm all props (`reply`, `depth`, `isAuthenticated`, `onReply`) are primitives or stable references (FR-004)
- [x] T020 [US2] Refactor `ReplyForm` in `src/components/forum/reply-form.tsx`: remove `form.watch('content')` (line 25) and extract the character counter into a `<CharacterCounter control={form.control} maxLength={maxLength} />` child component that uses `useWatch({ control, name: 'content' })`, so typing re-renders only the counter (FR-005)
- [x] T021 [US2] Run `npm run test:run` scoped to US2 tests and confirm green; run `npx tsc -b` (zero errors)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Page transitions are smooth (Priority: P3)

**Goal**: Shell content fade-in completes in 200ms (down from 500ms) and is disabled under `prefers-reduced-motion` (FR-006, FR-007).

**Independent Test**: Navigate between routes; the `#main-content` fade-in duration resolves to ≤200ms. With DevTools "Emulate prefers-reduced-motion: reduce", the animation is disabled.

### Tests for User Story 3 (MANDATORY per Constitution Principle I) ⚠️

- [x] T022 [P] [US3] Add failing test to `src/components/layout/__tests__/shell.test.tsx`: render `Shell` and assert the computed `animation-duration` of `#main-content` (class `animate-in`) is ≤ 0.2s (200ms)
- [x] T023 [P] [US3] Add failing test to `src/components/layout/__tests__/shell.test.tsx`: with `prefers-reduced-motion: reduce` emulated, assert the computed `animation-duration` of `#main-content` is effectively disabled (~0.01ms) — covered by the global rule in `src/index.css:276-283`

### Implementation for User Story 3

- [x] T024 [US3] Change `.animate-in` duration from `0.5s` to `0.2s` in `src/index.css:233` (`animation: fade-in 0.2s ease-out;`)
- [x] T025 [US3] Add explicit `motion-reduce:animate-none` to the `<main>` element in `src/components/layout/shell.tsx:17` for robustness/clarity (global reduced-motion rule in `src/index.css:276-283` already disables it)
- [x] T026 [US3] Run `npm run test:run` scoped to US3 tests and confirm green; run `npx tsc -b` (zero errors)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Whole-suite validation and acceptance verification

- [x] T027 [P] Run full suite `npm run test:run` — zero regressions across the app
- [x] T028 [P] Run `npx tsc -b` — zero type errors
- [x] T029 [P] Run `npm run lint` — zero warnings
- [x] T030 [P] Execute `specs/007-performance/quickstart.md` validation scenarios against `npm run dev`: DevTools Network lazy-load check, React DevTools Profiler re-render check, route-navigation animation timing, and `prefers-reduced-motion` emulation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS User Story 1 tests
- **User Stories (Phase 3-5)**: All depend on Foundational (Phase 2)
  - Stories can proceed sequentially in priority order (P1 → P2 → P3) or in parallel if staffed
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Depends on T003 (shared helper). No dependency on other stories.
- **US2 (P2)**: Independent — depends only on Foundational phase conceptually (no shared code with US1).
- **US3 (P3)**: Independent — only touches `src/index.css` and `src/components/layout/shell.tsx`.

### Within Each User Story

- Tests MUST be written and FAIL before implementation (Constitution Principle I)
- Story tests before story implementation
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- T003 (helper) is a prerequisite for all US1 tests but itself is independent
- Within US1: T004–T009 (tests) and T010–T015 (edits) each touch different files → all [P], runnable in parallel once T003 exists
- US2 and US3 are fully independent of US1 and of each other → can run in parallel by different developers
- All Polish tasks (T027–T030) are independent → parallelizable

---

## Parallel Example: User Story 1

```bash
# After T003 (helper) exists, launch all US1 image edits together (different files):
Task: "Add loading="lazy" to header logo img in src/components/layout/header.tsx:47"
Task: "Add loading="lazy" to footer logo img in src/components/layout/footer.tsx:47"
Task: "Add loading="lazy" + width/height to member avatar img in src/pages/about/about.tsx:146"
Task: "Add loading="lazy" + width/height to event card img in src/pages/events/events.tsx:69"
Task: "Add loading="lazy" + width/height to hero img in src/pages/events/event-detail.tsx:109"
Task: "Add loading="lazy" + width/height to preview img in src/components/shared/FileUploadZone.tsx:20"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (skills + baseline)
2. Complete Phase 2: Foundational (T003 helper)
3. Complete Phase 3: User Story 1 (tests T004–T009, then edits T010–T015, verify T016)
4. **STOP and VALIDATE**: Run US1 tests + DevTools Network check
5. Demo if ready

### Incremental Delivery

1. Setup + Foundational → helper ready
2. Add US1 → test independently → Demo (MVP!)
3. Add US2 → test independently → Demo
4. Add US3 → test independently → Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Scope is strictly limited per clarifications (Q1=A lazy loading + dimensions only, no format conversion/`fetchpriority`; Q2=A no numeric targets; Q3=A code-splitting out of scope)
- `prefers-reduced-motion` is already handled globally in `src/index.css:276-283`; T025 adds an explicit local guard for clarity
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
