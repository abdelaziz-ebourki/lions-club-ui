import React from "react";
import { render, screen } from "@testing-library/react";
import { AdminMembersPage } from "../admin-members";
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

describe("AdminMembersPage", () => {
  test("shows skeleton while loading", () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined, isLoading: true } as any);
    render(<AdminMembersPage />);
    expect(screen.getByText("Manage Members")).toBeInTheDocument();
    const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  test("renders members when loaded", () => {
    const mockMembers = [
      { id: "1", name: "Alice", role: "President" },
      { id: "2", name: "Bob", role: "Secretary" },
    ];
    vi.mocked(useQuery).mockReturnValue({ data: mockMembers, isLoading: false } as any);
    render(<AdminMembersPage />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });
});
