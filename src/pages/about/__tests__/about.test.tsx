import { render } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { AboutPage } from "../about";
import { useQuery } from "@tanstack/react-query";
import { members } from "@/mocks/data/members";
import { expectImagesLazyAndSized } from "@/test-utils/image-assertions";

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

describe("AboutPage images (FR-001, FR-008)", () => {
  test("member avatar images are lazy-loaded with explicit dimensions", () => {
    vi.mocked(useQuery).mockReturnValue({
      data: members,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any);
    const { container } = render(<AboutPage />);
    expectImagesLazyAndSized(container);
  });
});
