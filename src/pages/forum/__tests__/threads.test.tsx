import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThreadsPage } from '../threads';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';

const mockCategories = [
  { id: 'cat-1', name: 'General Discussion', description: '', threadCount: 24, postCount: 156, icon: 'MessageSquare' },
  { id: 'cat-2', name: 'Events & Projects', description: '', threadCount: 18, postCount: 98, icon: 'Calendar' },
];

const mockThreads = [
  {
    id: 'thread-1', categoryId: 'cat-1', title: 'Welcome Thread',
    author: 'Ahmed', content: '', createdAt: '', status: 'normal' as const,
    replyCount: 3, viewCount: 10, lastActivity: '',
  },
];

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

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: vi.fn(),
    useMutation: vi.fn(),
    useQueryClient: vi.fn(() => ({ invalidateQueries: vi.fn() })),
  };
});

beforeEach(() => {
  vi.mocked(useParams).mockReturnValue({ categoryId: 'cat-1' });
  vi.mocked(useQuery).mockReturnValue({ data: undefined, isLoading: true } as any);
});

describe('ThreadsPage', () => {
  test('shows category name in heading, not raw ID', () => {
    vi.mocked(useQuery)
      .mockReturnValueOnce({ data: mockCategories, isLoading: false } as any)
      .mockReturnValueOnce({ data: mockThreads, isLoading: false } as any);
    render(<ThreadsPage />);
    expect(screen.getByText('General Discussion Threads')).toBeInTheDocument();
    expect(screen.queryByText('cat-1 Threads')).not.toBeInTheDocument();
  });

  test('shows loading skeleton', () => {
    vi.mocked(useQuery)
      .mockReturnValueOnce({ data: undefined, isLoading: true } as any)
      .mockReturnValueOnce({ data: undefined, isLoading: true } as any);
    render(<ThreadsPage />);
    expect(screen.getByText('All Categories')).toBeInTheDocument();
  });

  test('renders thread list', () => {
    vi.mocked(useQuery)
      .mockReturnValueOnce({ data: mockCategories, isLoading: false } as any)
      .mockReturnValueOnce({ data: mockThreads, isLoading: false } as any);
    render(<ThreadsPage />);
    expect(screen.getByText('Welcome Thread')).toBeInTheDocument();
    expect(screen.getByText(/Started by Ahmed/)).toBeInTheDocument();
  });

  test('shows empty state when no threads', () => {
    vi.mocked(useQuery)
      .mockReturnValueOnce({ data: mockCategories, isLoading: false } as any)
      .mockReturnValueOnce({ data: [], isLoading: false } as any);
    render(<ThreadsPage />);
    expect(screen.getByText(/No threads yet/)).toBeInTheDocument();
  });

  test('shows New Thread link with correct category', () => {
    vi.mocked(useQuery)
      .mockReturnValueOnce({ data: mockCategories, isLoading: false } as any)
      .mockReturnValueOnce({ data: mockThreads, isLoading: false } as any);
    render(<ThreadsPage />);
    const newThreadLink = screen.getByRole('link', { name: 'New Thread' });
    expect(newThreadLink).toHaveAttribute('href', '/forum/cat-1/new');
  });
});
