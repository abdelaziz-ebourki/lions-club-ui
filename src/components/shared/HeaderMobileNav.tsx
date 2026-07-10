import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config";
import { useAuth } from "@/contexts/auth";
import { SearchBar } from "@/components/search/search-bar";

interface HeaderMobileNavProps {
  onClose: () => void;
  onLogout: () => void;
}

export function HeaderMobileNav({ onClose, onLogout }: HeaderMobileNavProps) {
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <>
      <div className="mt-8">
        <SearchBar className="md:hidden" />
      </div>
      <nav aria-label="Mobile navigation" className="mt-4 flex flex-col gap-4">
        {siteConfig.nav.map((item) => (
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
              Admin
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
              Dashboard
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
              Events
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
              Forum
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
              Members
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
              Messages
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
              Profile
            </Link>
            <button
              onClick={onLogout}
              className="w-full text-left text-lg font-medium text-destructive transition-colors hover:text-destructive"
            >
              Sign Out
            </button>
          </>
        )}
      </nav>
    </>
  );
}
