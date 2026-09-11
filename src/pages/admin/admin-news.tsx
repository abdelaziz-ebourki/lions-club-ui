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
import { useTranslation } from "react-i18next";
import { formatDate } from "@/lib/format";
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
  const { t, i18n } = useTranslation("admin");
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
      toast.success(t("news.toast.deleted"));
    },
    onError: () => toast.error(t("news.toast.deleteFailed")),
  });

  const headers = (
    <>
      <TableHead className="font-display text-overline text-xs">{t("news.headers.title")}</TableHead>
      <TableHead className="font-display text-overline text-xs">{t("news.headers.category")}</TableHead>
      <TableHead className="font-display text-overline text-xs">{t("news.headers.status")}</TableHead>
      <TableHead className="font-display text-overline text-xs">{t("news.headers.author")}</TableHead>
      <TableHead className="font-display text-overline text-xs">{t("news.headers.published")}</TableHead>
      <TableHead className="font-display text-overline text-xs text-right">{t("news.headers.actions")}</TableHead>
    </>
  );

  if (isLoading) {
    return (
      <div>
        <Breadcrumbs trail={[{ label: t("news.breadcrumbs.home"), href: "/" }, { label: t("news.breadcrumbs.admin"), href: "/admin" }, { label: t("news.breadcrumbs.news") }]} />
        <AdminPageHeader overline={t("news.overline")} heading={t("news.heading")} />
        <AdminTable headers={headers} caption={t("news.caption")} loading skeletonColumns={6} />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <Breadcrumbs trail={[{ label: t("news.breadcrumbs.home"), href: "/" }, { label: t("news.breadcrumbs.admin"), href: "/admin" }, { label: t("news.breadcrumbs.news") }]} />
        <AdminPageHeader overline={t("news.overline")} heading={t("news.heading")} action={{ to: "/admin/news/new", label: t("news.newArticle") }} />
        <ErrorState
          heading={t("news.error.heading")}
          message={t("news.error.message")}
          onRetry={refetch}
          retryLabel={t("news.error.retry")}
        />
      </div>
    );
  }

  if (articles?.length === 0) {
    return (
      <div>
        <Breadcrumbs trail={[{ label: t("news.breadcrumbs.home"), href: "/" }, { label: t("news.breadcrumbs.admin"), href: "/admin" }, { label: t("news.breadcrumbs.news") }]} />
        <AdminPageHeader overline={t("news.overline")} heading={t("news.heading")} action={{ to: "/admin/news/new", label: t("news.newArticle") }} />
        <EmptyState
          icon={Newspaper}
          title={t("news.empty.title")}
          description={t("news.empty.description")}
          action={
            <Link to="/admin/news/new">
              <Button>{t("news.empty.action")}</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs trail={[{ label: t("news.breadcrumbs.home"), href: "/" }, { label: t("news.breadcrumbs.admin"), href: "/admin" }, { label: t("news.breadcrumbs.news") }]} />
      <AdminPageHeader overline={t("news.overline")} heading={t("news.heading")} action={{ to: "/admin/news/new", label: t("news.newArticle") }} />
      <AdminTable
        headers={headers} caption={t("news.caption")}
        mobileView={articles?.map((article) => (
          <Card key={article.id} className="mb-3">
            <CardContent className="py-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-body font-medium line-clamp-1">{article.title}</p>
                  <p className="text-sm text-muted-foreground">{article.authorName}</p>
                  <p className="text-xs text-muted-foreground">
                    {article.publishedAt ? formatDate(article.publishedAt, i18n.language) : "—"}
                  </p>
                  <Badge variant="accent" className="text-[10px]">{article.category}</Badge>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={statusVariant[article.status]} className="capitalize">
                    {article.status}
                  </Badge>
                  <Link to={`/admin/news/${article.id}/edit`}>
                    <Button variant="ghost" size="icon" className="size-8" aria-label={t("news.aria.editArticle", { title: article.title })}>
                      <Pencil className="size-4" />
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" aria-label={t("news.aria.deleteArticle", { title: article.title })}>
                          <Trash2 className="size-4" />
                        </Button>
                      }
                    />
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t("news.delete.title")}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("news.delete.description", { title: article.title })}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("news.delete.cancel")}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate(article.id)} disabled={deleteMutation.isPending}>
                          {deleteMutation.isPending ? t("news.delete.deleting") : t("news.delete.delete")}
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
              {article.publishedAt ? formatDate(article.publishedAt, i18n.language) : "—"}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Link to={`/admin/news/${article.id}/edit`}>
                  <Button variant="ghost" size="icon" className="size-8" aria-label={t("news.aria.editArticle", { title: article.title })}>
                    <Pencil className="size-4" />
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" aria-label={t("news.aria.deleteArticle", { title: article.title })}>
                        <Trash2 className="size-4" />
                      </Button>
                    }
                  />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("news.delete.title")}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("news.delete.description", { title: article.title })}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t("news.delete.cancel")}</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMutation.mutate(article.id)} disabled={deleteMutation.isPending}>
                        {deleteMutation.isPending ? t("news.delete.deleting") : t("news.delete.delete")}
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
