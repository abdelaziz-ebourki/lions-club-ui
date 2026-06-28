import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Event } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: event, isLoading } = useQuery<Event>({
    queryKey: ["event", id],
    queryFn: () => api.get(`/events/${id}`),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-4 h-4 w-96" />
        <Skeleton className="mt-8 h-48 w-full" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="font-heading text-h3">Project not found</h1>
        <Link to="/events" className="mt-4 inline-block">
          <Button>Browse Projects</Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <Link to="/events">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft data-icon="inline-start" /> All Projects
        </Button>
      </Link>

      <Badge variant="accent" className="mb-4">
        {event.category}
      </Badge>
      <Badge variant="secondary" className="mb-4 ml-2 capitalize">
        {event.status}
      </Badge>

      <h1 className="font-heading text-h1 text-foreground">
        {event.title}
      </h1>

      <div className="mt-6 flex flex-wrap gap-6 text-body-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="size-4" aria-hidden="true" />
          {event.date}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="size-4" aria-hidden="true" />
          {event.time}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="size-4" aria-hidden="true" />
          {event.location}
        </div>
      </div>

      <Separator className="my-8" />
      <div className="text-body-lg text-muted-foreground leading-relaxed space-y-4">
        <p>{event.description}</p>
      </div>
    </article>
  );
}
