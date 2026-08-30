import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth";
import { searchAll, sanitizeQuery } from "@/lib/search";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SEO } from "@/components/shared/SEO";
import { getSearchSeo } from "@/config/seo";
import { SearchResults } from "@/components/search/search-results";
import { useTranslation } from "react-i18next";

export function SearchPage() {
  const { t } = useTranslation("search");
  const [searchParams] = useSearchParams();
  const { isAdmin } = useAuth();
  const rawQuery = searchParams.get("q") ?? "";
  const parsed = sanitizeQuery(rawQuery);

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["search", parsed.sanitized, isAdmin],
    queryFn: () => searchAll(parsed.sanitized, isAdmin),
    enabled: !parsed.isEmpty,
  });

  if (parsed.isEmpty) {
    return (
      <>
        <SEO {...getSearchSeo("")} />
        <Breadcrumbs trail={[{ label: t("breadcrumbsHome"), href: "/" }, { label: t("breadcrumbsSearch") }]} />
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="font-heading text-h3 text-foreground">{t("title")}</h1>
          <p className="mt-4 font-body text-muted-foreground">
            {t("description")}
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO {...getSearchSeo(parsed.sanitized)} />
      <Breadcrumbs trail={[{ label: t("breadcrumbsHome"), href: "/" }, { label: t("breadcrumbsSearch") }]} />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-heading text-h2 text-foreground mb-8">
          {t("resultsFor", { query: parsed.sanitized })}
        </h1>
        <SearchResults
          groups={data?.groups ?? []}
          totalCount={data?.totalCount ?? 0}
          isSearching={isFetching}
          error={error ? (error as Error).message : null}
          onRetry={() => refetch()}
        />
      </div>
    </>
  );
}
