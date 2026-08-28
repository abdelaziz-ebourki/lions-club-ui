import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Calendar, ExternalLink } from "lucide-react";
import { SEO } from "@/components/shared/SEO";
import { seoConfig, getMemberSeo } from "@/config/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ErrorState } from "@/components/shared/ErrorState";
import { useMember } from "@/hooks/useMembersList";

export function MemberDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: member, isLoading, isError, error, refetch } = useMember(id);

  const isNotFound =
    isError &&
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    (error as { status?: number }).status === 404;

  if (isLoading) {
    return (
      <>
        <SEO {...seoConfig.members} />
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Members", href: "/members" }, { label: "Loading..." }]} />
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mx-auto mt-8 h-80 w-80 rounded-full" />
          <Skeleton className="mx-auto mt-6 h-8 w-48" />
          <Skeleton className="mx-auto mt-2 h-4 w-32" />
          <Skeleton className="mt-8 h-32 w-full" />
        </div>
      </>
    );
  }

  if (isNotFound) {
    return (
      <>
        <SEO {...seoConfig.members} />
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Members", href: "/members" }, { label: "Not found" }]} />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="font-heading text-h3">Member not found</h1>
          <p className="mt-2 text-muted-foreground">The member you&apos;re looking for doesn&apos;t exist.</p>
          <Link to="/members" className="mt-6 inline-block">
            <Button>Back to Members</Button>
          </Link>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <SEO {...seoConfig.members} />
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Members", href: "/members" }, { label: "Error" }]} />
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <ErrorState heading="Failed to load member" message="Please try again." onRetry={() => refetch()} />
        </div>
      </>
    );
  }

  if (!member) {
    return (
      <>
        <SEO {...seoConfig.members} />
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Members", href: "/members" }, { label: "Not found" }]} />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="font-heading text-h3">Member not found</h1>
          <p className="mt-2 text-muted-foreground">The member you&apos;re looking for doesn&apos;t exist.</p>
          <Link to="/members" className="mt-6 inline-block">
            <Button>Back to Members</Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO {...getMemberSeo(member)} />
      <Breadcrumbs
        trail={[{ label: "Home", href: "/" }, { label: "Members", href: "/members" }, { label: member.name }]}
      />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link to="/members">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft data-icon="inline-start" /> Back to Members
          </Button>
        </Link>

        <div className="flex flex-col items-center text-center">
          {member.avatar ? (
            <img
              src={member.avatar}
              alt={member.name}
              loading="lazy"
              width={320}
              height={320}
              className="h-80 w-80 rounded-full object-cover shadow-lg"
            />
          ) : (
            <div
              data-testid={`member-detail-avatar-fallback-${member.name}`}
              className="flex h-80 w-80 items-center justify-center rounded-full bg-primary/10 font-heading text-6xl font-bold text-primary shadow-lg"
            >
              {member.name.charAt(0)}
            </div>
          )}
          <h1 className="mt-6 font-heading text-h2">{member.name}</h1>
          <Badge variant="accent" className="mt-2">
            {member.role}
          </Badge>
          <p className="mt-2 flex items-center gap-2 text-body-sm text-muted-foreground">
            <Calendar className="size-4" aria-hidden="true" />
            Joined {new Date(member.joinedAt).toLocaleDateString()}
          </p>
        </div>

        <Separator className="my-8" />

        {member.bio && <p className="text-body text-muted-foreground leading-relaxed">{member.bio}</p>}

        {(member.email || member.phone || member.socials) && (
          <div className="mt-8 space-y-4">
            <h2 className="font-heading text-h4">Contact</h2>
            <div className="flex flex-col gap-3">
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
                >
                  <Mail className="size-4" aria-hidden="true" /> {member.email}
                </a>
              )}
              {member.phone && (
                <a
                  href={`tel:${member.phone}`}
                  className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
                >
                  <Phone className="size-4" aria-hidden="true" /> {member.phone}
                </a>
              )}
              {member.socials && (
                <div className="flex gap-3 pt-2">
                  {member.socials.linkedin && (
                    <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                      <ExternalLink className="size-4" /> LinkedIn
                    </a>
                  )}
                  {member.socials.facebook && (
                    <a href={member.socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                      <ExternalLink className="size-4" /> Facebook
                    </a>
                  )}
                  {member.socials.instagram && (
                    <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                      <ExternalLink className="size-4" /> Instagram
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
