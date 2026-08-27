# Data Model: Gallery & Media Library

**Feature**: 015-gallery-media-library | **Date**: 2026-08-25

## Entity: GalleryItem

Represents a single photo in the club's media library.

| Field          | Type             | Required | Notes |
|----------------|------------------|----------|-------|
| `id`           | `string`         | yes      | Unique identifier (`gallery-<n>` in mocks) |
| `title`        | `string`         | yes      | 3–200 chars; NOT unique across items |
| `description`  | `string`         | no       | Free text, max 1000 chars |
| `imageUrl`     | `string`         | yes      | Full-size image URL (set via upload step) |
| `thumbnailUrl` | `string?`        | no       | Optional; grid falls back to `imageUrl` when absent |
| `category`     | `GalleryCategory`| yes      | One of five fixed values |
| `eventId`      | `string?`        | no       | Reference to an existing event; cleared if event is deleted |
| `tags`         | `string[]`       | yes      | Trimmed, de-duplicated, may be empty |
| `uploadedAt`   | `string` (ISO)   | yes      | Server-set on create |
| `uploadedBy`   | `string`         | yes      | Admin user id of creator |

### GalleryCategory

```
"Event" | "Project" | "Team" | "Community" | "Partner"
```

Fixed set — no admin-managed taxonomy in v1. Exposed as a shared constant alongside its type.

## Relationships

- **GalleryItem → Event** (`eventId`, optional, many-to-one): purely a filter/label link. Deleting the referenced Event clears `eventId` on gallery items (per spec edge case) — items never cascade-delete.
- **GalleryItem → Admin User** (`uploadedBy`, many-to-one): attribution only; displayed as uploader name in the admin list.

## Validation Rules (runtime, form-level)

| Field      | Rule |
|------------|------|
| title      | required, min 3, max 200 chars |
| description| optional, max 1000 chars |
| category   | required, must be one of the five values |
| eventId    | optional, must reference an existing event when present |
| tags       | each trimmed, empty entries removed, duplicates removed |
| file       | PNG/JPEG/WebP only, ≤ 5 MB (validated client-side before upload) |

## State Transitions

Gallery items have no workflow states (unlike News draft/published). Lifecycle:

```
[upload + create] → visible everywhere immediately
       ↓
   [edit metadata] (any number of times)
       ↓
[delete w/ confirmation] → permanently removed
```

Deletion is permanent and immediate on both public and admin surfaces — there is no archive/draft concept in v1.

## Mock Seed Data

`mocks/data/gallery.ts` seeds ≥ 8 items spanning all five categories, at least one linked to an existing seeded event, and at least one item WITHOUT `thumbnailUrl` (fallback path), plus one with multiple tags.
