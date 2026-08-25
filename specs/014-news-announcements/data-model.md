# Data Model: News & Announcements

## Entity: NewsArticle

### Fields

| Field | Type | Required | Default | Constraints |
|-------|------|----------|---------|-------------|
| `id` | `string` (UUID) | ✅ | — | Auto-generated |
| `title` | `string` | ✅ | — | 3–200 characters |
| `slug` | `string` | ✅ | Auto from title | Unique, lowercase, hyphenated; suffix `-2`, `-3` on collision |
| `content` | `string` (HTML) | ✅ | — | Rich text, stored as HTML |
| `excerpt` | `string` | ❌ | `""` | Plain text, max 500 chars; auto-truncated from content if not provided |
| `featuredImage` | `string` (URL) | ❌ | — | Image URL, uploaded via existing image system |
| `category` | `NewsCategory` | ✅ | — | One of 4 predefined values |
| `status` | `NewsStatus` | ✅ | `"draft"` | `"draft"` / `"published"` / `"archived"` |
| `authorId` | `string` | ✅ | — | Links to UserProfile.id |
| `authorName` | `string` | ✅ | — | Denormalized for display |
| `publishedAt` | `string` (ISO-8601) | ❌ | — | Auto-set when status → `"published"` |
| `createdAt` | `string` (ISO-8601) | ✅ | Auto | Server-set on create |
| `updatedAt` | `string` (ISO-8601) | ✅ | Auto | Server-set on update |

### Enums

```typescript
type NewsCategory = "Announcement" | "News" | "Event Recap" | "Press Release";

type NewsStatus = "draft" | "published" | "archived";
```

### Validation Rules (Zod v4)

```typescript
const newsArticleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title must be at most 200 characters"),
  slug: z.string().min(1, "Slug is required").max(250)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().max(500, "Excerpt must be at most 500 characters").optional().or(z.literal("")),
  featuredImage: z.union([z.instanceof(File), z.string()]).optional().nullable(),
  category: z.enum(["Announcement", "News", "Event Recap", "Press Release"]),
  status: z.enum(["draft", "published", "archived"]),
}).superRefine((data, ctx) => {
  if (data.featuredImage instanceof File) {
    if (!["image/png", "image/jpeg", "image/webp"].includes(data.featuredImage.type)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select a valid image file (PNG, JPG, WebP)", path: ["featuredImage"] });
    }
    if (data.featuredImage.size > 5 * 1024 * 1024) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "File size must be under 5MB", path: ["featuredImage"] });
    }
  }
});
```

### State Transitions

```
draft ──→ published ──→ archived
  ↑           │
  └───────────┘
```

- `draft` → `published`: Sets `publishedAt` to now
- `published` → `draft`: Removes from public view; `publishedAt` preserved
- `published` → `archived`: Removes from public view
- `archived` → `published`: Restores with existing `publishedAt`
- `draft` → `archived`: Direct archival
- Delete is permanent (no soft delete) — per spec

### Relationships

- **Author**: `NewsArticle.authorId` → `UserProfile.id` (existing entity)
- **Featured Image**: `NewsArticle.featuredImage` → file upload system (existing infrastructure)

### API Response Shape

**Single article** (public):
```typescript
{
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  category: NewsCategory;
  status: NewsStatus;
  authorName: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}
```

**Paginated list** (public):
```typescript
{
  data: NewsArticle[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

**Admin list** (all statuses):
```typescript
// Same shape as public but includes all statuses, no pagination needed
NewsArticle[];
```
