import { useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { ContactMessage } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, MailOpen, Eye, Trash2 } from "lucide-react";

const statusTabs = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "read":
      return (
        <Badge variant="secondary" className="gap-1">
          <MailOpen className="size-3" aria-hidden="true" /> Read
        </Badge>
      );
    case "archived":
      return (
        <Badge variant="secondary" className="gap-1">
          <MailOpen className="size-3" aria-hidden="true" /> Archived
        </Badge>
      );
    default:
      return (
        <Badge className="gap-1">
          <Mail className="size-3" aria-hidden="true" /> New
        </Badge>
      );
  }
}

export function AdminMessagesPage() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const statusFilter = searchParams.get("status") ?? "all";

  const { data: messages, isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["contact", statusFilter],
    queryFn: () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      return api.get(`/contact?${params.toString()}`);
    },
  });

  function setStatusFilter(status: string) {
    const params = new URLSearchParams(searchParams);
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    setSearchParams(params);
  }

  const markReadMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/contact/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact"] });
      toast.success("Message marked as read");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/contact/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact"] });
      toast.success("Message deleted");
    },
    onError: () => toast.error("Failed to delete message"),
  });

  return (
    <div>
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Messages</h1>
        <p className="mt-1 text-muted-foreground">Contact form submissions</p>
      </div>

      <div className="mt-4">
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            {statusTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-8 rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              : messages?.map((msg) => (
                  <TableRow key={msg.id}>
                    <TableCell>
                      <p className="font-medium">{msg.name}</p>
                      <p className="text-xs text-muted-foreground">{msg.email}</p>
                    </TableCell>
                    <TableCell>{msg.subject}</TableCell>
                    <TableCell>{new Date(msg.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(msg.status)}</TableCell>
                    <TableCell className="text-right">
                      {msg.status === "unread" && (
                        <Button variant="ghost" size="sm" onClick={() => markReadMutation.mutate(msg.id)}>
                          <Eye className="size-4" aria-hidden="true" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteMutation.mutate(msg.id)}>
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