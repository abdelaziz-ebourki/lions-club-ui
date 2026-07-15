# Research: User Profile Page

## Decision Log

### Avatar Upload UX
- **Decision**: Modal dialog with file picker + preview + confirm/cancel
- **Rationale**: Matches shadcn Dialog pattern already in use; keeps profile page clean; provides preview before commit
- **Alternatives considered**: Inline file picker (disrupts layout), auto-upload on selection (no confirmation step)

### Password Change Session Behavior
- **Decision**: Current session stays valid; all other sessions/tokens invalidated
- **Rationale**: Standard practice (GitHub, Google). User proved identity by providing current password. Force re-login adds friction without security benefit.
- **Alternatives considered**: Force re-login all sessions (overly aggressive), keep all sessions (insecure)

### User vs Member Model
- **Decision**: All registered users are members with a role; admins see additional admin-level info on their profile
- **Rationale**: Matches existing `User.role` field in auth context (`"admin" | "member"`); no separate membership table needed
- **Alternatives considered**: Separate member/non-member tiers (adds complexity without product need)

### Loading State
- **Decision**: Skeleton loaders matching profile layout
- **Rationale**: Already used across the app; provides clear visual feedback of page structure
- **Alternatives considered**: Spinner (generic, less informative), blank page (poor UX)

## Codebase Findings

### Existing Profile Page
- `src/pages/profile/profile.tsx` — read-only view with name, email, role, member since
- `src/pages/profile/__tests__/profile.test.tsx` — tests for existing view (3 tests)
- Route at `/profile` already registered in `src/App.tsx:60`
- Header "Profile" link exists in `src/components/shared/HeaderUserActions.tsx:16-21`
- Uses `EmailVerificationBanner` — already integrated

### User Type (Auth Context)
```ts
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  emailVerified: boolean;
  createdAt?: string;
}
```

### API Layer
- `api.get<T>(endpoint)` — GET request
- `api.put<T>(endpoint, body)` — PUT with JSON body
- `api.upload<T>(endpoint, formData, method?)` — PUT with multipart/form-data (for avatar)

### Form Pattern Reference
- `useForm<FormData>({ resolver: zodResolver(schema), defaultValues })` from react-hook-form
- Mutation via `useMutation` from @tanstack/react-query
- `toast.success()` / `toast.error()` from sonner
- `form.handleSubmit(onSubmit)` pattern

### File Upload Component
- `FileUpload` from `@/components/ui/file-upload.tsx` — supports `variant="circle"` for avatar
- `uploadConfig` from `@/config/index.ts` — 5MB max, image/png, image/jpeg, image/webp

### API Endpoints (Assumed)
- `GET /api/user/profile` → returns UserProfile (full profile data)
- `PUT /api/user/profile` → accepts JSON or multipart, returns updated UserProfile
- `PUT /api/user/password` → accepts { currentPassword, newPassword, confirmPassword }
