import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";
import { cn } from "@/lib/utils";

interface HeaderUserActionsProps {
  onLogout: () => void;
  tone?: "onDark" | "onLight";
}

export function HeaderUserActions({ onLogout, tone = "onLight" }: HeaderUserActionsProps) {
  const { isAuthenticated, isAdmin } = useAuth();
  const linkTone = tone === "onDark"
    ? "text-white/75 hover:text-white"
    : "text-muted-foreground hover:text-foreground";

  return (
    <>
      {isAuthenticated ? (
        <>
          <Link
            to="/profile"
            className={cn("hidden text-sm font-medium transition-colors sm:inline-block", linkTone)}
          >
            Profile
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className={cn("hidden text-sm font-medium transition-colors sm:inline-block", linkTone)}
            >
              Admin
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className={cn(
              "hidden sm:inline-flex",
              tone === "onDark" && "text-white hover:bg-white/15 hover:text-white"
            )}
          >
            Sign Out
          </Button>
        </>
      ) : (
        <Link
          to="/login"
          className={cn("hidden text-sm font-medium transition-colors sm:inline-block", linkTone)}
        >
          Sign In
        </Link>
      )}
    </>
  );
}
