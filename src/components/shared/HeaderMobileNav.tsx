import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth";
import { SearchBar } from "@/components/search/search-bar";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

interface HeaderMobileNavProps {
  onClose: () => void;
  onLogout: () => void;
}

export function HeaderMobileNav({ onClose, onLogout }: HeaderMobileNavProps) {
  const location = useLocation();
  const { t } = useTranslation();
  const { isAuthenticated, isAdmin } = useAuth();

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/events", label: t("nav.events") },
    { href: "/news", label: t("nav.news") },
    { href: "/forum", label: t("nav.forum") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{t("language.select")}</span>
        <LanguageSwitcher />
      </div>
      <div className="mt-4">
        <SearchBar className="md:hidden" />
      </div>
      <nav aria-label={t("header.mobileNavigation")} className="mt-4 flex flex-col gap-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            aria-current={location.pathname === item.href ? "page" : undefined}
            onClick={onClose}
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
              {t("nav.admin")}
            </p>
            <Link
              to="/admin"
              aria-current={location.pathname === "/admin" ? "page" : undefined}
              onClick={onClose}
              className={cn(
                "text-lg font-medium transition-colors hover:text-primary",
                location.pathname === "/admin"
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {t("admin.dashboard")}
            </Link>
            <Link
              to="/admin/events"
              aria-current={location.pathname === "/admin/events" ? "page" : undefined}
              onClick={onClose}
              className={cn(
                "text-lg font-medium transition-colors hover:text-primary",
                location.pathname === "/admin/events"
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {t("admin.events")}
            </Link>
            <Link
              to="/admin/news"
              aria-current={location.pathname === "/admin/news" ? "page" : undefined}
              onClick={onClose}
              className={cn(
                "text-lg font-medium transition-colors hover:text-primary",
                location.pathname === "/admin/news"
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {t("admin.news")}
            </Link>
            <Link
              to="/admin/gallery"
              aria-current={location.pathname === "/admin/gallery" ? "page" : undefined}
              onClick={onClose}
              className={cn(
                "text-lg font-medium transition-colors hover:text-primary",
                location.pathname === "/admin/gallery"
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {t("admin.gallery")}
            </Link>
            <Link
              to="/admin/forum"
              aria-current={location.pathname === "/admin/forum" ? "page" : undefined}
              onClick={onClose}
              className={cn(
                "text-lg font-medium transition-colors hover:text-primary",
                location.pathname === "/admin/forum"
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {t("admin.forum")}
            </Link>
            <Link
              to="/admin/members"
              aria-current={location.pathname === "/admin/members" ? "page" : undefined}
              onClick={onClose}
              className={cn(
                "text-lg font-medium transition-colors hover:text-primary",
                location.pathname === "/admin/members"
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {t("admin.members")}
            </Link>
            <Link
              to="/admin/messages"
              aria-current={location.pathname === "/admin/messages" ? "page" : undefined}
              onClick={onClose}
              className={cn(
                "text-lg font-medium transition-colors hover:text-primary",
                location.pathname === "/admin/messages"
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {t("admin.messages")}
            </Link>
          </>
        )}
        {isAuthenticated && (
          <>
            <div className="border-t pt-4 mt-2" />
            <Link
              to="/profile"
              onClick={onClose}
              className="text-lg font-medium transition-colors hover:text-primary"
            >
              {t("header.profile")}
            </Link>
            <button
              onClick={onLogout}
              className="w-full text-left text-lg font-medium text-destructive transition-colors hover:text-destructive"
            >
              {t("header.signOut")}
            </button>
          </>
        )}
      </nav>
    </>
  );
}
