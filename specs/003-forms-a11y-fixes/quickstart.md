# Quickstart: Forms Validation & Accessibility Fixes

## Prerequisites

- Node.js, npm installed
- `npm install` completed
- Dev server: `npm run dev` (or `npm run build` for type-check only)

## Verification Scenarios

### 1. Event "ongoing" status

```bash
npm run test:run -- --grep "event.*status|ongoing"
```

**Expected**: Tests pass for status enum including "ongoing". Event form accepts all three status values.

**Manual**: Start dev server → navigate to admin events → create/edit event → verify "Ongoing" option exists in status dropdown.

### 2. Form maxLength validation

```bash
npm run test:run -- --grep "maxLength|character.*limit"
```

**Expected**: All 4 forms (contact, member, event, new-thread) reject input exceeding maxLength. Zod validation errors render inline.

**Manual**: Navigate to each form → type beyond expected limit → verify error message appears on submission.

### 3. Character count indicator

```bash
npm run test:run -- --grep "character.*count|charCount"
```

**Expected**: Form fields show live `{length}/{max}` counter. Counter turns orange ≥80%, red at 100%.

**Manual**: Navigate to contact form → type in message field → verify counter updates per keystroke.

### 4. Submit button spinner

```bash
npm run test:run -- --grep "spinner|submit.*loading"
```

**Expected**: All submit buttons show animated SVG spinner during `isPending`/`isSubmitting`. Button is disabled while pending.

**Manual**: Submit any form → verify button shows spinning animation and is non-clickable.

### 5. Success field glow

```bash
npm run test:run -- --grep "success.*glow|field.*feedback"
```

**Expected**: After successful mutation, form fields show green ring border that fades after 2 seconds.

**Manual**: Submit any form with valid data → verify green border appears briefly on fields.

### 6. Skip-to-content link

```bash
npm run test:run -- --grep "skip.*content|skip.*to"
```

**Expected**: First Tab press on any page focuses "Skip to content" link. Activating it moves focus to `<main>`.

**Manual**: Load any page → press Tab → verify "Skip to content" appears → press Enter → verify focus moves to main content.

### 7. Aria attributes on nav landmarks

```bash
npm run test:run -- --grep "aria-label|aria-current|landmark"
```

**Expected**: Header `<nav>` has `aria-label="Main navigation"`. Admin `<nav>` has `aria-label="Admin navigation"`. Active links have `aria-current="page"`.

**Manual**: Open browser devtools → inspect header nav → verify aria-label. Navigate to admin page → inspect sidebar → verify aria-current on active link.

### 8. Decorative icon aria-hidden

```bash
npm run test:run -- --grep "aria-hidden|decorative"
```

**Expected**: Footer contact icons, forum category icons, thread MessageSquare, reply avatar, event ArrowLeft — all have `aria-hidden="true"`.

**Manual**: Use axe DevTools or Accessibility Tree inspector → verify decorative icons are hidden.

### 9. 404 page role

```bash
npm run test:run -- --grep "not-found|role.*alert"
```

**Expected**: 404 page heading wrapper has `role="alert"`.

**Manual**: Navigate to `/nonexistent` → use Accessibility Tree inspector → verify "alert" role is present.

### 10. Loading regions aria-busy

```bash
npm run test:run -- --grep "aria-busy|loading.*state"
```

**Expected**: Loading content containers set `aria-busy="true"` during data fetch, remove on success.

**Manual**: Navigate to slow-loading page → inspect loading container → verify `aria-busy="true"`.

### 11. Heading hierarchy

```bash
npm run test:run -- --grep "heading.*hierarchy|reply.*heading"
```

**Expected**: Reply section heading uses `<h2>` (not `<h3>`).

**Manual**: Navigate to thread detail → use heading navigation in screen reader → verify h1 → h2 flow.

## Full Test Suite

```bash
# Run all tests
npm run test:run

# Type check
npx tsc -b

# Lint
npm run lint
```

**Expected**: 105+ tests pass, `tsc -b` zero errors, lint passes (excluding pre-existing errors in test files/contexts).

## Build Verification

```bash
npm run build
```

**Expected**: Type-check + production build succeeds with no errors.
