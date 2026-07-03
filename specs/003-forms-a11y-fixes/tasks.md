# Tasks: Forms Validation & Accessibility Fixes

**Input**: Design documents from `specs/003-forms-a11y-fixes/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Tests are MANDATORY for every feature per Constitution Principle I (TDD is Non-Negotiable). Write tests FIRST, ensure they FAIL, then implement.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- Include exact file paths in descriptions

---

## Phase 1: Forms — Event "Ongoing" Status Fix (Story S1)

**Goal**: Accept and preserve "ongoing" event status in the event form

- [x] T001 [S1] **Write test**: event form Zod schema accepts "upcoming" | "ongoing" | "past" — `src/pages/admin/__tests__/event-form.test.tsx`
- [x] T002 [S1] **Write test**: event form does not coerce "ongoing" to "past" on edit — `src/pages/admin/__tests__/event-form.test.tsx`
- [x] T003 [S1] **Implement**: Expand event-form Zod status enum to include "ongoing" — `src/pages/admin/event-form.tsx:18-26`
- [x] T004 [S1] **Implement**: Remove coercion line `(event.status === "upcoming" ? "upcoming" : "past")` — `src/pages/admin/event-form.tsx:51`

---

## Phase 2: Forms — maxLength Constraints (Story S2)

**Goal**: Add upper character limits to all form Zod schemas

- [x] T005 [P] [S2] **Write test**: contact form rejects input exceeding maxLength — `src/pages/contact/__tests__/contact.test.tsx`
- [x] T006 [P] [S2] **Write test**: member form rejects input exceeding maxLength — `src/pages/admin/__tests__/member-form.test.tsx`
- [x] T007 [P] [S2] **Write test**: event form rejects input exceeding maxLength — `src/pages/admin/__tests__/event-form.test.tsx`
- [x] T008 [P] [S2] **Write test**: new-thread form rejects input exceeding maxLength — `src/pages/forum/__tests__/new-thread-form.test.tsx`
- [x] T009 [P] [S2] **Implement**: Add max(100) to name, max(200) to subject, max(2000) to message — `src/pages/contact/contact.tsx:27-32`
- [x] T010 [P] [S2] **Implement**: Add max(100) to name, max(100) to role, max(500) to bio — `src/pages/admin/member-form.tsx:16-20`
- [x] T011 [P] [S2] **Implement**: Add max(200) to title, max(2000) to desc, max(200) to location — `src/pages/admin/event-form.tsx:18-26`
- [x] T012 [P] [S2] **Implement**: Add max(200) to title, max(5000) to content — `src/pages/forum/new-thread-form.tsx:15-18`

---

## Phase 3: Forms — Character Count Indicators (Story S3)

**Goal**: Show live `{length}/{max}` counters with color transitions on all text fields

- [x] T013 [P] [S3] **Write test**: character count renders and updates on keystroke — `src/pages/contact/__tests__/contact.test.tsx`
- [x] T014 [P] [S3] **Write test**: character count shows orange ≥80% and red at 100% — `src/pages/contact/__tests__/contact.test.tsx`
- [x] T015 [P] [S3] **Implement**: Add char count below name/subject/message fields with colored thresholds — `src/pages/contact/contact.tsx`
- [x] T016 [P] [S3] **Implement**: Add char count below name/role/bio fields with colored thresholds — `src/pages/admin/member-form.tsx`
- [x] T017 [P] [S3] **Implement**: Add char count below title/desc/location fields with colored thresholds — `src/pages/admin/event-form.tsx`
- [x] T018 [P] [S3] **Implement**: Add char count below title/content fields with colored thresholds — `src/pages/forum/new-thread-form.tsx`
- [x] T019 [S3] **Implement**: Extract shared char count rendering pattern from reply-form.tsx for reuse — `src/components/forum/reply-form.tsx` (reference)

---

## Phase 4: Forms — Submit Spinner (Story S4)

**Goal**: Animated spinner inside all submit buttons during pending state

- [x] T020 [P] [S4] **Write test**: submit button shows spinner during pending state — useMutation forms
- [x] T021 [P] [S4] **Write test**: submit button is disabled while request is in flight
- [x] T022 [S4] **Implement**: Create shared Spinner SVG component — `src/components/ui/spinner.tsx`
- [x] T023 [P] [S4] **Implement**: Wire spinner into event-form submit button — `src/pages/admin/event-form.tsx`
- [x] T024 [P] [S4] **Implement**: Wire spinner into member-form submit button — `src/pages/admin/member-form.tsx`
- [x] T025 [P] [S4] **Implement**: Wire spinner into contact form submit button — `src/pages/contact/contact.tsx`
- [x] T026 [P] [S4] **Implement**: Wire spinner into new-thread-form submit button — `src/pages/forum/new-thread-form.tsx`
- [x] T027 [P] [S4] **Implement**: Wire spinner into reply-form submit button — `src/components/forum/reply-form.tsx`
- [x] T028 [P] [S4] **Implement**: Wire spinner into login submit button — `src/pages/auth/login.tsx`
- [x] T029 [P] [S4] **Implement**: Wire spinner into register submit button — `src/pages/auth/register.tsx`

---

## Phase 5: Forms — Success Field Glow (Story S5)

**Goal**: Green ring/glow on validated fields after successful submission

- [x] T030 [S5] **Write test**: form fields show green glow after successful save — `src/pages/contact/__tests__/contact.test.tsx`
- [x] T031 [S5] **Write test**: green glow fades after 2 seconds
- [x] T032 [P] [S5] **Implement**: Add success glow + auto-fade to event-form — `src/pages/admin/event-form.tsx`
- [x] T033 [P] [S5] **Implement**: Add success glow + auto-fade to member-form — `src/pages/admin/member-form.tsx`
- [x] T034 [P] [S5] **Implement**: Add success glow + auto-fade to contact form — `src/pages/contact/contact.tsx`
- [x] T035 [P] [S5] **Implement**: Add success glow + auto-fade to new-thread-form — `src/pages/forum/new-thread-form.tsx`

---

## Phase 6: A11y — Skip-to-Content Link (Story S6)

**Goal**: First Tab target moves focus to main content — WCAG 2.4.1

- [x] T036 [S6] **Write test**: skip-to-content link is the first focusable element — `src/components/layout/__tests__/shell.test.tsx`
- [x] T037 [S6] **Write test**: skip link moves focus to main content on activation
- [x] T038 [S6] **Implement**: Add `#main-content` id to `<main>` — `src/components/layout/shell.tsx`
- [x] T039 [S6] **Implement**: Add visually-hidden skip link as first child of shell — `src/components/layout/shell.tsx`

---

## Phase 7: A11y — Nav Landmarks & aria-current (Stories S7, S8)

**Goal**: Distinct nav labels and current-page indicators for screen readers

- [x] T040 [P] [S7] **Write test**: admin nav has `aria-label="Admin navigation"` — `src/pages/admin/__tests__/admin-layout.test.tsx`
- [x] T041 [P] [S7] **Write test**: header nav has `aria-label="Main navigation"` — `src/components/layout/__tests__/header.test.tsx`
- [x] T042 [P] [S8] **Write test**: admin sidebar active link has `aria-current="page"` — `src/pages/admin/__tests__/admin-layout.test.tsx`
- [x] T043 [P] [S8] **Write test**: header active link has `aria-current="page"` — `src/components/layout/__tests__/header.test.tsx`
- [x] T044 [P] [S7, S8] **Implement**: Add `aria-label="Admin navigation"` + `aria-current={isActive ? "page" : undefined}` — `src/pages/admin/admin-layout.tsx:24-42`
- [x] T045 [P] [S7, S8] **Implement**: Add `aria-label="Main navigation"` + `aria-current={isActive ? "page" : undefined}` — `src/components/layout/header.tsx:38-53`

---

## Phase 8: A11y — Decorative Icons (Story S11)

**Goal**: Purely decorative SVGs hidden from screen readers via `aria-hidden="true"`

- [x] T046 [S11] **Write test**: decorative icons have `aria-hidden="true"` on rendered DOM — one test per component batch
- [x] T047 [P] [S11] **Implement**: Add `aria-hidden="true"` to forum category `<Icon>` — `src/pages/forum/forum.tsx:84`
- [x] T048 [P] [S11] **Implement**: Add `aria-hidden="true"` to thread MessageSquare — `src/pages/forum/threads.tsx:155`
- [x] T049 [P] [S11] **Implement**: Add `aria-hidden="true"` to reply avatar wrapper — `src/components/forum/reply-item.tsx:21`
- [x] T050 [P] [S11] **Implement**: Add `aria-hidden="true"` to event ArrowLeft — `src/pages/events/event-detail.tsx:45`
- [x] T051 [P] [S11] **Implement**: Add `aria-hidden="true"` to footer contact icons (MapPin, Phone, Mail) — `src/components/layout/footer.tsx`

---

## Phase 9: A11y — Social Links aria-label Fix (Story S12)

**Goal**: Single clear label on social link anchor, not duplicated on inner SVG

- [x] T052 [S12] **Write test**: social link `<a>` has single `aria-label`; inner `<svg>` has `aria-hidden="true"` — `src/components/layout/__tests__/footer.test.tsx`
- [x] T053 [S12] **Implement**: Remove `aria-label` from footer SocialIcon `<svg>`; keep only on parent `<a>` — `src/components/layout/footer.tsx:23-38`

---

## Phase 10: A11y — 404 role=alert (Story S9)

**Goal**: Screen reader announces 404 page as an alert/error

- [x] T054 [S9] **Write test**: 404 heading container has `role="alert"` — `src/pages/__tests__/not-found.test.tsx`
- [x] T055 [S9] **Implement**: Wrap 404 heading in `<div role="alert">` — `src/pages/not-found.tsx`

---

## Phase 11: A11y — Loading aria-busy (Story S10)

**Goal**: Loading regions announce busy state to screen readers

- [x] T056 [S10] **Write test**: loading container has `aria-busy="true"` while data is loading — forum.tsx
- [x] T057 [P] [S10] **Implement**: Add `aria-busy={isPending}` to forum loading container — `src/pages/forum/forum.tsx`
- [x] T058 [P] [S10] **Implement**: Add `aria-busy={isPending}` to threads loading container — `src/pages/forum/threads.tsx`

---

## Phase 12: A11y — Heading Hierarchy Fix

**Goal**: Reply section heading uses `<h2>` instead of `<h3>` — WCAG 1.3.1

- [x] T059 **Write test**: reply list heading is `<h2>` — `src/components/forum/__tests__/reply-list.test.tsx`
- [x] T060 **Implement**: Change `<h3>` to `<h2>` — `src/components/forum/reply-list.tsx:55`

---

## Phase 13: Cross-Cutting — Validation & Polish

- [x] T061 [P] Run `npx tsc -b` — zero errors expected
- [x] T062 [P] Run `npm run lint` — pass (excluding pre-existing errors)
- [x] T063 Run `npm run test:run` — 105+ tests pass
- [x] T064 Run `npm run build` — type-check + production build succeeds
- [x] T065 Run quickstart.md validation scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (S1)**: Foundation — no dependencies, can start immediately
- **Phase 2 (S2)**: Independent of P1 — can run in parallel
- **Phase 3 (S3)**: Independent of P1–P2 — can run in parallel
- **Phase 4 (S4)**: T022 (Spinner component) must complete before T023–T029
- **Phase 5 (S5)**: Independent of P1–P4 — can run in parallel
- **Phase 6 (S6)**: Foundation — no dependencies
- **Phase 7 (S7, S8)**: Foundation — no dependencies
- **Phase 8 (S11)**: Foundation — no dependencies
- **Phase 9 (S12)**: Foundation — no dependencies
- **Phase 10 (S9)**: Foundation — no dependencies
- **Phase 11 (S10)**: Foundation — no dependencies
- **Phase 12**: Foundation — no dependencies
- **Phase 13**: All prior phases must complete

### Parallel Opportunities

- All a11y phases (6–12) can run in parallel with forms phases (1–5) — completely independent file sets
- Within each phase, tasks marked [P] can run in parallel
- T003–T028 (spinner wiring) are all [P] once T022 completes

### Within Each Task

- Tests MUST be written and FAIL before implementation (per Constitution Principle I)
- Static aria-hidden additions (Phases 8, 9, 10) have TDD exemption per Complexity Tracking in plan.md

---

## Phase 14: Convergence — TDD Tests & Success Glow Completion

**Goal**: Close gaps found by convergence assessment — write missing tests per Constitution Principle I (TDD), and add success glow to forms that navigate away.

### Test Files to Create (TDD — Constitution I)

- [x] T066 [F3] [missing] Write tests: event form — Zod enum accepts "ongoing", no coercion of "ongoing" to "past", maxLength rejects excess — `src/pages/admin/__tests__/event-form.test.tsx`
- [x] T067 [F3] [missing] Write tests: contact form — maxLength rejects excess, char count renders and updates, char count orange ≥80%/red at 100%, submit button shows spinner when pending — `src/pages/contact/__tests__/contact.test.tsx`
- [x] T068 [F3] [missing] Write tests: member form — maxLength rejects excess — `src/pages/admin/__tests__/member-form.test.tsx`
- [x] T069 [F3] [missing] Write tests: new-thread form — maxLength rejects excess — `src/pages/forum/__tests__/new-thread-form.test.tsx`
- [x] T070 [F3] [missing] Write tests: shell — skip-to-content link is first focusable element, moves focus to main-content on activation — `src/components/layout/__tests__/shell.test.tsx`
- [x] T071 [F3] [missing] Write tests: admin-layout — nav has aria-label="Admin navigation", active link has aria-current="page" — `src/pages/admin/__tests__/admin-layout.test.tsx`

### Existing Test Files to Update

- [x] T072 [F3] [missing] Update header.test.tsx — add assertions for aria-label="Main navigation", aria-label="Mobile navigation", aria-current="page" on active links
- [x] T073 [F3] [missing] Update forum.test.tsx — add assertions for aria-hidden="true" on category icon, aria-busy="true" on loading container
- [x] T074 [F3] [missing] Update threads.test.tsx — add assertions for aria-hidden="true" on thread icon, aria-busy="true" on loading container
- [x] T075 [F3] [missing] Update reply-list.test.tsx — add assertion for `<h2>` heading
- [x] T076 [F3] [missing] Update reply-item.test.tsx — add assertion for aria-hidden="true" on avatar wrapper

### Success Glow Completion (FR-F11 / SC-6)

- [x] T077 [F4] [partial] Implement: add brief green success glow (ring-2 ring-green-500/50) before navigation to event-form, member-form, and new-thread-form — `src/pages/admin/event-form.tsx`, `src/pages/admin/member-form.tsx`, `src/pages/forum/new-thread-form.tsx`

---

## Phase 15: Convergence — Test Coverage for Spinner, Success Glow & aria-live

**Goal**: Close remaining test-coverage gaps found by second convergence pass — spinner render tests missing on 3 forms, no register test file, no success glow appearance tests, no aria-live assertions, and reply-form char count missing aria-live wrapper.

### New Test File to Create

- [x] T078 [F2] [missing] Create register.test.tsx — test spinner and disabled state during pending mutation — `src/pages/auth/__tests__/register.test.tsx`

### Existing Test Files to Update (Spinner & Disabled State)

- [x] T079 [P] [F1] [partial] Add spinner+disabled assertions to event-form, member-form, new-thread-form tests — `src/pages/admin/__tests__/event-form.test.tsx`, `src/pages/admin/__tests__/member-form.test.tsx`, `src/pages/forum/__tests__/new-thread-form.test.tsx`

### Success Glow Appearance Tests

- [x] T080 [F3] [partial] Add success glow (`ring-2 ring-green-500/50`) appearance assertions to all 4 form test files — `src/pages/admin/__tests__/event-form.test.tsx`, `src/pages/admin/__tests__/member-form.test.tsx`, `src/pages/contact/__tests__/contact.test.tsx`, `src/pages/forum/__tests__/new-thread-form.test.tsx`

### aria-live="polite" Tests & Reply-Form Fix

- [x] T081 [P] [F4] [partial] Add `aria-live="polite"` assertions to char count spans in contact, event-form, member-form, new-thread-form tests — `src/pages/contact/__tests__/contact.test.tsx`, `src/pages/admin/__tests__/event-form.test.tsx`, `src/pages/admin/__tests__/member-form.test.tsx`, `src/pages/forum/__tests__/new-thread-form.test.tsx`
- [x] T082 [F5] [partial] Wrap reply-form char count text node in `<span aria-live="polite">`, add assertion to reply-form test — `src/components/forum/reply-form.tsx`, `src/components/forum/__tests__/reply-form.test.tsx`
- [x] T083 [F6] [partial] Add success glow `setTimeout` cleanup assertions to all 4 form test files — `src/pages/admin/__tests__/event-form.test.tsx`, `src/pages/admin/__tests__/member-form.test.tsx`, `src/pages/contact/__tests__/contact.test.tsx`, `src/pages/forum/__tests__/new-thread-form.test.tsx`

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user scenario
- Each phase should be independently completable and testable
- Verify tests fail before implementing
- Commit after each phase or logical group
- Stop at any checkpoint to validate independently
