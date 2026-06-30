import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import type { SearchResultGroup } from "@/types";
import { SearchResults } from "../search-results";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Link: ({ children, to, ...props }: any) =>
      React.createElement("a", { href: to, ...props }, children),
  };
});

const mockGroups: SearchResultGroup[] = [
  {
    entityType: "event",
    label: "Events (2)",
    count: 2,
    results: [
      {
        id: "event-1",
        entityType: "event",
        title: "Beach Cleanup",
        snippet: "Join us for cleanup",
        url: "/events/event-1",
        matchType: "exact",
        updatedAt: "2026-06-15",
      },
    ],
  },
  {
    entityType: "forum_thread",
    label: "Forum Threads (1)",
    count: 1,
    results: [
      {
        id: "thread-1",
        entityType: "forum_thread",
        title: "Meeting Discussion",
        snippet: "Discuss the meeting",
        url: "/forum/cat-1/thread-1",
        matchType: "partial",
        updatedAt: "2026-06-14",
      },
    ],
  },
];

describe("SearchResults", () => {
  test("renders group headings with counts", () => {
    render(<SearchResults groups={mockGroups} totalCount={3} />);
    expect(screen.getByText("Events (2)")).toBeInTheDocument();
    expect(screen.getByText("Forum Threads (1)")).toBeInTheDocument();
  });

  test("renders result titles within groups", () => {
    render(<SearchResults groups={mockGroups} totalCount={3} />);
    expect(screen.getByText("Beach Cleanup")).toBeInTheDocument();
    expect(screen.getByText("Meeting Discussion")).toBeInTheDocument();
  });

  test("shows empty state when no results", () => {
    render(<SearchResults groups={[]} totalCount={0} />);
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  test("shows error state with retry button", () => {
    const onRetry = vi.fn();
    render(<SearchResults groups={[]} totalCount={0} error="Network error" onRetry={onRetry} />);
    expect(screen.getByText("Network error")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });
});
