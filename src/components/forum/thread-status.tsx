import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Pin, Lock, Unlock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ForumThreadStatus } from '@/types';

interface ThreadStatusProps {
  status: ForumThreadStatus;
  isAdmin?: boolean;
  isLoading?: boolean;
  onStatusChange?: (status: ForumThreadStatus) => void;
}

export function ThreadStatus({
  status,
  isAdmin = false,
  isLoading = false,
  onStatusChange,
}: ThreadStatusProps) {
  const { t } = useTranslation('forum');
  const statusConfig: Record<string, { label: string; className: string; tooltip: string; icon?: typeof Pin } | null> = {
    pinned: {
      label: t("statusPinned"),
      className: 'bg-accent/10 text-accent',
      tooltip: t("tooltipPinned"),
      icon: Pin,
    },
    locked: {
      label: t("statusLocked"),
      className: 'bg-destructive/10 text-destructive',
      tooltip: t("tooltipLocked"),
      icon: Lock,
    },
    active: {
      label: t("statusActive"),
      className: 'bg-primary/10 text-primary',
      tooltip: t("tooltipActive"),
    },
    archived: {
      label: t("statusArchived"),
      className: 'bg-muted text-muted-foreground',
      tooltip: t("tooltipArchived"),
    },
    normal: null,
  };

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
              aria-label={t("pinThread")}
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
              aria-label={t("unpinThread")}
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
              aria-label={t("lockThread")}
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
              aria-label={t("unlockThread")}
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
