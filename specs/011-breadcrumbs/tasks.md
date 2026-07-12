# Tasks: Breadcrumb Navigation

**Input**: Design documents from `specs/011-breadcrumbs/`

**Prerequisites**: plan.md (set), spec.md (clarified), research.md (7 decisions), data-model.md (entity), contracts/ (trail map)

**Tests**: MANDATORY per Constitution Principle I (TDD). Write tests FIRST, ensure they FAIL, then implement.

**Organization**: Tasks grouped into Setup → Foundational → User Stories → Polish. Both stories are P1 and delivered together.

---

## Phase 1: Setup

**Purpose**: Verify build pipeline and install dependencies

**Note**: Project is already initialized. shadcn breadcrumb component already installed at `src/components/ui/breadcrumb.tsx`. No additional npm dependencies needed.

- [x] T001 Verify `npx tsc -b` passes on current master (baseline)
- [x] T002 Verify `npm run lint` passes on current master (baseline — 0 errors, 7 pre-existing warnings)
- [x] T003 Verify `npm run test:run` passes on current master (baseline — 243/243 tests pass)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared type definition and `Breadcrumbs` component that all pages depend on

**⚠️ CRITICAL**: No page work can begin until this phase is complete

- [x] T004 Create `BreadcrumbSegment` type in `src/types/index.ts` with `label: string` and `href?: string` fields
- [x] T005 [P] Write `Breadcrumbs.test.tsx` in `src/components/shared/__tests__/` — 5 tests (segment count, aria-current, links, empty trail, nav landmark)
- [x] T006 Verify T005 tests FAIL (red step — confirmed, import error as expected)
- [x] T007 Create `Breadcrumbs` component in `src/components/shared/Breadcrumbs.tsx` mapping `BreadcrumbSegment[]` to shadcn primitives
- [x] T008 Verify T005 tests PASS (green step — all 5 pass)
- [x] T009 Verify `npx tsc -b` passes

**Checkpoint**: `Breadcrumbs` component and type ready for page integration

---

## Phase 3: User Story 1 — Users see breadcrumbs on deep pages (P1) 🎯 MVP

**Goal**: Breadcrumbs appear on all non-home/public/404 pages with correct hierarchy and dynamic labels. Login/register excluded. API failures show "Unknown".

**Independent Test**: Navigate to any non-home page and verify breadcrumbs render with the correct trail segments matching the contract definitions in `contracts/breadcrumb-contracts.md`.

### US1 Tests (MANDATORY — write first, fail, then implement) ⚠️

- [x] T010 [P] [US1] Write integration test for forum breadcrumbs in `src/pages/forum/__tests__/forum.test.tsx` — verify "Home > Forum" renders
- [x] T011 [P] [US1] Write integration test for admin events breadcrumbs in `src/pages/admin/__tests__/admin-events.test.tsx` — verify "Home > Admin > Events" renders
- [x] T012 [P] [US1] Write integration test for about breadcrumbs in `src/pages/about/__tests__/about.test.tsx` — verify "Home > About" renders
- [x] T013 [P] [US1] Write integration test for 404 breadcrumbs in `src/pages/__tests__/not-found.test.tsx` — verify "Home > Page Not Found" renders
- [x] T014 Verify T010–T013 FAIL (red step)

### US1 Implementation — Static Pages (simple, no dynamic data)

- [x] T015 [P] [US1] Add `<Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "About" }]} />` to `src/pages/about.tsx`
- [x] T016 [P] [US1] Add `<Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Contact" }]} />` to `src/pages/contact.tsx`
- [x] T017 [P] [US1] Add `<Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Search" }]} />` to `src/pages/search.tsx`
- [x] T018 [P] [US1] Add `<Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Profile" }]} />` to `src/pages/profile.tsx`
- [x] T019 [P] [US1] Add `<Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Verify Email" }]} />` to `src/pages/verify-email.tsx`
- [x] T020 [P] [US1] Add `<Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Page Not Found" }]} />` to `src/pages/not-found.tsx`
- [x] T021 [P] [US1] Add `<Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Forum" }]} />` to `src/pages/forum/forum.tsx`
- [x] T022 [P] [US1] Add `<Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Events" }]} />` to `src/pages/events/events.tsx`

### US1 Implementation — Static Admin Pages

- [x] T023 [P] [US1] Add `<Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "Dashboard" }]} />` to `src/pages/admin/dashboard.tsx`
- [x] T024 [P] [US1] Add `<Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "Events" }]} />` to `src/pages/admin/admin-events.tsx`
- [x] T025 [P] [US1] Add `<Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "Members" }]} />` to `src/pages/admin/admin-members.tsx`
- [x] T026 [P] [US1] Add `<Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "Messages" }]} />` to `src/pages/admin/admin-messages.tsx`
- [x] T027 [P] [US1] Add `<Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "Forum" }]} />` to `src/pages/admin/admin-forum.tsx`

### US1 Implementation — Dynamic Pages (labels from API data)

- [x] T028 [US1] Add breadcrumbs to `src/pages/events/event-detail.tsx` — trail includes event title from `useParams` + API data; fallback "Unknown" on error
- [x] T029 [US1] Add breadcrumbs to `src/pages/forum/threads.tsx` — trail includes category name from API; fallback "Unknown" on error
- [x] T030 [US1] Add breadcrumbs to `src/pages/forum/thread-detail.tsx` — trail includes category name + thread title; fallback "Unknown" on error
- [x] T031 [US1] Add breadcrumbs to `src/pages/forum/new-thread-form.tsx` — trail includes category name + "New Thread"
- [x] T032 [US1] Add breadcrumbs to `src/pages/admin/event-form.tsx` — trail shows "Edit [eventTitle]" or "New Event" based on route params; fallback "Unknown"
- [x] T033 [US1] Add breadcrumbs to `src/pages/admin/member-form.tsx` — trail shows "Edit [memberName]" or "New Member" based on route params; fallback "Unknown"

### US1 Verification

- [x] T034 Verify T010–T013 tests PASS (green step)
- [x] T035 Verify `npx tsc -b` passes
- [x] T036 Verify `npm run lint` passes
- [x] T037 Verify `npm run test:run` passes (all existing tests + new tests — 250/250 pass)

**Checkpoint**: All non-home pages render correct breadcrumb trails. Dynamic labels resolve from API data.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, accessibility, remaining pages, final verification

- [x] T038 Run `npm run dev` and visually verify breadcrumbs appear on every route listed in `contracts/breadcrumb-contracts.md`
- [x] T039 Verify breadcrumbs do NOT appear on home page `/`, login `/login`, or register `/register`
- [x] T040 Verify keyboard navigation: Tab through breadcrumb links, verify focus visibility, verify Enter activates links
- [x] T041 Verify screen reader: `<nav aria-label="breadcrumb">` landmark is announced, `aria-current="page"` is read on last segment
- [x] T042 Run `npm run build` to confirm production build succeeds
- [x] T043 Update `quickstart.md` with any adjustments discovered during implementation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately — verifies baseline
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all pages
- **User Stories (Phase 3)**: Depends on Foundational
- **Polish (Phase 4)**: Depends on Phase 3

### Within Each Phase

- Tests MUST be written and FAIL before implementation (per Constitution Principle I)
- Foundational component before page integrations
- Static pages (parallelizable) before dynamic pages (need API data analysis)
- All `[P]` tasks can run in parallel

### Parallel Opportunities

| Group | Tasks | Condition |
|-------|-------|-----------|
| Component + Tests | T004, T005 | Can run together |
| Static public pages | T015–T022 (all) | All independent files |
| Static admin pages | T023–T027 (all) | All independent files |
| Dynamic pages | T028–T033 (all) | Independent but need API hook familiarity |
| Verification | T034–T037 | Sequential (tests → typecheck → lint → test suite) |

### Implementation Strategy

**MVP scope**: Phase 1 + 2 + 3 (User Story 1) — delivers breadcrumbs on all pages.

**Incremental delivery**:
1. Foundation (type + component) → deploy shell
2. Static pages (8 public + 5 admin) → deploy partial
3. Dynamic pages (6 pages with API data) → deploy full
4. Polish → finalize

---

## Notes

- [P] tasks = different files, no dependencies
- [US1] label maps task to User Story 1
- Verify tests fail before implementing per Constitution Principle I
- Each task produces a complete, independently verifiable change
- Commit after each logical group using `git-commit` skill
- Stop at any checkpoint to validate
