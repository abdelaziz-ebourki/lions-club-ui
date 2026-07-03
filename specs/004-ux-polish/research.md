# Research: UX Polish

## 1. Skeleton Component

**Finding**: `Skeleton` from `@/components/ui/skeleton` is already used in 4 pages:
- `forum.tsx` — loading state for categories
- `threads.tsx` — loading state for thread list
- `thread-detail.tsx` — loading state for thread detail
- `admin-forum.tsx` — loading state for admin forum list

**Not covered**: admin events list, admin members list, search results page.

**Pattern**: Each page renders `Skeleton` elements inside the same container structure as the real content, matching card/list dimensions. Skeletons are wrapped in a div with `aria-busy="true"` where applicable.

**Decision**: Replicate the existing skeleton pattern for admin events, admin members, and search results pages. Use `Skeleton` with matching dimensions (Card → Skeleton h-6 w-48 for title, h-4 w-72 for description).

## 2. EmptyState Component

**Finding**: No reusable empty state component exists. Each page that needs one currently shows either nothing or a bare "No items" text.

**Decision**: Create a shared `EmptyState` component at `src/components/shared/empty-state.tsx`:
- Props: `icon` (LucideIcon, optional), `title` (string), `description` (string, optional), `action` (ReactNode, optional — for CTA button/link)
- Renders a centered flex column with icon (50% opacity, large), title (h3/h4), description (body muted), and action slot
- Uses `role="status"` for screen reader announcement
- No new dependencies — uses lucide-react icons, cn() for styling, existing design tokens

## 3. "Remember Me" Implementation

**Finding**: The AuthContext uses httpOnly session cookies — no client-side persistence logic exists. The login form has no "Remember me" checkbox.

**Decision**:
- Add a checkbox input "Remember me" to the login form below the password field
- Store a `remember_me` flag in `localStorage` when checked
- On app init, check localStorage for the flag; if present, include a query parameter or header in the login request to request extended session
- The flag is cleared on explicit logout
- If the backend does not support differentiated session TTL, the localStorage flag can still be used for client-side UX hint on next visit (show/hide login form)
- **Fallback**: If backend doesn't support extended sessions, "Remember me" toggles a localStorage hint that pre-fills the email field on return visits

## 4. RSVP API Contract

**Finding**: The spec assumes a new `POST /events/:id/rsvp` endpoint. The existing API (`@/lib/api.ts`) uses typed fetch wrapper.

**Decision**: Define contract:
- `POST /events/:id/rsvp` — body: `{}` (empty, user inferred from auth cookie)
- Response: `{ success: boolean, rsvpCount: number }`
- `GET /events/:id` — augmented to include `rsvpCount: number` and `hasRsvpd: boolean` in response
- Optimistic: if backend endpoint not available, toggle RSVP locally and store in component state
