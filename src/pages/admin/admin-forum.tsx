import { useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { ForumCategory, ForumThread } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pin, Lock, Trash2 } from "lucide-react";

const statusTabs = [
  { value: "all", label: "All" },
  { value: "pinned", label: "Pinned" },
  { value: "locked", label: "Locked" },
  { value: "normal", label: "Normal" },
];

export function AdminForumPage() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const statusFilter = searchParams.get("status") ?? "all";

  const { data: categories } = useQuery<ForumCategory[]>({
    queryKey: ["forum-categories"],
    queryFn: () => api.get("/forum/categories"),
  });

  const { data: threads, isLoading } = useQuery<ForumThread[]>({
    queryKey: ["forum-threads", statusFilter],
    queryFn: () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      return api.get(`/forum/threads?${params.toString()}`);
    },
  });

  function setStatusFilter(status: string) {
    const params = new URLSearchParams(searchParams);
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    setSearchParams(params);
  }

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "pinned" | "locked" | "normal" }) =>
      api.patch(`/forum/threads/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-threads"] });
      toast.success("Thread status updated");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/forum/threads/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-threads"] });
      toast.success("Thread deleted");
    },
    onError: () => toast.error("Failed to delete thread"),
  });

  function getStatusBadge(status: string) {
    switch (status) {
      case "pinned":
        return <Badge variant="outline" className="border-accent text-accent mr-1">Pinned</Badge>;
      case "locked":
        return <Badge variant="secondary">Locked</Badge>;
      case "archived":
        return <Badge variant="secondary">Archived</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "pinned":
        return <Pin className="size-3.5 text-accent" aria-hidden="true" />;
      case "locked":
        return <Lock className="size-3.5 text-muted-foreground" aria-hidden="true" />;
      case "archived":
        return <Lock className="size-3.5 text-muted-foreground" aria-hidden="true" />;
      default:
        return null;
    }
  }

  return (
    <div>
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Forum Moderation</h1>
        <p className="mt-1 text-muted-foreground">Manage forum categories and moderate threads</p>
      </div>

      <div className="mt-8">
        <h2 className="font-heading text-xl font-bold">Categories</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories?.map((cat) => (
            <Badge key={cat.id} variant="secondary" className="text-sm">
              {cat.name} ({cat.threadCount})
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            {statusTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-8 rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thread</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Replies</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-28 ml-auto" /></TableCell>
                  </TableRow>
                ))
              : threads?.map((thread) => (
                  <TableRow key={thread.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(thread.status)}
                        {thread.title}
                      </div>
                    </TableCell>
                    <TableCell>{thread.author}</TableCell>
                    <TableCell>{thread.replyCount}</TableCell>
                    <TableCell>{getStatusBadge(thread.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => statusMutation.mutate({ id: thread.id, status: thread.status === "pinned" ? "normal" : "pinned" })}
                      >
                        <Pin className="size-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => statusMutation.mutate({ id: thread.id, status: thread.status === "locked" ? "normal" : "locked" })}
                      >
                        <Lock className="size-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => deleteMutation.mutate(thread.id)}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}