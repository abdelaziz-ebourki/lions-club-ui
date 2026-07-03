# Data Model: UX Polish

## UI State Models

### Loading State

```
Page → skeletonState
- idle: content rendered
- loading: Skeleton placeholders rendered instead of content

Implementation: derived from react-query isLoading/isPending
```

### Empty State

```
Page → emptyState
- hasData: content rendered
- noData: EmptyState component rendered with message + optional CTA

Implementation: derived from data.length === 0 after loading completes
```

### Remember Me State

```
LoginForm → rememberMeState
- checked: localStorage.setItem("remember_me", "true"), request extended session
- unchecked: localStorage.removeItem("remember_me"), use default session TTL
```

### RSVP State

```
EventDetail → rsvpState
- idle: "Join Event" button shown
- pending: button shows spinner, disabled
- going: "Going" button shown, disabled
- error: revert to idle, show error toast

Implementation: useState<boolean> for hasRsvpd, useMutation for RSVP call
```

## Key Entities

### EmptyState Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| icon | LucideIcon | No | Icon to display above the message |
| title | string | Yes | Primary empty state message |
| description | string | No | Secondary explanatory text |
| action | ReactNode | No | CTA button/link element |

### RSVP Contract

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| rsvpCount | number | GET /events/:id response | Total RSVP count for the event |
| hasRsvpd | boolean | GET /events/:id response | Whether current user has RSVP'd |
| success | boolean | POST /events/:id/rsvp response | Whether RSVP was recorded |

### Remember Me

| Field | Type | Storage | Description |
|-------|------|---------|-------------|
| remember_me | string ("true" / absent) | localStorage | Flag indicating user wants persistent session |
