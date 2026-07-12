import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { Breadcrumbs } from "../Breadcrumbs";

describe("Breadcrumbs", () => {
  const simpleTrail = [
    { label: "Home", href: "/" },
    { label: "About" },
  ];

  const deepTrail = [
    { label: "Home", href: "/" },
    { label: "Forum", href: "/forum" },
    { label: "Category", href: "/forum/1" },
    { label: "Thread Title" },
  ];

  test("renders correct number of items including separators", () => {
    const { container } = render(<Breadcrumbs trail={simpleTrail} />);
    const items = container.querySelectorAll('[data-slot="breadcrumb-item"]');
    const separators = container.querySelectorAll('[data-slot="breadcrumb-separator"]');
    expect(items).toHaveLength(2);
    expect(separators).toHaveLength(1);
  });

  test("last segment has aria-current='page' and is not a link", () => {
    render(<Breadcrumbs trail={simpleTrail} />);
    const last = screen.getByText("About");
    expect(last).toHaveAttribute("aria-current", "page");
    expect(last.tagName).toBe("SPAN");
  });

  test("internal segments are clickable links", () => {
    render(<Breadcrumbs trail={deepTrail} />);
    const homeLink = screen.getByText("Home");
    const forumLink = screen.getByText("Forum");
    expect(homeLink.closest("a")).toHaveAttribute("href", "/");
    expect(forumLink.closest("a")).toHaveAttribute("href", "/forum");
  });

  test("renders nothing when trail is empty", () => {
    const { container } = render(<Breadcrumbs trail={[]} />);
    expect(container.innerHTML).toBe("");
  });

  test("nav element has aria-label breadcrumb", () => {
    render(<Breadcrumbs trail={simpleTrail} />);
    const nav = document.querySelector('[data-slot="breadcrumb"]');
    expect(nav).toHaveAttribute("aria-label", "breadcrumb");
  });
});
