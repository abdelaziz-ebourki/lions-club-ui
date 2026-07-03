# Research: Codebase Housekeeping

**Date**: 2026-07-03 | **Feature**: [spec.md](spec.md)

## Fallow Static Analysis Results

Run on 2026-07-03 with `fallow dead-code --format json --quiet` (v2.103.0).

### Summary

- **64 total issues** found (15 unused files, 47 unused exports, 1 unused type)
- **0 unresolved imports** — module graph is clean
- **0 circular dependencies** — no import cycles
- **0 unlisted dependencies** — all imports have matching package.json entries

### Unused files to delete (14 total)

**12 UI component files** (unreachable from any entry point):

| File | In Original Plan? |
|------|:---:|
| `alert.tsx` | ✅ |
| `avatar.tsx` | ✅ |
| `command.tsx` | ✅ |
| `dialog.tsx` | ✅ |
| `dropdown-menu.tsx` | ❌ — New find! |
| `form.tsx` | ✅ |
| `input-group.tsx` | ✅ |
| `navigation-menu.tsx` | ✅ |
| `pagination.tsx` | ✅ |
| `scroll-area.tsx` | ✅ |
| `toggle.tsx` | ✅ |
| `toggle-group.tsx` | ✅ |

**2 barrel files** (components imported directly, not through barrel):

| File | Reason |
|------|--------|
| `forum/index.ts` | `ThreadHeader`, `ReplyList`, `ReplyForm` imported directly in `thread-detail.tsx` |
| `search/index.ts` | `SearchResults`, `SearchBar` imported directly in `search-page.tsx` and `header.tsx` |

**Note**: `ui/index.ts` barrel is flagged by fallow but retained — it's a standard design pattern for discoverability.

### Unused exports to remove from files that stay (35+ exports)

| File | Unused Exports |
|------|---------------|
| `alert-dialog.tsx` | `AlertDialogMedia`, `AlertDialogOverlay`, `AlertDialogPortal` |
| `badge.tsx` | `badgeVariants` |
| `button.tsx` | `buttonVariants` |
| `card.tsx` | `CardFooter`, `CardAction` |
| `field.tsx` | `FieldDescription`, `FieldLegend`, `FieldSeparator`, `FieldSet`, `FieldTitle` |
| `select.tsx` | `SelectGroup`, `SelectLabel`, `SelectScrollDownButton`, `SelectScrollUpButton`, `SelectSeparator` |
| `sheet.tsx` | `SheetClose`, `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription` |
| `table.tsx` | `TableFooter`, `TableCaption` |
| `tabs.tsx` | `TabsContent`, `tabsListVariants` |
| `tooltip.tsx` | `Tooltip`, `TooltipTrigger`, `TooltipContent` (keep file — `TooltipProvider` used in `shell.tsx`) |

### Unused type

| File | Type |
|------|------|
| `types/index.ts` | `SearchState` |

### Unused dependencies

**`cmdk`**: Not flagged by fallow as unused (technically imported by `command.tsx`), but since `command.tsx` is itself unreachable dead code, `cmdk` is dead transitive. Safe to remove after deleting `command.tsx`.

**`@tailwindcss/vite`**: Flagged by fallow as a test-only dependency (only test files import it). Move to devDependencies as a bonus cleanup, or leave in dependencies since Vite uses it at build time (fallow may be overly strict here — `@tailwindcss/vite` is a Vite plugin used at build time, not a runtime dep).

### Tooltip file confirmed USED

`tooltip.tsx` is reachable because `TooltipProvider` is imported by `shell.tsx`. Only the individual sub-exports `Tooltip`, `TooltipTrigger`, `TooltipContent` are unused. **Keep the file**, remove the three unused exports.

## Constants to extract

| Location | Magic Number | Named Constant | Suggested Name |
|----------|-------------|----------------|----------------|
| `App.tsx:37` | `1000 * 60 * 5` | 5 minutes in ms | `DEFAULT_STALE_TIME` |
| `App.tsx:38` | `1` | Retry count | `DEFAULT_RETRY_COUNT` |
| `lib/search.ts:6` | `200` | Max query length | `MAX_QUERY_LENGTH` |
| `lib/search.ts:18` | `150` | Snippet fallback length | `SNIPPET_FALLBACK_LENGTH` |
| `lib/search.ts:19` | `60` | Context window before match | `SNIPPET_CONTEXT_BEFORE` |
| `lib/search.ts:20` | `60` | Context window after match | `SNIPPET_CONTEXT_AFTER` |
| `mocks/handlers/auth.ts:35` | `60 * 60 * 24 * 7` | Cookie max age (7 days) | `SESSION_COOKIE_MAX_AGE` |
