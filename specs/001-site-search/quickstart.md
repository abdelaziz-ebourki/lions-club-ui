# Quickstart: Site-Wide Search

## Prerequisites

- Project runs locally with `npm run dev` (MSW mock API starts automatically)
- All existing tests pass: `npm run test:run`

## Setup

```bash
# Install any new shadcn components if needed
npx shadcn@latest add input command dialog
```

## Validation Scenarios

### Scenario 1: Global search bar in header

1. Start the dev server: `npm run dev`
2. Navigate to any page (home, events, forum)
3. Verify a search input is visible in the site header
4. Type a query that matches an event title (e.g., "Cleanup")
5. Press Enter
6. **Expected**: Navigated to `/search?q=Cleanup` with matching event results

### Scenario 2: Search results grouped by entity

1. Search for a term that exists across multiple entity types
2. **Expected**: Results grouped under headings (e.g., "Events (2)",
   "Forum Threads (1)")
3. Click a result
4. **Expected**: Navigated to the entity's detail page

### Scenario 3: Admin-only results gating

1. Search while not authenticated (default MSW state)
2. **Expected**: Only Events and Forum Threads sections shown
3. Log in as admin (use MSW admin credentials)
4. Repeat the same search
5. **Expected**: Members and Contact Messages sections also appear

### Scenario 4: Empty and error states

1. Submit search with empty query
2. **Expected**: Empty state with prompt to type a query
3. Search for a term unlikely to match anything (e.g., "xyznonexistent")
4. **Expected**: "No results found" message with suggestions
5. Disconnect network / trigger MSW error
6. **Expected**: Error message with retry option

### Scenario 5: Forum inline filter

1. Navigate to a forum category: `/forum/{categoryId}`
2. Type in the inline filter input
3. **Expected**: Thread list filters in real-time as you type
4. Apply a status filter dropdown
5. **Expected**: Only threads matching both category and status shown

## Running Tests

```bash
# Run all tests (including new search tests)
npm run test:run

# Run search-specific tests
npx vitest run src/components/search/
npx vitest run src/pages/search/
```

## Expected Outcomes

| Check | Result |
|-------|--------|
| Search bar visible on all pages | ✅ |
| Results grouped by entity type | ✅ |
| Auth gating works for Members/Messages | ✅ |
| Forum inline filter updates in real-time | ✅ |
| Empty state on no query | ✅ |
| Error state on network failure | ✅ |
| New search tests pass | ✅ |
| Existing tests still pass | ✅ |
