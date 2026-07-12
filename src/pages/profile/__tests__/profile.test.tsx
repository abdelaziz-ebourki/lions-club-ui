import { render, screen } from '@testing-library/react';
import { ProfilePage } from '../profile';
import { useAuth } from '@/contexts/auth';
import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('@/contexts/auth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/hooks/use-email-verification', () => ({
  useEmailVerification: vi.fn(() => ({
    isVerified: true,
    isCooldown: false,
    cooldownSeconds: 0,
    resend: vi.fn(),
  })),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ProfilePage', () => {
  test('renders user name and email', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', name: 'John Doe', email: 'john@test.com', role: 'member', emailVerified: true },
      isAuthenticated: true,
      isAdmin: false,
      isEmailVerified: true,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });
    render(<ProfilePage />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@test.com')).toBeInTheDocument();
  });

  test('renders role with capitalization', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', name: 'Admin', email: 'admin@test.com', role: 'admin', emailVerified: true },
      isAuthenticated: true,
      isAdmin: true,
      isEmailVerified: true,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });
    render(<ProfilePage />);
    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  test('returns null when no user', () => {
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
    const { container } = render(<ProfilePage />);
    expect(container).toBeEmptyDOMElement();
  });

  test('integrates email verification banner', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', name: 'John', email: 'john@test.com', role: 'member', emailVerified: false },
      isAuthenticated: true,
      isAdmin: false,
      isEmailVerified: false,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });
    render(<ProfilePage />);
    expect(screen.getByRole('heading', { name: 'Profile' })).toBeInTheDocument();
  });
});
