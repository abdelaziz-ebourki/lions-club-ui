# Implementation Plan: Notifications, Email Verification & Session Timeout

**Branch**: `012-notifications-email-session` | **Date**: 2026-07-06 | **Spec**: specs/012-notifications-email-session/spec.md

**Input**: Feature specification from `specs/012-notifications-email-session/spec.md`

## Summary

Add three missing user-facing features: (1) notification bell + panel with HTTP polling at 30s for forum reply, event update, and admin announcement notifications; (2) email verification flow with 24h token expiry and 60s resend cooldown; (3) session timeout handling via global 401 interception in the API client with 30min inactivity window. All three are self-contained additions to existing patterns.

## Technical Context

**Language/Version**: TypeScript 6 (strict mode), React 19, Vite 8, ESM

**Primary Dependencies**: @tanstack/react-query v5, sonner (toasts), lucide-react (icons), Tailwind v4, shadcn/ui Sheet (notification panel)

**Storage**: N/A (client-side SPA — notification state from API, email verification status from profile API, session managed via cookies)

**Testing**: Vitest v4 + @testing-library/react v16 + MSW v2

**Target Platform**: Modern browsers (ES2023), WCAG 2.1 AA

**Project Type**: Single-page application (React SPA)

**Performance Goals**: 30s notification polling interval acceptable per clarify; polling pauses when tab hidden

**Constraints**: No regressions; existing test suite must pass; tsc -b zero errors; notification backend endpoints assumed; email verification backend assumed; 401 session handling is additive to existing api.ts

**Scale/Scope**: ~15+ files (8 new: hooks, components, pages; 7+ modified: api.ts, auth.tsx, header.tsx, App.tsx, types/index.ts, register.tsx, mocks), ~5 new data types in @/types

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Principle I — TDD is Non-Negotiable**
- ✅ All behavioral changes are testable: notification bell visibility, badge count, panel open/close, notification click navigation, email verification status display, resend cooldown timer, 401 redirect, session expiry toast
- ⚠️ Polling interval timing (30s with Page Visibility API pause) is an integration concern — test via MSW mock with controlled response timing rather than wall-clock waits
- **Decision**: Write unit tests for all component behaviors. Use MSW to simulate notification API responses, email verification endpoints, and 401 responses. Use fake timers for polling interval tests.

**Principle IV — TypeScript-First, Type-Safe**
- ✅ All new types added to `@/types/index.ts`: Notification, NotificationType, EmailVerificationStatus. No `any` required.
- ✅ API client modification for 401 interception is type-safe — throws typed error that AuthContext catches.

**Principle V — Component & Design System**
- ✅ Notification panel uses existing `Sheet` component from shadcn/ui
- ✅ Notification bell uses lucide-react `Bell` icon
- ✅ Badge count uses existing `Badge` component
- ✅ Email verification banner uses existing styles
- ✅ Session timeout toast uses existing `sonner` toasts
- ✅ Use `cn()` for conditional classes, Tailwind v4 for styling

**Principle VI — Best Practices & WCAG 2.1 AA**
- ✅ Notification bell has `aria-label="Notifications (N unread)"` with live badge
- ✅ Notification panel uses `role="dialog"` with `aria-label`
- ✅ Notification list items are focusable and keyboard-navigable
- ✅ Empty states use `role="status"`
- ✅ Session redirect makes auth status change explicit to screen readers

**Gate Result (post-design)**: PASS — no violations. All changes follow existing patterns.

## Project Structure

### Documentation (this feature)

```text
specs/012-notifications-email-session/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   ├── notification.md  # Notification API contract
│   ├── email-verification.md  # Email verification API contract
│   └── session.md       # Session timeout API contract
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── layout/
│   │   └── header.tsx           # Add notification bell + badge
│   ├── notifications/
│   │   ├── notification-panel.tsx  # New: slide-out panel with notification list
│   │   └── notification-item.tsx   # New: single notification row
│   ├── shared/
│   │   └── email-verification-banner.tsx  # New: verification status banner for profile
│   └── ui/
│       ├── index.ts             # Export new components
│       └── sheet.tsx            # Already exists — used by notification panel
├── contexts/
│   └── auth.tsx                 # Add 401 handling, logout on session expiry
├── hooks/
│   ├── use-notifications.ts     # New: notification polling + mark-as-read hook
│   ├── use-session-timeout.ts   # New: 401 interception hook
│   └── use-email-verification.ts # New: verification status + resend hook
├── lib/
│   └── api.ts                   # Add global 401 interceptor
├── pages/
│   ├── auth/
│   │   ├── login.tsx            # No change — session timeout is global
│   │   └── register.tsx         # Add verification prompt toast
│   ├── profile/
│   │   └── profile.tsx          # New: profile page with email verification + resend
│   └── verify-email.tsx         # New: verification link landing page
├── types/
│   └── index.ts                 # Add Notification, EmailVerification types
└── App.tsx                      # Add profile route, email verification route
```

**Structure Decision**: Single-project SPA (Option 1). All new code lives under existing `src/` structure — new `notifications/` component folder, new hooks, new pages. No backend changes required.

## Complexity Tracking

> No violations found. All changes follow existing patterns and Constitution principles.
