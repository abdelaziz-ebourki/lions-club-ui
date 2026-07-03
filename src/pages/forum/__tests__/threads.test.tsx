import { createElement } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";

const mockUseParams = vi.hoisted(() => vi.fn());
const mockUseQuery = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: mockUseParams,
    Link: ({ children, to, ...props }: { children: React.ReactNode; to: string }) =>
      createElement("a", { href: to, ...props }, children),
  };
});

vi.mock("@tanstack/react-query", () => ({
  useQuery: mockUseQuery,
}));

vi.mock("@/hooks/use-debounce", () => ({
  useDebounce: (value: string) => value,
}));

import { ThreadsPage } from "../threads";

const mockCategories = [{ id: "cat-1", name: "General", threadCount: 3, description: "", postCount: 0, icon: "" }];

const mockThreads = [
  {
    id: "t1",
    categoryId: "cat-1",
    title: "Summer Event Planning",
    author: "Alice",
    content: "Planning the summer charity event",
    createdAt: "2026-06-01",
    status: "active",
    replyCount: 5,
    viewCount: 100,
    lastActivity: "2026-06-15",
  },
  {
    id: "t2",
    categoryId: "cat-1",
    title: "Meeting Minutes",
    author: "Bob",
    content: "Minutes from the board meeting",
    createdAt: "2026-06-10",
    status: "pinned",
    replyCount: 2,
    viewCount: 50,
    lastActivity: "2026-06-14",
  },
  {
    id: "t3",
    categoryId: "cat-1",
    title: "Old Discussion",
    author: "Charlie",
    content: "An archived discussion thread",
    createdAt: "2026-05-01",
    status: "archived",
    replyCount: 0,
    viewCount: 10,
    lastActivity: "2026-05-15",
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  mockUseParams.mockReturnValue({ categoryId: "cat-1" });
});

describe("ThreadsPage", () => {
  test("shows threads with inline filter input", () => {
    mockUseQuery
      .mockReturnValueOnce({ data: mockCategories, isLoading: false, isError: false, refetch: vi.fn() })
      .mockReturnValue({ data: mockThreads, isLoading: false, isError: false, refetch: vi.fn() });
    render(<ThreadsPage />);
    expect(screen.getByPlaceholderText(/filter/i)).toBeInTheDocument();
  });

  test("filters threads by keyword in real-time", async () => {
    mockUseQuery
      .mockReturnValueOnce({ data: mockCategories, isLoading: false, isError: false, refetch: vi.fn() })
      .mockReturnValue({ data: mockThreads, isLoading: false, isError: false, refetch: vi.fn() });
    render(<ThreadsPage />);
    const input = screen.getByPlaceholderText(/filter/i);
    await userEvent.type(input, "summer");
    await waitFor(() => {
      expect(screen.getByText("Summer Event Planning")).toBeInTheDocument();
    }, { timeout: 2000 });
    expect(screen.queryByText("Meeting Minutes")).not.toBeInTheDocument();
    expect(screen.queryByText("Old Discussion")).not.toBeInTheDocument();
  });

  test("shows status filter dropdown", () => {
    mockUseQuery
      .mockReturnValueOnce({ data: mockCategories, isLoading: false, isError: false, refetch: vi.fn() })
      .mockReturnValue({ data: mockThreads, isLoading: false, isError: false, refetch: vi.fn() });
    render(<ThreadsPage />);
    expect(screen.getByLabelText(/filter by status/i)).toBeInTheDocument();
  });

  test("loading container has aria-busy='true' while loading", () => {
    mockUseQuery
      .mockReturnValueOnce({ data: mockCategories, isLoading: false, isError: false, refetch: vi.fn() })
      .mockReturnValue({ data: undefined as any, isLoading: true, isError: false, refetch: vi.fn() });
    render(<ThreadsPage />);
    const containers = document.querySelectorAll('[aria-busy="true"]');
    expect(containers.length).toBeGreaterThanOrEqual(1);
  });

  test("shows empty state when no threads in category", () => {
    mockUseQuery
      .mockReturnValueOnce({ data: mockCategories, isLoading: false, isError: false, refetch: vi.fn() })
      .mockReturnValue({ data: [], isLoading: false, isError: false, refetch: vi.fn() });
    render(<ThreadsPage />);
    expect(screen.getByText("No discussions yet")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  test("thread icon wrapper has aria-hidden='true'", () => {
    mockUseQuery
      .mockReturnValueOnce({ data: mockCategories, isLoading: false, isError: false, refetch: vi.fn() })
      .mockReturnValue({ data: mockThreads, isLoading: false, isError: false, refetch: vi.fn() });
    render(<ThreadsPage />);
    const hiddenWrappers = document.querySelectorAll('[aria-hidden="true"]');
    expect(hiddenWrappers.length).toBeGreaterThanOrEqual(1);
  });
});
