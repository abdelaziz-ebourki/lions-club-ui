# Research: Fallow Findings Cleanup

**Phase**: 0 | **Date**: 2026-07-10

## Research Tasks

No NEEDS CLARIFICATION items in Technical Context — all project stack and constraints are known from the constitution.

### Task: Verify fallow findings against current master

Re-run fallow on master to confirm findings are still current before starting cleanup.

```bash
npx fallow dead-code       # Verify 0-unused files, 3 unused types, 2 unused deps
npx fallow dupes           # Verify 6.2% duplication, 20 clone groups
npx fallow health          # Verify hotspot scores, function lengths
npx fallow security        # Verify 8 SSRF findings in api.ts
```

### Task: Confirm SSRF false-positive classification

All 8 SSRF findings are in `src/lib/api.ts`. The API client constructs URLs from a constant `VITE_API_URL` environment variable — not user-controlled input. Classification: false positive. Suppress with `// fallow-ignore-next-line` comments.

### Task: Confirm extraction boundaries for 6 patterns

| Pattern | Files | Extraction Strategy |
|---------|-------|-------------------|
| Success-timer hook | event-form, member-form, contact, new-thread-form | Pure JS state pattern (useState + useRef + useEffect) — identical across all 4 files |
| Hero section | contact, events, forum | Identical JSX structure (border-b bg-muted/50 + overline + h1 + description) |
| Event metadata | event-detail, events | Calendar + Clock + MapPin lucide icons with same styling |
| Error/loading state | forum, threads | Same conditional rendering pattern for loading/error/fetching states |
| Auth card + email | login, register | Card layout wrapper + email field with same validation pattern |
| Table-head + empty-state | admin-events, admin-members | Same admin table heading and empty-state JSX structure |

### Task: Identify refactoring boundaries for hotspot files

| File | Lines | Strategy |
|------|-------|----------|
| Header | 233 | Extract nav sections, mobile menu, user dropdown as sub-components |
| EventFormPage | 219 | Extract form sections: basics, metadata, contact, dates |
| ContactPage | 201 | Extract contact info blocks, form section |
| ThreadsPage | 196 | Extract thread list item, category filter, pagination |
| api.ts | 164 | Split generic `api()` request function from typed endpoint wrappers |

## Decisions

| Decision | Rationale | Alternatives Considered |
|----------|-----------|------------------------|
| Pragmatic extraction (6 patterns) | Clear wins with minimal risk; includes table-head/empty-state pattern which is a clean extraction candidate | Full extraction (risky abstraction), Minimal extraction (too little improvement) |
| Suppress SSRF with fallow-ignore | All findings are expected false positives in an SPA | Refactoring (would not change the analysis result) |
| Split api.ts by concern | Reduces blast radius — changes to request logic don't affect endpoint wrappers and vice versa | Monolithic (current state — high blast radius) |
