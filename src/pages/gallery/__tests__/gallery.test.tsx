import { render, screen, waitFor, within, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { describe, test, vi, beforeEach, expect } from 'vitest';
import { GalleryPage } from '../gallery';
import { useGalleryList, useGalleryItem } from '@/hooks/useGalleryList';
import { galleryItems } from '@/mocks/data/gallery';

vi.mock('@/hooks/useGalleryList');

// Global setup.ts stubs useParams to {}; override with controllable params.
const routeParams: Record<string, string | undefined> = {};
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useParams: vi.fn(() => routeParams) };
});
const mockDeepLink = { data: undefined as unknown, isLoading: false, isError: false, error: null as unknown };
vi.mocked(useGalleryItem).mockReturnValue(mockDeepLink as never);
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>();
  return { ...actual, useQuery: vi.fn() };
});

const mockRefetch = vi.fn();

function mockList(overrides: Record<string, unknown> = {}) {
  vi.mocked(useGalleryList).mockClear().mockReturnValue({
    data: { data: galleryItems, total: galleryItems.length, page: 1, limit: 12, totalPages: 1 },
    isLoading: false,
    isError: false,
    error: null,
    refetch: mockRefetch,
    ...overrides,
  } as never);
}

function renderPage() {
  return render(
    <MemoryRouter>
      <GalleryPage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  Object.keys(routeParams).forEach((k) => delete routeParams[k]);
  vi.mocked(useQuery).mockReturnValue({ data: [] as { id: string; title: string }[], isLoading: false } as never);
  mockDeepLink.data = undefined;
  mockDeepLink.isError = false;
  mockDeepLink.error = null;
  mockList();
});

describe('GalleryPage', () => {
  describe('loading state', () => {
    test('shows skeleton grid while loading', () => {
      mockList({ data: undefined, isLoading: true });
      renderPage();
      expect(document.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
    });
  });

  describe('grid rendering', () => {
    test('renders cards sorted newest-first with title and category badge', () => {
      renderPage();
      const titles = screen.getAllByTestId('gallery-card-title').map((el) => el.textContent);
      expect(titles).toEqual(galleryItems.map((i) => i.title));
      expect(screen.getAllByText(/Event|Project|Team|Community|Partner/).length).toBeGreaterThanOrEqual(galleryItems.length);
    });

    test('uses thumbnailUrl when present', () => {
      renderPage();
      const img = screen.getByAltText(galleryItems[0].title) as HTMLImageElement;
      expect(img.src).toContain(galleryItems[0].thumbnailUrl!);
    });

    test('falls back to imageUrl when no thumbnail exists', () => {
      const item = galleryItems.find((i) => !i.thumbnailUrl)!;
      renderPage();
      const img = screen.getByAltText(item.title) as HTMLImageElement;
      expect(img.src).toContain(item.imageUrl);
    });
  });

  describe('filters', () => {
    test('selecting a category narrows results via query params', async () => {
      const user = userEvent.setup();
      renderPage();
      await user.click(screen.getByRole('combobox', { name: 'Filter by category' }));
      await user.click(screen.getByRole('option', { name: 'Event' }));
      const lastCall = vi.mocked(useGalleryList).mock.calls.at(-1);
      expect(lastCall?.[2]).toMatchObject({ category: 'Event' });
    });

    test('selecting an event narrows results', async () => {
      vi.mocked(useQuery).mockReturnValue({
        data: [{ id: '1', title: 'Annual Charity Gala 2026' }],
        isLoading: false,
      } as never);
      const user = userEvent.setup();
      renderPage();
      await user.click(screen.getByRole('combobox', { name: 'Filter by event' }));
      await user.click(screen.getByRole('option', { name: 'Annual Charity Gala 2026' }));
      const lastCall = vi.mocked(useGalleryList).mock.calls.at(-1);
      expect(lastCall?.[2]).toMatchObject({ eventId: '1' });
    });

    test('clearing filters restores unfiltered query', async () => {
      const user = userEvent.setup();
      renderPage();
      await user.click(screen.getByRole('combobox', { name: 'Filter by category' }));
      await user.click(screen.getByRole('option', { name: 'All categories' }));
      const lastCall = vi.mocked(useGalleryList).mock.calls.at(-1);
      expect(lastCall?.[2]).toMatchObject({ category: '' });
    });
  });

  describe('empty state', () => {
    test('shows empty state message when no items exist', () => {
      mockList({ data: { data: [], total: 0, page: 1, limit: 12, totalPages: 0 } });
      renderPage();
      expect(screen.getByText('No photos yet')).toBeInTheDocument();
    });

    test('shows filter-specific empty state with clear action when category filter active', async () => {
      const user = userEvent.setup();
      mockList({ data: { data: [], total: 0, page: 1, limit: 12, totalPages: 0 } });
      renderPage();
      await user.click(screen.getByRole('combobox', { name: 'Filter by category' }));
      await user.click(screen.getByRole('option', { name: 'Event' }));
      expect(screen.getByText(/no photos match/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();
    });

    test('shows filter-specific empty state with clear action when event filter active', async () => {
      vi.mocked(useQuery).mockReturnValue({
        data: [{ id: '1', title: 'Annual Charity Gala 2026' }],
        isLoading: false,
      } as never);
      const user = userEvent.setup();
      mockList({ data: { data: [], total: 0, page: 1, limit: 12, totalPages: 0 } });
      renderPage();
      await user.click(screen.getByRole('combobox', { name: 'Filter by event' }));
      await user.click(screen.getByRole('option', { name: 'Annual Charity Gala 2026' }));
      expect(screen.getByText(/no photos match/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    test('shows error state with working retry action', async () => {
      const user = userEvent.setup();
      mockList({ data: undefined, isError: true });
      renderPage();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: /try again/i }));
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  describe('pagination', () => {
    test('shows pagination controls and fetches next page', async () => {
      const user = userEvent.setup();
      mockList({ data: { data: galleryItems.slice(0, 12), total: galleryItems.length, page: 1, limit: 12, totalPages: 2 } });
      renderPage();
      expect(screen.getByTestId('gallery-pagination')).toHaveTextContent('Page 1 of 2');
      await user.click(screen.getByRole('button', { name: 'Next' }));
      expect(vi.mocked(useGalleryList).mock.calls.at(-1)?.[0]).toBe(2);
    });
  });
});

describe('GalleryPage — lightbox (US3)', () => {
  const firstItem = galleryItems[0];

  function renderAt(path = '/gallery') {
    return render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/gallery/:id" element={<GalleryPage />} />
        </Routes>
      </MemoryRouter>,
    );
  }

  beforeEach(() => {
    mockList();
    mockDeepLink.data = undefined;
    mockDeepLink.isError = false;
    mockDeepLink.error = null;
    Object.keys(routeParams).forEach((k) => delete routeParams[k]);
    vi.mocked(useQuery).mockReturnValue({ data: [], isLoading: false } as never);
  });

  test('opens lightbox with enlarged image and metadata when a photo is clicked', async () => {
    const user = userEvent.setup();
    renderAt();
    await user.click(screen.getByRole('button', { name: new RegExp(firstItem.title) }));
    await screen.findByRole('dialog');
    const meta = await screen.findByTestId('lightbox-metadata');
    expect(within(meta).getByText(firstItem.title)).toBeInTheDocument();
    expect(within(meta).getByText(firstItem.category)).toBeInTheDocument();
    expect(within(meta).getAllByText(/gala/).length).toBeGreaterThan(0);
  });

  test('lightbox slide uses full-resolution imageUrl (not thumbnail)', async () => {
    const user = userEvent.setup();
    renderAt();
    await user.click(screen.getByRole('button', { name: new RegExp(firstItem.title) }));
    await screen.findByRole('dialog');
    // YARL renders slides - find element with imageUrl in src or background-image
    const allElements = document.body.querySelectorAll('*');
    const slideElement = Array.from(allElements).find(
      (el) => (el as HTMLImageElement).src?.includes(firstItem.imageUrl) ||
              (el as HTMLElement).style.backgroundImage?.includes(firstItem.imageUrl)
    );
    expect(slideElement).toBeDefined();
    if (slideElement) {
      const src = (slideElement as HTMLImageElement).src || (slideElement as HTMLElement).style.backgroundImage;
      expect(src).toContain(firstItem.imageUrl);
      expect(src).not.toContain(firstItem.thumbnailUrl!);
    }
  });

  test('navigates between photos wrapping at both ends (keyboard verified in browser E2E)', async () => {
    const user = userEvent.setup();
    renderAt();
    await user.click(screen.getByRole('button', { name: new RegExp(galleryItems[0].title) }));
    await screen.findByRole('dialog');
    const meta = await screen.findByTestId('lightbox-metadata');
    expect(meta).toHaveTextContent(galleryItems[0].title);
    // YARL renders prev/next controls; synthetic trusted-key events are validated by Playwright E2E.
    const prev = await screen.findByLabelText(/previous/i);
    const next = await screen.findByLabelText(/next/i);
    await user.click(prev);
    await waitFor(() => expect(meta).toHaveTextContent(galleryItems[galleryItems.length - 1].title));
    await user.click(next);
    await waitFor(() => expect(meta).toHaveTextContent(galleryItems[0].title));
    await user.click(next);
    await waitFor(() => expect(meta).toHaveTextContent(galleryItems[1].title));
  });

  test('Escape closes the lightbox and restores focus to the triggering card', async () => {
    const user = userEvent.setup();
    renderAt();
    const trigger = screen.getByRole('button', { name: new RegExp(galleryItems[1].title) });
    await user.click(trigger);
    const dialog = await screen.findByRole('dialog');
    fireEvent.keyDown(dialog, { key: 'Escape', bubbles: true });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  test('updates document.title while an item is open', async () => {
    const user = userEvent.setup();
    renderAt();
    await user.click(screen.getByRole('button', { name: new RegExp(firstItem.title) }));
    await screen.findByRole('dialog');
    expect(document.title).toBe(`${firstItem.title} | Lions Club FSBM`);
  });

  test('deep-link /gallery/:id opens the lightbox directly', async () => {
    routeParams.id = firstItem.id;
    mockDeepLink.data = firstItem;
    renderAt(`/gallery/${firstItem.id}`);
    await screen.findByRole('dialog');
    const meta = await screen.findByTestId('lightbox-metadata');
    expect(within(meta).getByText(firstItem.title)).toBeInTheDocument();
    expect(within(meta).getByText(firstItem.category)).toBeInTheDocument();
  });

  test('unknown deep-link id shows not-found state with back link', async () => {
    routeParams.id = 'nonexistent-id';
    mockDeepLink.isError = true;
    mockDeepLink.error = Object.assign(new Error('nf'), { status: 404 });
    renderAt('/gallery/nonexistent-id');
    expect(await screen.findByText('Photo not found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to gallery/i })).toBeInTheDocument();
  });
});
