import { render, screen } from '@testing-library/react';
import { RequireAdmin } from '../require-admin';
import { useAuth } from '@/contexts/auth';
import { describe, test, expect, vi, beforeEach } from 'vitest';

const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Navigate: ({ to }: { to: string }) => {
      mockNavigate(to);
      return null;
    },
  };
});

vi.mock('@/contexts/auth', () => ({
  useAuth: vi.fn(),
}));

beforeEach(() => {
  mockNavigate.mockClear();
  vi.mocked(useAuth).mockReturnValue({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    loading: true,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    refreshUser: vi.fn(),
  });
});

describe('RequireAdmin', () => {
  test('shows skeleton while loading', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      loading: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });
    const { container } = render(
      <RequireAdmin>
        <p>Admin Content</p>
      </RequireAdmin>
    );
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    expect(container.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
  });

  test('redirects to / when not admin', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', name: 'Member', email: 'm@test.com', role: 'member' },
      isAuthenticated: true,
      isAdmin: false,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });
    render(
      <RequireAdmin>
        <p>Admin Content</p>
      </RequireAdmin>
    );
    expect(mockNavigate).toHaveBeenCalledWith('/');
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  test('renders children when admin', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', name: 'Admin', email: 'a@test.com', role: 'admin' },
      isAuthenticated: true,
      isAdmin: true,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });
    render(
      <RequireAdmin>
        <p>Admin Content</p>
      </RequireAdmin>
    );
    expect(screen.getByText('Admin Content')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
