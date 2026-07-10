import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionDivider } from "@/components/ui/section-divider";
import { ArrowRight, Calendar } from "lucide-react";
import type { Event } from "@/types";
import { HomeHero } from "@/components/shared/HomeHero";
import { HomeImpact } from "@/components/shared/HomeImpact";
import { HomeCta } from "@/components/shared/HomeCta";

export function HomePage() {
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["events", "upcoming"],
    queryFn: () => api.get("/events?status=upcoming"),
  });

  return (
    <>
      <HomeHero />

      <HomeImpact />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-display text-overline text-accent">
              Upcoming
            </p>
            <h2 className="font-heading text-h2 mt-1 text-foreground">
              Projects You Can Join
            </h2>
          </div>
          <Link to="/events" className="hidden sm:block">
            <Button variant="ghost" size="sm">
              All Projects <ArrowRight data-icon="inline-end" />
            </Button>
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="size-4 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-48 mt-3" />
                  <Skeleton className="h-4 w-32 mt-1" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            events?.slice(0, 3).map((event) => (
              <Card key={event.id} className="group transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="accent">{event.category}</Badge>
                    <Calendar className="size-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <CardTitle className="mt-3 font-heading text-xl group-hover:text-primary transition-colors">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="text-body-sm">
                    {event.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    to={`/events/${event.id}`}
                    className="inline-flex items-center text-sm font-medium text-accent hover:underline"
                  >
                    Join This Project <ArrowRight className="ml-1 size-3" />
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Link to="/events" className="mt-6 text-center sm:hidden">
          <Button variant="ghost">
            All Projects <ArrowRight data-icon="inline-end" />
          </Button>
        </Link>

        {events?.length === 0 && (
          <div className="py-16 text-center">
            <p className="font-body text-muted-foreground">
              No projects scheduled yet. Check back soon.
            </p>
            <Link to="/contact">
              <Button variant="outline" className="mt-4">
                Suggest a Project
              </Button>
            </Link>
          </div>
        )}
      </section>

      <SectionDivider />

      <HomeCta />
    </>
  );
}
