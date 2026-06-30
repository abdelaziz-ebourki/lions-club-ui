<!--
  Sync Impact Report
  ==================
  Version change: (none) → 1.0.0
  Modified principles: N/A (initial draft)
  Added sections:
    - Core Principles (6 principles)
    - Tech Stack & Constraints
    - Development Workflow
    - Governance
  Removed sections: N/A (initial draft)
  Templates requiring updates:
    - ✅ .specify/templates/plan-template.md (no change needed — Constitution Check section is generic)
    - ✅ .specify/templates/spec-template.md (no change needed)
    - ⚠️ .specify/templates/tasks-template.md (tests marked OPTIONAL — must be MANDATORY per Principle I)
    - ✅ .opencode/commands/ (no agent-specific references found)
  Follow-up TODOs: none
-->

# University Lions Club UI Constitution

## Core Principles

### I. TDD is Non-Negotiable (NON-NEGOTIABLE)

All feature work MUST follow Test-Driven Development: write failing tests first,
then implement, then refactor. Red-Green-Refactor cycle is strictly enforced.

- Tests MUST be written before implementation code for every feature or bug fix.
- Tests MUST FAIL before implementation begins, confirming they are valid.
- Co-locate tests in `__tests__/` directories next to their components/pages.
- Use Vitest + @testing-library/react for unit/component tests.
- Use MSW for all API mocking (shared between dev and test environments).
- Load the `tdd` agent skill before any implementation session.
- Every user story in spec.md MUST have independently testable acceptance criteria.
- Features without tests are considered incomplete — no exception.

### II. Agent Skills Discipline

The project ships with a curated set of agent skills in `.agents/`. These MUST be
loaded for their respective domains.

- **Always check `.agents/` first** before starting work in any area.
- Installed skills: `frontend-design`, `git-commit`, `grill-me`,
  `playwright-best-practices`, `playwright-cli`, `shadcn`, `tdd`,
  `vercel-react-best-practices`, `web-design-guidelines`, `webapp-testing`.
- Use `git-commit` skill for all commits — conventional commit format is
  required.
- Use `shadcn` skill when adding or modifying UI components.
- Use `tdd` skill for test-driven development workflow.
- Use `frontend-design` and `web-design-guidelines` for UI/UX decisions.
- Use `vercel-react-best-practices` for React performance optimization.
- Use `playwright-best-practices` for E2E testing.
- Use `webapp-testing` for local app interaction and debugging.
- Use `grill-me` for design critique and plan sharpening.
- **If no skill exists for a needed area**, use the `find-skills` skill to
  search for and install an appropriate skill.
- Never implement a domain-specific area without first checking if an agent
  skill covers it.

### III. MCP-First Tooling (MANDATORY)

Three MCPs are installed and MUST be used as the primary knowledge source:

- **shadcn-ui MCP**: Use for component documentation, installation, and usage
  examples. Always query before creating new UI components.
- **context7 MCP**: Use for library/framework API documentation and best
  practices. Always query before writing code against a new dependency.
- **playwright MCP**: Use for browser automation, E2E testing, screenshots, and
  console debugging.

Rule: Before writing any code that uses a library, framework, or API — query the
relevant MCP first. Do not rely on general knowledge when a specific MCP can
provide current documentation.

### IV. TypeScript-First, Type-Safe

The entire codebase MUST be strictly typed TypeScript.

- `strict: true` in tsconfig — no exceptions.
- No `any` types. Use `unknown` with proper narrowing when necessary.
- All data shapes MUST be defined in `@/types/index.ts` with explicit
  interfaces.
- All forms/API contracts MUST use Zod v4 schemas for runtime validation.
- `erasableSyntaxOnly` is enforced (Zod v4 compatible).
- `noUnusedLocals` and `noUnusedParameters` are enforced.
- Use the `@/` path alias for all internal imports.
- Every API response and request body MUST have a typed interface.

### V. Component & Design System Discipline

UI MUST be built from the established design system, not ad-hoc.

- Use shadcn/ui primitives from `@/components/ui/` — install new ones via the
  `shadcn` skill.
- Use the `cn()` utility (`@/lib/utils.ts`) for all class merging.
- Use Tailwind v4 exclusively for styling — no plain CSS files (except
  `index.css` for base tokens).
- Use the 3-tier variable font system: Cinzel (display), Cormorant Garamond
  (headings), Crimson Pro (body).
- Use the `oklch()` color space for all colors — light and dark themes via CSS
  custom properties.
- Support dark mode via `.dark` class. Respect `prefers-reduced-motion`.
- Components MUST be named exports (no `export default` except App.tsx).
- Use the compound component pattern
  (e.g., `Card`.`CardHeader`.`CardTitle`.`CardContent`) for complex components.

### VI. Best Practices & Industry Standards

All work MUST conform to established best practices and web standards.

- Load `vercel-react-best-practices` skill for React/Next.js performance
  patterns.
- Load `web-design-guidelines` skill for accessibility and UX compliance
  reviews.
- WCAG 2.1 AA compliance is the minimum standard — semantic HTML, proper ARIA
  attributes, keyboard navigation.
- Use React.lazy() + Suspense for code splitting admin and heavy pages.
- All async server state goes through React Query — no direct fetch() calls
  outside `@/lib/api.ts`.
- Cookie-based auth via AuthContext with httpOnly session cookies.
- API calls use the typed wrapper in `@/lib/api.ts` — never raw fetch().
- MSW mocks the API in dev mode — keep mocks in sync with real contracts.
- Branch from `V2`. Follow Git feature branch workflow. Use `git-commit` skill
  for commits.

## Tech Stack & Constraints

**Languages & Runtime**: TypeScript 6, React 19, Vite 8, ESM ("type": "module")

**UI**: Tailwind v4 (config-less via `@tailwindcss/vite`), shadcn/ui
"base-sera", lucide-react icons

**State & Data**: @tanstack/react-query v5, AuthContext (cookie-based auth),
ThemeContext (dark/light)

**Routing**: react-router-dom v7 with BrowserRouter, nested routes,
lazy-loaded admin pages

**Forms & Validation**: react-hook-form v7 + @hookform/resolvers + Zod v4

**Testing**: Vitest v4 + @testing-library/react v16 + @testing-library/jest-dom
+ MSW v2

**Build Pipeline**: `tsc -b` (type-check all project references) → `vite build`

**Lint**: ESLint v10 flat config with @eslint/js, typescript-eslint,
react-hooks, react-refresh

**Package Manager**: npm (see package-lock.json)

**Environment Variables**: `VITE_API_URL` (defaults to "/api"), all prefixed
with `VITE_`

**Target Platform**: Modern browsers (ES2023)

## Development Workflow

1. Branch from `V2` with descriptive feature branch names.
2. Use the Spec Kit cycle for every feature:
   - `/speckit.specify` — create spec.md with user stories and acceptance
     criteria
   - `/speckit.clarify` — resolve ambiguities (optional)
   - `/speckit.plan` — create technical implementation plan
   - `/speckit.tasks` — generate ordered task list (tests first)
   - `/speckit.implement` — execute tasks phase by phase
   - `/speckit.converge` — append remaining work after feedback
3. Load relevant agent skills before each phase.
4. Run lint (`eslint .`) and type-check (`tsc -b`) before committing.
5. Use `git-commit` skill for all commits — conventional commit format.
6. Tests MUST pass before merge: `vitest run`.

## Governance

This Constitution supersedes all ad-hoc practices. It is the single source of
truth for how this project operates.

**Amendment Process**:
- Proposed amendments MUST be documented with rationale.
- Amendments MUST include a migration plan for existing work.
- MAJOR version bump for principle removals or redefinitions.
- MINOR version bump for new principles or materially expanded guidance.
- PATCH version bump for clarifications, wording, typo fixes.

**Compliance**:
- All PRs MUST be reviewed against this Constitution.
- Complexity must be justified when it conflicts with stated principles.
- The `/speckit.plan` command's Constitution Check gate enforces compliance.
- Violations MUST be documented and justified in the plan's Complexity
  Tracking section.

**Version**: 1.0.0 | **Ratified**: 2026-06-30 | **Last Amended**: 2026-06-30
