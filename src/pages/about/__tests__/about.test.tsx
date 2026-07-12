import { render } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { AboutPage } from "../about";
import { useQuery } from "@tanstack/react-query";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Link: ({ children, to, ...props }: any) =>
      <a href={to} {...props}>{children}</a>,
  };
});

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

describe("AboutPage", () => {
  test("renders breadcrumbs with Home > About", () => {
    vi.mocked(useQuery).mockReturnValue({ data: undefined, isLoading: true } as any);
    render(<AboutPage />);
    const nav = document.querySelector('[data-slot="breadcrumb"]');
    expect(nav).toBeInTheDocument();
  });
});
