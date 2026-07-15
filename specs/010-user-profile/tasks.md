# Tasks: User Profile Page

**Input**: Design documents from `specs/010-user-profile/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-contracts.md

**Tests**: Tests are MANDATORY per Constitution Principle I (TDD is Non-Negotiable). Write tests FIRST, ensure they FAIL, then implement.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown follow the project structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add shared type definitions required by all user stories

- [x] T001 Add `UserProfile` and `PasswordChange` interfaces to `src/types/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Create `useProfileQuery` hook in `src/hooks/use-profile-query.ts` — fetches full profile from `GET /api/user/profile` via `api.get<UserProfile>`
- [x] T003 [P] Add MSW handler for `GET /api/user/profile` in MSW handlers directory — returns `UserProfile` with avatar, createdAt, role, lastLoginIp, accountStatus
- [x] T004 [P] Add skeleton loading state to `ProfilePage` in `src/pages/profile/profile.tsx` — show `<Skeleton>` matching profile card layout while data loads
- [x] T005 [P] Update existing `ProfilePage` tests in `src/pages/profile/__tests__/profile.test.tsx` — mock `useProfileQuery` instead of `useAuth` for profile data, add test for skeleton loading state

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 — View Profile (Priority: P1) 🎯 MVP

**Goal**: Authenticated users can view their full profile at `/profile` with avatar, member info, and admin-specific fields

**Independent Test**: Log in as a user, navigate to `/profile`, and verify that avatar, name, email, role, and member-since date are all displayed correctly. Admin users additionally see lastLoginIp and accountStatus.

### Tests for User Story 1 (MANDATORY per Constitution Principle I) ⚠️

- [x] T006 [P] [US1] Write test for avatar display in `src/pages/profile/__tests__/profile.test.tsx` — verify `<Avatar>` renders with correct src when user has avatar
- [x] T007 [P] [US1] Write test for admin fields visibility in `src/pages/profile/__tests__/profile.test.tsx` — verify lastLoginIp and accountStatus render only for admin users

### Implementation for User Story 1

- [x] T008 [P] [US1] Add avatar display to `ProfilePage` in `src/pages/profile/profile.tsx` — show `<Avatar>` with `AvatarImage` + `AvatarFallback` (user initials) above the account info card
- [x] T009 [P] [US1] Add admin-only fields section to `ProfilePage` in `src/pages/profile/profile.tsx` — conditionally render lastLoginIp and accountStatus when `user.role === "admin"`
- [x] T010 [US1] Wire up `useProfileQuery` in `ProfilePage` in `src/pages/profile/profile.tsx` — replace direct `useAuth().user` usage with fetched profile data for avatar, role, createdAt

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 — Edit Profile (Priority: P2)

**Goal**: Authenticated users can edit their name and email via inline form, and change their avatar via modal dialog

**Independent Test**: Log in, navigate to profile, click "Edit Profile", change the name, save, and verify the profile displays the updated name. Click avatar, select a new image via modal, confirm, verify avatar updates.

### Tests for User Story 2 (MANDATORY per Constitution Principle I) ⚠️

- [x] T011 [P] [US2] Write test for profile edit form rendering in `src/pages/profile/__tests__/profile.test.tsx` — verify "Edit Profile" button toggles editable fields
- [x] T012 [P] [US2] Write test for profile edit submission in `src/pages/profile/__tests__/profile.test.tsx` — verify save triggers `api.put` and shows success toast
- [x] T013 [P] [US2] Write test for avatar upload modal in `src/pages/profile/__tests__/profile.test.tsx` — verify modal opens, file selection renders preview, confirm triggers `api.upload`

### Implementation for User Story 2

- [x] T014 [P] [US2] Create `useProfileForm` hook in `src/hooks/use-profile-form.ts` — `useForm` + `zodResolver` with `profileSchema`, `useMutation` that calls `api.put("/user/profile", data)`, success/error toasts, query invalidation
- [x] T015 [P] [US2] Create `ProfileForm` component in `src/pages/profile/profile-form.tsx` — inline editable form with name/email `<Field>` + `<Input>`, save/cancel buttons, renders conditionally based on `isEditing` state
- [x] T016 [P] [US2] Create `AvatarUploadModal` component in `src/pages/profile/avatar-upload-modal.tsx` — shadcn `<Dialog>` with `<FileUpload variant="circle">`, preview via `useState<File | null>`, confirm calls `api.upload` with FormData
- [x] T017 [US2] Integrate edit mode toggle + `ProfileForm` + `AvatarUploadModal` into `ProfilePage` in `src/pages/profile/profile.tsx` — add `isEditing` state, wire "Edit Profile" / "Cancel" buttons, add avatar click handler that opens modal
- [x] T018 [US2] Add MSW handler for `PUT /api/user/profile` — handle both JSON and multipart requests, return updated `UserProfile`

**Checkpoint**: At this point, User Story 2 should be fully functional on top of US1

---

## Phase 5: User Story 3 — Change Password (Priority: P3)

**Goal**: Authenticated users can change their password from the profile page with validation

**Independent Test**: Log in, navigate to profile, enter valid current/new passwords in the "Change Password" section, submit, log out, and log in with the new password.

### Tests for User Story 3 (MANDATORY per Constitution Principle I) ⚠️

- [x] T019 [P] [US3] Write test for password change form rendering in `src/pages/profile/__tests__/profile.test.tsx` — verify "Change Password" section is visible with all three fields
- [x] T020 [P] [US3] Write test for password change validation in `src/pages/profile/__tests__/profile.test.tsx` — verify mismatched passwords show inline error, incorrect current password shows toast error
- [x] T021 [P] [US3] Write test for successful password change in `src/pages/profile/__tests__/profile.test.tsx` — verify success toast and form reset on submit

### Implementation for User Story 3

- [x] T022 [P] [US3] Create `PasswordChangeForm` component in `src/pages/profile/change-password-form.tsx` — `useForm` + `zodResolver` with `passwordSchema` (z.object with currentPassword, newPassword, confirmPassword + refine match), renders three `<Field>` groups with `<Input type="password">`
- [x] T023 [US3] Wire up password change mutation in `src/pages/profile/change-password-form.tsx` — `useMutation` calling `api.put("/user/password", data)`, success toast "Password updated successfully", error handling for `401` (incorrect current password), form reset on success
- [x] T024 [US3] Add MSW handler for `PUT /api/user/password` in MSW handlers directory — validate request body, return 401 for incorrect current password, return 200 on success
- [x] T025 [US3] Integrate `PasswordChangeForm` into `ProfilePage` in `src/pages/profile/profile.tsx` — render as a second `<Card>` below the profile info card

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T026 [P] TypeScript type-check — run `npx tsc -b` and fix any type errors
- [ ] T027 [P] Run ESLint — `npm run lint` and fix any lint errors
- [ ] T028 Run full test suite — `npm run test:run` and ensure all tests pass (existing + new)
- [ ] T029 Commit all changes using `git-commit` skill with conventional commit format

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational — No dependencies on other stories
- **US2 (P2)**: Depends on US1 (adds edit capability to the same page) — but independently testable
- **US3 (P3)**: Can start after Foundational — independent of US1/US2 (separate section on page)

### Within Each User Story

- Tests MUST be written and FAIL before implementation (per Constitution Principle I)
- MSW handlers before component implementation
- Component implementation before integration
- Integration before polish

### Parallel Opportunities

- T003, T004, T005 (Phase 2 Foundational) — all different files, can run in parallel
- T006, T007 (US1 tests) — can run in parallel
- T008, T009 (US1 implementation) — can run in parallel
- T011, T012, T013 (US2 tests) — can run in parallel
- T014, T015, T016 (US2 implementation) — can run in parallel
- T019, T020, T021 (US3 tests) — can run in parallel
- T022 (US3 implementation) — standalone

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002–T005)
3. Complete Phase 3: User Story 1 (T006–T010)
4. **STOP and VALIDATE**: Test US1 independently — profile renders with avatar, role, admin fields
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add US1 (View Profile) → Test independently → Deploy/Demo (MVP!)
3. Add US2 (Edit Profile) → Test independently → Deploy/Demo
4. Add US3 (Change Password) → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (RED→GREEN cycle per TDD skill)
- Commit after each phase or logical group
- Stop at any checkpoint to validate story independently
- All new components: named exports, `cn()` for classes, shadcn primitives
