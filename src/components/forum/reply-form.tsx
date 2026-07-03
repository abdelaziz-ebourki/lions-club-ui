import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface ReplyFormProps {
  onSubmit: (data: { content: string; parentReplyId?: string }) => Promise<void>;
  parentReplyId?: string;
  quotedAuthor?: string;
  maxLength?: number;
}

export function ReplyForm({ onSubmit, parentReplyId, quotedAuthor, maxLength = 5000 }: ReplyFormProps) {
  const form = useForm<{ content: string }>({
    mode: 'onChange',
    resolver: zodResolver(z.object({
      content: z.string().min(5, 'at least 5 characters').max(maxLength, `Reply cannot exceed ${maxLength} characters`),
    })),
    defaultValues: { content: '' },
  });

  const content = form.watch('content');

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onSubmit({
        content: data.content,
        ...(parentReplyId && { parentReplyId }),
      });
      form.reset({ content: '' });
    } catch (error) {
      toast.error('Failed to post reply. Please try again.');
    }
  });

  return (
    <form data-testid="reply-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-heading text-h4">Reply to thread</h3>
        {quotedAuthor && (
          <span className="text-body-sm text-muted-foreground">
            Replying to @{quotedAuthor}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="reply-content" className="sr-only">
          Reply content
        </label>
        <Textarea
          id="reply-content"
          placeholder="Write a reply..."
          rows={3}
          className="min-h-[100px]"
          maxLength={maxLength}
          disabled={form.formState.isSubmitting}
          {...form.register('content')}
        />

        <div className="flex items-center justify-between">
          <span className="text-body-sm text-muted-foreground" aria-live="polite">
            {content.length}/{maxLength}
          </span>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="ml-auto"
          >
            {form.formState.isSubmitting ? (
              <><Spinner className="mr-2" /> Posting...</>
            ) : 'Post Reply'}
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
