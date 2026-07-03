# Feature Specification: UX Polish

**Feature Branch**: `004-ux-polish`

**Created**: 2026-07-03

**Status**: Draft

**Input**: User description: "UX gaps: loading skeletons, empty states, success toasts, remember me, RSVP button"

## Clarifications

### Session 2026-07-03

- Q1: Toast timing vs page reload — success toasts would be destroyed by window.location.reload() after login/register. → B: Replace reload with client-side navigation (navigate to home/dashboard) so the toast renders for its full duration.
- Q2: RSVP auth gate — what happens when an unauthenticated visitor clicks "Join Event"? → Login prompt on click: show button to everyone; if unauthenticated, prompt to log in first (redirect to /login with return URL), then proceed with RSVP.
- Q3: "Remember me" backend support — does the API support extended session cookies? → Yes — backend accepts a remember_me flag and issues an extended-session cookie. Confirms the existing assumption.

## User Scenarios & Testing

### User Story 1 — Page shows a loading skeleton while fetching data (Priority: P1)

An admin or visitor navigates to a list page (events, members, forum, search results). While the data is loading, the page shows subtle skeleton placeholders that indicate content is coming — not a blank page or a flash of missing content.

**Why this priority**: Loading states are the most visible UX gap — every list page currently shows a blank or partially-rendered view during fetch, which is confusing and feels broken.

**Independent Test**: Can be fully tested by navigating to any admin list page or forum page with simulated network delay and verifying skeleton placeholders render, then transition to content.

**Acceptance Scenarios**:

1. **Given** the user navigates to an admin events list page, **When** the data is still loading, **Then** skeleton card placeholders are displayed in place of event cards
2. **Given** skeleton placeholders are visible, **When** the data finishes loading, **Then** the skeletons are replaced with the actual content
3. **Given** a user navigates to the forum categories page, **When** categories are loading, **Then** skeleton list items are displayed
4. **Given** a user navigates to a thread list in a forum category, **When** threads are loading, **Then** skeleton cards are displayed

---

### User Story 2 — Empty pages show a helpful empty state (Priority: P1)

A user lands on a list page that has no data (no events created yet, no forum threads, no search results, no members). Instead of a blank white page or a confusing "no items" in tiny text, they see a friendly illustration or icon with a clear message and a suggested action.

**Why this priority**: Empty states are the second most visible gap — users who encounter empty pages have no guidance on what to do next.

**Independent Test**: Can be fully tested by navigating to any empty list page and verifying a helpful empty state message and call-to-action are displayed.

**Acceptance Scenarios**:

1. **Given** there are no events, **When** the admin views the events list page, **Then** an empty state is shown with the message "No projects yet" and a "Create your first project" button
2. **Given** there are no members, **When** the admin views the members list page, **Then** an empty state is shown with "No members yet" and an "Add your first member" link
3. **Given** a search returns zero results, **When** the search results page loads, **Then** an empty state is shown with "No results found" and suggestions to refine the search
4. **Given** a forum category has no threads, **When** the user navigates to that category, **Then** an empty state is shown with "No discussions yet" and a "Start a discussion" button
5. **Given** a thread has no replies, **When** the user views the thread detail page, **Then** an empty state is shown with "No replies yet" and a prompt to "Be the first to reply"

---

### User Story 3 — Login page offers "Remember me" (Priority: P2)

A returning user visits the login page. They see a "Remember me" checkbox below the password field. Checking it and signing in keeps their session alive across browser restarts. Leaving it unchecked uses the default session duration.

**Why this priority**: Medium impact — improves usability for returning users but does not block core functionality.

**Independent Test**: Can be fully tested by checking "Remember me", logging in, closing the browser, reopening, and verifying the session persists (vs. expiring without it).

**Acceptance Scenarios**:

1. **Given** the user is on the login page, **When** they view the form, **Then** a "Remember me" checkbox is visible below the password field
2. **Given** the user checks "Remember me" and logs in, **When** they close and reopen the browser, **Then** they remain logged in
3. **Given** the user does NOT check "Remember me" and logs in, **When** they close and reopen the browser, **Then** they are logged out

---

### User Story 4 — User RSVPs to an event (Priority: P2)

A visitor or member views an event detail page. They see a prominent "Join / RSVP" button. Clicking it records their interest. If the user is not logged in, they are prompted to sign in first (redirected to login with a return URL). The button state changes to indicate they've RSVP'd. Admin can see the RSVP count on the event.

**Why this priority**: Medium impact — adds community interaction but requires backend support for persistence.

**Independent Test**: Can be tested by clicking RSVP on an event, verifying the button changes to "Going" state, and that the count updates.

**Acceptance Scenarios**:

1. **Given** a user is viewing an event detail page, **When** they have not RSVP'd, **Then** a "Join Event" button is displayed
2. **Given** the user clicks "Join Event", **When** the request succeeds, **Then** the button changes to "Going" and is disabled to prevent duplicate RSVP
3. **Given** the user has already RSVP'd, **When** they reload the event page, **Then** the button shows "Going"
4. **Given** an unauthenticated visitor clicks "Join Event", **When** the click is handled, **Then** they are redirected to the login page with a return URL back to the event

---

### User Story 5 — User sees success toast after login/register (Priority: P3)

After logging in or registering successfully, a brief success notification appears ("Welcome back!" or "Account created!") before navigating to the home page.

**Why this priority**: Lower priority — login/register already works, the toast is a nice-to-have micro-interaction.

**Independent Test**: Can be tested by logging in or registering and verifying a success toast appears briefly.

**Acceptance Scenarios**:

1. **Given** a user submits valid login credentials, **When** the login succeeds, **Then** a toast notification "Welcome back!" appears briefly before navigating to the home page
2. **Given** a user submits valid registration data, **When** the account is created, **Then** a toast notification "Account created successfully!" appears briefly before navigating to the home page

---

### Edge Cases

- What happens when skeleton loading takes longer than expected (e.g., 10+ seconds)? — Skeleton persists until data arrives or error state is shown (pre-existing error handling covers this).
- What happens if RSVP API call fails? — Show error toast, reset button to "Join Event".
- What happens when a user tries to RSVP to a past event? — Button is hidden or disabled with "This event has ended".
- What happens when an unauthenticated visitor clicks "Join Event"? — Redirected to /login with ?return=/events/:id. After login, redirect back to the event page.
- What happens when "Remember me" token expires? — User is silently logged out on next page visit, redirected to login.
- What about search with multiple empty tabs? — Each tab independently shows its own empty state.

## Requirements

### Functional Requirements

- **FR-001**: Admin events list page MUST show skeleton card placeholders while events data is loading
- **FR-002**: Admin members list page MUST show skeleton card placeholders while members data is loading
- **FR-003**: Forum categories page MUST show skeleton list items while categories are loading
- **FR-004**: Forum thread list page MUST show skeleton card placeholders while threads are loading
- **FR-005**: Search results page MUST show skeleton result placeholders while search is in progress
- **FR-006**: Events list page MUST show an empty state with "No projects yet" and a CTA to create one when no events exist
- **FR-007**: Members list page MUST show an empty state with "No members yet" and a CTA to add one when no members exist
- **FR-008**: Forum category page MUST show an empty state with "No discussions yet" and a CTA to start one when no threads exist
- **FR-009**: Thread detail page MUST show an empty state with "No replies yet" and a prompt to reply when no replies exist
- **FR-010**: Search results page MUST show an empty state with "No results found" and suggestions when no results match
- **FR-010b**: Forum categories page MUST show an empty state with "No categories yet" when no forum categories exist
- **FR-011**: Login form MUST include a "Remember me" checkbox below the password field
- **FR-012**: System MUST persist the session across browser restarts when "Remember me" is checked
- **FR-013**: Event detail page MUST show a "Join Event" button for users who have not RSVP'd; unauthenticated visitors MUST be redirected to login on click
- **FR-014**: Clicking "Join Event" MUST record the RSVP and change the button to "Going"
- **FR-015**: RSVP button MUST be hidden or disabled for past events
- **FR-016**: Login MUST show a success toast "Welcome back!" upon successful authentication
- **FR-017**: Registration MUST show a success toast "Account created successfully!" upon successful registration

### Key Entities

- **RSVP**: Tracks user attendance interest for an event — links user to event, tracks count per event
- **RememberMeSession**: Extended session token that persists beyond browser close — longer TTL than default session

## Success Criteria

### Measurable Outcomes

- **SC-001**: All 5 list pages (admin events, admin members, forum categories, forum threads, search results) display skeleton placeholders during data load
- **SC-002**: All 5 empty states display with appropriate messaging and call-to-action when no data is present
- **SC-003**: Login form includes "Remember me" checkbox; checking it persists session across browser restart; unchecking it does not
- **SC-004**: Event detail page shows "Join Event" button; clicking it changes state to "Going"; past events hide the button
- **SC-005**: Login and registration show success toasts upon successful authentication
- **SC-006**: No regressions in existing test suite
- **SC-007**: TypeScript type-check passes with zero errors
- **SC-008**: All new functionality has corresponding unit tests

## Assumptions

- Skeleton components already exist in the design system (shadcn/ui Skeleton) — no new UI primitives needed
- "Remember me" is implemented client-side by setting a longer cookie max-age or localStorage token; backend already supports session TTL differentiation
- RSVP requires a new API endpoint (`POST /events/:id/rsvp`) and may need backend changes — if backend is not ready, RSVP can be implemented optimistically with a local state toggle
- Existing error states (retry buttons, error messages) are already implemented per Batch 2
- Empty state illustrations use simple icons from lucide-react (same pattern as existing decorative icons)
- Success toasts use sonner (already in the project) — login/register will replace `window.location.reload()` with client-side `navigate("/")` so the toast is visible
- The remember_me flag is sent as a header or query param in the login request; the backend extends the session TTL accordingly
- FR-012 (session persistence across browser restart) is verified by backend integration tests, not frontend unit tests. Frontend tests cover checkbox rendering and localStorage flag only.
