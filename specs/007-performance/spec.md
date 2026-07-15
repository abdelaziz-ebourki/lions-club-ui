# Feature Specification: Performance Optimization

**Feature Branch**: `007-performance`

**Created**: 2026-07-05

**Status**: Draft

**Input**: User description: "Performance: Image optimization, memoization, re-renders"

## Clarifications

### Session 2026-07-15

- Q: How deep should image optimization go? → A: Lazy loading only — scope limited to `loading="lazy"` + explicit width/height; no format conversion or build tooling
- Q: What measurable performance target defines "success"? → A: No numeric target — success = lazy loading applied + zero regressions (qualitative)
- Q: Is route-level code splitting / bundle-size optimization in scope? → A: Out of scope — keep to the three defined user stories (lazy images, memoized replies, faster transition)
- Q: Should the header logo also be lazy? → A: No — the header logo is above-the-fold (LCP candidate), so it loads eagerly. Lazy applies to the footer logo and all content images only.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Images load efficiently (Priority: P1)

A visitor browses the site and images load with lazy loading and explicit width/height attributes. Page load time is reduced and bandwidth is conserved by deferring offscreen images.

**Why this priority**: Image optimization has the highest performance impact per effort. The logo and event images are the largest unoptimized assets.

**Independent Test**: Open browser DevTools Network tab, load the page, and verify images use `loading="lazy"` and are served in modern formats.

**Acceptance Scenarios**:

1. **Given** the site header loads, **When** the page renders, **Then** the header logo loads eagerly (no `loading="lazy"`); the footer logo and content images use `loading="lazy"`
2. **Given** the site footer loads, **When** the page renders, **Then** the footer logo has `loading="lazy"` attribute
3. **Given** an event card or event detail page renders, **When** the image loads, **Then** it has `loading="lazy"` attribute

---

### User Story 2 — Components avoid unnecessary re-renders (Priority: P2)

A user browses the forum and replies section. ReplyItem components only re-render when their specific data changes, not when any parent component updates. ReplyForm does not re-render on every keystroke.

**Why this priority**: Reduces CPU usage and improves scroll performance on pages with many replies or complex forms.

**Independent Test**: Use React DevTools profiler to verify ReplyItem and ReplyForm do not re-render unnecessarily when parent state changes.

**Acceptance Scenarios**:

1. **Given** a thread page with multiple replies, **When** a parent component updates (e.g., a new reply is added), **Then** only the new reply component renders — existing ReplyItem components do not re-render
2. **Given** a user is typing in the reply form, **When** each character is typed, **Then** the ReplyForm component does not re-render the entire component on every keystroke — only the input field updates

---

### User Story 3 — Page transitions are smooth (Priority: P3)

A user navigates between pages and the fade-in animation completes quickly, without making the app feel sluggish.

**Why this priority**: Lower priority because the fade-in is a cosmetic issue. The 500ms animation on every route change can feel slow.

**Independent Test**: Navigate between routes and verify the page content transition animation completes within 200ms or less.

**Acceptance Scenarios**:

1. **Given** a user navigates to a new route, **When** the page content loads, **Then** the fade-in animation completes within 200ms (down from 500ms)
2. **Given** a user rapidly navigates between routes, **When** each route change occurs, **Then** the animation does not stack or cause visual delay

---

### Edge Cases

- What happens when an image fails to load with lazy loading? — Standard fallback styling applies (existing behavior)
- What happens when React.memo causes stale closures? — Ensure all props are primitive values or properly memoized
- What happens on very slow connections with lazy images? — Images load as the user scrolls, content is still readable without images

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: All `<img>` elements in the application MUST include `loading="lazy"` attribute, except the above-the-fold header logo (which loads eagerly)
- **FR-002**: The footer logo MUST use `loading="lazy"`; the header logo loads eagerly (above-the-fold / LCP)
- **FR-003**: Event images on cards and detail pages MUST use `loading="lazy"`
- **FR-004**: The `ReplyItem` component MUST be wrapped with `React.memo` to prevent unnecessary re-renders
- **FR-005**: The `ReplyForm` component MUST NOT re-render the entire component on every keystroke — isolate the watched field or use `shouldUnregister: false` with controlled input
- **FR-006**: The page fade-in animation in the shell layout MUST be reduced from 500ms to 200ms
- **FR-007**: Animation timing MUST respect `prefers-reduced-motion` — disable animation entirely when the user has this preference set
- **FR-008**: All `<img>` elements MUST include explicit `width` and `height` attributes to prevent layout shift (CLS)

### Out of Scope

- Route-level code splitting and bundle-size optimization (e.g., `React.lazy` for public pages, bundle analysis) are explicitly out of scope for this feature; `React.lazy` remains mandated only for admin routes per the constitution.
- Image format conversion (AVIF/WebP) and responsive `srcset`/`sizes` generation are out of scope; optimization is limited to native lazy loading plus explicit dimensions.
- No numeric Core Web Vitals or payload-budget targets are defined; success is qualitative (lazy loading applied + zero regressions).

### Key Entities *(include if feature involves data)*

- N/A — This feature is purely about rendering behavior and asset loading, no new data entities.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All images in the app except the header logo use lazy loading (verified by DevTools Network tab showing content images loading on scroll; header logo loads on page load)
- **SC-002**: ReplyItem components do not re-render when parent state changes (verified by React DevTools profiler)
- **SC-003**: ReplyForm input is responsive with no lag (verified by typing test — no re-render on every keystroke)
- **SC-004**: Page transition animation completes in 200ms or less (halved from current 500ms)
- **SC-005**: Animation is disabled when `prefers-reduced-motion: reduce` is active
- **SC-006**: No regressions in existing test suite
- **SC-007**: TypeScript type-check passes with zero errors

## Assumptions

- `loading="lazy"` is a native HTML attribute and requires no polyfills — all modern browsers support it
- `React.memo` is sufficient for ReplyItem optimization — no need for `useMemo` or `useCallback` on parent side unless profiling shows otherwise
- The shell fade-in animation is CSS-based (Tailwind `animate-in` or custom keyframes) — changing the duration is a CSS-only change
- `prefers-reduced-motion` is supported via Tailwind's `motion-reduce:` variant or a CSS media query
- ReplyForm optimization uses `useWatch` instead of `watch` to avoid full component re-renders (react-hook-form provides both APIs)
