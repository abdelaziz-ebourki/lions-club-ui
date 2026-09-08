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
    <nav aria-label={t("header.mainNavigation", { defaultValue: "Main navigation" })} className="hidden lg:flex lg:items-center lg:gap-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          aria-current={location.pathname === item.href ? "page" : undefined}
          className={cn(
            "px-3 py-2 text-sm font-medium transition-colors hover:text-white",
            location.pathname === item.href
              ? "text-white underline underline-offset-4"
              : "text-white/75"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
