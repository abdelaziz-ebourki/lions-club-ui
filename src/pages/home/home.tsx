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

const impact = [
  { value: "12", label: "vision screenings last quarter" },
  { value: "28", label: "youth mentored this year" },
  { value: "8", label: "neighborhood clean-ups in 2024" },
  { value: "4", label: "community partners active now" },
];

export function HomePage() {
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["events", "upcoming"],
    queryFn: () => api.get("/events?status=upcoming"),
  });

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/[0.03] via-background to-accent/[0.03]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
        <div className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-display text-overline-lg text-accent mb-6 tracking-widest animate-in stagger-1">
              We Serve
            </p>
            <h1 className="font-heading text-display-lg italic text-foreground animate-in stagger-2">
              Casablanca has served since 2015.
              <br />Your turn.
            </h1>
            <p className="mt-6 text-body-lg text-muted-foreground max-w-2xl mx-auto animate-in stagger-3">
              Lions Club FSBM unites neighbors, students, and professionals
              to tackle Casablanca's most pressing needs — vision health,
              youth opportunity, and community resilience.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-in stagger-4">
              <Link to="/events">
                <Button size="lg">
                  Find Your First Project <ArrowRight data-icon="inline-end" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="font-display text-overline text-accent text-center mb-10">
            What We've Done Together
          </p>
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
            {impact.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-heading text-4xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="mt-2 text-body-sm text-muted-foreground max-w-28 mx-auto">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <p className="font-display text-overline-lg tracking-widest text-primary-foreground/60">
            Get Involved
          </p>
          <h2 className="font-heading text-h1 mt-2 text-primary-foreground">
            Ready to Serve?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-body-lg text-primary-foreground/80">
            Every project starts with one person showing up. 
            Whether you can give two hours or two years, 
            there's a place for you here.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/contact">
              <Button variant="secondary" size="lg">
                Start Volunteering
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant="outline"
                size="lg"
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
