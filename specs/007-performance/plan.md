# Implementation Plan: Performance Optimization

**Feature**: `007-performance`
**Spec**: `specs/007-performance/spec.md`
**Created**: 2026-07-14
**Status**: Planning Complete

**Reconciled**: 2026-07-15 — aligned with `/speckit.clarify` session (Q1=A lazy loading + width/height only, no `fetchpriority`/format conversion; Q2=A no numeric targets; Q3=A code-splitting out of scope). Removed hero `loading="eager"` exception to stay consistent with spec FR-001.

## Technical Context

### Stack & Environment

| Dimension | Choice |
|-----------|--------|
| Language | TypeScript 6 (strict mode) |
| Framework | React 19, Vite 8, ESM |
| Styling | Tailwind v4 (motion-reduce: variant available) |
| Forms | react-hook-form v7 (useWatch for field isolation) |
| Rendering | Pure client-side SPA |

### Architecture

Three independent optimization areas — no shared architecture beyond the existing codebase:

1. **Image attributes** — Add `loading="lazy"` to all `<img>` elements per FR-001..003. Add explicit `width`/`height` where missing per FR-008. No `fetchpriority` exception and no hero `loading="eager"` — the clarified scope (Q1=A) applies lazy loading uniformly.
2. **Component memoization** — `React.memo(ReplyItem)`, `useWatch` in ReplyForm.
3. **CSS animation** — Change `duration-500` to `duration-200` in shell animation. Add `motion-reduce:` variant.

### Route Inventory

| Page | Images | Components | Animation |
|------|--------|------------|-----------|
| All pages (header/footer) | Logo (×2) | — | Shell fade-in |
| Home | Event card images | — | Shell fade-in |
| Events | Card + detail images | — | Shell fade-in |
| Event detail | Hero image | — | Shell fade-in |
| Forum | — | ReplyItem, ReplyForm | Shell fade-in |
| All other | — | — | Shell fade-in |

### Unknowns (Resolved in research.md)

| Unknown | Resolution |
|---------|------------|
| Image lazy loading approach | Native `loading="lazy"` — no polyfill needed; uniform across all images including hero (no eager exception) |
| LCP image optimization | Out of scope — Q1=A limits scope to lazy loading + dimensions; no `fetchpriority` tuning |
| Memoization strategy | `React.memo` for ReplyItem, `useWatch` for ReplyForm |
| Animation change scope | CSS-only: `duration-500` → `duration-200` + `motion-reduce:` |
| CLS prevention | Add `width`/`height` attributes to images missing them |

## Constitution Check

| Principle | Compliance | Notes |
|-----------|------------|-------|
| I. TDD is Non-Negotiable | ✅ PASS | Acceptance scenarios are testable (DevTools, React DevTools profiler) |
| II. Agent Skills Discipline | ✅ PASS | `vercel-react-best-practices` skill relevant for performance patterns |
| III. MCP-First Tooling | ✅ PASS | React performance patterns via context7 if needed |
| IV. TypeScript-First | ✅ PASS | No new types needed — pure rendering/attribute changes |
| V. Design System Discipline | ✅ PASS | No new UI components |
| VI. Best Practices | ✅ PASS | Native lazy loading, CSS animations, React.memo — all standard patterns |

**Gate**: PASS — no violations found.

## Phases

### Phase 0: Setup & Research ✅

- [x] Industry best practices for image lazy loading → native `loading="lazy"` + `fetchpriority="high"`
- [x] Memoization patterns in React 19 → `React.memo` + `useWatch` for form isolation
- [x] CSS animation best practices → 200ms threshold, `prefers-reduced-motion`
- [x] Document decisions in `research.md`

### Phase 1: Design ✅

- [x] No new data entities needed
- [x] Quickstart validation guide created

### Phase 2: Implementation Tasks (TBD)

```
P1  Add loading="lazy" to all <img> elements across the app
P1  Add width/height attributes to images missing them (CLS prevention)
P1  Wrap ReplyItem with React.memo
P1  Refactor ReplyForm to use useWatch for input isolation
P1  Reduce shell fade-in from 500ms to 200ms
P1  Add motion-reduce: variant to disable animation
P1  Write tests verifying image attributes and memoization
P2  Profile with React DevTools to confirm no regressions
```

### Phase 3: Verification

- Verify all `<img>` elements have `loading="lazy"` via DevTools Network tab
- Verify React DevTools profiler shows no unnecessary re-renders
- Verify fade-in completes within 200ms
- Verify `prefers-reduced-motion: reduce` disables animation
- `npm run test:run` — no regressions
- `npx tsc -b` — zero errors
- `npm run lint` — zero warnings

## Complexity & Risk

| Risk | Impact | Mitigation |
|------|--------|------------|
| `loading="lazy"` on above-fold/hero images | Low | Spec FR-001 mandates lazy loading uniformly (Q1=A); above-fold cost is negligible for a small SPA and outweighed by scope simplicity |
| React.memo causing stale closures | Low | ReplyItem receives only primitive props — safe to memoize |
| `useWatch` breaking existing form behavior | Medium | Test ReplyForm thoroughly; `useWatch` is isomorphic with `watch` |
| CSS animation change missed in some pages | Low | Single animation source in Shell layout — one change covers all |

## Artifacts

- `specs/007-performance/spec.md` — feature specification
- `specs/007-performance/research.md` — technology research & decisions
- `specs/007-performance/plan.md` — this file
- `specs/007-performance/quickstart.md` — validation guide
