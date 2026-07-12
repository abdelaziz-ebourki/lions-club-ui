import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ForumCategory } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MessageSquare,
  Calendar,
  Users,
  Lightbulb,
  ChevronRight,
  FolderOpen,
} from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHero } from "@/components/shared/PageHero";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ErrorState } from "@/components/shared/ErrorState";

const iconMap: Record<string, typeof MessageSquare> = {
  MessageSquare,
  Calendar,
  Users,
  Lightbulb,
};

export function ForumPage() {
  const { data: categories, isLoading, isError, refetch } = useQuery<ForumCategory[]>({
    queryKey: ["forum-categories"],
    queryFn: () => api.get("/forum/categories"),
  });

  return (
    <>
      <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Forum" }]} />
      <PageHero
        overline="Conversations"
        heading="Community Conversations"
        description="Connect, discuss, and share with fellow members"
      />

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {isError ? (
          <ErrorState
            heading="Failed to load categories"
            message="Something went wrong while loading categories. Please try again."
            onRetry={refetch}
          />
        ) : isLoading ? (
          <div className="flex flex-col gap-4" aria-busy="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="mt-1 h-4 w-72" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : categories?.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="No categories yet"
            description="Forum categories will appear here once created by an administrator."
          />
        ) : (
          <div className="flex flex-col gap-4">
            {categories?.map((category) => {
              const Icon = iconMap[category.icon] ?? MessageSquare;
              return (
                <Link key={category.id} to={`/forum/${category.id}`}>
                  <Card className="transition-all hover:border-accent/50 hover:shadow-md">
                    <CardContent className="flex items-center gap-4 py-5">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <Icon className="size-6" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="font-heading text-lg">
                          {category.name}
                        </CardTitle>
                        <CardDescription className="mt-0.5 text-body-sm">
                          {category.description}
                        </CardDescription>
                      </div>
                      <div className="text-right text-body-sm text-muted-foreground shrink-0">
                        <p>{category.threadCount} threads</p>
                        <p>{category.postCount} posts</p>
                      </div>
                      <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
