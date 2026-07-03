import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-20 text-center">
      <div role="alert">
        <p className="font-display text-overline text-accent mb-2">
          Error 404
        </p>
        <h1 className="font-heading text-h1 text-foreground">
          Page Not Found
        </h1>
      </div>
      <p className="mt-4 text-body text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8">
        <Link to="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
