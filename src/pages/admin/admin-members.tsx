import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import type { Member } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil } from "lucide-react";

export function AdminMembersPage() {
  const { data: members } = useQuery<Member[]>({
    queryKey: ["members", "admin"],
    queryFn: () => api.get("/members"),
  });

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
