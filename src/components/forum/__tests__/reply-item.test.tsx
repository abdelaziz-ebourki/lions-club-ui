import { render, screen, fireEvent } from '@testing-library/react';
import { ReplyItem } from '../reply-item';
import { describe, test, expect, vi } from 'vitest';
import type { ForumReply } from '@/types';

const baseReply: ForumReply = {
  id: 'reply-1',
  threadId: 'thread-1',
  author: 'Fatima Zahra',
  content: 'This is a reply to the thread.',
  createdAt: '2026-01-15T11:00:00Z',
};

const replyWithEdit: ForumReply = {
  ...baseReply,
  updatedAt: '2026-01-16T09:00:00Z',
};

describe('ReplyItem', () => {
  const onReply = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders author avatar initial', () => {
    render(<ReplyItem reply={baseReply} depth={0} isAuthenticated={false} onReply={onReply} />);
    const avatar = screen.getByText('F');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass('rounded-full');
  });

  test('avatar wrapper has aria-hidden="true"', () => {
    render(<ReplyItem reply={baseReply} depth={0} isAuthenticated={false} onReply={onReply} />);
    const avatarContainer = screen.getByText('F').closest('[aria-hidden="true"]');
    expect(avatarContainer).toBeInTheDocument();
  });

  test('renders author name', () => {
    render(<ReplyItem reply={baseReply} depth={0} isAuthenticated={false} onReply={onReply} />);
    expect(screen.getByText('Fatima Zahra')).toBeInTheDocument();
  });

  test('renders formatted createdAt date', () => {
    render(<ReplyItem reply={baseReply} depth={0} isAuthenticated={false} onReply={onReply} />);
    expect(screen.getByText(/Jan 15, 2026/i)).toBeInTheDocument();
  });

  test('shows edited label when updatedAt is present', () => {
    render(<ReplyItem reply={replyWithEdit} depth={0} isAuthenticated={false} onReply={onReply} />);
    expect(screen.getByText(/edited/i)).toBeInTheDocument();
  });

  test('renders reply content', () => {
    render(<ReplyItem reply={baseReply} depth={0} isAuthenticated={false} onReply={onReply} />);
    expect(screen.getByText('This is a reply to the thread.')).toBeInTheDocument();
  });

  test('shows Reply button when authenticated', () => {
    render(<ReplyItem reply={baseReply} depth={0} isAuthenticated={true} onReply={onReply} />);
    expect(screen.getByRole('button', { name: /reply/i })).toBeInTheDocument();
  });

  test('hides Reply button when not authenticated', () => {
    render(<ReplyItem reply={baseReply} depth={0} isAuthenticated={false} onReply={onReply} />);
    expect(screen.queryByRole('button', { name: /reply/i })).not.toBeInTheDocument();
  });

  test('applies deeper indentation for higher depth', () => {
    render(
      <>
        <ReplyItem reply={baseReply} depth={0} isAuthenticated={false} onReply={onReply} />
        <ReplyItem reply={baseReply} depth={2} isAuthenticated={false} onReply={onReply} />
      </>
    );
    const items = screen.getAllByTestId('reply-item');
    expect(items[0].style.marginLeft).toBe('0px');
    expect(items[1].style.marginLeft).toBe('32px');
  });

  test('calls onReply with parentReplyId and author on click', () => {
    render(<ReplyItem reply={baseReply} depth={0} isAuthenticated={true} onReply={onReply} />);
    fireEvent.click(screen.getByRole('button', { name: /reply/i }));
    expect(onReply).toHaveBeenCalledWith('reply-1', 'Fatima Zahra');
  });
});
