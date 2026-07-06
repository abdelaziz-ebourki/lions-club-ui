import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { NotificationPanel } from "../notification-panel";

describe("NotificationPanel", () => {
  test("shows empty state when no notifications", () => {
    render(
      <NotificationPanel
        notifications={[]}
        unreadCount={0}
        onNotificationClick={vi.fn()}
        onMarkAllRead={vi.fn()}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText("No new notifications")).toBeInTheDocument();
  });
});
