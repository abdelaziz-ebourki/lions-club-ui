# AGENTS.md — Lions Club FSBM UI

## Project
Single-page application for Lions Club FSBM — community service organization in Casablanca.

## Tech Stack
- **Runtime**: TypeScript 6, React 19, Vite 8, ESM
- **UI**: Tailwind v4, shadcn/ui "base-sera", lucide-react
- **State**: @tanstack/react-query v5, AuthContext + ThemeContext
- **Routing**: react-router-dom v7 (BrowserRouter, lazy-loaded admin)
- **Forms**: react-hook-form v7 + Zod v4
- **Testing**: Vitest v4 + @testing-library/react v16 + MSW v2
- **Lint**: ESLint v10 flat config
- **Build**: `tsc -b` → `vite build`

## Commands
| Command | Action |
|---------|--------|
| `npm run dev` | Start dev server (MSW auto-starts) |
| `npm run build` | Type-check + production build |
| `npm run test:run` | Run all tests |
| `npm run test` | Watch mode |
| `npm run lint` | ESLint check |
| `npx tsc -b` | Type-check only |

## Conventions
- **TDD**: Tests BEFORE implementation. Co-locate in `__tests__/`. Must fail first.
- **Components**: Named exports, `cn()` for classes, shadcn primitives from `@/components/ui/`
- **Types**: Strict TypeScript. No `any`. All shapes in `@/types/index.ts`. Zod v4 for runtime.
- **API**: Always use `api` from `@/lib/api.ts`. Never raw `fetch()`.
- **Imports**: `@/` path alias. No relative imports outside current directory.
- **Auth**: AuthContext for session. `isAdmin` from `useAuth()` for admin gating.
- **Fonts**: Cinzel (display), Cormorant Garamond (headings), Crimson Pro (body)

## Agents
### Skills (`.agents/`)
Load before relevant work: `tdd`, `shadcn`, `git-commit`, `vercel-react-best-practices`,
`playwright-best-practices`, `webapp-testing`, `frontend-design`, `web-design-guidelines`

### MCPs
- **shadcn-ui** — component docs/installation
- **context7** — library/framework API docs
- **playwright** — browser automation, E2E, screenshots

### Required on every implementation
1. Load `tdd` skill for TDD workflow
2. Load `git-commit` for commits (conventional commit format)
3. Run `npx tsc -b` and `npm run lint` before committing
4. Run `npm run test:run` before merging
5. Verify acceptance scenarios via Playwright MCP before merge
