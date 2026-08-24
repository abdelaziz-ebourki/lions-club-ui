import React from 'react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NewsFormPage } from '../news-form';
import { newsArticles } from '@/mocks/data/news';

const publishedArticle = newsArticles.find((a) => a.slug === 'annual-charity-gala-2026-announced')!;

const mockNavigateRef = { current: vi.fn() };
const mockMutate = vi.fn();
const mockInvalidate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: () => mockNavigateRef.current,
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

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

const newsSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must be at most 200 characters'),
  slug: z.string().min(1, 'Slug is required').max(250).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  content: z.string().min(1, 'Content is required').transform((val) => stripHtml(val)).refine((val) => val.length > 0, 'Content is required'),
  excerpt: z.string().max(500, 'Excerpt must be at most 500 characters').optional().or(z.literal('')),
  featuredImage: z.union([z.instanceof(File), z.string()]).optional().nullable(),
  category: z.enum(['Announcement', 'News', 'Event Recap', 'Press Release']),
  status: z.enum(['draft', 'published', 'archived']),
  publishedAt: z.string().datetime({ offset: true }).optional().nullable(),
});

describe('NewsForm Zod Schema', () => {
  describe('title validation', () => {
    test('rejects title shorter than 3 characters', () => {
      const result = newsSchema.safeParse({
        title: 'Ab',
        slug: 'test-slug',
        content: '<p>Valid content</p>',
        category: 'News',
        status: 'draft',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.path.includes('title'))).toBe(true);
      }
    });

    test('rejects title longer than 200 characters', () => {
      const result = newsSchema.safeParse({
        title: 'x'.repeat(201),
        slug: 'test-slug',
        content: '<p>Valid content</p>',
        category: 'News',
        status: 'draft',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.path.includes('title'))).toBe(true);
      }
    });

    test('accepts valid title', () => {
      const result = newsSchema.safeParse({
        title: 'Valid Article Title',
        slug: 'test-slug',
        content: '<p>Valid content</p>',
        category: 'News',
        status: 'draft',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('slug validation', () => {
    test('rejects slug with uppercase letters', () => {
      const result = newsSchema.safeParse({
        title: 'Test',
        slug: 'Test-Slug',
        content: '<p>Content</p>',
        category: 'News',
        status: 'draft',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.path.includes('slug'))).toBe(true);
      }
    });

    test('rejects slug with special characters', () => {
      const result = newsSchema.safeParse({
        title: 'Test',
        slug: 'test@slug!',
        content: '<p>Content</p>',
        category: 'News',
        status: 'draft',
      });
      expect(result.success).toBe(false);
    });

    test('accepts valid slug with hyphens and numbers', () => {
      const result = newsSchema.safeParse({
        title: 'Test',
        slug: 'test-slug-123',
        content: '<p>Content</p>',
        category: 'News',
        status: 'draft',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('content validation', () => {
    test('rejects empty content', () => {
      const result = newsSchema.safeParse({
        title: 'Test',
        slug: 'test-slug',
        content: '',
        category: 'News',
        status: 'draft',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.path.includes('content'))).toBe(true);
      }
    });

    test('rejects content that is only empty HTML tags', () => {
      const result = newsSchema.safeParse({
        title: 'Test',
        slug: 'test-slug',
        content: '<p></p>',
        category: 'News',
        status: 'draft',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.path.includes('content'))).toBe(true);
      }
    });

    test('rejects content with only whitespace HTML', () => {
      const result = newsSchema.safeParse({
        title: 'Test',
        slug: 'test-slug',
        content: '<p>   </p>',
        category: 'News',
        status: 'draft',
      });
      expect(result.success).toBe(false);
    });

    test('accepts valid HTML content', () => {
      const result = newsSchema.safeParse({
        title: 'Test',
        slug: 'test-slug',
        content: '<p>Valid content here</p>',
        category: 'News',
        status: 'draft',
      });
      expect(result.success).toBe(true);
    });

    test('accepts content with multiple HTML tags', () => {
      const result = newsSchema.safeParse({
        title: 'Test',
        slug: 'test-slug',
        content: '<h2>Heading</h2><p>Paragraph with <strong>bold</strong> text.</p>',
        category: 'News',
        status: 'draft',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('excerpt validation', () => {
    test('rejects excerpt longer than 500 characters', () => {
      const result = newsSchema.safeParse({
        title: 'Test',
        slug: 'test-slug',
        content: '<p>Content</p>',
        excerpt: 'x'.repeat(501),
        category: 'News',
        status: 'draft',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.path.includes('excerpt'))).toBe(true);
      }
    });

    test('accepts valid excerpt', () => {
      const result = newsSchema.safeParse({
        title: 'Test',
        slug: 'test-slug',
        content: '<p>Content</p>',
        excerpt: 'Valid excerpt',
        category: 'News',
        status: 'draft',
      });
      expect(result.success).toBe(true);
    });

    test('accepts empty excerpt', () => {
      const result = newsSchema.safeParse({
        title: 'Test',
        slug: 'test-slug',
        content: '<p>Content</p>',
        excerpt: '',
        category: 'News',
        status: 'draft',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('category validation', () => {
    test('accepts Announcement', () => {
      const result = newsSchema.safeParse({
        title: 'Test',
        slug: 'test-slug',
        content: '<p>Content</p>',
        category: 'Announcement',
        status: 'draft',
      });
      expect(result.success).toBe(true);
    });

    test('accepts News', () => {
      const result = newsSchema.safeParse({
        title: 'Test',
        slug: 'test-slug',
        content: '<p>Content</p>',
        category: 'News',
        status: 'draft',
      });
      expect(result.success).toBe(true);
    });

    test('accepts Event Recap', () => {
      const result = newsSchema.safeParse({
        title: 'Test',
        slug: 'test-slug',
        content: '<p>Content</p>',
        category: 'Event Recap',
        status: 'draft',
      });
      expect(result.success).toBe(true);
    });

    test('accepts Press Release', () => {
      const result = newsSchema.safeParse({
        title: 'Test',
        slug: 'test-slug',
        content: '<p>Content</p>',
        category: 'Press Release',
        status: 'draft',
      });
      expect(result.success).toBe(true);
    });

    test('rejects invalid category', () => {
      const result = newsSchema.safeParse({
        title: 'Test',
        slug: 'test-slug',
        content: '<p>Content</p>',
        category: 'Invalid',
        status: 'draft',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('status validation', () => {
    test('accepts draft', () => {
      const result = newsSchema.safeParse({
        title: 'Test',
        slug: 'test-slug',
        content: '<p>Content</p>',
        category: 'News',
        status: 'draft',
      });
      expect(result.success).toBe(true);
    });

    test('accepts published', () => {
      const result = newsSchema.safeParse({
        title: 'Test',
        slug: 'test-slug',
        content: '<p>Content</p>',
        category: 'News',
        status: 'published',
      });
      expect(result.success).toBe(true);
    });

    test('accepts archived', () => {
      const result = newsSchema.safeParse({
        title: 'Test',
        slug: 'test-slug',
        content: '<p>Content</p>',
        category: 'News',
        status: 'archived',
      });
      expect(result.success).toBe(true);
    });

    test('rejects invalid status', () => {
      const result = newsSchema.safeParse({
        title: 'Test',
        slug: 'test-slug',
        content: '<p>Content</p>',
        category: 'News',
        status: 'invalid',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('publishedAt validation', () => {
    test('accepts valid ISO datetime', () => {
      const result = newsSchema.safeParse({
        title: 'Test',
        slug: 'test-slug',
        content: '<p>Content</p>',
        category: 'News',
        status: 'published',
        publishedAt: '2026-07-15T10:00:00Z',
      });
      expect(result.success).toBe(true);
    });

    test('rejects invalid datetime', () => {
      const result = newsSchema.safeParse({
        title: 'Test',
        slug: 'test-slug',
        content: '<p>Content</p>',
        category: 'News',
        status: 'published',
        publishedAt: 'not-a-date',
      });
      expect(result.success).toBe(false);
    });

    test('accepts null publishedAt', () => {
      const result = newsSchema.safeParse({
        title: 'Test',
        slug: 'test-slug',
        content: '<p>Content</p>',
        category: 'News',
        status: 'draft',
        publishedAt: null,
      });
      expect(result.success).toBe(true);
    });

    test('accepts undefined publishedAt', () => {
      const result = newsSchema.safeParse({
        title: 'Test',
        slug: 'test-slug',
        content: '<p>Content</p>',
        category: 'News',
        status: 'draft',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('featuredImage validation', () => {
    test('accepts File instance', () => {
      const file = new File(['dummy'], 'photo.png', { type: 'image/png' });
      const result = newsSchema.shape.featuredImage.safeParse(file);
      expect(result.success).toBe(true);
    });

    test('accepts string URL', () => {
      const result = newsSchema.shape.featuredImage.safeParse('https://example.com/photo.jpg');
      expect(result.success).toBe(true);
    });

    test('accepts undefined', () => {
      const result = newsSchema.safeParse({
        title: 'Test',
        slug: 'test-slug',
        content: '<p>Content</p>',
        category: 'News',
        status: 'draft',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('complete valid article', () => {
    test('accepts fully valid article data', () => {
      const result = newsSchema.safeParse({
        title: 'Complete Article',
        slug: 'complete-article',
        content: '<p>Full content here</p>',
        excerpt: 'A brief summary',
        featuredImage: 'https://example.com/image.jpg',
        category: 'Announcement',
        status: 'published',
        publishedAt: '2026-07-15T10:00:00Z',
      });
      expect(result.success).toBe(true);
    });
  });
});

describe('NewsFormPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigateRef.current = vi.fn();
    mockMutate.mockReset();
    mockInvalidate.mockReset();

    (vi.mocked(useMutation) as any).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    });
    (vi.mocked(useQueryClient) as any).mockReturnValue({ invalidateQueries: mockInvalidate });
    (vi.mocked(useQuery) as any).mockReturnValue({ data: undefined, isLoading: false });
    (vi.mocked(useParams) as any).mockReturnValue({});
  });

  describe('edit mode', () => {

    test('does not crash while article query is loading and renders form fields', () => {
      (vi.mocked(useParams) as any).mockReturnValue({ id: 'news-1' });
      (vi.mocked(useQuery) as any).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
      });

      render(
        <MemoryRouter>
          <NewsFormPage />
        </MemoryRouter>
      );

      expect(screen.getByLabelText('Title')).toBeInTheDocument();
      expect(screen.getByLabelText('Slug')).toBeInTheDocument();
    });
  });

  describe('create mode', () => {

    test('slug auto-generates from title when not manually edited', () => {
      render(
        <MemoryRouter>
          <NewsFormPage />
        </MemoryRouter>
      );

      const titleInput = screen.getByLabelText('Title');
      fireEvent.change(titleInput, { target: { value: 'My New Article' } });

      const slugInput = screen.getByLabelText('Slug');
      expect(slugInput).toHaveValue('my-new-article');
    });

    test('slug stops auto-generating after manual edit', () => {
      render(
        <MemoryRouter>
          <NewsFormPage />
        </MemoryRouter>
      );

      const titleInput = screen.getByLabelText('Title');
      const slugInput = screen.getByLabelText('Slug');

      fireEvent.change(titleInput, { target: { value: 'My New Article' } });
      expect(slugInput).toHaveValue('my-new-article');

      fireEvent.change(slugInput, { target: { value: 'custom-slug-123' } });
      fireEvent.change(titleInput, { target: { value: 'Completely Different Title' } });

      expect(slugInput).toHaveValue('custom-slug-123');
    });

    test('shows spinner and disables button during mutation', () => {
      (vi.mocked(useMutation) as any).mockReturnValue({
        mutate: mockMutate,
        isPending: true,
        isSuccess: false,
        isError: false,
        error: null,
      });

      render(
        <MemoryRouter>
          <NewsFormPage />
        </MemoryRouter>
      );

      const submitButton = screen.getByRole('button', { name: /saving/i });
      expect(submitButton).toBeDisabled();
      expect(submitButton.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('edit mode', () => {
    beforeEach(() => {
      (vi.mocked(useParams) as any).mockReturnValue({ id: publishedArticle.id });
      (vi.mocked(useQuery) as any).mockReturnValue({ data: publishedArticle, isLoading: false });
    });

    test('shows "Edit Article" heading', () => {
      render(
        <MemoryRouter>
          <NewsFormPage />
        </MemoryRouter>
      );

      expect(screen.getByRole('heading', { name: /edit article/i })).toBeInTheDocument();
    });

    test('pre-fills title, slug, and excerpt', () => {
      render(
        <MemoryRouter>
          <NewsFormPage />
        </MemoryRouter>
      );

      expect(screen.getByLabelText('Title')).toHaveValue(publishedArticle.title);
      expect(screen.getByLabelText('Slug')).toHaveValue(publishedArticle.slug);
      expect(screen.getByLabelText(/excerpt/i)).toHaveValue(publishedArticle.excerpt);
    });
  });

  describe('char count accessibility', () => {
    test('char count spans have aria-live="polite"', () => {
      render(
        <MemoryRouter>
          <NewsFormPage />
        </MemoryRouter>
      );

      const charCounts = screen.getAllByText(/\d+\/\d+/);
      expect(charCounts.length).toBeGreaterThanOrEqual(2);
      charCounts.forEach(el => {
        expect(el).toHaveAttribute('aria-live', 'polite');
      });
    });
  });

  describe('featured image upload', () => {
    test('renders file upload area', () => {
      render(
        <MemoryRouter>
          <NewsFormPage />
        </MemoryRouter>
      );

      expect(screen.getByLabelText('Upload image')).toBeInTheDocument();
    });
  });
});