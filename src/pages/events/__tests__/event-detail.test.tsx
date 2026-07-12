import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { EventDetailPage } from "../event-detail";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { useAuth } from "@/contexts/auth";

const mockNavigateRef = { current: vi.fn() };

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: () => mockNavigateRef.current,
    useLocation: () => ({ pathname: "/" }),
    Link: ({ children, to, ...props }: any) =>
      React.createElement("a", { href: to, ...props }, children),
  };
});

vi.mock("@/contexts/auth", () => ({
  useAuth: vi.fn(),
}));

const upcomingEvent = {
  id: "event-1",
  title: "Beach Cleanup",
  description: "Cleaning the beach",
  date: "2026-07-15",
  time: "10:00",
  location: "Casablanca Beach",
  category: "Environment",
  status: "upcoming" as const,
  rsvpCount: 5,
  hasRsvpd: false,
};

const defaultQueryReturn = {
  data: upcomingEvent,
  isLoading: false,
  isError: false,
  error: null,
  refetch: vi.fn(),
};

const defaultMutationReturn = {
  mutate: vi.fn(),
  isPending: false,
};

describe("EventDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigateRef.current = vi.fn();
    (useParams as ReturnType<typeof vi.fn>).mockReturnValue({ id: "event-1" });
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue(defaultQueryReturn);
    (useMutation as ReturnType<typeof vi.fn>).mockReturnValue(defaultMutationReturn);
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { name: "Test User", role: "member" },
      isAuthenticated: true,
      isAdmin: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
      loading: false,
    });
  });

  test("shows loading skeleton", () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });
    render(<EventDetailPage />);
    const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  test("shows not found when event is missing", () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });
    render(<EventDetailPage />);
    expect(screen.getByText("Project not found")).toBeInTheDocument();
  });

  test("renders event title and details", () => {
    render(<EventDetailPage />);
    expect(screen.getByRole("heading", { name: /beach cleanup/i })).toBeInTheDocument();
    expect(screen.getByText("2026-07-15")).toBeInTheDocument();
    expect(screen.getByText("Casablanca Beach")).toBeInTheDocument();
  });

  test("shows Join Event button for upcoming event when not RSVP'd", () => {
    render(<EventDetailPage />);
    expect(screen.getByRole("button", { name: /join event/i })).toBeInTheDocument();
  });

  test("clicking Join Event triggers RSVP mutation", () => {
    const mockMutate = vi.fn();
    (useMutation as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
    render(<EventDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: /join event/i }));
    expect(mockMutate).toHaveBeenCalled();
  });

  test("shows Going when user has RSVP'd", () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      ...defaultQueryReturn,
      data: { ...upcomingEvent, hasRsvpd: true, rsvpCount: 6 },
    });
    render(<EventDetailPage />);
    expect(screen.getByRole("button", { name: /going/i })).toBeDisabled();
  });

  test("hides RSVP button for past events", () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      ...defaultQueryReturn,
      data: { ...upcomingEvent, status: "past" as const },
    });
    render(<EventDetailPage />);
    expect(screen.queryByRole("button", { name: /join event/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /going/i })).not.toBeInTheDocument();
  });

  test("redirects unauthenticated user to login on RSVP click", () => {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
      loading: false,
    });

    render(<EventDetailPage />);
    fireEvent.click(screen.getByRole("button", { name: /join event/i }));
    expect(mockNavigateRef.current).toHaveBeenCalledWith("/login?return=/events/event-1");
  });

  test("shows RSVP count when available", () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      ...defaultQueryReturn,
      data: { ...upcomingEvent, rsvpCount: 12 },
    });
    render(<EventDetailPage />);
    expect(screen.getByText("12 attending")).toBeInTheDocument();
  });

  test("disables Join Event button while mutation is pending", () => {
    (useMutation as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
    });
    render(<EventDetailPage />);
    expect(screen.getByRole("button", { name: /joining/i })).toBeDisabled();
  });
});
