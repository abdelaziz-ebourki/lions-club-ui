import type { ReactNode } from "react";
import { Table, TableBody, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminTableProps {
  headers: ReactNode;
  children?: ReactNode;
  loading?: boolean;
  skeletonColumns?: number;
  skeletonRows?: number;
}

export function AdminTable({ headers, children, loading, skeletonColumns = 5, skeletonRows = 4 }: AdminTableProps) {
  if (loading) {
    return (
      <div className="rounded-lg border" aria-busy="true">
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
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
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
    </div>
  );
}
