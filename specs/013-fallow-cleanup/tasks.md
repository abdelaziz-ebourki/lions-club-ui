# Tasks: Fallow Findings Cleanup

**Input**: Design documents from `specs/013-fallow-cleanup/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No new tests required — this is a refactoring-only feature. Existing 233-test suite serves as regression guard (SC-006). Each user story phase verifies `npm run test:run`, `npx tsc -b`, and `npm run lint` pass before moving on.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. Stories are independent (dead code removal does not block duplication extraction, etc.).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup

**Purpose**: Initial setup and verification of the cleanup baseline

- [X] T001 Load `tdd` and `git-commit` agent skills per Constitution Principle II
- [X] T002 Confirm fallow CLI is available (`npx fallow --version`) and capture baseline findings to `specs/013-fallow-cleanup/baseline*.json`
- [X] T003 Verify all 233 existing tests pass (`npm run test:run`), `npx tsc -b` passes, `npm run lint` passes — capture as baseline
- [X] T004 [P] Commit baseline confirmation (no changes yet)

**Checkpoint**: Baseline established — all cleanup work will be measured against this state.

---

## Phase 2: User Story 1 — Dead Code Removal (Priority: P1) 🎯 MVP

**Goal**: Remove all unused files, types, and dependencies reported by fallow dead-code analysis.

**Independent Test**: `npx fallow dead-code --format json --quiet --tsconfig ./tsconfig.json` returns zero findings.

### Implementation for User Story 1

- [X] T005 [P] [US1] Delete unused file `src/components/ui/index.ts`
- [X] T006 [P] [US1] Check whether type exports `VerifyResult`, `NotificationState`, and `EmailVerificationStatus` are intended for future use — if yes, mark with `fallow-ignore` comments; if no, remove from `src/types/index.ts`
- [X] T007 [P] [US1] Remove unused `@radix-ui/react-slot` from `dependencies` in `package.json`
- [X] T008 [P] [US1] Move `@tailwindcss/vite` from `dependencies` to `devDependencies` in `package.json`
- [X] T009 [US1] Run `npm install` to update `package-lock.json` after dependency changes
- [X] T010 [US1] Verify: `npx fallow dead-code --format json --quiet` returns zero findings
- [X] T011 [US1] Verify: `npx tsc -b` passes, `npm run lint` passes, `npm run test:run` passes

**Checkpoint**: Dead code eliminated — zero fallow dead-code findings.

---

## Phase 3: User Story 2 — Duplication Reduction (Priority: P2)

**Goal**: Extract the 6 clearest duplication patterns into shared components/hooks, suppress remaining patterns with `fallow-ignore-next-line` comments. Target `~4%` total duplication (down from 6.2%).

**Independent Test**: `npx fallow dupes --format json --quiet` reports total duplication below 4%.

### Implementation for User Story 2

#### Pattern 1: Success-Timer Hook

- [ ] T012 [P] [US2] Extract success-timer state pattern (useState + useRef + useEffect cleanup) into shared hook `src/hooks/useSuccessTimer.ts`
- [ ] T013 [US2] Update `src/components/admin/event-form.tsx` to import and use `useSuccessTimer` from `src/hooks/useSuccessTimer`
- [ ] T014 [US2] Update `src/components/admin/member-form.tsx` to import and use `useSuccessTimer` from `src/hooks/useSuccessTimer`
- [ ] T015 [US2] Update `src/components/contact/contact.tsx` to import and use `useSuccessTimer` from `src/hooks/useSuccessTimer`
- [ ] T016 [US2] Update `src/components/forum/new-thread-form.tsx` to import and use `useSuccessTimer` from `src/hooks/useSuccessTimer`

#### Pattern 2: Hero Section Component

- [ ] T017 [P] [US2] Extract hero section pattern (border-b bg-muted/50 + overline + h1 + description) into shared component `src/components/shared/PageHero.tsx`
- [ ] T018 [US2] Update `src/components/contact/contact.tsx` to use `PageHero` component
- [ ] T019 [US2] Update `src/components/events/events.tsx` to use `PageHero` component
- [ ] T020 [US2] Update `src/components/forum/forum.tsx` to use `PageHero` component

#### Pattern 3: Event Metadata Component

- [ ] T021 [P] [US2] Extract event metadata display (Calendar + Clock + MapPin lucide icons) into shared component `src/components/shared/EventMetadata.tsx`
- [ ] T022 [US2] Update `src/components/events/event-detail.tsx` to use `EventMetadata` component
- [ ] T023 [US2] Update `src/components/events/events.tsx` to use `EventMetadata` component

#### Pattern 4: Error/Loading State Component

- [ ] T024 [P] [US2] Extract error/loading state pattern into shared component `src/components/shared/ErrorLoadingState.tsx`
- [ ] T025 [US2] Update `src/components/forum/forum.tsx` to use `ErrorLoadingState`
- [ ] T026 [US2] Update `src/components/forum/threads.tsx` to use `ErrorLoadingState`

#### Pattern 5: Auth Card + Email Field Component

- [ ] T027 [P] [US2] Extract card layout and email field pattern into shared component `src/components/shared/AuthCardFields.tsx`
- [ ] T028 [US2] Update `src/components/auth/login.tsx` to use `AuthCardFields`
- [ ] T029 [US2] Update `src/components/auth/register.tsx` to use `AuthCardFields`

#### Pattern 6: Table-Head + Empty-State Component

- [ ] T030 [P] [US2] Extract table-head and empty-state patterns into shared component `src/components/shared/AdminTable.tsx`
- [ ] T031 [US2] Update `src/components/admin/admin-events.tsx` to use `AdminTable` component
- [ ] T032 [US2] Update `src/components/admin/admin-members.tsx` to use `AdminTable` component

#### Suppress Remaining Patterns

- [ ] T033 [US2] Add `// fallow-ignore-next-line` comments to remaining duplication patterns (after the 6 extracted) with documented rationale

#### Verification

- [ ] T034 [US2] Verify: `npx fallow dupes --format json --quiet` reports total duplication below 4%
- [ ] T035 [US2] Verify: `npx tsc -b` passes, `npm run lint` passes, `npm run test:run` passes

**Checkpoint**: Duplication reduced below 4% — 6 patterns extracted, remaining suppressed.

---

## Phase 4: User Story 3 — Complexity Hotspot Refactoring (Priority: P3)

**Goal**: Refactor hotspot files to bring function sizes below 150 lines and hotspot scores below 40. Restructure api.ts to reduce blast radius.

**Independent Test**: `npx fallow health --format json --quiet` reports no function exceeding 150 lines and no file with hotspot score above 40.

### Implementation for User Story 3

#### Refactor Header Component

- [ ] T036 [US3] Refactor `src/components/layout/header.tsx` (233 lines) — extract navigation sections, mobile menu, and user dropdown into sub-components. Ensure no function exceeds 150 lines.

#### Refactor EventFormPage

- [ ] T037 [US3] Refactor `src/components/admin/event-form.tsx` (219 lines) — extract form sections (basics, metadata, contact, dates) into sub-components. Ensure no function exceeds 150 lines.

#### Refactor ContactPage

- [ ] T038 [US3] Refactor `src/components/contact/contact.tsx` (201 lines) — extract contact info blocks and form section into sub-components. Ensure no function exceeds 150 lines.

#### Refactor ThreadsPage

- [ ] T039 [US3] Refactor `src/components/forum/threads.tsx` (196 lines) — extract thread list item, category filter, and pagination into sub-components. Ensure no function exceeds 150 lines.

#### Restructure api.ts

- [ ] T040 [US3] Split `src/lib/api.ts` (164 lines) — separate generic `api()` request function from typed endpoint wrappers into `src/lib/api-client.ts` (request logic) while keeping `src/lib/api.ts` as thin re-exports for existing callers

#### Suppress SSRF Findings

- [ ] T041 [US3] Add `// fallow-ignore-next-line` comments to 8 SSRF findings in `src/lib/api-client.ts` with documented rationale (URL base is constant `VITE_API_URL`, not user-controlled); also verify no SSRF findings remain in `src/lib/api.ts`

#### Verification

- [ ] T042 [US3] Verify: `npx fallow health --format json --quiet` reports no function >150 lines and no hotspot score >40
- [ ] T043 [US3] Verify: `npx tsc -b` passes, `npm run lint` passes, `npm run test:run` passes

**Checkpoint**: Complexity hotspots tamed — all functions within limit, api.ts split.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and documentation

- [ ] T044 [P] Run full fallow report suite: `npx fallow dead-code --quiet --tsconfig ./tsconfig.json`, `npx fallow dupes --quiet`, `npx fallow health --quiet`, `npx fallow security --quiet` — confirm all success criteria met
- [ ] T045 Run `npm run test:run`, `npx tsc -b`, `npm run lint` — triple verify zero errors
- [ ] T046 [P] Save final fallow report to `specs/013-fallow-cleanup/final-report.json`
- [ ] T047 Commit all changes using `git-commit` skill (conventional commit format)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **US1 — Dead Code (Phase 2)**: No dependencies on other phases — can start after Setup
- **US2 — Duplication (Phase 3)**: No dependencies — can start after Setup (independent of US1)
- **US3 — Complexity (Phase 4)**: No dependencies — can start after Setup (independent of US1, US2)
- **Polish (Phase 5)**: Depends on US1, US2, US3 completion

### User Story Dependencies

- All three user stories are **independent** — they operate on different files. However, US2 extraction creates `src/components/shared/` and `src/hooks/` files that may be referenced in future features.
- US1 should go first (P1) as it removes clutter that could confuse the other phases.
- US2 and US3 can proceed in either order after US1.

### Parallel Opportunities

- T005, T006, T007, T008 (US1): All independent — different files
- All 6 extraction patterns (T012, T017, T021, T024, T027, T030): All independent — different files
- T036 (Header) + T037 (EventFormPage) + T038 (ContactPage) + T039 (ThreadsPage) + T040 (api.ts): All independent — different files
- T044 + T045: Can run final checks in parallel

---

## Parallel Example: User Story 2 (Phase 3)

```bash
# Launch all 6 extraction patterns together (independent files):
npx fallow dead-code --format json --quiet --tsconfig ./tsconfig.json
npx fallow dupes --format json --quiet
npx fallow health --format json --quiet
npx fallow security --format json --quiet

# Run regression checks
npm run test:run && npx tsc -b && npm run lint
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup + baseline
2. Complete Phase 2: Dead code removal
3. **STOP and VALIDATE**: `npx fallow dead-code` returns zero, all tests pass
4. Commit and deliver — immediate value with zero risk

### Incremental Delivery

1. Phase 1 + Phase 2 (US1) → Clean dead code → Commit
2. Phase 3 (US2) → Reduced duplication → Commit
3. Phase 4 (US3) → Tamed complexity → Commit
4. Phase 5 → Verified baseline → Final commit

Each story delivers measurable value independently and can be stopped after any phase.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently verifiable via its Independent Test criterion
- Commit after each task or logical group using `git-commit` skill
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- No new tests required — existing 233-test suite serves as regression guard
- Tests are written for the extracted shared components only if the user explicitly requests them
