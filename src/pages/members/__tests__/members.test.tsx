import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, vi, beforeEach, expect } from 'vitest';
import { MembersPage } from '../members';
import { members } from '@/mocks/data/members';
import { useMembersList } from '@/hooks/useMembersList';

vi.mock('@/hooks/useMembersList');

const mockRefetch = vi.fn();

function mockList(overrides: Record<string, unknown> = {}) {
  const sorted = [...members].sort(
    (a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
  );
  vi.mocked(useMembersList).mockReturnValue({
    data: sorted,
    isLoading: false,
    isError: false,
    error: null,
    refetch: mockRefetch,
    ...overrides,
  } as never);
}

function renderPage() {
  return render(
    <MemoryRouter>
      <MembersPage />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  mockList();
});

describe('MembersPage', () => {
  test('renders PageHero and Breadcrumbs', () => {
    renderPage();
    expect(screen.getByText('Our Members')).toBeInTheDocument();
    expect(screen.getByText('Community')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
  });

  test('shows skeleton while loading', () => {
    mockList({ data: undefined, isLoading: true });
    renderPage();
    expect(document.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
    expect(screen.queryByRole('status', { hidden: true }) || document.querySelector('[aria-busy="true"]')).toBeTruthy();
  });

  test('renders cards sorted newest-first with name and role', () => {
    renderPage();
    const sorted = [...members].sort(
      (a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
    );
    const names = screen.getAllByTestId('member-card-name').map((el) => el.textContent);
    expect(names).toEqual(sorted.map((m) => m.name));
    // most recent is Karim Othmani 2022-02-18
    expect(names[0]).toBe('Karim Othmani');
    expect(screen.getAllByText(/President|Vice President|Secretary|Treasurer|Events Coordinator|PR/).length).toBeGreaterThanOrEqual(members.length);
  });

  test('renders avatar with lazy and sized attrs when present', () => {
    const memberWithAvatar = { ...members[0], avatar: '/seed/blood-drive-1.jpg' };
    mockList({ data: [memberWithAvatar] });
    renderPage();
    const img = screen.getByAltText(memberWithAvatar.name) as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('loading')).toBe('lazy');
    expect(img.getAttribute('width')).toBe('80');
    expect(img.getAttribute('height')).toBe('80');
    expect(img.src).toContain(memberWithAvatar.avatar!);
  });

  test('shows fallback initial when avatar missing', () => {
    renderPage();
    // Karim has no avatar
    const fallback = screen.getByTestId('member-avatar-fallback-Karim Othmani');
    expect(fallback).toBeInTheDocument();
    expect(fallback).toHaveTextContent('K');
  });

  test('each card links to detail page', () => {
    renderPage();
    const sorted = [...members].sort(
      (a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
    );
    const links = screen.getAllByRole('link', { name: new RegExp(sorted[0].name) });
    // Card link wraps name/role
    expect(links[0].getAttribute('href')).toBe(`/members/${sorted[0].id}`);
  });

  test('shows empty state when no members', () => {
    mockList({ data: [] });
    renderPage();
    expect(screen.getByText('No members yet')).toBeInTheDocument();
    expect(screen.getByText(/no members have been added/i)).toBeInTheDocument();
  });

  test('shows error state with retry', async () => {
    const user = userEvent.setup();
    mockList({ data: undefined, isError: true });
    renderPage();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/failed to load members/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /try again/i }));
    expect(mockRefetch).toHaveBeenCalled();
  });

  test('renders bio when present', () => {
    renderPage();
    const memberWithBio = members.find((m) => m.bio)!;
    expect(screen.getByText(memberWithBio.bio!)).toBeInTheDocument();
  });
});
