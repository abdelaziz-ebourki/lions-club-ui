import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Event } from "@/types";
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
import { CalendarX, Pencil, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { AdminPageHeader } from "@/components/shared/AdminPageHeader";
import { AdminTable } from "@/components/shared/AdminTable";
import { useTranslation } from "react-i18next";

export function AdminEventsPage() {
  const { t } = useTranslation("admin");
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["events", "admin"],
    queryFn: () => api.get("/events"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success(t("events.toast.deleted"));
    },
    onError: () => toast.error(t("events.toast.deleteFailed")),
  });

  const headers = (
    <>
      <TableHead className="font-display text-overline text-xs">{t("events.headers.title")}</TableHead>
      <TableHead className="font-display text-overline text-xs">{t("events.headers.date")}</TableHead>
      <TableHead className="font-display text-overline text-xs">{t("events.headers.category")}</TableHead>
      <TableHead className="font-display text-overline text-xs">{t("events.headers.status")}</TableHead>
      <TableHead className="font-display text-overline text-xs text-right">{t("events.headers.actions")}</TableHead>
    </>
  );

  if (isLoading) {
    return (
      <div>
        <Breadcrumbs trail={[{ label: t("events.breadcrumbs.home"), href: "/" }, { label: t("events.breadcrumbs.admin"), href: "/admin" }, { label: t("events.breadcrumbs.events") }]} />
        <AdminPageHeader overline={t("events.overline")} heading={t("events.heading")} />
        <AdminTable headers={headers} loading skeletonColumns={5} caption={t("events.caption")} />
      </div>
    );
  }

  if (events?.length === 0) {
    return (
      <div>
        <Breadcrumbs trail={[{ label: t("events.breadcrumbs.home"), href: "/" }, { label: t("events.breadcrumbs.admin"), href: "/admin" }, { label: t("events.breadcrumbs.events") }]} />
        <AdminPageHeader overline={t("events.overline")} heading={t("events.heading")} action={{ to: "/admin/events/new", label: t("events.newEvent") }} />
        <EmptyState
          icon={CalendarX}
          title={t("events.empty.title")}
          description={t("events.empty.description")}
          action={
            <Link to="/admin/events/new">
              <Button>{t("events.empty.action")}</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs trail={[{ label: t("events.breadcrumbs.home"), href: "/" }, { label: t("events.breadcrumbs.admin"), href: "/admin" }, { label: t("events.breadcrumbs.events") }]} />
      <AdminPageHeader overline={t("events.overline")} heading={t("events.heading")} action={{ to: "/admin/events/new", label: t("events.newEvent") }} />
      <AdminTable
        headers={headers}
        caption={t("events.caption")}
        mobileView={events?.map((event) => (
          <Card key={event.id} className="mb-3">
            <CardContent className="py-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-body font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                  <Badge variant="accent" className="text-[10px]">{event.category}</Badge>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={event.status === "upcoming" ? "default" : "secondary"} className="capitalize">
                    {event.status}
                  </Badge>
                  <Link to={`/admin/events/${event.id}/edit`}>
                    <Button variant="ghost" size="icon" className="size-8" aria-label={t("events.aria.editEvent", { title: event.title })}>
                      <Pencil className="size-4" />
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" aria-label={t("events.aria.deleteEvent", { title: event.title })}>
                          <Trash2 className="size-4" />
                        </Button>
                      }
                    />
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t("events.delete.title")}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("events.delete.description", { title: event.title })}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("events.delete.cancel")}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate(event.id)} disabled={deleteMutation.isPending}>
                          {deleteMutation.isPending ? t("events.delete.deleting") : t("events.delete.delete")}
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
        {events?.map((event) => (
          <TableRow key={event.id}>
            <TableCell className="font-body font-medium">{event.title}</TableCell>
            <TableCell className="text-muted-foreground">{event.date}</TableCell>
            <TableCell>
              <Badge variant="accent" className="text-[10px]">{event.category}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={event.status === "upcoming" ? "default" : "secondary"} className="capitalize">
                {event.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Link to={`/admin/events/${event.id}/edit`}>
                  <Button variant="ghost" size="icon" className="size-8" aria-label={t("events.aria.editEvent", { title: event.title })}>
                    <Pencil className="size-4" />
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" aria-label={t("events.aria.deleteEvent", { title: event.title })}>
                        <Trash2 className="size-4" />
                      </Button>
                    }
                  />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("events.delete.title")}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("events.delete.description", { title: event.title })}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t("events.delete.cancel")}</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMutation.mutate(event.id)} disabled={deleteMutation.isPending}>
                        {deleteMutation.isPending ? t("events.delete.deleting") : t("events.delete.delete")}
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
