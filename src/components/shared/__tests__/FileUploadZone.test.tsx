import { render } from '@testing-library/react';
import { FileUploadZone } from '../FileUploadZone';
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

describe('FileUploadZone images', () => {
  test('preview image is lazy-loaded with explicit dimensions (FR-001, FR-008)', () => {
    const onRemove = vi.fn();
    const { container } = render(
      <FileUploadZone
        loading={false}
        previewUrl="https://example.com/preview.png"
        variant="square"
        onRemove={onRemove}
      />,
    );
    expectImagesLazyAndSized(container);
  });
});
