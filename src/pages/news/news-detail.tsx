import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { NewsArticle } from "@/types";
import { SEO } from "@/components/shared/SEO";
import { seoConfig, getNewsSeo } from "@/config/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ErrorState } from "@/components/shared/ErrorState";
import { ArrowLeft, Clock, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/lib/format";

export function NewsDetailPage() {
  const { t, i18n } = useTranslation(["news", "common"]);
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading, isError, error, refetch } = useQuery<NewsArticle>({
    queryKey: ["news", slug],
    queryFn: () => api.get(`/news/${slug}`),
    enabled: !!slug,
    retry: false,
  });

  if (isLoading) {
    return (
      <>
        <SEO {...seoConfig.news} />
        <Breadcrumbs trail={[{ label: t("breadcrumbs.home"), href: "/" }, { label: t("nav.news"), href: "/news" }, { label: t("news:loading") }]} />
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-4 h-4 w-96" />
          <Skeleton className="mt-8 h-48 w-full" />
        </div>
      </>
    );
  }

  const isNotFound = error && typeof error === "object" && "status" in error && (error as { status: number }).status === 404;

  if (isNotFound) {
    return (
      <>
        <SEO {...seoConfig.news} />
        <Breadcrumbs trail={[{ label: t("breadcrumbs.home"), href: "/" }, { label: t("nav.news"), href: "/news" }, { label: t("news:notFoundBreadcrumb") }]} />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="font-heading text-h3">{t("news:notFound")}</h1>
          <p className="mt-2 text-muted-foreground">{t("news:notFoundDesc")}</p>
          <Link to="/news" className="mt-6 inline-block">
            <Button>{t("news:backToNews")}</Button>
          </Link>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <SEO {...seoConfig.news} />
        <Breadcrumbs trail={[{ label: t("breadcrumbs.home"), href: "/" }, { label: t("nav.news"), href: "/news" }, { label: t("news:errorBreadcrumb") }]} />
        <ErrorState
          heading={t("news:failedToLoad")}
          message={t("news:checkConnection")}
          onRetry={refetch}
          retryLabel={t("news:tryAgain")}
        />
      </>
    );
  }

  if (!article) {
    return (
      <>
        <SEO {...seoConfig.news} />
        <Breadcrumbs trail={[{ label: t("breadcrumbs.home"), href: "/" }, { label: t("nav.news"), href: "/news" }, { label: t("news:notFoundBreadcrumb") }]} />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="font-heading text-h3">{t("news:notFound")}</h1>
          <p className="mt-2 text-muted-foreground">{t("news:notFoundDesc")}</p>
          <Link to="/news" className="mt-6 inline-block">
            <Button>{t("news:backToNews")}</Button>
          </Link>
        </div>
      </>
    );
  }

  const publishedDate = article.publishedAt
    ? formatDate(article.publishedAt, i18n.language)
    : "";

  return (
    <>
      <SEO {...getNewsSeo(article)} />

      <Breadcrumbs trail={[
        { label: t("breadcrumbs.home"), href: "/" },
        { label: t("nav.news"), href: "/news" },
        { label: article.title },
      ]} />

      <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <Link to="/news">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft data-icon="inline-start" /> {t("news:allNews")}
          </Button>
        </Link>

        <Badge variant="accent" className="mb-4">{article.category}</Badge>

        {article.featuredImage && (
          <div className="mb-8 overflow-hidden rounded-lg">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full object-cover"
              style={{ maxHeight: 400 }}
              loading="lazy"
              width={800}
              height={400}
            />
          </div>
        )}

        <h1 className="font-heading text-h1 text-foreground">
          {article.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-body-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <User className="size-3.5" aria-hidden="true" />
            {article.authorName || t("news:unknownAuthor")}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden="true" />
            {publishedDate}
          </span>
        </div>

        <Separator className="my-8" />

        <div
          className="prose prose-lg max-w-none text-muted-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </>
  );
}
