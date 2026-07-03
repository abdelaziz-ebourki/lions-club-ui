import React from 'react';
import { render, screen } from '@testing-library/react';
import { AdminLayout } from '../admin-layout';
import { describe, test, expect, vi } from 'vitest';

const mockLocation = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: mockLocation,
    Link: ({ children, to, ...props }: any) =>
      React.createElement('a', { href: to, ...props }, children),
    Outlet: () => React.createElement('div', { 'data-testid': 'outlet' }),
  };
});

describe('AdminLayout', () => {
  test('nav has aria-label="Admin navigation"', () => {
    mockLocation.mockReturnValue({ pathname: '/admin' });
    render(<AdminLayout />);
    const nav = screen.getByRole('navigation', { name: 'Admin navigation' });
    expect(nav).toBeInTheDocument();
  });

  test('active Dashboard link has aria-current="page" when at /admin', () => {
    mockLocation.mockReturnValue({ pathname: '/admin' });
    render(<AdminLayout />);
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashboardLink).toHaveAttribute('aria-current', 'page');
  });

  test('active Events link has aria-current="page" when at /admin/events', () => {
    mockLocation.mockReturnValue({ pathname: '/admin/events' });
    render(<AdminLayout />);
    const eventsLink = screen.getByRole('link', { name: /events/i });
    expect(eventsLink).toHaveAttribute('aria-current', 'page');
  });

  test('non-active links do not have aria-current', () => {
    mockLocation.mockReturnValue({ pathname: '/admin' });
    render(<AdminLayout />);
    const eventsLink = screen.getByRole('link', { name: /events/i });
    expect(eventsLink).not.toHaveAttribute('aria-current');
  });

  test('renders all admin nav links', () => {
    mockLocation.mockReturnValue({ pathname: '/admin' });
    render(<AdminLayout />);
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /events/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /forum/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /members/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /messages/i })).toBeInTheDocument();
  });
});
