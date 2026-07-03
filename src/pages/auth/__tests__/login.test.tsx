import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from '../login';
import { useMutation } from '@tanstack/react-query';
import { describe, test, expect, vi, beforeEach } from 'vitest';

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

describe('LoginPage', () => {
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    } as any);
  });

  test('renders sign in form', () => {
    renderWithRouter(<LoginPage />);
    expect(screen.getAllByText('Sign In').length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText(/your@email.com/i)).toBeInTheDocument();
  });

  test('renders "Remember me" checkbox below password field', () => {
    renderWithRouter(<LoginPage />);
    const checkbox = screen.getByLabelText(/remember me/i);
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  test('checking "Remember me" stores flag in localStorage', () => {
    renderWithRouter(<LoginPage />);
    const checkbox = screen.getByLabelText(/remember me/i);
    fireEvent.click(checkbox);
    expect(localStorage.getItem("remember_me")).toBe("true");
  });

  test('unchecking "Remember me" removes flag from localStorage', () => {
    localStorage.setItem("remember_me", "true");
    renderWithRouter(<LoginPage />);
    const checkbox = screen.getByLabelText(/remember me/i);
    expect(checkbox).toBeChecked();
    fireEvent.click(checkbox);
    expect(localStorage.getItem("remember_me")).toBeNull();
  });

  test('shows spinner and "Signing in..." during pending', () => {
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      isSuccess: false,
      isError: false,
      error: null,
    } as any);
    renderWithRouter(<LoginPage />);
    const submitButton = screen.getByRole('button', { name: /signing in/i });
    expect(submitButton).toBeDisabled();
    expect(submitButton.querySelector('svg')).toBeInTheDocument();
  });
});
