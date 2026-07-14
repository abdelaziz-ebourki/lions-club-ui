# SEO Requirements Quality Checklist

**Purpose**: Validate SEO requirements completeness, clarity, consistency, and measurability
**Created**: 2026-07-14
**Feature**: [spec.md](../spec.md), [plan.md](../plan.md), [data-model.md](../data-model.md)

## Requirement Completeness

- [ ] CHK001 — Are all public routes (12+ including search, new thread, verify-email, profile) enumerated with explicit title, description, canonical, OG, and Twitter tag requirements? [Completeness, Spec §FR-001–FR-016]
- [ ] CHK002 — Are admin route SEO requirements specified (noindex, generic title) in the spec, or only in the plan? [Gap, Spec §FR-001 vs Plan §Route Inventory]
- [ ] CHK003 — Is the 160-character truncation rule for dynamic descriptions explicitly linked to the source field (`event.description` vs `thread.content`) for each dynamic page type? [Completeness, Spec §FR-007]
- [ ] CHK004 — Are Twitter Card requirements complete — are `twitter:site` or `twitter:creator` tags specified, or intentionally omitted? [Completeness, Gap]

## Requirement Clarity

- [ ] CHK005 — Is "page-appropriate description" (FR-006) defined with explicit content for every route, or does the events listing page (US2-S2) still use the vague "describing the events listing" phrasing? [Clarity, Spec §FR-006, US2-S2]
- [ ] CHK006 — Is "meaningful meta description" (SC-002) quantified or defined with objective verification criteria? [Clarity, Spec §SC-002]
- [ ] CHK007 — Are "tracking parameters" (FR-009) explicitly listed or defined by pattern (e.g., `utm_*`, `fbclid`) for canonical URL construction? [Clarity, Spec §FR-009]
- [ ] CHK008 — Is the "10+ routes" count (SC-001) explicitly enumerated to resolve which routes are included and which are excluded? [Clarity, Spec §SC-001]
- [ ] CHK009 — Should the search results meta description (US2-S9) include the search query in the description text, matching the title pattern in FR-005? [Clarity, Consistency, Spec §US2-S9 vs FR-005]

## Requirement Consistency

- [x] CHK010 — Does the spec assumption conflict with the plan's library choice? [Conflict, Spec §Assumptions vs Plan §Technical Context] — **RESOLVED**: Spec assumption updated to use `react-helmet-async`, aligning with plan and industry standard
- [x] CHK011 — Is the OG image fallback path consistent between FR-015, the data model, and `index.html`? [Conflict, Spec §FR-015 vs data-model.md vs index.html] — **RESOLVED**: All references unified to `/logo.png`
- [ ] CHK012 — Do the acceptance scenarios for Open Graph (US4) cover all tags listed in FR-011/FR-012, and is the `og:type` differentiation between `"website"` and `"article"` consistently applied? [Consistency, Spec §US4 vs FR-011/FR-013]

## Acceptance Criteria Measurability

- [ ] CHK013 — Can SC-002 ("all routes include a meaningful meta description") be objectively verified without subjective judgment? [Measurability, Spec §SC-002]
- [ ] CHK014 — Are the "Independent Test" descriptions for each user story actionable for both manual verification and automated test assertion? [Measurability, Spec §US1–§US4]
- [ ] CHK015 — Is the canonical URL verification scope (every page vs representative sample) defined in the acceptance criteria? [Measurability, Spec §US3-AS1]

## Scenario Coverage

- [ ] CHK016 — Is the behavior specified for pre-existing HTML meta tags (`og:image` in `index.html`) — should they be replaced, augmented, or left as unconditional fallbacks? [Coverage, Gap]
- [ ] CHK017 — Is the SEO behavior for lazy-loaded (Suspense) routes defined, including what happens to title/description during the Suspense fallback before the page module loads? [Coverage, Spec §FR-010, Edge Cases]
- [ ] CHK018 — Are requirements defined for pages not publicly linked (profile, verify-email) — should they set `noindex` or remain indexable? [Coverage, Gap]

## Edge Case Coverage

- [ ] CHK019 — Are requirements or guidance specified for very long event/thread titles exceeding typical `<title>` length recommendations (50–60 characters)? [Edge Case, Gap]
- [ ] CHK020 — Is the behavior specified when `og:image` URL resolves to a broken or deleted image resource? [Edge Case, Gap]
- [ ] CHK021 — Is the behavior specified when dynamically loaded content includes HTML within title/description fields (e.g., rich text content)? [Edge Case, Spec §Edge Cases]

## Non-Functional Requirements

- [ ] CHK022 — Is the performance impact of head tag updates on route changes quantified or bounded (e.g., maximum DOM mutations per navigation)? [NFR, Gap]
- [ ] CHK023 — Is the bundle size impact of adding `react-helmet-async` documented or constrained? [NFR, Gap]

## Dependencies & Assumptions

- [x] CHK024 — Is the existence of `/logo.png` in `public/` validated, or is it an unchecked assumption? [Assumption, Spec §Assumptions vs FR-015] — **RESOLVED**: `/logo.png` confirmed as the fallback; spec assumption updated to reference `/logo.png`
- [ ] CHK025 — Is the dependency on React Query data availability for dynamic SEO tagged as a coupling risk? [Dependency, Spec §Assumptions]
- [ ] CHK026 — Is the "no SSR — pure CSR" tradeoff documented with its implication (limited crawler support for non-JS bots)? [Assumption, Spec §Out of Scope]
