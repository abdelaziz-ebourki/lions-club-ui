import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Calendar, Users, MessageSquare, MessageCircle } from "lucide-react";
import type { Event, Member, ContactMessage, ForumCategory } from "@/types";

const statCards = [
  { key: "events", title: "Upcoming Events", icon: Calendar, description: "events planned", queryKey: ["events", "upcoming"], queryFn: () => api.get<Event[]>("/events?status=upcoming") },
  { key: "members", title: "Members", icon: Users, description: "active members", queryKey: ["members"], queryFn: () => api.get<Member[]>("/members") },
  { key: "messages", title: "Messages", icon: MessageSquare, description: "contact submissions", queryKey: ["contact"], queryFn: () => api.get<ContactMessage[]>("/contact") },
  { key: "categories", title: "Forum Categories", icon: MessageCircle, description: "discussion areas", queryKey: ["forum-categories"], queryFn: () => api.get<ForumCategory[]>("/forum/categories") },
] as const;

function StatCard({ title, value, icon: Icon, description, isLoading, error }: { title: string; value: number; icon: typeof Calendar; description: string; isLoading: boolean; error: Error | null }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : error ? (
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="size-4" aria-hidden="true" />
            <span className="text-sm">Failed to load</span>
          </div>
        ) : (
          <p className="font-heading text-3xl font-bold">{value}</p>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const eventsQuery = useQuery({ queryKey: statCards[0].queryKey, queryFn: statCards[0].queryFn });
  const membersQuery = useQuery({ queryKey: statCards[1].queryKey, queryFn: statCards[1].queryFn });
  const messagesQuery = useQuery({ queryKey: statCards[2].queryKey, queryFn: statCards[2].queryFn });
  const categoriesQuery = useQuery({ queryKey: statCards[3].queryKey, queryFn: statCards[3].queryFn });

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Overview of your Lions Club FSBM platform</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={statCards[0].title}
          value={eventsQuery.data?.length ?? 0}
          icon={statCards[0].icon}
          description={statCards[0].description}
          isLoading={eventsQuery.isLoading}
          error={eventsQuery.error as Error | null}
        />
        <StatCard
          title={statCards[1].title}
          value={membersQuery.data?.length ?? 0}
          icon={statCards[1].icon}
          description={statCards[1].description}
          isLoading={membersQuery.isLoading}
          error={membersQuery.error as Error | null}
        />
        <StatCard
          title={statCards[2].title}
          value={messagesQuery.data?.length ?? 0}
          icon={statCards[2].icon}
          description={statCards[2].description}
          isLoading={messagesQuery.isLoading}
          error={messagesQuery.error as Error | null}
        />
        <StatCard
          title={statCards[3].title}
          value={categoriesQuery.data?.length ?? 0}
          icon={statCards[3].icon}
          description={statCards[3].description}
          isLoading={categoriesQuery.isLoading}
          error={categoriesQuery.error as Error | null}
        />
      </div>
    </div>
  );
}