# Quickstart: Notifications, Email Verification & Session Timeout

## Prerequisites

- Node.js, npm installed
- `npm install` completed
- Dev server: `npm run dev`

## Verification Scenarios

### 1. Notification bell and panel

```bash
npm run test:run -- --grep "notification|bell|notification panel"
```

**Expected**: Tests pass for notification bell visibility, badge count, panel open/close, notification click navigation, and empty state.

**Manual**: Start dev server → log in → verify bell icon appears in header with 0 badge → (requires backend) create a notification → verify badge updates → click bell → verify panel opens with notification list → click a notification → verify navigation + badge decrements.

### 2. Email verification flow

```bash
npm run test:run -- --grep "email.*verif|verify.*email|verification"
```

**Expected**: Tests pass for registration toast, verification banner display, resend cooldown, verification link success/error states.

**Manual**: Register a new account → verify "Please check your email" toast → navigate to profile → verify "Email not verified" banner → click "Resend verification email" → verify "Verification email sent" toast → verify button is disabled for 60s with countdown.

### 3. Session timeout

```bash
npm run test:run -- --grep "session.*timeout|session.*expir|401.*redirect"
```

**Expected**: Tests pass for 401 interception, logout on expiry, expiry toast, and return URL preservation.

**Manual**: Log in → wait 30min (or ask backend to expire session) → click any link → verify redirect to /login with "Your session has expired" toast → log in again → verify redirected back to original page.

### 4. Polling behavior

```bash
npm run test:run -- --grep "polling|notification.*interval"
```

**Expected**: Tests pass for 30s polling interval, polling pause on tab hide, and resume on tab show.

## Full Test Suite

```bash
npm run test:run
npx tsc -b
npm run lint
```

**Expected**: All existing tests pass, `tsc -b` zero errors, lint passes (excluding pre-existing errors in test files).

## Build Verification

```bash
npm run build
```

**Expected**: Type-check + production build succeeds with no errors.
