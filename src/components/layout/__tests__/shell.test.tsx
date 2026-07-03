import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
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
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    refreshUser: vi.fn(),
    loading: false,
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
});
