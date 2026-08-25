# Quickstart: News & Announcements

## Prerequisites

- Node.js ≥20
- `npm install` completed
- Dev server: `npm run dev` (MSW auto-starts)

## File Checklist

Before running validation scenarios, confirm these files exist:

| File | Purpose |
|------|---------|
| `src/types/index.ts` | + `NewsArticle`, `NewsCategory`, `NewsStatus` types |
| `src/config/index.ts` | + `newsCategories` constant |
| `src/components/shared/AppProviders.tsx` | + `<HelmetProvider>` wrapper |
| `src/components/shared/NewsSkeleton.tsx` | Loading skeleton for news cards |
| `src/hooks/useNewsForm.ts` | News form hook (create/edit) |
| `src/hooks/useNewsList.ts` | Public news list hook |
| `src/mocks/data/news.ts` | Mock articles |
| `src/mocks/handlers/news.ts` | MSW handlers for `/api/news*` |
| `src/mocks/handlers/index.ts` | + `newsHandlers` |
| `src/pages/news/news.tsx` | Public paginated list |
| `src/pages/news/news-detail.tsx` | Public detail by slug |
| `src/pages/admin/admin-news.tsx` | Admin CRUD list |
| `src/pages/admin/news-form.tsx` | Admin create/edit form |
| `src/App.tsx` | + `/news`, `/news/:slug`, `/admin/news*` routes |

For full data model details, see [data-model.md](./data-model.md).  
For API endpoint contracts, see [contracts/api-contracts.md](./contracts/api-contracts.md).

## Validation Scenarios

### Scenario 1: Public news list renders published articles

**Steps**:
1. Start dev server: `npm run dev`
2. Navigate to `/news`
3. Verify article cards render with title, excerpt, category badge, and date
4. Verify articles sorted most-recent-first

**Expected**: Paginated list of published articles. Loading skeletons shown initially, then card list.

**Covers**: User Story 1 (acceptance 1, 3)

---

### Scenario 2: Article detail page by slug

**Steps**:
1. Navigate to `/news`
2. Click an article card
3. Verify URL contains `/news/{slug}`
4. Verify full content, title, category, author, date display
5. Verify SEO meta tags in `<head>`: `<title>`, `<meta name="description">`, `og:title`, `og:description`, `og:type`, `og:image` (if featured image exists)

**Expected**: Full article renders at `/news/{slug}`. Page `<title>` shows "Article Title | Lions Club FSBM". OG tags present.

**Covers**: User Story 1 (acceptance 2), User Story 4 (acceptance 1, 2)

---

### Scenario 3: Empty state when no articles exist

**Steps**:
1. Clear mock data in `src/mocks/data/news.ts` (empty array)
2. Navigate to `/news`
3. Verify "No news articles yet" empty state

**Expected**: Empty state message displayed, no errors, no articles.

**Covers**: User Story 1 (acceptance 4)

---

### Scenario 4: Error state on network failure

**Steps**:
1. Stop the dev server
2. Navigate to `/news`
3. Verify error state with retry button

**Expected**: Error message with "Try Again" button.

**Covers**: User Story 1 (acceptance 5)

---

### Scenario 5: Admin CRUD — list, create, edit, delete

**Steps**:
1. Log in as admin
2. Navigate to `/admin/news`
3. Verify table shows all articles (draft + published + archived)
4. Click "New Article"
5. Fill form: title, content (via rich text editor), category, status → Submit
6. Verify redirect to admin list with success toast
7. Click "Edit" on the new article
8. Change title, submit → verify success toast and updated title
9. Click "Delete" → confirm dialog → verify article removed

**Expected**: Full CRUD cycle works. Toast on success. Confirmation on delete. Cancel keeps article.

**Covers**: User Story 2 (all 8 acceptance scenarios)

---

### Scenario 6: Homepage featured news

**Steps**:
1. Ensure ≥3 published articles exist in mock data
2. Navigate to `/`
3. Verify "Latest News" section shows 3 most recent published articles
4. Verify each shows title, excerpt, date
5. If fewer than 3 published articles, fewer shown (no placeholders)
6. If zero published articles, the section is hidden entirely

**Expected**: Homepage dynamically adapts to available published articles.

**Covers**: User Story 3 (acceptance 1, 2, 3)

---

### Scenario 7: Invalid slug returns 404

**Steps**:
1. Navigate to `/news/nonexistent-slug`
2. Verify 404-style error state with link back to `/news`

**Expected**: Error state shown, not a blank page.

**Covers**: Edge case (invalid slug)

---

## Running Tests

```bash
# Type-check
npx tsc -b

# Lint
npm run lint

# Run unit tests
npm run test:run

# Run E2E tests (Playwright)
npx playwright test
```

## Relevant Files Reference

- Types: `src/types/index.ts` (add `NewsArticle`, `NewsCategory`, `NewsStatus`)
- Config: `src/config/index.ts` (add `newsCategories`)
- App providers: `src/components/shared/AppProviders.tsx` (add `HelmetProvider`)
- Form hook: `src/hooks/useNewsForm.ts` (pattern: `useEventForm.ts`)
- MSW data: `src/mocks/data/news.ts` (pattern: `events.ts`)
- MSW handlers: `src/mocks/handlers/news.ts` (pattern: `events.ts`)
- Routes: `src/App.tsx` (pattern: event routes)
- Admin list: `src/pages/admin/admin-news.tsx` (pattern: `admin-events.tsx`)
- Admin form: `src/pages/admin/news-form.tsx` (pattern: `event-form.tsx`)
- Public list: `src/pages/news/news.tsx` (pattern: `events.tsx`)
- Public detail: `src/pages/news/news-detail.tsx` (pattern: `event-detail.tsx`)
- Homepage: `src/pages/home/home.tsx` (add featured news section)
