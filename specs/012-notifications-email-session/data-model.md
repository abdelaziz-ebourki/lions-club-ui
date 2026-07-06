# Data Model: Notifications, Email Verification & Session Timeout

## TypeScript Types

### Notification

```typescript
export type NotificationType = "forum_reply" | "event_update" | "admin_announcement";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  targetUrl: string;
  read: boolean;
  createdAt: string;
}
```

### NotificationContext

```typescript
export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isOpen: boolean;
}
```

### EmailVerification

```typescript
export interface EmailVerificationStatus {
  verified: boolean;
  verifiedAt?: string;
  pendingResendUntil?: string; // ISO timestamp when resend cooldown expires
}
```

### AuthError (API client)

```typescript
export class AuthError extends Error {
  constructor() {
    super("Session expired");
    this.name = "AuthError";
  }
}
```

## UI Component Props

### NotificationBell

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| unreadCount | number | Yes | Current count of unread notifications |
| onClick | () => void | Yes | Opens the notification panel |

### NotificationPanel

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| notifications | Notification[] | Yes | List of notifications to display |
| onNotificationClick | (id: string) => void | Yes | Mark as read + navigate |
| onClose | () => void | Yes | Close the panel |

### NotificationItem

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| notification | Notification | Yes | The notification data to render |
| onClick | (id: string) => void | Yes | Click handler |

### EmailVerificationBanner

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| status | EmailVerificationStatus | Yes | Current verification state |
| onResend | () => Promise<void> | Yes | Resend verification email handler |
| cooldownSeconds | number | Yes | Remaining cooldown seconds |

## State Machines

### Notification Polling

```
Page visible → poll every 30s
Tab hidden → stop polling
Tab visible → immediate fetch, resume 30s interval
```

### Email Verification Resend

```
idle → click "Resend" → cooldown (60s) → idle
    ↳ error → idle (immediate)
```

### Session Timeout

```
authenticated → API returns 401 → dispatch auth:expired → clear user → show toast → redirect to /login
```
