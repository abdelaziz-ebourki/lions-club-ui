import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { SEO } from "@/components/shared/SEO";
import { seoConfig } from "@/config/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PageHero } from "@/components/shared/PageHero";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/ErrorState";
import { MemberSkeleton } from "@/components/shared/MemberSkeleton";
import { useMembersList } from "@/hooks/useMembersList";

export function MembersPage() {
  const { data: members, isLoading, isError, refetch } = useMembersList();

  if (isLoading) {
    return (
      <>
        <SEO {...seoConfig.members} />
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Members" }]} />
        <PageHero
          overline="Community"
          heading="Our Members"
          description="Meet the dedicated members who drive our community service initiatives in Casablanca."
        />
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <MemberSkeleton />
        </section>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <SEO {...seoConfig.members} />
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Members" }]} />
        <PageHero
          overline="Community"
          heading="Our Members"
          description="Meet the dedicated members who drive our community service initiatives in Casablanca."
        />
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <ErrorState
            heading="Something went wrong"
            message="Failed to load members."
            onRetry={() => refetch()}
          />
        </section>
      </>
    );
  }

  if (!members || members.length === 0) {
    return (
      <>
        <SEO {...seoConfig.members} />
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Members" }]} />
        <PageHero
          overline="Community"
          heading="Our Members"
          description="Meet the dedicated members who drive our community service initiatives in Casablanca."
        />
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <EmptyState
            icon={Users}
            title="No members yet"
            description="No members have been added yet. Check back soon to meet our community."
          />
        </section>
      </>
    );
  }

  return (
    <>
      <SEO {...seoConfig.members} />
      <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Members" }]} />
      <PageHero
        overline="Community"
        heading="Our Members"
        description="Meet the dedicated members who drive our community service initiatives in Casablanca."
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <Link
              key={member.id}
              to={`/members/${member.id}`}
              aria-label={`View profile of ${member.name}`}
              className="group"
            >
              <Card className="text-center transition-all hover:shadow-md">
                <CardContent className="pt-8">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      loading="lazy"
                      width={80}
                      height={80}
                      className="mx-auto h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      data-testid={`member-avatar-fallback-${member.name}`}
                      className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 font-heading text-xl font-bold text-primary"
                    >
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <h2 data-testid="member-card-name" className="mt-4 font-heading text-lg font-bold">
                    {member.name}
                  </h2>
                  <p className="font-display text-overline text-sm tracking-widest text-accent">{member.role}</p>
                  {member.bio && (
                    <p className="mt-3 text-body-sm text-muted-foreground line-clamp-2">{member.bio}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
