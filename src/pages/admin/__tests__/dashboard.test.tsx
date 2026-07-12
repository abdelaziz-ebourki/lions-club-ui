import React from "react";
import { render, screen } from "@testing-library/react";
import { AdminDashboardPage } from "../dashboard";
import { useQuery } from "@tanstack/react-query";
import { describe, test, expect, vi, beforeEach } from "vitest";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Link: ({ children, to, ...props }: any) =>
      React.createElement("a", { href: to, ...props }, children),
  };
});

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

describe("AdminDashboardPage", () => {
  test("renders dashboard heading and breadcrumbs", () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined, isLoading: false, isError: false } as any);
    render(<AdminDashboardPage />);
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
  });

  test("displays stat cards with counts from queries", () => {
    vi.mocked(useQuery).mockImplementation(({ queryKey }: any) => {
      if (queryKey[0] === "events") return { data: [{ status: "upcoming" }, { status: "upcoming" }, { status: "past" }], isLoading: false, isError: false } as any;
      if (queryKey[0] === "forum-threads") return { data: [{ id: "1" }, { id: "2" }], isLoading: false, isError: false } as any;
      if (queryKey[0] === "members") return { data: [{ id: "1" }], isLoading: false, isError: false } as any;
      if (queryKey[0] === "messages") return { data: [{ status: "unread" }, { status: "read" }], isLoading: false, isError: false } as any;
      return { data: undefined, isLoading: false, isError: false } as any;
    });
    render(<AdminDashboardPage />);
    expect(screen.getAllByText("2").length).toBe(2);
    expect(screen.getAllByText("1").length).toBe(2);
  });

  test("shows dash when query data is missing", () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined, isLoading: false, isError: false } as any);
    render(<AdminDashboardPage />);
    const dashes = screen.getAllByText("—");
    expect(dashes.length).toBe(4);
  });

  test("shows error banner when any query errors", () => {
    vi.mocked(useQuery).mockImplementation(({ queryKey }: any) => {
      if (queryKey[0] === "events") return { data: undefined, isLoading: false, isError: true } as any;
      return { data: undefined, isLoading: false, isError: false } as any;
    });
    render(<AdminDashboardPage />);
    expect(screen.getByText(/couldn't be loaded/i)).toBeInTheDocument();
  });
});
