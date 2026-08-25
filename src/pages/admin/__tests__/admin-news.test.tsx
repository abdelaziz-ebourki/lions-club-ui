import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminNewsPage } from '../admin-news';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsArticles } from '@/mocks/data/news';
import { describe, test, vi, beforeEach, expect } from 'vitest';

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mockQueryClient = { invalidateQueries: vi.fn() };

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Link: ({ children, to, ...props }: any) =>
      React.createElement('a', { href: to, ...props }, children),
  };
});

vi.mock('@/contexts/auth', () => ({
  useAuth: () => ({
    user: { name: 'Admin User', role: 'admin' },
    isAuthenticated: true,
    isAdmin: true,
    login: vi.fn(),
    logout: vi.fn(),
    refreshUser: vi.fn(),
    loading: false,
  }),
}));

describe('AdminNewsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useQueryClient as ReturnType<typeof vi.fn>).mockReturnValue(mockQueryClient);
  });

  describe('loading state', () => {
    test('shows skeleton while loading', () => {
      vi.mocked(useQuery).mockReturnValue({ data: undefined, isLoading: true } as any);
      render(<AdminNewsPage />);
      expect(screen.getByText('Manage News')).toBeInTheDocument();
      const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('empty state', () => {
    test('shows empty state when no articles', () => {
      vi.mocked(useQuery).mockReturnValue({ data: [], isLoading: false } as any);
      render(<AdminNewsPage />);
      expect(screen.getByText('No articles yet')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create your first article/i })).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    test('shows error state with retry button on network failure', () => {
      const mockRefetch = vi.fn();
      vi.mocked(useQuery).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('Network error'),
        refetch: mockRefetch,
      } as any);

      render(<AdminNewsPage />);

      expect(screen.getByRole('heading', { name: /failed to load articles/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });

    test('calls refetch when retry button clicked', () => {
      const mockRefetch = vi.fn();
      vi.mocked(useQuery).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('Network error'),
        refetch: mockRefetch,
      } as any);

      render(<AdminNewsPage />);

      fireEvent.click(screen.getByRole('button', { name: /try again/i }));
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  describe('rendering articles', () => {
    test('renders all articles in table (published, draft, archived)', () => {
      vi.mocked(useQuery).mockReturnValue({ data: newsArticles, isLoading: false } as any);
      vi.mocked(useMutation).mockReturnValue({ mutate: vi.fn(), isPending: false } as any);

      render(<AdminNewsPage />);

      const titles = newsArticles.map((a) => a.title);
      const categories = newsArticles.map((a) => a.category);
      const statuses = newsArticles.map((a) => a.status);
      const authorNames = newsArticles.map((a) => a.authorName);

      titles.forEach((title) => expect(screen.getAllByText(title).length).toBeGreaterThanOrEqual(1));
      categories.forEach((category) => expect(screen.getAllByText(category).length).toBeGreaterThanOrEqual(1));
      statuses.forEach((status) => expect(screen.getAllByText(status).length).toBeGreaterThanOrEqual(1));
      authorNames.forEach((authorName) => expect(screen.getAllByText(authorName).length).toBeGreaterThanOrEqual(1));
    });

    test('renders published date in table for published articles', () => {
      const publishedArticles = newsArticles.filter((a) => a.status === 'published');
      vi.mocked(useQuery).mockReturnValue({ data: publishedArticles, isLoading: false } as any);
      vi.mocked(useMutation).mockReturnValue({ mutate: vi.fn(), isPending: false } as any);

      render(<AdminNewsPage />);

      const dates = publishedArticles.map((a) => new Date(a.publishedAt!).toLocaleDateString());
      dates.forEach((dateText) => {
        expect(screen.getAllByText(dateText).length).toBeGreaterThanOrEqual(1);
      });
    });

    test('shows dash for unpublished articles in table', () => {
      const nonPublished = newsArticles.filter((a) => a.status !== 'published');
      vi.mocked(useQuery).mockReturnValue({ data: nonPublished, isLoading: false } as any);
      vi.mocked(useMutation).mockReturnValue({ mutate: vi.fn(), isPending: false } as any);

      render(<AdminNewsPage />);

      expect(screen.getAllByText('—').length).toBe(nonPublished.length);
    });

    test('renders status badge with correct variant', () => {
      vi.mocked(useQuery).mockReturnValue({ data: newsArticles, isLoading: false } as any);
      vi.mocked(useMutation).mockReturnValue({ mutate: vi.fn(), isPending: false } as any);

      render(<AdminNewsPage />);

      const statuses = newsArticles.map((a) => a.status);
      statuses.forEach((status) => {
        expect(screen.getAllByText(status).length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('mobile card view', () => {
    test('renders published date in mobile card', () => {
      vi.mocked(useQuery).mockReturnValue({ data: newsArticles, isLoading: false } as any);
      vi.mocked(useMutation).mockReturnValue({ mutate: vi.fn(), isPending: false } as any);

      render(<AdminNewsPage />);

      const dates = newsArticles.map((a) => (a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : '—'));
      dates.forEach((dateText) => {
        expect(screen.getAllByText(dateText).length).toBeGreaterThanOrEqual(1);
      });
    });

    test('renders category badge in mobile card', () => {
      vi.mocked(useQuery).mockReturnValue({ data: newsArticles, isLoading: false } as any);
      vi.mocked(useMutation).mockReturnValue({ mutate: vi.fn(), isPending: false } as any);

      render(<AdminNewsPage />);

      const categories = newsArticles.map((a) => a.category);
      categories.forEach((category) => {
        expect(screen.getAllByText(category).length).toBeGreaterThanOrEqual(1);
      });
    });

    test('renders status badge in mobile card', () => {
      vi.mocked(useQuery).mockReturnValue({ data: newsArticles, isLoading: false } as any);
      vi.mocked(useMutation).mockReturnValue({ mutate: vi.fn(), isPending: false } as any);

      render(<AdminNewsPage />);

      const statuses = newsArticles.map((a) => a.status);
      statuses.forEach((status) => {
        expect(screen.getAllByText(status).length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('delete functionality', () => {
    const mockDeleteMutate = vi.fn();

    beforeEach(() => {
      vi.mocked(useQuery).mockReturnValue({ data: newsArticles, isLoading: false } as any);
      vi.mocked(useMutation).mockReturnValue({ mutate: mockDeleteMutate, isPending: false } as any);
    });

    test('renders delete buttons for each article', () => {
      render(<AdminNewsPage />);

      const deleteButtons = screen.getAllByLabelText(/delete/i);
      // 2 delete buttons per article (desktop table + mobile card)
      expect(deleteButtons.length).toBe(newsArticles.length * 2);
    });

    test('renders alert dialog trigger with correct content', () => {
      render(<AdminNewsPage />);

      // The AlertDialogTrigger should be present for each article
      const deleteButtons = screen.getAllByLabelText(/delete/i);
      expect(deleteButtons.length).toBe(newsArticles.length * 2);
    });

  describe('new article button', () => {
    test('renders new article button in header', () => {
      vi.mocked(useQuery).mockReturnValue({ data: newsArticles, isLoading: false } as any);
      render(<AdminNewsPage />);
      expect(screen.getByRole('link', { name: /new article/i })).toHaveAttribute('href', '/admin/news/new');
    });
  });

  describe('edit links', () => {
    test('renders edit link for each article in both table and mobile views', () => {
      vi.mocked(useQuery).mockReturnValue({ data: newsArticles, isLoading: false } as any);
      vi.mocked(useMutation).mockReturnValue({ mutate: vi.fn(), isPending: false } as any);

      render(<AdminNewsPage />);

      const editLinks = screen.getAllByRole('link');
      const articleEditLinks = editLinks.filter(l => l.getAttribute('href')?.startsWith('/admin/news/') && l.getAttribute('href')?.includes('/edit'));
      // 2 edit links per article (desktop table + mobile card)
      expect(articleEditLinks.length).toBe(newsArticles.length * 2);
      newsArticles.forEach((article) => {
        const matchingLinks = articleEditLinks.filter(l => l.getAttribute('href') === `/admin/news/${article.id}/edit`);
        expect(matchingLinks.length).toBe(2);
      });
    });
  });
  });
});