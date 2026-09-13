import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { PrototypeNotice } from "../prototype-notice";
import { prototypeNoticeStorageKey } from "@/config";

vi.mock("@/config", async () => {
  const actual = await vi.importActual<typeof import("@/config")>("@/config");
  return {
    ...actual,
    appConfig: {
      ...actual.appConfig,
      isMock: true,
    },
    prototypeNoticeStorageKey: "prototypeNotice:test:dismissed",
  };
});

describe("PrototypeNotice", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("opens on first load when mock is enabled", async () => {
    render(<PrototypeNotice />);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/prototype/i)).toBeInTheDocument();
  });

  test("continue without checkbox closes but does not persist", async () => {
    const user = userEvent.setup();
    render(<PrototypeNotice />);
    await screen.findByRole("dialog");
    await user.click(screen.getByRole("button", { name: /continue/i }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(localStorage.getItem(prototypeNoticeStorageKey)).toBeNull();
  });

  test("checking don't show again persists dismissal", async () => {
    const user = userEvent.setup();
    render(<PrototypeNotice />);
    await screen.findByRole("dialog");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: /continue/i }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(localStorage.getItem(prototypeNoticeStorageKey)).toBe("1");
  });

  test("stays closed after previous dismissal", async () => {
    localStorage.setItem(prototypeNoticeStorageKey, "1");
    render(<PrototypeNotice />);
    // wait a tick for any potential open side effect
    await new Promise((r) => setTimeout(r, 20));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
