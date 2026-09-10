import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AdminMessagesPage } from "../admin-messages";
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { describe, test, expect, vi, beforeEach } from "vitest";

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQuery: vi.fn(),
    useMutation: vi.fn(),
    useQueryClient: vi.fn(),
  };
});

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mockInvalidateQueries = vi.fn();

const mockMessages = [
  { id: "1", name: "John", email: "john@test.com", subject: "Hello", message: "Full message body here", createdAt: "2026-07-01", status: "unread" as const },
];

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useQuery).mockReturnValue({ data: mockMessages } as any);
  vi.mocked(useQueryClient).mockReturnValue({ invalidateQueries: mockInvalidateQueries } as any);
  vi.mocked(useMutation).mockReturnValue({ mutate: vi.fn(), isPending: false } as any);
});

describe("AdminMessagesPage", () => {
  test("renders message name and subject", () => {
    const mockMessages = [
      { id: "1", name: "John", email: "john@test.com", subject: "Hello", message: "Test", createdAt: "2026-07-01", status: "unread" as const },
    ];
    vi.mocked(useQuery).mockReturnValue({ data: mockMessages } as any);
    render(<AdminMessagesPage />);
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  test("renders email and date", () => {
    render(<AdminMessagesPage />);
    expect(screen.getByText("john@test.com")).toBeInTheDocument();
    expect(screen.getByText(formatDate("2026-07-01", "en"))).toBeInTheDocument();
  });

  test("expands card on click to reveal moderation actions", () => {
    render(<AdminMessagesPage />);
    expect(screen.queryByRole("button", { name: /mark as read/i })).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("John"));
    expect(screen.getByRole("button", { name: /mark as read/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete message/i })).toBeInTheDocument();
  });

  test("mark as read patches status, invalidates and toasts", async () => {
    const actualRQ = await vi.importActual<typeof import("@tanstack/react-query")>("@tanstack/react-query");
    vi.mocked(useMutation).mockImplementation((options: any) => actualRQ.useMutation(options));
    vi.mocked(useQueryClient).mockImplementation(() => actualRQ.useQueryClient());
    const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
    render(
      <QueryClientProvider client={client}>
        <AdminMessagesPage />
      </QueryClientProvider>
    );
    fireEvent.click(screen.getByText("John"));
    fireEvent.click(screen.getByRole("button", { name: /mark as read/i }));
    await waitFor(() => {
      expect(vi.mocked(api.patch)).toHaveBeenCalledWith("/contact/1", { status: "read" });
    });
    await waitFor(() => {
      expect(vi.mocked(toast.success)).toHaveBeenCalled();
    });
  });

  test("confirming delete removes the message with toast", async () => {
    const actualRQ = await vi.importActual<typeof import("@tanstack/react-query")>("@tanstack/react-query");
    vi.mocked(useMutation).mockImplementation((options: any) => actualRQ.useMutation(options));
    vi.mocked(useQueryClient).mockImplementation(() => actualRQ.useQueryClient());
    const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
    render(
      <QueryClientProvider client={client}>
        <AdminMessagesPage />
      </QueryClientProvider>
    );
    fireEvent.click(screen.getByText("John"));
    fireEvent.click(screen.getByRole("button", { name: /delete message/i }));
    expect(screen.getByText("Delete Message")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /^delete$/i }));
    await waitFor(() => {
      expect(vi.mocked(api.delete)).toHaveBeenCalledWith("/contact/1");
    });
    await waitFor(() => {
      expect(vi.mocked(toast.success)).toHaveBeenCalled();
    });
  });
});
