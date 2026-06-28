import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThreadDetailPage } from '../thread-detail';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth';
import { useParams } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import type { ForumThread, ForumReply } from '@/types';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' }),
    Link: ({ children, to, ...props }: any) =>
      React.createElement('a', { href: to, ...props }, children),
  };
});

vi.mock('@/contexts/auth', () => ({
  useAuth: vi.fn(),
}));

const mockThread: ForumThread = {
  id: 'thread-1',
  categoryId: 'cat-1',
  title: 'Welcome to the new forum!',
  author: 'Ahmed Benali',
  content: 'Welcome everyone!',
  createdAt: '2026-01-15T10:00:00Z',
  status: 'pinned',
  replyCount: 2,
  viewCount: 10,
  lastActivity: '2026-06-20T14:30:00Z',
};

const mockReplies: ForumReply[] = [
  {
    id: 'reply-1',
    threadId: 'thread-1',
    author: 'Fatima Zahra El Amrani',
    content: 'Thank you Ahmed!',
    createdAt: '2026-01-15T11:00:00Z',
  },
];

const defaultQueryReturn = {
  data: { thread: mockThread, replies: mockReplies },
  isLoading: false,
  error: null,
};

const defaultMutationReturn = {
  mutateAsync: vi.fn().mockResolvedValue(undefined),
  isPending: false,
};

describe('ThreadDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue(defaultQueryReturn);
    (useMutation as ReturnType<typeof vi.fn>).mockReturnValue(defaultMutationReturn);
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
      loading: false,
    });
    (useParams as ReturnType<typeof vi.fn>).mockReturnValue({
      categoryId: 'cat-1',
      threadId: 'thread-1',
    });
  });

  test('shows loading skeleton', () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });
    render(<ThreadDetailPage />);
    expect(screen.queryByText(mockThread.title)).not.toBeInTheDocument();
    expect(screen.queryByText(/thank you ahmed/i)).not.toBeInTheDocument();
  });

  test('shows not found when thread is missing', () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    });
    render(<ThreadDetailPage />);
    expect(screen.getByText('Thread not found')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to threads/i })).toBeInTheDocument();
  });

  test('renders thread title in header', () => {
    render(<ThreadDetailPage />);
    expect(screen.getByText('Welcome to the new forum!')).toBeInTheDocument();
  });

  test('renders reply list with replies', () => {
    render(<ThreadDetailPage />);
    expect(screen.getByText('Fatima Zahra El Amrani')).toBeInTheDocument();
    expect(screen.getByText('Thank you Ahmed!')).toBeInTheDocument();
  });

  test('shows reply form when authenticated', () => {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { role: 'member' },
      isAuthenticated: true,
      isAdmin: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
      loading: false,
    });
    render(<ThreadDetailPage />);
    expect(screen.getByTestId('reply-form')).toBeInTheDocument();
  });

  test('hides reply form when not authenticated', () => {
    render(<ThreadDetailPage />);
    expect(screen.queryByTestId('reply-form')).not.toBeInTheDocument();
  });

  test('shows empty reply count when no replies', () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { thread: mockThread, replies: [] },
      isLoading: false,
      error: null,
    });
    render(<ThreadDetailPage />);
    expect(screen.getByText('0 replies')).toBeInTheDocument();
  });

  test('shows reply form with quoted author after clicking Reply', async () => {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { role: 'member' },
      isAuthenticated: true,
      isAdmin: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
      loading: false,
    });
    render(<ThreadDetailPage />);
    const replyButton = screen.getByRole('button', { name: /^reply$/i });
    fireEvent.click(replyButton);
    await waitFor(() => {
      expect(screen.getByText(/replying to @fatima zahra el amrani/i)).toBeInTheDocument();
    });
  });

  test('submits reply via mutation', async () => {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { role: 'member' },
      isAuthenticated: true,
      isAdmin: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
      loading: false,
    });
    render(<ThreadDetailPage />);
    const textarea = screen.getByPlaceholderText(/write a reply/i);
    fireEvent.change(textarea, { target: { value: 'This is my reply to the thread.' } });
    const submitButton = screen.getByRole('button', { name: /post reply/i });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(defaultMutationReturn.mutateAsync).toHaveBeenCalledWith({
        content: 'This is my reply to the thread.',
      });
    });
  });
});
