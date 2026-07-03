import { render, screen, fireEvent } from '@testing-library/react';
import { ReplyList } from '../reply-list';
import { describe, test, expect, vi } from 'vitest';
import type { ForumReply } from '@/types';

const replies: ForumReply[] = [
  {
    id: 'reply-3',
    threadId: 'thread-1',
    author: 'Salma Bouazza',
    content: 'A cultural night sounds fantastic!',
    createdAt: '2026-01-17T09:00:00Z',
  },
  {
    id: 'reply-1',
    threadId: 'thread-1',
    author: 'Fatima Zahra',
    content: 'Looking forward to engaging with everyone here.',
    createdAt: '2026-01-15T11:00:00Z',
  },
  {
    id: 'reply-2',
    threadId: 'thread-1',
    author: 'Youssef Idrissi',
    content: 'Excited to be part of this new platform.',
    createdAt: '2026-01-16T09:00:00Z',
    parentReplyId: 'reply-1',
  },
];

describe('ReplyList', () => {
  const onReply = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders all top-level replies', () => {
    render(<ReplyList replies={replies} isAuthenticated={false} onReply={onReply} />);
    expect(screen.getByText('Salma Bouazza')).toBeInTheDocument();
    expect(screen.getByText('Fatima Zahra')).toBeInTheDocument();
  });

  test('nests child replies under parent', () => {
    render(<ReplyList replies={replies} isAuthenticated={false} onReply={onReply} />);
    expect(screen.getByText('Youssef Idrissi')).toBeInTheDocument();
  });

  test('sorts top-level replies newest first', () => {
    render(<ReplyList replies={replies} isAuthenticated={false} onReply={onReply} />);
    const replyCards = screen.getAllByText(/Jan \d+, 2026/);
    expect(replyCards[0]).toHaveTextContent('Jan 17, 2026');
    expect(replyCards[1]).toHaveTextContent('Jan 15, 2026');
  });

  test('passes onReply through to ReplyItem', () => {
    render(<ReplyList replies={replies} isAuthenticated={true} onReply={onReply} />);
    const replyButtons = screen.getAllByRole('button', { name: /reply/i });
    fireEvent.click(replyButtons[0]);
    expect(onReply).toHaveBeenCalled();
  });

  test('handles empty replies array', () => {
    render(<ReplyList replies={[]} isAuthenticated={false} onReply={onReply} />);
    expect(screen.getByText('0 replies')).toBeInTheDocument();
  });

  test('handles replies with no children', () => {
    const singleReply: ForumReply[] = [replies[0]];
    render(<ReplyList replies={singleReply} isAuthenticated={false} onReply={onReply} />);
    expect(screen.getByText('Salma Bouazza')).toBeInTheDocument();
    expect(screen.queryByText('Youssef Idrissi')).not.toBeInTheDocument();
  });

  test('shows reply count in header', () => {
    render(<ReplyList replies={replies} isAuthenticated={false} onReply={onReply} />);
    expect(screen.getByText(/3 replies/i)).toBeInTheDocument();
  });

  test('heading is an h2 element', () => {
    render(<ReplyList replies={replies} isAuthenticated={false} onReply={onReply} />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
  });

  test('renders grandchildren recursively', () => {
    const deepReplies: ForumReply[] = [
      { id: 'r1', threadId: 't1', author: 'A', content: '', createdAt: '2026-01-03T00:00:00Z' },
      { id: 'r2', threadId: 't1', author: 'B', content: '', createdAt: '2026-01-02T00:00:00Z', parentReplyId: 'r1' },
      { id: 'r3', threadId: 't1', author: 'C', content: '', createdAt: '2026-01-01T00:00:00Z', parentReplyId: 'r2' },
    ];
    render(<ReplyList replies={deepReplies} isAuthenticated={false} onReply={vi.fn()} />);
    const items = screen.getAllByTestId('reply-item');
    expect(items[0]).toHaveTextContent('A');
    expect(items[1]).toHaveTextContent('B');
    expect(items[2]).toHaveTextContent('C');
    expect(items[2].style.marginLeft).toBe('64px');
  });
});
