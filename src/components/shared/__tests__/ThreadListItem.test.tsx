import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { ThreadListItem } from "../ThreadListItem";
import type { ForumThread } from "@/types";

const mockThread: ForumThread = {
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
};

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Link: ({ children, to, ...props }: any) =>
      <a href={to} {...props}>{children}</a>,
  };
});

describe("ThreadListItem", () => {
  test("renders thread title and author", () => {
    render(<ThreadListItem thread={mockThread} categoryId="cat-1" />);
    expect(screen.getByText("Summer Event Planning")).toBeInTheDocument();
    expect(screen.getByText(/Started by Alice/)).toBeInTheDocument();
  });

  test("renders reply count", () => {
    render(<ThreadListItem thread={mockThread} categoryId="cat-1" />);
    expect(screen.getByText(/5 replies/)).toBeInTheDocument();
  });

  test("renders lastActivity date", () => {
    render(<ThreadListItem thread={mockThread} categoryId="cat-1" />);
    expect(screen.getByText("2026-06-15")).toBeInTheDocument();
  });
});
