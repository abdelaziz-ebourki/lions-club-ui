# API Contracts: News & Announcements

Base URL: `VITE_API_URL` (default `/api`)

Auth: Cookie-based session (same as existing). Admin endpoints require admin session.

---

## Public Endpoints

### `GET /api/news?page=1&limit=10`

Returns paginated published articles, sorted by `publishedAt` descending.

**Query Parameters**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number (1-indexed) |
| `limit` | number | 10 | Articles per page |

**Response** `200`:
```json
{
  "data": [
    {
      "id": "news-abc123",
      "title": "Annual Charity Gala Announced",
      "slug": "annual-charity-gala-announced",
      "excerpt": "Join us for our biggest fundraising event...",
      "featuredImage": "https://cdn.example.com/gala.jpg",
      "category": "Announcement",
      "authorName": "John Doe",
      "publishedAt": "2026-07-15T10:00:00Z",
      "createdAt": "2026-07-10T08:30:00Z",
      "updatedAt": "2026-07-15T10:00:00Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

**Note**: `content` is excluded from list responses for performance — only included in detail response.

---

### `GET /api/news/:slug`

Returns full article detail by slug.

**Response** `200`:
```json
{
  "id": "news-abc123",
  "title": "Annual Charity Gala Announced",
  "slug": "annual-charity-gala-announced",
  "content": "<h2>A Night of Giving</h2><p>Join us...</p>",
  "excerpt": "Join us for our biggest fundraising event...",
  "featuredImage": "https://cdn.example.com/gala.jpg",
  "category": "Announcement",
  "authorName": "John Doe",
  "publishedAt": "2026-07-15T10:00:00Z",
  "createdAt": "2026-07-10T08:30:00Z",
  "updatedAt": "2026-07-15T10:00:00Z"
}
```

**Response** `404`:
```json
{
  "error": "Article not found"
}
```

---

### `GET /api/news/featured`

Returns up to 3 most recently published articles for the homepage.

**Response** `200`:
```json
[
  {
    "id": "news-abc123",
    "title": "Annual Charity Gala Announced",
    "slug": "annual-charity-gala-announced",
    "excerpt": "Join us for our biggest fundraising event...",
    "category": "Announcement",
    "authorName": "John Doe",
    "publishedAt": "2026-07-15T10:00:00Z"
  }
]
```

**Note**: Returns empty array `[]` when no published articles exist. Never returns `404`.

---

## Admin Endpoints (require auth + admin role)

### `GET /api/news/admin`

Returns ALL articles (draft, published, archived) for admin management. No pagination.

**Response** `200`:
```json
[
  {
    "id": "news-abc123",
    "title": "Annual Charity Gala Announced",
    "slug": "annual-charity-gala-announced",
    "excerpt": "Join us...",
    "category": "Announcement",
    "status": "published",
    "authorName": "John Doe",
    "publishedAt": "2026-07-15T10:00:00Z",
    "createdAt": "2026-07-10T08:30:00Z",
    "updatedAt": "2026-07-15T10:00:00Z"
  }
]
```

**Response** `401` if unauthenticated, `403` if not admin.

---

### `GET /api/news/admin/:id`

Returns single article (any status) by ID for editing.

**Response** `200`: Full article with `content` field.
**Response** `404`: Article not found.

---

### `POST /api/news`

Create a new article. Accepts `multipart/form-data`.

**Form Fields**:
| Field | Type | Required |
|-------|------|----------|
| `title` | string | ✅ |
| `slug` | string | ✅ (auto-generated, editable) |
| `content` | string (HTML) | ✅ |
| `excerpt` | string | ❌ |
| `featuredImage` | file | ❌ |
| `category` | string | ✅ |
| `status` | string | ✅ |

**Response** `201`: Created article JSON (with `id`, `createdAt`, `updatedAt`).
**Response** `400`: Validation error.
**Response** `409`: Slug collision (indicates suffix needed).

---

### `PUT /api/news/:id`

Update an existing article. Accepts `multipart/form-data`.

**Form Fields**: Same as POST.
**Response** `200`: Updated article JSON.
**Response** `400`: Validation error.
**Response** `404`: Article not found.

---

### `DELETE /api/news/:id`

Permanently delete an article.

**Response** `200`:
```json
{ "success": true }
```
**Response** `404`: Article not found.
