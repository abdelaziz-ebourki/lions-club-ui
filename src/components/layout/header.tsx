import { useState, useCallback, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/theme";
import { useAuth } from "@/contexts/auth";
import { SearchBar } from "@/components/search/search-bar";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { NotificationPanel } from "@/components/notifications/notification-panel";
import { useNotifications } from "@/hooks/use-notifications";
import { HeaderNavLinks } from "@/components/shared/HeaderNavLinks";
import { HeaderUserActions } from "@/components/shared/HeaderUserActions";
import { HeaderMobileNav } from "@/components/shared/HeaderMobileNav";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 24;

export function Header() {
  const { t } = useTranslation();
  const { theme, toggle } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const overHero = pathname === "/" && !scrolled;
  const tone = overHero ? "onDark" : "onLight";

  return (
    <header
      data-tone={tone}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300",
        overHero
          ? "border-b border-transparent bg-gradient-to-b from-black/60 via-black/25 to-transparent text-white"
          : "border-b border-border/60 bg-background/85 text-foreground backdrop-blur-xl"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="" className="h-8 w-8 rounded-full" width={32} height={32}  />
          <span className="font-heading text-xl font-semibold">
            {t("site.name")}
          </span>
        </Link>

        <HeaderNavLinks tone={tone} />

        <SearchBar tone={tone} className="hidden lg:block" />

        <div className="flex items-center gap-1">
          <LanguageSwitcher tone={tone} />
          <HeaderUserActions onLogout={handleLogout} tone={tone} />
          {isAuthenticated && (
            <>
              <NotificationBell
                unreadCount={unreadCount}
                onClick={() => setNotifOpen(true)}
                className={tone === "onDark" ? "text-white hover:bg-white/15 hover:text-white" : undefined}
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
          <Button variant="ghost" size="icon" onClick={toggle} aria-label={t("header.toggleTheme")} className={tone === "onDark" ? "text-white hover:bg-white/15 hover:text-white" : undefined}>
            {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" aria-label={t("header.openMenu")} className={tone === "onDark" ? "text-white hover:bg-white/15 hover:text-white lg:hidden" : "lg:hidden"} />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right">
              <HeaderMobileNav onClose={() => setOpen(false)} onLogout={handleLogout} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
