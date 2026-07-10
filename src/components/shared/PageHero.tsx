import type { ReactNode } from "react";

interface PageHeroProps {
  overline: string;
  heading: string;
  description: string | ReactNode;
}

export function PageHero({ overline, heading, description }: PageHeroProps) {
  return (
    <section className="border-b bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-display text-overline text-accent mb-4">
            {overline}
          </p>
          <h1 className="font-heading text-h1 text-foreground">
            {heading}
          </h1>
          <p className="mt-4 text-body-lg text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
