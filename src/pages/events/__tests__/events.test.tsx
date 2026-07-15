import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { EventsPage } from '../events';
import { useQuery } from '@tanstack/react-query';
import { events } from '@/mocks/data/events';
import { expectImagesLazyAndSized } from '@/test-utils/image-assertions';
import { describe, test, vi, beforeEach } from 'vitest';

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

describe('EventsPage images', () => {
  beforeEach(() => {
    vi.mocked(useQuery).mockReturnValue({
      data: events,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as never);
  });

  test('event card images are lazy-loaded with explicit dimensions (FR-001, FR-003, FR-008)', () => {
    const { container } = render(
      <MemoryRouter>
        <EventsPage />
      </MemoryRouter>,
    );
    expectImagesLazyAndSized(container);
  });
});
