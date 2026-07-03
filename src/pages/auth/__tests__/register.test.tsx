import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RegisterPage } from '../register';
import { useMutation } from '@tanstack/react-query';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { toast } from 'sonner';

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

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('RegisterPage', () => {
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

  test('renders registration form', () => {
    renderWithRouter(<RegisterPage />);
    expect(screen.getByText('Create an Account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your@email.com/i)).toBeInTheDocument();
  });

  test('shows spinner and "Creating account..." during pending', () => {
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      isSuccess: false,
      isError: false,
      error: null,
    } as any);
    renderWithRouter(<RegisterPage />);
    const submitButton = screen.getByRole('button', { name: /creating account/i });
    expect(submitButton).toBeDisabled();
    expect(submitButton.querySelector('svg')).toBeInTheDocument();
  });

  test('shows account created toast on successful registration', () => {
    vi.spyOn(toast, 'success');
    let onSuccess: () => void = () => {};
    vi.mocked(useMutation).mockImplementation((opts: any) => {
      onSuccess = opts.onSuccess ?? (() => {});
      return { mutate: mockMutate, isPending: false } as any;
    });
    renderWithRouter(<RegisterPage />);
    fireEvent.change(screen.getByPlaceholderText(/your full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText(/your@email.com/i), { target: { value: 'test@example.com' } });
    const passwordInputs = screen.getAllByPlaceholderText(/at least 6 characters|repeat your password/i);
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    onSuccess();
    expect(toast.success).toHaveBeenCalledWith('Account created successfully!');
  });
});
