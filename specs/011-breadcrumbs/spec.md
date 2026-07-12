# Feature Specification: Breadcrumb Navigation

**Feature Branch**: `011-breadcrumbs`

**Created**: 2026-07-05

**Status**: Draft

**Input**: User description: "Missing feature: No breadcrumbs — deep navigation (forum > category > thread > reply) has no breadcrumb trail"

## Clarifications

### Session 2026-07-11

- Q: How should dynamic breadcrumb labels be populated? → A: Per-page props approach — each page passes its breadcrumb trail as a prop to a shared `<Breadcrumbs trail={...} />` component.
- Q: What should breadcrumbs display when the API call for a dynamic label fails? → A: Show "Unknown" as fallback label (non-link, plain text).
- Q: Which pages should explicitly NOT show breadcrumbs beyond the home page? → A: All pages except home, login, and register.
- Q: What accessibility pattern should breadcrumbs use? → A: `<nav aria-label="Breadcrumbs">` wrapping the trail plus `aria-current="page"` on the last segment.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Users see breadcrumbs on deep pages (Priority: P1)

A user navigates deep into the site (e.g., Forum > Events Category > Thread Title). They see a breadcrumb trail at the top of the content area showing their path and can click any segment to navigate back to a parent page.

**Why this priority**: Breadcrumbs are essential for navigation in deeply nested content. The forum has 3 levels of nesting (forum > category > thread) without any navigation aid.

**Independent Test**: Navigate to a forum thread and verify breadcrumbs show "Home > Forum > Category Name > Thread Title" with clickable links.

**Acceptance Scenarios**:

1. **Given** a user is on a forum thread detail page, **When** the page loads, **Then** breadcrumbs show: "Home > Forum > [Category Name] > [Thread Title]"
2. **Given** a user is on a forum category/threads page, **When** the page loads, **Then** breadcrumbs show: "Home > Forum > [Category Name]"
3. **Given** a user is on an event detail page, **When** the page loads, **Then** breadcrumbs show: "Home > Events > [Event Title]"
4. **Given** a user is on the admin events list page, **When** the page loads, **Then** breadcrumbs show: "Home > Admin > Events"
5. **Given** a user is on the admin event edit page, **When** the page loads, **Then** breadcrumbs show: "Home > Admin > Events > Edit [Event Title]"

---

### User Story 2 — Breadcrumbs are clickable (Priority: P1)

A user can click on any segment of the breadcrumb trail to navigate directly to that page, without using the back button.

**Why this priority**: The primary value of breadcrumbs is navigation — each segment must be a clickable link.

**Independent Test**: Click on each breadcrumb segment and verify the correct page loads.

**Acceptance Scenarios**:

1. **Given** a user is on a thread detail page with breadcrumbs showing "Home > Forum > Category > Thread", **When** they click "Forum", **Then** they navigate to the forum page
2. **Given** a user is on a thread detail page, **When** they click "Category Name", **Then** they navigate to that category's thread list

---

### Edge Cases

- What happens on the home page? — Breadcrumbs are not shown (the user is already at the top)
- What happens on the login or register page? — Breadcrumbs are not shown (single-step auth pages)
- What happens when a breadcrumb segment label is very long? — Truncate with ellipsis at reasonable width
- What happens on the 404 page? — Breadcrumbs show "Home > Page Not Found" (last segment is not a link)
- What happens on pages with dynamic data that hasn't loaded yet? — Show skeleton breadcrumb placeholders until data loads
- What happens when the API call for a dynamic label fails? — Show "Unknown" as a non-link plain text segment

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A breadcrumb component MUST be displayed below the page header on all pages except the home page, login page, and register page
- **FR-002**: Each breadcrumb segment (except the last) MUST be a clickable link to its corresponding page
- **FR-003**: The last breadcrumb segment MUST represent the current page and MUST NOT be a link (plain text)
- **FR-004**: Breadcrumbs MUST use a "Home > Parent > Current" format with chevron separators or similar visual dividers
- **FR-005**: Forum thread detail page MUST show: Home > Forum > [Category Name] > [Thread Title]
- **FR-006**: Forum category page MUST show: Home > Forum > [Category Name]
- **FR-007**: Event detail page MUST show: Home > Events > [Event Title]
- **FR-008**: Admin pages MUST show: Home > Admin > [Section Name] > [optional sub-page]
- **FR-009**: Breadcrumbs MUST NOT appear on the home page
- **FR-010**: Dynamic labels (event title, thread title, category name) MUST update when data loads
- **FR-011**: Each page MUST pass its breadcrumb trail as a `trail` prop to the shared `<Breadcrumbs>` component — no global context or route config
- **FR-012**: The `Breadcrumbs` component MUST accept a `trail` prop typed as `Array<{ label: string; href?: string }>` where the last item has no `href`
- **FR-013**: The `Breadcrumbs` component MUST render inside a `<nav aria-label="Breadcrumbs">` landmark and apply `aria-current="page"` to the last segment

### Key Entities *(include if feature involves data)*

- **Breadcrumb**: A segment of the navigation trail with a label (string) and optional path (URL). The last segment has no path.
- **BreadcrumbTrail**: An ordered array of Breadcrumb segments representing the full navigation path.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Breadcrumbs appear on all non-home pages with correct hierarchy (verified by visual inspection on each route)
- **SC-002**: All breadcrumb links navigate to the correct page (verified by clicking each segment)
- **SC-003**: The current page segment is not clickable (verified by hover state or cursor style)
- **SC-004**: Dynamic breadcrumb labels update when API data loads (verified by testing with simulated network delay)
- **SC-005**: No regressions in existing test suite
- **SC-006**: TypeScript type-check passes with zero errors

## Assumptions

- Breadcrumbs are implemented as a reusable `Breadcrumbs` component placed in the shell layout or individual page components
- Breadcrumb data is derived from the current route and API data — no new backend endpoints needed
- The home page uses a special "no breadcrumbs" rule rather than showing "Home" (which would be a no-op link)
- The chevron separator (`>`) uses a lucide-react `ChevronRight` icon or similar
- Breadcrumbs render inside a `<nav aria-label="Breadcrumbs">` landmark with `aria-current="page"` on the last segment, following the WAI-ARIA Authoring Practices pattern
