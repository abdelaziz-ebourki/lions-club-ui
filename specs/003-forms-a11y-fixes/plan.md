# Implementation Plan: Forms Validation & Accessibility Fixes

**Branch**: `003-forms-a11y-fixes` | **Date**: 2026-07-03 | **Spec**: specs/003-forms-a11y-fixes/spec.md

**Input**: Feature specification from `specs/003-forms-a11y-fixes/spec.md`

## Summary

Fix 7 form validation gaps (missing "ongoing" event status, missing maxLength on 4 forms, no character counts, no submission spinners, no success feedback) and 12 accessibility violations across the SPA (skip-to-content, aria attributes, roles, aria-current, aria-busy). All changes are mechanical HTML/Zod modifications to existing files — no new pages, routes, or API contracts.

## Technical Context

**Language/Version**: TypeScript 6 (strict mode), React 19, Vite 8

**Primary Dependencies**: react-hook-form v7 + @hookform/resolvers + Zod v4, @tanstack/react-query v5, lucide-react, sonner, Tailwind v4

**Storage**: N/A (client-side SPA — all data via API)

**Testing**: Vitest v4 + @testing-library/react v16 + MSW v2

**Target Platform**: Modern browsers (ES2023), WCAG 2.1 AA

**Project Type**: Single-page application (React SPA)

**Performance Goals**: N/A — these are markup/schema changes with negligible perf impact

**Constraints**: No behavioral regressions; existing test suite (105 tests) must pass; `tsc -b` must pass with zero errors

**Scale/Scope**: 6 forms modified, 8 components modified, 1 new shared component (submit spinner), ~30 files touched total

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Principle I — TDD is Non-Negotiable**
- ✅ Tests CAN be written for: Zod schema validation (accept/reject), character count rendering, spinner visibility during submission, skip-to-content link existence, aria attribute presence
- ⚠️ Exemption may be warranted for: purely mechanical aria-hidden additions (FR-A04 through FR-A08, FR-A13) where the change is adding a single prop with no behavioral logic
- **Decision**: Write tests for all behavioral changes (schema, character count, spinner, skip-to-content, aria-current, aria-busy). Apply minimal/no test for purely static aria-hidden attribute additions — document in Complexity Tracking.

**Principle IV — TypeScript-First, Type-Safe**
- ✅ All changes are type-safe — Zod enums, string constraints, no `any` required

**Principle V — Component & Design System**
- ✅ No new shadcn components needed; spinner can be a simple animated SVG within the existing button/design system
- ✅ Use `cn()` for conditional classes, Tailwind v4 for all styling

**Principle VI — Best Practices & WCAG 2.1 AA**
- ✅ Accessibility fixes directly target WCAG 2.1 AA compliance (SC 2.4.1 skip nav, SC 4.1.2 ARIA roles/states, SC 4.1.3 status messages)

**Gate Result (post-design)**: PASS — no violations remain. TDD exemption for static aria-hidden attributes documented in Complexity Tracking. All behavioral changes have test scenarios defined in quickstart.md. Type-safe, no new shadcn components, WCAG 2.1 AA targeted.

## Project Structure

### Documentation (this feature)

```text
specs/003-forms-a11y-fixes/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output — best practices for spinner, skip-link, aria-current
├── data-model.md        # Phase 1 output — Zod schema changes, aria contract
├── quickstart.md        # Phase 1 output — validation scenarios
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── layout/
│   │   ├── shell.tsx          # + skip-to-content link
│   │   ├── header.tsx         # + aria-label, + aria-current
│   │   └── footer.tsx         # fix social SVG aria-label, + aria-hidden on contact icons
│   ├── ui/
│   │   └── spinner.tsx        # NEW — shared animated submit spinner
│   └── forum/
│       ├── reply-item.tsx     # + aria-hidden on avatar wrapper
│       └── reply-list.tsx     # h3 → h2 (heading hierarchy)
├── pages/
│   ├── admin/
│   │   ├── event-form.tsx     # + "ongoing" in Zod enum, rm coercion, + maxLength, + char count, + spinner, + success glow
│   │   ├── member-form.tsx    # + maxLength, + char count, + spinner, + success glow
│   │   └── admin-layout.tsx   # + aria-label on nav, + aria-current on links
│   ├── contact/
│   │   └── contact.tsx        # + maxLength, + char count, + spinner, + success glow
│   ├── events/
│   │   └── event-detail.tsx   # + aria-hidden on ArrowLeft
│   ├── forum/
│   │   ├── forum.tsx          # + aria-hidden on category Icon
│   │   ├── threads.tsx        # + aria-hidden on MessageSquare, + aria-busy on loading
│   │   └── new-thread-form.tsx # + maxLength, + char count, + spinner, + success glow
│   └── not-found.tsx          # + role="alert"
```

**Structure Decision**: Frontend-only SPA. All files are modified in-place within the existing `src/` tree. One new file: `src/components/ui/spinner.tsx`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| TDD exemption for FR-A04–FR-A08, FR-A13 | Adding `aria-hidden="true"` to decorative SVGs is a static prop — no behavioral code path to test. Testing that `aria-hidden` exists on an `<svg>` validates the markup framework works, not the feature. | Could write trivial "renders with aria-hidden" assertions, but they provide zero regression value and duplicate framework trust tests. |

## Phase 0: Research

The spec has zero [NEEDS CLARIFICATION] markers. Research tasks focus on best-practice patterns:

1. **Spinner component pattern**: Research accessible loading spinner patterns for React buttons — SVG vs CSS, aria-label conventions
2. **Skip-to-content pattern**: Standard accessible skip-link implementation for React SPAs
3. **Success animation pattern**: Transient green border/glow feedback for form fields
4. **Character count UX**: Positioning, color transitions (orange at 80%, red at 100%), screen-reader announcements via aria-live
