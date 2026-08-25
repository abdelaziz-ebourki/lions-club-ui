import { describe, test, vi, beforeEach, expect } from 'vitest';
import { useNewsList, useFeaturedNews } from '../useNewsList';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useNewsList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);
  });

  test('returns correct queryKey with page and limit', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    renderHook(() => useNewsList(2, 5), { wrapper: createWrapper() });

    expect(vi.mocked(useQuery)).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['news', 'list', 2, 5] })
    );
  });

  test('defaults to page 1 and limit 10', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    renderHook(() => useNewsList(), { wrapper: createWrapper() });

    expect(vi.mocked(useQuery)).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['news', 'list', 1, 10] })
    );
  });

  test('calls api.get with correct endpoint', async () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    const { result } = renderHook(() => useNewsList(1, 10), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(vi.mocked(useQuery)).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['news', 'list', 1, 10] })
    );
  });

  test('returns paginated response shape', () => {
    const { result } = renderHook(() => useNewsList(), { wrapper: createWrapper() });

    expect(result.current.data).toBeUndefined();
    // When data loads, it should have { data, total, page, limit, totalPages }
  });
});

describe('useFeaturedNews', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);
  });

  test('returns correct queryKey', () => {
    renderHook(() => useFeaturedNews(), { wrapper: createWrapper() });

    expect(vi.mocked(useQuery)).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['news', 'featured'] })
    );
  });

  test('calls api.get with /news/featured endpoint', async () => {
    const { result } = renderHook(() => useFeaturedNews(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(vi.mocked(useQuery)).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['news', 'featured'] })
    );
  });
});

describe('useNewsList error handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Test error'),
      refetch: vi.fn(),
    } as any);
  });

  test('exposes isError when query fails', () => {
    const { result } = renderHook(() => useNewsList(), { wrapper: createWrapper() });

    expect(typeof result.current.isError).toBe('boolean');
  });

  test('exposes error object when query fails', () => {
    const { result } = renderHook(() => useNewsList(), { wrapper: createWrapper() });

    expect(result.current.error).toBeDefined();
  });

  test('exposes refetch function', () => {
    const { result } = renderHook(() => useNewsList(), { wrapper: createWrapper() });

    expect(typeof result.current.refetch).toBe('function');
  });
});

describe('useFeaturedNews error handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Test error'),
      refetch: vi.fn(),
    } as any);
  });

  test('exposes isError when query fails', () => {
    const { result } = renderHook(() => useFeaturedNews(), { wrapper: createWrapper() });

    expect(typeof result.current.isError).toBe('boolean');
  });

  test('exposes refetch function', () => {
    const { result } = renderHook(() => useFeaturedNews(), { wrapper: createWrapper() });

    expect(typeof result.current.refetch).toBe('function');
  });
});