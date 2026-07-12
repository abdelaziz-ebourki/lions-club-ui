import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ForumCategory } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export function AdminForumPage() {
  const { data: categories, isLoading } = useQuery<ForumCategory[]>({
    queryKey: ["forum-categories", "admin"],
    queryFn: () => api.get("/forum/categories"),
  });

  return (
    <div>
      <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "Forum" }]} />
      <div className="mb-8">
        <p className="font-display text-overline text-accent">Forum</p>
        <h1 className="font-heading text-h2 mt-1 text-foreground">Manage Forum</h1>
        <p className="text-body text-muted-foreground mt-1">
          View and moderate forum categories and discussions.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="mt-1 h-4 w-72" />
              </CardHeader>
            </Card>
          ))
        ) : (
          categories?.map((category) => (
            <Card key={category.id}>
              <CardContent className="flex items-center gap-4 py-5">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <MessageSquare className="size-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="font-heading text-lg">{category.name}</CardTitle>
                  <CardDescription className="text-body-sm mt-0.5">
                    {category.description}
                  </CardDescription>
                </div>
                <div className="text-right text-body-sm text-muted-foreground">
                  <p>{category.threadCount} threads</p>
                  <p>{category.postCount} posts</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
