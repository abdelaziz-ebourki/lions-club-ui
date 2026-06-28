import { useMemo, type ReactNode } from 'react';
import { ReplyItem } from './reply-item';
import type { ForumReply } from '@/types';

interface ReplyListProps {
  replies: ForumReply[];
  isAuthenticated: boolean;
  onReply: (parentReplyId: string, quotedAuthor: string) => void;
}

function renderReplyTree(
  reply: ForumReply,
  childrenByParent: Record<string, ForumReply[]>,
  isAuthenticated: boolean,
  onReply: (parentReplyId: string, quotedAuthor: string) => void,
  depth: number,
): ReactNode {
  return (
    <div key={reply.id} className="space-y-2">
      <ReplyItem
        reply={reply}
        depth={depth}
        isAuthenticated={isAuthenticated}
        onReply={onReply}
      />
      {childrenByParent[reply.id]?.map((child) =>
        renderReplyTree(child, childrenByParent, isAuthenticated, onReply, depth + 2),
      )}
    </div>
  );
}

export function ReplyList({ replies, isAuthenticated, onReply }: ReplyListProps) {
  const { topLevel, childrenByParent } = useMemo(() => {
    const sorted = [...replies].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const top: ForumReply[] = [];
    const byParent: Record<string, ForumReply[]> = {};
    for (const reply of sorted) {
      if (reply.parentReplyId) {
        if (!byParent[reply.parentReplyId]) {
          byParent[reply.parentReplyId] = [];
        }
        byParent[reply.parentReplyId].push(reply);
      } else {
        top.push(reply);
      }
    }
    return { topLevel: top, childrenByParent: byParent };
  }, [replies]);

  return (
    <div className="space-y-4" data-testid="reply-list">
      <h3 className="font-heading text-h4">{replies.length} {replies.length === 1 ? 'reply' : 'replies'}</h3>
      {topLevel.map((reply) =>
        renderReplyTree(reply, childrenByParent, isAuthenticated, onReply, 0),
      )}
    </div>
  );
}
