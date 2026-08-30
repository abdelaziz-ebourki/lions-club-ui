import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export function HeaderNavLinks() {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/events", label: t("nav.events") },
    { href: "/news", label: t("nav.news") },
    { href: "/forum", label: t("nav.forum") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <nav aria-label={t("header.mainNavigation", { defaultValue: "Main navigation" })} className="hidden md:flex md:items-center md:gap-1">
      {navItems.map((item) => (
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
  );
}
