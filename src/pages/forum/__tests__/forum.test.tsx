import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ForumPage } from '../forum';
import { useQuery } from '@tanstack/react-query';
import { describe, test, expect, vi, beforeEach } from 'vitest';

const mockCategories = [
  { id: 'cat-1', name: 'General Discussion', description: 'Talk about anything', threadCount: 24, postCount: 156, icon: 'MessageSquare' },
  { id: 'cat-2', name: 'Events & Projects', description: 'Upcoming events', threadCount: 18, postCount: 98, icon: 'Calendar' },
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
  vi.clearAllMocks();
});

describe('ForumPage', () => {
  test('shows loading skeleton', () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined, isLoading: true } as any);
    render(<ForumPage />);
    expect(screen.getByText('Community Conversations')).toBeInTheDocument();
    expect(screen.queryByText('General Discussion')).not.toBeInTheDocument();
  });

  test('renders category list', () => {
    vi.mocked(useQuery).mockReturnValue({ data: mockCategories, isLoading: false } as any);
    render(<ForumPage />);
    expect(screen.getByText('General Discussion')).toBeInTheDocument();
    expect(screen.getByText('Events & Projects')).toBeInTheDocument();
    expect(screen.getByText('24 threads')).toBeInTheDocument();
  });

  test('shows empty state when no categories', () => {
    vi.mocked(useQuery).mockReturnValue({ data: [], isLoading: false } as any);
    render(<ForumPage />);
    expect(screen.getByText(/No categories yet/i)).toBeInTheDocument();
  });

  test('shows error state with retry button', () => {
    const refetch = vi.fn();
    vi.mocked(useQuery).mockReturnValue({
      data: undefined, isLoading: false, isError: true, refetch,
    } as any);
    render(<ForumPage />);
    expect(screen.getByText(/failed to load categories/i)).toBeInTheDocument();
    const retryButton = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryButton);
    expect(refetch).toHaveBeenCalledOnce();
  });
});
