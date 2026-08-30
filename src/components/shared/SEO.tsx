import { Helmet } from "react-helmet-async";
import { getCanonicalUrl, SEO_DEFAULT_IMAGE, SEO_DEFAULT_TWITTER_SITE, SEO_SITE_NAME } from "@/lib/seo";
import type { SEOMetadata } from "@/types";

export type SEOProps = SEOMetadata;

export function SEO({ title, description, image, ogType, canonical, noindex, twitterSite }: SEOProps) {
  const resolvedCanonical = canonical ?? getCanonicalUrl();
  const resolvedImage = image ?? SEO_DEFAULT_IMAGE;
  const resolvedTwitterSite = twitterSite ?? SEO_DEFAULT_TWITTER_SITE;
  const resolvedOgUrl = resolvedCanonical;
  const baseUrl = resolvedCanonical ? resolvedCanonical.split("?")[0] : undefined;

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      {resolvedCanonical && <link rel="canonical" href={resolvedCanonical} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={resolvedImage} />
      {resolvedOgUrl && <meta property="og:url" content={resolvedOgUrl} />}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SEO_SITE_NAME} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={resolvedImage} />
      <meta name="twitter:site" content={resolvedTwitterSite} />
      {noindex && <meta name="robots" content="noindex" />}
      {baseUrl && <link rel="alternate" hrefLang="en" href={baseUrl} />}
      {baseUrl && <link rel="alternate" hrefLang="fr" href={baseUrl} />}
      {baseUrl && <link rel="alternate" hrefLang="ar" href={baseUrl} />}
      {baseUrl && <link rel="alternate" hrefLang="x-default" href={baseUrl} />}
    </Helmet>
  );
}
