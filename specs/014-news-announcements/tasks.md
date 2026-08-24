---

description: "Task list for News & Announcements feature implementation"

---

# Tasks: News & Announcements System

**Input**: Design documents from `specs/014-news-announcements/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-contracts.md, quickstart.md

**Tests**: Not generated — feature spec does not explicitly request TDD. Constitution Principle I requires tests; add test tasks if TDD approach is adopted.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies, define types and config, set up mock data and MSW handlers

- [x] T001 Install @tiptap/react, @tiptap/starter-kit, react-helmet-async via npm
- [x] T002 [P] Add NewsArticle, NewsCategory, NewsStatus types to src/types/index.ts
- [x] T003 [P] Add newsCategories constant to src/config/index.ts
- [x] T004 Wrap AppProviders with HelmetProvider in src/components/shared/AppProviders.tsx
- [x] T005 [P] Create mock news articles data in src/mocks/data/news.ts
- [x] T006 Create MSW REST handlers for /api/news in src/mocks/handlers/news.ts
- [x] T007 Register newsHandlers in src/mocks/handlers/index.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Reusable hooks and components needed by all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 [P] Create NewsSkeleton loading component in src/components/shared/NewsSkeleton.tsx
- [x] T009 [P] Create RichTextEditor component in src/components/shared/RichTextEditor.tsx (Tiptap wrapper with StarterKit, controlled via value/onChange for react-hook-form)
- [x] T010 Create useNewsForm hook in src/hooks/useNewsForm.ts (parallel to useEventForm — zod schema, react-hook-form, image upload, React Query mutation)
- [x] T011 Create useNewsList hook in src/hooks/useNewsList.ts (React Query for paginated public news list)

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 — Visitors browse published news articles (Priority: P1) 🎯 MVP

**Goal**: Visitors can browse paginated published articles on `/news` and read full articles on `/news/:slug` with loading, empty, and error states.

**Independent Test**: Navigate to `/news` on a fresh site with mock published articles. Verify article list renders with title, excerpt, date, and category. Click an article to read full content on `/news/:slug`. Verify loading skeletons, empty state (no articles), and error state (network failure) all work.

- [x] T012 [US1] Create NewsListPage in src/pages/news/news.tsx (paginated grid of published articles with skeleton loading, empty state via EmptyState, error state via ErrorState with retry)
- [x] T013 [US1] Create NewsDetailPage in src/pages/news/news-detail.tsx (full article view by slug with loading skeleton, 404 state for invalid slug, error state with retry)
- [x] T014 [US1] Add /news and /news/:slug routes to src/App.tsx (/news eager, /news/:slug lazy-loaded with Suspense)

**Checkpoint**: User Story 1 fully functional and testable independently

---

## Phase 4: User Story 2 — Admin manages news articles CRUD (Priority: P1)

**Goal**: Authenticated admins manage all articles at `/admin/news` with create, read, update, and delete operations, form validation, confirmation dialogs, and toast notifications.

**Independent Test**: Log in as admin, navigate to `/admin/news`, create a new article with valid data, verify it appears in the list, edit it, verify changes saved, delete it with confirmation dialog, verify removal.

- [x] T015 [US2] Create AdminNewsPage in src/pages/admin/admin-news.tsx (table/card list using AdminTable, delete with AlertDialog confirmation, all statuses visible)
- [x] T016 [P] [US2] Create NewsFormFields in src/components/shared/NewsFormFields.tsx (title, slug auto-gen, category Select, rich text via RichTextEditor, excerpt Textarea, featured image FileUpload, status Select, publish date)
- [x] T017 [US2] Create NewsFormPage in src/pages/admin/news-form.tsx (create/edit form using useNewsForm + NewsFormFields, pattern: event-form.tsx)
- [x] T018 [US2] Add /admin/news, /admin/news/new, /admin/news/:id/edit routes to src/App.tsx (lazy-loaded, within admin layout)

**Checkpoint**: User Stories 1 AND 2 both functional and independently testable

---

## Phase 5: User Story 3 — Homepage shows featured news (Priority: P2)

**Goal**: Homepage displays the 3 most recently published articles in a "Latest News" section; hides section when no articles exist.

**Independent Test**: Publish 3+ articles in mock data. Visit `/` and verify "Latest News" section shows exactly 3 most recent with title, excerpt, date. Reduce to 1 published article and verify only 1 shown. Remove all published articles and verify section hidden.

- [x] T019 [US3] Add /api/news/featured MSW handler to src/mocks/handlers/news.ts
- [x] T020 [US3] Add featured news section to src/pages/home/home.tsx (query /api/news/featured, render up to 3 article cards, hide section on empty)

**Checkpoint**: User Story 3 fully functional

---

## Phase 6: User Story 4 — Search engines index news articles (Priority: P3)

**Goal**: Each news article detail page includes complete SEO meta tags for search engines and social media previews.

**Independent Test**: View page source of a news detail page. Verify `<title>`, `<meta name="description">`, `og:title`, `og:description`, `og:type` (article), and `og:image` (if article has image) tags contain article-specific content.

- [x] T021 [US4] Add Helmet SEO meta tags to NewsDetailPage in src/pages/news/news-detail.tsx (title, description meta, og:title, og:description, og:type, og:image using article data)

**Checkpoint**: All user stories complete

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, type-checking, and linting

- [x] T022 Run npx tsc -b to type-check all project references (verified 0 errors)
- [x] T023 Run npm run lint to verify no lint violations (verified 0 errors, pre-existing warnings only)
- [x] T024 Run npm run test:run to verify existing tests still pass (verified 276/276 passing)
- [x] T025 Verify all quickstart.md validation scenarios pass manually on dev server

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **User Stories (Phase 3–6)**: All depend on Foundational completion
- **Polish (Phase 7)**: Depends on all user stories complete

### User Story Dependencies

- **US1 (P1)**: No dependencies on other stories — can start after Phase 2
- **US2 (P1)**: No dependencies on other stories — can start after Phase 2
- **US3 (P2)**: No dependencies on other stories — can start after Phase 2 (uses its own /api/news/featured endpoint, independent from US1's /api/news)
- **US4 (P3)**: Enhances US1's NewsDetailPage — best done after or alongside US1

### Within Each Phase

- Setup tasks marked [P] can run in parallel
- Foundational tasks marked [P] can run in parallel
- User story phases can run in parallel (US1, US2, US3, US4 are independent)
- Within a story: components before pages, pages before routes

### Parallel Opportunities

| Task Group | Parallelizable Tasks |
|------------|---------------------|
| Setup | T002 types, T003 config (different files) |
| Foundational | T008 NewsSkeleton, T009 RichTextEditor (different files, no deps) |
| US1 | All sequential (page depends on nothing else in US1) |
| US2 | T016 NewsFormFields independent from T015 AdminNewsPage |
| US3 | Both tasks sequential (handler before page) |
| US4 | Single task |
| Polish | All sequential (tsc → lint → test → manual) |

**Cross-story parallelism**: US1, US2, US3, and US4 can all be implemented in parallel since they target different files and have no cross-dependencies. US4 touches the file from US1 (NewsDetailPage), so if implementing in parallel, US1 must be done before US4 touches that file.

---

## Parallel Example: User Story 1

```bash
# All US1 tasks are sequential:
Task: "T012 Create NewsListPage in src/pages/news/news.tsx"
Task: "T013 Create NewsDetailPage in src/pages/news/news-detail.tsx"
Task: "T014 Add routes to src/App.tsx"
```

## Parallel Example: User Story 2

```bash
# T016 (NewsFormFields) can run in parallel with T015 (AdminNewsPage):
Task: "T015 Create AdminNewsPage in src/pages/admin/admin-news.tsx"
Task: "T016 Create NewsFormFields in src/components/shared/NewsFormFields.tsx"

# T017 depends on T016, T018 depends on T015 + T017:
Task: "T017 Create NewsFormPage in src/pages/admin/news-form.tsx"
Task: "T018 Add admin routes to src/App.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US1 (public news browsing)
4. **STOP and VALIDATE**: Test US1 independently — navigate /news, verify list + detail + loading + empty + error states
5. Deploy/demo if ready

### Incremental Delivery

1. **Setup + Foundational** → Foundation ready
2. **US1 (P1)** → Public news browsing → Test independently → Deploy/Demo (MVP!)
3. **US2 (P1)** → Admin CRUD → Test independently → Deploy/Demo
4. **US3 (P2)** → Homepage news → Test independently → Deploy/Demo
5. **US4 (P3)** → SEO meta tags → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 (public pages)
   - Developer B: US2 (admin CRUD)
   - Developer C: US3 (homepage) + US4 (SEO)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group (use git-commit skill — conventional commits)
- Stop at any checkpoint to validate story independently
- Load `tdd`, `shadcn`, `frontend-design`, `git-commit`, `vercel-react-best-practices` skills before implementation
- Query context7 MCP for TipTap/react-helmet-async docs before implementation
- Query shadcn-ui MCP before creating any new UI components
- Run `npx tsc -b` and `npm run lint` before each commit

---

## Phase 8: Convergence

- [x] T026 CRITICAL: Add news test suite (failing-first where behavior will change) — __tests__ for news.tsx, news-detail.tsx, admin-news.tsx, news-form.tsx, useNewsForm, useNewsList, and MSW news handlers per Constitution I (missing)
- [x] T027 Fix MSW route shadowing: register /api/news/admin and /api/news/admin/:id before /api/news/:slug in src/mocks/handlers/news.ts per US2/AC1 (contradicts)
- [x] T028 Split 404 vs network-error states and add retry action to news detail page (src/pages/news/news-detail.tsx) per FR-005 / US1/AC5 (partial)
- [x] T029 Add error state with retry to admin news list query (src/pages/admin/admin-news.tsx) per FR-005 / US2/AC1 (partial)
- [x] T030 Implement slug uniqueness with numeric suffix (MSW collision check) per FR-016 and contracts/api-contracts.md (missing)
- [x] T031 Add editable publish-date field to news form (NewsFormFields.tsx + useNewsForm schema) per FR-009 (partial)
- [x] T032 Strip HTML tags before empty-content validation in useNewsForm Zod schema (reject "<p></p>") per FR-010 (partial)
- [x] T033 Fix slug auto-generation clobbering manually edited slugs in create mode (useNewsForm) per FR-009 (partial)
- [x] T034 Add published date to admin mobile card layout per FR-007 (partial)
- [x] T035 Exclude content field from public/admin list responses in MSW handlers per contracts/api-contracts.md (partial)
- [x] T036 Add "News" entries to public nav (siteConfig.nav) and admin sidebar (admin-layout.tsx) per US1/US2 reachability (missing)
- [x] T037 Make article title clickable in public news list per US1/AC2 (partial)
- [x] T038 Review and justify or remove unrequested extras (char counters justified as UX polish, RichTextEditor className used) (unrequested)

---

## Phase 9: Convergence

- [x] T039 Execute all quickstart.md validation scenarios on the dev server (public list pagination/loading/empty/error, detail + invalid-slug 404, admin CRUD with confirmation dialogs and toasts, homepage featured section visibility, SEO meta tags in page source) and then mark T025 complete per SC-005 / T025 (partial)
