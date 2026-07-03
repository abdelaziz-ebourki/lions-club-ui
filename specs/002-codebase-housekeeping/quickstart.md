# Quickstart: Codebase Housekeeping — Validation Guide

**Date**: 2026-07-03 | **Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

## Prerequisites

- Node.js >= 20
- npm dependencies installed: `npm install`
- Fallow installed: `npm install -g fallow` (for re-verification)

## Setup

```bash
npm install
```

## Validation Scenarios

### Scenario 1: Fallow Re-Verification

```bash
fallow dead-code --format json --quiet --unused-files --unused-exports --unused-types 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Files: {d[\"summary\"][\"unused_files\"]}, Exports: {d[\"summary\"][\"unused_exports\"]}, Types: {d[\"summary\"][\"unused_types\"]}')"
```
**Expected**: Only `ui/index.ts` should remain as an unused file (intentionally kept barrel). Zero previously-reported unused exports should remain.

### Scenario 2: TypeScript Compilation

```bash
npx tsc -b
```
**Expected**: Exit code 0, no errors.

### Scenario 3: Lint

```bash
npm run lint
```
**Expected**: Exit code 0, no warnings.

### Scenario 4: Existing Tests

```bash
npm run test:run
```
**Expected**: All tests pass. Same test count as before changes.

### Scenario 5: Production Build

```bash
npm run build
```
**Expected**: Build succeeds. Bundle output files smaller than before.

### Scenario 6: Font Loading (Manual)

1. Run `npm run dev`
2. Open browser console
3. **Expected**: No OTS parsing errors or "Failed to decode downloaded font" messages

### Scenario 7: Unused Component Removal Verification

```bash
# Verify each removed component has no remaining imports
for f in alert avatar command dialog dropdown-menu form input-group navigation-menu pagination scroll-area toggle toggle-group; do
  result=$(grep -r "@/components/ui/$f" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "components/ui/index.ts" | head -1)
  if [ -n "$result" ]; then echo "STILL REFERENCED: $f"; fi
done
echo "Done — if no files listed above, all clean."
```

### Scenario 8: Dependency Cleanup

```bash
grep -r "from \"cmdk\"" src/ --include="*.ts" --include="*.tsx"
```
**Expected**: No matches.

## Post-Validation

- [ ] Fallow re-verification: only `ui/index.ts` barrel remains flagged
- [ ] All tests pass
- [ ] Build succeeds
- [ ] Dev mode runs without console errors
- [ ] Admin event form shows categories from config (not hardcoded)
