# Data Model: Image Upload

## Event.image

Field on the `Event` interface (`src/types/index.ts`):
- Type: `string | undefined` (URL path to the image)
- Optional — events may exist without an image
- In form state: `File | string | undefined` (File for new upload, string for existing URL)
- Sent as `multipart/form-data` field `"image"`

## Member.avatar

Field on the `Member` interface (`src/types/index.ts`):
- Type: `string | undefined` (URL path to the avatar)
- Optional — members may exist without an avatar
- In form state: `File | string | undefined`
- Sent as `multipart/form-data` field `"avatar"`

## Form Validation (client-side)

| Rule | Value | Error Message |
|------|-------|---------------|
| Accepted types | `image/png`, `image/jpeg`, `image/webp` | "Please select a valid image file (PNG, JPG, WebP)" |
| Max file size | 5 MB (5,242,880 bytes) | "File size must be under 5MB" |

## Upload API Contract

**Request**: `POST /events` or `PUT /events/:id` with `Content-Type: multipart/form-data`
- Text fields: `title`, `description`, `date`, `time`, `location`, `category`, `status`
- File field: `image` (binary)

**Request**: `POST /members` or `PUT /members/:id` with `Content-Type: multipart/form-data`
- Text fields: `name`, `role`, `bio`
- File field: `avatar` (binary)

**Response**: JSON body of the created/updated entity with `image`/`avatar` set to the URL string.

## Display Surfaces

| Surface | File | Logic |
|---------|------|-------|
| Event detail hero | `src/pages/events/event-detail.tsx` | `<img>` if `event.image` exists |
| Events list card | `src/pages/events/events.tsx` | `<img>` above card header if `event.image` exists, with hover scale |
| About member card | `src/pages/about/about.tsx` | `<img>` if `member.avatar` exists, fallback to first-letter initial |
