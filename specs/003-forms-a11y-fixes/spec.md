# Forms Validation & Accessibility Fixes

**Short name**: forms-a11y-fixes
**Tickets**: #20 (forms), #16 (accessibility)
**Created**: 2026-07-03

## Problem Statement

Seven form validation gaps (missing maxLength, missing "ongoing" event status, no character counts, no submission spinners, no success feedback) and twelve accessibility violations (no skip-to-content, missing aria attributes, broken heading hierarchy, missing roles) degrade the app's quality and compliance.

## User Scenarios

**S1 — Admin creates an "ongoing" event**
Admin opens event form, selects "Ongoing" for status, fills all fields, submits. The event is saved with status "ongoing" and displayed correctly in the events list.

**S2 — User submits a form with excessively long text**
User types 500+ characters into a 50-character max field on any form. The form shows a validation error before submission and prevents submission.

**S3 — User sees character count while typing**
User types content into a form field and sees a live counter: `42/200`. When approaching the limit, the counter changes color as a warning.

**S4 — User submits a form and sees an animated spinner**
User clicks "Save" / "Send" / "Post" on any form. The button shows a spinning animation (replacing text or alongside it) while the request is in flight. The button is disabled to prevent double-submission.

**S5 — User sees success feedback on saved form**
After a successful form submission, the saved fields briefly show a success border/glow (e.g., green border for 2 seconds) in addition to any toast notification.

**S6 — Keyboard user skips to main content**
User presses Tab on page load. The first focusable element is a "Skip to content" link. Activating it moves focus to the main content area.

**S7 — Screen reader user navigates by landmarks**
Screen reader user opens rotor/landmark list and sees distinct labeled navigation regions: "Main navigation" (header), "Admin navigation" (sidebar).

**S8 — Screen reader user identifies current page**
Screen reader user navigates links in the admin sidebar or public header. The current page's link is announced as "current page" or "current location."

**S9 — Screen reader user encounters a 404 page**
Browser navigates to a non-existent route. Screen reader immediately announces "Alert: Page Not Found."

**S10 — Screen reader user encounters loading content**
A page loads data asynchronously. Screen reader announces "Loading" state via `aria-busy` on content regions.

**S11 — Screen reader user encounters decorative icons**
Screen reader user navigates through the forum category list, thread list, reply avatars, footer contact info, and event detail back button — none of the decorative icons are announced.

**S12 — Screen reader user encounters footer social links**
Screen reader user navigates to footer social media links. Each link has a single, clear label (e.g., "Visit our Facebook page") without duplicate announcements from the icon.

## Functional Requirements

### Forms (FR-F01–FR-F12)

| ID       | Requirement                                                                  | Scenario |
|----------|------------------------------------------------------------------------------|----------|
| FR-F01   | Event form Zod status enum must include `"upcoming" \| "ongoing" \| "past"`  | S1       |
| FR-F02   | Event form must not coerce "ongoing" to "past" on edit population            | S1       |
| FR-F03   | Contact form must have maxLength on name (100), subject (200), message (2000)| S2       |
| FR-F04   | Member form must have maxLength on name (100), role (100), bio (500)         | S2       |
| FR-F05   | Event form must have maxLength on title (200), description (2000), location (200) | S2  |
| FR-F06   | New-thread form must have maxLength on title (200), content (5000)           | S2       |
| FR-F07   | Contact, member, event, and new-thread forms must show live character count  | S3       |
| FR-F08   | Character count should turn orange above 80% of max, red at 100%             | S3       |
| FR-F09   | All form submit buttons must show an animated SVG spinner during submission  | S4       |
| FR-F10   | Submit button must be disabled while request is in flight                    | S4       |
| FR-F11   | After successful save, validated fields must briefly show a green border     | S5       |
| FR-F12   | The spinner + success border must work with react-hook-form and react-query  | S4, S5   |

### Accessibility (FR-A01–FR-A14)

| ID       | Requirement                                                                  | Scenario |
|----------|------------------------------------------------------------------------------|----------|
| FR-A01   | shell.tsx must have a skip-to-content `<a>` as the first focusable child, linking to `#main-content` | S6 |
| FR-A02   | `<main>` must have `id="main-content"` for the skip link target              | S6       |
| FR-A03   | Footer social `<a>` links must have single `aria-label`; inner `<svg>` must use `aria-hidden="true"` | S12 |
| FR-A04   | Footer contact icons (MapPin, Phone, Mail) must have `aria-hidden="true"`   | S11      |
| FR-A05   | Forum category `<Icon>` in `forum.tsx` must have `aria-hidden="true"`        | S11      |
| FR-A06   | Thread list `MessageSquare` in `threads.tsx` must have `aria-hidden="true"`  | S11      |
| FR-A07   | Reply avatar initials wrapper in `reply-item.tsx` must have `aria-hidden="true"` | S11   |
| FR-A08   | Event detail `ArrowLeft` back icon must have `aria-hidden="true"`            | S11      |
| FR-A09   | Admin `<nav>` in `admin-layout.tsx` must have `aria-label="Admin navigation"`| S7       |
| FR-A10   | Admin sidebar active `<Link>` must have `aria-current="page"`                | S8       |
| FR-A11   | Public header `<nav>` in `header.tsx` must have `aria-label="Main navigation"`| S7      |
| FR-A12   | Public header and mobile sheet active `<Link>` must have `aria-current="page"`| S8      |
| FR-A13   | 404 page must wrap the error heading in a container with `role="alert"`      | S9       |
| FR-A14   | Loading regions must set `aria-busy="true"` on the content container while loading | S10 |

## Success Criteria

| ID    | Criterion                                                                 | Type      |
|-------|---------------------------------------------------------------------------|-----------|
| SC-1  | Admin can create and edit events with status "ongoing" without coercion   | Functional |
| SC-2  | All 4 forms reject submissions exceeding maxLength with inline errors    | Functional |
| SC-3  | All 4 forms display a live `{length}/{max}` counter on every keystroke   | Functional |
| SC-4  | Counter transitions to orange ≥80% and red at 100% of max                | Functional |
| SC-5  | All 6 submit buttons show animated spinner during submission, disabled    | Functional |
| SC-6  | After successful save, validated fields show green border/glow for 2s     | Functional |
| SC-7  | Pressing Tab on any page focuses "Skip to content" as the first element   | Functional |
| SC-8  | Axe-core scan shows 0 violations for landmarks, aria, and heading hierarchy| Automated |
| SC-9  | Social link icons are not announced by screen readers                     | Manual    |
| SC-10 | Decorative icons throughout the app are not announced                    | Manual    |
| SC-11 | Screen reader identifies current page via `aria-current="page"`           | Manual    |
| SC-12 | 404 page content is announced as an alert by screen readers               | Manual    |
| SC-13 | Loading content regions announce busy state to screen readers             | Manual    |
| SC-14 | No regressions in existing test suite (105/105 tests pass)               | Automated |
| SC-15 | `tsc -b` passes with no errors                                           | Automated |
| SC-16 | `npm run lint` passes (excluding pre-existing errors)                    | Automated |

## Key Entities

- **EventSchema** (Zod) — status enum expanded to include "ongoing"
- **ContactSchema**, **MemberSchema**, **ThreadSchema** (Zod) — maxLength constraints added
- **SkipLink** — new component or inline element in shell.tsx
- **SpinnerIcon** — new shared SVG/animated component for submit buttons
- **SuccessFeedback** — green border utility applied to validated fields after save

## Out of Scope

- Search feature (already built)
- Image upload (scheduled for later batch)
- Profile page, breadcrumbs, email verification, session timeout (#18)
- Performance optimization (#23)
- Responsive hidden columns (#24)
- Security improvements (#25)
- SEO improvements (#19)
- Font loading warnings (#11)
- Loading skeletons on admin list pages
- Login/register toast
- Confirmation dialogs on thread toggles
- Remember me checkbox
- Hardcoded homepage stats
- Empty states

## Assumptions

- All forms use react-hook-form + Zod resolvers (confirmed by codebase audit)
- `sonner` toast already fires on success — success border animation is additional visual feedback
- Each form's Zod schema is defined inline in the component file
- `aria-current="page"` uses exact pathname match — consistent with existing pattern
- maxLength values are reasonable industry defaults per field type
- All accessibility fixes are purely HTML attribute additions — no behavioral changes

## Dependencies

None. All fixes are self-contained within existing files. No new packages or API changes needed.
