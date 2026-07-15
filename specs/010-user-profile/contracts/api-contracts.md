# API Contracts: User Profile

## GET /api/user/profile

Fetch full profile data for the authenticated user.

**Response** (200):
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "admin | member",
  "avatar": "string | null",
  "createdAt": "string (ISO 8601)",
  "lastLoginIp": "string | null",
  "accountStatus": "active | suspended | disabled | null"
}
```

**Errors**:
- `401` — Not authenticated (AuthError, handled by `api.ts` session timeout)

---

## PUT /api/user/profile

Update profile fields. Supports both JSON and multipart requests.

### JSON (name/email update)

**Request**:
```json
{
  "name": "string (optional)",
  "email": "string (optional)"
}
```

**Response** (200): Updated `UserProfile` object (same shape as GET).

### Multipart (name/email + avatar)

Sent as `FormData` via `api.upload()`. All fields optional; only included fields are updated.

**Request**:
```
name: "string"
email: "string"
avatar: File (image/png, image/jpeg, image/webp, max 5MB)
```

**Response** (200): Updated `UserProfile` with new `avatar` URL.

**Errors**:
- `400` — Validation error (invalid email format, missing name, etc.)
- `401` — Not authenticated
- `409` — Email already taken

---

## PUT /api/user/password

Change the user's password.

**Request**:
```json
{
  "currentPassword": "string",
  "newPassword": "string (min 8 chars)",
  "confirmPassword": "string"
}
```

**Response** (200):
```json
{
  "success": true
}
```

**Errors**:
- `400` — Validation error (password too short, mismatch)
- `401` — Current password is incorrect
- `401` — Not authenticated
