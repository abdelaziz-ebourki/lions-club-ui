import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { EmptyState } from "../empty-state";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

describe("EmptyState", () => {
  test("renders title", () => {
    render(<EmptyState title="No items found" />);
    expect(screen.getByText("No items found")).toBeInTheDocument();
  });

  test("renders description when provided", () => {
    render(<EmptyState title="No items" description="Try again later." />);
    expect(screen.getByText("Try again later.")).toBeInTheDocument();
  });

  test("renders icon when provided", () => {
    const { container } = render(<EmptyState icon={Users} title="No users" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  test("renders action slot when provided", () => {
    render(
      <EmptyState
        title="No users"
        action={<Button>Add User</Button>}
      />
    );
    expect(screen.getByRole("button", { name: "Add User" })).toBeInTheDocument();
  });

  test("does not render description when not provided", () => {
    render(<EmptyState title="No items" />);
    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
  });

  test("has role status for screen readers", () => {
    render(<EmptyState title="No items" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
