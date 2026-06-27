import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ForumThread, ForumCategory } from "@/types";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, MessageSquare, Eye, Pin, Lock, ChevronRight, Plus } from "lucide-react";
import { NewThreadForm } from "./new-thread-form";

export function ThreadListPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: categories } = useQuery<ForumCategory[]>({
    queryKey: ["forum-categories"],
    queryFn: () => api.get("/forum/categories"),
  });

  const { data: threads, isLoading } = useQuery<ForumThread[]>({
    queryKey: ["forum-threads", categoryId],
    queryFn: () => api.get(`/forum/threads?categoryId=${categoryId}`),
    enabled: !!categoryId,
  });

  const category = categories?.find((c) => c.id === categoryId);

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <Link to="/forum">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft data-icon="inline-start" /> All Categories
          </Button>
        </Link>
        <Button size="sm" disabled={!user} onClick={() => setOpen(true)}>
          <Plus data-icon="inline-start" /> New Thread
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Thread</DialogTitle>
            </DialogHeader>
            <NewThreadForm
              categoryId={categoryId!}
              author={user?.name ?? "Anonymous"}
              onSuccess={() => {
                setOpen(false);
                queryClient.invalidateQueries({ queryKey: ["forum-threads", categoryId] });
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <h1 className="font-heading text-3xl font-bold tracking-tight">{category?.name ?? "Threads"}</h1>
      {category && <p className="mt-1 text-muted-foreground">{category.description}</p>}

      {isLoading ? (
        <div className="mt-8 flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-2">
          {threads?.map((thread) => (
            <Link
              key={thread.id}
              to={`/forum/${categoryId}/${thread.id}`}
              className="flex items-center gap-4 rounded-lg border p-4 transition-all hover:border-accent/50 hover:shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {thread.status === "pinned" && <Pin className="size-4 shrink-0 text-accent" />}
                  {thread.status === "locked" && <Lock className="size-4 shrink-0 text-muted-foreground" />}
                  <h3 className="font-medium truncate">{thread.title}</h3>
                </div>
                <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>by {thread.author}</span>
                  <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MessageSquare className="size-3.5" />
                  {thread.replyCount}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="size-3.5" />
                  {thread.viewCount}
                </span>
              </div>
              <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
