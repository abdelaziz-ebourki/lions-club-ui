import type { LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Event, ForumThread, Member, ContactMessage } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MessageSquare, Users, Mail, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

interface StatCard {
  label: string;
  count: number | string;
  icon: LucideIcon;
  href: string;
  color: string;
}

const STAT_CARD_DEFS: Omit<StatCard, "count">[] = [
  { label: "Upcoming Events", icon: Calendar, href: "/admin/events", color: "text-accent bg-accent/10" },
  { label: "Forum Threads", icon: MessageSquare, href: "/admin/forum", color: "text-primary bg-primary/10" },
  { label: "Active Members", icon: Users, href: "/admin/members", color: "text-secondary bg-secondary/10" },
  { label: "New Messages", icon: Mail, href: "/admin/messages", color: "text-accent bg-accent/10" },
];

function DashboardCard({ icon: Icon, label, count, href, color }: StatCard) {
  return (
    <Link to={href}>
      <Card className="transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-body text-sm font-medium text-muted-foreground">
            {label}
          </CardTitle>
          <div className={`flex size-8 items-center justify-center rounded-full ${color}`}>
            <Icon className="size-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="font-heading text-3xl font-bold">{count}</div>
          <p className="mt-1 flex items-center text-xs text-muted-foreground">
            View details <ArrowUpRight className="ml-1 size-3" />
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

function DashboardErrorBanner() {
  return (
    <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
      Some dashboard data couldn't be loaded. Check your connection and try refreshing.
    </div>
  );
}

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

  function getCount(def: (typeof STAT_CARD_DEFS)[number]): number | string {
    switch (def.label) {
      case "Upcoming Events": return events?.filter((e) => e.status === "upcoming").length ?? "—";
      case "New Messages": return messages?.filter((m) => m.status === "unread").length ?? "—";
      case "Forum Threads": return threads?.length ?? "—";
      case "Active Members": return members?.length ?? "—";
      default: return "—";
    }
  }

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

      {hasError && <DashboardErrorBanner />}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARD_DEFS.map((def) => (
          <DashboardCard key={def.label} {...def} count={getCount(def)} />
        ))}
      </div>
    </div>
  );
}
