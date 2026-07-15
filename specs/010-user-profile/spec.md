# Feature Specification: User Profile Page

**Feature Branch**: `010-user-profile`

**Created**: 2026-07-05

**Status**: Draft

**Input**: User description: "Missing feature: No user profile page — users can register but never view or edit their data"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — User views their profile (Priority: P1)

A logged-in user navigates to their profile page. They can see their account information (name, email, member since date, avatar). The profile page is accessible from the header navigation.

**Why this priority**: This is the most basic user-facing feature — users need a place to see their own account information.

**Independent Test**: Log in as a user, navigate to `/profile`, and verify that account information is displayed correctly.

**Acceptance Scenarios**:

1. **Given** a logged-in user, **When** they click on their name/avatar in the header, **Then** a link to "My Profile" appears in the dropdown
2. **Given** the user navigates to `/profile`, **When** the page loads, **Then** their name, email, and join date are displayed
3. **Given** the user has a member association, **When** the profile page loads, **Then** their member role and avatar are displayed
4. **Given** an unauthenticated visitor navigates to `/profile`, **When** the page loads, **Then** they are redirected to the login page

---

### User Story 2 — User edits their profile (Priority: P2)

A logged-in user can edit their profile information: update their name, email, and avatar image. Changes are saved and reflected immediately.

**Why this priority**: Enables users to keep their information up to date.

**Independent Test**: Log in, navigate to profile, click "Edit Profile", change the name, save, and verify the profile displays the updated name.

**Acceptance Scenarios**:

1. **Given** a user is on their profile page, **When** they click "Edit Profile", **Then** the fields become editable (name, email)
2. **Given** a user updates their name, **When** they click "Save Changes", **Then** the profile updates and a success toast appears: "Profile updated successfully"
3. **Given** a user cancels editing, **When** they click "Cancel", **Then** all fields revert to their original values
4. **Given** a user tries to save with invalid data, **When** validation fails, **Then** inline error messages are shown and the form is not submitted

---

### User Story 3 — User changes their password (Priority: P3)

A logged-in user can change their password from their profile page. They must provide their current password, a new password, and confirmation.

**Why this priority**: Important for account security but not a blocker for the profile page launch.

**Independent Test**: Log in, navigate to profile, change password, log out, and log in with the new password.

**Note**: After a password change, the current session remains active but all other sessions/tokens are invalidated.

**Acceptance Scenarios**:

1. **Given** a user is on their profile page, **When** they view the page, **Then** a "Change Password" section is visible
2. **Given** a user fills in current password, new password, and confirm password, **When** they click "Update Password", **Then** the password is changed and a success toast appears
3. **Given** a user enters an incorrect current password, **When** they try to update, **Then** an error "Current password is incorrect" is displayed
4. **Given** a user enters mismatched new passwords, **When** they try to update, **Then** an inline validation error is shown

---

### Edge Cases

- What does the loading state look like? — Skeleton loaders matching the profile layout (avatar circle + text lines)
- What happens when the profile data fails to load? — Show error state with retry option
- What happens when a user tries to use an email that's already taken? — Show validation error on the email field
- What happens when the avatar upload fails? — Show error toast, keep existing avatar
- What happens when a user deletes their avatar? — Show a default avatar placeholder

## Clarifications

### Session 2026-07-15

- Q: What UX pattern should avatar upload use? → A: Modal with file picker, preview, and confirm/cancel
- Q: What happens to the current session after a password change? → A: Current session remains valid; all other sessions are invalidated
- Q: Are all users members, and should admins see extra profile fields? → A: All users are members with a role; admins see additional admin-level information on their profile
- Q: What features are explicitly out of scope for this feature? → A: Profile deletion, notification preferences, two-factor authentication, social login linking, and account export are out of scope
- Q: What loading state pattern should the profile page use? → A: Skeleton loaders matching the profile layout

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The application MUST have a `/profile` route accessible only to authenticated users
- **FR-002**: Unauthenticated visitors navigating to `/profile` MUST be redirected to `/login`
- **FR-003**: The header MUST include a link to the profile page when the user is logged in (e.g., in a user menu dropdown)
- **FR-004**: The profile page MUST display the user's name, email, and join date
- **FR-005**: The profile page MUST display the user's member role and avatar (all users are members with a role; non-admin profiles show member info only)
- **FR-005a**: Admin users MUST see additional admin-level information on their profile (e.g., last login IP, account status badge)
- **FR-006**: The profile page MUST support editing the user's name and email
- **FR-007**: The profile page MUST support changing the user's avatar via a modal dialog with file picker, preview, and confirm/cancel controls (image upload with same validation as the image upload feature)
- **FR-008**: The profile MUST include a "Change Password" section with current password, new password, and confirm password fields
- **FR-009**: All form fields MUST validate before submission (required fields, email format, password strength and match)
- **FR-010**: Successful profile updates MUST show a success toast
- **FR-011**: Failed profile updates MUST show an error toast with the specific error message

### Out of Scope

The following features are explicitly out of scope for this feature:
- Profile deletion / account deactivation
- Notification preferences management
- Two-factor authentication setup
- Social login linking
- Account data export

### Key Entities *(include if feature involves data)*

- **UserProfile**: The user's personal information — name, email, avatar, join date, member association. Read from the authentication context and/or a dedicated profile API endpoint.
- **PasswordChange**: A request to update the user's password — includes current password, new password, and password confirmation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Authenticated users can view their profile at `/profile` with all account information displayed
- **SC-002**: Authenticated users can edit their name and email with changes persisting after page reload
- **SC-003**: Authenticated users can change their password and log in with the new password
- **SC-004**: Unauthenticated visitors are redirected to `/login` when accessing `/profile`
- **SC-005**: No regressions in existing test suite
- **SC-006**: TypeScript type-check passes with zero errors

## Assumptions

- The backend provides a `GET /api/user/profile` endpoint for reading profile data and `PUT /api/user/profile` for updating it
- The backend provides a `PUT /api/user/password` endpoint for password changes
- The authentication context already provides basic user info (id, name, email) — the profile page fetches the full profile via API
- Profile editing uses the existing form patterns (react-hook-form + Zod)
- Avatar upload reuses the same upload mechanism as the image upload feature (specs/005-image-upload)
- The header already has a user dropdown or menu that can be extended with a "My Profile" link
