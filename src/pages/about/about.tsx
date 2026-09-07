import { Card, CardContent } from "@/components/ui/card";
import { SectionDivider } from "@/components/ui/section-divider";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Member } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, Eye, Heart } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SEO } from "@/components/shared/SEO";
import { seoConfig } from "@/config/seo";
import { useTranslation } from "react-i18next";

export function AboutPage() {
  const { t } = useTranslation("about");
  const values = [
    {
      icon: Target,
      title: t("missionTitle"),
      label: t("missionLabel"),
      description: t("missionDescription"),
    },
    {
      icon: Eye,
      title: t("visionTitle"),
      label: t("visionLabel"),
      description: t("visionDescription"),
    },
    {
      icon: Heart,
      title: t("valuesTitle"),
      label: t("valuesLabel"),
      description: t("valuesDescription"),
    },
  ];

  const { data: members, isLoading } = useQuery<Member[]>({
    queryKey: ["members"],
    queryFn: () => api.get("/members"),
  });

  return (
    <>
      <SEO {...seoConfig.about} />
      <Breadcrumbs trail={[{ label: t("breadcrumbsHome"), href: "/" }, { label: t("breadcrumbsAbout") }]} />
      <section className="border-b bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-display text-overline text-accent mb-4">
              {t("overline")}
            </p>
            <h1 className="font-heading text-h1 italic text-foreground">
              {t("heading")}
            </h1>
            <p className="mt-4 text-body-lg text-muted-foreground">
              {t("description")}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {values.map((value) => (
            <Card key={value.title} className="border-0 bg-muted/30 text-center">
              <CardContent className="pt-10">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <value.icon className="size-7" aria-hidden="true" />
                </div>
                <p className="font-display text-overline text-accent mt-6">
                  {value.label}
                </p>
                <h2 className="mt-2 font-heading text-h4">{value.title}</h2>
                <p className="mt-3 text-body-sm text-muted-foreground">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <SectionDivider />

      <section className="border-y bg-muted/50">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="font-display text-overline text-accent">
              {t("storyOverline")}
            </p>
            <h2 className="font-heading text-h2 mt-1 text-foreground">
              {t("storyHeading")}
            </h2>
          </div>
          <div className="mt-8 flex flex-col gap-5 text-body-lg text-muted-foreground leading-relaxed">
            <p className="first-letter:text-4xl first-letter:font-heading first-letter:text-accent first-letter:float-start first-letter:me-2 first-letter:mt-1">
              {t("storyP1")}
            </p>
            <p>
              {t("storyP2")}
            </p>
            <p>
              {t("storyP3")}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="font-display text-overline text-accent">
            {t("leadershipOverline")}
          </p>
          <h2 className="font-heading text-h2 mt-1 text-foreground">
            {t("leadershipHeading")}
          </h2>
          <p className="mt-2 text-body text-muted-foreground">
            {t("leadershipDescription")}
          </p>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-8">
                    <Skeleton className="mx-auto h-20 w-20 rounded-full" />
                    <Skeleton className="mx-auto mt-4 h-5 w-32" />
                    <Skeleton className="mx-auto mt-2 h-4 w-24" />
                  </CardContent>
                </Card>
              ))
            : members?.map((member) => (
                <Card key={member.id} className="flex h-full flex-col text-center transition-all hover:shadow-md">
                  <CardContent className="pt-8">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="mx-auto h-20 w-20 rounded-full object-cover"
                        loading="lazy"
                        width={80}
                        height={80}
                      />
                    ) : (
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-heading font-bold text-primary">
                        {member.name.charAt(0)}
                      </div>
                    )}
                    <h3 className="mt-4 font-heading text-lg font-bold">
                      {member.name}
                    </h3>
                    <p className="font-display text-overline text-sm tracking-widest text-accent">
                      {member.role}
                    </p>
                    {member.bio && (
                      <p className="mt-3 text-body-sm text-muted-foreground">
                        {member.bio}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
        </div>
      </section>
    </>
  );
}
