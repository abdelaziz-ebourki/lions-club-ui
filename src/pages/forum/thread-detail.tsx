import { useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/auth";
import { useTranslation } from "react-i18next";
import type { ForumThread, ForumReply, ForumThreadStatus, ForumCategory } from "@/types";
import { ThreadHeader } from "@/components/forum/thread-header";
import { ReplyList } from "@/components/forum/reply-list";
import { ReplyForm } from "@/components/forum/reply-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SEO } from "@/components/shared/SEO";
import { seoConfig, getThreadSeo } from "@/config/seo";

function ThreadDetailLoading() {
  const { t } = useTranslation("forum");
  return (
    <>
      <SEO {...seoConfig.forum} />
      <Breadcrumbs trail={[
        { label: t("breadcrumbsHome"), href: "/" },
        { label: t("breadcrumbsForum"), href: "/forum" },
        { label: t("loading") },
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
  const { t } = useTranslation("forum");
  return (
    <>
      <SEO {...seoConfig.forum} />
      <Breadcrumbs trail={trail} />
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="font-heading text-h3 text-destructive">{t("failedToLoadThread")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t("failedToLoadThreadDesc")}
        </p>
        <Button onClick={onRetry} className="mt-6">
          {t("tryAgain")}
        </Button>
      </div>
    </>
  );
}

function ThreadDetailNotFound({ trail, categoryId }: { trail: { label: string; href?: string }[]; categoryId: string }) {
  const { t } = useTranslation("forum");
  return (
    <>
      <SEO {...seoConfig.forum} />
      <Breadcrumbs trail={trail} />
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="font-heading text-h3">{t("threadNotFound")}</h1>
        <Link to={`/forum/${categoryId}`} className="mt-4 inline-block">
          <Button>{t("backToThreadsBtn")}</Button>
        </Link>
      </div>
    </>
  );
}

function ThreadDetailContent({
  data,
  trail,
  categoryId,
  isAdmin,
  isAuthenticated,
  statusMutation,
  replyMeta,
  handleReply,
  handleSubmitReply,
}: {
  data: NonNullable<ReturnType<typeof useThreadDetailQuery>["data"]>;
  trail: { label: string; href?: string }[];
  categoryId: string;
  isAdmin: boolean;
  isAuthenticated: boolean;
  statusMutation: ReturnType<typeof useMutation<unknown, unknown, ForumThreadStatus>>;
  replyMeta: { parentReplyId?: string; quotedAuthor?: string };
  handleReply: (parentReplyId: string, quotedAuthor: string) => void;
  handleSubmitReply: (body: { content: string; parentReplyId?: string }) => Promise<void>;
}) {
  const { t } = useTranslation("forum");
  return (
    <>
      <SEO {...getThreadSeo(data.thread)} />
      <Breadcrumbs trail={trail} />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link to={`/forum/${categoryId}`}>
          <Button variant="ghost" className="mb-8">
            <ArrowLeft data-icon="inline-start" /> {t("backToThreads")}
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
            title={t("noReplies")}
            description={t("beFirst")}
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

function useThreadDetailQuery(categoryId?: string, threadId?: string) {
  return useQuery({
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
}

export function ThreadDetailPage() {
  const { t } = useTranslation("forum");
  const { categoryId, threadId } = useParams<{ categoryId: string; threadId: string }>();
  const { isAuthenticated, isAdmin } = useAuth();

  const { data: categories } = useQuery<ForumCategory[]>({
    queryKey: ["forum-categories"],
    queryFn: () => api.get("/forum/categories"),
  });
  const queryClient = useQueryClient();
  const [replyMeta, setReplyMeta] = useState<{ parentReplyId?: string; quotedAuthor?: string }>({});

  const { data, isLoading, isError, refetch } = useThreadDetailQuery(categoryId, threadId);

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

  const handleReply = useCallback((parentReplyId: string, quotedAuthor: string) => {
    setReplyMeta({ parentReplyId, quotedAuthor });
  }, []);

  const handleSubmitReply = async (body: { content: string; parentReplyId?: string }) => {
    await replyMutation.mutateAsync(body);
  };

  const loadingLabel = t("loading");
  const trail = [
    { label: t("breadcrumbsHome"), href: "/" },
    { label: t("breadcrumbsForum"), href: "/forum" },
    { label: categoryName, href: `/forum/${categoryId}` },
    { label: threadTitle ?? loadingLabel },
  ];

  if (isLoading) return <ThreadDetailLoading />;
  if (isError) return <ThreadDetailError trail={trail} onRetry={() => refetch()} />;
  if (!data?.thread) return <ThreadDetailNotFound trail={trail} categoryId={categoryId!} />;

  return (
    <ThreadDetailContent
      data={data}
      trail={trail}
      categoryId={categoryId!}
      isAdmin={isAdmin}
      isAuthenticated={isAuthenticated}
      statusMutation={statusMutation}
      replyMeta={replyMeta}
      handleReply={handleReply}
      handleSubmitReply={handleSubmitReply}
    />
  );
}
