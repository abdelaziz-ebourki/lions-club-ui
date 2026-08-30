import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ForumThread, ForumCategory } from "@/types";
import type { ForumThreadStatus } from "@/types";
import { useDebounce } from "@/hooks/use-debounce";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/ErrorState";
import { ThreadFilters } from "@/components/shared/ThreadFilters";
import { ThreadListItem } from "@/components/shared/ThreadListItem";
import { ThreadSkeleton } from "@/components/shared/ThreadSkeleton";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SEO } from "@/components/shared/SEO";
import { seoConfig, getCategorySeo } from "@/config/seo";

export function ThreadsPage() {
  const { t } = useTranslation("forum");
  const { categoryId } = useParams<{ categoryId: string }>();
  const [keywordFilter, setKeywordFilter] = useState("");
  const debouncedKeyword = useDebounce(keywordFilter, 300);
  const [statusFilter, setStatusFilter] = useState<ForumThreadStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState("");

  const { data: categories, isError: categoriesError, refetch: refetchCategories } = useQuery<ForumCategory[]>({
    queryKey: ["forum-categories"],
    queryFn: () => api.get("/forum/categories"),
  });

  const { data: threads, isLoading, isError, refetch } = useQuery<ForumThread[]>({
    queryKey: ["forum-threads", categoryId],
    queryFn: () => api.get(`/forum/${categoryId}/threads`),
    enabled: !!categoryId,
  });

  const filteredThreads = useMemo(() => {
    if (!threads) return [];
    let result = threads;

    if (debouncedKeyword.trim()) {
      const lower = debouncedKeyword.toLowerCase();
      result = result.filter(
        (thread) =>
          thread.title.toLowerCase().includes(lower) ||
          thread.content.toLowerCase().includes(lower),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((thread) => thread.status === statusFilter);
    }

    if (categoryFilter && categoryFilter !== "all") {
      result = result.filter((thread) => thread.categoryId === categoryFilter);
    }

    return result;
  }, [threads, debouncedKeyword, statusFilter, categoryFilter]);

  const categoryName = categories?.find((c) => c.id === categoryId)?.name ?? categoryId ?? "Forum";
  const category = categories?.find((c) => c.id === categoryId);
  const threadsSeo = category ? getCategorySeo(category) : categoryId ? { title: `${categoryName} — Lions Club FSBM`, description: seoConfig.forum.description, ogType: "website" as const } : seoConfig.forum;

  const forumTrail = [
    { label: t("breadcrumbsHome"), href: "/" },
    { label: t("breadcrumbsForum"), href: "/forum" },
    { label: categoryName },
  ];

  if (categoriesError) {
    return (
      <>
        <SEO {...seoConfig.forum} />
        <Breadcrumbs trail={forumTrail} />
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="font-heading text-h3 text-destructive">{t("failedToLoadCategories")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t("failedToLoadCategoriesDesc")}
        </p>
        <Button onClick={() => refetchCategories()} className="mt-6">
          {t("tryAgain")}
        </Button>
      </div>
    </>
    );
  }

  return (
    <>
      <SEO {...threadsSeo} />
      <Breadcrumbs trail={forumTrail} />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/forum">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft data-icon="inline-start" /> {t("allCategories")}
        </Button>
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-h2 text-foreground capitalize">
          {t("categoryThreads", { category: categoryName })}
        </h1>
        <Link to={`/forum/${categoryId}/new`}>
          <Button>{t("newThread")}</Button>
        </Link>
      </div>

      <ThreadFilters
        keywordFilter={keywordFilter}
        onKeywordChange={setKeywordFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        categories={categories}
      />

      {isError ? (
        <ErrorState
          heading={t("failedToLoadThreads")}
          message={t("failedToLoadThreadsDesc")}
          onRetry={refetch}
        />
      ) : isLoading ? (
        <ThreadSkeleton />
      ) : (
        <div className="flex flex-col gap-3">
          {filteredThreads.map((thread) => (
            <ThreadListItem key={thread.id} thread={thread} categoryId={categoryId!} />
          ))}
        </div>
      )}

      {threads && threads.length > 0 && filteredThreads.length === 0 && (
        <div className="py-16 text-center">
          <p className="font-body text-muted-foreground">
            {t("noThreadsMatch")}
          </p>
        </div>
      )}

      {threads?.length === 0 && (
        <EmptyState
          icon={MessageCircle}
          title={t("noDiscussions")}
          description={t("noDiscussionsDesc")}
          action={
            <Link to={`/forum/${categoryId}/new`}>
              <Button>{t("startDiscussion")}</Button>
            </Link>
          }
        />
      )}
    </div>
    </>
  );
}
