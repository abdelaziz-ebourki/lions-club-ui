# Feature Specification: Gallery & Media Library

**Feature Branch**: `015-gallery-media-library`

**Created**: 2026-08-25

**Status**: Draft

**Input**: User description: "we shall tackle the gallery issue, issue #45" — feat: Gallery/Media library (public + admin CRUD)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitors browse the photo gallery (Priority: P1) 🎯 MVP

A visitor or member opens `/gallery` to see photos from club events, projects, and activities. They see a responsive grid of photo cards, can filter by category or by linked event, and find clear loading, empty, and error states.

**Why this priority**: The public read path is the core purpose of the gallery — showcasing club life. Without it, uploaded photos have no audience.

**Independent Test**: Navigate to `/gallery` with seeded photos. Verify the grid renders thumbnails, titles, and category badges; filter by category and verify only matching items remain; verify loading skeletons and the empty state when no items exist.

**Acceptance Scenarios**:

1. **Given** the site has gallery items, **When** a visitor navigates to `/gallery`, **Then** they see a responsive grid of photo cards sorted by upload date (most recent first), each showing its thumbnail, title, and category badge
2. **Given** a visitor on the gallery page, **When** they select a category filter (e.g., "Event"), **Then** only items of that category are displayed
3. **Given** a visitor on the gallery page, **When** they select an event filter, **Then** only items linked to that event are displayed; clearing filters restores the full set
4. **Given** a visitor navigates to `/gallery`, **When** the page is loading, **Then** skeleton placeholders are shown for the grid cards
5. **Given** no gallery items exist (or none match the active filter), **When** a visitor views `/gallery`, **Then** an empty state is displayed with a helpful message and no error
6. **Given** a visitor on `/gallery`, **When** a network error occurs, **Then** an error state with a retry action is displayed

---

### User Story 2 - Admin uploads and manages gallery media (Priority: P1)

An authenticated admin opens `/admin/gallery` to manage the club's photo collection. They see all items in a responsive table/card list, upload new photos through a drag-and-drop zone with preview and progress feedback, edit an item's metadata (title, description, category, event link, tags), and delete items they no longer need.

**Why this priority**: Content must be uploaded and curated before visitors can see anything. Admin CRUD is the authoring side of the same coin as the public view.

**Independent Test**: Log in as admin, open `/admin/gallery`, upload a new image with valid metadata and verify it appears in the list; edit its title and verify the change is saved; delete it through the confirmation dialog and verify removal.

**Acceptance Scenarios**:

1. **Given** an authenticated admin on `/admin/gallery`, **When** the page loads, **Then** they see a responsive table (desktop) or card list (mobile) of all items with thumbnail, title, category, event (if linked), tags, upload date, and uploader, plus edit/delete actions per row
2. **Given** an admin clicks the upload/new action, **When** they drag-and-drop (or browse to select) a valid image file, **Then** a preview is shown and an upload progress indicator runs until the upload completes
3. **Given** an admin selects an invalid file (wrong type or over the size limit), **When** they attempt to upload, **Then** inline validation errors are shown and nothing is uploaded
4. **Given** an admin fills out the metadata form (title required, category required from the five predefined values, optional description/event/tags), **When** they submit with valid data, **Then** the item is created and appears in the list with a success toast
5. **Given** an admin submits the form with missing required fields, **When** validation runs, **Then** inline error messages are shown and the item is not saved
6. **Given** an admin clicks "Edit" on an item, **When** the form opens, **Then** it is pre-filled with the item's current metadata, and submitting changes updates the item with a success toast
7. **Given** an admin clicks "Delete" on an item, **When** they confirm in the confirmation dialog, **Then** the item is permanently removed with a success toast
8. **Given** an admin clicks "Delete", **When** they cancel the confirmation dialog, **Then** the item remains untouched

---

### User Story 3 - Immersive lightbox viewing (Priority: P2)

From the grid, a visitor opens any photo to view it enlarged together with its metadata (title, description, category, tags, upload date). They can move forward and backward through the currently filtered set without leaving the viewer — with keyboard arrows on desktop and swipe gestures on mobile — and close it at any time.

**Why this priority**: The lightbox turns a static grid into an engaging browsing experience, but the grid alone already delivers core value; this enhances it.

**Independent Test**: Open `/gallery`, click a photo, verify the enlarged view with metadata renders; press arrow keys to navigate between photos, press Escape to close; repeat swipe gestures on a mobile viewport.

**Acceptance Scenarios**:

1. **Given** a visitor viewing the gallery, **When** they click a photo, **Then** a lightbox/modal viewer opens showing the enlarged image with title, description, category badge, tags, and upload date
2. **Given** the lightbox is open, **When** the visitor presses the left/right arrow keys or swipes left/right, **Then** the previous/next photo in the currently filtered set is shown, wrapping at the ends
3. **Given** the lightbox is open, **When** the visitor presses Escape or clicks the close control, **Then** the lightbox closes and returns them to the grid at the same scroll position
4. **Given** a keyboard user tabbing through the page, **When** the lightbox opens, **Then** focus moves into the dialog and is trapped within it while open, returning to the triggering card on close

---

### Edge Cases

- What happens when a visitor opens `/gallery/:id` (or a deep-linked photo) that does not exist? — A 404-style error state is shown with a link back to the gallery
- What happens when an uploaded file exceeds the size limit or has an unsupported type? — Inline validation rejects it before upload; no partial/orphaned item is created
- What happens when the gallery grows beyond 10–20 items? — The public grid paginates (default 12 per page) so pages stay fast, and the admin list shows all items in a scrollable table
- What happens when an item has no generated thumbnail? — The full image is used as a fallback in the grid card
- What happens when an admin links an item to an event that is later deleted? — The item keeps rendering; the event filter simply no longer matches it (event reference cleared)
- What happens when duplicate titles are entered? — Allowed; items are distinguished by their images and identifiers (titles are not unique)
- What happens when the admin session expires mid-upload? — The submission fails with an auth error and the admin is redirected to login; no partially-uploaded item remains visible
- What happens when a tag contains extra whitespace or duplicates? — Tags are trimmed and de-duplicated before saving

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Public `/gallery` MUST display a responsive grid of gallery items sorted by upload date descending
- **FR-002**: Each gallery card MUST show a thumbnail (with the full image as fallback when no thumbnail exists), the item title, and a category badge
- **FR-003**: The gallery MUST support filtering by category (single-select from the five predefined values) and by linked event; filters MUST be clearable
- **FR-004**: The gallery grid MUST show skeleton loading states while data is being fetched
- **FR-005**: The gallery MUST show an empty state when no items exist or when no items match the active filters
- **FR-006**: The gallery MUST show a descriptive error state with a retry action on network failure
- **FR-007**: Clicking a gallery card MUST open a lightbox/modal viewer displaying the enlarged image plus title, description, category, tags, and upload date
- **FR-008**: The lightbox MUST support navigation (previous/next) through the currently filtered set, wrapping at both ends
- **FR-009**: The lightbox MUST close via the Escape key and a visible close control, returning focus to the originating card
- **FR-010**: Lightbox navigation MUST be operable by keyboard (arrow keys) on desktop and by horizontal swipe on touch devices
- **FR-011**: Opening the lightbox MUST move keyboard focus inside it and trap focus while open (accessibility)
- **FR-012**: Admin `/admin/gallery` MUST display all items in a responsive table (desktop) / card layout (mobile) with thumbnail, title, category, linked event (if any), tags, upload date, and uploader, including per-row edit/delete actions
- **FR-013**: Admin MUST have an upload action providing drag-and-drop plus file-browse selection, an image preview before submission, and visible upload progress
- **FR-014**: Uploads MUST validate file type (PNG/JPEG/WebP only) and maximum size (5 MB) client-side, showing inline errors on violation
- **FR-015**: Admin create/edit form MUST include: title (required), description (optional), category (required, single-select from "Event", "Project", "Team", "Community", "Partner"), event link (optional single-select from existing events), and tags (free-form, trimmed and de-duplicated)
- **FR-016**: Admin create/edit form MUST validate required fields and show inline error messages on invalid submission
- **FR-017**: Admin delete action MUST show a confirmation dialog before permanently removing the item
- **FR-018**: All admin CRUD operations MUST show success/failure toast notifications
- **FR-019**: Only authenticated admins MUST be able to reach `/admin/gallery`; unauthenticated users are redirected to login
- **FR-020**: Thumbnails SHOULD be provided automatically (generated server-side or by the upload pipeline); the system MUST function correctly when none exists

### Key Entities *(include if feature involves data)*

- **Gallery Item**: A single photo in the library. Contains a unique identifier, title, optional description, full-size image URL, optional thumbnail URL, one category from five predefined values ("Event", "Project", "Team", "Community", "Partner"), an optional reference to the related event, a set of free-form tags, the upload timestamp, and a reference to the uploading admin user.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can browse the photo gallery at `/gallery`, filter it by category or event, and view photos in a lightbox — all without authentication
- **SC-002**: An admin can upload a photo with metadata, edit it, and delete it through `/admin/gallery` with validation, confirmation dialogs, and toast notifications
- **SC-003**: All states are covered: loading (skeletons), empty (no items / no filter matches), error (network failure with retry), and edge cases (invalid slug, oversized/invalid uploads, expired session)
- **SC-004**: Filtering to a category or event visibly narrows results within one interaction, and clearing filters restores the complete set
- **SC-005**: The lightbox is fully operable without a mouse: arrow keys navigate, Escape closes, focus is managed per accessibility requirements
- **SC-006**: The codebase passes all automated quality gates with zero errors (type-checking, linting), with tests covering every page and hook

## Assumptions

- Scope is photos/images only for v1 — video and other media types are out of scope
- Five fixed categories as listed in the issue ("Event", "Project", "Team", "Community", "Partner"); no admin-managed category taxonomy in v1
- The existing image upload infrastructure (from the avatar/image-upload feature) is reused for storage; thumbnails may be produced by the backend/upload pipeline — if absent, the full image serves as fallback
- Backend endpoints assumed per the issue: list/create `GET/POST /gallery`, read/update/delete `GET/PATCH/DELETE /gallery/:id`, upload `POST /gallery/upload`
- Event linking uses the existing events system; deleting an event clears (does not delete) linked gallery references
- Public grid paginates at 12 items per page; admin list shows all items
- SEO meta tags follow the site-wide approach already established for detail pages
