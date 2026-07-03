import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, ChevronRight } from "lucide-react";
import type { ContactMessage } from "@/types";

export function AdminMessagesPage() {
  const { data: messages } = useQuery<ContactMessage[]>({
    queryKey: ["messages", "admin"],
    queryFn: () => api.get("/contact"),
  });

  return (
    <div>
      <div className="mb-8">
        <p className="font-display text-overline text-accent">Messages</p>
        <h1 className="font-heading text-h2 mt-1 text-foreground">Manage Messages</h1>
        <p className="text-body text-muted-foreground mt-1">
          View and respond to messages from visitors and members.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {messages?.map((msg) => (
          <Card key={msg.id} className={`transition-all hover:shadow-md ${msg.status === "unread" ? 'border-accent/50' : ''}`}>
            <CardContent className="flex items-start gap-4 py-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Mail className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <CardTitle className="font-heading text-base">{msg.name}</CardTitle>
                  {msg.status === "unread" && (
                    <Badge variant="accent" className="text-[10px]">New</Badge>
                  )}
                </div>
                <p className="text-body-sm text-muted-foreground mt-0.5">{msg.subject}</p>
                <p className="text-body-sm text-muted-foreground mt-1 line-clamp-2">{msg.message}</p>
              </div>
              <div className="text-right text-body-sm text-muted-foreground shrink-0 hidden sm:block">
                <p>{msg.email}</p>
                <p className="mt-1">{msg.createdAt}</p>
              </div>
              <ChevronRight className="size-5 shrink-0 text-muted-foreground mt-2" />
            </CardContent>
          </Card>
        ))}

        {messages?.length === 0 && (
          <div className="py-16 text-center">
            <p className="font-body text-muted-foreground">No messages yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
