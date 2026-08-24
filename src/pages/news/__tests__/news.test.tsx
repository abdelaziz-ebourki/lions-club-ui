import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NewsPage } from '../news';
import { useNewsList } from '@/hooks/useNewsList';
import { newsArticles } from '@/mocks/data/news';
import { expectImagesLazyAndSized } from '@/test-utils/image-assertions';
import { describe, test, vi, beforeEach, expect } from 'vitest';

vi.mock('@/hooks/useNewsList');

const publishedArticles = newsArticles.filter((a) => a.status === 'published');

describe('NewsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loading state', () => {
    test('shows skeleton while loading', () => {
      vi.mocked(useNewsList).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      render(
        <MemoryRouter>
          <NewsPage />
        </MemoryRouter>
      );

      expect(screen.getByText('Latest News')).toBeInTheDocument();
      const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('empty state', () => {
    test('shows empty state when no published articles', () => {
      vi.mocked(useNewsList).mockReturnValue({
        data: { data: [], total: 0, page: 1, limit: 10, totalPages: 1 },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      render(
        <MemoryRouter>
          <NewsPage />
        </MemoryRouter>
      );

      expect(screen.getByText('No news articles yet')).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    test('shows error state with retry button on network failure', () => {
      const mockRefetch = vi.fn();
      vi.mocked(useNewsList).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('Network error'),
        refetch: mockRefetch,
      } as any);

      render(
        <MemoryRouter>
          <NewsPage />
        </MemoryRouter>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });

    test('calls refetch when retry button clicked', () => {
      const mockRefetch = vi.fn();
      vi.mocked(useNewsList).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('Network error'),
        refetch: mockRefetch,
      } as any);

      render(
        <MemoryRouter>
          <NewsPage />
        </MemoryRouter>
      );

      const retryButton = screen.getByRole('button', { name: /try again/i });
      retryButton.click();
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  describe('rendering published articles', () => {
    test('renders article cards with title, excerpt, category, author, and date', () => {
      vi.mocked(useNewsList).mockReturnValue({
        data: { data: publishedArticles, total: publishedArticles.length, page: 1, limit: 10, totalPages: 1 },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      render(
        <MemoryRouter>
          <NewsPage />
        </MemoryRouter>
      );

      publishedArticles.forEach((article) => {
        expect(screen.getByText(article.title)).toBeInTheDocument();
        expect(screen.getByText(article.excerpt)).toBeInTheDocument();
        expect(screen.getAllByText(article.category).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(article.authorName).length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText(new Date(article.publishedAt!).toLocaleDateString())).toBeInTheDocument();
      });
    });

    test('article titles are clickable links to detail page', () => {
      vi.mocked(useNewsList).mockReturnValue({
        data: { data: publishedArticles, total: publishedArticles.length, page: 1, limit: 10, totalPages: 1 },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      render(
        <MemoryRouter>
          <NewsPage />
        </MemoryRouter>
      );

      publishedArticles.forEach((article) => {
        const link = screen.getByRole('link', { name: article.title });
        expect(link).toHaveAttribute('href', `/news/${article.slug}`);
      });
    });

    test('renders "Read Article" links with correct href', () => {
      vi.mocked(useNewsList).mockReturnValue({
        data: { data: publishedArticles, total: publishedArticles.length, page: 1, limit: 10, totalPages: 1 },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      render(
        <MemoryRouter>
          <NewsPage />
        </MemoryRouter>
      );

      const readLinks = screen.getAllByRole('link', { name: /read article/i });
      expect(readLinks.length).toBe(publishedArticles.length);
      publishedArticles.forEach((article, index) => {
        expect(readLinks[index]).toHaveAttribute('href', `/news/${article.slug}`);
      });
    });

    test('images are lazy-loaded with explicit dimensions', () => {
      vi.mocked(useNewsList).mockReturnValue({
        data: { data: publishedArticles, total: publishedArticles.length, page: 1, limit: 10, totalPages: 1 },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      const { container } = render(
        <MemoryRouter>
          <NewsPage />
        </MemoryRouter>
      );

      expectImagesLazyAndSized(container);
    });
  });

  describe('pagination', () => {
    test('shows pagination controls when multiple pages', () => {
      const manyArticles = Array.from({ length: 15 }, (_, i) => ({
        ...publishedArticles[0],
        id: `news-${i + 1}`,
        title: `Article ${i + 1}`,
        slug: `article-${i + 1}`,
      }));

      vi.mocked(useNewsList).mockReturnValue({
        data: { data: manyArticles.slice(0, 10), total: manyArticles.length, page: 1, limit: 10, totalPages: 2 },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      render(
        <MemoryRouter>
          <NewsPage />
        </MemoryRouter>
      );

      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    });

    test('does not render pagination when only one page', () => {
      vi.mocked(useNewsList).mockReturnValue({
        data: { data: publishedArticles, total: publishedArticles.length, page: 1, limit: 10, totalPages: 1 },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      render(
        <MemoryRouter>
          <NewsPage />
        </MemoryRouter>
      );

      expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /previous/i })).not.toBeInTheDocument();
      expect(screen.queryByText(/page \d+ of \d+/i)).not.toBeInTheDocument();
    });
  });
});