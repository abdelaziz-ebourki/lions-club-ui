# Research: Performance Optimization

## Image Loading Strategy

- **Decision**: Use native `loading="lazy"` uniformly on every `<img>` element, including hero/LCP images. No `fetchpriority` tuning and no `loading="eager"` exception.
- **Rationale**: Native lazy loading is zero-cost and supported in all modern browsers (94%+ global coverage). The clarified scope (Q1=A) limits optimization to lazy loading plus explicit dimensions — hero/LCP `fetchpriority` tuning was explicitly excluded. No polyfill needed.
- **Alternatives considered**: `lazysizes` library — heavier, requires JS. `vite-plugin-image-optimizer` — build-time compression, out of scope (no format conversion). `fetchpriority="high"` on hero — improves LCP but contradicts spec FR-001 (all images lazy) and was excluded by Q1=A.

## Image Dimensions for CLS Prevention

- **Decision**: Every `<img>` that already has explicit `width`/`height` attributes in the design — keep them. Add `width`/`height` to any image that currently lacks them (member avatars, event images in cards).
- **Rationale**: Explicit dimensions prevent Cumulative Layout Shift (CLS) when images load asynchronously. This is a Core Web Vital metric.
- **Alternatives considered**: Using CSS `aspect-ratio` — compatible but requires knowing the ratio. Width/height attributes are the HTML standard and work before CSS loads.

## Memoization Approach

- **Decision**: `React.memo` for `ReplyItem` (pure component, props are primitive values). Isolate `ReplyForm` input state using `useWatch` from react-hook-form to prevent full component re-renders.
- **Rationale**: `React.memo` is sufficient when props are primitive/comparable. `useWatch` subscribes to individual fields without re-rendering the entire form. These two changes address the specific re-render hotspots identified in the spec.
- **Alternatives considered**: `useCallback` on parent event handlers — adds complexity without measured benefit. Virtualized list (`react-window`) — overkill for typical reply counts (<100).

## Animation Optimization

- **Decision**: Reduce CSS fade-in from 500ms to 200ms. Add `@media (prefers-reduced-motion: reduce) { animation: none }` or use Tailwind's `motion-reduce:` variant. Use CSS `transition` instead of JS-driven animation.
- **Rationale**: 200ms is within the "instant" perception threshold (100ms–200ms). CSS-only change is zero-risk. `prefers-reduced-motion` is an accessibility requirement (WCAG 2.1).
- **Alternatives considered**: Removing animation entirely — too abrupt. Using WAAPI (Web Animations API) — unnecessary complexity for a simple fade-in.

## Performance Measurement

- **Decision**: Verify with React DevTools profiler (re-render count) and Chrome DevTools Network/Performance tabs (image loading, animation timing). No Lighthouse CI integration in this phase.
- **Rationale**: The spec's acceptance criteria are verifiable with existing DevTools — no additional tooling needed.
- **Alternatives considered**: Lighthouse CI in GitHub Actions — valuable but out of scope per the spec's "Performance metrics" exclusion.
