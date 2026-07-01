import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SearchResult } from "@/types";

export interface SearchResultItemProps {
  result: SearchResult;
}

const entityLabels: Record<string, string> = {
  event: "Event",
  forum_thread: "Forum Thread",
  member: "Member",
  contact_message: "Contact Message",
};

export function SearchResultItem({ result }: SearchResultItemProps) {
  return (
    <Link to={result.url}>
      <Card className="transition-all hover:shadow-md">
        <CardContent className="py-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading text-lg font-medium">{result.title}</h3>
            <Badge variant="secondary" className="shrink-0">
              {entityLabels[result.entityType] ?? result.entityType}
            </Badge>
          </div>
          <p className="mt-1 text-body-sm text-muted-foreground">{result.snippet}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
