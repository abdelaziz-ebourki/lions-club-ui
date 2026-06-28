import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MessageSquare, Users, Mail, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const statCards = [
  { label: "Upcoming Events", count: "3", icon: Calendar, href: "/admin/events", color: "text-accent bg-accent/10" },
  { label: "Forum Threads", count: "12", icon: MessageSquare, href: "/admin/forum", color: "text-primary bg-primary/10" },
  { label: "Active Members", count: "52", icon: Users, href: "/admin/members", color: "text-secondary bg-secondary/10" },
  { label: "New Messages", count: "2", icon: Mail, href: "/admin/messages", color: "text-accent bg-accent/10" },
];

export function AdminDashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="font-display text-overline text-accent">Overview</p>
        <h1 className="font-heading text-h2 mt-1 text-foreground">Dashboard</h1>
        <p className="text-body text-muted-foreground mt-1">
          Manage your club's projects, members, and conversations.
        </p>
      </div>

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
