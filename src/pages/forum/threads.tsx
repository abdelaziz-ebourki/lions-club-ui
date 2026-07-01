import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ForumThread, ForumCategory } from "@/types";
import type { ForumThreadStatus } from "@/types";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, MessageSquare, Search } from "lucide-react";

export function ThreadsPage() {
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
        (t) =>
          t.title.toLowerCase().includes(lower) ||
          t.content.toLowerCase().includes(lower),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (categoryFilter && categoryFilter !== "all") {
      result = result.filter((t) => t.categoryId === categoryFilter);
    }

    return result;
  }, [threads, debouncedKeyword, statusFilter, categoryFilter]);

  const categoryName = categories?.find((c) => c.id === categoryId)?.name ?? categoryId;

  if (categoriesError) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="font-heading text-h3 text-destructive">Failed to load categories</h1>
        <p className="mt-2 text-muted-foreground">
          Something went wrong while loading categories. Please try again.
        </p>
        <Button onClick={() => refetchCategories()} className="mt-6">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/forum">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft data-icon="inline-start" /> All Categories
        </Button>
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-h2 text-foreground capitalize">
          {categoryName} Threads
        </h1>
        <Link to={`/forum/${categoryId}/new`}>
          <Button>New Thread</Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter threads..."
            value={keywordFilter}
            onChange={(e) => setKeywordFilter(e.target.value)}
            className="pl-9"
            aria-label="Filter by keyword"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ForumThreadStatus | "all")}>
          <SelectTrigger className="w-[140px]" aria-label="Filter by status">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pinned">Pinned</SelectItem>
            <SelectItem value="locked">Locked</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v ?? "")}>
          <SelectTrigger className="w-[180px]" aria-label="Filter by category">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isError ? (
        <div className="py-16 text-center">
          <h2 className="font-heading text-h4 text-destructive">Failed to load threads</h2>
          <p className="mt-2 text-muted-foreground">
            Something went wrong while loading threads. Please try again.
          </p>
          <Button onClick={() => refetch()} className="mt-6">
            Try Again
          </Button>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-64" />
                <Skeleton className="mt-2 h-4 w-48" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredThreads.map((thread) => (
            <Link key={thread.id} to={`/forum/${categoryId}/${thread.id}`}>
              <Card className="transition-all hover:shadow-md">
                <CardContent className="flex items-center gap-4 py-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <MessageSquare className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-lg font-medium">
                      {thread.title}
                    </h3>
                    <p className="text-body-sm text-muted-foreground mt-1">
                      Started by {thread.author} &middot; {thread.replyCount} replies
                    </p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-sm text-muted-foreground">
                      {thread.lastActivity}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {threads && threads.length > 0 && filteredThreads.length === 0 && (
        <div className="py-16 text-center">
          <p className="font-body text-muted-foreground">
            No threads match your filters.
          </p>
        </div>
      )}

      {threads?.length === 0 && (
        <div className="py-16 text-center">
          <p className="font-body text-muted-foreground">
            No threads yet. Start the conversation.
          </p>
          <Link to={`/forum/${categoryId}/new`}>
            <Button variant="outline" className="mt-4">
              Create First Thread
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
