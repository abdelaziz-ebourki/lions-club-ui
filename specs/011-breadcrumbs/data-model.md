# Data Model: Breadcrumb Navigation

**Phase**: Phase 1 — Design & Contracts
**Date**: 2026-07-11

## Entity: BreadcrumbSegment

Core type for a single step in the breadcrumb trail.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | `string` | Yes | Display text for the segment (e.g., "Forum", "Events", thread title). Plain text, no HTML. |
| `href` | `string` | No | URL path for clickable segments. Omitted on the last/current segment. |

### Validation Rules

- `label` MUST be non-empty, trimmed
- `href` when present MUST start with `/`
- If `href` is omitted, the segment renders as plain text (current page)

### State Transitions

The `BreadcrumbSegment` itself is immutable. The dynamic labels evolve externally:
1. **Loading**: Segment label is a skeleton placeholder (shadcn `Skeleton` component)
2. **Loaded**: Segment label is the resolved API value (e.g., thread title, event name)
3. **Error**: Segment label becomes "Unknown" (non-link, plain text)

## Composition: BreadcrumbTrail

Typed as `BreadcrumbSegment[]`. Represents the full trail from root to current page.

| Aspect | Detail |
|--------|--------|
| **Min length** | 1 (just the current page, e.g., ["Page Not Found"]) |
| **Max length** | 4 (e.g., ["Home", "Admin", "Events", "Edit Event Title"]) |
| **Last item** | Always has no `href` (current page, non-clickable) |
| **All other items** | Must have `href` (clickable links back) |

### Trail Definitions by Route

See [contracts/breadcrumb-contracts.md](./contracts/breadcrumb-contracts.md) for the complete trail map.
