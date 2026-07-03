# Quickstart: UX Polish

## Prerequisites

- Node.js, npm installed
- `npm install` completed
- Dev server: `npm run dev`

## Verification Scenarios

### 1. Loading skeletons

```bash
npm run test:run -- --grep "skeleton|loading"
```

**Expected**: Tests pass for skeleton visibility on admin events, admin members, forum categories, forum threads, and search results pages during loading state.

**Manual**: Start dev server → navigate to admin events → verify skeleton cards appear while data loads → verify they transition to real content.

### 2. Empty states

```bash
npm run test:run -- --grep "empty|no data|empty state"
```

**Expected**: All 5 empty states render with appropriate message and call-to-action when no data exists.

**Manual**: Navigate to empty admin events → verify "No projects yet" + "Create your first project". Navigate to empty forum category → verify "No discussions yet" + "Start a discussion".

### 3. Remember me on login

```bash
npm run test:run -- --grep "remember"
```

**Expected**: Login form renders "Remember me" checkbox. Checking it stores a flag; unchecking removes it.

**Manual**: Go to login page → verify "Remember me" checkbox exists below password field → check it and sign in → verify localStorage has `remember_me` flag.

### 4. RSVP on event detail

```bash
npm run test:run -- --grep "rsvp|join.*event"
```

**Expected**: Event detail shows "Join Event" button. Clicking it changes to "Going". Past events hide the button.

**Manual**: Navigate to an upcoming event → click "Join Event" → verify button changes to "Going" → navigate to a past event → verify button is not shown.

### 5. Success toasts on login/register

```bash
npm run test:run -- --grep "success.*toast|welcome.*back|account.*created"
```

**Expected**: Login triggers "Welcome back!" toast. Register triggers "Account created successfully!" toast.

**Manual**: Log in with valid credentials → verify "Welcome back!" toast appears briefly. Register new account → verify "Account created successfully!" toast appears.

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
