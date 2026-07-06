import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { NotificationItem } from "../notification-item";
import type { Notification } from "@/types";

const baseNotification: Notification = {
  id: "n1",
  type: "forum_reply",
  title: "New reply",
  description: "Someone replied to your thread",
  targetUrl: "/forum/thread-1",
  read: false,
  createdAt: new Date().toISOString(),
};

describe("NotificationItem", () => {
  test("renders notification title and description", () => {
    render(<NotificationItem notification={baseNotification} onClick={vi.fn()} />);

    expect(screen.getByText("New reply")).toBeInTheDocument();
    expect(screen.getByText("Someone replied to your thread")).toBeInTheDocument();
  });

  test("calls onClick with notification id when clicked", () => {
    const onClick = vi.fn();
    render(<NotificationItem notification={baseNotification} onClick={onClick} />);

    fireEvent.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledWith("n1");
  });
});
