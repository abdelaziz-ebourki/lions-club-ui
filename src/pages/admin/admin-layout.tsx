import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Calendar, MessageSquare, Users, Mail, Newspaper, Images, LogOut } from "lucide-react";
import { SEO } from "@/components/shared/SEO";
import { seoConfig } from "@/config/seo";
import { useTranslation } from "react-i18next";

const adminNavKeys = [
  { key: "layout.nav.dashboard", href: "/admin", icon: LayoutDashboard },
  { key: "layout.nav.events", href: "/admin/events", icon: Calendar },
  { key: "layout.nav.news", href: "/admin/news", icon: Newspaper },
  { key: "layout.nav.gallery", href: "/admin/gallery", icon: Images },
  { key: "layout.nav.forum", href: "/admin/forum", icon: MessageSquare },
  { key: "layout.nav.members", href: "/admin/members", icon: Users },
  { key: "layout.nav.messages", href: "/admin/messages", icon: Mail },
] as const;

export function AdminLayout() {
  const location = useLocation();
  const { t } = useTranslation("admin");

  return (
    <>
      <SEO {...seoConfig.admin} />
      <div className="mx-auto flex min-h-[60vh] max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <aside className="hidden w-64 shrink-0 flex-col gap-2 md:flex">
        <div className="mb-6">
          <p className="font-display text-overline text-accent">{t("layout.admin")}</p>
          <h2 className="font-heading text-h4 mt-1 text-foreground">{t("layout.manage")}</h2>
        </div>
        <nav aria-label={t("layout.adminNavigation")} className="flex flex-col gap-1">
          {adminNavKeys.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {t(item.key)}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-3">
              <LogOut className="size-4" />
              {t("layout.backToSite")}
            </Button>
          </Link>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
      </div>
    </>
  );
}
