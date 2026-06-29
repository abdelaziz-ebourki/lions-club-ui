import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ForumThread, ForumCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MessageSquare } from "lucide-react";

export function ThreadsPage() {
  const { categoryId } = useParams<{ categoryId: string }>();

  const { data: categories, isError: categoriesError, refetch: refetchCategories } = useQuery<ForumCategory[]>({
    queryKey: ["forum-categories"],
    queryFn: () => api.get("/forum/categories"),
  });

  const { data: threads, isLoading, isError, refetch } = useQuery<ForumThread[]>({
    queryKey: ["forum-threads", categoryId],
    queryFn: () => api.get(`/forum/${categoryId}/threads`),
    enabled: !!categoryId,
  });

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
          {threads?.map((thread) => (
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
