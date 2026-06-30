# Search Contract

## Route

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/search?q={query}` | Search results page |

## Query Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `q` | `string` | No | Search query (max 200 chars). If absent or empty, show empty state. |

## Search Behavior

### Data Sources (existing API endpoints)

| Entity | Endpoint | Filter Field |
|--------|----------|-------------|
| Events | `GET /api/events` | `title`, `description` |
| Forum Threads | `GET /api/forum/threads` | `title`, `content` |
| Members | `GET /api/members` (admin) | `name`, `bio` |
| Contact Messages | `GET /api/contact/messages` (admin) | `subject`, `message` |

### Auth Rules

| User Role | Searchable Entities |
|-----------|-------------------|
| Unauthenticated | Events, Forum Threads |
| Authenticated (non-admin) | Events, Forum Threads |
| Admin | Events, Forum Threads, Members, Contact Messages |

### Result Ordering

1. Exact title matches first (sorted by date, newest first)
2. Partial/content matches second (sorted by date, newest first)
3. Groups ordered: Events → Forum Threads → Members → Contact Messages

## Navigation

- Search bar in header navigates to `/search?q={query}` on submit
- Each search result links to the entity's detail page
- Back/forward browser navigation is supported via search params
