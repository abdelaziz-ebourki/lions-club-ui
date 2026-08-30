import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import type { SearchResult } from "@/types";

export interface SearchResultItemProps {
  result: SearchResult;
}

export function SearchResultItem({ result }: SearchResultItemProps) {
  const { t } = useTranslation("search");
  const entityLabels: Record<string, string> = {
    event: t("entityEvent"),
    forum_thread: t("entityForumThread"),
    member: t("entityMember"),
    contact_message: t("entityContactMessage"),
  };

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
