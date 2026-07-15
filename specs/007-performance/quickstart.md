# Quickstart: Performance Optimization Validation Guide

## Prerequisites

- Feature branch `007-performance` created and checked out
- Dev server running: `npm run dev`
- Chrome DevTools open (Network tab, React DevTools profiler)

## Quick Validation Scenarios

### Scenario 1 — Image Lazy Loading

Open DevTools Network tab, filter by "img", reload the page:

```bash
open http://localhost:5173/
```

- Verify images below the fold are **not** loaded on initial page load
- Scroll down and verify images load progressively
- Hover over any `<img>` in DevTools Elements panel → verify `loading="lazy"` attribute present (including hero/banner images)

### Scenario 2 — CLS Prevention

In DevTools:
```js
// Check all images have width/height attributes
document.querySelectorAll('img').forEach(img => {
  if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
    console.warn('Missing dimensions:', img.src);
  }
});
```

### Scenario 3 — Memoization

Navigate to a forum thread with replies:

```bash
open http://localhost:5173/forum/1/2
```

Open React DevTools Profiler, interact with the page, and verify:
- `ReplyItem` components are highlighted only when their specific data changes
- Adding a new reply does not re-render existing `ReplyItem` components

### Scenario 4 — ReplyForm Input Isolation

In the same thread page:

```bash
# Verify ReplyForm structure
document.querySelector('form textarea') // input field exists
```

Type rapidly in the reply textarea. Verify only the input updates — the ReplyForm wrapper and parent components do not re-render on every keystroke.

### Scenario 5 — Animation Timing

Navigate between routes:

```bash
open http://localhost:5173/events
# Then navigate to /about via in-app link
```

Verify:
- Page content fades in within 200ms (not 500ms)
- Animation is smooth with no jank

### Scenario 6 — Reduced Motion

In DevTools, enable `prefers-reduced-motion: reduce` (Render tab → Emulate CSS media feature):

```bash
open http://localhost:5173/
```

Navigate between routes. Verify:
- No fade-in animation occurs
- Page content appears immediately

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
| Below-fold images use `loading="lazy"` | ✅ |
| All images (including hero) use `loading="lazy"` | ✅ |
| All images have explicit `width`/`height` | ✅ |
| ReplyItem components are memoized | ✅ |
| ReplyForm input is isolated from re-renders | ✅ |
| Page fade-in animation is 200ms | ✅ |
| Animation disabled when `prefers-reduced-motion: reduce` | ✅ |
| No regressions in existing test suite | ✅ |
