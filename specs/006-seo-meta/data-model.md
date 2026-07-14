# Data Model: SEO Metadata

## SEOMetadata

Core type for per-page SEO configuration.

```typescript
interface SEOMetadata {
  /** Page <title> — format: "[Page Specific] — Lions Club FSBM" */
  title: string;
  /** <meta name="description"> content — max 160 chars */
  description: string;
  /** <meta property="og:image"> URL — defaults to /logo.png */
  image?: string;
  /** <meta name="twitter:site"> — organization Twitter handle */
  twitterSite?: string;
  /** <meta property="og:type"> — "website" (default) or "article" for detail pages */
  ogType: "website" | "article";
  /** <link rel="canonical"> — defaults to window.location.origin + pathname */
  canonical?: string;
  /** <meta name="robots"> — set "noindex" for admin/auth pages if needed */
  noindex?: boolean;
}
```

### Field Mapping

| Tag | Source |
|-----|--------|
| `<title>` | `SEOMetadata.title` |
| `<meta name="description">` | `SEOMetadata.description` |
| `<link rel="canonical">` | `SEOMetadata.canonical` or auto-generated |
| `<meta property="og:title">` | mirrors `SEOMetadata.title` |
| `<meta property="og:description">` | mirrors `SEOMetadata.description` |
| `<meta property="og:image">` | `SEOMetadata.image` or default `/logo.png` |
| `<meta property="og:url">` | mirrors canonical URL |
| `<meta property="og:type">` | `SEOMetadata.ogType` |
| `<meta name="twitter:card">` | always `"summary_large_image"` |
| `<meta name="twitter:title">` | mirrors `SEOMetadata.title` |
| `<meta name="twitter:description">` | mirrors `SEOMetadata.description` |
| `<meta name="twitter:image">` | mirrors `SEOMetadata.image` |
| `<meta name="twitter:site">` | `SEOMetadata.twitterSite` or `@lionsclubfsbm` |

## SEO Config Map

Static metadata for each route, keyed by route path pattern.

```typescript
type SEOConfigMap = Record<string, SEOMetadata | ((params: Record<string, string>) => SEOMetadata)>;
```

Routes with dynamic data (event detail, thread detail) use a function resolver that accepts route params and returns `SEOMetadata` after data loads.

## Page Metadata Table

| Route | Title | Description | ogType | Dynamic? | noindex |
|-------|-------|-------------|--------|----------|---------|
| `/` | Lions Club FSBM — Community Service in Casablanca | Lions Club FSBM is a community service organization in Casablanca, Morocco... | website | No | No |
| `/events` | Events — Lions Club FSBM | Browse upcoming and past community service events organized by Lions Club FSBM... | website | No | No |
| `/events/:id` | [Event Title] — Lions Club FSBM | First 160 chars of event.description | article | Yes (event) | No |
| `/forum` | Forum — Lions Club FSBM | Join the Lions Club FSBM forum to discuss community projects... | website | No | No |
| `/forum/:categoryId` | [Category Name] — Lions Club FSBM | Category description from API | website | Yes (category) | No |
| `/forum/:categoryId/:threadId` | [Thread Title] — Lions Club FSBM | First 160 chars of thread.content | article | Yes (thread) | No |
| `/forum/:categoryId/new` | New Thread — Lions Club FSBM | Create a new discussion thread in the Lions Club FSBM forum | website | No | No |
| `/search` | Search: [query] — Lions Club FSBM | Search results for [query] — find events, forum discussions... | website | Yes (query param) | No |
| `/about` | About Us — Lions Club FSBM | Learn about Lions Club FSBM's mission, history, and impact... | website | No | No |
| `/contact` | Contact Us — Lions Club FSBM | Get in touch with Lions Club FSBM in Casablanca... | website | No | No |
| `/login` | Sign In — Lions Club FSBM | Sign in to your Lions Club FSBM account... | website | No | No |
| `/register` | Join Us — Lions Club FSBM | Join Lions Club FSBM and become part of a community service... | website | No | No |
| `/profile` | Profile — Lions Club FSBM | Your Lions Club FSBM profile and account settings | website | No | Yes |
| `/verify-email` | Verify Email — Lions Club FSBM | Verify your email address for Lions Club FSBM | website | No | Yes |
| `/admin/*` | Admin — Lions Club FSBM | Generic admin description | website | No | Yes |
| `*` (404) | Page Not Found — Lions Club FSBM | Page not found — Return to the Lions Club FSBM homepage | website | No | No |

## Existing Types (No Changes Needed)

The following existing types provide sufficient data for dynamic SEO:

- `Event.title` → og:title, twitter:title
- `Event.description` → og:description (truncated to 160 chars)
- `Event.image` → og:image (fallback to /logo.png)
- `ForumThread.title` → og:title, twitter:title
- `ForumThread.content` → og:description (truncated to 160 chars)
- `ForumCategory.name` → page title for category listing
- `SiteConfig.description` → fallback description for homepage
- `SiteConfig.social` → source for `twitter:site` value (`@lionsclubfsbm`)
