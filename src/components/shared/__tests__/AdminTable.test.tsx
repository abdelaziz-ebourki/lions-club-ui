import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { AdminTable } from "../AdminTable";
import { TableHead, TableRow, TableCell } from "@/components/ui/table";

describe("AdminTable", () => {
  const headers = (
    <>
      <TableHead className="font-display text-overline text-xs">Name</TableHead>
      <TableHead className="font-display text-overline text-xs">Role</TableHead>
    </>
  );

  const tableBody = (
    <TableRow>
      <TableCell>Alice</TableCell>
      <TableCell>Admin</TableCell>
    </TableRow>
  );

  test("renders table children when mobileView is not provided", () => {
    render(
      <AdminTable headers={headers}>
        {tableBody}
      </AdminTable>,
    );
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  test("renders mobileView content", () => {
    render(
      <AdminTable
        headers={headers}
        mobileView={<div data-testid="mobile-card">Mobile Card</div>}
      >
        {tableBody}
      </AdminTable>,
    );
    expect(screen.getByTestId("mobile-card")).toBeInTheDocument();
    expect(screen.getByText("Mobile Card")).toBeInTheDocument();
  });

  test("renders skeleton when loading", () => {
    render(
      <AdminTable headers={headers} loading skeletonColumns={2} skeletonRows={2} />,
    );
    const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
