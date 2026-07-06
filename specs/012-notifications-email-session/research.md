# Research: Notifications, Email Verification & Session Timeout

## 1. Notification Polling Pattern

**Finding**: The app uses @tanstack/react-query v5 for all API data fetching. No real-time connections exist.

**Decision**: Use `useQuery` with `refetchInterval: 30000` for notification polling. This is the idiomatic react-query approach — the library handles the interval, deduplication, and stale-while-revalidate caching. The `refetchIntervalInBackground` option is set to `false` (default) so polling automatically pauses when the tab is hidden.

**Alternatives considered**:
- WebSocket: Rejected — adds infrastructure complexity; 30s polling is sufficient for forum/event notifications
- SSE: Rejected — unidirectional but still requires server-side changes; polling is simpler
- `setInterval` + manual fetch: Rejected — react-query already provides interval-based refetching with better DX

## 2. Notification Panel Component

**Finding**: The existing `Sheet` component from shadcn/ui (slide-out panel) is already used in the mobile navigation. It supports `SheetTrigger` (bell icon), `SheetContent` (panel body), and nested scroll.

**Decision**: Use `Sheet` as the notification panel container. The bell icon wraps `SheetTrigger`. The panel body renders a scrollable list of `NotificationItem` components. Empty state uses the existing `EmptyState` component from `@/components/shared/empty-state.tsx` with a `BellOff` icon.

## 3. Notification Types

**Finding**: Three notification types defined in spec: `forum_reply`, `event_update`, `admin_announcement`.

**Decision**: Each type maps to a distinct icon (lucide-react): `MessageSquare` (forum_reply), `Calendar` (event_update), `Megaphone` (admin_announcement). Each type has a different target URL pattern and color accent.

## 4. Email Verification Integration

**Finding**: The auth context (`auth.tsx`) fetches user data from `/auth/me`. The user type currently has `id`, `name`, `email`, `role`. No `emailVerified` field exists.

**Decision**: Extend the `User` interface with `emailVerified: boolean`. Add `emailVerifiedAt?: string` for display purposes. The profile page (to be created in specs/010-user-profile) will show the verification banner. For now, the verification status is shown on the registration page and on any page where the user is unverified.

**Verification flow**: Registration response triggers `toast.success("Please check your email...")`. User navigates to `/verify-email?token=...` from email link. The verify-email page calls `POST /auth/verify-email` and shows success/error messages.

## 5. Session Timeout via 401 Interception

**Finding**: The API client (`api.ts`) currently throws an `Error` on non-OK responses. There is no global 401 handling — each page must catch and handle auth errors individually.

**Decision**: Add a custom `AuthError` class and modify `request()` to throw `AuthError` on 401. The `AuthContext` will subscribe to a global event (`auth:expired`) dispatched by the api client. When `AuthError` is caught, the api client dispatches the event. The `AuthContext` listener logs the user out and shows the expiry toast.

**Implementation**:
```typescript
// api.ts
export class AuthError extends Error {
  constructor() { super("Session expired"); this.name = "AuthError"; }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // ... existing code ...
  if (res.status === 401) {
    window.dispatchEvent(new CustomEvent("auth:expired"));
    throw new AuthError();
  }
  // ... rest of error handling ...
}
```

```typescript
// auth.tsx
useEffect(() => {
  const handler = () => {
    setUser(null);
    toast.error("Your session has expired. Please log in again.");
    navigate("/login", { state: { returnUrl: window.location.pathname } });
  };
  window.addEventListener("auth:expired", handler);
  return () => window.removeEventListener("auth:expired", handler);
}, []);
```

**Note**: This approach keeps the api.ts change minimal and decoupled from the auth context — no circular dependencies.

## 6. Existing Patterns

**Finding**: The app uses:
- `sonner` for toast notifications — `toast.success()`, `toast.error()`
- `lucide-react` for icons — `Bell`, `BellOff`, `MessageSquare`, `Calendar`, `Megaphone`, `Mail`, `MailCheck`, `MailX`
- `@/lib/utils.ts` with `cn()` for class merging
- `useQuery` / `useMutation` from @tanstack/react-query
- `Sheet` component from shadcn/ui for slide-out panels

**All UI primitives needed already exist in the project. No new shadcn components need to be installed.**
