import { render, screen } from '@testing-library/react';
import { ThreadHeader } from '../thread-header';
import type { ForumThread } from '@/types';

const mockThread: ForumThread = {
  id: 'thread-1',
  categoryId: 'cat-1',
  title: 'Welcome to the forum',
  author: 'Admin User',
  content: 'This is the first thread',
  createdAt: '2024-01-15T10:00:00Z',
  status: 'pinned',
  replyCount: 5,
  viewCount: 100,
  lastActivity: '2024-01-15T11:00:00Z',
};

describe('ThreadHeader', () => {
  test('renders thread title in Cormorant heading style', () => {
    render(<ThreadHeader thread={mockThread} isAdmin={false} />);
    const title = screen.getByText('Welcome to the forum');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('font-heading');
  });

  test('shows author with avatar initial', () => {
    render(<ThreadHeader thread={mockThread} isAdmin={false} />);
    const avatar = screen.getByText('A');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass('rounded-full');
  });

  test('shows formatted createdAt date', () => {
    render(<ThreadHeader thread={mockThread} isAdmin={false} />);
    // Date should be formatted (e.g., "Jan 15, 2024")
    expect(screen.getByText(/Jan 15, 2024/i)).toBeInTheDocument();
  });

  test('composes ThreadStatus badges', () => {
    render(<ThreadHeader thread={mockThread} isAdmin={false} />);
    expect(screen.getByText('Pinned')).toBeInTheDocument();
  });

  test('shows viewCount and replyCount', () => {
    render(<ThreadHeader thread={mockThread} isAdmin={false} />);
    expect(screen.getByText('100 views')).toBeInTheDocument();
    expect(screen.getByText('5 replies')).toBeInTheDocument();
  });

  test('shows Locked badge when thread is locked', () => {
    const lockedThread = { ...mockThread, status: 'locked' as const };
    render(<ThreadHeader thread={lockedThread} isAdmin={false} />);
    expect(screen.getByText('Locked')).toBeInTheDocument();
  });

  test('shows Active badge when thread is active', () => {
    const activeThread = { ...mockThread, status: 'active' as const };
    render(<ThreadHeader thread={activeThread} isAdmin={false} />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  test('forwards onStatusChange to ThreadStatus for admin toggles', () => {
    const handleStatusChange = vi.fn();
    const { rerender } = render(
      <ThreadHeader thread={mockThread} isAdmin onStatusChange={handleStatusChange} />
    );
    expect(screen.getByTestId('unpin-button')).toBeInTheDocument();

    rerender(<ThreadHeader thread={mockThread} isAdmin />);
    expect(screen.queryByTestId('unpin-button')).not.toBeInTheDocument();
  });

  test('forwards isStatusLoading to disable admin toggles', () => {
    const handleStatusChange = vi.fn();
    const { rerender } = render(
      <ThreadHeader thread={mockThread} isAdmin onStatusChange={handleStatusChange} isStatusLoading />
    );
    expect(screen.getByTestId('unpin-button')).toBeDisabled();

    rerender(
      <ThreadHeader thread={mockThread} isAdmin onStatusChange={handleStatusChange} isStatusLoading={false} />
    );
    expect(screen.getByTestId('unpin-button')).not.toBeDisabled();
  });
});