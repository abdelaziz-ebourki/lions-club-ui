import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Member } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { MemberForm } from "./member-form";

export function AdminMembersPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") ?? "";
  const roleFilter = searchParams.get("role") ?? "all";

  const { data: members, isLoading } = useQuery<Member[]>({
    queryKey: ["members", searchQuery, roleFilter],
    queryFn: () => {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (roleFilter !== "all") params.set("role", roleFilter);
      return api.get(`/members?${params.toString()}`);
    },
  });

  function setSearchQuery(query: string) {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("search", query);
    } else {
      params.delete("search");
    }
    setSearchParams(params);
  }

  function setRoleFilter(role: string) {
    const params = new URLSearchParams(searchParams);
    if (role === "all") {
      params.delete("role");
    } else {
      params.set("role", role);
    }
    setSearchParams(params);
  }

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/members/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success("Member deleted");
    },
    onError: () => toast.error("Failed to delete member"),
  });

  function handleEdit(member: Member) {
    setEditing(member);
    setOpen(true);
  }

  const roles = ["all", "admin", "member", "volunteer"];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Members</h1>
          <p className="mt-1 text-muted-foreground">Manage club members</p>
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }}>
          <Plus data-icon="inline-start" /> Add Member
        </Button>
        <Dialog open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (!isOpen) setEditing(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Member" : "Add Member"}</DialogTitle>
            </DialogHeader>
            <MemberForm
              member={editing}
              onSuccess={() => {
                setOpen(false);
                queryClient.invalidateQueries({ queryKey: ["members"] });
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-4 flex gap-4 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            autoComplete="off"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-input bg-background rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role === "all" ? "All Roles" : role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8 rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Since</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              : members?.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{member.joinedAt}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(member)}>
                        <Pencil className="size-4" aria-hidden="true" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteMutation.mutate(member.id)}>
                        <Trash2 className="size-4" aria-hidden="true" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}