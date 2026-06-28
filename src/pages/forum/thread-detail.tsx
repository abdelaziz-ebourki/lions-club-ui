import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ForumReply } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export function ThreadDetailPage() {
  const { threadId, categoryId } = useParams<{ threadId: string; categoryId: string }>();

  const { data: posts, isLoading } = useQuery<ForumReply[]>({
    queryKey: ["forum-thread", categoryId, threadId],
    queryFn: () => api.get(`/forum/${categoryId}/${threadId}`),
    enabled: !!threadId,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to={`/forum/${categoryId}`}>
        <Button variant="ghost" className="mb-8">
          <ArrowLeft data-icon="inline-start" /> Back to Threads
        </Button>
      </Link>

      {isLoading ? (
        <div className="flex flex-col gap-6">
          <Skeleton className="h-8 w-96" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {posts?.map((post) => (
            <article key={post.id} className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-heading font-bold">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <p className="font-heading text-base font-semibold">
                    {post.author}
                  </p>
                  <p className="text-body-sm text-muted-foreground">
                    {post.createdAt}
                  </p>
                </div>
              </div>
              <div className="text-body text-muted-foreground leading-relaxed">
                {post.content}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
