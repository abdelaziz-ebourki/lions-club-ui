import { useCallback, useEffect, useRef, useState, type FocusEvent } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 7000;

interface HeroSlide {
  image: string;
  to: string;
}

const SLIDES: HeroSlide[] = [
  { image: "/seed/blood-drive-1.jpg", to: "/about" },
  { image: "/seed/ain-chock-1.jpg", to: "/events" },
  { image: "/seed/school-1.jpg", to: "/contact" },
];

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function HomeHero() {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const goTo = useCallback((next: number) => {
    setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const autoplayOff = paused || userPaused || reducedMotion;

  useEffect(() => {
    if (autoplayOff) {
      return;
    }
    timer.current = setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [autoplayOff, index]);

  const handleFocus = (e: FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setPaused(true);
    }
  };

  const handleBlur = (e: FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setPaused(false);
    }
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t("hero.overline")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className="relative min-h-svh overflow-hidden bg-background"
    >
      {SLIDES.map((slide, slideIndex) => {
        const active = slideIndex === index;
        const headingClassName = "font-heading text-display-lg italic text-white whitespace-pre-line";
        return (
          <div
            key={slide.to}
            role="group"
            aria-roledescription="slide"
            aria-label={`${slideIndex + 1} of ${SLIDES.length}`}
            aria-hidden={!active}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              active ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            <img
              src={slide.image}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
              loading={slideIndex === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/25" />
            <div className="relative mx-auto flex min-h-svh max-w-7xl flex-col justify-end px-4 pb-28 pt-32 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <p className="font-display text-overline-lg mb-6 tracking-widest text-amber-200">
                  {t(`hero.slides.${slideIndex}.overline`)}
                </p>
                {active ? (
                  <h1 className={headingClassName}>
                    {t(`hero.slides.${slideIndex}.title`)}
                  </h1>
                ) : (
                  <p className={headingClassName} aria-hidden="true">
                    {t(`hero.slides.${slideIndex}.title`)}
                  </p>
                )}
                <p className="mt-6 max-w-2xl text-body-lg text-white/85">
                  {t(`hero.slides.${slideIndex}.description`)}
                </p>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Link to={slide.to} tabIndex={active ? undefined : -1}>
                    <Button size="lg">
                      {t(`hero.slides.${slideIndex}.cta`)} <ArrowRight data-icon="inline-end" className="rtl:rotate-180" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="absolute inset-x-0 bottom-8 z-10 mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2" role="group" aria-label={t("hero.slideSelector")}>
          {SLIDES.map((slide, slideIndex) => (
            <button
              key={slide.to}
              type="button"
              onClick={() => goTo(slideIndex)}
              aria-label={t("hero.goToSlide", { index: slideIndex + 1 })}
              aria-current={slideIndex === index}
              className={cn(
                "h-2 rounded-full transition-all",
                slideIndex === index ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
              )}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setUserPaused((value) => !value)}
            aria-label={t(autoplayOff ? "hero.playAutoplay" : "hero.pauseAutoplay")}
            aria-pressed={autoplayOff}
            className="text-white hover:bg-white/15 hover:text-white"
          >
            {autoplayOff ? <Play /> : <Pause />}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => goTo(index - 1)}
            aria-label={t("hero.prevSlide")}
            className="text-white hover:bg-white/15 hover:text-white"
          >
            <ArrowLeft className="rtl:rotate-180" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => goTo(index + 1)}
            aria-label={t("hero.nextSlide")}
            className="text-white hover:bg-white/15 hover:text-white"
          >
            <ArrowRight className="rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </section>
  );
}
