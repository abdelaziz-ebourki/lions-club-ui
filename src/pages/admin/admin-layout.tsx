import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Users,
  MessageSquare,
  MessageCircle,
  LogOut,
  ArrowLeft,
} from "lucide-react";

const sidebarNav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Members", href: "/admin/members", icon: Users },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare },
  { label: "Forum", href: "/admin/forum", icon: MessageCircle },
];

export function AdminLayout() {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user || !isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
        <h1 className="font-heading text-2xl font-bold">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">
          You need to be logged in as admin to access this area.
        </p>
        <Link to="/login" className="mt-4 inline-block">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <aside className="hidden w-56 shrink-0 md:block">
        <div className="sticky top-24 flex flex-col gap-1">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Admin Panel
          </p>
          {sidebarNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                  location.pathname === item.href
                    ? "bg-muted text-primary"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
          <div className="pt-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <ArrowLeft data-icon="inline-start" />
                Back to site
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-destructive"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              <LogOut data-icon="inline-start" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
