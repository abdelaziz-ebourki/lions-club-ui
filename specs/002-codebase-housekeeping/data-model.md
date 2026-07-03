# Data Model: Codebase Housekeeping

**Date**: 2026-07-03 | **Feature**: [spec.md](spec.md)

## Entities

### UI Component (removal target — verified by fallow static analysis)

| Attribute | Type | Description |
|-----------|------|-------------|
| `file` | `string` | Source file path under `src/components/ui/` |
| `exportName` | `string` | Named export(s) in the component file |
| `barrelEntry` | `string` | Re-export line in `src/components/ui/index.ts` |
| `isUsed` | `boolean` | Has at least one import from outside the `ui/` directory (fallow-verified) |

**Removal set** (12 files, fallow-verified unreachable):
- `alert.tsx`, `avatar.tsx`, `command.tsx`, `dialog.tsx`, `dropdown-menu.tsx`
- `form.tsx`, `input-group.tsx`, `navigation-menu.tsx`, `pagination.tsx`
- `scroll-area.tsx`, `toggle.tsx`, `toggle-group.tsx`

**Retained** (fallow-verified used):
- `tooltip.tsx` — `TooltipProvider` is used in `shell.tsx`
- `ui/index.ts` — barrel file kept for discoverability

### Barrel File (removal target)

| File | Reason |
|------|--------|
| `src/components/forum/index.ts` | Components imported directly from their source files |
| `src/components/search/index.ts` | Components imported directly from their source files |

### Unused Export (removal target from files that stay)

35+ exports across 10 files. Each is a named export with zero import references (fallow-verified). See `research.md` for the complete list.

### Named Constant (creation target)

| Attribute | Type | Description |
|-----------|------|-------------|
| `name` | `string` | UPPER_SNAKE_CASE constant name |
| `value` | `number` | The extracted numeric value |
| `location` | `string` | File where the constant is defined |

**Creation set**: 8 constants across 3 files (see `research.md`).

### Event Category (config target)

| Attribute | Type | Description |
|-----------|------|-------------|
| `value` | `string` | Category identifier (e.g., `"Health"`, `"Environment"`) |

**Config location**: `src/config/index.ts` — appended to existing exports.

## Validation Rules

- All removals must pass fallow re-verification after cleanup
- `tsc -b` must pass with zero errors
- `vitest run` must pass with same test count
- No new `any` types introduced

## State Transitions

- N/A — no stateful entities being added or modified.
