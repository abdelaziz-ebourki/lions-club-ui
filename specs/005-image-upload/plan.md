# Implementation Plan: Image Upload

**Branch**: `005-image-upload` | **Date**: 2026-07-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-image-upload/spec.md`

## Summary

Add file upload fields to the event and member admin forms so admins can attach images (event photos, member avatars). Images are sent as multipart/form-data in a single POST/PUT request alongside the entity's text fields. The images are then displayed on the public-facing pages (event detail, events list, about page member cards).

## Technical Context

**Language/Version**: TypeScript 6 (strict mode)

**Primary Dependencies**: React 19, react-hook-form v7 + Zod v4, @tanstack/react-query v5, MSW v2 (mocks)

**Storage**: Mock-only (picsum.photos placeholder URLs in MSW data). Production backend handles actual file storage — frontend sends FormData.

**Testing**: Vitest v4 + @testing-library/react v16

**Target Platform**: Modern browsers (ES2023)

**Project Type**: Single-page application (Vite 8)

**Performance Goals**: Image preview via `URL.createObjectURL()` — no server round-trip for preview. Client-side validation within 1s of file selection.

**Constraints**: File upload fields accept only PNG/JPG/WebP, max 5MB. Client-side validation only (server-side assumed).

**Scale/Scope**: 2 forms (event + member), 5 public display surfaces.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. TDD is Non-Negotiable | ✅ PASS | Tests written before changes, schema + component tests pass |
| II. Agent Skills Discipline | ✅ PASS | tdd, git-commit, shadcn skills loaded |
| III. MCP-First Tooling | ✅ PASS | shadcn-ui MCP queried (no file-upload component exists) |
| IV. TypeScript-First, Type-Safe | ✅ PASS | No `any`, Zod schemas, strict mode |
| V. Component & Design System | ✅ PASS | cn(), shadcn primitives, named exports, Tailwind v4 |
| VI. Best Practices | ✅ PASS | React.lazy + Suspense, react-query, cookie auth, MSW mocks |

No violations — all gates pass.

## Project Structure

### Documentation (this feature)

```text
specs/005-image-upload/
├── spec.md              # Feature specification
├── plan.md              # This file
├── data-model.md        # Data model reference
└── quickstart.md        # Validation scenarios
```

### Source Code (repository root)

```text
src/
├── lib/
│   └── api.ts                           # +upload() method
├── components/
│   └── ui/
│       └── file-upload.tsx              # Reusable upload component
├── pages/
│   ├── admin/
│   │   ├── event-form.tsx               # +image field + FormData
│   │   ├── member-form.tsx              # +avatar field + FormData
│   │   └── __tests__/
│   │       ├── event-form.test.tsx       # +image tests
│   │       └── member-form.test.tsx      # +avatar tests
│   ├── events/
│   │   ├── event-detail.tsx             # +hero image rendering
│   │   └── events.tsx                   # +card image rendering
│   └── about/
│       └── about.tsx                    # +avatar rendering
└── mocks/
    ├── data/
    │   ├── events.ts                    # +image URLs
    │   └── members.ts                   # +avatar URLs
    └── handlers/
        ├── events.ts                    # +multipart/form-data parsing
        └── members.ts                   # +multipart/form-data parsing
```

## Complexity Tracking

No constitutional violations. No complexity justification needed.
