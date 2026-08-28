export const SEO_DEFAULT_IMAGE = "/logo.png";
export const SEO_DEFAULT_TWITTER_SITE = "@lionsclubfsbm";
export const SEO_SITE_NAME = "Lions Club FSBM";
const SEO_EXCLUDED_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
  "ref",
] as const;

export function truncateDescription(text: string, maxLength = 160): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd();
}

export function getCanonicalUrl(): string {
  if (typeof window === "undefined" || !window.location) return "";
  const { origin, pathname, search } = window.location;
  if (!origin || !pathname) return `${origin ?? ""}${pathname ?? ""}`;
  if (!search) return `${origin}${pathname}`;
  const params = new URLSearchParams(search);
  for (const key of SEO_EXCLUDED_PARAMS) {
    params.delete(key);
  }
  const remaining = params.toString();
  return remaining ? `${origin}${pathname}?${remaining}` : `${origin}${pathname}`;
}
