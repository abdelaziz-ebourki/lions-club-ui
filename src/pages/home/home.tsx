import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Calendar, Heart, Handshake, Users } from "lucide-react";
import type { Event } from "@/types";

const stats = [
  { icon: Users, value: "50+", label: "Active Members" },
  { icon: Heart, value: "30+", label: "Service Projects" },
  { icon: Calendar, value: "15+", label: "Annual Events" },
  { icon: Handshake, value: "10+", label: "Community Partners" },
];

export function HomePage() {
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["events", "upcoming"],
    queryFn: () => api.get("/events?status=upcoming"),
  });

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[url('/logo.png')] bg-[size:200px] bg-[position:95%_10%] bg-no-repeat opacity-[0.03] opacity-[0.04]" />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4 border-accent text-accent">
              Lions Club FSBM
            </Badge>
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              We{" "}
              <span className="bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
                Serve
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              A community of dedicated volunteers making a difference in
              Casablanca through service, leadership, and compassion.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link to="/about">
                <Button size="lg">
                  Join Us <ArrowRight data-icon="inline-end" />
                </Button>
              </Link>
              <Link to="/events">
                <Button variant="outline" size="lg">
                  Upcoming Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <stat.icon className="size-6" aria-hidden="true" />
                </div>
                <p className="mt-3 font-heading text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-3xl font-bold tracking-tight">
              Upcoming Events
            </h2>
            <p className="mt-2 text-muted-foreground">
              Join us in making a difference
            </p>
          </div>
          <Link to="/events">
            <Button variant="ghost">
              View all <ArrowRight data-icon="inline-end" />
            </Button>
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="group transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Loading...</Badge>
                    <Calendar className="size-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
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
                    <Badge variant="secondary">{event.category}</Badge>
                    <Calendar className="size-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <CardTitle className="mt-3 font-heading text-xl">
                    {event.title}
                  </CardTitle>
                  <CardDescription>{event.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    to={`/events/${event.id}`}
                    className="inline-flex items-center text-sm font-medium text-accent hover:underline"
                  >
                    Learn more <ArrowRight className="ml-1 size-3" />
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold tracking-tight">
            Ready to Make a Difference?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
            Whether you want to volunteer, partner with us, or learn more,
            we'd love to hear from you.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/contact">
              <Button variant="secondary" size="lg">
                Get in Touch
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