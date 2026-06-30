import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";

const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/lib/search", () => ({
  sanitizeQuery: (raw: string) => ({
    raw,
    sanitized: raw.trim().slice(0, 200),
    length: raw.trim().slice(0, 200).length,
    isEmpty: raw.trim().length === 0,
  }),
}));

import { SearchBar } from "../search-bar";

beforeEach(() => {
  mockNavigate.mockClear();
});

describe("SearchBar", () => {
  test("renders a search input", () => {
    render(<SearchBar />);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  test("navigates to /search?q=query on Enter with non-empty query", async () => {
    render(<SearchBar />);
    const input = screen.getByRole("searchbox");
    await userEvent.type(input, "cleanup");
    await userEvent.keyboard("{Enter}");
    expect(mockNavigate).toHaveBeenCalledWith("/search?q=cleanup");
  });

  test("navigates to /search on Enter with empty query", async () => {
    render(<SearchBar />);
    const input = screen.getByRole("searchbox");
    await userEvent.type(input, "   ");
    await userEvent.keyboard("{Enter}");
    expect(mockNavigate).toHaveBeenCalledWith("/search");
  });

  test("clears input and removes focus on Escape", async () => {
    render(<SearchBar />);
    const input = screen.getByRole<HTMLInputElement>("searchbox");
    await userEvent.type(input, "test");
    await userEvent.keyboard("{Escape}");
    expect(input.value).toBe("");
    expect(document.activeElement).not.toBe(input);
  });

  test("caps input at 200 characters", async () => {
    render(<SearchBar />);
    const input = screen.getByRole<HTMLInputElement>("searchbox");
    const longText = "a".repeat(250);
    await userEvent.type(input, longText);
    expect(input.value.length).toBeLessThanOrEqual(200);
  });
});
