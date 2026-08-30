import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { GalleryItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TableCell, TableRow, TableHead } from "@/components/ui/table";
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
import { Images, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/lib/format";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/ErrorState";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { AdminPageHeader } from "@/components/shared/AdminPageHeader";
import { AdminTable } from "@/components/shared/AdminTable";

export function AdminGalleryPage() {
  const { t, i18n } = useTranslation("admin");
  const queryClient = useQueryClient();

  const { data: items, isLoading, isError, refetch } = useQuery<GalleryItem[]>({
    queryKey: ["gallery", "admin"],
    queryFn: () => api.get("/gallery/admin"),
    retry: false,
  });

  const { data: events } = useQuery<{ id: string; title: string }[]>({
    queryKey: ["events"],
    queryFn: () => api.get("/events"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/gallery/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast.success(t("gallery.toast.deleted"));
    },
    onError: () => toast.error("Failed to delete item."),
  });

  function getEventTitle(eventId?: string): string {
    if (!eventId) return "—";
    return events?.find((e) => e.id === eventId)?.title ?? "—";
  }

  const headers = (
    <>
      <TableHead className="font-display text-overline text-xs">{t("gallery.headers.thumbnail")}</TableHead>
      <TableHead className="font-display text-overline text-xs">{t("gallery.headers.title")}</TableHead>
      <TableHead className="font-display text-overline text-xs">{t("gallery.headers.category")}</TableHead>
      <TableHead className="font-display text-overline text-xs">{t("gallery.headers.event")}</TableHead>
      <TableHead className="font-display text-overline text-xs">{t("gallery.headers.tags")}</TableHead>
      <TableHead className="font-display text-overline text-xs">{t("gallery.headers.uploaded")}</TableHead>
      <TableHead className="font-display text-overline text-xs">{t("gallery.headers.uploader")}</TableHead>
      <TableHead className="font-display text-overline text-xs text-right">{t("gallery.headers.actions")}</TableHead>
    </>
  );

  function renderActions(item: GalleryItem) {
    return (
      <>
        <Link to={`/admin/gallery/${item.id}/edit`} aria-label={`Edit item ${item.title}`}>
          <Button variant="ghost" size="icon" className="size-8">
            <Pencil className="size-4" />
          </Button>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-destructive hover:text-destructive"
                aria-label={t("gallery.aria.deleteItem", { title: item.title })}
              >
                <Trash2 className="size-4" />
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("gallery.delete.title")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("gallery.delete.description", { title: item.title })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("gallery.delete.cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteMutation.mutate(item.id)} disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? t("gallery.delete.deleting") : t("gallery.delete.delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  if (isLoading) {
    return (
      <div>
        <Breadcrumbs trail={[{ label: t("gallery.breadcrumbs.home"), href: "/" }, { label: t("gallery.breadcrumbs.admin"), href: "/admin" }, { label: t("gallery.breadcrumbs.gallery") }]} />
        <AdminPageHeader overline={t("gallery.overline")} heading={t("gallery.heading")} />
        <AdminTable headers={headers} caption={t("gallery.caption")} loading skeletonColumns={8} />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <Breadcrumbs trail={[{ label: t("gallery.breadcrumbs.home"), href: "/" }, { label: t("gallery.breadcrumbs.admin"), href: "/admin" }, { label: t("gallery.breadcrumbs.gallery") }]} />
        <AdminPageHeader overline={t("gallery.overline")} heading={t("gallery.heading")} action={{ to: "/admin/gallery/new", label: t("gallery.newItem") }} />
        <ErrorState
          heading={t("gallery.error.heading")}
          message={t("gallery.error.message")}
          onRetry={refetch}
          retryLabel={t("gallery.error.retry")}
        />
      </div>
    );
  }

  if (items?.length === 0) {
    return (
      <div>
        <Breadcrumbs trail={[{ label: t("gallery.breadcrumbs.home"), href: "/" }, { label: t("gallery.breadcrumbs.admin"), href: "/admin" }, { label: t("gallery.breadcrumbs.gallery") }]} />
        <AdminPageHeader overline={t("gallery.overline")} heading={t("gallery.heading")} action={{ to: "/admin/gallery/new", label: t("gallery.newItem") }} />
        <EmptyState
          icon={Images}
          title={t("gallery.empty.title")}
          description={t("gallery.empty.description")}
          action={
            <Link to="/admin/gallery/new">
              <Button>{t("gallery.empty.action")}</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs trail={[{ label: t("gallery.breadcrumbs.home"), href: "/" }, { label: t("gallery.breadcrumbs.admin"), href: "/admin" }, { label: t("gallery.breadcrumbs.gallery") }]} />
      <AdminPageHeader overline={t("gallery.overline")} heading={t("gallery.heading")} action={{ to: "/admin/gallery/new", label: t("gallery.newItem") }} />
      <AdminTable
        headers={headers} caption={t("gallery.caption")}
        mobileView={items?.map((item) => (
          <Card key={item.id} data-testid="gallery-mobile-card" className="mb-3">
            <CardContent className="flex gap-3 py-4">
              <img src={item.thumbnailUrl ?? item.imageUrl} alt="" className="h-16 w-16 shrink-0 rounded object-cover" loading="lazy" width={64} height={64} />
              <div className="min-w-0 flex-1 space-y-1">
                <p className="font-body font-medium line-clamp-1">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.category}</p>
                <p className="text-xs text-muted-foreground">{t("gallery.mobile.eventPrefix")} {getEventTitle(item.eventId)}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(item.uploadedAt, i18n.language)}
                </p>
                <div className="flex gap-2 pt-1">{renderActions(item)}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      >
        {items?.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <img src={item.thumbnailUrl ?? item.imageUrl} alt="" className="h-10 w-10 rounded object-cover" loading="lazy" width={40} height={40} />
            </TableCell>
            <TableCell className="max-w-[220px] truncate font-medium">{item.title}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell className="text-muted-foreground">{getEventTitle(item.eventId)}</TableCell>
            <TableCell className="max-w-[160px] truncate text-muted-foreground">{item.tags.join(", ")}</TableCell>
            <TableCell className="text-muted-foreground text-sm">{formatDate(item.uploadedAt, i18n.language)}</TableCell>
            <TableCell className="text-muted-foreground">{item.uploadedBy}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">{renderActions(item)}</div>
            </TableCell>
          </TableRow>
        ))}
      </AdminTable>
    </div>
  );
}
