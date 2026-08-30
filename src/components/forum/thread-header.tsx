import { ThreadStatus } from './thread-status';
import type { ForumThread, ForumThreadStatus } from '@/types';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/lib/format';

interface ThreadHeaderProps {
  thread: ForumThread;
  isAdmin?: boolean;
  onStatusChange?: (status: ForumThreadStatus) => void;
  isStatusLoading?: boolean;
}

export function ThreadHeader({ thread, isAdmin = false, onStatusChange, isStatusLoading }: ThreadHeaderProps) {
  const { t, i18n } = useTranslation('forum');
  return (
    <div className="mb-6">
      <h1 className="font-heading text-h1 text-foreground mb-2">
        {thread.title}
      </h1>
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
