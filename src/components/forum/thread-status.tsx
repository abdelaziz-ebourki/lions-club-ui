import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Pin, Lock, Unlock } from 'lucide-react';
import type { ForumThreadStatus } from '@/types';

interface ThreadStatusProps {
  status: ForumThreadStatus;
  isAdmin?: boolean;
  isLoading?: boolean;
  onStatusChange?: (status: ForumThreadStatus) => void;
}

const statusConfig = {
  pinned: {
    label: 'Pinned',
    className: 'bg-accent/10 text-accent',
    tooltip: 'This thread is pinned to the top',
    icon: Pin,
  },
  locked: {
    label: 'Locked',
    className: 'bg-destructive/10 text-destructive',
    tooltip: 'This thread is locked, no new replies allowed',
    icon: Lock,
  },
  active: {
    label: 'Active',
    className: 'bg-primary/10 text-primary',
    tooltip: 'This thread is currently active',
  },
  archived: {
    label: 'Archived',
    className: 'bg-muted text-muted-foreground',
    tooltip: 'This thread has been archived',
  },
  normal: null,
} as const;

export function ThreadStatus({
  status,
  isAdmin = false,
  isLoading = false,
  onStatusChange,
}: ThreadStatusProps) {
  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {config && (
        <Badge
          variant="outline"
          className={cn(
            'font-display text-overline tracking-widest',
            config.className,
            'gap-1.5'
          )}
          title={config.tooltip}
        >
          {'icon' in config && config.icon && <config.icon className="size-3" />}
          {config.label}
        </Badge>
      )}

      {isAdmin && onStatusChange && status !== 'archived' && (
        <div className="flex items-center gap-1">
          {status !== 'pinned' && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-7 w-7"
              onClick={() => onStatusChange?.('pinned')}
              disabled={isLoading}
              aria-label="Pin thread"
              data-testid="pin-button"
            >
              <Pin className="size-3.5" />
            </Button>
          )}
          {status === 'pinned' && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-7 w-7"
              onClick={() => onStatusChange?.('normal')}
              disabled={isLoading}
              aria-label="Unpin thread"
              data-testid="unpin-button"
            >
              <Pin className="size-3.5" />
            </Button>
          )}
          {status !== 'locked' && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-7 w-7"
              onClick={() => onStatusChange?.('locked')}
              disabled={isLoading}
              aria-label="Lock thread"
              data-testid="lock-button"
            >
              <Lock className="size-3.5" />
            </Button>
          )}
          {status === 'locked' && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-7 w-7"
              onClick={() => onStatusChange?.('normal')}
              disabled={isLoading}
              aria-label="Unlock thread"
              data-testid="unlock-button"
            >
              <Unlock className="size-3.5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}