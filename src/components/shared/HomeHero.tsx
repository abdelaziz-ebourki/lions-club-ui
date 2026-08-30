import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HomeHero() {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/[0.03] via-background to-accent/[0.03]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-display text-overline-lg text-accent mb-6 tracking-widest animate-in stagger-1">
            {t("hero.overline")}
          </p>
          <h1 className="font-heading text-display-lg italic text-foreground animate-in stagger-2 whitespace-pre-line">
            {t("hero.title")}
          </h1>
          <p className="mt-6 text-body-lg text-muted-foreground max-w-2xl mx-auto animate-in stagger-3">
            {t("hero.description")}
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-in stagger-4">
            <Link to="/events">
              <Button size="lg">
                {t("hero.cta")} <ArrowRight data-icon="inline-end" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
