import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Mail, ChevronRight, Trash2 } from "lucide-react";
import type { ContactMessage, ContactMessageStatus } from "@/types";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export function AdminMessagesPage() {
  const { t, i18n } = useTranslation("admin");
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { data: messages } = useQuery<ContactMessage[]>({
    queryKey: ["messages", "admin"],
    queryFn: () => api.get("/contact"),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContactMessageStatus }) =>
      api.patch(`/contact/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", "admin"] });
      toast.success(t("messages.statusUpdatedSuccess"));
    },
    onError: () => toast.error(t("messages.statusUpdatedError")),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/contact/${id}`),
    onSuccess: () => {
      setExpandedId(null);
      queryClient.invalidateQueries({ queryKey: ["messages", "admin"] });
      toast.success(t("messages.deletedSuccess"));
    },
    onError: () => toast.error(t("messages.deletedError")),
  });

  return (
    <div>
      <Breadcrumbs trail={[{ label: t("messages.breadcrumbs.home"), href: "/" }, { label: t("messages.breadcrumbs.admin"), href: "/admin" }, { label: t("messages.breadcrumbs.messages") }]} />
      <div className="mb-8">
        <p className="font-display text-overline text-accent">{t("messages.overline")}</p>
        <h1 className="font-heading text-h2 mt-1 text-foreground">{t("messages.heading")}</h1>
        <p className="text-body text-muted-foreground mt-1">
          {t("messages.description")}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {messages?.map((msg) => {
          const expanded = expandedId === msg.id;
          return (
            <Card
              key={msg.id}
              className={`transition-all hover:shadow-md ${msg.status === "unread" ? 'border-accent/50' : ''} ${expanded ? 'shadow-md' : ''}`}
            >
              <div
                role="button"
                tabIndex={0}
                aria-expanded={expanded}
                onClick={() => setExpandedId(expanded ? null : msg.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setExpandedId(expanded ? null : msg.id);
                  }
                }}
                className="cursor-pointer"
              >
                <CardContent className="flex items-start gap-4 py-5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Mail className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <CardTitle className="font-heading text-base">{msg.name}</CardTitle>
                      {msg.status === "unread" && (
                        <Badge variant="accent" className="text-[10px]">{t("messages.badgeNew")}</Badge>
                      )}
                    </div>
                    <p className="text-body-sm text-muted-foreground mt-0.5">{msg.subject}</p>
                    <p className={`text-body-sm text-muted-foreground mt-1 ${expanded ? '' : 'line-clamp-2'}`}>{msg.message}</p>
                  </div>
                  <div className="text-right text-body-sm text-muted-foreground shrink-0">
                    <p>{msg.email}</p>
                    <p className="mt-1">{formatDate(msg.createdAt, i18n.language)}</p>
                  </div>
                  <ChevronRight className={`size-5 shrink-0 text-muted-foreground mt-2 transition-transform ${expanded ? 'rotate-90' : ''}`} />
                </CardContent>
              </div>
              {expanded && (
                <CardContent className="flex items-center gap-2 border-t pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={statusMutation.isPending}
                    onClick={() => statusMutation.mutate({ id: msg.id, status: msg.status === "unread" ? "read" : "unread" })}
                  >
                    {msg.status === "unread" ? t("messages.markRead") : t("messages.markUnread")}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          aria-label={t("messages.deleteMessage")}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="size-4 me-1" />
                          {t("messages.deleteMessage")}
                        </Button>
                      }
                    />
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t("messages.deleteTitle")}</AlertDialogTitle>
                        <AlertDialogDescription>{t("messages.deleteDesc", { name: msg.name })}</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("messages.cancel")}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(msg.id)}
                          disabled={deleteMutation.isPending}
                        >
                          {t("messages.confirmDelete")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              )}
            </Card>
          );
        })}

        {messages?.length === 0 && (
          <div className="py-16 text-center">
            <p className="font-body text-muted-foreground">{t("messages.empty")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
