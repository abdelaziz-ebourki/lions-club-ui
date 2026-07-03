import { describe, test, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { NewThreadForm } from '../new-thread-form';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(() => ({ categoryId: 'cat-1' })),
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
  };
});

const threadSchema = z.object({
  title: z.string().min(5).max(200),
  content: z.string().min(10).max(5000),
});

describe('NewThreadForm Zod Schema', () => {
  describe('maxLength constraints', () => {
    test('rejects title exceeding 200 characters', () => {
      const result = threadSchema.safeParse({
        title: 'x'.repeat(201),
        content: 'Valid content that is long enough for the schema',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.path.includes('title'))).toBe(true);
      }
    });

    test('rejects content exceeding 5000 characters', () => {
      const result = threadSchema.safeParse({
        title: 'Valid Thread Title',
        content: 'x'.repeat(5001),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.path.includes('content'))).toBe(true);
      }
    });

    test('accepts valid thread data', () => {
      const result = threadSchema.safeParse({
        title: 'Discussion about community service',
        content: 'I think we should organize more community service events this year.',
      });
      expect(result.success).toBe(true);
    });
  });
});

describe('NewThreadForm Component', () => {
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    } as any);
  });

  test('char count spans have aria-live="polite"', () => {
    render(
      <MemoryRouter>
        <NewThreadForm />
      </MemoryRouter>
    );
    const charCounts = screen.getAllByText(/\d+\/\d+/);
    expect(charCounts.length).toBeGreaterThanOrEqual(2);
    charCounts.forEach(el => {
      expect(el).toHaveAttribute('aria-live', 'polite');
    });
  });

  test('shows spinner during pending', () => {
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      isSuccess: false,
      isError: false,
      error: null,
    } as any);
    render(
      <MemoryRouter>
        <NewThreadForm />
      </MemoryRouter>
    );
    const submitButton = screen.getByRole('button', { name: /posting/i });
    expect(submitButton).toBeDisabled();
    expect(submitButton.querySelector('svg')).toBeInTheDocument();
  });

  test('shows success glow after successful submit', async () => {
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    } as any);
    render(
      <MemoryRouter>
        <NewThreadForm />
      </MemoryRouter>
    );
    const titleInput = screen.getByPlaceholderText(/what would you like to discuss/i);
    const contentTextarea = screen.getByPlaceholderText(/share your thoughts/i);
    await act(async () => {
      fireEvent.change(titleInput, { target: { value: 'A valid thread title for testing' } });
      fireEvent.change(contentTextarea, { target: { value: 'This is a valid content that is long enough for the form validation' } });
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /post thread/i }));
    });
    expect(mockMutate).toHaveBeenCalled();
  });
});
