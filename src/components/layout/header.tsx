import { useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/theme";
import { useAuth } from "@/contexts/auth";
import { SearchBar } from "@/components/search/search-bar";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { NotificationPanel } from "@/components/notifications/notification-panel";
import { useNotifications } from "@/hooks/use-notifications";

export function Header() {
  const { theme, toggle } = useTheme();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();

  const handleNotificationClick = useCallback((id: string) => {
    const notification = notifications.find((n) => n.id === id);
    if (notification) {
      markAsRead(id);
      navigate(notification.targetUrl);
    }
    setNotifOpen(false);
  }, [notifications, navigate, markAsRead]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } finally {
      navigate("/");
      setOpen(false);
    }
  }, [logout, navigate]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="" className="h-8 w-8 rounded-full" width={32} height={32} />
          <span className="font-heading text-xl font-semibold text-primary">
            {siteConfig.name}
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden md:flex md:items-center md:gap-1">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              aria-current={location.pathname === item.href ? "page" : undefined}
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                location.pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <SearchBar className="hidden md:block" />

        <div className="flex items-center gap-1">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-primary sm:inline-block"
              >
                Profile
              </Link>
              <Link
                to="/admin"
                className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-primary sm:inline-block"
              >
                {isAdmin ? "Admin" : "Dashboard"}
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden sm:inline-flex">
                Sign Out
              </Button>
            </>
          ) : (
            <Link
              to="/login"
              className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-primary sm:inline-block"
            >
              Sign In
            </Link>
          )}
          {isAuthenticated && (
            <>
              <NotificationBell
                unreadCount={unreadCount}
                onClick={() => setNotifOpen(true)}
              />
              {notifOpen && (
                <NotificationPanel
                  notifications={notifications}
                  unreadCount={unreadCount}
                  onNotificationClick={handleNotificationClick}
                  onMarkAllRead={markAllRead}
                  onClose={() => setNotifOpen(false)}
                />
              )}
            </>
          )}
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right">
              <div className="mt-8">
                <SearchBar className="md:hidden" />
              </div>
              <nav aria-label="Mobile navigation" className="mt-4 flex flex-col gap-4">
                {siteConfig.nav.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    aria-current={location.pathname === item.href ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary",
                      location.pathname === item.href
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                {isAdmin && (
                  <>
                    <div className="border-t pt-4 mt-2" />
                    <p className="font-display text-overline text-accent text-xs tracking-widest uppercase pb-1">
                      Admin
                    </p>
                    <Link
                      to="/admin"
                      aria-current={location.pathname === "/admin" ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        location.pathname === "/admin"
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/events"
                      aria-current={location.pathname === "/admin/events" ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        location.pathname === "/admin/events"
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      Events
                    </Link>
                    <Link
                      to="/admin/forum"
                      aria-current={location.pathname === "/admin/forum" ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        location.pathname === "/admin/forum"
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      Forum
                    </Link>
                    <Link
                      to="/admin/members"
                      aria-current={location.pathname === "/admin/members" ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        location.pathname === "/admin/members"
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      Members
                    </Link>
                    <Link
                      to="/admin/messages"
                      aria-current={location.pathname === "/admin/messages" ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        location.pathname === "/admin/messages"
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      Messages
                    </Link>
                  </>
                )}
                {isAuthenticated && (
                  <>
                    <div className="border-t pt-4 mt-2" />
                    <Link
                      to="/profile"
                      onClick={() => setOpen(false)}
                      className="text-lg font-medium transition-colors hover:text-primary"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-lg font-medium text-destructive transition-colors hover:text-destructive"
                    >
                      Sign Out
                    </button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
