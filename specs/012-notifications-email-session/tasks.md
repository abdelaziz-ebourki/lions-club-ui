---

description: "Task list for Notifications, Email Verification & Session Timeout"
---

# Tasks: Notifications, Email Verification & Session Timeout

**Input**: Design documents from `specs/012-notifications-email-session/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are MANDATORY per Constitution Principle I (TDD is Non-Negotiable). Write tests FIRST, ensure they FAIL, then implement.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create shared types, MSW handlers, and component exports needed by all user stories.

- [x] T001 Read existing types pattern in `src/types/index.ts` — understand current type conventions
- [x] T002 [P] Add Notification, NotificationType, EmailVerificationStatus types to `src/types/index.ts`
- [x] T003 Add AuthError class and NotificationState interface to `src/types/index.ts` (sequential — same file as T002)
- [x] T004 Read existing MSW handler pattern in `src/mocks/handlers/` — understand handler structure
- [x] T005 [P] Create MSW notification handlers at `src/mocks/handlers/notifications.ts` — mock GET /api/notifications, PUT /api/notifications/:id/read, and PUT /api/notifications/read-all
- [x] T006 [P] Create MSW email verification handlers at `src/mocks/handlers/email-verification.ts` — mock POST /api/auth/verify-email, POST /api/auth/resend-verification
- [x] T007 [P] Create MSW session timeout handlers at `src/mocks/handlers/session.ts` — mock 401 response for expired session
- [x] T008 Verify MSW handlers are registered in `src/mocks/handlers/index.ts`

**Checkpoint**: Shared types and MSW mocks ready for all user story testing.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: API client 401 interceptor and AuthContext modifications — required by US3 (session timeout) and beneficial for all stories.

**⚠️ CRITICAL**: Modifications to api.ts and auth.tsx must not break existing auth flows.

### Tests for Foundational (MANDATORY per Constitution Principle I) ⚠️

- [x] T009 [P] Write test for 401 interception in `src/lib/__tests__/api.test.ts` — verify AuthError is thrown on 401 response — **verify FAILS then PASSES**
- [x] T010 [P] Write test for auth:expired event dispatch in api test — verify window event is dispatched on 401 — **verify FAILS then PASSES**
- [x] T011 Write test for AuthContext 401 listener in `src/contexts/__tests__/auth.test.tsx` — verify user is cleared, toast shown, and redirect happens on auth:expired event — **verify FAILS then PASSES**

### Implementation for Foundational

- [x] T012 Add 401 interceptor to `src/lib/api.ts` — catch 401 status in request(), dispatch auth:expired event on window, throw AuthError
- [x] T013 Add auth:expired event listener to `src/contexts/auth.tsx` — useEffect that clears user, shows toast("Your session has expired. Please log in again."), and navigates to /login with returnUrl

**Checkpoint**: API client globally handles 401. AuthContext responds to session expiry. Foundation for US3 ready.

---

## Phase 3: User Story 1 — Notifications (Priority: P1) 🎯 MVP

**Goal**: Authenticated users see a notification bell with badge count. Clicking opens a panel with notification list. Notifications poll every 30s, pause when tab hidden.

**Independent Test**: Log in via MSW mock, verify bell icon renders with badge. Open panel, verify notification list displays. Click a notification, verify navigation and read state update.

### Tests for User Story 1 (MANDATORY per Constitution Principle I) ⚠️

- [x] T015 [P] [US1] Write test for `use-notifications` hook in `src/hooks/__tests__/use-notifications.test.ts` — verify polling interval, data fetching, and unread count calculation — **verify FAILS then PASSES**
- [x] T016 [P] [US1] Write test for notification bell in `src/components/layout/__tests__/header.test.tsx` — verify bell icon renders for authenticated users, hidden for unauthenticated — **verify FAILS then PASSES**
- [x] T017 [P] [US1] Write test for notification panel in `src/components/notifications/__tests__/notification-panel.test.tsx` — verify notification list renders, empty state shows "No new notifications" — **verify FAILS then PASSES**
- [x] T018 [P] [US1] Write test for notification item in `src/components/notifications/__tests__/notification-item.test.tsx` — verify correct icon per type, click handler fires — **verify FAILS then PASSES**
- [x] T019 [P] [US1] Write test for notification polling pause in use-notifications test — verify polling stops when document.hidden is true — **verify FAILS then PASSES**

### Implementation for User Story 1

- [x] T020 [P] [US1] Create `use-notifications` hook at `src/hooks/use-notifications.ts` — useQuery with refetchInterval: 30000, refetchIntervalInBackground: false, fetches GET /api/notifications, returns notifications + unreadCount
- [x] T021 [P] [US1] Create NotificationBell component at `src/components/notifications/notification-bell.tsx` — Button variant ghost with Bell lucide icon, Badge for unread count, aria-label with count
- [x] T022 [P] [US1] Create NotificationItem component at `src/components/notifications/notification-item.tsx` — renders icon per type, title, description, relative timestamp, onClick handler with aria-attributes
- [x] T023 [US1] Create NotificationPanel component at `src/components/notifications/notification-panel.tsx` — Sheet with scrollable notification list (max 50 items, enforced client-side), EmptyState when empty, "Mark all read" option, keyboard navigation
- [x] T024 [US1] Integrate notification bell into header at `src/components/layout/header.tsx` — add bell icon next to existing nav items, conditional on isAuthenticated
- [x] T025 [US1] Wire notification panel open/close state and mark-as-read mutation in header integration

**Checkpoint**: Notification system fully functional. Bell, badge, panel, polling, and navigation all work.

---

## Phase 4: User Story 2 — Email Verification (Priority: P2)

**Goal**: New users see verification prompt on registration. Profile shows verification status with resend option. 60s cooldown enforced. Verification link landing page handles success/error/expired states.

**Independent Test**: Register via MSW mock, verify toast prompt. Navigate to profile, verify banner. Click resend, verify cooldown. Navigate to /verify-email?token=x, verify success/error messages.

### Tests for User Story 2 (MANDATORY per Constitution Principle I) ⚠️

- [x] T026 [P] [US2] Write test for registration verification toast in `src/pages/auth/__tests__/register.test.tsx` — verify "Please check your email" toast appears on successful registration — **verify FAILS then PASSES**
- [x] T027 [P] [US2] Write test for email verification banner in `src/components/shared/__tests__/email-verification-banner.test.tsx` — verify banner shows for unverified, hidden for verified — **verify FAILS then PASSES**
- [x] T028 [P] [US2] Write test for resend cooldown in email-verification-banner test — verify button shows countdown after click, disabled for 60s — **verify FAILS then PASSES**
- [x] T029 [P] [US2] Write test for verify email page in `src/pages/__tests__/verify-email.test.tsx` — verify success message, error message for expired link, error for invalid token — **verify FAILS then PASSES**
- [x] T030 [P] [US2] Write test for use-email-verification hook in `src/hooks/__tests__/use-email-verification.test.ts` — verify resend call, cooldown state, status fetching — **verify FAILS then PASSES**

### Implementation for User Story 2

- [x] T031 [P] [US2] Create `use-email-verification` hook at `src/hooks/use-email-verification.ts` — fetches verification status from /auth/me, provides resend function with cooldown state machine
- [x] T032 [P] [US2] Create EmailVerificationBanner component at `src/components/shared/email-verification-banner.tsx` — shows "Email not verified" with resend button, cooldown countdown, dismiss option
- [x] T033 [US2] Add verification prompt toast to `src/pages/auth/register.tsx` — after successful registration, toast.success("Please check your email to verify your account")
- [x] T034 [US2] Create VerifyEmailPage at `src/pages/verify-email.tsx` — handles token from URL query, calls POST /api/auth/verify-email, shows success/expired/invalid/already-verified states per FR-011
- [x] T035 [US2] Create minimal ProfilePage at `src/pages/profile/profile.tsx` — displays user info (name, email, join date), integrates EmailVerificationBanner, edit button placeholder
- [x] T036 [US2] Add profile and verify-email routes to `src/App.tsx` — /profile and /verify-email as static imports
- [x] T037 [US2] Add profile link to header user dropdown at `src/components/layout/header.tsx`
- [x] T038 [US2] Create email verification guard component at `src/components/shared/require-verified-email.tsx` — wraps children, shows verification prompt if email is unverified; integrate into admin route layout per FR-012

**Checkpoint**: Email verification flow complete. Registration triggers prompt. Profile shows status. Resend works with cooldown. Link handles all states. Admin features prompt unverified users.

---

## Phase 5: User Story 3 — Session Timeout (Priority: P3)

**Goal**: Expired sessions are detected globally. User is logged out with clear message. Return URL preserved for post-login redirect.

**Independent Test**: Simulate expired session via MSW (return 401 on next request), verify redirect to /login with "Session expired" toast and returnUrl preserved in URL.

### Tests for User Story 3 (MANDATORY per Constitution Principle I) ⚠️

- [x] T039 [P] [US3] Write test for redirect on 401 in `src/contexts/__tests__/auth.test.tsx` — verify navigate to /login with returnUrl on auth:expired event — **verify FAILS then PASSES**
- [x] T040 [P] [US3] Write test for session expiry toast text in auth test — verify "Your session has expired. Please log in again." toast is called — **verify FAILS then PASSES**
- [x] T041 [P] [US3] Write test for return URL preservation in auth test — verify returnUrl contains the current pathname when redirecting — **verify FAILS then PASSES**

### Implementation for User Story 3

- [x] T042 [P] [US3] Create `use-session-timeout` hook at `src/hooks/use-session-timeout.ts` — wraps the auth:expired event listener as a reusable hook (can be used by AuthProvider)
- [x] T043 [US3] Wire 401 handling in AuthContext at `src/contexts/auth.tsx` — already partially done in T013; ensure returnUrl is captured from window.location.pathname before redirect
- [x] T044 [US3] Verify 401 interceptor in `src/lib/api.ts` — per session contract, ALL 401 responses dispatch auth:expired (no error-code filtering); confirm no backend returns 401 for non-auth reasons that would cause false logouts

**Checkpoint**: Session timeout handles all cases. User sees clear message, return URL preserved.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility audit, route registration, type-check, lint, and full validation.

- [x] T045 [P] Audit notification panel accessibility — verify focus trapping inside Sheet, keyboard navigation (Tab/Shift+Tab/Enter/Escape), aria-live region for badge count changes
- [x] T046 [P] Audit email verification banner accessibility — verify role="status" for status changes, proper heading hierarchy
- [x] T047 [P] Audit session timeout flow accessibility — verify redirect is announced to screen readers
- [x] T048 [P] Run full test suite — `npm run test:run` — all tests pass
- [x] T049 [P] Run TypeScript type-check — `npx tsc -b` — zero errors
- [x] T050 [P] Run linter — `npm run lint` — passes
- [x] T051 [P] Run quickstart validation scenarios — all scenarios verified
- [x] T052 Run build — `npm run build` — succeeds

**Checkpoint**: All acceptance criteria verified. Feature complete and ready for merge.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (types needed for api.ts AuthError class)
- **User Stories (Phase 3–5)**: 
  - US1 (Phase 3): Depends on Phase 1 only — independent of Foundational
  - US2 (Phase 4): Depends on Phase 1 (types, MSW handlers) — independent of Foundational
  - US3 (Phase 5): Depends on Phase 1 AND Phase 2 (Foundational — 401 interceptor + AuthContext changes)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1) — Notifications**: Independent — can proceed immediately after Phase 1
- **US2 (P2) — Email Verification**: Independent — can proceed in parallel with US1 after Phase 1
- **US3 (P3) — Session Timeout**: Depends on Phase 2 (api.ts 401 handling, auth.tsx listener)

### Within Each User Story

- Tests MUST be written and FAIL before implementation (per Constitution Principle I)
- Hooks before components
- Components before page integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Phase 1 tasks marked [P] can run in parallel
- All Phase 2 test tasks marked [P] can run in parallel
- US1 and US2 can proceed in parallel after Phase 1
- All tests within a user story marked [P] can run in parallel
- Phase 6 tasks marked [P] can run in parallel

---

## Parallel Example: Phase 3 (US1)

```bash
# Write all tests in parallel:
Task: "T015 — use-notifications hook test"
Task: "T016 — notification bell test"
Task: "T017 — notification panel test"
Task: "T018 — notification item test"
Task: "T019 — polling pause test"

# Implement after tests pass (sequential where needed, parallel where possible):
Task: "T020 — use-notifications hook"
Task: "T021 — NotificationBell component"
Task: "T022 — NotificationItem component"
Task: "T023 — NotificationPanel component" (depends on T021, T022)
Task: "T024 — header integration"
Task: "T025 — panel wiring"
```

## Parallel Example: Phase 4 (US2)

```bash
# Write all tests in parallel:
Task: "T026 — registration toast test"
Task: "T027 — email verification banner test"
Task: "T028 — resend cooldown test"
Task: "T029 — verify email page test"
Task: "T030 — use-email-verification hook test"

# Implement after tests pass:
Task: "T031 — use-email-verification hook"
Task: "T032 — EmailVerificationBanner component"
Task: "T033 — register.tsx toast"
Task: "T034 — VerifyEmailPage"
Task: "T035 — ProfilePage"
Task: "T036 — App.tsx routes"
Task: "T037 — header profile link"
Task: "T038 — email verification guard (FR-012)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 3: US1 (Notifications)
3. **STOP and VALIDATE**: Test US1 independently — bell, badge, panel, polling all work
4. Deploy/demo if ready — notifications alone improve the site significantly

### Incremental Delivery

1. Setup + US1 → MVP: Notification system with bell, panel, and polling
2. Add US2 → Email verification flow + profile page
3. Add US3 → Session timeout handling
4. Add Phase 6 → Polish and validation
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Developer A completes Phase 1 (Setup — types, MSW handlers)
2. Once Phase 1 is done:
   - Developer A: Phase 3 (US1 — Notifications)
   - Developer B: Phase 4 (US2 — Email verification)
   - Developer C: Phase 2 then Phase 5 (US3 — Session timeout)
3. Polish phase validates everything together

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group using `git-commit` skill
- Stop at any checkpoint to validate story independently
- Load `tdd`, `git-commit` skills before starting implementation
- Refer to `contracts/notification.md` for notification API contract details
- Refer to `contracts/email-verification.md` for email verification API contract details
- Refer to `contracts/session.md` for session timeout API contract details
- Refer to `data-model.md` for component props and state models
- Refer to `quickstart.md` for validation scenarios
- **Analysis fixes applied**: T012 removed (duplicate of T003), T043 aligned with session contract (all 401s dispatch auth:expired), T038 added for FR-012 (admin email verification prompt), T003 unmarked [P] (same file as T002)
- **Deferred**: Form data save/restore on session expiry (spec edge case) — out of scope for this feature

---

## Phase 7: Convergence

**Purpose**: Close gaps identified after the initial implementation cycle. All items trace to unmet or partially-satisfied requirements from spec.md.

- [x] T053 [US1] Wire notification mark-as-read API call in header `src/components/layout/header.tsx` — on notification click, call `PUT /api/notifications/:id/read` before navigating, then refetch notifications per FR-003 (<gap-type: missing>)
- [x] T054 [US2] Implement all 4 verification states in `src/pages/verify-email.tsx` — track verify result (success/error/expired/already-verified) from the API response and render the matching state per FR-011 with appropriate CTAs for each (<gap-type: partial>)
- [x] T055 [US3] Consume `?return=` query param in login page at `src/pages/auth/login.tsx` — read `return` search param on login success and navigate to it instead of `/` per FR-017 and US3/AC4 (<gap-type: missing>)
- [x] T056 [US2] Add "Continue to profile" link to verify email success state in `src/pages/verify-email.tsx` per FR-011 success state spec (<gap-type: partial>)
- [x] T057 [US1] Replace `formatRelativeTime` in `src/components/notifications/notification-item.tsx` with `Intl.RelativeTimeFormat` per FR-002 (<gap-type: contradicts>)
- [x] T058 [US1] Add "Mark all read" button to `src/components/notifications/notification-panel.tsx` wired to `PUT /api/notifications/read-all`, and add keyboard navigation support (Tab/Shift+Tab/Enter/Escape within the panel) per T023 (<gap-type: partial>)
- [x] T059 [P] [US2] Write test for `RequireVerifiedEmail` guard in `src/components/shared/__tests__/require-verified-email.test.tsx` — verify children render when verified, banner shown when unverified — **verify FAILS then PASSES** per Constitution Principle I (<gap-type: missing>)
- [x] T060 [P] [US2] Write test for `ProfilePage` in `src/pages/profile/__tests__/profile.test.tsx` — verify user info renders, banner integration works — **verify FAILS then PASSES** per Constitution Principle I (<gap-type: missing>)
- [x] T061 [P] [US3] Write test for `use-session-timeout` hook in `src/hooks/__tests__/use-session-timeout.test.ts` — verify auth:expired listener triggers toast and redirect — **verify FAILS then PASSES** per Constitution Principle I (<gap-type: missing>)

---

## Phase 8: Convergence

**Purpose**: Close remaining gaps identified after the second implementation cycle. All items trace to unmet or partially-satisfied requirements from spec.md.

- [x] T062 [US2] Add "Resend verification email" button to expired state in `src/pages/verify-email.tsx` — the expired state should include a "Resend verification email" button that links to `/profile` per FR-011 expired state spec (<gap-type: partial>)
- [x] T063 [US2] Fix invalid state heading and add "Request new link" button in `src/pages/verify-email.tsx` — change heading to "Invalid verification token" and add a link to `/profile` per FR-011 invalid state spec (<gap-type: partial>)
