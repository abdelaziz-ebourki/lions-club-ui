import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Member } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, Eye, Heart } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To empower volunteers to serve their communities, meet humanitarian needs, encourage peace, and promote international understanding.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "To be the leading service organization in Casablanca, creating lasting positive change through community-driven initiatives.",
  },
  {
    icon: Heart,
    title: "Our Values",
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
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4 border-accent text-accent">
              About Us
            </Badge>
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
              Who We Are
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {values.map((value) => (
            <Card key={value.title} className="border-0 bg-muted/30 text-center">
              <CardContent className="pt-8">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <value.icon className="size-7" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-heading text-xl font-bold">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-balance">
              Our History
            </h2>
            <div className="mt-6 flex flex-col gap-4 text-left text-muted-foreground tabular-nums">
              <p>
                Founded in 2015, Lions Club FSBM has been at the forefront of
                community service in the greater Casablanca area. What started
                as a small group of passionate individuals has grown into a
                vibrant organization of over 50 dedicated members.
              </p>
              <p>
                Over the years, we&apos;ve organized countless service projects,
                from health screenings and environmental clean-ups to youth
                empowerment programs and cultural events. Our commitment to
                service has earned us recognition from Lions Clubs
                International and the respect of our local community.
              </p>
              <p>
                Today, we continue to grow and evolve, always guided by our
                motto: &ldquo;We Serve.&rdquo; We welcome anyone who shares our passion
                for making a difference to join us in our mission.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-center">
          Meet Our Team
        </h2>
        <p className="mt-2 text-center text-muted-foreground">
          The dedicated members leading our club
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <Skeleton className="mx-auto h-20 w-20 rounded-full" />
                    <Skeleton className="mx-auto mt-4 h-5 w-32" />
                    <Skeleton className="mx-auto mt-2 h-4 w-24" />
                  </CardContent>
                </Card>
              ))
            : members?.map((member) => (
                <Card key={member.id} className="text-center transition-all hover:shadow-md">
                  <CardContent className="pt-6">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                      {member.name.charAt(0)}
                    </div>
                    <h3 className="mt-4 font-heading text-lg font-bold">
                      {member.name}
                    </h3>
                    <p className="text-sm text-accent">{member.role}</p>
                    {member.bio && (
                      <p className="mt-2 text-xs text-muted-foreground">
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
