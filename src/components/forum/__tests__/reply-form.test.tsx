import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Toaster } from 'sonner';
import { ReplyForm } from '../reply-form';
import { describe, test, expect, vi } from 'vitest';

describe('ReplyForm', () => {
  const mockOnSubmit = vi.fn().mockResolvedValue(undefined);

  const renderComponent = (props = {}) => {
    return render(
      <>
        <Toaster />
        <ReplyForm onSubmit={mockOnSubmit} {...props} />
      </>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSubmit.mockResolvedValue(undefined);
  });

  describe('Basic Rendering', () => {
    test('renders textarea with placeholder', () => {
      renderComponent();
      const textarea = screen.getByPlaceholderText(/write a reply/i);
      expect(textarea).toBeInTheDocument();
    });

    test('shows character count (current/max)', () => {
      renderComponent();
      expect(screen.getByText(/0\/5000/i)).toBeInTheDocument();
    });

    test('shows "Reply to thread" label', () => {
      renderComponent();
      expect(screen.getByText(/reply to thread/i)).toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    test('shows error when content is empty', async () => {
      renderComponent();
      const submitButton = screen.getByRole('button', { name: /post reply/i });
      await act(async () => {
        fireEvent.click(submitButton);
      });
      await waitFor(() => {
        expect(screen.getByText(/at least 5 characters/i)).toBeInTheDocument();
      });
    });

    test('shows error when content is less than 5 characters', async () => {
      renderComponent();
      const textarea = screen.getByPlaceholderText(/write a reply/i);
      await act(async () => {
        fireEvent.change(textarea, { target: { value: 'Hi' } });
      });
      const submitButton = screen.getByRole('button', { name: /post reply/i });
      await act(async () => {
        fireEvent.click(submitButton);
      });
      await waitFor(() => {
        expect(screen.getByText(/at least 5 characters/i)).toBeInTheDocument();
      });
    });

    test('shows field error immediately on invalid input', async () => {
      renderComponent();
      const textarea = screen.getByPlaceholderText(/write a reply/i);
      await act(async () => {
        fireEvent.change(textarea, { target: { value: 'Hi' } });
      });
      await waitFor(() => {
        expect(screen.getByText(/at least 5 characters/i)).toBeInTheDocument();
      });
    });
  });

  describe('Submission', () => {
    test('calls onSubmit with content on valid submit', async () => {
      renderComponent();
      const textarea = screen.getByPlaceholderText(/write a reply/i);
      await act(async () => {
        fireEvent.change(textarea, { target: { value: 'This is a valid reply content' } });
      });
      const submitButton = screen.getByRole('button', { name: /post reply/i });
      await act(async () => {
        fireEvent.click(submitButton);
      });
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({ content: 'This is a valid reply content' });
      });
    });

    test('clears textarea after successful submit', async () => {
      renderComponent();
      const textarea = screen.getByPlaceholderText(/write a reply/i);
      await act(async () => {
        fireEvent.change(textarea, { target: { value: 'Valid reply content' } });
      });
      const submitButton = screen.getByRole('button', { name: /post reply/i });
      await act(async () => {
        fireEvent.click(submitButton);
      });
      await waitFor(() => {
        expect(textarea).toHaveValue('');
      });
    });

    test('shows error toast on submit failure', async () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      try {
        mockOnSubmit.mockRejectedValueOnce(new Error('Failed to post'));
        renderComponent();
        const textarea = screen.getByPlaceholderText(/write a reply/i);
        await act(async () => {
          fireEvent.change(textarea, { target: { value: 'Valid reply content' } });
        });
        const submitButton = screen.getByRole('button', { name: /post reply/i });
        await act(async () => {
          fireEvent.click(submitButton);
        });
        await waitFor(() => {
          expect(screen.getByText(/failed to post reply/i)).toBeInTheDocument();
        });
      } finally {
        spy.mockRestore();
      }
    });

    test('shows loading state during submission', async () => {
      let resolveSubmit: () => void;
      const submitPromise = new Promise<void>((resolve) => {
        resolveSubmit = resolve;
      });
      mockOnSubmit.mockReturnValueOnce(submitPromise);

      renderComponent();
      const textarea = screen.getByPlaceholderText(/write a reply/i);
      await act(async () => {
        fireEvent.change(textarea, { target: { value: 'Valid reply content' } });
      });
      const submitButton = screen.getByRole('button', { name: /post reply/i });
      await act(async () => {
        fireEvent.click(submitButton);
      });

      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent(/posting/i);

      resolveSubmit!();
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('Character Count', () => {
    test('updates character count as user types', () => {
      renderComponent();
      const textarea = screen.getByPlaceholderText(/write a reply/i);
      act(() => {
        fireEvent.change(textarea, { target: { value: 'Hello world' } });
      });
      expect(screen.getByText(/11\/5000/i)).toBeInTheDocument();
    });

    test('shows warning when approaching limit', () => {
      renderComponent({ maxLength: 20 });
      const textarea = screen.getByPlaceholderText(/write a reply/i);
      act(() => {
        fireEvent.change(textarea, { target: { value: 'This is a warning' } });
      });
      expect(screen.getByText(/17\/20/i)).toBeInTheDocument();
    });
  });

  describe('Nested Reply (parentReplyId)', () => {
    test('accepts optional parentReplyId prop', () => {
      renderComponent({ parentReplyId: 'reply-123' });
      const form = screen.getByTestId('reply-form');
      expect(form).toBeInTheDocument();
    });

    test('shows "Replying to @author" when quoting', async () => {
      renderComponent({ parentReplyId: 'reply-123', quotedAuthor: 'JohnDoe' });
      expect(screen.getByText(/replying to @johndoe/i)).toBeInTheDocument();
    });

    test('includes parentReplyId in submit payload', async () => {
      renderComponent({ parentReplyId: 'reply-123' });
      const textarea = screen.getByPlaceholderText(/write a reply/i);
      await act(async () => {
        fireEvent.change(textarea, { target: { value: 'Reply content' } });
      });
      const submitButton = screen.getByRole('button', { name: /post reply/i });
      await act(async () => {
        fireEvent.click(submitButton);
      });
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          content: 'Reply content',
          parentReplyId: 'reply-123',
        });
      });
    });
  });
});