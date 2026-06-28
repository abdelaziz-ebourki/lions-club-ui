import { ThreadStatus } from './thread-status';
import type { ForumThread } from '@/types';
import { format } from 'date-fns';

interface ThreadHeaderProps {
  thread: ForumThread;
  isAdmin?: boolean;
}

export function ThreadHeader({ thread, isAdmin = false }: ThreadHeaderProps) {
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
        <span className="hidden sm:inline">{format(new Date(thread.createdAt), 'MMM d, yyyy')}</span>
        <ThreadStatus status={thread.status} isAdmin={isAdmin} />
      </div>
      {thread.viewCount !== undefined && thread.replyCount !== undefined && (
        <div className="mt-4 flex gap-6 text-body-sm text-muted-foreground">
          <span>{thread.viewCount} views</span>
          <span>{thread.replyCount} replies</span>
        </div>
      )}
    </div>
  );
}