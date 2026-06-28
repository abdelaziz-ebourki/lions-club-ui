import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Calendar, MessageSquare, Users, Mail, LogOut } from "lucide-react";

const adminNav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Forum", href: "/admin/forum", icon: MessageSquare },
  { label: "Members", href: "/admin/members", icon: Users },
  { label: "Messages", href: "/admin/messages", icon: Mail },
];

export function AdminLayout() {
  const location = useLocation();

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <aside className="hidden w-64 shrink-0 flex-col gap-2 md:flex">
        <div className="mb-6">
          <p className="font-display text-overline text-accent">Admin</p>
          <h2 className="font-heading text-h4 mt-1 text-foreground">Manage</h2>
        </div>
        <nav className="flex flex-col gap-1">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-3">
              <LogOut className="size-4" />
              Back to Site
            </Button>
          </Link>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
