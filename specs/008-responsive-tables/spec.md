# Feature Specification: Responsive Tables

**Feature Branch**: `008-responsive-tables`

**Created**: 2026-07-05

**Status**: Draft

**Input**: User description: "Responsive: Hidden columns on mobile for admin tables and forum"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Mobile users see all table data (Priority: P1)

A visitor or admin browses the site on a mobile phone. Instead of seeing tables with hidden columns, they see all the relevant information in a stacked/card layout that is readable on a small screen.

**Why this priority**: Currently 6 tables hide columns on mobile using `hidden sm:block` / `hidden md:table-cell`. Users on mobile cannot access that data without rotating their device or switching to desktop.

**Independent Test**: Open the app in a mobile viewport (375px width) and verify all table data is visible in a stacked/card layout, not hidden.

**Acceptance Scenarios**:

1. **Given** a user on a mobile device views the forum categories page, **When** the page renders, **Then** thread and post counts are visible (not hidden by `hidden sm:block`)
2. **Given** a user on a mobile device views a thread list, **When** the page renders, **Then** the last activity date is visible (not hidden by `hidden sm:block`)
3. **Given** an admin on a mobile device views the events management page, **When** the page renders, **Then** the date and category columns are visible (not hidden by `hidden md:table-cell`)
4. **Given** an admin on a mobile device views the members management page, **When** the page renders, **Then** the role column is visible (not hidden by `hidden md:table-cell`)
5. **Given** an admin on a mobile device views the messages page, **When** the page renders, **Then** the email and date columns are visible (not hidden by `hidden sm:block`)

---

### User Story 2 — Data is displayed in a card layout on small screens (Priority: P2)

Instead of simply unhiding columns on mobile (which would make tables too wide), the data is reorganized into a stacked card layout where each row becomes a card with labels and values.

**Why this priority**: A stacked layout is more readable on mobile than a wide table with tiny columns. This is the recommended responsive pattern per the issue description.

**Independent Test**: Resize the browser to mobile width and verify the layout switches from a table to a card-based layout with all data visible.

**Acceptance Scenarios**:

1. **Given** a mobile viewport, **When** the forum categories page renders, **Then** each category is displayed as a card with name, description, thread count, and post count — all visible
2. **Given** a mobile viewport, **When** a thread list renders, **Then** each thread is displayed as a card with title, author, reply count, and last activity date — all visible
3. **Given** a mobile viewport, **When** the admin events table renders, **Then** each event is displayed as a card with title, date, category, and status — all visible
4. **Given** a mobile viewport, **When** the admin members table renders, **Then** each member is displayed as a card with name, role, and join date — all visible
5. **Given** a mobile viewport, **When** the admin messages table renders, **Then** each message is displayed as a card with name, email, subject, and date — all visible

---

### Edge Cases

- What happens at tablet viewports (768px)? — The table layout should remain for tablets, card layout only for phones (<640px)
- What happens with very long text in card layout? — Text truncation with ellipsis on card details, full text accessible on detail page
- What happens when a table has many columns (like admin messages)? — All columns should be represented in the card layout

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Forum categories page MUST show thread counts and post counts on mobile devices (replace `hidden sm:block` with responsive card layout)
- **FR-002**: Forum thread list page MUST show last activity date on mobile devices
- **FR-003**: Admin events page MUST show event date and category on mobile devices
- **FR-004**: Admin members page MUST show member role on mobile devices
- **FR-005**: Admin messages page MUST show sender email and message date on mobile devices
- **FR-006**: On viewports below 640px, tabular data MUST be displayed in a stacked card layout instead of a horizontal table
- **FR-007**: Card layout MUST display all data fields that are present in the table, with visible labels for each field
- **FR-008**: The table layout MUST remain unchanged on desktop viewports (≥640px for sm breakpoint, ≥768px for md breakpoint)

### Key Entities *(include if feature involves data)*

- N/A — This feature is purely presentational. No new data entities.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 5 table views (forum categories, forum threads, admin events, admin members, admin messages) show complete data on a 375px-wide viewport
- **SC-002**: All 5 table views maintain their existing table layout on viewports ≥768px
- **SC-003**: No data is hidden on any viewport size — every field visible on desktop is also accessible on mobile
- **SC-004**: No regressions in existing test suite
- **SC-005**: TypeScript type-check passes with zero errors

## Assumptions

- The responsive card layout is implemented using Tailwind's responsive utilities — no JavaScript-based breakpoint detection needed
- Each table already has a well-defined set of columns/fields — the card layout maps directly from the existing row data
- The admin pages use `<table>` elements that can be converted to a card layout using Tailwind's `block sm:table` pattern or conditionally rendered card components
- Cards use the existing `<Card>` component from the design system for visual consistency
- The breakpoint for switching from table to card layout is 640px (Tailwind's `sm` breakpoint) for consistency with existing patterns
