# Feature Specification: SEO Improvements

**Feature Branch**: `006-seo-meta`

**Created**: 2026-07-05

**Status**: Draft

**Input**: User description: "SEO: Missing document.title, meta descriptions, canonical URLs"

## Clarifications

### Session 2026-07-14

- Q: Meta descriptions for list pages — should they be explicitly defined? → A: Define explicit descriptions for every page now.
- Q: Open Graph / Twitter Cards — in scope or out? → A: Include Open Graph + Twitter Cards in this feature.
- Q: How should special characters in dynamic titles/descriptions be handled? → A: No explicit sanitization — React's built-in escaping and DOM API textContent/setAttribute handle it safely.
- Q: What is explicitly out of scope for this feature? → A: Out of scope: sitemap.xml, robots.txt, JSON-LD structured data, hreflang tags, SSR/SSG/prerendering, performance metrics.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Each page has a unique document title (Priority: P1)

A user navigates between pages (Home, Events, Forum, About, Contact). The browser tab and window title update to reflect the current page, making it easy to identify tabs and improving search engine ranking.

**Why this priority**: Unique page titles are the most fundamental SEO requirement. Every page currently shows the same generic title "Lions Club FSBM".

**Independent Test**: Navigate to each major route and verify `document.title` changes to match the page content.

**Acceptance Scenarios**:

1. **Given** the user navigates to the home page, **When** the page loads, **Then** the document title reads "Lions Club FSBM — Community Service in Casablanca"
2. **Given** the user navigates to the events page, **When** the page loads, **Then** the document title reads "Events — Lions Club FSBM"
3. **Given** the user navigates to a specific event detail page, **When** the page loads, **Then** the document title includes the event title: "[Event Title] — Lions Club FSBM"
4. **Given** the user navigates to the forum page, **When** the page loads, **Then** the document title reads "Forum — Lions Club FSBM"
5. **Given** the user navigates to a forum thread, **When** the page loads, **Then** the document title includes the thread title: "[Thread Title] — Lions Club FSBM"
6. **Given** the user navigates to the about page, **When** the page loads, **Then** the document title reads "About Us — Lions Club FSBM"
7. **Given** the user navigates to the contact page, **When** the page loads, **Then** the document title reads "Contact Us — Lions Club FSBM"
8. **Given** the user navigates to the login page, **When** the page loads, **Then** the document title reads "Sign In — Lions Club FSBM"
9. **Given** the user navigates to the register page, **When** the page loads, **Then** the document title reads "Join Us — Lions Club FSBM"
10. **Given** the user navigates to a 404 page, **When** the page loads, **Then** the document title reads "Page Not Found — Lions Club FSBM"

---

### User Story 2 — Each page has a unique meta description (Priority: P1)

Search engines display a relevant description for each page in search results, improving click-through rates and SEO ranking.

**Why this priority**: Meta descriptions directly impact search result click-through rates. Currently no page has a meta description.

**Independent Test**: View the page source of each route and verify a `<meta name="description">` tag exists with a page-appropriate description.

**Acceptance Scenarios**:

1. **Given** the home page loads, **When** the page renders, **Then** a `<meta name="description">` tag exists: "Lions Club FSBM is a community service organization in Casablanca, Morocco. Join us in making a difference through service projects and events."
2. **Given** the events page loads, **When** the page renders, **Then** a meta description exists: "Browse upcoming and past community service events organized by Lions Club FSBM in Casablanca. Join us for volunteer projects, fundraisers, and community outreach."
3. **Given** an event detail page loads, **When** the page renders, **Then** the meta description includes a preview of the event description
4. **Given** the forum page loads, **When** the page renders, **Then** a meta description exists: "Join the Lions Club FSBM forum to discuss community projects, events, and service initiatives in Casablanca."
5. **Given** the about page loads, **When** the page renders, **Then** a meta description exists: "Learn about Lions Club FSBM's mission, history, and impact in Casablanca, Morocco. We serve our community through volunteer projects and events."
6. **Given** the contact page loads, **When** the page renders, **Then** a meta description exists: "Get in touch with Lions Club FSBM in Casablanca. Reach us by email, phone, or visit us at our location."
7. **Given** the login page loads, **When** the page renders, **Then** a meta description exists: "Sign in to your Lions Club FSBM account to manage events, forum posts, and your profile."
8. **Given** the register page loads, **When** the page renders, **Then** a meta description exists: "Join Lions Club FSBM and become part of a community service organization making a difference in Casablanca, Morocco."
9. **Given** the search results page loads with a query, **When** the page renders, **Then** the meta description includes the search term: "Search results for [query] — find events, forum discussions, and members of Lions Club FSBM in Casablanca."
10. **Given** a 404 page loads, **When** the page renders, **Then** a meta description exists: "Page not found — Return to the Lions Club FSBM homepage."
11. **Given** a forum thread detail page loads, **When** the page renders, **Then** the meta description is generated from the first 160 characters of the thread content

---

### User Story 3 — Each page has a canonical URL (Priority: P2)

Search engines know which URL is the authoritative version of each page, preventing duplicate content issues from multiple URL paths pointing to the same content.

**Why this priority**: Prevents SEO penalties from duplicate content. Lower priority because the app is a single-page application with fewer duplicate URL paths.

**Independent Test**: View the page source of each route and verify a `<link rel="canonical">` tag exists with the correct URL.

**Acceptance Scenarios**:

1. **Given** any page in the application loads, **When** the page renders, **Then** a `<link rel="canonical">` tag exists pointing to the canonical URL of the current page
2. **Given** a page with query parameters loads, **When** the page renders, **Then** the canonical URL excludes tracking parameters but includes relevant search/filter parameters

---

### User Story 4 — Each page has Open Graph and Twitter Card meta tags (Priority: P2)

Shared links on social media (Facebook, X/Twitter, LinkedIn) display a rich preview with title, description, and image rather than a bare URL.

**Why this priority**: Social sharing is the primary way users discover community organization content. Lower priority than title/description because the app is primarily navigated directly.

**Independent Test**: Share a page URL on Facebook/Twitter debugger and verify the preview includes correct title, description, and image.

**Acceptance Scenarios**:

1. **Given** any page in the application loads, **When** the page renders, **Then** `<meta property="og:title">` and `<meta name="twitter:title">` match the document title
2. **Given** any page in the application loads, **When** the page renders, **Then** `<meta property="og:description">` and `<meta name="twitter:description">` match the meta description content
3. **Given** any page in the application loads, **When** the page renders, **Then** `<meta property="og:url">` equals the canonical URL
4. **Given** any page in the application loads, **When** the page renders, **Then** `<meta property="og:image">` and `<meta name="twitter:image">` point to the page's representative image or the default og:image
5. **Given** any page in the application loads, **When** the page renders, **Then** `<meta property="og:type">` is set to `"website"` (or `"article"` for event/thread detail pages)
6. **Given** any page in the application loads, **When** the page renders, **Then** `<meta name="twitter:card">` is set to `"summary_large_image"`
7. **Given** a dynamic detail page (event, thread) loads, **When** the page renders, **Then** `og:image` uses the entity's image if available, otherwise falls back to the default og:image

---

### Edge Cases

- What happens when a page title is dynamically loaded (e.g., event title from API)? — The document title updates after data loads, not before
- What happens when the API fails to load a detail page? — Show a fallback title: "Event Details — Lions Club FSBM"
- What about search results pages with query parameters? — Include the search term in the title: "Search: [query] — Lions Club FSBM"
- How do meta descriptions handle dynamic content? — Use a truncated version of the first 160 characters of the content
- What happens when a dynamic detail page has no image for og:image? — Fall back to the default `/logo.png` defined in the project
- What happens to OG/Twitter tags when the page route changes rapidly? — Tags update in the same effect/cycle as title and canonical — batch all head updates in a single DOM mutation if possible
- How are special characters in dynamic content (event titles, thread titles) handled? — Standard DOM APIs handle escaping automatically via `textContent` and `setAttribute`. No manual sanitization needed unless values are rendered as raw HTML

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Every page route MUST set a unique `document.title` using the format `[Page Name] — Lions Club FSBM`
- **FR-002**: Dynamic detail pages (event, thread) MUST include the entity title in the document title
- **FR-003**: The home page title MUST read "Lions Club FSBM — Community Service in Casablanca"
- **FR-004**: The 404 page title MUST read "Page Not Found — Lions Club FSBM"
- **FR-005**: The search results page MUST include the query in the title: "Search: [query] — Lions Club FSBM"
- **FR-006**: Every page MUST include a `<meta name="description">` tag with a page-appropriate description
- **FR-007**: Dynamic pages (event detail, thread detail) MUST generate meta descriptions from the first 160 characters of the content
- **FR-008**: Every page MUST include a `<link rel="canonical">` tag pointing to the canonical URL of the current page
- **FR-009**: Canonical URLs MUST exclude tracking parameters but preserve meaningful query parameters (e.g., `?q=` for search). Excluded parameters include: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `fbclid`, `gclid`, `ref`
- **FR-010**: SEO tags MUST update when the route changes (without full page reload) — use react-router's `useLocation` or a custom hook
- **FR-011**: Every page MUST include Open Graph meta tags: `og:title`, `og:description`, `og:url`, `og:image`, `og:type`
- **FR-012**: Every page MUST include Twitter Card meta tags: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:site` (set to `@lionsclubfsbm`)
- **FR-013**: The Open Graph `og:type` MUST be `"website"` for list/info pages and `"article"` for dynamic detail pages (event, thread)
- **FR-014**: The Twitter Card type MUST be `"summary_large_image"`
- **FR-015**: Dynamic detail pages MUST use the entity's image for `og:image` when available, falling back to the default `/logo.png`
- **FR-016**: Open Graph and Twitter tag values MUST be derived from the same source as title/description to ensure consistency
- **FR-017**: Admin routes (`/admin/*`) MUST set `<meta name="robots" content="noindex">` to prevent indexing of authenticated pages
- **FR-018**: Auth-gated pages (profile, verify-email) SHOULD set `<meta name="robots" content="noindex">` unless they contain publicly shareable content

### Key Entities *(include if feature involves data)*

- **SEOMeta**: A set of metadata (title, description, canonical URL) associated with each page route, potentially including dynamic values from API data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 10+ routes (home, events, event detail, forum, threads, thread detail, about, contact, login, register, search, 404) set unique document titles
- **SC-002**: All routes include a meaningful meta description tag
- **SC-003**: All routes include a canonical link tag
- **SC-003b**: All routes include Open Graph and Twitter Card meta tags with correct values
- **SC-004**: Dynamic titles, descriptions, images, and OG/Twitter values update when API data loads
- **SC-005**: No regressions in existing test suite
- **SC-006**: TypeScript type-check passes with zero errors

## Out of Scope

The following are explicitly excluded from this feature and will be addressed in separate issues if needed:

- **sitemap.xml** generation and submission
- **robots.txt** configuration
- **JSON-LD structured data** (schema.org markup for events, organization, breadcrumbs)
- **hreflang tags** (multi-language support)
- **SSR/SSG/prerendering** (the app remains a client-side SPA)
- **Performance metrics** (Lighthouse scores, Core Web Vitals — tracked separately)
- **Analytics / tracking scripts** (Google Tag Manager, etc.)
- **Accessibility improvements** (covered by separate WCAG compliance work)

## Assumptions

- SEO metadata will be managed via `react-helmet-async`, which provides concurrent-safe `<Helmet>` components for managing `<title>`, `<meta>`, and `<link>` tags declaratively
- A `HelmetProvider` will be added to the provider tree wrapping the router to enable nested Helmet components
- Dynamic content (event titles, thread titles) is already available via React Query — no new API calls needed
- Meta descriptions for list pages (events, forum) are static strings
- Meta descriptions for detail pages use the first 160 characters of the entity's description/content
- Canonical URLs use `window.location.origin + window.location.pathname` as the base
- A default `/logo.png` already exists in the project's `public/` directory and serves as the fallback OG image
- OG and Twitter tags are managed via the same `react-helmet-async` `<Helmet>` component that manages title/description/canonical — no separate abstraction needed
- The `og:type` for dynamic detail pages is determined by the page type: `"article"` for events and forum threads, `"website"` for everything else
