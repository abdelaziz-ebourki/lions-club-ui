import { useState } from "react";
import { Link } from "react-router-dom";
import { useNewsList } from "@/hooks/useNewsList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NewsSkeleton } from "@/components/shared/NewsSkeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHero } from "@/components/shared/PageHero";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SEO } from "@/components/shared/SEO";
import { seoConfig } from "@/config/seo";
import { ArrowRight, Newspaper } from "lucide-react";

export function NewsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useNewsList(page);

  if (isLoading) {
    return (
      <>
        <SEO {...seoConfig.news} />
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "News" }]} />
        <PageHero overline="Updates" heading="Latest News" description="Stay informed with club announcements, event recaps, and press releases" />
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <NewsSkeleton />
        </section>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <SEO {...seoConfig.news} />
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "News" }]} />
        <PageHero overline="Updates" heading="Latest News" description="Stay informed with club announcements, event recaps, and press releases" />
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <ErrorState heading="Something went wrong" message="Failed to load news articles." onRetry={() => refetch()} />
        </section>
      </>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <>
        <SEO {...seoConfig.news} />
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "News" }]} />
        <PageHero overline="Updates" heading="Latest News" description="Stay informed with club announcements, event recaps, and press releases" />
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <EmptyState
            icon={Newspaper}
            title="No news articles yet"
            description="Check back soon for club updates and announcements."
          />
        </section>
      </>
    );
  }

  return (
    <>
      <SEO {...seoConfig.news} />
      <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "News" }]} />
      <PageHero overline="Updates" heading="Latest News" description="Stay informed with club announcements, event recaps, and press releases" />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((article) => (
            <Card key={article.id} className="group transition-all hover:shadow-lg">
              {article.featuredImage && (
                <div className="overflow-hidden rounded-t-lg">
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                    width={800}
                    height={400}
                  />
                </div>
              )}
              <CardHeader>
                <Badge variant="accent" className="w-fit">{article.category}</Badge>
                <Link to={`/news/${article.slug}`}>
                  <CardTitle className="mt-3 font-heading text-xl group-hover:text-primary transition-colors line-clamp-2 hover:underline">
                    {article.title}
                  </CardTitle>
                </Link>
                <CardDescription className="text-body-sm line-clamp-2">
                  {article.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-body-sm text-muted-foreground">
                  <span>{article.authorName}</span>
                  <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ""}</span>
                </div>
                <Link
                  to={`/news/${article.slug}`}
                  className="mt-4 inline-flex items-center text-sm font-medium text-accent hover:underline"
                >
                  Read Article <ArrowRight className="ml-1 size-3" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {data.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <span className="text-body-sm text-muted-foreground">
              Page {data.page} of {data.totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={page >= data.totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </section>
    </>
  );
}
