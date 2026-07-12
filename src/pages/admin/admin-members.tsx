import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import type { Member } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TableCell, TableRow, TableHead } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Users } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { AdminPageHeader } from "@/components/shared/AdminPageHeader";
import { AdminTable } from "@/components/shared/AdminTable";

export function AdminMembersPage() {
  const { data: members, isLoading } = useQuery<Member[]>({
    queryKey: ["members", "admin"],
    queryFn: () => api.get("/members"),
  });

  const headers = (
    <>
      <TableHead className="font-display text-overline text-xs">Name</TableHead>
      <TableHead className="font-display text-overline text-xs hidden md:table-cell">Role</TableHead>
      <TableHead className="font-display text-overline text-xs text-right">Actions</TableHead>
    </>
  );

  if (isLoading) {
    return (
      <div>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "Members" }]} />
        <AdminPageHeader overline="Members" heading="Manage Members" />
        <AdminTable headers={headers} loading skeletonColumns={3} />
      </div>
    );
  }

  if (members?.length === 0) {
    return (
      <div>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "Members" }]} />
        <AdminPageHeader overline="Members" heading="Manage Members" action={{ to: "/admin/members/new", label: "Add Member" }} />
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
      <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "Members" }]} />
      <AdminPageHeader overline="Members" heading="Manage Members" action={{ to: "/admin/members/new", label: "Add Member" }} />
      <AdminTable
        headers={headers}
        mobileView={members?.map((member) => (
          <Card key={member.id} className="mb-3">
            <CardContent className="flex items-center justify-between py-4">
              <div className="space-y-1">
                <p className="font-body font-medium">{member.name}</p>
                <Badge variant="accent" className="text-[10px]">{member.role}</Badge>
              </div>
              <Link to={`/admin/members/${member.id}/edit`}>
                <Button variant="ghost" size="icon" className="size-8">
                  <Pencil className="size-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      >
        {members?.map((member) => (
          <TableRow key={member.id}>
            <TableCell className="font-body font-medium">{member.name}</TableCell>
            <TableCell>
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
      </AdminTable>
    </div>
  );
}
