import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("forum");
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("filterThreadsPlaceholder")}
          value={keywordFilter}
          onChange={(e) => onKeywordChange(e.target.value)}
          className="ps-9"
          aria-label={t("filterByKeyword")}
        />
      </div>
      <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as ForumThreadStatus | "all")}>
        <SelectTrigger className="w-[140px]" aria-label={t("filterByStatus")}>
          <SelectValue placeholder={t("allStatuses")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("allStatuses")}</SelectItem>
          <SelectItem value="active">{t("statusActive")}</SelectItem>
          <SelectItem value="pinned">{t("statusPinned")}</SelectItem>
          <SelectItem value="locked">{t("statusLocked")}</SelectItem>
          <SelectItem value="archived">{t("statusArchived")}</SelectItem>
        </SelectContent>
      </Select>
      <Select value={categoryFilter} onValueChange={(v) => onCategoryChange(v ?? "")}>
        <SelectTrigger className="w-[180px]" aria-label={t("filterByCategory")}>
          <SelectValue placeholder={t("allCategoriesFilter")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("allCategoriesFilter")}</SelectItem>
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
