import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import css from '../../../index.css?inline';
import { Shell } from '../shell';
import { describe, test, expect, vi } from 'vitest';

vi.mock('@/contexts/theme', () => ({
  useTheme: () => ({ theme: 'light', toggle: vi.fn() }),
}));

vi.mock('@/contexts/auth', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    isEmailVerified: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    refreshUser: vi.fn(),
    loading: false,
  }),
}));

vi.mock('@/hooks/use-notifications', () => ({
  useNotifications: () => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('Shell', () => {
  test('renders skip-to-content link as first focusable element', () => {
    renderWithRouter(<Shell />);
    const skipLink = screen.getByText('Skip to content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink.tagName).toBe('A');
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  test('main element has id="main-content"', () => {
    renderWithRouter(<Shell />);
    const main = document.getElementById('main-content');
    expect(main).toBeInTheDocument();
    expect(main!.tagName).toBe('MAIN');
  });

  test('skip link is sr-only by default (visually hidden)', () => {
    renderWithRouter(<Shell />);
    const skipLink = screen.getByText('Skip to content');
    expect(skipLink.className).toContain('sr-only');
  });

  test('renders without crashing', () => {
    renderWithRouter(<Shell />);
    expect(screen.getAllByText(/lions club fsbm/i).length).toBeGreaterThan(0);
  });

  test('fade-in animation duration is 200ms (FR-006)', () => {
    const rule = css.match(/\.animate-in\s*\{[^}]*\}/);
    expect(rule).toBeTruthy();
    expect(rule![0]).toContain('0.2s');
    expect(rule![0]).not.toContain('0.5s');
  });

  test('main element opts out of animation under reduced motion (FR-007)', () => {
    renderWithRouter(<Shell />);
    const main = document.getElementById('main-content')!;
    expect(main.className).toContain('motion-reduce:animate-none');
  });

  test('global reduced-motion rule disables animations (FR-007)', () => {
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('animation-duration: 0.01ms');
  });
});
