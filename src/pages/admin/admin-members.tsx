import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import type { Member } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";

export function AdminMembersPage() {
  const { data: members, isLoading } = useQuery<Member[]>({
    queryKey: ["members", "admin"],
    queryFn: () => api.get("/members"),
  });

  if (isLoading) {
    return (
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="font-display text-overline text-accent">Members</p>
            <h1 className="font-heading text-h2 mt-1 text-foreground">Manage Members</h1>
          </div>
        </div>
        <div className="rounded-lg border" aria-busy="true">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-display text-overline text-xs">Name</TableHead>
                <TableHead className="font-display text-overline text-xs hidden md:table-cell">Role</TableHead>
                <TableHead className="font-display text-overline text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-16" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (members?.length === 0) {
    return (
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="font-display text-overline text-accent">Members</p>
            <h1 className="font-heading text-h2 mt-1 text-foreground">Manage Members</h1>
          </div>
          <Link to="/admin/members/new">
            <Button>
              <Plus data-icon="inline-start" /> Add Member
            </Button>
          </Link>
        </div>
        <EmptyState
          icon={Users}
          title="No members yet"
          description="Add your first club member."
          action={
            <Link to="/admin/members/new">
              <Button>Add your first member</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="font-display text-overline text-accent">Members</p>
          <h1 className="font-heading text-h2 mt-1 text-foreground">Manage Members</h1>
        </div>
        <Link to="/admin/members/new">
          <Button>
            <Plus data-icon="inline-start" /> Add Member
          </Button>
        </Link>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
          <TableHead className="font-display text-overline text-xs">Name</TableHead>
          <TableHead className="font-display text-overline text-xs hidden md:table-cell">Role</TableHead>
          <TableHead className="font-display text-overline text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members?.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-body font-medium">{member.name}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="accent" className="text-[10px]">{member.role}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link to={`/admin/members/${member.id}/edit`}>
                    <Button variant="ghost" size="icon" className="size-8">
                      <Pencil className="size-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
