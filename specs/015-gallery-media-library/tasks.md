---

description: "Task list for Gallery & Media Library feature implementation"

---

# Tasks: Gallery & Media Library

**Input**: Design documents from `/specs/015-gallery-media-library/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/api-contracts.md, quickstart.md

**Tests**: MANDATORY per Constitution Principle I (TDD is Non-Negotiable). Each user-story phase starts with failing tests written BEFORE implementation (lesson from 014: browser E2E also validated during implementation, not after).

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies, define types/config, set up mock data and MSW handlers

- [x] T001 Install yet-another-react-lightbox via npm
- [x] T002 [P] Add GalleryItem, GalleryCategory types to src/types/index.ts (per data-model.md)
- [x] T003 [P] Add galleryCategories constant ("Event", "Project", "Team", "Community", "Partner") to src/config/index.ts
- [x] T004 [P] Create mock gallery items in src/mocks/data/gallery.ts (≥8 items across all 5 categories, ≥1 linked to a seeded event, ≥1 WITHOUT thumbnailUrl, ≥1 with multiple tags)
- [x] T005 Create MSW handlers for /api/gallery in src/mocks/handlers/gallery.ts per contracts/api-contracts.md (GET /gallery paginated+filtered, GET /gallery/:id with 404, GET /gallery/admin, POST /gallery/upload returning imageUrl, POST /gallery create, PATCH/DELETE /gallery/:id; register literal routes BEFORE :id)
- [x] T006 Register galleryHandlers in src/mocks/handlers/index.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Reusable hooks and components needed by all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 [P] Create GallerySkeleton loading component in src/components/shared/GallerySkeleton.tsx (grid of card-shaped Skeletons matching NewsSkeleton pattern)
- [x] T008 Create useGalleryList hook in src/hooks/useGalleryList.ts (React Query; params page/limit/category/eventId; PaginatedResponse shape per contracts/api-contracts.md)

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 — Visitors browse the photo gallery (Priority: P1) 🎯 MVP

**Goal**: Visitors see a responsive, filterable photo grid at `/gallery` with skeleton/empty/error states.

**Independent Test**: Navigate to `/gallery` with seeded items — grid renders newest-first with thumbnail-fallback images, titles, category badges; category/event filters narrow results in one interaction and clear back to full set; empty and error states render correctly.

### Tests for User Story 1 (MANDATORY — write FIRST, verify they FAIL) ⚠️

- [x] T009 [P] [US1] Write failing component tests in src/pages/gallery/__tests__/gallery.test.tsx (grid render newest-first; card shows image/title/category badge; missing thumbnail falls back to imageUrl; category filter narrows; event filter narrows; clear restores; empty state when no items; error state with retry button; skeleton while loading) using MSW handlers

### Implementation for User Story 1

- [x] T010 [US1] Create GalleryPage in src/pages/gallery/gallery.tsx (PageHero header, Breadcrumbs, responsive Card grid sm:2/lg:3, category Select + event Select filters wired through useGalleryList params, EmptyState, ErrorState with retry, pagination controls at >12 items) (depends on T009 red)
- [x] T011 [US1] Add /gallery route to src/App.tsx (public Shell layout)

**Checkpoint**: User Story 1 fully functional and independently testable

---

## Phase 4: User Story 2 — Admin uploads and manages gallery media (Priority: P1)

**Goal**: Authenticated admins manage items at `/admin/gallery` — upload via drag-drop with preview/progress, edit metadata, delete with confirmation, all with validation and toasts.

**Independent Test**: Log in as admin → `/admin/gallery` → list renders; upload a valid image (preview + progress), invalid file rejected inline; create/edit/delete flows each show toasts and confirmation dialogs.

### Tests for User Story 2 (MANDATORY — write FIRST, verify they FAIL) ⚠️

- [x] T012 [P] [US2] Write failing tests in src/pages/admin/__tests__/admin-gallery.test.tsx (table headers thumbnail/title/category/event/tags/date/uploader/actions; mobile card layout present; delete AlertDialog cancel keeps item; confirm removes row; error state with retry)
- [x] T013 [P] [US2] Write failing tests in src/pages/admin/__tests__/gallery-form.test.tsx (required title/category validation blocks submit inline; tags input trims whitespace and de-duplicates; FileUpload rejects wrong type/oversize inline; edit mode pre-fills from fetched item and does not crash while loading — 014 lesson)
- [x] T014 [P] [US2] Write failing hook tests in src/hooks/__tests__/useGalleryForm.test.tsx (zod schema: title min/max, description max, category enum; two-step flow: upload then create sends imageUrl; PATCH on edit; success/error toasts)

### Implementation for User Story 2

- [x] T015 [US2] Create AdminGalleryPage in src/pages/admin/admin-gallery.tsx (AdminTable desktop + Card list mobile using AdminTable.mobileView, AdminPageHeader "New Item" action, per-row edit link + delete AlertDialog with Cancel/confirm, deleteMutation with invalidateQueries + toasts, ErrorState retry) (depends on T012 red)
- [x] T016 [P] [US2] Create GalleryFormFields in src/components/shared/GalleryFormFields.tsx (title Input, description Textarea, FileUpload for image with preview, category Select, event link Select from existing events, tags Input normalized on change) 
- [x] T017 [US2] Create useGalleryForm hook in src/hooks/useGalleryForm.ts parallel to useNewsForm.ts (zodResolver schema; watch guards `?? ""`; handleFileChange via FileUpload; mutation: api.upload to /gallery/upload then api.post /gallery for create, api.patch /gallery/:id for edit — no re-upload on metadata-only edit; toasts; redirect to /admin/gallery) (depends on T013, T014 red; T016)
- [x] T018 [US2] Create GalleryFormPage in src/pages/admin/gallery-form.tsx (pattern: news-form.tsx — Breadcrumbs, header, form fields, submit button with pending spinner)
- [x] T019 [US2] Add routes to src/App.tsx: /admin/gallery, /admin/gallery/new, /admin/gallery/:id/edit (lazy-loaded inside RequireAdmin admin layout)

**Checkpoint**: User Stories 1 AND 2 both functional and independently testable

---

## Phase 5: User Story 3 — Immersive lightbox viewing (Priority: P2)

**Goal**: Clicking any photo opens an accessible lightbox showing the enlarged image + metadata, navigable by keyboard/swipe within the filtered set, closable with focus restored; `/gallery/:id` deep-links into it.

**Independent Test**: From `/gallery`, open a photo — lightbox shows enlarged image with title/description/category/tags/date; arrows navigate with wrap-around; Escape closes restoring grid position and focus; swipe works on touch viewport; deep-link opens directly; unknown id shows 404-style state.

**Dependencies**: extends US1's GalleryPage file — implement after US1.

### Tests for User Story 3 (MANDATORY — write FIRST, verify they FAIL) ⚠️

- [x] T020 [P] [US3] Extend src/pages/gallery/__tests__/gallery.test.tsx with failing lightbox tests (card click opens viewer with metadata; arrow keys prev/next wrapping at ends; Escape closes and returns focus to triggering card; deep-link /gallery/:id auto-opens viewer; /gallery/nonexistent-id shows not-found state with back link; document.title updates while open and restores)

### Implementation for User Story 3

- [x] T021 [US3] Create LightboxViewer in src/components/shared/LightboxViewer.tsx (yet-another-react-lightbox wrapper: controlled open/index over filtered items; custom slide rendering image + metadata panel (title, description, category badge, tags, upload date); keyboard + touch built-in; close control; focus restoration callback) (depends on T020 red)
- [x] T022 [US3] Integrate LightboxViewer into src/pages/gallery/gallery.tsx (card click sets selected index; wrap-around navigation; document.title effect per research R6 — imperative, never Helmet <title>; deep-link support reading /gallery/:id param to auto-open, closing navigates back to /gallery; 404-style EmptyState-style block for unknown id with link back)
- [x] T023 [US3] Add /gallery/:id route to src/App.tsx rendering GalleryPage (same element as /gallery)

**Checkpoint**: All user stories complete

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, browser E2E validation, type-checking, linting

- [x] T024 Run npx tsc -b to verify zero type errors
- [x] T025 Run npm run lint to verify zero lint errors
- [x] T026 Run npm run test:run to verify full suite passes including new gallery tests
- [x] T027 Execute all quickstart.md validation scenarios in a real browser via Playwright (grid+filters, three UI states, lightbox keyboard/swipe/deep-link pass, full admin CRUD cycle) — during implementation, not after (014 lesson) — verified via playwright-cli 2026-08-27 (home teaser + footer link + gallery grid + lightbox + admin CRUD all green)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **User Stories (Phase 3–5)**: All depend on Foundational completion
- **Polish (Phase 6)**: Depends on all user stories complete

### User Story Dependencies

- **US1 (P1)**: No dependencies on other stories — can start after Phase 2
- **US2 (P1)**: No dependencies on other stories — can start after Phase 2 (own pages/hooks/files)
- **US3 (P2)**: Extends US1's GalleryPage file — implement after US1 (same-file dependency)

### Within Each Phase

- Tests marked [P] run together FIRST and must FAIL before their story's implementation tasks begin
- Components before pages; hooks before pages; pages before routes
- US1 and US2 are fully parallel (different files); US3 follows US1

### Parallel Opportunities

| Task Group | Parallelizable Tasks |
|------------|---------------------|
| Setup | T002 types, T003 config, T004 mock data (different files) |
| Foundational | T007 GallerySkeleton |
| US1 | T009 test first, then sequential impl |
| US2 | T012+T013+T014 tests together; T016 fields parallel with T015 admin page |
| US3 | Single test task then sequential impl |

**Cross-story note**: US1 and US2 share no files. US3 touches US1's gallery.tsx and its test file — sequence US3 after US1.

---

## Parallel Example: User Story 1

```bash
# US1 tests first (must fail), then implementation:
Task: "T009 Failing gallery page tests in src/pages/gallery/__tests__/gallery.test.tsx"
Task: "T010 GalleryPage in src/pages/gallery/gallery.tsx"
Task: "T011 /gallery route in src/App.tsx"
```

## Parallel Example: User Story 2

```bash
# All three test tasks run together (different files), then:
Task: "T012 Admin list tests in src/pages/admin/__tests__/admin-gallery.test.tsx"
Task: "T013 Form tests in src/pages/admin/__tests__/gallery-form.test.tsx"
Task: "T014 Hook tests in src/hooks/__tests__/useGalleryForm.test.tsx"

# Implementation — T016 parallel with T015; T017 needs T016; T018 needs T017; T019 last
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US1 (public grid + filters)
4. **STOP and VALIDATE**: browser-check `/gallery` — grid, filters, three states
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 → public gallery browsable → MVP!
3. US2 → admin CRUD complete → content pipeline live
4. US3 → lightbox polish → full feature
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 (public pages)
   - Developer B: US2 (admin CRUD)
   - Developer C: waits for A's US1, then US3 lightbox
3. Stories integrate independently

---

## Phase 7: Convergence

- [x] T028 Display the linked event in the admin gallery list — add an "Event" column to the desktop table and event info to the mobile card in src/pages/admin/admin-gallery.tsx (resolve eventId to title via events query, show placeholder when unlinked; extend admin-gallery.test.tsx first per TDD) per FR-012, US2/AC1 (partial)
- [x] T029 Serve the full-resolution image in the lightbox — change slide src in src/components/shared/LightboxViewer.tsx from `thumbnailUrl ?? imageUrl` to `imageUrl` (keep `thumbnailUrl ?? imageUrl` only for grid cards per FR-002; extend gallery.test.tsx to assert the enlarged slide uses imageUrl) per FR-007, US3/AC1 (partial)
- [x] T030 Differentiate the public empty-state message in src/pages/gallery/gallery.tsx when filters are active — show "no photos match your filters"-style copy with a clear-filters action instead of "No photos yet" when category/eventId filters are set but results are empty (extend gallery.test.tsx first per TDD) per FR-005, US1/AC5 (partial)
- [x] T031 Expose gallery via homepage teaser and footer (accessibility) — add Moments That Matter section to src/pages/home/home.tsx using useGalleryList(1,6) with Card grid + View Gallery CTA, add Gallery link to src/components/layout/footer.tsx Quick Links (footer-only, header nav remains 6 items), add Gallery to src/pages/admin/admin-layout.tsx + HeaderMobileNav admin section — verified via playwright-cli (header no Gallery, footer Gallery → /gallery, home teaser 6 cards → /gallery)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story independently completable and testable
- Verify tests FAIL before implementing each story (red-green-refactor)
- Load `tdd`, `shadcn`, `frontend-design`, `git-commit`, `vercel-react-best-practices`, `webapp-testing` skills before implementation
- Query shadcn-ui MCP before creating new UI components; context7 for yet-another-react-lightbox API
- Run `npx tsc -b` and `npm run lint` before each commit (git-commit skill, conventional commits)
- 014 lessons applied here: tests baked into phases (not retrofitted), browser E2E during implementation (T027), imperative document.title (never Helmet <title>), MSW literal routes registered before :id, watch() guards in form hooks
