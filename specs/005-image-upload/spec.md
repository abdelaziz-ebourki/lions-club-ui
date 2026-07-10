# Feature Specification: Image Upload

**Feature Branch**: `005-image-upload`

**Created**: 2026-07-05

**Status**: Draft

**Input**: User description: "Image upload on event/member forms — Event.image and Member.avatar fields exist in type definitions but forms have no file upload field"

## Clarifications

### Session 2026-07-09

- Q: How should the frontend send the image to the backend? → A: Single multipart request — all text fields + file in one POST/PUT with multipart/form-data
- Q: "member list" in SC-002 — About page member cards or admin table? → A: About page only (admin table excluded)
- Q: 10MB edge case conflicts with 5MB FR-004 limit — which is correct? → A: 5MB is the correct limit; >10MB edge case updated to reference 5MB
- Q: Are accessibility requirements needed for the file upload component? → A: Yes — keyboard navigation, ARIA labels, alt text, remove button labeling (added as FR-014 through FR-017)

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Admin uploads event image (Priority: P1)

An admin creating or editing an event sees a file upload field for the event image. They can select an image file from their device, see a preview, and submit the form. The image is attached to the event and displayed on the event detail page and events list.

**Why this priority**: Event images are the primary visual content on the site. Without them, events look incomplete and unappealing.

**Independent Test**: Can be tested by navigating to the event form, selecting an image file, submitting the form, and verifying the image appears on the event detail page.

**Acceptance Scenarios**:

1. **Given** an admin is on the event creation form, **When** they view the form fields, **Then** a file upload area is visible for event image
2. **Given** an admin selects a valid image file (PNG, JPG, WebP), **When** the file is chosen, **Then** a preview thumbnail of the selected image is displayed
3. **Given** an admin has selected an image, **When** they submit the form, **Then** the image is uploaded and the event is saved with the image reference
4. **Given** the event detail page loads, **When** the event has an image, **Then** the image is displayed prominently on the page

---

### User Story 2 — Admin uploads member avatar (Priority: P1)

An admin creating or editing a member sees a file upload field for the member avatar. They can select an image file, see a preview, and submit. The avatar is displayed on the member card and member list.

**Why this priority**: Member avatars give the organization a human face. Currently all members render without avatars.

**Independent Test**: Can be tested by navigating to the member form, selecting an avatar image, submitting, and verifying the avatar appears on the member list.

**Acceptance Scenarios**:

1. **Given** an admin is on the member creation form, **When** they view the form fields, **Then** a file upload area is visible for member avatar
2. **Given** an admin selects a valid image file, **When** the file is chosen, **Then** a circular preview thumbnail of the selected image is displayed
3. **Given** an admin submits the form with an avatar, **When** the member is saved, **Then** the avatar is uploaded and attached to the member

---

### User Story 3 — Image validation and error handling (Priority: P2)

An admin attempts to upload an unsupported file type or a file that exceeds the size limit. The form shows a clear validation error before submission and prevents the upload.

**Why this priority**: Prevents server errors and provides clear user feedback.

**Independent Test**: Can be tested by selecting a non-image file (e.g., PDF, .txt) and verifying an error message appears.

**Acceptance Scenarios**:

1. **Given** an admin selects a file that is not an image (e.g., PDF, .txt), **When** the file is selected, **Then** an error message "Please select a valid image file (PNG, JPG, WebP)" is displayed
2. **Given** an admin selects an image file larger than 5MB, **When** the file is selected, **Then** an error message "File size must be under 5MB" is displayed
3. **Given** an admin has a validation error on the file field, **When** they try to submit the form, **Then** submission is prevented and the error is highlighted

---

### Edge Cases

- What happens when the file upload fails during form submission? — Show error toast with retry option, preserve the selected file in the form
- What happens when an admin edits an existing event/member without changing the image? — Existing image is preserved, no re-upload needed
- What happens when an admin wants to remove the current image? — Provide a "Remove image" button that clears the image field
- What happens with images exceeding the 5MB limit? — Client-side size validation shows error "File size must be under 5MB" and prevents selection
- What happens when network is slow? — Upload progress indicator or spinner shown on the upload field

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Event form MUST include a file upload field for the event image, positioned after the description field
- **FR-002**: Member form MUST include a file upload field for the member avatar, positioned after the bio field
- **FR-003**: File upload field MUST accept only image types: PNG, JPG, and WebP
- **FR-004**: File upload field MUST validate file size client-side with a 5MB maximum
- **FR-005**: File upload field MUST show a preview thumbnail of the selected image before submission
- **FR-006**: Member avatar preview MUST be displayed as a circular thumbnail (matching the avatar display style)
- **FR-007**: On edit forms, the current image/avatar MUST be displayed as a preview with the upload option
- **FR-008**: A "Remove image" button MUST be provided when a current image/avatar exists, allowing the admin to clear it. Clicking remove replaces the preview with the empty upload zone, enabling selection of a new file
- **FR-009**: Invalid file type MUST show an inline validation error: "Please select a valid image file (PNG, JPG, WebP)"
- **FR-010**: Oversized file MUST show an inline validation error: "File size must be under 5MB"
- **FR-011**: Form submission MUST be blocked when file validation fails
- **FR-012**: Image upload MUST show a loading indicator during the upload process
- **FR-013**: On upload failure, the form MUST show an error toast and preserve the selected file
- **FR-014**: File upload field MUST be keyboard-accessible (Enter/Space to activate, Tab to navigate between upload zone and remove button)
- **FR-015**: File upload field MUST have an accessible label and ARIA attributes (aria-label, aria-invalid) for screen reader compatibility
- **FR-016**: Preview image MUST have an alt attribute describing the content
- **FR-017**: Remove image button MUST have an aria-label describing its action

### Key Entities *(include if feature involves data)*

- **EventImage**: A file attachment associated with an Event entity. Displayed as a hero image on the event detail page and as a card image on the events list.
- **MemberAvatar**: A file attachment associated with a Member entity. Displayed as a circular avatar on member cards and the member list.
- **UploadedFile**: A temporary reference to a file selected by the user but not yet submitted. Includes client-side metadata (name, size, type, preview URL).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admin can upload an event image and see it rendered on the event detail page within 3 clicks of opening the event form
- **SC-002**: Admin can upload a member avatar and see it rendered on the About page member cards within 3 clicks of opening the member form
- **SC-003**: Invalid file types and oversized files show inline validation errors within 1 second of file selection
- **SC-004**: All existing form tests continue to pass with no regressions
- **SC-005**: TypeScript type-check passes with zero errors

## Assumptions

- The backend supports `multipart/form-data` file uploads for event images and member avatars
- Image and entity data are sent in a **single multipart request** (all text fields + file in one POST/PUT), not a two-step upload-then-reference pattern
- The existing API client (`@/lib/api.ts`) will be extended to support file uploads (removing `Content-Type: application/json` header when uploading files)
- Image preview uses the browser's `URL.createObjectURL()` for client-side preview — no server round-trip needed for preview
- File size and type validation are implemented client-side only (server-side validation is assumed on the backend)
- The upload field uses a drag-and-drop zone styled consistently with the existing form design system
- The `Event.image` and `Member.avatar` type fields already exist — frontend just needs to populate them
