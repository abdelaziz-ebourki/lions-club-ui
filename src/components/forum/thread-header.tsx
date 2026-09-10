import { ThreadStatus } from './thread-status';
import type { ForumThread, ForumThreadStatus } from '@/types';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/lib/format';
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

interface ThreadHeaderProps {
  thread: ForumThread;
  isAdmin?: boolean;
  onStatusChange?: (status: ForumThreadStatus) => void;
  isStatusLoading?: boolean;
  onDeleteThread?: () => void;
  isDeletingThread?: boolean;
}

export function ThreadHeader({ thread, isAdmin = false, onStatusChange, isStatusLoading, onDeleteThread, isDeletingThread = false }: ThreadHeaderProps) {
  const { t, i18n } = useTranslation('forum');
  const showDelete = isAdmin && onDeleteThread !== undefined;
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="font-heading text-h1 text-foreground mb-2">
          {thread.title}
        </h1>
        {showDelete && (
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-1 shrink-0 text-destructive hover:text-destructive"
                  aria-label={t("deleteThread")}
                  disabled={isDeletingThread}
                >
                  <Trash2 className="size-5" />
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("deleteThreadTitle")}</AlertDialogTitle>
                <AlertDialogDescription>{t("deleteThreadDesc", { title: thread.title })}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={onDeleteThread} disabled={isDeletingThread}>
                  {isDeletingThread ? t("deleting") : t("confirmDelete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      <div className="flex items-center gap-4 text-body-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary font-heading font-bold">
            {thread.author.charAt(0)}
          </div>
          <span className="font-medium">{thread.author}</span>
        </div>
        <span className="hidden sm:inline">{formatDate(thread.createdAt, i18n.language)}</span>
        <ThreadStatus status={thread.status} isAdmin={isAdmin} onStatusChange={onStatusChange} isLoading={isStatusLoading} />
      </div>
      {thread.viewCount !== undefined && thread.replyCount !== undefined && (
        <div className="mt-4 flex gap-6 text-body-sm text-muted-foreground">
          <span>{t("viewsCount", { count: thread.viewCount })}</span>
          <span>{t("repliesCount", { count: thread.replyCount })}</span>
        </div>
      )}
    </div>
  );
}
