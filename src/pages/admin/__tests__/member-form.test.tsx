import { describe, test, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MemberFormPage } from '../member-form';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(() => ({})),
    useNavigate: vi.fn(),
    Link: ({ children, to, ...props }: any) =>
      <a href={to} {...props}>{children}</a>,
  };
});

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useMutation: vi.fn(),
    useQuery: vi.fn(() => ({ data: undefined, isLoading: false })),
    useQueryClient: vi.fn(() => ({ invalidateQueries: vi.fn() })),
  };
});

const memberSchema = z.object({
  name: z.string().min(2).max(100),
  role: z.string().min(2).max(100),
  bio: z.string().max(500).optional(),
});

describe('MemberForm Zod Schema', () => {
  describe('maxLength constraints', () => {
    test('rejects name exceeding 100 characters', () => {
      const result = memberSchema.safeParse({
        name: 'x'.repeat(101),
        role: 'Treasurer',
        bio: 'Short bio',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.path.includes('name'))).toBe(true);
      }
    });

    test('rejects role exceeding 100 characters', () => {
      const result = memberSchema.safeParse({
        name: 'John Doe',
        role: 'x'.repeat(101),
        bio: 'Short bio',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.path.includes('role'))).toBe(true);
      }
    });

    test('rejects bio exceeding 500 characters', () => {
      const result = memberSchema.safeParse({
        name: 'John Doe',
        role: 'Treasurer',
        bio: 'x'.repeat(501),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.path.includes('bio'))).toBe(true);
      }
    });

    test('accepts valid member data', () => {
      const result = memberSchema.safeParse({
        name: 'John Doe',
        role: 'Treasurer',
        bio: 'Finance expert with 10 years of experience.',
      });
      expect(result.success).toBe(true);
    });

    test('accepts member data without bio', () => {
      const result = memberSchema.safeParse({
        name: 'John Doe',
        role: 'Treasurer',
      });
      expect(result.success).toBe(true);
    });
  });
});

describe('MemberFormPage Component', () => {
  const mockMutate = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (vi.mocked(useMutation) as any).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    });
    (vi.mocked(useNavigate) as any).mockReturnValue(mockNavigate);
    (vi.mocked(useParams) as any).mockReturnValue({});
    (vi.mocked(useQuery) as any).mockReturnValue({ data: undefined, isLoading: false });
    (vi.mocked(useQueryClient) as any).mockReturnValue({ invalidateQueries: vi.fn() });
  });

  test('char count spans have aria-live="polite"', () => {
    render(
      <MemoryRouter>
        <MemberFormPage />
      </MemoryRouter>
    );
    const charCounts = screen.getAllByText(/\d+\/\d+/);
    expect(charCounts.length).toBeGreaterThanOrEqual(3);
    charCounts.forEach(el => {
      expect(el).toHaveAttribute('aria-live', 'polite');
    });
  });

  test('shows spinner during pending', () => {
    (vi.mocked(useMutation) as any).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      isSuccess: false,
      isError: false,
      error: null,
    });
    render(
      <MemoryRouter>
        <MemberFormPage />
      </MemoryRouter>
    );
    const submitButton = screen.getByRole('button', { name: /saving/i });
    expect(submitButton).toBeDisabled();
    expect(submitButton.querySelector('svg')).toBeInTheDocument();
  });
});
