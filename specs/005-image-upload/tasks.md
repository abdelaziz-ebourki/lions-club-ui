# Tasks: Image Upload

**Input**: Design documents from `/specs/005-image-upload/`

**Prerequisites**: plan.md, spec.md, data-model.md

**Tests**: Tests are MANDATORY per Constitution Principle I (TDD is Non-Negotiable).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- Include exact file paths

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for image upload

- [ ] T001 Add `api.upload()` method to `src/lib/api.ts` for FormData-based file uploads with configurable HTTP method
- [ ] T002 [P] Create reusable `FileUpload` component at `src/components/ui/file-upload.tsx` with drag-and-drop zone, preview, type/size validation, remove button, loading spinner
- [ ] T003 [P] Add placeholder image/avatar URLs to mock data in `src/mocks/data/events.ts` and `src/mocks/data/members.ts`
- [ ] T004 [P] Update MSW handlers in `src/mocks/handlers/events.ts` and `src/mocks/handlers/members.ts` to parse multipart/form-data bodies

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Update `Event` and `Member` TypeScript types if `image`/`avatar` fields are missing (verify `src/types/index.ts`)

**Checkpoint**: Foundation ready — FileUpload component exists, API client supports uploads, mock layer handles multipart.

---

## Phase 3: User Story 1 — Admin uploads event image (Priority: P1) 🎯 MVP

**Goal**: Admin can upload an event image, see a preview, and have it displayed on the event detail page and events list.

**Independent Test**: Navigate to `/admin/events/new`, select an image file, submit, verify the image appears on `/events` list and `/events/:id` detail page.

### Tests for User Story 1 (MANDATORY per Constitution Principle I)

- [ ] T006 [P] [US1] Write schema validation tests for `image` field (File, string, undefined) in `src/pages/admin/__tests__/event-form.test.tsx`
- [ ] T007 [US1] Write component test verifying file upload area renders on event form in `src/pages/admin/__tests__/event-form.test.tsx`

### Implementation for User Story 1

- [ ] T008 [US1] Add `image` field to Zod schema in `src/pages/admin/event-form.tsx` (z.union([z.instanceof(File), z.string()]).optional())
- [ ] T009 [US1] Add `image` to form `values` and `defaultValues` in `src/pages/admin/event-form.tsx`
- [ ] T010 [US1] Add `FileUpload` component after description field using `Controller` in `src/pages/admin/event-form.tsx`
- [ ] T011 [US1] Switch mutation to build FormData + `api.upload()` in `src/pages/admin/event-form.tsx`
- [ ] T012 [P] [US1] Render `event.image` as hero image on event detail page `src/pages/events/event-detail.tsx`
- [ ] T013 [P] [US1] Render `event.image` on events list cards in `src/pages/events/events.tsx`

**Checkpoint**: User Story 1 fully functional — admin uploads event images, they display publicly.

---

## Phase 4: User Story 2 — Admin uploads member avatar (Priority: P1)

**Goal**: Admin can upload a member avatar (circular preview) and see it displayed on About page member cards.

**Independent Test**: Navigate to `/admin/members/new`, select an image file, submit, verify the circular avatar appears on `/about` member cards.

### Tests for User Story 2 (MANDATORY per Constitution Principle I)

- [ ] T014 [P] [US2] Write schema validation tests for `avatar` field (File, string, undefined) in `src/pages/admin/__tests__/member-form.test.tsx`
- [ ] T015 [US2] Write component test verifying file upload area renders on member form in `src/pages/admin/__tests__/member-form.test.tsx`

### Implementation for User Story 2

- [ ] T016 [US2] Add `avatar` field to Zod schema in `src/pages/admin/member-form.tsx` (z.union([z.instanceof(File), z.string()]).optional())
- [ ] T017 [US2] Add `avatar` to form `values` and `defaultValues` in `src/pages/admin/member-form.tsx`
- [ ] T018 [US2] Add `FileUpload` component (circular variant) after bio field using `Controller` in `src/pages/admin/member-form.tsx`
- [ ] T019 [US2] Switch mutation to build FormData + `api.upload()` in `src/pages/admin/member-form.tsx`
- [ ] T020 [P] [US2] Render `member.avatar` on About page member cards (fallback to initial-letter) in `src/pages/about/about.tsx`

**Checkpoint**: User Story 2 fully functional — admin uploads member avatars, they display as circles on About page.

---

## Phase 5: User Story 3 — Image validation and error handling (Priority: P2)

**Goal**: Invalid file types and oversized files show clear inline validation errors and block form submission.

**Independent Test**: Select a `.pdf` file — verify "Please select a valid image file (PNG, JPG, WebP)" error appears. Select an image > 5MB — verify "File size must be under 5MB" error appears.

### Implementation for User Story 3

- [ ] T021 [US3] Implement client-side file type validation (PNG, JPG, WebP only) in `src/components/ui/file-upload.tsx`
- [ ] T022 [US3] Implement client-side file size validation (max 5MB) in `src/components/ui/file-upload.tsx`
- [ ] T023 [US3] Display inline error messages on file validation failure in `src/components/ui/file-upload.tsx`
- [ ] T024 [US3] Prevent form submission when file validation fails on either form

**Checkpoint**: All three user stories complete and independently testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, final verification, and cleanup

- [ ] T025 Add keyboard accessibility (Enter/Space, Tab) to FileUpload component per FR-014
- [ ] T026 [P] Add ARIA attributes (aria-label, aria-invalid) to FileUpload component per FR-015, FR-017
- [ ] T027 [P] Add alt text to preview image in FileUpload component per FR-016
- [ ] T028 Run full test suite: `npx vitest run` — verify all 233+ tests pass
- [ ] T029 Run type-check: `npx tsc -b` — verify zero new errors
- [ ] T030 Run lint: `npm run lint` — verify no new warnings/errors
- [ ] T031 Update spec clarifications and checklist based on implementation feedback

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Phase 1 + 2
  - US1 (P1) and US2 (P1) can proceed in parallel
  - US3 (P2) depends on FileUpload component from Phase 1
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 1 + 2. No dependencies on other stories
- **US2 (P1)**: Can start after Phase 1 + 2. No dependencies on US1
- **US3 (P2)**: Can start after Phase 1 (FileUpload component). Adds validation to existing component

### Parallel Opportunities

- T002 (FileUpload) and T003 (mock data) can run in parallel
- T006-T007 and T008-T011 (US1 tests + impl) are sequential within their group
- T012 (event detail) and T013 (events list) can run in parallel
- US1 and US2 can run in parallel by different developers
- T025-T027 (accessibility) can run in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005)
3. Complete Phase 3: User Story 1 (T006-T013)
4. **STOP and VALIDATE**: Test US1 independently (admin uploads event image, sees it on detail page and list)
5. MVP delivers: Event image upload + display

### Incremental Delivery

1. Setup + Foundational → ready for image upload
2. Add User Story 1 → event images → Deploy (MVP)
3. Add User Story 2 → member avatars → Deploy
4. Add validation + polish → Deploy (complete)

---

## Phase 7: Convergence

**Purpose**: Close remaining gaps identified by convergence assessment

- [x] T032 Block form submission when FileUpload validation fails in both event-form and member-form per FR-011 (partial). Added Zod superRefine for file type and size validation to both schemas using `uploadConfig` from `@/config`; passed `fieldState.error?.message` to FileUpload `error` prop
