# API Contracts: Gallery & Media Library

**Feature**: 015-gallery-media-library | **Date**: 2026-08-25

All requests carry session cookies (`credentials: include`). Errors use the shared envelope: non-401 failures throw `ApiError(message, status)`.

> **Route ordering note (implementation contract)**: parameterized routes MUST be registered after literal ones — `/api/gallery/admin*` and `/api/gallery/upload` before `/api/gallery/:id`.

## Public Endpoints

### GET /api/gallery

Paginated, filterable public list. Only existing items (no draft concept).

**Query params**: `page` (default 1), `limit` (default 12), `category?` (one of five values), `eventId?`

**Response 200**:
```json
{
  "data": [ { "id": "gallery-1", "title": "...", "description": "...", "imageUrl": "...", "thumbnailUrl": "...", "category": "Event", "eventId": "event-1", "tags": ["gala"], "uploadedAt": "2026-08-01T10:00:00Z", "uploadedBy": "admin-1" } ],
  "total": 9,
  "page": 1,
  "limit": 12,
  "totalPages": 1
}
```
Sorted by `uploadedAt` descending. Empty result set returns `"data": [], "total": 0` with HTTP 200 (drives the empty state, not an error).

### GET /api/gallery/:id

Single item for deep links / lightbox refresh.

**Response 200**: full `GalleryItem` object.
**Response 404**: empty body — unknown id. Client shows 404-style state (distinguished via `ApiError.status === 404`).

## Admin Endpoints (require authenticated admin session)

### GET /api/gallery/admin

Full unpaginated list for the management table, sorted by `uploadedAt` descending. Returns **401** without admin session.

### POST /api/gallery/upload

Step 1 of two-step creation. Multipart FormData field `file` (PNG/JPEG/WebP, ≤ 5 MB).

**Response 201**:
```json
{ "imageUrl": "/uploads/gallery/gallery-abc.jpg", "thumbnailUrl": "/uploads/gallery/gallery-abc_thumb.jpg" }
```
`thumbnailUrl` MAY be absent. **Response 401** if session expired mid-upload (client redirects to login; nothing persisted).

### POST /api/gallery

Step 2: metadata for the uploaded image.

**Request body (JSON)**:
```json
{ "title": "...", "description": "...", "imageUrl": "required, from upload step", "thumbnailUrl": "optional", "category": "Event", "eventId": null, "tags": ["gala", "2026"] }
```
Server sets `id`, `uploadedAt` (= now), `uploadedBy` (= session admin). Tags are trimmed/de-duplicated server-side too.

**Response 201**: created `GalleryItem`. **Response 400**: validation failure (missing title/category/imageUrl).

### PATCH /api/gallery/:id

Partial metadata update (title, description, category, eventId, tags, thumbnailUrl). Image replacement is out of scope v1 (delete + re-upload instead).

**Response 200**: updated `GalleryItem`. **404** unknown id. **401** unauthenticated.

### DELETE /api/gallery/:id

Permanent removal.

**Response 200**: `{ "success": true }`. **404** unknown id. **401** unauthenticated.

## Client-Side Contract Notes

- All calls go through `api.get/post/patch/delete/upload` from `@/lib/api.ts` — never raw fetch.
- 401 anywhere dispatches `auth:expired` (except the auth probe) → central redirect to login.
- React Query keys: `["gallery","list",page,limit,filters]` (public), `["gallery","admin"]` (admin), invalidated broadly after mutations.
