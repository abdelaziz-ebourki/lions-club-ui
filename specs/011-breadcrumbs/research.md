# Research: Breadcrumb Navigation

**Phase**: Phase 0 — Outline & Research
**Date**: 2026-07-11

## Resolved Unknowns

### 1. Breadcrumb Component API

| Decision | Detail |
|----------|--------|
| **Chosen** | shadcn/ui `breadcrumb` primitives (v4.12.0, base-sera preset) |
| **Rationale** | Already installed via `npx shadcn@4 add breadcrumb`. Provides `Breadcrumb` (nav), `BreadcrumbList` (ol), `BreadcrumbItem` (li), `BreadcrumbLink` (a), `BreadcrumbPage` (span with aria-current), `BreadcrumbSeparator` (ChevronRightIcon), `BreadcrumbEllipsis`. Matches project's design system convention. |
| **Alternatives** | Hand-rolled nav/ol/li — rejected because it duplicates existing shadcn patterns and breaks design system discipline. |

### 2. Dynamic Label Resolution

| Decision | Detail |
|----------|--------|
| **Chosen** | Per-page props — each page passes `trail` prop to `<Breadcrumbs>` |
| **Rationale** | Simplest approach, no global state, each page controls its own breadcrumb data naturally from its existing API hooks |
| **Alternatives** | Central route config (rejected — adds indirection), React Query cache (rejected — couples breadcrumbs to query keys), Context-based approach (rejected — over-engineered for shallow navigation tree) |

### 3. API Failure Fallback

| Decision | Detail |
|----------|--------|
| **Chosen** | Show "Unknown" as non-link plain text segment |
| **Rationale** | User choice during clarify. Better to show a placeholder than nothing or a broken link. |
| **Alternatives** | Omit the segment entirely (confusing — trail would skip a level), Show route param ID (user-unfriendly). |

### 4. Accessibility Pattern

| Decision | Detail |
|----------|--------|
| **Chosen** | `<nav aria-label="breadcrumb">` wrapping + `aria-current="page"` on last segment |
| **Rationale** | Matches WAI-ARIA Authoring Practices. The shadcn `Breadcrumb` component already renders `<nav aria-label="breadcrumb">` and `BreadcrumbPage` sets `aria-current="page"` natively. |
| **Alternatives** | Only `aria-current` without nav landmark (rejected — insufficient for WCAG 2.1 AA screen reader support). |

### 5. Out-of-Scope Pages

| Decision | Detail |
|----------|--------|
| **Chosen** | Home, login, register excluded |
| **Rationale** | User choice during clarify. Home is top-level, login/register are single-step destinations. |
| **Alternatives** | Show on all pages (adds noise to auth pages). |

### 6. Breadcrumb Placement in Page Hierarchy

| Decision | Detail |
|----------|--------|
| **Chosen** | Between page header (PageHero/AdminPageHeader) and content section |
| **Rationale** | Matches the existing pattern where pages compose header + content. Breadcrumbs sit below the hero/header and above the main content area. The `<Breadcrumbs>` component wraps with `mb-4` or similar spacing. |
| **Alternatives** | In Shell layout automatically (rejected — per-page approach chosen, and Shell is too high — breadcrumbs would appear above PageHero which is wrong visually). |

### 7. Admin Edit Page Labels

| Decision | Detail |
|----------|--------|
| **Chosen** | "Edit [Entity Name]" for edit mode, "New [Entity Name]" for create mode |
| **Rationale** | Follows FR-008 pattern (acceptance scenario shows "Edit [Event Title]"). The page determines its mode from the route params (presence of `:id`). |
| **Alternatives** | Generic "Edit" or "Create" without entity name (less contextual). |
