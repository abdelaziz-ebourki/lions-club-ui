import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { BreadcrumbSegment } from "@/types";

interface BreadcrumbsProps {
  trail: BreadcrumbSegment[];
}

export function Breadcrumbs({ trail }: BreadcrumbsProps) {
  if (trail.length === 0) return null;

  return (
    <Breadcrumb className="mb-6 px-4 sm:px-6 lg:px-8">
      <BreadcrumbList>
        {trail.map((segment, index) => {
          const isLast = index === trail.length - 1;

          return (
            <BreadcrumbItem key={segment.label + index}>
              {isLast ? (
                <BreadcrumbPage>{segment.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={segment.href ?? "#"}>
                  {segment.label}
                </BreadcrumbLink>
              )}
              {!isLast && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
