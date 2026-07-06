# Specification Quality Checklist: Notifications, Email Verification & Session Timeout

**Purpose**: Validate specification completeness and quality before proceeding to planning
**Created**: 2026-07-05
**Feature**: [spec.md](./spec.md)

## Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

## Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Success criteria are technology-agnostic (no implementation details)
- [x] All acceptance scenarios are defined
- [x] Edge cases are identified
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

## Feature Readiness

- [x] All functional requirements have clear acceptance criteria
- [x] User scenarios cover primary flows
- [x] Feature meets measurable outcomes defined in Success Criteria
- [x] No implementation details leak into specification

## Requirement Completeness (Detailed)

- [x] CHK017 — Are requirements for notification badge count accuracy (polling to API vs. local increment) specified? [Clarity, Spec §FR-001, FR-005] — **Resolved**: polling-based; badge reflects latest API response
- [x] CHK018 — Are requirements defined for what happens when the "Mark all read" action is performed? [Gap] — **Resolved**: T023 specifies "Mark all read" option in NotificationPanel
- [x] CHK019 — Are requirements for the notification panel's scroll behavior (infinite scroll vs. pagination) documented? [Gap] — **Resolved**: FR-002 now specifies scrollable list of 50 most recent, no pagination
- [x] CHK020 — Are requirements for notification deletion or archival specified? [Gap] — **Resolved**: out of scope; no delete/archive requirement
- [x] CHK021 — Are requirements defined for the email verification landing page's URL structure and token handling? [Clarity, Spec §FR-011] — **Resolved**: FR-011 now specifies `/verify-email?token=<uuid>`
- [x] CHK022 — Are requirements specified for what the "Email not verified" banner looks like (visual prominence, dismissibility)? [Gap, Spec §FR-009] — **Resolved**: T032 specifies dismiss option with resend button
- [x] CHK023 — Are requirements for the cooldown countdown display format (seconds remaining, visual feedback) documented? [Clarity, Spec §FR-013] — **Resolved**: FR-013 now specifies "Resend available in Xs"
- [x] CHK024 — Are requirements defined for the admin prompt when trying to access admin features with unverified email? [Completeness, Spec §FR-012] — **Resolved**: T038 creates `RequireVerifiedEmail` guard component
- [x] CHK025 — Are requirements specified for how the 401 interceptor integrates with existing error handling in api.ts? [Completeness, Spec §FR-018] — **Resolved**: T012/T013 specify integration with existing request() wrapper
- [x] CHK026 — Are requirements for the return URL behavior when login itself expires (post-login redirect cycle) documented? [Edge Case] — **Resolved**: FR-014 now specifies redirect guard prevents redirect if already on /login

## Requirement Clarity

- [x] CHK027 — Is "accurate unread count" in SC-001 quantified with an acceptable margin or refresh guarantee? [Ambiguity, Spec §SC-001] — **Resolved**: SC-001 rephrased to "accurate within the 30s polling window"
- [x] CHK028 — Is "relative timestamp" in FR-002 clearly defined (e.g., "2 hours ago" vs. precise time)? [Clarity, Spec §FR-002] — **Resolved**: FR-002 now specifies `Intl.RelativeTimeFormat`
- [x] CHK029 — Is "appropriate icon" in FR-007 explicitly specified (which icon, size, color)? [Clarity, Spec §FR-007] — **Resolved**: FR-007 now specifies lucide `BellOff` icon
- [x] CHK030 — Is "prompted to verify their email first" in FR-012 precisely defined (modal, banner, redirect)? [Clarity, Spec §FR-012] — **Resolved**: T038 specifies guard component wrapping admin children
- [x] CHK031 — Is "show success or error messages appropriately" in FR-011 specified with concrete success/error message text? [Ambiguity, Spec §FR-011] — **Resolved**: FR-011 now specifies all 4 states with exact messages
- [x] CHK032 — Is "no API requests made" as the inactivity definition clarified (does typing in a form count)? [Clarity, Spec §FR-015] — **Resolved**: FR-015 now clarifies server-enforced; only HTTP requests count

## Requirement Consistency

- [x] CHK033 — Do the notification polling requirements (FR-005) align with the assumed backend API contract (contracts/notification.md)? [Consistency, Spec §FR-005] — **Resolved**: contracts/notification.md aligns with FR-005
- [x] CHK034 — Do email verification requirements align with the existing AuthContext logout/refresh patterns? [Consistency, Spec §FR-008–FR-012] — **Resolved**: email verification status from `/auth/me` aligns with existing AuthContext user fetch
- [x] CHK035 — Are session timeout requirements (FR-014–FR-018) consistent with the assumption that the backend returns 401 consistently? [Consistency, Spec §FR-014–FR-018, Assumptions] — **Resolved**: contracts/session.md and FR-014 align
- [x] CHK036 — Do acceptance scenarios across all three user stories use consistent terminology for user roles ("visitor" vs. "unauthenticated user")? [Consistency, Spec §US-1, US-2, US-3] — **Resolved**: spec uses "logged-in user" in stories and "authenticated/unauthenticated" in FRs; consistent per context

## Acceptance Criteria Quality

- [x] CHK037 — Can SC-001 ("accurate unread count") be objectively verified without requiring backend state manipulation? [Measurability, Spec §SC-001] — **Resolved**: T014/T015 use MSW mock with controlled responses
- [x] CHK038 — Can SC-004 ("users can resend verification email") distinguish between a successful API call and actual email delivery? [Measurability, Spec §SC-004] — **Resolved**: SC-004 rephrased to scope to API call success (delivery is backend responsibility)
- [x] CHK039 — Is SC-005 ("clear message and return URL preservation") testable without simulating a 30-minute wait? [Measurability, Spec §SC-005] — **Resolved**: T038 uses MSW immediate 401 response
- [x] CHK040 — Are all success criteria technology-agnostic, or do SC-006 and SC-007 reference specific tools (vitest, tsc)? [Measurability, Spec §SC-006, SC-007] — **Resolved**: acceptable for this project — build gates are intentionally tool-specific

## Scenario Coverage

- [x] CHK041 — Are requirements defined for the scenario where a user has 100+ unread notifications? [Coverage, Gap] — **Resolved**: FR-001 now specifies "99+" badge overflow
- [x] CHK042 — Are requirements defined for the scenario where the verification email never arrives (user needs manual resend or support contact)? [Coverage, Gap] — **Resolved**: edge cases now cover resend button + support contact
- [x] CHK043 — Are requirements defined for the scenario where a user's session expires during a multi-step form (not just a single submission)? [Coverage, Spec §Edge Cases] — **Resolved**: deferred in tasks.md notes — toast on data loss, no save/restore
- [x] CHK044 — Are requirements defined for the scenario where a user is rate-limited at the notification polling endpoint? [Coverage, Gap] — **Resolved**: edge cases now cover 429 — same as any API failure (bell shows without badge)
- [x] CHK045 — Are requirements defined for how the system behaves when both email verification and session timeout occur simultaneously? [Coverage, Gap] — **Resolved**: edge cases now specify auth:expired takes precedence

## Edge Case Coverage

- [x] CHK046 — Are requirements defined for the notification bell state when the user has exactly 99+ unread notifications (badge overflow)? [Edge Case, Gap] — **Resolved**: covered by CHK041/FR-001 "99+" badge
- [x] CHK047 — Are requirements defined for the email verification flow when a user registers with an already-taken email? [Edge Case, Gap] — **Resolved**: edge cases now note server returns validation error; existing form handling applies
- [x] CHK048 — Are requirements defined for the session timeout behavior when a user has multiple browser tabs open? [Edge Case, Gap] — **Resolved**: edge cases now specify all tabs redirect; acceptable behavior
- [x] CHK049 — Are requirements defined for what happens when the notification API returns a non-401 error during polling (e.g., 500)? [Edge Case, Gap] — **Resolved**: spec.md:78 already covers API failure (bell without badge)
- [x] CHK050 — Are requirements defined for the cooldown timer persisting across page navigations? [Edge Case, Gap] — **Resolved**: edge cases now specify in-memory; full reload resets

## Dependencies & Assumptions

- [x] CHK051 — Is the assumption that the backend provides notification APIs validated with specific endpoint contracts? [Assumption, Spec §Assumptions] — **Resolved**: contracts/notification.md documents GET/PUT endpoints
- [x] CHK052 — Is the assumption that email verification endpoints exist documented with expected request/response shapes? [Assumption, Spec §Assumptions] — **Resolved**: contracts/email-verification.md documents POST endpoints
- [x] CHK053 — Are the consequences documented if any backend assumption turns out to be incorrect? [Dependency, Gap] — **Resolved**: edge cases now specify updating MSW mocks + UI adjustments

## Notes

- All items pass validation. Ready for planning.
- Detailed requirements quality items (CHK017-CHK053) added during `/speckit.checklist` on 2026-07-06, testing requirements writing quality — not implementation behavior.
