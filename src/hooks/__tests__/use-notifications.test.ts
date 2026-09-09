import { describe, test, expect, vi, afterEach, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth";
import { useNotifications } from "../use-notifications";

vi.mock("@/contexts/auth", () => ({
  useAuth: vi.fn(),
}));

function mockLoggedOut() {
  vi.mocked(useAuth).mockReturnValue({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    refreshUser: vi.fn(),
    loading: false,
  } as never);
}

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
    mockLoggedOut();
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

  test("disables polling when logged out so anonymous 401s never fire auth:expired", () => {
    renderHook(() => useNotifications());
    const options = vi.mocked(useQuery).mock.calls[0][0];
    expect(options.enabled).toBe(false);
  });

  test("enables polling when authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: "1" },
      isAuthenticated: true,
      isAdmin: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
      loading: false,
    } as never);
    renderHook(() => useNotifications());
    const options = vi.mocked(useQuery).mock.calls[0][0];
    expect(options.enabled).toBe(true);
  });

  test("disables retries so an expired session surfaces exactly one expired flow", () => {
    renderHook(() => useNotifications());
    expect(vi.mocked(useQuery).mock.calls[0][0].retry).toBe(false);
  });
});
