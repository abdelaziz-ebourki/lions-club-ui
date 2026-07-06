# Email Verification API Contract

## Endpoints

### POST /api/auth/register

Registration triggers verification flow.

#### Response (200)

```json
{
  "success": true,
  "user": { "id": "user-1", "name": "...", "email": "...", "role": "member", "emailVerified": false },
  "message": "Registration successful. Please check your email to verify your account."
}
```

### POST /api/auth/verify-email?token={token}

Verify email using the token from the verification link.

#### Query Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| token | string | Yes | Verification token from email link |

#### Response (200)

```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

#### Response (400 — expired token)

```json
{
  "success": false,
  "error": "Verification link has expired. Please request a new one."
}
```

#### Response (400 — invalid token)

```json
{
  "success": false,
  "error": "Invalid verification link."
}
```

### POST /api/auth/resend-verification

Resend the verification email.

#### Request

```json
{}
```

#### Response (200)

```json
{
  "success": true,
  "message": "Verification email sent",
  "nextResendAt": "2026-07-06T10:31:00Z"
}
```

#### Response (429 — rate limited)

```json
{
  "success": false,
  "error": "Please wait before requesting another verification email.",
  "retryAfter": 45
}
```

### GET /api/auth/me

Augmented to include email verification status.

#### Response (200) — unverified

```json
{
  "id": "user-1",
  "name": "Ahmed",
  "email": "ahmed@example.com",
  "role": "member",
  "emailVerified": false
}
```

#### Response (200) — verified

```json
{
  "id": "user-1",
  "name": "Ahmed",
  "email": "ahmed@example.com",
  "role": "member",
  "emailVerified": true,
  "emailVerifiedAt": "2026-07-06T10:00:00Z"
}
```

## Verification Token

- **Format**: Cryptographically random string, URL-safe base64
- **Expiry**: 24 hours from creation
- **Usage**: Single-use — once verified, token is invalidated
