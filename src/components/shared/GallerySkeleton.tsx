import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function GallerySkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-48 w-full rounded-none" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-40" />
          </div>
        </Card>
      ))}
    </div>
  );
}
