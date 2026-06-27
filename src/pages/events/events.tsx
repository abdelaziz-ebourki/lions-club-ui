import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Event } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, MapPin } from "lucide-react";

const tabs = [
  { value: "all", label: "All Events" },
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
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4 border-accent text-accent">
              Events
            </Badge>
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
              Our Events
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Join us at our upcoming events or browse our past activities
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
            ? Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="mt-2 h-6 w-48" />
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
                        variant={event.status === "upcoming" ? "default" : "secondary"}
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
                    <CardDescription>{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
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
                  </CardContent>
                </Card>
              ))}
        </div>

        {events?.length === 0 && (
          <div key="empty-state" className="py-16 text-center text-muted-foreground">
            <p>No events found for this filter.</p>
          </div>
        )}
      </section>
    </>
  );
}
