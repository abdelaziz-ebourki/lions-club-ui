# Data Model: Site-Wide Search

## SearchQuery

Represents a user's search input with metadata.

| Field | Type | Description |
|-------|------|-------------|
| `raw` | `string` | Original user input, unsanitized |
| `sanitized` | `string` | Trimmed, truncated to 200 chars |
| `length` | `number` | Character count of raw input |
| `isEmpty` | `boolean` | True if sanitized is empty string |

## SearchResult

A polymorphic result referencing any searchable entity.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique ID of the source entity |
| `entityType` | `"event" \| "forum_thread" \| "member" \| "contact_message"` | Discriminator for the source entity type |
| `title` | `string` | Display title (event title, thread title, member name, message subject) |
| `snippet` | `string` | Truncated matching content (~150 chars) with match context |
| `url` | `string` | Relative URL to the entity's detail page |
| `matchType` | `"exact" \| "partial"` | Whether the query matched the title exactly or content partially |
| `updatedAt` | `string` | ISO date of last update (for sorting) |

## SearchResultGroup

A named collection of results for one entity type.

| Field | Type | Description |
|-------|------|-------------|
| `entityType` | `"event" \| "forum_thread" \| "member" \| "contact_message"` | Entity type key |
| `label` | `string` | Human-readable heading (e.g., "Events (3)") |
| `count` | `number` | Number of results in this group |
| `results` | `SearchResult[]` | Ordered result items |

## SearchState

Runtime state managed by the search page component.

| Field | Type | Description |
|-------|------|-------------|
| `query` | `SearchQuery` | Current search query from URL params |
| `results` | `SearchResultGroup[]` | Grouped results (empty array before search) |
| `isSearching` | `boolean` | True while data is being fetched and filtered |
| `error` | `string \| null` | Error message if search fails |
| `totalCount` | `number` | Sum of all result counts across groups |

## URL Contract

```
/search                → Empty state, prompts user to search
/search?q=term         → Searches for "term"
/search?q=             → Empty state (treated as no query)
```

## Auth Integration

- Events and Forum Threads are visible to all users (authenticated or not).
- Members and Contact Messages are visible only when `user?.role === "admin"`.
- If user is not authenticated, search skips Members and Messages entirely
  (no API calls, no empty sections shown).
