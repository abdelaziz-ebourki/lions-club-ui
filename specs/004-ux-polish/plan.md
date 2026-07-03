# Implementation Plan: UX Polish

**Branch**: `004-ux-polish` | **Date**: 2026-07-03 | **Spec**: specs/004-ux-polish/spec.md

**Input**: Feature specification from `specs/004-ux-polish/spec.md`

## Summary

Add loading skeletons, empty states, "Remember me" on login, RSVP on event detail, and success toasts on login/register — closing 5 UX gaps across the SPA. All changes are HTML/CSS additions, Zustand-less local state, and existing sonner toasts.

## Technical Context

**Language/Version**: TypeScript 6 (strict mode), React 19, Vite 8, ESM

**Primary Dependencies**: @tanstack/react-query v5, react-hook-form v7, sonner, lucide-react, Tailwind v4

**Storage**: N/A (client-side SPA — cookies via httpOnly for sessions, localStorage for "Remember me" hint)

**Testing**: Vitest v4 + @testing-library/react v16 + MSW v2

**Target Platform**: Modern browsers (ES2023), WCAG 2.1 AA

**Project Type**: Single-page application (React SPA)

**Performance Goals**: N/A — skeleton/empty-state renders are markup-only, negligible perf impact

**Constraints**: No regressions; existing test suite must pass; tsc -b zero errors; RSVP requires backend endpoint but can be tested optimistically

**Scale/Scope**: 10+ components modified, 1 new shared component (EmptyState), ~20 files touched

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Principle I — TDD is Non-Negotiable**
- ✅ All behavioral changes are testable: skeleton visibility, empty state rendering, RSVP click/state, "Remember me" checkbox presence, toast calls
- ⚠️ Empty state rendering (FR-006 through FR-010) where no conditional logic exists is a static render pattern — minor TDD exemption may apply for purely visual empty states that are always-rendered conditional branches
- **Decision**: Write tests for all behavioral changes. Static empty state rendering (conditionally shown JSX) is a component render test — trivial to write, so no exemption needed.

**Principle IV — TypeScript-First, Type-Safe**
- ✅ All changes are type-safe — RSVP response shape, event type augmentation, checkbox state. No `any` required.

**Principle V — Component & Design System**
- ✅ Skeleton is an existing shadcn/ui primitive already in the project
- ✅ EmptyState can be built with existing Card/Button primitives
- ✅ Use `cn()` for conditional classes, Tailwind v4 for styling
- ✅ No new shadcn components needed

**Principle VI — Best Practices & WCAG 2.1 AA**
- ✅ Skeletons must not trap focus or announce misleading content (use `aria-hidden` during skeleton display)
- ✅ Empty states must be reachable and announced by screen readers (use `role="status"` or appropriate ARIA)

**Gate Result (post-design)**: PASS — no violations. All changes are component-level additions within existing patterns.

## Project Structure

### Documentation (this feature)

```text
specs/004-ux-polish/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── rsvp.md          # RSVP API contract
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── layout/
│   │   ├── admin-layout.tsx    # loading state → skeleton (admin list pages)
│   │   └── shell.tsx           # loading/empty state already handled
│   ├── shared/
│   │   └── empty-state.tsx     # NEW — reusable empty state component
│   ├── ui/
│   │   └── skeleton.tsx        # EXISTING — used for skeleton placeholders
│   ├── forum/
│   │   ├── forum.tsx           # + empty state for categories, skeleton loading
│   │   ├── threads.tsx         # + empty state for threads, skeleton loading
│   │   ├── thread-detail.tsx   # + empty state for replies
│   │   └── reply-item.tsx      # no change needed
│   └── search/
│       └── search-results.tsx  # + skeleton loading, + empty state
├── pages/
│   ├── admin/
│   │   ├── events.tsx          # + skeleton, + empty state
│   │   ├── members.tsx         # + skeleton, + empty state
│   │   └── event-form.tsx      # no change
│   ├── auth/
│   │   ├── login.tsx           # + "Remember me" checkbox, + success toast
│   │   └── register.tsx        # + success toast
│   └── events/
│       └── event-detail.tsx    # + RSVP button, + RSVP state
```

**Structure Decision**: Frontend-only SPA. All files modified in-place. One shared component: `src/components/shared/empty-state.tsx`. One new contract document: `contracts/rsvp.md`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | No constitutional violations — all changes are straightforward component additions | — |

## Phase 0: Research

No [NEEDS CLARIFICATION] markers in spec. Research tasks focus on best-practice patterns:

1. **Skeleton pattern**: Confirm existing shadcn/ui Skeleton component usage — how it's used in forum.tsx currently, ensure consistency
2. **EmptyState pattern**: Best practice for reusable empty state component with icon, message, and CTA slot
3. **"Remember me" implementation**: Client-side approach — localStorage flag to request longer session, or cookie-based if backend supports it
4. **RSVP API contract**: Determine required request/response shape for `POST /events/:id/rsvp`
