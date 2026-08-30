import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

export function PageSkeleton() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="sr-only">{t("loading")}</h1>
      <Skeleton className="mx-auto h-8 w-48" />
      <Skeleton className="mx-auto mt-4 h-4 w-72" />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    </div>
  );
}
