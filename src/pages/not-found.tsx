import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <section className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
      <h1 className="font-heading text-6xl font-bold text-primary">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Page not found. The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="mt-6 inline-block">
        <Button>Go Home</Button>
      </Link>
    </section>
  );
}
