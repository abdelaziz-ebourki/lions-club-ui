import type { LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Event, ForumThread, Member, ContactMessage } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MessageSquare, Users, Mail, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { useTranslation } from "react-i18next";

interface StatCard {
  label: string;
  count: number | string;
  icon: LucideIcon;
  href: string;
  color: string;
}

const STAT_CARD_DEFS: Omit<StatCard, "count">[] = [
  { label: "dashboard.stats.upcomingEvents", icon: Calendar, href: "/admin/events", color: "text-accent bg-accent/10" },
  { label: "dashboard.stats.forumThreads", icon: MessageSquare, href: "/admin/forum", color: "text-primary bg-primary/10" },
  { label: "dashboard.stats.activeMembers", icon: Users, href: "/admin/members", color: "text-secondary bg-secondary/10" },
  { label: "dashboard.stats.newMessages", icon: Mail, href: "/admin/messages", color: "text-accent bg-accent/10" },
];

function DashboardCard({ icon: Icon, label, count, href, color }: StatCard) {
  const { t } = useTranslation("admin");
  return (
    <Link to={href}>
      <Card className="transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-body text-sm font-medium text-muted-foreground">
            {t(label)}
          </CardTitle>
          <div className={`flex size-8 items-center justify-center rounded-full ${color}`}>
            <Icon className="size-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="font-heading text-3xl font-bold">{count}</div>
          <p className="mt-1 flex items-center text-xs text-muted-foreground">
            {t("dashboard.viewDetails")} <ArrowUpRight className="ms-1 size-3" />
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

function DashboardErrorBanner() {
  const { t } = useTranslation("admin");
  return (
    <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
      {t("dashboard.errorBanner")}
    </div>
  );
}

export function AdminDashboardPage() {
  const { t } = useTranslation("admin");
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

  const counts: Record<string, number | string> = {
    "dashboard.stats.upcomingEvents": events?.filter((e) => e.status === "upcoming").length ?? "—",
    "dashboard.stats.forumThreads": threads?.length ?? "—",
    "dashboard.stats.activeMembers": members?.length ?? "—",
    "dashboard.stats.newMessages": messages?.filter((m) => m.status === "unread").length ?? "—",
  };

  return (
    <div>
      <Breadcrumbs trail={[{ label: t("dashboard.breadcrumbs.home"), href: "/" }, { label: t("dashboard.breadcrumbs.admin"), href: "/admin" }, { label: t("dashboard.breadcrumbs.dashboard") }]} />
      <div className="mb-8">
        <p className="font-display text-overline text-accent">{t("dashboard.overline")}</p>
        <h1 className="font-heading text-h2 mt-1 text-foreground">{t("dashboard.heading")}</h1>
        <p className="text-body text-muted-foreground mt-1">
          {t("dashboard.description")}
        </p>
      </div>

      {hasError && <DashboardErrorBanner />}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARD_DEFS.map((def) => (
          <DashboardCard key={def.label} {...def} count={counts[def.label] ?? "—"} />
        ))}
      </div>
    </div>
  );
}
