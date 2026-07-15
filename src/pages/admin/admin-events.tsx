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

export function AdminEventsPage() {
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["events", "admin"],
    queryFn: () => api.get("/events"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event deleted successfully.");
    },
    onError: () => toast.error("Failed to delete event."),
  });

  const headers = (
    <>
      <TableHead className="font-display text-overline text-xs">Title</TableHead>
      <TableHead className="font-display text-overline text-xs">Date</TableHead>
      <TableHead className="font-display text-overline text-xs">Category</TableHead>
      <TableHead className="font-display text-overline text-xs">Status</TableHead>
      <TableHead className="font-display text-overline text-xs text-right">Actions</TableHead>
    </>
  );

  if (isLoading) {
    return (
      <div>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "Events" }]} />
        <AdminPageHeader overline="Events" heading="Manage Events" />
        <AdminTable headers={headers} loading skeletonColumns={5} />
      </div>
    );
  }

  if (events?.length === 0) {
    return (
      <div>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "Events" }]} />
        <AdminPageHeader overline="Events" heading="Manage Events" action={{ to: "/admin/events/new", label: "New Event" }} />
        <EmptyState
          icon={CalendarX}
          title="No projects yet"
          description="Create your first community project."
          action={
            <Link to="/admin/events/new">
              <Button>Create your first project</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "Events" }]} />
      <AdminPageHeader overline="Events" heading="Manage Events" action={{ to: "/admin/events/new", label: "New Event" }} />
      <AdminTable
        headers={headers}
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
                    <Button variant="ghost" size="icon" className="size-8">
                      <Pencil className="size-4" />
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive">
                          <Trash2 className="size-4" />
                        </Button>
                      }
                    />
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Event</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{event.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate(event.id)} disabled={deleteMutation.isPending}>
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
                  <Button variant="ghost" size="icon" className="size-8">
                    <Pencil className="size-4" />
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive">
                        <Trash2 className="size-4" />
                      </Button>
                    }
                  />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Event</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{event.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMutation.mutate(event.id)} disabled={deleteMutation.isPending}>
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
