import { describe, test, expect, vi, afterEach, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "../use-notifications";

const mockNotifications = {
  notifications: [
    {
      id: "n1",
      type: "forum_reply" as const,
      title: "New reply",
      description: "Someone replied",
      targetUrl: "/forum/thread-1",
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "n2",
      type: "event_update" as const,
      title: "Event changed",
      description: "Event rescheduled",
      targetUrl: "/events/e1",
      read: true,
      createdAt: new Date().toISOString(),
    },
  ],
  unreadCount: 1,
};

describe("use-notifications", () => {
  beforeEach(() => {
    vi.mocked(useQuery).mockReturnValue({
      data: mockNotifications,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useQuery>);

    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useMutation>);

    vi.mocked(useQueryClient).mockReturnValue({
      invalidateQueries: vi.fn(),
      setQueryData: vi.fn(),
      getQueryData: vi.fn(),
    } as unknown as ReturnType<typeof useQueryClient>);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("returns notifications and unread count", () => {
    const { result } = renderHook(() => useNotifications());

    expect(result.current.notifications).toHaveLength(2);
    expect(result.current.unreadCount).toBe(1);
  });

  test("returns loading state", () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useQuery>);

    const { result } = renderHook(() => useNotifications());

    expect(result.current.isLoading).toBe(true);
  });

  test("handles empty notifications", () => {
    vi.mocked(useQuery).mockReturnValue({
      data: { notifications: [], unreadCount: 0 },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useQuery>);

    const { result } = renderHook(() => useNotifications());

    expect(result.current.notifications).toHaveLength(0);
    expect(result.current.unreadCount).toBe(0);
  });

  test("uses refetchIntervalInBackground: false for polling", () => {
    renderHook(() => useNotifications());
    expect(vi.mocked(useQuery).mock.calls[0][0].refetchIntervalInBackground).toBe(false);
  });

  test("provides markAsRead and markAllRead functions", () => {
    const { result } = renderHook(() => useNotifications());

    expect(result.current.markAsRead).toBeDefined();
    expect(result.current.markAllRead).toBeDefined();
    expect(typeof result.current.markAsRead).toBe("function");
    expect(typeof result.current.markAllRead).toBe("function");
  });
});
