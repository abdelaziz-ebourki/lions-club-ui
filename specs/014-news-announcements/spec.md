# Feature Specification: News & Announcements System

**Feature Branch**: `014-news-announcements`

**Created**: 2026-07-17

**Status**: Draft

**Input**: User description: "gh issue 44 shall be handled" (feat: News/Announcements system with public + admin CRUD)

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Visitors browse published news articles (Priority: P1)

A visitor or member visits the `/news` page to read club updates, announcements, event recaps, and press releases. They see a list of published articles sorted by date, can click through to read full articles, and find clear loading states while content loads, an empty state when no articles exist, and error states if something goes wrong.

**Why this priority**: The core purpose of the feature is to inform club members and the public. The public read path delivers value immediately — without it, the system has no purpose.

**Independent Test**: Navigate to `/news` on a fresh site with published articles. Verify the article list renders, each item shows title, excerpt, date, and category. Click an article to read the full content on `/news/:id`.

**Acceptance Scenarios**:

1. **Given** the site has published news articles, **When** a visitor navigates to `/news`, **Then** they see a paginated list of articles sorted by published date (most recent first), each showing title, excerpt, category badge, and publication date
2. **Given** a visitor on the news list, **When** they click an article title, **Then** they are taken to `/news/:slug` where they see the full article with title, content, category, author, publication date, and SEO meta tags in the document head
3. **Given** a visitor navigates to `/news`, **When** the page is still loading, **Then** skeleton placeholders are shown for each article card
4. **Given** a visitor navigates to `/news`, **When** no published articles exist, **Then** an empty state is displayed with a message like "No news articles yet" and no error
5. **Given** a visitor navigates to `/news` or `/news/:slug`, **When** a network error occurs, **Then** an error state with a retry action is displayed

---

### User Story 2 — Admin manages news articles (CRUD) (Priority: P1)

An authenticated admin accesses `/admin/news` to manage the club's news content. They can view all articles (draft, published, archived) in a responsive table, create new articles with a form, edit existing ones, and delete articles they no longer need.

**Why this priority**: Content must be created and managed before it can be displayed. Admin CRUD is the authoring side of the same coin as the public view.

**Independent Test**: Log in as admin, navigate to `/admin/news`, create a new article, verify it appears in the list, edit it, verify changes are saved, and delete it.

**Acceptance Scenarios**:

1. **Given** an authenticated admin on `/admin/news`, **When** the page loads, **Then** they see a responsive table (desktop) or card list (mobile) of all articles with columns for title, category, status, author, and published date, plus action buttons (edit/delete) on each row
2. **Given** an admin on the news list, **When** they click "New Article", **Then** they are taken to a create form with fields: title, slug (auto-generated from title, editable), category (dropdown), content (rich text editor), excerpt, featured image upload, status (draft/published/archived), and publish date
3. **Given** an admin fills out the create form, **When** they submit with valid data, **Then** the article is saved with the chosen status and they are redirected to the news list with a success toast
4. **Given** an admin fills out the create form, **When** they submit with invalid data (missing required fields), **Then** inline validation errors are shown and the article is not saved
5. **Given** an admin on the news list, **When** they click "Edit" on an article, **Then** they are taken to an edit form pre-filled with the article's current data
6. **Given** an admin on the edit form, **When** they update fields and submit, **Then** the article is updated and they are redirected to the news list with a success toast
7. **Given** an admin clicks "Delete" on an article, **When** they confirm the deletion in a confirmation dialog, **Then** the article is permanently removed from the system
8. **Given** an admin clicks "Delete", **When** they cancel the confirmation dialog, **Then** the article is not deleted

---

### User Story 3 — Homepage shows featured news (Priority: P2)

The homepage displays the 3 most recently published news articles, giving visitors immediate visibility into club updates without needing to navigate to the full news page.

**Why this priority**: The homepage is the most-visited page. Featuring recent news there increases engagement and ensures visitors see important announcements immediately.

**Independent Test**: Publish 3+ articles. Visit the homepage and verify the latest 3 published articles are displayed in a "Latest News" section with title, excerpt, and date.

**Acceptance Scenarios**:

1. **Given** a visitor on the homepage, **When** there are published articles, **Then** the 3 most recently published articles are displayed in a "Latest News" or "Announcements" section
2. **Given** a visitor on the homepage, **When** there are fewer than 3 published articles, **Then** all available published articles are shown (no empty card placeholders)
3. **Given** a visitor on the homepage, **When** there are no published articles, **Then** the featured news section is not displayed at all

---

### User Story 4 — Search engines index news articles (Priority: P3)

Each news article detail page includes proper SEO meta tags so search engines can index and display articles with accurate titles, descriptions, and Open Graph previews in search results and social media shares.

**Why this priority**: SEO increases the club's visibility in search results and ensures shared article links display rich previews on social media and messaging platforms.

**Independent Test**: View the page source of a news detail page and verify meta title, meta description, Open Graph title, OG description, and OG image tags are present with article-specific content.

**Acceptance Scenarios**:

1. **Given** a visitor views a news detail page, **When** they inspect the page head, **Then** a `<title>` tag and `<meta name="description">` tag contain the article's title and excerpt respectively
2. **Given** a visitor views a news detail page, **When** they inspect the page head for Open Graph tags, **Then** `og:title`, `og:description`, `og:type` (article), and `og:image` (if article has image) tags are present
3. **Given** a visitor shares a news article URL on social media, **When** the link is unfurled, **Then** the OG tags provide a rich preview

---

### Edge Cases

- What happens when a slug is not unique? — The system appends a suffix (e.g., `-2`) to ensure unique slugs
- What happens when an admin tries to delete a published article? — Deletion is allowed with confirmation; no archiving required (delete is permanent)
- What happens with very long titles or content? — Titles are truncated in list views with ellipsis; content handles overflow via scroll in the rich text editor
- What happens when a published article's status is changed to draft? — The article immediately disappears from the public list and homepage
- What happens when a visitor accesses `/news/:slug` with a non-existent slug? — A 404-style error state is shown with a link back to the news list
- What happens when there are more than 10 published articles? — The list is paginated (10 per page by default) with page navigation controls
- What happens when an admin session expires while editing? — The form submission fails with an auth error and the admin is redirected to login

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Public `/news` page MUST display a paginated list of published articles sorted by publication date descending
- **FR-002**: Each article in the list MUST show: title, excerpt (truncated content), category badge, author name, and publication date
- **FR-003**: Public `/news/:slug` detail page MUST display the full article: title, full content, category, author, publication date, and featured image (if present)
- **FR-004**: The news list and detail pages MUST show skeleton loading states while data is being fetched
- **FR-005**: The news list and detail pages MUST show a descriptive error state with a retry action on network failure
- **FR-006**: The news list MUST show an empty state when no published articles exist
- **FR-007**: Admin `/admin/news` MUST display all articles (all statuses) in a responsive table (desktop) / card layout (mobile) with columns: title, category, status, author, published date
- **FR-008**: Admin news list MUST include a "New Article" button and per-row edit/delete actions
- **FR-009**: Admin create/edit form MUST include fields: title (required), slug (auto-generated from title, editable), category (required, single-select), content (required, rich text), excerpt (optional, textarea), featured image (optional, image upload), status (draft/published/archived), publish date (auto-set on first publish, editable)
- **FR-010**: Admin create form MUST validate required fields and show inline error messages on invalid submission
- **FR-011**: Admin delete action MUST show a confirmation dialog before permanently removing the article
- **FR-012**: Admin CRUD operations MUST return success/failure toast notifications
- **FR-013**: The homepage MUST display the 3 most recently published articles in a "Latest News" section
- **FR-014**: The homepage news section MUST be hidden entirely when no published articles exist
- **FR-015**: News detail pages MUST include SEO meta tags: `<title>`, `<meta name="description">`, `og:title`, `og:description`, `og:type` (article), and `og:image` (if featured image exists)
- **FR-016**: Slugs MUST be unique; if a duplicate slug is detected, the system MUST append a numeric suffix to ensure uniqueness
- **FR-017**: Articles with "draft" or "archived" status MUST NOT appear on the public `/news` page or homepage
- **FR-018**: News articles MUST support a minimum of 4 categories: "Announcement", "News", "Event Recap", "Press Release"

### Key Entities *(include if feature involves data)*

- **News Article**: Represents a single news post or announcement. Contains title, unique slug, full content (rich text), optional excerpt, optional featured image URL, category (one of four predefined values), publish status (draft/published/archived), publication timestamp, and author reference. Each article belongs to one author (admin user who created/edited it) and has a created-at and updated-at timestamp.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can browse published news articles on `/news`, read full articles on `/news/:slug`, and see appropriate loading/empty/error states — all without authentication
- **SC-002**: An admin can create, read, update, and delete news articles through `/admin/news` with proper form validation, confirmation dialogs, and toast notifications
- **SC-003**: The homepage displays the 3 most recent published articles; hides the section when no articles exist
- **SC-004**: Each published article's detail page includes complete SEO meta tags (title, description, Open Graph) that reflect the article's content
- **SC-005**: All states are covered: loading (skeleton), empty (no articles), error (network failure), and edge cases (invalid slug, duplicate slug, session expiry)
- **SC-006**: TypeScript type-check passes with zero errors and no lint violations

## Assumptions

- The existing image upload system (from prior implementation) is reused for featured images — no new image upload infrastructure is needed
- `authorId` refers to the admin user who creates/edits the article, linked to the existing user system
- Content supports rich text formatting (bold, italic, headings, lists, links) — the specific rich text editor library is a planning/implementation detail
- The rich text editor stores content as HTML (or a format renderable to HTML) for display on the public page
- Pagination defaults to 10 articles per page with standard prev/next navigation
- The existing `AdminTable`, `AdminPageHeader`, `Breadcrumbs`, `EmptyState`, and `ErrorState` components are reused per the project's technical notes
- SEO meta tags are managed client-side via react-helmet-async or equivalent
- The feature does not include scheduled publishing (future-dated articles are considered drafts until manually published)
- No email notifications are sent when articles are published (out of scope for this feature)
