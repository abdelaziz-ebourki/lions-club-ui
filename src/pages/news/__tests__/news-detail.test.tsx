import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { NewsDetailPage } from '../news-detail';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { newsArticles } from '@/mocks/data/news';
import { describe, test, vi, beforeEach, expect } from 'vitest';

const publishedArticle = newsArticles.find((a) => a.slug === 'annual-charity-gala-2026-announced')!;
const draftArticle = newsArticles.find((a) => a.status === 'draft')!;

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
    Link: ({ children, to, ...props }: any) =>
      React.createElement('a', { href: to, ...props }, children),
  };
});

describe('NewsDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loading state', () => {
    test('shows skeleton while loading', () => {
      (useParams as ReturnType<typeof vi.fn>).mockReturnValue({ slug: 'any-slug' });
      vi.mocked(useQuery).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      render(<NewsDetailPage />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('404 state', () => {
    test('shows not found when article does not exist (data undefined, no error)', () => {
      (useParams as ReturnType<typeof vi.fn>).mockReturnValue({ slug: 'nonexistent-slug' });
      vi.mocked(useQuery).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      render(<NewsDetailPage />);

      expect(screen.getByRole('heading', { name: /article not found/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /back to news/i })).toBeInTheDocument();
    });

    test('shows not found when article is draft (query returns 404)', () => {
      (useParams as ReturnType<typeof vi.fn>).mockReturnValue({ slug: draftArticle.slug });
      vi.mocked(useQuery).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: Object.assign(new Error('Not Found'), { status: 404 }),
        refetch: vi.fn(),
      } as any);

      render(<NewsDetailPage />);

      expect(screen.getByRole('heading', { name: /article not found/i })).toBeInTheDocument();
    });

    test('shows not found when article is archived (query returns 404)', () => {
      const archivedArticle = newsArticles.find((a) => a.status === 'archived')!;
      (useParams as ReturnType<typeof vi.fn>).mockReturnValue({ slug: archivedArticle.slug });
      vi.mocked(useQuery).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: Object.assign(new Error('Not Found'), { status: 404 }),
        refetch: vi.fn(),
      } as any);

      render(<NewsDetailPage />);

      expect(screen.getByRole('heading', { name: /article not found/i })).toBeInTheDocument();
    });
  });

  describe('network error state', () => {
    test('shows error state with retry button on network failure', () => {
      const mockRefetch = vi.fn();
      (useParams as ReturnType<typeof vi.fn>).mockReturnValue({ slug: publishedArticle.slug });
      vi.mocked(useQuery).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: { message: 'Network error', status: 500 },
        refetch: mockRefetch,
      } as any);

      render(<NewsDetailPage />);

      expect(screen.getByRole('heading', { name: /failed to load article/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });

    test('calls refetch when retry button clicked', () => {
      const mockRefetch = vi.fn();
      (useParams as ReturnType<typeof vi.fn>).mockReturnValue({ slug: publishedArticle.slug });
      vi.mocked(useQuery).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: { message: 'Network error', status: 500 },
        refetch: mockRefetch,
      } as any);

      render(<NewsDetailPage />);

      const retryButton = screen.getByRole('button', { name: /try again/i });
      retryButton.click();
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  describe('rendering published article', () => {
    beforeEach(() => {
      (useParams as ReturnType<typeof vi.fn>).mockReturnValue({ slug: publishedArticle.slug });
      vi.mocked(useQuery).mockReturnValue({
        data: publishedArticle,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);
    });

    test('renders article title as main heading', () => {
      render(<NewsDetailPage />);
      expect(screen.getByRole('heading', { name: publishedArticle.title })).toBeInTheDocument();
    });

    test('renders category badge', () => {
      render(<NewsDetailPage />);
      expect(screen.getByText(publishedArticle.category)).toBeInTheDocument();
    });

    test('renders featured image with lazy loading', () => {
      const { container } = render(<NewsDetailPage />);
      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('loading', 'lazy');
      expect(img).toHaveAttribute('src', publishedArticle.featuredImage);
    });

    test('renders author name and published date', () => {
      render(<NewsDetailPage />);
      expect(screen.getByText(publishedArticle.authorName)).toBeInTheDocument();
      expect(screen.getByText(new Date(publishedArticle.publishedAt!).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))).toBeInTheDocument();
    });

    test('renders content via dangerouslySetInnerHTML', () => {
      const { container } = render(<NewsDetailPage />);
      const contentDiv = container.querySelector('.prose');
      expect(contentDiv).toBeInTheDocument();
      expect(contentDiv?.innerHTML).toContain('A Night of Giving');
    });

    test('has back to news link', () => {
      render(<NewsDetailPage />);
      expect(screen.getByRole('link', { name: /all news/i })).toBeInTheDocument();
    });
  });

  describe('SEO meta tags (react-helmet-async)', () => {
    beforeEach(() => {
      (useParams as ReturnType<typeof vi.fn>).mockReturnValue({ slug: publishedArticle.slug });
      vi.mocked(useQuery).mockReturnValue({
        data: publishedArticle,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);
    });

    test('renders article with title', () => {
      render(<NewsDetailPage />);
      expect(screen.getByRole('heading', { name: publishedArticle.title })).toBeInTheDocument();
    });

    test('sets document.title to "<article title> | Lions Club FSBM" (FR-015, US4/AC1)', async () => {
      render(<NewsDetailPage />);
      await waitFor(() => {
        expect(document.title).toBe(`${publishedArticle.title} | Lions Club FSBM`);
      });
    });

    test('sets meta description from article excerpt (FR-015)', () => {
      render(<NewsDetailPage />);
      const meta = document.head.querySelector('meta[name="description"]');
      expect(meta).not.toBeNull();
      expect(meta).toHaveAttribute('content', publishedArticle.excerpt);
    });

    test('sets og:title and og:type=article meta tags (US4/AC2)', () => {
      render(<NewsDetailPage />);
      expect(document.head.querySelector('meta[property="og:title"]')).toHaveAttribute(
        'content',
        publishedArticle.title
      );
      expect(document.head.querySelector('meta[property="og:type"]')).toHaveAttribute(
        'content',
        'article'
      );
    });

    test('renders category badge', () => {
      render(<NewsDetailPage />);
      expect(screen.getByText(publishedArticle.category)).toBeInTheDocument();
    });

    test('renders author and date', () => {
      render(<NewsDetailPage />);
      expect(screen.getByText(publishedArticle.authorName)).toBeInTheDocument();
      expect(screen.getByText(new Date(publishedArticle.publishedAt!).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))).toBeInTheDocument();
    });

    test('renders featured image', () => {
      const { container } = render(<NewsDetailPage />);
      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', publishedArticle.featuredImage);
    });

    test('renders content', () => {
      const { container } = render(<NewsDetailPage />);
      const contentDiv = container.querySelector('.prose');
      expect(contentDiv).toBeInTheDocument();
    });

    test('does not render og:image when no featured image', () => {
      const articleWithoutImage = { ...publishedArticle, featuredImage: undefined };
      vi.mocked(useQuery).mockReturnValue({
        data: articleWithoutImage,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      const { container } = render(<NewsDetailPage />);
      const img = container.querySelector('img');
      expect(img).not.toBeInTheDocument();
    });
  });
});