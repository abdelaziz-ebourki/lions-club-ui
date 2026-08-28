import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { NewsArticle } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TableCell, TableRow, TableHead } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Newspaper, Pencil, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/ErrorState";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { AdminPageHeader } from "@/components/shared/AdminPageHeader";
import { AdminTable } from "@/components/shared/AdminTable";

const statusVariant = {
  draft: "secondary" as const,
  published: "default" as const,
  archived: "outline" as const,
};

export function AdminNewsPage() {
  const queryClient = useQueryClient();

  const { data: articles, isLoading, isError, refetch } = useQuery<NewsArticle[]>({
    queryKey: ["news", "admin"],
    queryFn: () => api.get("/news/admin"),
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/news/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toast.success("Article deleted successfully.");
    },
    onError: () => toast.error("Failed to delete article."),
  });

  const headers = (
    <>
      <TableHead className="font-display text-overline text-xs">Title</TableHead>
      <TableHead className="font-display text-overline text-xs">Category</TableHead>
      <TableHead className="font-display text-overline text-xs">Status</TableHead>
      <TableHead className="font-display text-overline text-xs">Author</TableHead>
      <TableHead className="font-display text-overline text-xs">Published</TableHead>
      <TableHead className="font-display text-overline text-xs text-right">Actions</TableHead>
    </>
  );

  if (isLoading) {
    return (
      <div>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "News" }]} />
        <AdminPageHeader overline="News" heading="Manage News" />
        <AdminTable headers={headers} caption="News table" loading skeletonColumns={6} />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "News" }]} />
        <AdminPageHeader overline="News" heading="Manage News" action={{ to: "/admin/news/new", label: "New Article" }} />
        <ErrorState
          heading="Failed to load articles"
          message="Please check your connection and try again."
          onRetry={refetch}
          retryLabel="Try Again"
        />
      </div>
    );
  }

  if (articles?.length === 0) {
    return (
      <div>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "News" }]} />
        <AdminPageHeader overline="News" heading="Manage News" action={{ to: "/admin/news/new", label: "New Article" }} />
        <EmptyState
          icon={Newspaper}
          title="No articles yet"
          description="Create your first news article."
          action={
            <Link to="/admin/news/new">
              <Button>Create your first article</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "News" }]} />
      <AdminPageHeader overline="News" heading="Manage News" action={{ to: "/admin/news/new", label: "New Article" }} />
      <AdminTable
        headers={headers} caption="News table"
        mobileView={articles?.map((article) => (
          <Card key={article.id} className="mb-3">
            <CardContent className="py-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-body font-medium line-clamp-1">{article.title}</p>
                  <p className="text-sm text-muted-foreground">{article.authorName}</p>
                  <p className="text-xs text-muted-foreground">
                    {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "—"}
                  </p>
                  <Badge variant="accent" className="text-[10px]">{article.category}</Badge>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={statusVariant[article.status]} className="capitalize">
                    {article.status}
                  </Badge>
                  <Link to={`/admin/news/${article.id}/edit`}>
                    <Button variant="ghost" size="icon" className="size-8">
                      <Pencil className="size-4" />
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" aria-label="Delete article">
                          <Trash2 className="size-4" />
                        </Button>
                      }
                    />
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Article</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{article.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate(article.id)} disabled={deleteMutation.isPending}>
                          {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      >
        {articles?.map((article) => (
          <TableRow key={article.id}>
            <TableCell className="font-body font-medium max-w-[200px] truncate">{article.title}</TableCell>
            <TableCell>
              <Badge variant="accent" className="text-[10px]">{article.category}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={statusVariant[article.status]} className="capitalize">
                {article.status}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">{article.authorName}</TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "—"}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Link to={`/admin/news/${article.id}/edit`}>
                  <Button variant="ghost" size="icon" className="size-8">
                    <Pencil className="size-4" />
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" aria-label="Delete article">
                        <Trash2 className="size-4" />
                      </Button>
                    }
                  />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Article</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{article.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMutation.mutate(article.id)} disabled={deleteMutation.isPending}>
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </AdminTable>
    </div>
  );
}
