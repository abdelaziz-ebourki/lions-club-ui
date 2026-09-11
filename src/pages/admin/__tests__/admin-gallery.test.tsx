import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminGalleryPage } from '../admin-gallery';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { galleryItems } from '@/mocks/data/gallery';
import { describe, test, vi, beforeEach, expect } from 'vitest';

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const mockQueryClient = { invalidateQueries: vi.fn() };
const mockMutate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
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
  (useQueryClient as ReturnType<typeof vi.fn>).mockReturnValue(mockQueryClient);
});

describe('AdminGalleryPage', () => {
  describe('loading state', () => {
    test('shows skeleton while loading', () => {
      vi.mocked(useQuery).mockReturnValue({ data: undefined, isLoading: true } as never);
      render(<AdminGalleryPage />);
      expect(screen.getByText('Manage Gallery')).toBeInTheDocument();
      expect(document.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
    });
  });

  describe('list rendering', () => {
    beforeEach(() => {
      const mockEvents = [
        { id: '1', title: 'Annual Charity Gala 2026' },
        { id: '2', title: 'Community Clean-Up Day' },
      ];
      (useQuery as ReturnType<typeof vi.fn>).mockImplementation((options: any) => {
        const key = options?.queryKey;
        if (Array.isArray(key) && key[0] === 'events') {
          return { data: mockEvents, isLoading: false, isError: false, error: null };
        }
        return {
          data: galleryItems,
          isLoading: false,
          isError: false,
          error: null,
          refetch: vi.fn(),
        };
      });
      (useMutation as ReturnType<typeof vi.fn>).mockReturnValue({
        mutate: mockMutate, isPending: false, isSuccess: false, isError: false, error: null,
      });
    });

    test('renders table with item rows including title, category and tags', () => {
      render(<AdminGalleryPage />);
      expect(screen.getAllByText('Charity Gala Evening').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Vision Screening Day').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Event|Project|Team|Community|Partner/).length).toBeGreaterThanOrEqual(galleryItems.length);
      expect(screen.getByText('gala, fundraising, 2026')).toBeInTheDocument();
    });

    test('renders Event column with linked event title for items with eventId', () => {
      render(<AdminGalleryPage />);
      // Event column should show "Annual Charity Gala 2026" for first item
      expect(screen.getByText('Annual Charity Gala 2026')).toBeInTheDocument();
    });

    test('renders Event column with placeholder for items without event link', () => {
      render(<AdminGalleryPage />);
      // Event column should show "—" for items without eventId
      expect(screen.getAllByText('—').length).toBeGreaterThan(0);
    });

    test('mobile card shows linked event for items with eventId', () => {
      render(<AdminGalleryPage />);
      const cards = screen.getAllByTestId('gallery-mobile-card');
      expect(within(cards[0]).getByText(/Annual Charity Gala 2026/)).toBeInTheDocument();
    });

    test('renders mobile card layout alongside desktop table', () => {
      render(<AdminGalleryPage />);
      expect(screen.getAllByTestId('gallery-mobile-card').length).toBe(galleryItems.length);
    });

    test('provides New Item action and per-row edit links', () => {
      render(<AdminGalleryPage />);
      expect(screen.getByRole('link', { name: /new item/i })).toBeInTheDocument();
      // rendered in both desktop table and mobile cards
      expect(screen.getAllByRole('link', { name: /edit item/i }).length).toBe(galleryItems.length * 2);
    });

    test('delete confirmation cancel keeps the item', async () => {
      const user = userEvent.setup();
      render(<AdminGalleryPage />);
      await user.click(screen.getAllByRole('button', { name: /delete item/i })[0]);
      await user.click(await screen.findByRole('button', { name: /^cancel$/i }));
      expect(screen.getAllByText('Charity Gala Evening').length).toBeGreaterThanOrEqual(1);
      expect(mockMutate).not.toHaveBeenCalled();
    });

    test('delete confirm triggers mutation for that item', async () => {
      const user = userEvent.setup();
      render(<AdminGalleryPage />);
      await user.click(screen.getAllByRole('button', { name: /delete item/i })[0]);
      await user.click(await screen.findByRole('button', { name: /^delete$/i }));
      expect(mockMutate).toHaveBeenCalledWith(galleryItems[0].id);
    });

    test('error state shows retry action', async () => {
      const refetch = vi.fn();
      (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
        data: undefined, isLoading: false, isError: true, error: new Error('x'), refetch,
      });
      const user = userEvent.setup();
      render(<AdminGalleryPage />);
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: /try again/i }));
      expect(refetch).toHaveBeenCalled();
    });

    test('edit and delete buttons expose accessible names', () => {
      (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
        data: galleryItems, isLoading: false, isError: false, error: null, refetch: vi.fn(),
      });
      render(<AdminGalleryPage />);
      expect(screen.getAllByRole('link', { name: /edit item charity gala evening/i }).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByRole('button', { name: /delete item charity gala evening/i }).length).toBeGreaterThanOrEqual(1);
    });
  });
});
