# Breadcrumb Contracts

**Phase**: Phase 1 — Design & Contracts
**Date**: 2026-07-11

## Component API

### `<Breadcrumbs>`

```tsx
<Breadcrumbs trail={BreadcrumbSegment[]} />
```

A shared wrapper component that maps a `BreadcrumbSegment[]` trail to shadcn breadcrumb primitives.

**Props**:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `trail` | `BreadcrumbSegment[]` | Yes | Ordered trail segments from root to current page |

**Rendering rules**:
- If `trail` is empty, renders nothing (returns `null`)
- Each segment with `href` renders as `<BreadcrumbLink>` (clickable link)
- The last segment (no `href`) renders as `<BreadcrumbPage>` (plain text, `aria-current="page"`)
- Separators (`<BreadcrumbSeparator>`) render between each pair of items
- Wraps everything in `<nav aria-label="breadcrumb">` via the shadcn `Breadcrumb` component

### Type: `BreadcrumbSegment`

```ts
interface BreadcrumbSegment {
  label: string
  href?: string
}
```

## Trail Definitions

### Public Pages

| Route | Page | Trail |
|-------|------|-------|
| `/` | HomePage | _(none — excluded)_ |
| `/about` | AboutPage | `["Home", "About"]` |
| `/contact` | ContactPage | `["Home", "Contact"]` |
| `/events` | EventsPage | `["Home", "Events"]` |
| `/events/:id` | EventDetailPage | `["Home", "Events", eventTitle]` |
| `/forum` | ForumPage | `["Home", "Forum"]` |
| `/forum/:categoryId` | ThreadsPage | `["Home", "Forum", categoryName]` |
| `/forum/:categoryId/new` | NewThreadForm | `["Home", "Forum", categoryName, "New Thread"]` |
| `/forum/:categoryId/:threadId` | ThreadDetailPage | `["Home", "Forum", categoryName, threadTitle]` |
| `/search` | SearchPage | `["Home", "Search"]` |
| `/profile` | ProfilePage | `["Home", "Profile"]` |
| `/verify-email` | VerifyEmailPage | `["Home", "Verify Email"]` |
| `/login` | LoginPage | _(none — excluded)_ |
| `/register` | RegisterPage | _(none — excluded)_ |
| `*` (404) | NotFoundPage | `["Home", "Page Not Found"]` |

### Admin Pages

| Route | Page | Trail |
|-------|------|-------|
| `/admin` | AdminDashboard | `["Home", "Admin", "Dashboard"]` |
| `/admin/events` | AdminEvents | `["Home", "Admin", "Events"]` |
| `/admin/events/new` | EventForm (create) | `["Home", "Admin", "Events", "New Event"]` |
| `/admin/events/:id/edit` | EventForm (edit) | `["Home", "Admin", "Events", `Edit ${eventTitle}`]` |
| `/admin/members` | AdminMembers | `["Home", "Admin", "Members"]` |
| `/admin/members/new` | MemberForm (create) | `["Home", "Admin", "Members", "New Member"]` |
| `/admin/members/:id/edit` | MemberForm (edit) | `["Home", "Admin", "Members", `Edit ${memberName}`]` |
| `/admin/messages` | AdminMessages | `["Home", "Admin", "Messages"]` |
| `/admin/forum` | AdminForum | `["Home", "Admin", "Forum"]` |

### Home Link Format

All trails start with `"Home"` linked to `/`. The link label is "Home" (from assumption: uses "Home" as first segment name).

## Dynamic Labels

When a trail segment label depends on API data, the page component:
1. Starts with a loading state (passes `label: ""` or shows skeleton)
2. On data load, builds the full trail with the resolved label
3. On API error, uses `label: "Unknown"` with no `href`

## Error Handling

| Scenario | Behavior |
|----------|----------|
| API fails for dynamic label | Segment shows "Unknown" as non-link plain text |
| API not yet loaded | Show nothing (breadcrumbs not rendered until data is ready) — OR render partial skeleton for the dynamic segment |
| Trail is empty | Component returns `null` |
| Invalid href | TypeScript prevents at build time |
