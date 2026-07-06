import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RequireVerifiedEmail } from '../require-verified-email';
import { useAuth } from '@/contexts/auth';
import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('@/contexts/auth', () => ({
  useAuth: vi.fn(),
}));

const mockUseEmailVerification = vi.hoisted(() => vi.fn());

vi.mock('@/hooks/use-email-verification', () => ({
  useEmailVerification: mockUseEmailVerification,
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockUseEmailVerification.mockReturnValue({
    isVerified: false,
    isCooldown: false,
    cooldownSeconds: 0,
    resend: vi.fn(),
  });
});

describe('RequireVerifiedEmail', () => {
  test('redirects to login when not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      isEmailVerified: false,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });
    render(
      <MemoryRouter>
        <RequireVerifiedEmail>
          <p>Protected Content</p>
        </RequireVerifiedEmail>
      </MemoryRouter>
    );
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('shows banner when authenticated but not verified', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', name: 'Member', email: 'm@test.com', role: 'member', emailVerified: false },
      isAuthenticated: true,
      isAdmin: false,
      isEmailVerified: false,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });
    render(
      <RequireVerifiedEmail>
        <p>Protected Content</p>
      </RequireVerifiedEmail>
    );
    expect(screen.getByText('Please verify your email to access this section.')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('renders children when verified', () => {
    mockUseEmailVerification.mockReturnValue({
      isVerified: true,
      isCooldown: false,
      cooldownSeconds: 0,
      resend: vi.fn(),
    });

    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', name: 'Member', email: 'm@test.com', role: 'member', emailVerified: true },
      isAuthenticated: true,
      isAdmin: false,
      isEmailVerified: true,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });
    render(
      <RequireVerifiedEmail>
        <p>Protected Content</p>
      </RequireVerifiedEmail>
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
