import { render } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { describe, test, expect, beforeEach } from "vitest";
import { SEO } from "../SEO";

function renderSEO(props: Parameters<typeof SEO>[0]) {
  return render(
    <HelmetProvider>
      <SEO {...props} />
    </HelmetProvider>
  );
}

describe("SEO", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    document.title = "";
  });

  test("sets document title", () => {
    renderSEO({
      title: "About Us — Lions Club FSBM",
      description: "Learn about Lions Club FSBM",
      ogType: "website",
    });
    expect(document.title).toBe("About Us — Lions Club FSBM");
  });

  test("sets meta description", () => {
    renderSEO({
      title: "Test",
      description: "Test description",
      ogType: "website",
    });
    const meta = document.head.querySelector('meta[name="description"]');
    expect(meta).toHaveAttribute("content", "Test description");
  });

  test("sets canonical link (provided)", () => {
    renderSEO({
      title: "Test",
      description: "desc",
      ogType: "website",
      canonical: "https://example.com/about",
    });
    const link = document.head.querySelector('link[rel="canonical"]');
    expect(link).toHaveAttribute("href", "https://example.com/about");
  });

  test("canonical falls back to window location when not provided", () => {
    Object.defineProperty(window, "location", {
      value: new URL("https://example.com/contact"),
      writable: true,
    });
    renderSEO({
      title: "Test",
      description: "desc",
      ogType: "website",
    });
    const link = document.head.querySelector('link[rel="canonical"]');
    expect(link).toHaveAttribute("href", "https://example.com/contact");
  });

  test("sets og tags mirroring title/description and defaults", () => {
    renderSEO({
      title: "My Title",
      description: "My Description",
      ogType: "website",
    });
    expect(document.head.querySelector('meta[property="og:title"]')).toHaveAttribute("content", "My Title");
    expect(document.head.querySelector('meta[property="og:description"]')).toHaveAttribute("content", "My Description");
    expect(document.head.querySelector('meta[property="og:type"]')).toHaveAttribute("content", "website");
    expect(document.head.querySelector('meta[property="og:site_name"]')).toHaveAttribute("content", "Lions Club FSBM");
    expect(document.head.querySelector('meta[property="og:image"]')).toHaveAttribute("content", "/logo.png");
    expect(document.head.querySelector('meta[property="og:url"]')).toHaveAttribute("content", expect.any(String));
  });

  test("uses provided image for og:image and twitter:image", () => {
    renderSEO({
      title: "T",
      description: "D",
      ogType: "article",
      image: "https://example.com/img.jpg",
    });
    expect(document.head.querySelector('meta[property="og:image"]')).toHaveAttribute("content", "https://example.com/img.jpg");
    expect(document.head.querySelector('meta[name="twitter:image"]')).toHaveAttribute("content", "https://example.com/img.jpg");
  });

  test("sets twitter tags", () => {
    renderSEO({
      title: "T",
      description: "D",
      ogType: "website",
    });
    expect(document.head.querySelector('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    expect(document.head.querySelector('meta[name="twitter:title"]')).toHaveAttribute("content", "T");
    expect(document.head.querySelector('meta[name="twitter:description"]')).toHaveAttribute("content", "D");
    expect(document.head.querySelector('meta[name="twitter:site"]')).toHaveAttribute("content", "@lionsclubfsbm");
  });

  test("uses custom twitterSite when provided", () => {
    renderSEO({
      title: "T",
      description: "D",
      ogType: "website",
      twitterSite: "@custom",
    });
    expect(document.head.querySelector('meta[name="twitter:site"]')).toHaveAttribute("content", "@custom");
  });

  test("renders noindex when true", () => {
    renderSEO({
      title: "Admin — Lions Club FSBM",
      description: "Admin",
      ogType: "website",
      noindex: true,
    });
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex");
  });

  test("does not render robots when noindex false", () => {
    renderSEO({
      title: "Home",
      description: "desc",
      ogType: "website",
    });
    expect(document.head.querySelector('meta[name="robots"]')).not.toBeInTheDocument();
  });

  test("sets og:type article for detail pages", () => {
    renderSEO({
      title: "Event — Lions Club FSBM",
      description: "desc",
      ogType: "article",
    });
    expect(document.head.querySelector('meta[property="og:type"]')).toHaveAttribute("content", "article");
  });

  test("og:url mirrors canonical", () => {
    renderSEO({
      title: "T",
      description: "D",
      ogType: "website",
      canonical: "https://example.com/events",
    });
    expect(document.head.querySelector('meta[property="og:url"]')).toHaveAttribute("content", "https://example.com/events");
  });
});
