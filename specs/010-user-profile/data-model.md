# Data Model: User Profile

## Types

### UserProfile (extends User from auth context)

The `User` type in `src/contexts/auth.tsx` is the local/auth representation. A separate `UserProfile` type is needed for the full profile fetched from the API.

```ts
// src/types/index.ts

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  avatar?: string;
  createdAt: string;
  // Admin-only fields (returned by API only for admin users):
  lastLoginIp?: string;
  accountStatus?: "active" | "suspended" | "disabled";
}
```

### PasswordChange

Request body for password change.

```ts
export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
```

### ProfileUpdate

Request body for updating profile fields via JSON.

```ts
export interface ProfileUpdate {
  name?: string;
  email?: string;
}
```

## Zod Schemas

### Profile Edit Schema

```ts
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be 100 characters or less"),
  email: z.string().email("Please enter a valid email address"),
});
```

### Password Change Schema

```ts
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
```

## State Transitions

- **Profile**: View → Edit mode (inline) → Submit → View (updated)
- **Avatar**: View → Open modal → Select file + preview → Confirm → Upload → View (updated)
- **Password**: View section → Fill form → Submit → Success toast → Form reset

## Validation Rules

| Field | Rule |
|-------|------|
| name | 2–100 characters |
| email | Valid email format |
| avatar | PNG, JPEG, WebP only; max 5MB (via `uploadConfig`) |
| currentPassword | Required |
| newPassword | ≥ 8 characters |
| confirmPassword | Must match `newPassword` |
