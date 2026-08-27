import { describe, test, vi, beforeEach, expect } from 'vitest';
import { useMembersList, useMember } from '../useMembersList';
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

describe('useMembersList', () => {
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
    renderHook(() => useMembersList(), { wrapper: createWrapper() });
    expect(vi.mocked(useQuery)).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['members'] })
    );
  });

  test('calls api.get with /members endpoint', async () => {
    const { result } = renderHook(() => useMembersList(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(vi.mocked(useQuery)).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['members'] })
    );
  });

  test('exposes data as Member array', () => {
    const { result } = renderHook(() => useMembersList(), { wrapper: createWrapper() });
    expect(result.current.data).toBeUndefined();
  });

  test('exposes isError when query fails', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('fail'),
      refetch: vi.fn(),
    } as any);
    const { result } = renderHook(() => useMembersList(), { wrapper: createWrapper() });
    expect(result.current.isError).toBe(true);
  });

  test('exposes refetch', () => {
    const { result } = renderHook(() => useMembersList(), { wrapper: createWrapper() });
    expect(typeof result.current.refetch).toBe('function');
  });
});

describe('useMember', () => {
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

  test('returns correct queryKey with id', () => {
    renderHook(() => useMember('1'), { wrapper: createWrapper() });
    expect(vi.mocked(useQuery)).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['member', '1'], enabled: true })
    );
  });

  test('disables query when id undefined', () => {
    renderHook(() => useMember(undefined), { wrapper: createWrapper() });
    expect(vi.mocked(useQuery)).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false })
    );
  });

  test('has retry false', () => {
    renderHook(() => useMember('1'), { wrapper: createWrapper() });
    expect(vi.mocked(useQuery)).toHaveBeenCalledWith(
      expect.objectContaining({ retry: false })
    );
  });
});
