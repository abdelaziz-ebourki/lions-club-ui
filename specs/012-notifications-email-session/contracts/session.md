# Session Timeout API Contract

## Behavior

The backend returns HTTP 401 for any authenticated endpoint when the session has expired.

### Session Configuration

| Property | Value | Description |
|----------|-------|-------------|
| Inactivity timeout | 30 minutes | Session expires if no API request made within 30min |
| Cookie type | httpOnly, SameSite=Lax | Standard secure cookie |
| Renewal | On each API request | Session TTL resets on each successful request |

### 401 Response Format

```json
{
  "error": "Session expired",
  "code": "SESSION_EXPIRED"
}
```

### 401 Response (unauthenticated)

```json
{
  "error": "Authentication required",
  "code": "NOT_AUTHENTICATED"
}
```

## Frontend Handling

### Flow

```
1. API client receives 401 response
2. API client dispatches `auth:expired` custom event on `window`
3. AuthContext listener catches the event
4. AuthContext sets user to null (logs out)
5. AuthContext shows toast: "Your session has expired. Please log in again."
6. AuthContext redirects to /login with ?return=/original-path
```

### Events

| Event | Detail | When |
|-------|--------|------|
| `auth:expired` | void | Any 401 response from any API endpoint |
