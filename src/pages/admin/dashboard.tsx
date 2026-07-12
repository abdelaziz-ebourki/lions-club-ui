import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Event, ForumThread, Member, ContactMessage } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MessageSquare, Users, Mail, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export function AdminDashboardPage() {
  const { data: events, isError: eventsError } = useQuery<Event[]>({
    queryKey: ["events", "admin"],
    queryFn: () => api.get("/events"),
  });

  const { data: threads, isError: threadsError } = useQuery<ForumThread[]>({
    queryKey: ["forum-threads", "admin"],
    queryFn: () => api.get("/forum/threads"),
  });

  const { data: members, isError: membersError } = useQuery<Member[]>({
    queryKey: ["members", "admin"],
    queryFn: () => api.get("/members"),
  });

  const { data: messages, isError: messagesError } = useQuery<ContactMessage[]>({
    queryKey: ["messages", "admin"],
    queryFn: () => api.get("/contact"),
  });

  const hasError = eventsError || threadsError || membersError || messagesError;

  const statCards = [
    {
      label: "Upcoming Events",
      count: events?.filter((e) => e.status === "upcoming").length ?? "—",
      icon: Calendar,
      href: "/admin/events",
      color: "text-accent bg-accent/10",
    },
    {
      label: "Forum Threads",
      count: threads?.length ?? "—",
      icon: MessageSquare,
      href: "/admin/forum",
      color: "text-primary bg-primary/10",
    },
    {
      label: "Active Members",
      count: members?.length ?? "—",
      icon: Users,
      href: "/admin/members",
      color: "text-secondary bg-secondary/10",
    },
    {
      label: "New Messages",
      count: messages?.filter((m) => m.status === "unread").length ?? "—",
      icon: Mail,
      href: "/admin/messages",
      color: "text-accent bg-accent/10",
    },
  ];

  return (
    <div>
      <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "Dashboard" }]} />
      <div className="mb-8">
        <p className="font-display text-overline text-accent">Overview</p>
        <h1 className="font-heading text-h2 mt-1 text-foreground">Dashboard</h1>
        <p className="text-body text-muted-foreground mt-1">
          Manage your club's projects, members, and conversations.
        </p>
      </div>

      {hasError && (
        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Some dashboard data couldn't be loaded. Check your connection and try refreshing.
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} to={stat.href}>
              <Card className="transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="font-body text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <div className={`flex size-8 items-center justify-center rounded-full ${stat.color}`}>
                    <Icon className="size-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="font-heading text-3xl font-bold">{stat.count}</div>
                  <p className="mt-1 flex items-center text-xs text-muted-foreground">
                    View details <ArrowUpRight className="ml-1 size-3" />
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
