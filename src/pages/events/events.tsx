import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Event } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const tabs = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
];

export function EventsPage() {
  const [filter, setFilter] = useState("all");

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["events", filter],
    queryFn: () => api.get(`/events${filter !== "all" ? `?status=${filter}` : ""}`),
  });

  return (
    <>
      <section className="border-b bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-display text-overline text-accent mb-4">
              Projects
            </p>
            <h1 className="font-heading text-h1 text-foreground">
              Projects You Can Join
            </h1>
            <p className="mt-4 text-body-lg text-muted-foreground">
              Browse our upcoming projects or see what we've accomplished together
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Tabs value={filter} onValueChange={setFilter} className="mb-8">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="mt-3 h-6 w-48" />
                    <Skeleton className="mt-1 h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="mt-2 h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))
            : events?.map((event) => (
                <Card key={event.id} className="group transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={event.status === "upcoming" ? "accent" : "secondary"}
                      >
                        {event.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="capitalize text-xs"
                      >
                        {event.status}
                      </Badge>
                    </div>
                    <CardTitle className="mt-3 font-heading text-xl group-hover:text-primary transition-colors">
                      {event.title}
                    </CardTitle>
                    <CardDescription className="text-body-sm">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2 text-body-sm text-muted-foreground">
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
                    <Link
                      to={`/events/${event.id}`}
                      className="mt-4 inline-flex items-center text-sm font-medium text-accent hover:underline group-hover:opacity-100 transition-opacity"
                    >
                      Project Details <ArrowRight className="ml-1 size-3" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
        </div>

        {events?.length === 0 && (
          <div className="py-16 text-center">
            <p className="font-body text-muted-foreground">
              No projects match this filter.
            </p>
            <Link to="/contact">
              <Button variant="outline" className="mt-4">
                Suggest a Project
              </Button>
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
