# Data Model: Forms Validation & Accessibility Fixes

## Form Schemas (Zod v4)

### Event Schema (`src/pages/admin/event-form.tsx`)

**Current**: `status: z.enum(["upcoming", "past"])`
**Target**: `status: z.enum(["upcoming", "ongoing", "past"])`

| Field       | Type     | Constraints                          |
|-------------|----------|--------------------------------------|
| title       | string   | min(3), max(200)                     |
| description | string   | min(10), max(2000)                   |
| date        | string   | min(1)                               |
| time        | string   | min(1)                               |
| location    | string   | min(3), max(200)                     |
| category    | string   | min(1)                               |
| status      | "upcoming" \| "ongoing" \| "past" |        |

**Change**: Remove coercion line `status: (event.status === "upcoming" ? "upcoming" : "past") as "upcoming" | "past"` — directly populate `event.status`.

### Contact Schema (`src/pages/contact/contact.tsx`)

| Field   | Type   | Constraints                    |
|---------|--------|--------------------------------|
| name    | string | min(2), max(100)               |
| email   | string | email()                        |
| subject | string | min(5), max(200)               |
| message | string | min(10), max(2000)             |

### Member Schema (`src/pages/admin/member-form.tsx`)

| Field | Type   | Constraints                    |
|-------|--------|--------------------------------|
| name  | string | min(2), max(100)               |
| role  | string | min(2), max(100)               |
| bio   | string | optional(), max(500)           |

### Thread Schema (`src/pages/forum/new-thread-form.tsx`)

| Field   | Type   | Constraints                    |
|---------|--------|--------------------------------|
| title   | string | min(5), max(200)               |
| content | string | min(10), max(5000)             |

## UI State Models

### Submit Spinner State

```
Event Schema → submitButtonState
- idle: shows button label text
- pending: hides text, shows animated SVG spinner, button disabled
- success: reverts to idle, triggers success glow
- error: reverts to idle, toast.error fires

Implementation: derived from mutation.isPending (react-query) or formState.isSubmitting (react-hook-form)
```

### Success Glow State

```
FieldGroup → successGlowState
- inactive: normal field styling
- active: ring-2 ring-green-500/50 on field group
- Duration: 2000ms, auto-clear via setTimeout

Implementation: useState<boolean>, set true on mutation.isSuccess, useEffect timer to reset
```

### Character Count State

```
Field → charCount
- value: `${currentLength}/${maxLength}`
- color class: default | amber-500 (≥80%) | destructive (=100%)
- aria-live: polite on the counter span

Implementation: derived from form.watch('fieldName'), computed in render
```

## Aria Contract

### Attributes by Component

| Component | Attribute | Value | Condition |
|-----------|-----------|-------|-----------|
| `shell.tsx` `<a>` | `href` | `"#main-content"` | always |
| `shell.tsx` `<main>` | `id` | `"main-content"` | always |
| `footer.tsx` social `<a>` | `aria-label` | link description | always (remove from inner `<svg>`) |
| `footer.tsx` contact `<MapPin>` | `aria-hidden` | `"true"` | always |
| `footer.tsx` contact `<Phone>` | `aria-hidden` | `"true"` | always |
| `footer.tsx` contact `<Mail>` | `aria-hidden` | `"true"` | always |
| `forum.tsx` category `<Icon>` | `aria-hidden` | `"true"` | always |
| `threads.tsx` `<MessageSquare>` | `aria-hidden` | `"true"` | always |
| `reply-item.tsx` avatar wrapper | `aria-hidden` | `"true"` | always |
| `event-detail.tsx` `<ArrowLeft>` | `aria-hidden` | `"true"` | always |
| `admin-layout.tsx` `<nav>` | `aria-label` | `"Admin navigation"` | always |
| `admin-layout.tsx` `<Link>` | `aria-current` | `"page"` | `location.pathname === item.href` |
| `header.tsx` `<nav>` | `aria-label` | `"Main navigation"` | always |
| `header.tsx` `<Link>` | `aria-current` | `"page"` | `location.pathname === item.href` |
| `not-found.tsx` heading wrapper | `role` | `"alert"` | always |
| Loading content container | `aria-busy` | `"true"` / `"false"` | `isPending` from react-query |

## State Transitions

### Form Submission Flow

```
IDLE → (user clicks submit) → PENDING → (on success) → SUCCESS_GLOW (2s) → IDLE
                                    → (on error) → IDLE + toast.error
```

### Skip-to-Content Focus Flow

```
HIDDEN (sr-only) → (Tab key) → VISIBLE (focus:not-sr-only) → (click/Enter) → FOCUS MOVES to #main-content
```

### aria-busy Flow

```
LOADING (aria-busy=true) → (query resolves) → LOADED (aria-busy=false or attribute removed)
```
