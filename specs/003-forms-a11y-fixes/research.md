# Research: Forms Validation & Accessibility Fixes

## 1. Accessible Submit Spinner

**Decision**: Inline animated SVG spinner inside the submit button, replacing button text during `isPending`.

**Rationale**:
- No external dependency needed — a 24x24 SVG circle with Tailwind `animate-spin` class
- Standard: `<svg class="animate-spin size-4" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="4" stroke-dasharray="31.4 31.4" stroke-linecap="round" /></svg>`
- `aria-hidden="true"` because the button itself gets `aria-label` or screen readers read the changing text
- Button is disabled during submission (`disabled` prop), which natively prevents interaction

**Alternatives considered**:
- lucide-react `Loader2` icon — available in the project but adds an import. Simple SVG is lighter.
- CSS-only spinner with pseudo-elements — less maintainable across dark/light themes.
- Third-party spinner library — unnecessary dependency.

## 2. Skip-to-Content Link

**Decision**: Visually-hidden `<a>` as first child of `<body>` in `shell.tsx`.

**Rationale**:
- Standard WCAG 2.1 SC 2.4.1 (Bypass Blocks) implementation
- Pattern: `<a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:outline-none focus:ring-2">Skip to content</a>`
- `id="main-content"` goes on the `<main>` element (already exists in `shell.tsx`)

## 3. Success Field Animation

**Decision**: Add `ring-2 ring-green-500/50` class to validated form fields for 2 seconds after success mutation.

**Rationale**:
- `useEffect` after successful `isSuccess` toggles a CSS class, then clears it after 2s via `setTimeout`
- Pairs with existing `sonner` toast — visual feedback at the field level, auditory/modal feedback via toast
- Tailwind ring utilities work with the existing input/field components
- Transitions via Tailwind `transition-all duration-500` for smooth fade-out

**Alternatives considered**:
- Checkmark overlay icon on fields — too visually busy on small fields.
- Persistent green border that stays until next edit — could conflict with error states.

## 4. Character Count UX

**Decision**: `<span>` below the field showing `{length}/{max}`, with color transitions and `aria-live="polite"`.

**Rationale**:
- Positioning: below the field, left-aligned, small text (`text-body-sm text-muted-foreground`)
- Color transitions via `cn()`:
  - Default: `text-muted-foreground`
  - ≥80%: `text-amber-500`
  - 100%: `text-destructive`
- `aria-live="polite"` on the counter span so screen readers announce the count without interrupting
- Pattern matches existing `reply-form.tsx` implementation — consistent UX

**Alternatives considered**:
- Above-field counter — less visible with long forms.
- Inline counter inside the field — not feasible with native inputs.
- Tooltip on focus — hidden by default, users won't discover it.

## 5. aria-current Pattern

**Decision**: Exact pathname match, add `aria-current={isActive ? "page" : undefined}` on `<Link>`.

**Rationale**:
- Uses existing `location.pathname === item.href` check already in codebase
- `"page"` is the correct value for navigation links representing the current page
- Should NOT be set to `"true"` — `"page"` is the semantically correct token

## 6. aria-busy Pattern

**Decision**: Add `aria-busy={isLoading}` on the content container `<div>` wrapping skeleton states and data.

**Rationale**:
- Applied to the container that holds both the skeleton and the loaded content
- Set to `true` while data is loading, `false` (or remove attribute) when data arrives
- Use `isPending` from React Query's `useQuery` or `useSuspenseQuery`
- Provides screen reader notification without adding extra DOM elements

## 7. Heading Hierarchy Fix

**Decision**: `reply-list.tsx` line 55: change `<h3>` to `<h2>`.

**Rationale**:
- Thread detail page has `<h1>` for thread title → section heading for replies should be `<h2>`
- Individual reply items use `<p>` and `<div>` — no sub-headings, so no further hierarchy issues
- Straightforward one-element fix

## Reference Patterns in Codebase

- **Character count**: `src/components/forum/reply-form.tsx` — uses `form.watch('content')` and displays `{length}/{maxLength}`
- **Success feedback**: No existing pattern — will be new
- **Spinner**: No existing pattern — will be new
- **Aria-hidden on decorative icons**: Used correctly in `contact.tsx` pages, missing in footer/forum/events
