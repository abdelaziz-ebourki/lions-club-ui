# Quickstart: Responsive Tables Validation Guide

## Prerequisites

- Feature branch `008-responsive-tables` created and checked out
- Dev server running: `npm run dev`
- Chrome DevTools with device emulation (Toggle Device Toolbar: `Ctrl+Shift+M`)

## Quick Validation Scenarios

### Scenario 1 — Mobile Viewport (375px)

Set viewport to 375px × 667px (iPhone SE) in DevTools device emulation.

#### Admin Events Page
```bash
open http://localhost:5173/admin/events
```
- Each event row is displayed as a **card** with title, date, category, and status — all visible
- Card has a bordered container with labeled fields
- No data is hidden behind `hidden md:table-cell`

#### Admin Members Page
```bash
open http://localhost:5173/admin/members
```
- Each member displayed as a card with name, role, and join date — all visible
- Role column is not hidden behind `hidden md:table-cell`

#### Admin Messages Page
```bash
open http://localhost:5173/admin/messages
```
- Each message displayed as a card with name, email, subject, and date — all visible
- Email and date are not hidden

#### Forum Categories
```bash
open http://localhost:5173/forum
```
- Each category displayed as a card with name, description, thread count, and post count — all visible

#### Forum Thread List
```bash
open http://localhost:5173/forum/1
```
- Each thread displayed as a card with title, author, reply count, and last activity — all visible

### Scenario 2 — Desktop Viewport (1024px)

Resize to 1024px × 768px. Verify all 5 pages show the **normal table layout** — no card layout, no change from current behavior.

### Scenario 3 — Tablet Viewport (768px)

Resize to 768px × 1024px (iPad portrait). Verify:
- Table layout is preserved (no card switching)
- All columns are visible and readable

### Scenario 4 — Cross-Viewport Data Integrity

For each of the 5 table pages:

```js
// On mobile (375px): count visible cards
document.querySelectorAll('[data-testid="mobile-card"]').length

// On desktop (1024px): count visible table rows
document.querySelectorAll('tbody tr').length

// Both counts should match — no data loss between layouts
```

### Scenario 5 — No Stale Hidden Classes

```js
// Verify no hidden utility classes remain on table cells
document.querySelectorAll('td.hidden, th.hidden').length === 0
```

## Running Tests

```bash
# Unit tests
npm run test:run

# Type check
npx tsc -b

# Lint
npm run lint
```

## Expected Outcomes

| Check | Expected |
|-------|----------|
| 5 table views show card layout on mobile (375px) | ✅ |
| All data fields visible on mobile (nothing hidden) | ✅ |
| 5 table views show normal table layout on desktop (1024px) | ✅ |
| Tablet viewport (768px) preserves table layout | ✅ |
| Card-to-row count matches — no data loss | ✅ |
| No stale `hidden sm:block` / `hidden md:table-cell` classes | ✅ |
| No regressions in existing test suite | ✅ |
