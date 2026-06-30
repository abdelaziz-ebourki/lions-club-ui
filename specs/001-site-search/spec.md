# Feature Specification: Site-Wide Search

**Feature Branch**: `001-site-search`

**Created**: 2026-06-30

**Status**: Draft

**Input**: User description: "Add search functionality across events, forum threads, members, and messages"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Global Search (Priority: P1)

A visitor or member can search the site from any page using a search bar in the
header. Typing a query and pressing Enter navigates them to a search results
page showing matching content.

**Why this priority**: Search is the primary entry point for finding content.
Without it, users must browse manually through every page.

**Independent Test**: Can be fully tested by typing a query in the search bar,
submitting it, and verifying the results page loads with relevant matches.

**Acceptance Scenarios**:

1. **Given** the user is on any page of the site, **When** they type a query in
   the header search bar and press Enter, **Then** they are navigated to
   `/search?q=query` with results displayed.
2. **Given** the search bar is empty, **When** the user presses Enter,
   **Then** they are navigated to `/search` showing an empty state with a
   prompt to type a query.
3. **Given** the search bar has input focus, **When** the user presses Escape,
   **Then** the input is cleared and focus is removed.

---

### User Story 2 - Search Results Page (Priority: P1)

Users see search results grouped by entity type (Events, Forum Threads,
Members, Contact Messages) with enough context to identify relevant matches.
Each result links to the corresponding detail page. Admin-only results
(Members, Messages) only appear for authenticated admin users.

**Why this priority**: Showing results in a useful way is as important as
finding them. Grouped results help users scan efficiently.

**Independent Test**: Can be fully tested by searching for a known term that
exists in event titles and forum thread titles, then verifying both appear in
their respective groups.

**Acceptance Scenarios**:

1. **Given** a user searches for a term, **When** results are displayed,
   **Then** matches are grouped by entity type (Events, Forum Threads,
   Members, Contact Messages) with section headings.
2. **Given** no results match the query, **When** the results page loads,
   **Then** a "No results found" message is shown with suggestions to try
   different keywords.
3. **Given** a result is shown, **When** the user clicks on it, **Then** they
   are navigated to the detail page for that entity.
4. **Given** results exist across multiple entity types, **When** the results
   page loads, **Then** each group shows its name and result count.
5. **Given** a non-admin user searches, **When** results are displayed,
   **Then** Members and Contact Messages sections are omitted (only Events
   and Forum Threads shown).
6. **Given** an admin user searches, **When** results are displayed,
   **Then** all four entity types (Events, Forum Threads, Members, Contact
   Messages) appear with results.

---

### User Story 3 - Search Within Forum (Priority: P2)

On the forum pages, users can filter threads by keyword, category, or status
without leaving the forum section.

**Why this priority**: Forum content grows quickly. In-page filtering helps
users find discussions without a full site search.

**Independent Test**: Can be fully tested by navigating to a forum category,
applying a filter, and verifying only matching threads appear.

**Acceptance Scenarios**:

1. **Given** a user is on the forum page, **When** they type in the in-page
   search input, **Then** thread results filter in real-time.
2. **Given** a forum category is selected, **When** the user applies a status
   filter, **Then** only threads matching both the category and status are
   shown.

---

### Edge Cases

- **No results**: Empty state with friendly message and suggestions.
- **Network error**: Results page shows error state with retry option.
- **Special characters**: Search handles HTML entities, regex characters, and
  punctuation gracefully (treated as literal text).
- **Very long queries**: Input caps at 200 characters with a character counter
  or silent truncation.
- **Rapid successive searches**: Debounce input to avoid excessive requests.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a search bar in the site header, accessible
  from every page.
- **FR-002**: System MUST navigate to a search results page at `/search` when
  the user submits a query.
- **FR-003**: System MUST return matches from Events, Forum Threads, Members,
  and Contact Messages.
- **FR-004**: Results MUST be grouped by entity type with clear section
  headings and result counts.
- **FR-005**: Each result MUST display: title, a snippet of matching content,
  entity type label, and a link to the full entity.
- **FR-006**: System MUST return exact-match results first, then
  partial/keyword matches.
- **FR-007**: Empty queries MUST show a prompt to enter a search term, not
  an error.
- **FR-008**: Forum pages MUST provide an in-page filter input for
  real-time thread filtering by keyword.
- **FR-009**: Forum filter MUST support additional criteria: category filter
  and status filter (active, pinned, locked, archived).
- **FR-010**: Search input MUST truncate or reject queries longer than 200
  characters.
- **FR-011**: System MUST handle special characters in queries as literal
  text (no regex interpretation).
- **FR-012**: System MUST restrict Members and Contact Messages results to
  authenticated admin users only. Non-admin users MUST NOT see these results
  in search.

### Key Entities *(include if feature involves data)*

- **SearchQuery**: The user's search string, with metadata (length,
  sanitized flag).
- **SearchResult**: A polymorphic result referencing the source entity
  (Event, ForumThread, Member, or ContactMessage), with matched snippet,
  relevance score, and entity type discriminator.
- **SearchResultGroup**: A named collection of SearchResults for the same
  entity type (e.g., "Events (3)", "Forum Threads (7)").

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can submit a search query and see results in under
  2 seconds on a standard connection.
- **SC-002**: At least 90% of search queries return relevant results
  (measured by click-through on results).
- **SC-003**: Users can find an event or forum thread within 3 clicks of
  landing on the site.
- **SC-004**: The in-page forum filter updates visible results within
  500ms of user input (debounced).

## Assumptions

- Search will initially be implemented client-side against existing API
  endpoints (GET /api/events, GET /api/forum/threads), with server-side
  search as a future enhancement.
- The search bar will be added to the existing header component in
  `@/components/layout/header.tsx`.
- The search results page will be a new route at `/search`.
- Events and Forum Threads are searchable by all visitors (no
  authentication required).
- Members and Contact Messages are searchable only by authenticated admin
  users. Non-admin users will not see these sections in results.
- Authentication state is already available via AuthContext.
