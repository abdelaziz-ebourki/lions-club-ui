import { render } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { NotFoundPage } from "../not-found";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Link: ({ children, to, ...props }: any) =>
      <a href={to} {...props}>{children}</a>,
  };
});

describe("NotFoundPage", () => {
  test("renders breadcrumbs with Home > Page Not Found", () => {
    render(<NotFoundPage />);
    const nav = document.querySelector('[data-slot="breadcrumb"]');
    expect(nav).toBeInTheDocument();
  });
});
