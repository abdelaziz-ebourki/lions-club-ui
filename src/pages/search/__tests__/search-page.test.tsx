import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";

const mockSearchParams = vi.hoisted(() => new URLSearchParams());
const mockSetSearchParams = vi.hoisted(() => vi.fn());
const mockUseQuery = vi.hoisted(() => vi.fn());
const mockUseAuth = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useSearchParams: () => [mockSearchParams, mockSetSearchParams],
    Link: ({ children, to, ...props }: { children: React.ReactNode; to: string }) =>
      React.createElement("a", { href: to, ...props }, children),
  };
});

vi.mock("@/lib/search", () => ({
  searchAll: vi.fn(),
  sanitizeQuery: (raw: string) => ({
    raw,
    sanitized: raw.trim().slice(0, 200),
    length: raw.trim().slice(0, 200).length,
    isEmpty: raw.trim().length === 0,
  }),
}));

vi.mock("@/contexts/auth", () => ({
  useAuth: mockUseAuth,
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: mockUseQuery,
}));

import { SearchPage } from "../search-page";

beforeEach(() => {
  vi.clearAllMocks();
  mockSearchParams.delete("q");
  mockUseAuth.mockReturnValue({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
  });
  mockUseQuery.mockReturnValue({
    data: undefined,
    isFetching: false,
    error: null,
    refetch: vi.fn(),
  });
});

describe("SearchPage", () => {
  test("shows empty state when no query param", () => {
    render(<SearchPage />);
    expect(screen.getByText(/type a query/i)).toBeInTheDocument();
  });

  test("shows loading state while searching", () => {
    mockSearchParams.set("q", "test");
    mockUseQuery.mockReturnValue({
      data: undefined,
      isFetching: true,
      error: null,
      refetch: vi.fn(),
    });
    render(<SearchPage />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  test("passes query string and isAdmin=false to useQuery for non-admin", () => {
    mockSearchParams.set("q", "cleanup");
    render(<SearchPage />);
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["search", "cleanup", false],
        enabled: true,
      }),
    );
  });

  test("passes query string and isAdmin=true to useQuery for admin", () => {
    mockUseAuth.mockReturnValue({
      user: { id: "1", name: "Admin", role: "admin" },
      isAuthenticated: true,
      isAdmin: true,
    });
    mockSearchParams.set("q", "cleanup");
    render(<SearchPage />);
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["search", "cleanup", true],
        enabled: true,
      }),
    );
  });
});
