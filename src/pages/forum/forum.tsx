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
} from "lucide-react";

const iconMap: Record<string, typeof MessageSquare> = {
  MessageSquare,
  Calendar,
  Users,
  Lightbulb,
};

export function ForumPage() {
  const { data: categories, isLoading } = useQuery<ForumCategory[]>({
    queryKey: ["forum-categories"],
    queryFn: () => api.get("/forum/categories"),
  });

  return (
    <>
      <section className="border-b bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-display text-overline text-accent mb-4">
              Conversations
            </p>
            <h1 className="font-heading text-h1 text-foreground">
              Community Conversations
            </h1>
            <p className="mt-4 text-body-lg text-muted-foreground">
              Connect, discuss, and share with fellow members
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="mt-1 h-4 w-72" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {categories?.map((category) => {
              const Icon = iconMap[category.icon] ?? MessageSquare;
              return (
                <Link key={category.id} to={`/forum/${category.id}`}>
                  <Card className="transition-all hover:border-accent/50 hover:shadow-md">
                    <CardContent className="flex items-center gap-4 py-5">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <Icon className="size-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="font-heading text-lg">
                          {category.name}
                        </CardTitle>
                        <CardDescription className="mt-0.5 text-body-sm">
                          {category.description}
                        </CardDescription>
                      </div>
                      <div className="hidden text-right text-body-sm text-muted-foreground sm:block">
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
