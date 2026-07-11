import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import type { ForumThread } from "@/types";

interface ThreadListItemProps {
  thread: ForumThread;
  categoryId: string;
}

export function ThreadListItem({ thread, categoryId }: ThreadListItemProps) {
  return (
    <Link to={`/forum/${categoryId}/${thread.id}`}>
      <Card className="transition-all hover:shadow-md">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground" aria-hidden="true">
            <MessageSquare className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-lg font-medium">
              {thread.title}
            </h3>
            <p className="text-body-sm text-muted-foreground mt-1">
              Started by {thread.author} &middot; {thread.replyCount} replies
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm text-muted-foreground">
              {thread.lastActivity}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
