# Research: Responsive Tables

## Responsive Table Pattern

- **Decision**: Use CSS class toggle approach — `<table>` renders both `<th>` headers and data normally on desktop; on mobile (<640px), force each `<tr>` to display as a CSS flex/grid card with pseudo-element labels.
- **Rationale**: This pattern keeps a single DOM tree (no duplicate content), preserves accessibility (screen readers still see tabular structure), and reuses the existing `<AdminTable>` component. No JS breakpoint detection needed.
- **Alternatives considered**:
  - Two separate layouts (table + card, toggle visibility) — doubles DOM, risks sync bugs.
  - `display: contents` — poorly supported in older browsers, breaks table semantics.
  - CSS `grid` with `grid-template-columns` override — complex, harder to maintain.

## Breakpoint Selection

- **Decision**: 640px (`sm` Tailwind breakpoint) for table→card switch. Table layout at ≥640px, card layout below.
- **Rationale**: Matches Tailwind's existing `sm` breakpoint used throughout the project. 640px covers most phones in portrait (iPhone SE: 375px, iPhone 14: 390px, Pixel 7: 412px). No need for a custom breakpoint.
- **Alternatives considered**: 768px (`md`) — too wide, would show cards on tablets in portrait. 480px — too narrow, some phones would still get table layout.

## Card Layout Design

- **Decision**: Each table row becomes a bordered card with field labels rendered via CSS `::before` pseudo-elements using `data-label` attributes or a reusable mapping.
- **Rationale**: Pseudo-elements avoid duplicating label text in both visible and screen-reader contexts. The `data-label` approach is the most maintainable pattern for this.
- **Alternatives considered**: React components rendering separate card elements — more flexible but requires more code changes per table. CSS-only approach is preferable for a pure presentational change.

## AdminTable Component Refactoring

- **Decision**: Extend the existing `<AdminTable>` component to accept a `mobileCardRenderer` prop that produces card content for each row. This keeps the table abstraction intact while adding mobile support.
- **Rationale**: The spec says 5 tables need this treatment. A reusable component avoids duplicating card-rendering logic across all 5 pages. The existing `AdminTable` already has desktop-table+mobile-card pattern foundation.
- **Alternatives considered**: Per-page card components — more flexible per page but violates DRY. Wrapping `<table>` in a HOC — excessive abstraction.

## Forum Tables

- **Decision**: Apply the same card layout to forum category and thread list tables. These use different components than `AdminTable` (likely plain `<table>` or a `ForumTable` variant).
- **Rationale**: The spec covers forum as the first two acceptance scenarios. Same pattern, different component. If forum uses a custom table, refactor it to use the card-rendering pattern too.
- **Alternatives considered**: Leaving forum with hidden columns on mobile — violates the spec's P1 requirement.
