import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth";
import { searchAll, sanitizeQuery } from "@/lib/search";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SearchResults } from "@/components/search/search-results";

export function SearchPage() {
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
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Search" }]} />
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="font-heading text-h3 text-foreground">Search</h1>
          <p className="mt-4 font-body text-muted-foreground">
            Type a query in the search bar above to find events, forum threads, members, and more.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-heading text-h2 text-foreground mb-8">
          Results for "{parsed.sanitized}"
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
