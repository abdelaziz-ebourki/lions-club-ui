import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import type { ForumCategory, ForumThreadStatus } from "@/types";

interface ThreadFiltersProps {
  keywordFilter: string;
  onKeywordChange: (value: string) => void;
  statusFilter: ForumThreadStatus | "all";
  onStatusChange: (value: ForumThreadStatus | "all") => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  categories: ForumCategory[] | undefined;
}

export function ThreadFilters({
  keywordFilter,
  onKeywordChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  categories,
}: ThreadFiltersProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Filter threads..."
          value={keywordFilter}
          onChange={(e) => onKeywordChange(e.target.value)}
          className="pl-9"
          aria-label="Filter by keyword"
        />
      </div>
      <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as ForumThreadStatus | "all")}>
        <SelectTrigger className="w-[140px]" aria-label="Filter by status">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="pinned">Pinned</SelectItem>
          <SelectItem value="locked">Locked</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>
      <Select value={categoryFilter} onValueChange={(v) => onCategoryChange(v ?? "")}>
        <SelectTrigger className="w-[180px]" aria-label="Filter by category">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {categories?.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
