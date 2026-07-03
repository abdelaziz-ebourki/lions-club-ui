import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchX } from "lucide-react";
import type { SearchResultGroup } from "@/types";
import { SearchResultItem } from "./search-result-item";

export interface SearchResultsProps {
  groups: SearchResultGroup[];
  totalCount: number;
  isSearching?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function SearchResults({ groups, totalCount, isSearching, error, onRetry }: SearchResultsProps) {
  if (error) {
    return (
      <div className="py-16 text-center">
        <h2 className="font-heading text-h4 text-destructive">Something went wrong</h2>
        <p className="mt-2 text-muted-foreground">{error}</p>
        {onRetry && (
          <Button onClick={onRetry} className="mt-6">
            Try Again
          </Button>
        )}
      </div>
    );
  }

  if (isSearching) {
    return (
      <div className="flex flex-col gap-4" role="status" aria-label="Loading search results">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-lg border p-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No results found"
        description="Try different keywords or browse the site manually."
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <p className="font-body text-sm text-muted-foreground">
        Found {totalCount} result{totalCount !== 1 ? "s" : ""}
      </p>
      {groups.map((group) => (
        <section key={group.entityType}>
          <h2 className="font-heading text-h5 mb-4">{group.label}</h2>
          <div className="flex flex-col gap-3">
            {group.results.map((result) => (
              <SearchResultItem key={`${result.entityType}-${result.id}`} result={result} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
