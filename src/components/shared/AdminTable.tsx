import type { ReactNode } from "react";
import { Table, TableBody, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminTableProps {
  headers: ReactNode;
  children?: ReactNode;
  mobileView?: ReactNode;
  loading?: boolean;
  skeletonColumns?: number;
  skeletonRows?: number;
}

export function AdminTable({ headers, children, mobileView, loading, skeletonColumns = 5, skeletonRows = 4 }: AdminTableProps) {
  const tableContent = loading ? (
    <Table>
      <TableHeader>
        <TableRow>
          {headers}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: skeletonRows }).map((_, i) => (
          <TableRow key={`skeleton-${i}`}>
            {Array.from({ length: skeletonColumns }).map((_, j) => (
              <TableCell key={`col-${j}`}>
                <Skeleton className="h-4 w-4/5" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <Table>
      <TableHeader>
        <TableRow>
          {headers}
        </TableRow>
      </TableHeader>
      <TableBody>
        {children}
      </TableBody>
    </Table>
  );

  return (
    <div className="rounded-lg border">
      <div className={mobileView ? "hidden sm:block" : ""}>
        {tableContent}
      </div>
      {mobileView && (
        <div className="block sm:hidden">
          {mobileView}
        </div>
      )}
    </div>
  );
}
