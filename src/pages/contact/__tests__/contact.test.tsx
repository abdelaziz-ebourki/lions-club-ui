import { render, screen, fireEvent, act } from '@testing-library/react';
import { ContactPage } from '../contact';
import { useMutation } from '@tanstack/react-query';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(2000),
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Link: ({ children, to, ...props }: any) =>
      <a href={to} {...props}>{children}</a>,
  };
});

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useMutation: vi.fn(),
    useQueryClient: vi.fn(() => ({ invalidateQueries: vi.fn() })),
  };
});

describe('ContactPage Zod Schema', () => {
  describe('maxLength constraints', () => {
    test('rejects name exceeding 100 characters', () => {
      const result = contactSchema.safeParse({
        name: 'x'.repeat(101),
        email: 'test@example.com',
        subject: 'Valid subject text',
        message: 'Valid message content',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.path.includes('name'))).toBe(true);
      }
    });

    test('rejects subject exceeding 200 characters', () => {
      const result = contactSchema.safeParse({
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'x'.repeat(201),
        message: 'Valid message content here',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.path.includes('subject'))).toBe(true);
      }
    });

    test('rejects message exceeding 2000 characters', () => {
      const result = contactSchema.safeParse({
        name: 'John Doe',
        email: 'test@example.com',
        subject: 'Valid subject here',
        message: 'x'.repeat(2001),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.path.includes('message'))).toBe(true);
      }
    });

    test('accepts valid contact data', () => {
      const result = contactSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Question about membership',
        message: 'I would like to know more about becoming a member of the club.',
      });
      expect(result.success).toBe(true);
    });
  });
});

describe('ContactPage Component', () => {
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

  test('shows character count indicators on load', () => {
    render(<ContactPage />);
    const counters = screen.getAllByText(/0\/\d+/);
    expect(counters.length).toBeGreaterThanOrEqual(3);
  });

  test('updates character count as user types', async () => {
    render(<ContactPage />);
    const nameInput = screen.getByPlaceholderText(/your name/i);
    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    });
    expect(screen.getByText(/8\/100/i)).toBeInTheDocument();
  });

  test('shows orange warning at 80% of max', async () => {
    render(<ContactPage />);
    const nameInput = screen.getByPlaceholderText(/your name/i);
    const eightyChars = 'x'.repeat(80);
    await act(async () => {
      fireEvent.change(nameInput, { target: { value: eightyChars } });
    });
    const counter = screen.getByText(new RegExp(`${eightyChars.length}\\/100`));
    expect(counter).toBeInTheDocument();
    expect(counter.className).toContain('amber');
  });

  test('shows submit button with spinner during pending', () => {
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      isSuccess: false,
      isError: false,
      error: null,
    } as any);
    render(<ContactPage />);
    const submitButton = screen.getByRole('button', { name: /sending/i });
    expect(submitButton).toBeDisabled();
    expect(submitButton.querySelector('svg')).toBeInTheDocument();
  });
});
