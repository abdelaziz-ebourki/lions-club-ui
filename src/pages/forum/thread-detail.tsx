import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { ForumThread, ForumReply } from "@/types";
import { useAuth } from "@/contexts/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Lock, Pin, Calendar, Send } from "lucide-react";

export function ThreadDetailPage() {
  const { categoryId, threadId } = useParams<{ categoryId: string; threadId: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [replyContent, setReplyContent] = useState("");

  const { data: thread, isLoading: threadLoading } = useQuery<ForumThread>({
    queryKey: ["forum-thread", threadId],
    queryFn: () => api.get(`/forum/threads/${threadId}`),
    enabled: !!threadId,
  });

  const { data: replies, isLoading: repliesLoading } = useQuery<ForumReply[]>({
    queryKey: ["forum-replies", threadId],
    queryFn: () => api.get(`/forum/replies?threadId=${threadId}`),
    enabled: !!threadId,
  });

  const replyMutation = useMutation({
    mutationFn: (content: string) =>
      api.post("/forum/replies", {
        threadId,
        author: user?.name ?? "Anonymous",
        content,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-replies", threadId] });
      queryClient.invalidateQueries({ queryKey: ["forum-thread", threadId] });
      setReplyContent("");
      toast.success("Reply posted");
    },
    onError: () => toast.error("Failed to post reply"),
  });

  if (threadLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-4 h-4 w-96" />
        <Skeleton className="mt-8 h-32 w-full" />
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="font-heading text-2xl font-bold">Thread not found</h1>
        <Link to={`/forum/${categoryId}`} className="mt-4 inline-block">
          <Button>Back to Threads</Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link to={`/forum/${categoryId}`}>
        <Button variant="ghost" className="mb-6">
          <ArrowLeft data-icon="inline-start" /> Back to Threads
        </Button>
      </Link>

      <div className="flex items-center gap-2">
        {thread.status === "pinned" && (
          <Badge variant="outline" className="border-accent text-accent">
            <Pin className="mr-1 size-3" /> Pinned
          </Badge>
        )}
        {thread.status === "locked" && (
          <Badge variant="secondary">
            <Lock className="mr-1 size-3" /> Locked
          </Badge>
        )}
      </div>

      <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight">{thread.title}</h1>

      <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
        <span>Posted by {thread.author}</span>
        <span className="flex items-center gap-1">
          <Calendar className="size-3.5" aria-hidden="true" />
          {new Date(thread.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="mt-6 rounded-lg border bg-muted/20 p-6">
        <p className="leading-relaxed text-muted-foreground">{thread.content}</p>
      </div>

      <Separator className="my-10" />

      <h2 className="font-heading text-xl font-bold">Replies ({replies?.length ?? 0})</h2>

      {repliesLoading ? (
        <div className="mt-6 flex flex-col gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {replies?.map((reply) => (
            <div key={reply.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{reply.author}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(reply.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{reply.content}</p>
            </div>
          ))}
          {replies?.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">No replies yet. Be the first to respond!</p>
          )}
        </div>
      )}

      {thread.status === "locked" ? (
        <div className="mt-6 rounded-lg bg-muted p-4 text-center text-sm text-muted-foreground">
          This thread is locked. New replies cannot be added.
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          <Textarea
            placeholder={user ? "Write a reply..." : "Sign in to reply"}
            rows={3}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            disabled={!user}
          />
          <Button
            onClick={() => replyMutation.mutate(replyContent)}
            disabled={!user || !replyContent.trim() || replyMutation.isPending}
          >
            {replyMutation.isPending ? "Posting..." : (
              <>Post Reply <Send data-icon="inline-end" /></>
            )}
          </Button>
        </div>
      )}
    </article>
  );
}
