import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ForumReply } from '@/types';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/lib/format';

interface ReplyItemProps {
  reply: ForumReply;
  depth: number;
  isAuthenticated: boolean;
  onReply: (parentReplyId: string, quotedAuthor: string) => void;
}

export const ReplyItem = memo(function ReplyItem({ reply, depth, isAuthenticated, onReply }: ReplyItemProps) {
  const { t, i18n } = useTranslation('forum');
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
      {isAuthenticated && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onReply(reply.id, reply.author)}
        >
          {t("reply")}
        </Button>
      )}
    </div>
  );
});
