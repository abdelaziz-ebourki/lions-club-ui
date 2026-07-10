import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config";

export function HeaderNavLinks() {
  const location = useLocation();

  return (
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
  );
}
