# Quickstart: SEO Meta Validation Guide

## Prerequisites

- Feature branch `006-seo-meta` created and checked out
- Dependencies installed: `npm install`
- Dev server running: `npm run dev`

## Setup

```bash
git checkout 006-seo-meta
npm install
npm run dev
```

## Quick Validation Scenarios

### Scenario 1 — Static Page Titles

Navigate to each static route and verify `document.title`:

```bash
# Home
open http://localhost:5173/
# → document.title === "Lions Club FSBM — Community Service in Casablanca"

# Events
open http://localhost:5173/events
# → document.title === "Events — Lions Club FSBM"

# About
open http://localhost:5173/about
# → document.title === "About Us — Lions Club FSBM"

# Contact
open http://localhost:5173/contact
# → document.title === "Contact Us — Lions Club FSBM"

# Login
open http://localhost:5173/login
# → document.title === "Sign In — Lions Club FSBM"

# Register
open http://localhost:5173/register
# → document.title === "Join Us — Lions Club FSBM"

# 404
open http://localhost:5173/nonexistent
# → document.title === "Page Not Found — Lions Club FSBM"
```

### Scenario 2 — Dynamic Page Titles

Navigate to a dynamic detail page and verify the title updates after data loads:

```bash
# Event detail (use an actual event ID from the API)
open http://localhost:5173/events/1
# → Initially: "Event Details — Lions Club FSBM" (fallback while loading)
# → After data: "[Event Title] — Lions Club FSBM" (e.g., "Beach Cleanup — Lions Club FSBM")

# Forum thread
open http://localhost:5173/forum/1/2
# → Initially: "Forum — Lions Club FSBM" (fallback while loading)
# → After data: "[Thread Title] — Lions Club FSBM"
```

### Scenario 3 — Meta Descriptions

View page source (`Ctrl+U` or DevTools → Elements) and verify `<meta name="description">`:

```bash
# Home
# → <meta name="description" content="Lions Club FSBM is a community service organization in Casablanca...">

# Events
# → <meta name="description" content="Discover upcoming and past events organized by Lions Club FSBM...">

# Event detail
# → <meta name="description" content="[First 160 chars of event.description]">
```

### Scenario 4 — Open Graph Tags

Verify OG tags present on any page:

```bash
# Check via DevTools console:
document.querySelector('meta[property="og:title"]')?.content
document.querySelector('meta[property="og:description"]')?.content
document.querySelector('meta[property="og:image"]')?.content
document.querySelector('meta[property="og:url"]')?.content
document.querySelector('meta[property="og:type"]')?.content
```

Expected:
- `og:title` matches `document.title`
- `og:description` matches meta description
- `og:image` is either the entity image or `/logo.png`
- `og:url` matches canonical URL
- `og:type` is `"website"` for list pages, `"article"` for detail pages

### Scenario 5 — Twitter Cards

```bash
document.querySelector('meta[name="twitter:card"]')?.content === "summary_large_image"
document.querySelector('meta[name="twitter:title"]')?.content === document.title
document.querySelector('meta[name="twitter:description"]')?.content === /* meta description */
document.querySelector('meta[name="twitter:image"]')?.content === /* og:image */
```

### Scenario 6 — Canonical URLs

```bash
document.querySelector('link[rel="canonical"]')?.getAttribute('href')
# Expected: http://localhost:5173/current-path (no query params except ?q= for search)
```

### Scenario 7 — Route Change Without Full Reload

1. Navigate to `/events`
2. Verify `document.title` is "Events — Lions Club FSBM"
3. Navigate to `/about` via in-app link (not full URL navigation)
4. Verify `document.title` is "About Us — Lions Club FSBM"
5. Verify all OG/Twitter tags updated

### Scenario 8 — SEO Tags on Admin Routes

Admin routes should have minimal SEO (noindex, generic title):

```bash
open http://localhost:5173/admin
# → document.title === "Admin — Lions Club FSBM"
# → <meta name="robots" content="noindex">
```

## Running Tests

```bash
# Unit tests
npm run test:run -- --grep "SEO|meta|document.title"

# Type check
npx tsc -b

# Lint
npm run lint
```

## Expected Outcomes

| Check | Expected |
|-------|----------|
| All 12+ static pages set unique `document.title` | ✅ |
| All dynamic pages load fallback then update title | ✅ |
| All pages have `<meta name="description">` | ✅ |
| All pages have `<link rel="canonical">` | ✅ |
| All pages have OG tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`) | ✅ |
| All pages have Twitter Card tags | ✅ |
| Tags update on route change without page reload | ✅ |
| No regressions in existing test suite | ✅ |
| TypeScript type-check passes | ✅ |
