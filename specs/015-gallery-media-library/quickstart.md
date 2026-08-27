# Quickstart: Gallery & Media Library

## Prerequisites

- Node.js ≥20
- `npm install` completed
- Dev server: `npm run dev` (MSW auto-starts)

## File Checklist

Before running validation scenarios, confirm these files exist:

| File | Purpose |
|------|---------|
| `src/types/index.ts` | + `GalleryItem`, `GalleryCategory` types |
| `src/config/index.ts` | + `galleryCategories` constant |
| `src/components/shared/LightboxViewer.tsx` | Accessible lightbox wrapper with metadata |
| `src/components/shared/GallerySkeleton.tsx` | Loading skeleton for grid cards |
| `src/hooks/useGalleryForm.ts` | Admin form hook (create/edit) |
| `src/hooks/useGalleryList.ts` | Public list query hook (pagination + filters) |
| `src/mocks/data/gallery.ts` | Mock items (all 5 categories, ≥1 without thumbnail) |
| `src/mocks/handlers/gallery.ts` | MSW handlers for `/api/gallery*` (admin routes before `:id`) |
| `src/mocks/handlers/index.ts` | + galleryHandlers registration |
| `src/pages/gallery/gallery.tsx` | Public filterable grid + lightbox (`/gallery/:id` deep link) |
| `src/pages/admin/admin-gallery.tsx` | Admin CRUD list |
| `src/pages/admin/gallery-form.tsx` | Admin create/edit form |
| `src/App.tsx` | + `/gallery`, `/gallery/:id`, `/admin/gallery*` routes |

For data details see [data-model.md](./data-model.md); endpoint contracts in [contracts/api-contracts.md](./contracts/api-contracts.md).

## Validation Scenarios

### Scenario 1: Public grid renders and filters

**Steps**:
1. Start dev server, navigate to `/gallery`
2. Verify responsive card grid sorted newest-first; each card shows thumbnail (or image fallback), title, category badge
3. Select a category filter → only matching items remain; clear → full set returns
4. Select an event filter → only that event's photos; clearing restores all

**Expected**: Filtered views within one interaction; skeletons while fetching.

**Covers**: US1 (acceptance 1–3)

---

### Scenario 2: Loading, empty, error states

**Steps**:
1. `/gallery` initial load shows skeleton cards, then content
2. Simulate empty dataset / no filter matches → empty state message
3. Simulate network failure → error state with a working retry action

**Expected**: All three states render correctly.

**Covers**: FR-004–FR-006, SC-003

---

### Scenario 3: Lightbox viewing experience

**Steps**:
1. Click a photo → lightbox opens enlarged with title, description, category, tags, upload date
2. Arrow keys navigate prev/next wrapping at ends; Escape closes back at the same grid position
3. Mobile viewport: swipe left/right navigates
4. Keyboard-only pass: focus enters the dialog on open, is trapped while open, returns to the triggering card on close
5. Deep-link `/gallery/:valid-id` opens the lightbox directly; `/gallery/nonexistent-id` shows a 404-style state linking back to `/gallery`
6. Verify `document.title` reflects the open item's title

**Covers**: US3 (all acceptance), edge case (invalid deep link)

---

### Scenario 4: Admin CRUD — upload, edit, delete

**Steps**:
1. Log in as admin → `/admin/gallery`; verify responsive table/card list with metadata columns and edit/delete actions
2. Upload action → drag-drop or browse a PNG/JPEG/WebP ≤ 5 MB → preview appears, indeterminate progress during submission
3. Invalid file (PDF or 6 MB image) → inline validation error, nothing uploaded
4. Fill metadata: title, description, category, optional event link, tags (include duplicate/whitespace entries) → submit → success toast; item listed with cleaned tags
5. Submit with empty title/category → inline errors, not saved
6. Edit an item → form pre-filled → change title → save → success toast + updated row
7. Delete → confirmation dialog → Cancel keeps item; Confirm removes it permanently with toast

**Covers**: US2 (all acceptance), edge cases (invalid uploads, tag normalization)

---

## Running Tests

```bash
npx tsc -b          # type-check
npm run lint        # linting
npm run test:run    # unit/component tests (Vitest + MSW)
```

Browser-level acceptance validation uses Playwright against the dev server (014 pattern): drive real flows — filters, lightbox keyboard/swipe, upload via the real file input, delete dialogs — rather than mocking at the network layer.

## Relevant Files Reference

- Types/constants: `src/types/index.ts`, `src/config/index.ts`
- Lightbox wrapper: `src/components/shared/LightboxViewer.tsx` (yet-another-react-lightbox)
- Form hook pattern: `src/hooks/useNewsForm.ts` (parallel: `useGalleryForm`)
- List hook pattern: `src/hooks/useNewsList.ts` (parallel: `useGalleryList`)
- MSW patterns: `src/mocks/handlers/news.ts` (ordering + shape)
