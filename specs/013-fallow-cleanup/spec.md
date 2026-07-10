# Feature Specification: Fallow Findings Cleanup

**Feature Branch**: `013-fallow-cleanup`

**Created**: 2026-07-10

**Status**: Draft

**Input**: User description: "Handle all fallow findings to establish a stable codebase before implementing further features"

## Clarifications

### Session 2026-07-10

- Q: Duplication extraction scope — how aggressive? → A: Pragmatic extraction — extract the 5 clearest patterns (success-timer hook, hero section, event metadata, error/loading, email/card), leave remaining patterns with fallow-ignore-next-line comments. Target ~4.5% duplication.
- Q (analyze remediation): How to handle FR-010 table-head/empty-state inconsistency? → A: Extract it — the spec says extract, so extract it as a 6th pattern. Update scope to 6 patterns.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Codebase has no dead code (Priority: P1)

A developer runs fallow dead-code analysis. All previously reported unused files, unused types, and unused dependencies have been removed — the analysis returns zero findings for dead code.

**Why this priority**: Dead code increases maintenance surface area and cognitive load. Removing it is the fastest path to a cleaner codebase.

**Independent Test**: Run `fallow dead-code --format json --quiet` and verify zero findings for unused files, unused types, unused dependencies, and unused dev dependencies.

**Acceptance Scenarios**:

1. **Given** the fallow dead-code analysis, **When** checking for unused files, **Then** no unused files are reported
2. **Given** the fallow dead-code analysis, **When** checking for unused types, **Then** no unused types are reported
3. **Given** the fallow dead-code analysis, **When** checking for unused dependencies, **Then** no unused production dependencies are reported
4. **Given** the fallow dead-code analysis, **When** checking for test-only dependencies, **Then** no test-only dependencies are reported

---

### User Story 2 — Code duplication is reduced by extracting shared patterns (Priority: P2)

A developer maintains a form-heavy page (event, member, contact, thread). Instead of maintaining the same success-timer state pattern across 4 separate files, the logic lives in one reusable hook. Similarly, the hero section pattern duplicated across contact, events, and forum pages is extracted to a shared component. Patterns whose extraction would introduce complexity due to differing details are left intact and suppressed with `fallow-ignore-next-line` comments.

**Why this priority**: Code duplication is the single largest source of technical debt in the project (6.2% duplication across 14 files). Reducing it makes the codebase easier to maintain and less error-prone.

**Independent Test**: Run `fallow dupes --format json --quiet` and verify total duplication percentage is below approximately 4% (down from 6.2%), with 6 clear patterns extracted.

**Acceptance Scenarios**:

1. **Given** the fallow duplication analysis, **When** checking total duplication percentage, **Then** it is below 4%
2. **Given** the admin forms (event, member), **When** checking for duplication between them, **Then** the table-head and empty-state patterns are extracted to a shared component
3. **Given** the form pages (event, member, contact, new-thread), **When** checking for the success-timer pattern, **Then** it is extracted to a shared hook
4. **Given** the auth pages (login, register), **When** checking for duplication, **Then** the card layout and email field patterns are extracted to a shared component
5. **Given** the hero sections (contact, events, forum), **When** checking for duplication, **Then** the hero pattern is extracted to a shared component
6. **Given** event metadata display (event-detail, events), **When** checking for duplication, **Then** the Calendar/Clock/MapPin pattern is extracted to a shared component
7. **Given** the error/loading state in forum pages (forum, threads), **When** checking for duplication, **Then** the error/loading pattern is extracted to a shared component
8. **Given** remaining duplication patterns beyond the 6 extracted, **When** checking the codebase, **Then** they are suppressed with `fallow-ignore-next-line` comments and documented rationale

---

### User Story 3 — Complexity hotspots are tamed (Priority: P3)

A developer works on the large components identified as hotspots. Large functions (Header at 233 lines, EventFormPage at 219 lines, ContactPage at 201 lines) are broken down into smaller, focused sub-components or hooks. The API client (`src/lib/api.ts`) is restructured to reduce its blast radius.

**Why this priority**: Complexity hotspots are the riskiest files to change. Refactoring them reduces the chance of introducing bugs.

**Independent Test**: Run `fallow health --format json --quiet` and verify no function exceeds 150 lines and no file has a hotspot score above 40.

**Acceptance Scenarios**:

1. **Given** the fallow complexity analysis, **When** checking for large functions, **Then** no function exceeds 150 lines
2. **Given** the fallow health analysis, **When** checking for refactoring targets, **Then** no file has a hotspot score above 40
3. **Given** the API client (`src/lib/api.ts`), **When** checking its structure, **Then** it is split to reduce the number of direct dependents per module

---

### Edge Cases

- What happens when fallow reports findings that are expected false positives (e.g., SSRF in api.ts)? — Suppress with a file-level fallow-ignore comment and document the rationale
- What happens when extracting shared code introduces new regressions? — Existing test suite must continue to pass
- What happens when a shared extraction cannot cover all cases due to subtle differences? — Leave the duplication and suppress with fallow-ignore-next-line, documenting the reason
- What happens when breaking up a large function breaks existing tests? — Tests must be updated to cover the new component/hook API, not just the old integrated behavior

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Delete the unused file `src/components/ui/index.ts`
- **FR-002**: Remove unused type exports for `VerifyResult`, `NotificationState`, and `EmailVerificationStatus` (or mark with fallow-ignore if they are intended for future use)
- **FR-003**: Move `@radix-ui/react-slot` from `dependencies` to `devDependencies` or remove it entirely
- **FR-004**: Move `@tailwindcss/vite` from `dependencies` to `devDependencies`
- **FR-005**: Extract the success-timer state pattern (useState + useRef + useEffect cleanup) into a shared hook used by event-form, member-form, contact, and new-thread-form
- **FR-006**: Extract the hero section pattern (border-b bg-muted/50 + overline + h1 + description) into a shared component used by contact, events, and forum pages
- **FR-007**: Extract the event metadata display (Calendar + Clock + MapPin) into a shared component used by event-detail and events
- **FR-008**: Extract the error/loading state pattern from forum.tsx and threads.tsx into a shared component
- **FR-009**: Extract the card layout and email field pattern from login.tsx and register.tsx into a shared component
- **FR-010**: Extract the table-head and empty-state patterns from admin-events.tsx and admin-members.tsx into a shared component
- **FR-011**: Refactor the Header component to reduce its function size below 150 lines by extracting sub-components
- **FR-012**: Refactor EventFormPage to reduce its function size below 150 lines
- **FR-013**: Refactor ContactPage to reduce its function size below 150 lines
- **FR-014**: Refactor ThreadsPage to reduce its function size below 150 lines
- **FR-015**: Restructure `src/lib/api.ts` to reduce its blast radius — split the generic request logic from the typed endpoint wrappers
- **FR-016**: Suppress SSRF security findings in `src/lib/api.ts` with a file-level fallow-ignore comment, documenting that the URL base is a constant and not user-controlled
- **FR-017**: All existing tests MUST continue to pass after all changes

### Key Entities *(include if feature involves data)*

- N/A — This feature is purely about codebase restructuring. No new data entities.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Fallow dead-code analysis returns zero findings for unused files, types, and dependencies
- **SC-002**: Fallow duplication analysis reports total duplication below 4% (down from 6.2%), with 6 patterns extracted (success-timer hook, hero section, event metadata, error/loading, auth card+email, table-head+empty-state) and remaining patterns suppressed with fallow-ignore-next-line
- **SC-003**: Fallow health analysis reports no function exceeding 150 lines
- **SC-004**: Fallow health analysis reports no refactoring target with hotspot score above 40
- **SC-005**: Fallow security findings are either fixed or suppressed with documented rationale
- **SC-006**: All 233 existing tests continue to pass
- **SC-007**: TypeScript type-check (`tsc -b`) passes with zero errors
- **SC-008**: ESLint passes with zero errors

## Assumptions

- The fallow SSRF findings in api.ts are expected false positives for an SPA that constructs URLs from a constant base — these will be suppressed, not refactored
- Code extraction will use the existing project patterns (custom hooks in `src/hooks/`, shared components in `src/components/shared/`)
- The success-timer pattern is consistent enough across all 4 forms to extract into a single hook with no behavioral changes
- Large function refactoring will extract sub-components with named exports respecting existing conventions
- The hero section components share enough structure (overline + h1 + description) to justify an extensible shared component with slot-based customization
- The refactoring of api.ts is a split, not a rewrite — existing callers continue to work with the same imports
