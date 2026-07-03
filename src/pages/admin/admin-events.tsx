import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Event } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
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
import { CalendarX, Plus, Pencil, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";

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

  if (isLoading) {
    return (
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="font-display text-overline text-accent">Events</p>
            <h1 className="font-heading text-h2 mt-1 text-foreground">Manage Events</h1>
          </div>
        </div>
        <div className="rounded-lg border" aria-busy="true">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-display text-overline text-xs">Title</TableHead>
                <TableHead className="font-display text-overline text-xs hidden md:table-cell">Date</TableHead>
                <TableHead className="font-display text-overline text-xs hidden md:table-cell">Category</TableHead>
                <TableHead className="font-display text-overline text-xs">Status</TableHead>
                <TableHead className="font-display text-overline text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-16" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (events?.length === 0) {
    return (
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="font-display text-overline text-accent">Events</p>
            <h1 className="font-heading text-h2 mt-1 text-foreground">Manage Events</h1>
          </div>
          <Link to="/admin/events/new">
            <Button>
              <Plus data-icon="inline-start" /> New Event
            </Button>
          </Link>
        </div>
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="font-display text-overline text-accent">Events</p>
          <h1 className="font-heading text-h2 mt-1 text-foreground">Manage Events</h1>
        </div>
        <Link to="/admin/events/new">
          <Button>
            <Plus data-icon="inline-start" /> New Event
          </Button>
        </Link>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-display text-overline text-xs">Title</TableHead>
              <TableHead className="font-display text-overline text-xs hidden md:table-cell">Date</TableHead>
              <TableHead className="font-display text-overline text-xs hidden md:table-cell">Category</TableHead>
              <TableHead className="font-display text-overline text-xs">Status</TableHead>
              <TableHead className="font-display text-overline text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events?.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-body font-medium">{event.title}</TableCell>
                <TableCell className="text-muted-foreground hidden md:table-cell">{event.date}</TableCell>
                <TableCell className="hidden md:table-cell">
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
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
