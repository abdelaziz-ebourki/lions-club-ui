import { Card, CardContent } from "@/components/ui/card";
import { SectionDivider } from "@/components/ui/section-divider";
import { siteConfig } from "@/config";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Member } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, Eye, Heart } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

const values = [
  {
    icon: Target,
    title: "Our Mission",
    label: "MISSION",
    description:
      "To empower volunteers to serve their communities, meet humanitarian needs, encourage peace, and promote international understanding.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    label: "VISION",
    description:
      "To be the leading service organization in Casablanca, creating lasting positive change through community-driven initiatives.",
  },
  {
    icon: Heart,
    title: "Our Values",
    label: "VALUES",
    description:
      "Integrity, compassion, service, diversity, and leadership guide everything we do as we work to make our community better.",
  },
];

export function AboutPage() {
  const { data: members, isLoading } = useQuery<Member[]>({
    queryKey: ["members"],
    queryFn: () => api.get("/members"),
  });

  return (
    <>
      <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "About" }]} />
      <section className="border-b bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-display text-overline text-accent mb-4">
              About Us
            </p>
            <h1 className="font-heading text-h1 italic text-foreground">
              A century of service. One community.
            </h1>
            <p className="mt-4 text-body-lg text-muted-foreground">
              {siteConfig.description}
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
                <h3 className="mt-2 font-heading text-h4">{value.title}</h3>
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
              Why We're Here
            </p>
            <h2 className="font-heading text-h2 mt-1 text-foreground">
              Our Story
            </h2>
          </div>
          <div className="mt-8 flex flex-col gap-5 text-body-lg text-muted-foreground leading-relaxed">
            <p className="first-letter:text-4xl first-letter:font-heading first-letter:text-accent first-letter:float-left first-letter:mr-2 first-letter:mt-1">
              Founded in 2015, Lions Club FSBM started with a simple idea: 
              the people of Casablanca already had what they needed to solve 
              their own problems — they just needed to organize. A dozen 
              neighbors in a living room became fifty members in a year.
            </p>
            <p>
              Since then, we've organized health screenings that reached 
              hundreds of families, cleaned up neighborhoods across the 
              city, mentored young people exploring their first careers, 
              and built partnerships with local organizations that multiply 
              every hour of service. None of this required a large budget — 
              just people who showed up.
            </p>
            <p>
              Lions Clubs International has recognized our work, but the 
              real measure is simpler: a cleaner street, a healthier child, 
              a neighbor who found help when they needed it. That's what 
              keeps us going. And that's what we'll keep doing, for as 
              long as Casablanca needs us.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="font-display text-overline text-accent">
            Leadership
          </p>
          <h2 className="font-heading text-h2 mt-1 text-foreground">
            People You'll Serve With
          </h2>
          <p className="mt-2 text-body text-muted-foreground">
            The members leading our projects
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
                <Card key={member.id} className="text-center transition-all hover:shadow-md">
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
