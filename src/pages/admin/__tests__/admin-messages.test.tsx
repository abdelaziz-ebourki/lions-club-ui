import { render, screen } from "@testing-library/react";
import { AdminMessagesPage } from "../admin-messages";
import { useQuery } from "@tanstack/react-query";
import { describe, test, expect, vi, beforeEach } from "vitest";

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
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
    const mockMessages = [
      { id: "1", name: "John", email: "john@test.com", subject: "Hello", message: "Test", createdAt: "2026-07-01", status: "unread" as const },
    ];
    vi.mocked(useQuery).mockReturnValue({ data: mockMessages } as any);
    render(<AdminMessagesPage />);
    expect(screen.getByText("john@test.com")).toBeInTheDocument();
    expect(screen.getByText("2026-07-01")).toBeInTheDocument();
  });
});
