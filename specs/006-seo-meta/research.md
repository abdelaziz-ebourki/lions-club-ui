# Research: SEO Meta Implementation

## Head Management Library

- **Decision**: `react-helmet-async`
- **Rationale**: Community standard for CSR SPAs; handles async data loading gracefully; provides `<HelmetProvider>` that slots into existing provider tree; respects React 18+ concurrent features; no SSR required.
- **Alternatives considered**:
  - Custom `useEffect` hook — viable but duplicates render-to-head logic; no concurrent-safe deduplication; no cleanup for nested components.
  - `@unhead/react` — newer, less community adoption; requires different provider pattern.
  - `react-document-meta` — unmaintained, no async support.

## Route Coverage

- **Decision**: 12 public routes get unique SEO metadata; admin routes excluded (noindex implied — not indexed by crawlers).
- **Rationale**: Admin pages are authenticated-only, never publicly linked, and serve no SEO purpose.
- **Alternatives considered**: Adding meta tags to admin pages — unnecessary overhead, no SEO benefit.

## Dynamic Data Flow

- **Decision**: SEO tags update after React Query resolves. During loading, show static fallback title. No intermediate loading state title needed.
- **Rationale**: The spec's edge case already states "document title updates after data loads, not before." Loading skeletons are already rendered — the tab title staying on the static fallback is consistent UX.
- **Alternatives considered**: Showing "Loading..." in title during fetch — adds unnecessary flicker and is not meaningful for SEO crawlers.

## Image Handling for OG

- **Decision**: Use `event.image` for event detail pages; threads always fall back to `/logo.png` (already set as `og:image` in `index.html`). `ForumThread` has no image field — no API change required for this feature.
- **Rationale**: No new API fields needed. The logo is already the default OG image. Event detail pages with images will override it.
- **Alternatives considered**: Creating a separate SEO image endpoint — overkill for this scope.

## Canonical URL Construction

- **Decision**: `window.location.origin + window.location.pathname` strips query params by default; search pages preserve `?q=` param.
- **Rationale**: Matches the spec's assumption. Most routes have no meaningful query params — only search does.
- **Alternatives considered**: Using `useLocation()` from react-router — equivalent result, but `window.location.origin` is simpler for the base URL.

## Special Characters

- **Decision**: No explicit sanitization needed — React handles escaping via its DOM reconciliation.
- **Rationale**: `react-helmet-async` renders through React's normal JSX pipeline, so all values are automatically escaped. Verified against spec clarification.
- **Alternatives considered**: DOMPurify — unnecessary; over-sanitization could break legitimate content.

## SEO Type Definition

- **Decision**: New `SEOMetadata` type in `@/types/index.ts`.
- **Rationale**: Keeps SEO data strongly typed and consistent across all pages. Mirrors existing patterns in the codebase.
- **Fields**: `title`, `description`, `image?`, `ogType`: `"website" | "article"`, `canonical?`: `string`, `noindex?`: `boolean`
