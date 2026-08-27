import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, test, vi, beforeEach, expect } from 'vitest';
import { MemberDetailPage } from '../member-detail';
import { members } from '@/mocks/data/members';
import { useMember } from '@/hooks/useMembersList';

vi.mock('@/hooks/useMembersList');

const mockRefetch = vi.fn();

function mockMember(overrides: Record<string, unknown> = {}) {
  vi.mocked(useMember).mockReturnValue({
    data: members[0],
    isLoading: false,
    isError: false,
    error: null,
    refetch: mockRefetch,
    ...overrides,
  } as never);
}

function renderAt(id = '1') {
  return render(
    <MemoryRouter initialEntries={[`/members/${id}`]}>
      <Routes>
        <Route path="/members/:id" element={<MemberDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  mockMember();
});

describe('MemberDetailPage', () => {
  test('renders member name, role, bio and avatar with lazy and sized attrs', () => {
    const member = members.find((m) => m.avatar)!;
    mockMember({ data: member });
    renderAt(member.id);
    expect(screen.getByRole('heading', { name: member.name })).toBeInTheDocument();
    expect(screen.getByText(member.role)).toBeInTheDocument();
    expect(screen.getByText(member.bio!)).toBeInTheDocument();
    const img = screen.getByAltText(member.name) as HTMLImageElement;
    expect(img.getAttribute('loading')).toBe('lazy');
    expect(img.getAttribute('width')).toBe('320');
    expect(img.getAttribute('height')).toBe('320');
    expect(img.src).toContain(member.avatar!);
  });

  test('shows fallback initial when avatar missing', () => {
    const memberWithoutAvatar = members.find((m) => !m.avatar)!;
    mockMember({ data: memberWithoutAvatar });
    renderAt(memberWithoutAvatar.id);
    const fallback = screen.getByTestId(`member-detail-avatar-fallback-${memberWithoutAvatar.name}`);
    expect(fallback).toBeInTheDocument();
    expect(fallback).toHaveTextContent(memberWithoutAvatar.name.charAt(0));
  });

  test('renders email, phone and socials when present', () => {
    const member = members[0]; // Ahmed has email, phone, linkedin, facebook
    mockMember({ data: member });
    renderAt(member.id);
    expect(screen.getByText(member.email!)).toBeInTheDocument();
    expect(screen.getByText(member.phone!)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute('href', member.socials!.linkedin!);
    expect(screen.getByRole('link', { name: /facebook/i })).toHaveAttribute('href', member.socials!.facebook!);
  });

  test('renders joined date', () => {
    const member = members[0];
    mockMember({ data: member });
    renderAt(member.id);
    expect(screen.getByText(/joined/i)).toBeInTheDocument();
  });

  test('shows skeleton while loading', () => {
    mockMember({ data: undefined, isLoading: true });
    renderAt('1');
    expect(document.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
  });

  test('shows not found when member missing', () => {
    mockMember({ data: undefined, isError: true, error: Object.assign(new Error('nf'), { status: 404 }) });
    renderAt('nonexistent');
    expect(screen.getByText('Member not found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to members/i })).toBeInTheDocument();
  });

  test('shows error with retry when non-404 error', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    mockMember({ data: undefined, isError: true, error: new Error('network') });
    renderAt('1');
    expect(screen.getByText('Failed to load member')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /try again/i }));
    expect(mockRefetch).toHaveBeenCalled();
  });

  test('renders breadcrumbs Home > Members > Name', () => {
    const member = members[0];
    mockMember({ data: member });
    renderAt(member.id);
    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Members' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: member.name })).toBeInTheDocument();
  });

  test('renders back link to members', () => {
    const member = members[0];
    mockMember({ data: member });
    renderAt(member.id);
    expect(screen.getByRole('link', { name: /back to members/i })).toBeInTheDocument();
  });
});
