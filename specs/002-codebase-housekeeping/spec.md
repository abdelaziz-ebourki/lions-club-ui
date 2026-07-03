# Feature Specification: Codebase Housekeeping

**Feature Directory**: `specs/002-codebase-housekeeping`

**Created**: 2026-07-03

**Status**: Draft

**Input**: Fix Batch 1 — code quality cleanup (#21), unused code removal (#22), font loading warnings (#11)

## Clarifications

### Session 2026-07-03

- Q: Should test setup re-architecture (FR-010) be included in this batch? → A: Deferred — tracked in #21 part 5, tackle in a later batch.
- Q: FR-009 — extract categories to a config file or fetch from API? → A: Extract to a config file in `@/config/`.

## User Scenarios & Testing

### User Story 1 — Clean Up Code Quality Issues (Priority: P1)

As a developer, I want duplicate type definitions removed, unused dependencies eliminated, and magic numbers extracted into named constants so that the codebase is consistent, maintainable, and easy to work with.

**Why this priority**: These are code quality bugs (medium severity) that cause maintenance overhead and potential divergence between type definitions. The unused dependencies bloat the project.

**Independent Test**: Run `npx tsc -b` and `npm run lint` — both should pass without errors. Run `vitest run` — all existing tests should pass unchanged.

**Acceptance Scenarios**:

1. **Given** the `admin-messages.tsx` file, **When** reviewing its type definitions, **Then** it should import `ContactMessage` from `@/types` instead of defining a local interface with `read: boolean`
2. **Given** the project dependencies in `package.json`, **When** auditing for unused packages, **Then** `cmdk` should be removed (note: `shadcn` is retained — provides `shadcn/tailwind.css` for Tailwind v4)
3. **Given** hardcoded numeric values in `App.tsx`, `lib/search.ts`, and mock handlers, **When** reviewing the code, **Then** each magic number should be extracted to a named constant with a descriptive name
4. **Given** the `register.tsx` file, **When** reviewing, **Then** the `void _unused` dead-code pattern should be removed
5. **Given** the lazy-import exports in `App.tsx`, **When** comparing against exported function names, **Then** they should use consistent naming (`m.X` vs `m.XPage`)
6. **Given** the test architecture, **When** reviewing, **Then** the test setup re-architecture is deferred to a later batch (tracked in #21)

---

### User Story 2 — Remove Unused Components and Dead Code (Priority: P2)

As a developer, I want unused UI components and dead files removed from the codebase so that the project is smaller, faster to build, and easier to navigate.

**Why this priority**: Enhances developer experience and build performance by eliminating dead weight. Low risk.

**Independent Test**: Run `npx tsc -b` and `npm run lint` — both should pass. The app should build and run without errors. Verify removed components are not imported anywhere.

**Acceptance Scenarios**:

1. **Given** unused UI components, **When** cleaning up, **Then** the following files should be removed (verified by fallow static analysis): `alert.tsx`, `avatar.tsx`, `command.tsx`, `dialog.tsx`, `dropdown-menu.tsx`, `form.tsx`, `input-group.tsx`, `navigation-menu.tsx`, `pagination.tsx`, `scroll-area.tsx`, `toggle.tsx`, `toggle-group.tsx`. Their exports must also be removed from `ui/index.ts`.
2. **Given** unused barrel files, **When** cleaning up, **Then** `src/components/forum/index.ts` and `src/components/search/index.ts` should be removed (all consumers import component files directly)

---

### User Story 3 — Fix Font Loading Warnings (Priority: P3)

As a developer, I want the browser console to be free of OTS parsing errors for Playfair Display and Noto Sans so that I can debug without noise.

**Why this priority**: Cosmetic issue — low impact. Console warnings cause confusion during development but don't affect rendering.

**Independent Test**: Open browser console in dev mode — no OTS parsing errors or "Failed to decode downloaded font" messages should appear.

**Acceptance Scenarios**:

1. **Given** the font loading setup, **When** the app loads in a browser, **Then** the console should show no OTS parsing errors for playfair-display or noto-sans `.woff2` files
2. **Given** the font loading setup, **When** the app renders, **Then** it should load only the three fonts used: Cinzel, Cormorant Garamond, and Crimson Pro
3. **Given** duplicate CSS typography definitions in `index.css`, **When** reviewing, **Then** the `@theme inline` definitions and `@layer utilities` classes should be consolidated to a single source of truth
4. **Given** hardcoded category option strings in `event-form.tsx`, **When** reviewing, **Then** they should be extracted to a config file in `@/config/`

### Edge Cases

- What happens if a component marked as unused is actually imported transitively? (Verify with thorough grep before deleting.)
- What if removing a dependency breaks a transitive import? (Verify with `tsc -b` and `vitest run`.)
- How to handle font references that might come from node_modules? (Only clean up explicit CSS `@import` statements and `index.html` references.)

## Requirements

### Functional Requirements

- **FR-001**: The `admin-messages.tsx` file MUST import `ContactMessage` from `@/types` rather than defining a local interface
- **FR-002**: The unused npm dependency `cmdk` MUST be removed from `package.json` (Note: `shadcn` is retained — it provides `shadcn/tailwind.css` imported in `index.css`)
- **FR-003**: All magic numbers in `App.tsx` (staleTime, retry count), `lib/search.ts` (query limits, snippet windows), and `mocks/handlers/auth.ts` (cookie maxAge) MUST be extracted to named constants
- **FR-004**: The dead code pattern `void _unused` in `register.tsx` MUST be removed
- **FR-005**: Lazy-export naming inconsistency in `App.tsx` MUST be fixed to use consistent `m.XPage` naming
- **FR-006**: (Fallow-verified) 12 unused UI component files MUST be removed: `alert.tsx`, `avatar.tsx`, `command.tsx`, `dialog.tsx`, `dropdown-menu.tsx`, `form.tsx`, `input-group.tsx`, `navigation-menu.tsx`, `pagination.tsx`, `scroll-area.tsx`, `toggle.tsx`, `toggle-group.tsx`. Their exports MUST also be removed from `ui/index.ts`.
- **FR-007**: (Fallow-verified) 2 unused barrel files MUST be removed: `src/components/forum/index.ts`, `src/components/search/index.ts` (component files are imported directly in page components)
- **FR-008**: Unused exports MUST be removed from files that stay: `AlertDialogMedia`, `AlertDialogOverlay`, `AlertDialogPortal`; `badgeVariants`; `buttonVariants`; `CardFooter`, `CardAction`; `FieldDescription`, `FieldLegend`, `FieldSeparator`, `FieldSet`, `FieldTitle`; `SelectGroup`, `SelectLabel`, `SelectScrollDownButton`, `SelectScrollUpButton`, `SelectSeparator`; `SheetClose`, `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription`; `TableFooter`, `TableCaption`; `TabsContent`, `tabsListVariants`; `Tooltip`, `TooltipTrigger`, `TooltipContent`
- **FR-009**: (Fallow-verified) Unused type `SearchState` MUST be removed from `@/types/index.ts`
- **FR-010**: Duplicate CSS typography definitions in `index.css` MUST be consolidated to a single source of truth
- **FR-011**: Hardcoded category options in `event-form.tsx` MUST be extracted to a config file in `@/config/`
- **FR-012**: (DEFERRED) Test setup re-architecture to use MSW handlers — tracked in #21, part 5, to be addressed in a later batch
- **FR-013**: Stray font references to Playfair Display and Noto Sans causing OTS parsing errors MUST be investigated and removed
- **FR-014**: Font loading MUST only load the three intended fonts (Cinzel, Cormorant Garamond, Crimson Pro)

### Key Entities

- **UI Component**: A reusable renderable unit in `src/components/ui/`. Each has a single file plus an entry in the barrel `index.ts`.
- **Named Constant**: A `const` declaration with a descriptive name, extracted from a magic number literal, stored in the relevant module or config.
- **Font Reference**: A CSS `@import` or HTML `<link>` that loads a web font file.

## Success Criteria

### Measurable Outcomes

- **SC-001**: `npx tsc -b` completes with zero errors after all changes
- **SC-002**: `npm run lint` passes with zero warnings
- **SC-003**: `vitest run` passes with the same number of tests as before the changes (no regressions)
- **SC-004**: Bundle size (measured via `vite build` output) shows a measurable reduction from removed components and dependencies
- **SC-005**: Browser console shows no OTS parsing errors for any font file

## Assumptions

- Components listed as unused have been verified by grep to have zero imports outside the barrel file
- The `form.tsx` component is unused because all forms use the `Field` component family instead
- Font warnings may originate from transitive dependencies or previously removed font imports — investigation is required
- Existing tests will continue to pass because no business logic is being changed — only dead code is removed
- The `admin-messages.tsx` local interface (`read: boolean`) should be replaced with the canonical `ContactMessage` type from `@/types` using `status: ContactMessageStatus`
