import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from '../header';
import { useAuth } from '@/contexts/auth';
import { describe, test, expect, vi, beforeEach } from 'vitest';

const mockNavigate = vi.hoisted(() => vi.fn());
const mockLogout = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/' }),
    useParams: () => ({}),
    Link: ({ children, to, ...props }: any) =>
      React.createElement('a', { href: to, ...props }, children),
  };
});

vi.mock('@/contexts/auth', () => ({
  useAuth: vi.fn(),
}));

beforeEach(() => {
  mockNavigate.mockClear();
  mockLogout.mockClear();
  vi.mocked(useAuth).mockReturnValue({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: mockLogout,
    refreshUser: vi.fn(),
    loading: false,
  });
});

describe('Header', () => {
  test('renders site name and navigation links', () => {
    render(<Header />);
    expect(screen.getByText('Lions Club FSBM')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Events' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Forum' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument();
  });

  test('shows Sign In when not authenticated', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sign Out' })).not.toBeInTheDocument();
  });

  test('shows Dashboard and Sign Out when authenticated as member', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', name: 'Test', email: 'test@test.com', role: 'member' },
      isAuthenticated: true,
      isAdmin: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: mockLogout,
      refreshUser: vi.fn(),
      loading: false,
    });
    render(<Header />);
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Out' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument();
  });

  test('shows Admin and Sign Out when authenticated as admin', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', name: 'Admin', email: 'admin@test.com', role: 'admin' },
      isAuthenticated: true,
      isAdmin: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: mockLogout,
      refreshUser: vi.fn(),
      loading: false,
    });
    render(<Header />);
    expect(screen.getByRole('link', { name: 'Admin' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Out' })).toBeInTheDocument();
  });

  test('calls logout on Sign Out click', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', name: 'Test', email: 'test@test.com', role: 'member' },
      isAuthenticated: true,
      isAdmin: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: mockLogout,
      refreshUser: vi.fn(),
      loading: false,
    });
    render(<Header />);
    await userEvent.click(screen.getByRole('button', { name: 'Sign Out' }));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test('navigates to / after logout', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', name: 'Test', email: 'test@test.com', role: 'member' },
      isAuthenticated: true,
      isAdmin: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: mockLogout,
      refreshUser: vi.fn(),
      loading: false,
    });
    render(<Header />);
    await userEvent.click(screen.getByRole('button', { name: 'Sign Out' }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('renders theme toggle button', () => {
    render(<Header />);
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
  });

  test('renders search bar', () => {
    render(<Header />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  test('desktop nav has aria-label="Main navigation"', () => {
    render(<Header />);
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(nav).toBeInTheDocument();
  });

  test('active nav link has aria-current="page"', () => {
    render(<Header />);
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveAttribute('aria-current', 'page');
  });

  test('non-active links do not have aria-current', () => {
    render(<Header />);
    const aboutLink = screen.getByRole('link', { name: 'About' });
    expect(aboutLink).not.toHaveAttribute('aria-current');
  });
});
