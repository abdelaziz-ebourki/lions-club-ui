import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/auth";
import type { ForumThread, ForumReply, ForumThreadStatus, ForumCategory } from "@/types";
import { ThreadHeader } from "@/components/forum/thread-header";
import { ReplyList } from "@/components/forum/reply-list";
import { ReplyForm } from "@/components/forum/reply-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

function ThreadDetailLoading() {
  return (
    <>
      <Breadcrumbs trail={[
        { label: "Home", href: "/" },
        { label: "Forum", href: "/forum" },
        { label: "Loading..." },
      ]} />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-96" />
        <Skeleton className="mt-4 h-4 w-64" />
        <Skeleton className="mt-8 h-32 w-full" />
        <Skeleton className="mt-4 h-32 w-full" />
      </div>
    </>
  );
}

function ThreadDetailError({ trail, onRetry }: { trail: { label: string; href?: string }[]; onRetry: () => void }) {
  return (
    <>
      <Breadcrumbs trail={trail} />
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="font-heading text-h3 text-destructive">Failed to load thread</h1>
        <p className="mt-2 text-muted-foreground">
          Something went wrong while loading this thread. Please try again.
        </p>
        <Button onClick={onRetry} className="mt-6">
          Try Again
        </Button>
      </div>
    </>
  );
}

function ThreadDetailNotFound({ trail, categoryId }: { trail: { label: string; href?: string }[]; categoryId: string }) {
  return (
    <>
      <Breadcrumbs trail={trail} />
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="font-heading text-h3">Thread not found</h1>
        <Link to={`/forum/${categoryId}`} className="mt-4 inline-block">
          <Button>Back to Threads</Button>
        </Link>
      </div>
    </>
  );
}

export function ThreadDetailPage() {
  const { categoryId, threadId } = useParams<{ categoryId: string; threadId: string }>();
  const { isAuthenticated, isAdmin } = useAuth();

  const { data: categories } = useQuery<ForumCategory[]>({
    queryKey: ["forum-categories"],
    queryFn: () => api.get("/forum/categories"),
  });
  const queryClient = useQueryClient();
  const [replyMeta, setReplyMeta] = useState<{ parentReplyId?: string; quotedAuthor?: string }>({});

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["forum-thread-detail", categoryId, threadId],
    queryFn: async () => {
      const [thread, replies] = await Promise.all([
        api.get<ForumThread>(`/forum/${categoryId}/${threadId}`),
        api.get<ForumReply[]>(`/forum/replies?threadId=${threadId}`),
      ]);
      return { thread, replies };
    },
    enabled: !!categoryId && !!threadId,
  });

  const categoryName = categories?.find((c) => c.id === categoryId)?.name ?? categoryId ?? "Forum";
  const threadTitle = data?.thread?.title;

  const replyMutation = useMutation({
    mutationFn: (body: { content: string; parentReplyId?: string }) =>
      api.post("/forum/replies", { ...body, threadId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-thread-detail", categoryId, threadId] });
      setReplyMeta({});
    },
  });

  const statusMutation = useMutation({
    mutationFn: (newStatus: ForumThreadStatus) =>
      api.patch(`/forum/threads/${threadId}`, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-thread-detail", categoryId, threadId] });
    },
  });

  const handleReply = (parentReplyId: string, quotedAuthor: string) => {
    setReplyMeta({ parentReplyId, quotedAuthor });
  };

  const handleSubmitReply = async (body: { content: string; parentReplyId?: string }) => {
    await replyMutation.mutateAsync(body);
  };

  const trail = [
    { label: "Home", href: "/" },
    { label: "Forum", href: "/forum" },
    { label: categoryName, href: `/forum/${categoryId}` },
    { label: threadTitle ?? "Loading..." },
  ];

  if (isLoading) return <ThreadDetailLoading />;
  if (isError) return <ThreadDetailError trail={trail} onRetry={() => refetch()} />;
  if (!data?.thread) return <ThreadDetailNotFound trail={trail} categoryId={categoryId!} />;

  return (
    <>
      <Breadcrumbs trail={trail} />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link to={`/forum/${categoryId}`}>
          <Button variant="ghost" className="mb-8">
            <ArrowLeft data-icon="inline-start" /> Back to Threads
          </Button>
        </Link>

        <ThreadHeader
          thread={data.thread}
          isAdmin={isAdmin}
          onStatusChange={(status) => statusMutation.mutate(status)}
          isStatusLoading={statusMutation.isPending}
        />

        {data.replies.length === 0 ? (
          <EmptyState
            icon={MessageCircle}
            title="No replies yet"
            description="Be the first to reply to this discussion."
          />
        ) : (
          <ReplyList
            replies={data.replies}
            isAuthenticated={isAuthenticated}
            onReply={handleReply}
          />
        )}

        {isAuthenticated && (
          <div className="mt-8">
            <ReplyForm
              onSubmit={handleSubmitReply}
              parentReplyId={replyMeta.parentReplyId}
              quotedAuthor={replyMeta.quotedAuthor}
            />
          </div>
        )}
      </div>
    </>
  );
}
