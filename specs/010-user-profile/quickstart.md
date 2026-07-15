# Quickstart: User Profile Validation

## Prerequisites

- Dev server running (`npm run dev`) — MSW auto-starts and mocks the API
- Test credentials for authentication (register a user or use MSW default)

## Validation Scenarios

### 1. Profile View （Read-Only）

1. Navigate to `/login` and sign in with valid credentials
2. Click the "Profile" link in the header (or navigate to `/profile`)
3. **Expected**: See name, email, role, "Member since" date displayed in a Card layout
4. If email is unverified, the `EmailVerificationBanner` appears above the card

### 2. Profile View （Unauthenticated）

1. While logged out, navigate to `/profile`
2. **Expected**: Redirected to `/login` with the return URL preserved

### 3. Edit Profile （Name/Email）

1. On the profile page, click "Edit Profile"
2. Fields become editable (name, email rendered as `<Input>` fields)
3. Change the name and click "Save Changes"
4. **Expected**: Success toast appears ("Profile updated successfully"), fields revert to view mode with updated values
5. Reload the page — changes persist

### 4. Edit Profile （Cancel）

1. Enter edit mode, modify fields, then click "Cancel"
2. **Expected**: All fields revert to original values, edit mode closes

### 5. Edit Profile （Validation）

1. Enter edit mode, clear the name field, click "Save"
2. **Expected**: Inline error "Name must be at least 2 characters" appears
3. Enter an invalid email like "notanemail", click "Save"
4. **Expected**: Inline error "Please enter a valid email address" appears

### 6. Avatar Upload

1. On the profile page, click the avatar (or "Change Avatar" button)
2. **Expected**: A modal dialog opens with file picker and preview area
3. Select a valid image file (PNG, JPEG, or WebP, <5MB)
4. **Expected**: Preview of the selected image appears
5. Click "Confirm" or "Save"
6. **Expected**: Modal closes, avatar updates, success toast appears

### 7. Avatar Upload — Validation

1. Open the avatar modal and select a file >5MB
2. **Expected**: Inline validation error: "File is too large. Maximum size is 5MB"
3. Select a non-image file (e.g., .pdf, .txt)
4. **Expected**: Inline validation error about accepted formats

### 8. Change Password

1. On the profile page, locate the "Change Password" section
2. Enter current password, new password (≥8 chars), and confirmation
3. Click "Update Password"
4. **Expected**: Success toast "Password updated successfully", form resets
5. Log out, log in with the new password — confirms the change

### 9. Change Password — Validation

1. Enter mismatched new passwords
2. **Expected**: Inline error "Passwords do not match" on confirm field
3. Enter a new password <8 characters
4. **Expected**: Inline error "Password must be at least 8 characters"
5. Enter an incorrect current password
6. **Expected**: Error toast or inline error "Current password is incorrect"

### 10. Loading State

1. Navigate to the profile page while data is being fetched
2. **Expected**: Skeleton loaders matching the profile layout are shown (avatar circle + text lines)
3. Once data loads, skeleton is replaced with actual content

## Running Tests

```bash
# Run all tests (includes profile tests)
npm run test:run

# Run specific profile tests
npx vitest run src/pages/profile/
```

## Key Reference Files

- [Spec](./spec.md) — Feature requirements and acceptance criteria
- [Data Model](./data-model.md) — Types and Zod schemas
- [API Contracts](./contracts/api-contracts.md) — Endpoint contracts
