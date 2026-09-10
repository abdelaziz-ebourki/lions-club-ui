import { memo } from 'react';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ForumReply } from '@/types';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/lib/format';

interface ReplyItemProps {
  reply: ForumReply;
  depth: number;
  isAuthenticated: boolean;
  onReply: (parentReplyId: string, quotedAuthor: string) => void;
  isAdmin?: boolean;
  onDelete?: (replyId: string) => void;
  isDeleting?: boolean;
}

export const ReplyItem = memo(function ReplyItem({ reply, depth, isAuthenticated, onReply, isAdmin = false, onDelete, isDeleting = false }: ReplyItemProps) {
  const { t, i18n } = useTranslation('forum');
  const showDelete = isAdmin && onDelete !== undefined;
  return (
    <div
      className={cn('rounded-lg border bg-card p-4 shadow-sm')}
      style={{ marginInlineStart: depth * 16 }}
      data-testid="reply-item"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary font-heading font-bold text-sm" aria-hidden="true">
          {reply.author.charAt(0)}
        </div>
        <div>
          <p className="font-heading text-sm font-semibold">
            {reply.author}
          </p>
          <p className="text-body-xs text-muted-foreground">
            {formatDate(reply.createdAt, i18n.language)}
            {reply.updatedAt && <span className="italic ms-1">{t("edited")}</span>}
          </p>
        </div>
      </div>
      <div className="text-body-sm text-muted-foreground leading-relaxed mb-3">
        {reply.content}
      </div>
      {(isAuthenticated || showDelete) && (
        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReply(reply.id, reply.author)}
            >
              {t("reply")}
            </Button>
          )}
          {showDelete && (
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:text-destructive"
                    aria-label={t("deleteReply")}
                    disabled={isDeleting}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("deleteReplyTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>{t("deleteReplyDesc")}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete?.(reply.id)} disabled={isDeleting}>
                    {isDeleting ? t("deleting") : t("confirmDelete")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      )}
    </div>
  );
});
