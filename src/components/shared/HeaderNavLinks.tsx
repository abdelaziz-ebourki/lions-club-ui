import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export function HeaderNavLinks({ tone = "onLight" }: { tone?: "onDark" | "onLight" }) {
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
      {navItems.map((item) => {
        const active = location.pathname === item.href;
        return (
          <Link
            key={item.href}
            to={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative px-3 py-2 text-sm font-medium transition-colors",
              tone === "onDark"
                ? active ? "text-white" : "text-white/75 hover:text-white"
                : active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
            <span
              data-testid="nav-indicator"
              aria-hidden="true"
              className={cn(
                "absolute inset-x-3 -bottom-0.5 h-0.5 origin-center rounded-full bg-current transition-transform duration-300",
                active ? "scale-x-100" : "scale-x-0"
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}
