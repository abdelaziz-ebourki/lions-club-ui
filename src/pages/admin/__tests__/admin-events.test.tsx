import React from "react";
import { render, screen } from "@testing-library/react";
import { AdminEventsPage } from "../admin-events";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    useMutation: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
    useQueryClient: vi.fn(() => ({ invalidateQueries: vi.fn() })),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("AdminEventsPage", () => {
  test("shows skeleton while loading", () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined, isLoading: true } as any);
    render(<AdminEventsPage />);
    expect(screen.getByText("Manage Events")).toBeInTheDocument();
    const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  test("shows empty state when no events", () => {
    vi.mocked(useQuery).mockReturnValue({ data: [], isLoading: false } as any);
    render(<AdminEventsPage />);
    expect(screen.getByText("No projects yet")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create your first project/i })).toBeInTheDocument();
  });

  test("renders events when loaded", () => {
    const mockEvents = [
      { id: "1", title: "Beach Cleanup", date: "2026-07-15", category: "Environment", status: "upcoming" as const },
      { id: "2", title: "Food Drive", date: "2026-08-01", category: "Community", status: "upcoming" as const },
    ];
    vi.mocked(useQuery).mockReturnValue({ data: mockEvents, isLoading: false } as any);
    render(<AdminEventsPage />);
    expect(screen.getByText("Beach Cleanup")).toBeInTheDocument();
    expect(screen.getByText("Food Drive")).toBeInTheDocument();
  });
});
