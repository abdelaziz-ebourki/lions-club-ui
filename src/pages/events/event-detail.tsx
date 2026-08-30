import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/auth";
import type { Event } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { EventMetadata } from "@/components/shared/EventMetadata";
import { ArrowLeft, UserCheck, Users, Loader2 } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SEO } from "@/components/shared/SEO";
import { seoConfig, getEventSeo } from "@/config/seo";
import { useTranslation } from "react-i18next";

export function EventDetailPage() {
  const { t } = useTranslation(["events", "common"]);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: event, isLoading } = useQuery<Event>({
    queryKey: ["event", id],
    queryFn: () => api.get(`/events/${id}`),
    enabled: !!id,
  });

  const rsvpMutation = useMutation({
    mutationFn: () => api.post(`/events/${id}/rsvp`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", id] });
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Failed to RSVP");
    },
  });

  function handleRsvp() {
    if (!isAuthenticated) {
      navigate(`/login?return=/events/${id}`);
      return;
    }
    rsvpMutation.mutate();
  }

  const eventTitle = event?.title;
  const eventTrail = [
    { label: t("breadcrumbs.home"), href: "/" },
    { label: t("events:title"), href: "/events" },
    { label: eventTitle ?? t("events:unknown") },
  ];

  if (isLoading) {
    return (
      <>
        <SEO title={t("events:details")} description={seoConfig.events.description} ogType="website" />
        <Breadcrumbs trail={[{ label: t("breadcrumbs.home"), href: "/" }, { label: t("events:title"), href: "/events" }, { label: t("events:loading") }]} />
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-4 h-4 w-96" />
        <Skeleton className="mt-8 h-48 w-full" />
      </div>
    </>
    );
  }

  if (!event) {
    return (
      <>
        <SEO title={t("events:details")} description={seoConfig.events.description} ogType="website" />
        <Breadcrumbs trail={eventTrail} />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="font-heading text-h3">{t("events:notFound")}</h1>
        <Link to="/events" className="mt-4 inline-block">
          <Button>{t("events:browseProjects")}</Button>
        </Link>
      </div>
    </>
    );
  }

  const isUpcoming = event.status === "upcoming";
  const isRsvpd = event.hasRsvpd === true;

  return (
    <>
      <SEO {...getEventSeo(event)} />
      <Breadcrumbs trail={eventTrail} />
      <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <Link to="/events">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft data-icon="inline-start" aria-hidden="true" /> {t("events:allProjects")}
        </Button>
      </Link>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Badge variant="accent">
          {event.category}
        </Badge>
        <Badge variant="secondary" className="capitalize">
          {event.status}
        </Badge>
        {event.rsvpCount !== undefined && event.rsvpCount > 0 && (
          <span className="inline-flex items-center gap-1 text-body-xs text-muted-foreground">
            <Users className="size-3.5" aria-hidden="true" />
            {t("events:attending", { count: event.rsvpCount })}
          </span>
        )}
      </div>

      {event.image && (
        <div className="mb-8 overflow-hidden rounded-lg">
          <img
            src={event.image}
            alt={event.title}
            className="w-full object-cover"
            style={{ maxHeight: 400 }}
            loading="lazy"
            width={800}
            height={400}
          />
        </div>
      )}

      <h1 className="font-heading text-h1 text-foreground">
        {event.title}
      </h1>

      <div className="mt-6 flex flex-wrap items-center gap-6 text-body-sm text-muted-foreground">
        <EventMetadata date={event.date} time={event.time} location={event.location} />
        {isUpcoming && (
          <div className="ms-auto">
            {isRsvpd ? (
              <Button variant="outline" disabled>
                <UserCheck data-icon="inline-start" aria-hidden="true" /> {t("events:going")}
              </Button>
            ) : (
              <Button
                onClick={handleRsvp}
                disabled={rsvpMutation.isPending}
              >
                {rsvpMutation.isPending ? (
                  <><Loader2 className="me-2 size-4 animate-spin" /> {t("events:joining")}</>
                ) : (
                  <><UserCheck data-icon="inline-start" aria-hidden="true" /> {t("events:joinEvent")}</>
                )}
              </Button>
            )}
          </div>
        )}
      </div>

      <Separator className="my-8" />
      <div className="text-body-lg text-muted-foreground leading-relaxed space-y-4">
        <p>{event.description}</p>
      </div>
    </article>
    </>
  );
}
