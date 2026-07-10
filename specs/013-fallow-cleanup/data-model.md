# Data Model: Fallow Findings Cleanup

**Phase**: 1 | **Date**: 2026-07-10

## N/A — No New Data Entities

This feature is purely about codebase restructuring. No new data entities, fields, validation rules, or state transitions are introduced.

### What changes

- **`src/types/index.ts`**: Remove unused type exports (`VerifyResult`, `NotificationState`, `EmailVerificationStatus`) — these are type-only, no data impact.
- **`src/lib/api.ts`**: Split of request logic from endpoint wrappers — no change to the data contracts, only module organization.
- **Shared components/hooks**: Behavioral extraction of existing patterns — no new data structures.

### Impact on existing data contracts

- All Zod v4 schemas remain unchanged
- All API response/request types remain unchanged
- All React Query cache keys remain unchanged
- All AuthContext and ThemeContext contracts remain unchanged
