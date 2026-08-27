import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GalleryFormPage } from '../gallery-form';
import { galleryItems } from '@/mocks/data/gallery';
import { describe, test, vi, beforeEach, expect } from 'vitest';

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>();
  return {
    ...actual,
    useQuery: vi.fn(),
    useMutation: vi.fn(),
    useQueryClient: vi.fn(),
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn(() => vi.fn()),
    Link: ({ children, to, ...props }: any) => React.createElement('a', { href: to, ...props }, children),
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

beforeEach(() => {
  vi.clearAllMocks();
  (useParams as ReturnType<typeof vi.fn>).mockReturnValue({});
  (useQuery as ReturnType<typeof vi.fn>).mockImplementation(((options: { queryKey?: unknown[] }) => {
    const isAdminItem = options?.queryKey?.[1] === "admin";
    return {
      data: isAdminItem ? undefined : [],
      isLoading: false,
      isError: false,
      error: null,
    };
  }) as never);
  (useQueryClient as ReturnType<typeof vi.fn>).mockReturnValue({ invalidateQueries: vi.fn() });
  (useMutation as ReturnType<typeof vi.fn>).mockReturnValue({
    mutate: vi.fn(), isPending: false, isSuccess: false, isError: false, error: null,
  });
});

function mockAdminItem(item: unknown, isLoading = false) {
  (useQuery as ReturnType<typeof vi.fn>).mockImplementation(((options: { queryKey?: unknown[] }) => ({
    data: options?.queryKey?.[1] === "admin" ? item : [],
    isLoading,
    isError: false,
    error: null,
  })) as never);
}

describe('GalleryFormPage', () => {
  describe('create mode', () => {
    test('renders all metadata fields including image upload and tags', () => {
      render(
        <MemoryRouter>
          <GalleryFormPage />
        </MemoryRouter>,
      );
      expect(screen.getByLabelText('Title')).toBeInTheDocument();
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
      expect(screen.getByLabelText('Category')).toBeInTheDocument();
      expect(screen.getByLabelText('Event link')).toBeInTheDocument();
      expect(screen.getByLabelText('Tags')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
    });

    test('inline validation blocks submission with missing required fields', async () => {
      const user = (await import('@testing-library/user-event')).default.setup();
      render(
        <MemoryRouter>
          <GalleryFormPage />
        </MemoryRouter>,
      );
      await user.click(screen.getByRole('button', { name: /create item/i }));
      expect(await screen.findByText(/title must be at least 3 characters/i)).toBeInTheDocument();
    });
  });

  describe('edit mode', () => {
    const item = galleryItems[0];

    test('does not crash while article query is loading and renders fields', () => {
      (useParams as ReturnType<typeof vi.fn>).mockReturnValue({ id: item.id });
      mockAdminItem(undefined, true);
      render(
        <MemoryRouter>
          <GalleryFormPage />
        </MemoryRouter>,
      );
      expect(screen.getByLabelText('Title')).toBeInTheDocument();
    });

    test('pre-fills form with existing item metadata', async () => {
      (useParams as ReturnType<typeof vi.fn>).mockReturnValue({ id: item.id });
      mockAdminItem(item);
      render(
        <MemoryRouter>
          <GalleryFormPage />
        </MemoryRouter>,
      );
      const title = await screen.findByLabelText('Title');
      expect((title as HTMLInputElement).value).toBe(item.title);
      expect((screen.getByLabelText('Tags') as HTMLInputElement).value).toBe(item.tags.join(', '));
    });

    test('image upload rejects invalid file type with inline error', () => {
      render(
        <MemoryRouter>
          <GalleryFormPage />
        </MemoryRouter>,
      );
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['x'], 'doc.pdf', { type: 'application/pdf' });
      Object.defineProperty(input, 'files', { value: [file] });
      fireEvent.change(input);
      expect(screen.getByText(/please select a valid image file/i)).toBeInTheDocument();
    });
  });
});
