# Implementation Plan: Codebase Housekeeping

**Branch**: `002-codebase-housekeeping` | **Date**: 2026-07-03 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-codebase-housekeeping/spec.md`

## Summary

Codebase cleanup addressing 3 GitHub issues: code quality (#21), unused code (#22), and font loading warnings (#11). Tasks include removing duplicate types and unused dependencies, extracting magic numbers to named constants, cleaning up dead code patterns and unused UI components, consolidating duplicate CSS, extracting hardcoded categories to config, fixing lazy-export naming, and eliminating font OTS parsing errors.

## Technical Context

**Language/Version**: TypeScript 6.0, React 19, Vite 8.1

**Primary Dependencies**: @tanstack/react-query v5, react-router-dom v7, react-hook-form v7, Zod v4, sonner, Tailwind v4, shadcn/ui "base-sera", lucide-react

**Storage**: N/A (cleanup — no new persistence)

**Testing**: Vitest v4 + @testing-library/react v16 + MSW v2

**Target Platform**: Modern browsers (ES2023)

**Project Type**: Single-page application (React + Vite)

**Performance Goals**: Bundle size reduction from removing unused components/deps. Measurable via `vite build` output comparison.

**Constraints**: Must maintain backward compatibility — zero regressions in existing functionality. All existing tests must pass unchanged.

**Scale/Scope**: ~20 files touched across src/ (UI components, config, pages, mocks). No new features or API changes.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Principle I (TDD is Non-Negotiable)**: This is a cleanup batch (removing dead code, extracting constants) — no new features. Tests exist for existing functionality and must continue to pass. No new testable behavior is being introduced. ✅ Cleared.

**Principle II (Agent Skills Discipline)**: The `tdd` skill is not needed as no new testable behavior is added. `git-commit` skill will be loaded before committing. ✅ Cleared.

**Principle IV (TypeScript-First)**: All changes maintain strict typing. No `any` introduced. Removing a duplicate local interface in favor of canonical types improves type safety. ✅ Cleared.

**Principle V (Design System Discipline)**: Removing unused shadcn UI components (not the components themselves, but unused files in `components/ui/`). Component tree is simplified. ✅ Cleared.

**Principle VI (Best Practices)**: Bundle optimization, dead code removal, constant extraction all align with best practices. ✅ Cleared.

**GATE: PASS** — No violations. Complexity Tracking section not needed.

## Project Structure

### Documentation (this feature)

```text
specs/002-codebase-housekeeping/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output — validation guide
└── checklists/
    └── requirements.md  # Quality checklist
```

### Source Code (repository root)

```text
# Option 1: Single project (SINGLE PAGE APPLICATION)
src/
├── components/ui/       # Delete 12 unused components (fallow-verified), update barrel
│   # alert.tsx, avatar.tsx, command.tsx, dialog.tsx, dropdown-menu.tsx,
│   # form.tsx, input-group.tsx, navigation-menu.tsx, pagination.tsx,
│   # scroll-area.tsx, toggle.tsx, toggle-group.tsx
├── components/forum/    # Delete unused barrel index.ts
├── components/search/   # Delete unused barrel index.ts
├── lib/
│   ├── search.ts        # Extract magic numbers to named constants
│   └── index.ts         # Unchanged
├── config/
│   └── index.ts         # Add eventCategories config array (FR-011)
├── pages/
│   ├── auth/
│   │   └── register.tsx # Remove void _unused pattern
│   └── admin/
│       ├── event-form.tsx       # Reference categories from config (FR-011)
│       └── admin-messages.tsx   # Import ContactMessage from @/types (FR-001)
├── components/ui/ *.tsx  # Remove ~35 unused sub-exports from files that stay (FR-008)
├── types/
│   └── index.ts          # Remove unused SearchState type (FR-009)
├── App.tsx               # Fix lazy-export naming, extract staleTime constant
├── index.css             # Consolidate duplicate typography, remove stray font refs
├── contexts/
│   └── auth.tsx          # Unchanged

src/mocks/
└── handlers/
    └── auth.ts           # Extract cookie maxAge constant

src/test/
└── setup.ts              # Unchanged (test re-architecture deferred — FR-012)

package.json              # Remove cmdk dep
```

**Structure Decision**: Single project (existing structure). No structural changes needed — we are editing existing files only.

## Complexity Tracking

No Constitution violations — Complexity Tracking section is not required.
