# Quickstart: Fallow Findings Cleanup Validation

**Phase**: 1 | **Date**: 2026-07-10

## Prerequisites

- Node.js ≥ 20, npm
- Project dependencies installed (`npm install`)
- Fallow installed (available via `npx fallow`)

## Setup

```bash
cd /home/abdelaziz/Desktop/portfolio/lions-club-remastered/lions-club-ui
```

## Validation Scenarios

### 1. Dead-code cleanup

```bash
# Before: should report findings
npx fallow dead-code --format json --quiet --tsconfig ./tsconfig.json
```

After cleanup, the same command should return zero findings for unused files, types, and dependencies.

**Expected outcome**: Empty results array.

---

### 2. Duplication reduction

```bash
# Before: ~6.2% duplication, 20 clone groups
npx fallow dupes --format json --quiet
```

After extraction, the same command should report:
- Total duplication below 4%
- 6 patterns extracted to shared components/hooks
- Remaining patterns suppressed with `fallow-ignore-next-line`

**Expected outcome**: `totalDuplicationPercentage < 4`

---

### 3. Complexity refactoring

```bash
# Before: hotspot scores above 40, functions exceeding 150 lines
npx fallow health --format json --quiet
```

After refactoring:
- No function exceeds 150 lines
- No file has hotspot score above 40

**Expected outcome**: `hotspots` array empty, `allFunctionsWithinLimit: true`

---

### 4. Security findings

```bash
# Before: 8 SSRF findings
npx fallow security --format json --quiet
```

After suppression: findings list may be empty or contain suppressed findings.

**Expected outcome**: No new/unsuppressed findings.

---

### 5. Regression checks

```bash
# TypeScript type-check
npx tsc -b

# ESLint
npm run lint

# Test suite
npm run test:run
```

All three MUST pass with zero errors.
