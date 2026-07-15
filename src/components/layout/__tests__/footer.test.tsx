import { render } from '@testing-library/react';
import { Footer } from '../footer';
import { expectImagesLazyAndSized } from '@/test-utils/image-assertions';
import { describe, test, vi } from 'vitest';

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

describe('Footer', () => {
  test('logo image is lazy-loaded with explicit dimensions (FR-001, FR-008)', () => {
    const { container } = render(<Footer />);
    expectImagesLazyAndSized(container);
  });
});
