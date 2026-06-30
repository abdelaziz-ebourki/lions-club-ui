import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import type { SearchResult } from "@/types";
import { SearchResultItem } from "../search-result-item";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Link: ({ children, to, ...props }: any) =>
      React.createElement("a", { href: to, ...props }, children),
  };
});

const mockResult: SearchResult = {
  id: "event-1",
  entityType: "event",
  title: "Beach Cleanup",
  snippet: "...Join us for the annual beach cleanup event...",
  url: "/events/event-1",
  matchType: "exact",
  updatedAt: "2026-06-15",
};

describe("SearchResultItem", () => {
  test("renders title", () => {
    render(<SearchResultItem result={mockResult} />);
    expect(screen.getByText("Beach Cleanup")).toBeInTheDocument();
  });

  test("renders snippet", () => {
    render(<SearchResultItem result={mockResult} />);
    expect(screen.getByText("...Join us for the annual beach cleanup event...")).toBeInTheDocument();
  });

  test("renders entity type label", () => {
    render(<SearchResultItem result={mockResult} />);
    expect(screen.getByText("Event")).toBeInTheDocument();
  });

  test("links to the entity detail page", () => {
    render(<SearchResultItem result={mockResult} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/events/event-1");
  });
});
