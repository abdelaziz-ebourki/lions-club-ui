# Feature Specification: Notifications, Email Verification & Session Timeout

**Feature Branch**: `012-notifications-email-session`

**Created**: 2026-07-05

**Status**: Draft

**Input**: User description: "Missing features: No notification system, no email verification flow, no session timeout handling"

## Clarifications

### Session 2026-07-06

- Q: What mechanism should the frontend use to check for new notifications? → A: HTTP polling at a fixed 30-second interval
- Q: What is the session timeout inactivity window? → A: 30 minutes of inactivity
- Q: How long should the email verification link be valid? → A: 24 hours
- Q: What event types should generate notifications? → A: Forum replies, event updates, and admin announcements
- Q: Should verification email resends be rate-limited? → A: 60-second cooldown between resend requests

## User Scenarios & Testing *(mandatory)*

### User Story 1 — User receives notifications (Priority: P1)

A logged-in user sees a bell icon in the header with a badge showing the count of unread notifications. Opening the notification panel shows a list of recent notifications categorized by type (forum replies, event updates, admin announcements). Clicking a notification navigates to the relevant content.

**Why this priority**: Notifications are essential for user engagement and keeping users informed about activity relevant to them.

**Independent Test**: Log in, trigger a notification event, and verify the bell icon shows a badge with the notification count and the panel lists the notification.

**Acceptance Scenarios**:

1. **Given** a logged-in user, **When** they view the header, **Then** a bell icon with notification badge is visible
2. **Given** the user has unread notifications, **When** they view the bell icon, **Then** the badge shows the count of unread notifications
3. **Given** the user clicks the bell icon, **When** the panel opens, **Then** a list of recent notifications is displayed with title, description, and timestamp
4. **Given** a user clicks on a notification, **When** they click it, **Then** they are navigated to the relevant page (e.g., thread, event) and the notification is marked as read
5. **Given** the user has no unread notifications, **When** they open the panel, **Then** an empty state is shown: "No new notifications"

---

### User Story 2 — Email verification flow (Priority: P2)

A new user registers on the site. They receive an email verification message. Their account is marked as "unverified" until they click the verification link. The UI shows their verification status and allows resending the verification email.

**Why this priority**: Email verification is a security best practice that prevents spam accounts and ensures users have access to the email they registered with.

**Independent Test**: Register a new account, verify the UI shows "unverified" status, trigger a verification email resend, and verify the flow completes.

**Acceptance Scenarios**:

1. **Given** a user registers a new account, **When** registration completes, **Then** a toast appears: "Please check your email to verify your account"
2. **Given** a user has not verified their email, **When** they view their profile, **Then** a "Email not verified" banner is displayed with a "Resend verification email" button
3. **Given** a user clicks "Resend verification email", **When** the request succeeds, **Then** a toast appears: "Verification email sent"
4. **Given** a user clicks the verification link in their email, **When** they land on the verification page, **Then** a success message is shown: "Email verified successfully" and their profile status updates to "verified"
5. **Given** a user tries to access admin features with an unverified email, **When** they try, **Then** they are prompted to verify their email first

---

### User Story 3 — Session timeout handling (Priority: P3)

A logged-in user's session expires after 30 minutes of inactivity (or immediate token expiry). On their next action, they are gracefully logged out with a message explaining why, and redirected to the login page.

**Why this priority**: Session timeout handling prevents users from seeing broken pages or silent errors when their session expires.

**Independent Test**: Wait for session to expire (or simulate expiry), perform an action, and verify the user is redirected to login with a "Session expired" message.

**Acceptance Scenarios**:

1. **Given** a user's session has expired, **When** they make any API request, **Then** they receive a 401 response and are redirected to the login page
2. **Given** a user is redirected due to session expiry, **When** they land on the login page, **Then** a toast appears: "Your session has expired. Please log in again."
3. **Given** a user with an expired session is on a page, **When** they click a link or button that requires authentication, **Then** they are redirected to login with the return URL preserved
4. **Given** a user is logged out due to session expiry, **When** they log in again, **Then** they are redirected to the page they were on before the timeout

---

### Edge Cases

- What happens when the notification API endpoint fails? — Bell icon shows without badge, no error state needed
- What happens when verification email delivery fails? — Show error toast: "Failed to send verification email. Please try again."
- What happens when a user clicks "Resend" before the 60-second cooldown expires? — Button is disabled with a countdown: "Resend available in Xs"
- What happens when a user clicks an expired verification link (after 24 hours)? — Show "Verification link expired" with option to resend
- What happens when a session expires during a form submission? — Show a toast that the data was lost; form save/restore is out of scope for this feature
- What about the admin session timeout? — Same behavior as regular user sessions
- What happens when the notification API is rate-limited (429)? — Same as any API failure: bell shows without badge
- What happens when a user has 100+ unread notifications? — Badge displays "99+"
- What happens on the return URL if the login page itself causes a 401? — Redirect guard prevents redirect if already on /login
- What happens with the resend cooldown after a page navigation? — Cooldown is in-memory (component state); full page reload resets it
- What happens when the verification email never arrives? — User can use the resend button on profile; after multiple failed attempts, contact support (no automated escalation in scope)
- What happens when email verification and session timeout occur simultaneously? — `auth:expired` takes precedence; user re-authenticates and verification state is refreshed on next profile visit
- What happens when a user registers with an already-taken email? — Server returns validation error; existing error handling in register form applies (no additional frontend handling needed)
- What happens with multiple browser tabs open during session timeout? — All tabs receive the `auth:expired` event and redirect; this is acceptable behavior
- What happens if backend assumptions (endpoint shapes, response formats) are incorrect? — Update MSW mocks to match actual contracts and adjust UI code; all assumptions are documented in contracts/ for reference

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The header MUST include a notification bell icon with a badge showing the count of unread notifications for authenticated users; if unread count exceeds 99, the badge MUST display "99+"
- **FR-002**: Clicking the bell icon MUST open a notification panel listing recent notifications in a scrollable list (title, description, relative timestamp using Intl.RelativeTimeFormat, e.g. "2m ago", "1h ago", "3d ago"); the list shows the most recent 50 notifications with simple vertical scroll (no pagination or infinite scroll)
- **FR-003**: Clicking a notification MUST navigate to the relevant page and mark the notification as read
- **FR-004**: Unauthenticated users MUST NOT see the notification bell
- **FR-005**: The frontend MUST poll for new notifications via HTTP GET at a fixed 30-second interval while the user is authenticated and the page is visible
- **FR-006**: Polling MUST pause when the browser tab is hidden (Page Visibility API) to conserve resources
- **FR-007**: An empty notification panel MUST show "No new notifications" with a lucide `BellOff` icon
- **FR-008**: Registration MUST display a toast: "Please check your email to verify your account"
- **FR-009**: The profile page MUST show the user's email verification status
- **FR-010**: An unverified user MUST be able to request a verification email resend from their profile
- **FR-011**: The verification link page at `/verify-email?token=<uuid>` MUST show one of the following states:
  - Success: "Email verified successfully" with a check icon and "Continue to profile" link
  - Expired: "Verification link expired" with a "Resend verification email" button
  - Invalid: "Invalid verification token" with a "Request new link" button
  - Already verified: "Email already verified" with a "Go to profile" link
- **FR-012**: Admin features MUST prompt for email verification if the admin's email is unverified
- **FR-013**: Verification email resend MUST enforce a 60-second cooldown — the button is disabled with a countdown showing "Resend available in Xs" during this period
- **FR-014**: A 401 API response MUST trigger a logout and redirect to the login page (unless already on /login — prevents redirect loops)
- **FR-015**: Session MUST expire after 30 minutes of user inactivity (no API requests made — server-enforced; client-side typing or navigation does not reset the timer, only HTTP requests do). **Frontend scope**: purely reactive — the client handles the resulting 401 via FR-014/FR-018; no client-side inactivity timer is built.
- **FR-016**: Session expiry redirect MUST show a toast: "Your session has expired. Please log in again."
- **FR-017**: Session expiry redirect MUST preserve the return URL so the user is redirected back after login
- **FR-018**: API client MUST handle 401 responses globally (in the request wrapper) rather than per-page

### Key Entities *(include if feature involves data)*

- **Notification**: A message for a user with three types: `forum_reply` (someone replied to your thread), `event_update` (event date/location change, new event), or `admin_announcement` (system-wide message from admin). Each notification has id, type, title, description, target URL, read status, and timestamp.
- **EmailVerification**: A token-sent-to-email flow with states: unverified, pending, verified, expired.
- **UserSession**: The user's authentication session with an expiry time. When expired, all API requests return 401.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Authenticated users see a notification bell with unread count reflecting the latest polled response (accurate within the 30s polling window; verified by creating a notification via MSW and checking the badge updates on the next poll cycle)
- **SC-002**: Users can view and interact with notifications from the header panel
- **SC-003**: New users see the email verification prompt on registration
- **SC-004**: Users can request a verification email resend from their profile and see a success confirmation (scoped to API call success, not email delivery — delivery confirmation is backend responsibility)
- **SC-005**: Expired sessions redirect to login with a clear message and return URL preservation
- **SC-006**: No regressions in existing test suite
- **SC-007**: TypeScript type-check passes with zero errors

## Assumptions

- The backend provides a notifications API (`GET /api/notifications`, `PUT /api/notifications/:id/read`) — polling is used instead of WebSocket/SSE
- The 30-second polling interval is acceptable for the expected notification volume; no real-time delivery required
- The backend sends verification emails and provides the verification/status endpoints
- The backend returns 401 for expired sessions consistently across all endpoints
- The notification panel uses the existing `Sheet` component from the design system (slide-out panel)
- Email verification status is available from the profile API endpoint
- Session timeout detection is done globally in the API client wrapper — intercepting 401 responses
- The return URL for post-login redirect uses the existing `?return=` query parameter pattern
