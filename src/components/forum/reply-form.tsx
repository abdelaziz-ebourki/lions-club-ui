import { useForm, useWatch, type Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface ReplyFormProps {
  onSubmit: (data: { content: string; parentReplyId?: string }) => Promise<void>;
  parentReplyId?: string;
  quotedAuthor?: string;
  maxLength?: number;
}

function CharacterCounter({ control, maxLength }: { control: Control<{ content: string }>; maxLength: number }) {
  const content = useWatch({ control, name: 'content' }) ?? '';
  return (
    <span className="text-body-sm text-muted-foreground" aria-live="polite">
      {content.length}/{maxLength}
    </span>
  );
}

export function ReplyForm({ onSubmit, parentReplyId, quotedAuthor, maxLength = 5000 }: ReplyFormProps) {
  const { t } = useTranslation('forum');
  const form = useForm<{ content: string }>({
    mode: 'onChange',
    resolver: zodResolver(z.object({
      content: z.string().min(5, t("replyValidationMin")).max(maxLength, t("replyValidationMax", { max: maxLength })),
    })),
    defaultValues: { content: '' },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onSubmit({
        content: data.content,
        ...(parentReplyId && { parentReplyId }),
      });
      form.reset({ content: '' });
    } catch {
      toast.error(t("failedToPostReply"));
    }
  });

  return (
    <form data-testid="reply-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-heading text-h4">{t("replyToThread")}</h3>
        {quotedAuthor && (
          <span className="text-body-sm text-muted-foreground">
            {t("replyingTo", { author: quotedAuthor })}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="reply-content" className="sr-only">
          {t("replyContentLabel")}
        </label>
        <Textarea
          id="reply-content"
          placeholder={t("writeReplyPlaceholder")}
          rows={3}
          className="min-h-[100px]"
          maxLength={maxLength}
          disabled={form.formState.isSubmitting}
          {...form.register('content')}
        />

        <div className="flex items-center justify-between">
          <CharacterCounter control={form.control} maxLength={maxLength} />
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="ms-auto"
          >
            {form.formState.isSubmitting ? (
              <><Spinner className="me-2" /> {t("posting")}</>
            ) : t("postReply")}
          </Button>
        </div>
      </div>

      {form.formState.errors.content && (form.formState.isSubmitted || form.formState.dirtyFields.content) && (
        <p className="text-body-sm text-destructive" role="alert">
          {form.formState.errors.content.message}
        </p>
      )}
    </form>
  );
}
