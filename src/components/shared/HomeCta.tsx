import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function HomeCta() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="font-display text-overline-lg tracking-widest text-primary-foreground/60">
          Get Involved
        </p>
        <h2 className="font-heading text-h1 mt-2 text-primary-foreground">
          Ready to Serve?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-body-lg text-primary-foreground/80">
          Every project starts with one person showing up. 
          Whether you can give two hours or two years, 
          there's a place for you here.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link to="/contact">
            <Button variant="secondary" size="lg">
              Start Volunteering
            </Button>
          </Link>
          <Link to="/about">
            <Button
              variant="outline"
              size="lg"
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
