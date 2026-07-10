import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";

interface HeaderUserActionsProps {
  onLogout: () => void;
}

export function HeaderUserActions({ onLogout }: HeaderUserActionsProps) {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <>
          <Link
            to="/profile"
            className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-primary sm:inline-block"
          >
            Profile
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-primary sm:inline-block"
            >
              Admin
            </Link>
          )}
          <Button variant="ghost" size="sm" onClick={onLogout} className="hidden sm:inline-flex">
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
    </>
  );
}
