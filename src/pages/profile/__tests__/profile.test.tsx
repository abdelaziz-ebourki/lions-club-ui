import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query';
import { ProfilePage } from '../profile';
import { useProfileForm } from '@/hooks/use-profile-form';
import { useProfileQuery } from '@/hooks/use-profile-query';
import { useEmailVerification } from '@/hooks/use-email-verification';
import { useAuth } from '@/contexts/auth';
import { api } from '@/lib/api';
import { toast } from 'sonner';

vi.mock('@/contexts/auth');
vi.mock('@/hooks/use-profile-query');
vi.mock('@/hooks/use-profile-form');
vi.mock('@/hooks/use-email-verification');

vi.mock('@/lib/api', () => ({
  api: { get: vi.fn(), put: vi.fn(), post: vi.fn(), upload: vi.fn() },
}));
vi.mock('sonner');

const baseProfile = { id: '1', name: 'John Doe', email: 'john@test.com', role: 'member' as const, emailVerified: true, lastLoginIp: '192.168.1.1', accountStatus: 'active' as const, createdAt: '2024-01-01T00:00:00Z', avatar: null as string | null };
const adminProfile = { ...baseProfile, name: 'Admin User', email: 'admin@test.com', role: 'admin' as const };
const profileWithAvatar = { ...baseProfile, avatar: '/avatars/1.jpg' };
const authUser = { id: '1', name: 'John Doe', email: 'john@test.com', role: 'member' as const, emailVerified: true };

function renderWithQuery(ui: React.ReactElement) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useEmailVerification).mockReturnValue({ isVerified: true, isCooldown: false, cooldownSeconds: 0, resend: vi.fn(), verify: vi.fn(), isVerifying: false, verifyResult: null } as any);
  vi.mocked(useMutation).mockReturnValue({ isPending: false, isError: false, error: null, data: null, mutate: vi.fn(), mutateAsync: vi.fn(), reset: vi.fn() } as any);
});

describe('ProfilePage', () => {
  const defaultAuth = () => ({ user: authUser, isAuthenticated: true, isAdmin: false, isEmailVerified: true, loading: false, login: vi.fn(), register: vi.fn(), logout: vi.fn(), refreshUser: vi.fn() });
  const defaultForm = () => ({ form: { control: {}, register: vi.fn(() => ({})), handleSubmit: vi.fn((cb: any) => vi.fn().mockImplementation(cb)), reset: vi.fn(), formState: { errors: {} } }, isSubmitting: false, onSubmit: vi.fn(), mutation: { isPending: false, mutate: vi.fn(), reset: vi.fn() } });

  test('renders user name and email from profile', () => {
    vi.mocked(useAuth).mockReturnValue(defaultAuth() as any);
    vi.mocked(useProfileQuery).mockReturnValue({ data: baseProfile, isLoading: false, error: null } as any);
    vi.mocked(useProfileForm).mockReturnValue(defaultForm() as any);

    renderWithQuery(<ProfilePage />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@test.com')).toBeInTheDocument();
  });

  test('shows skeleton while loading', () => {
    vi.mocked(useAuth).mockReturnValue(defaultAuth() as any);
    vi.mocked(useProfileQuery).mockReturnValue({ data: undefined, isLoading: true, error: null } as any);

    const { container } = renderWithQuery(<ProfilePage />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  test('falls back to auth user data when profile fetch fails', () => {
    vi.mocked(useAuth).mockReturnValue(defaultAuth() as any);
    vi.mocked(useProfileQuery).mockReturnValue({ data: undefined, isLoading: false, error: new Error('Failed to fetch') } as any);

    renderWithQuery(<ProfilePage />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('shows admin-only fields for admin users', () => {
    vi.mocked(useAuth).mockReturnValue({ ...defaultAuth(), user: adminProfile, isAdmin: true } as any);
    vi.mocked(useProfileQuery).mockReturnValue({ data: adminProfile, isLoading: false, error: null } as any);
    vi.mocked(useProfileForm).mockReturnValue(defaultForm() as any);

    renderWithQuery(<ProfilePage />);

    expect(screen.getByText(/192\.168\.1\.1/)).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
  });

  test('hides admin-only fields for non-admin users', () => {
    vi.mocked(useAuth).mockReturnValue(defaultAuth() as any);
    vi.mocked(useProfileQuery).mockReturnValue({ data: baseProfile, isLoading: false, error: null } as any);

    renderWithQuery(<ProfilePage />);

    expect(screen.queryByText(/192\.168\.1\.1/)).not.toBeInTheDocument();
    expect(screen.queryByText('active')).not.toBeInTheDocument();
  });

  test('renders avatar fallback with initials when avatar is present', () => {
    vi.mocked(useAuth).mockReturnValue(defaultAuth() as any);
    vi.mocked(useProfileQuery).mockReturnValue({ data: profileWithAvatar, isLoading: false, error: null } as any);

    renderWithQuery(<ProfilePage />);

    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  test('shows initials when no avatar', () => {
    vi.mocked(useAuth).mockReturnValue(defaultAuth() as any);
    vi.mocked(useProfileQuery).mockReturnValue({ data: baseProfile, isLoading: false, error: null } as any);

    renderWithQuery(<ProfilePage />);

    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  test('toggles edit mode when clicking edit button', async () => {
    vi.mocked(useAuth).mockReturnValue(defaultAuth() as any);
    vi.mocked(useProfileQuery).mockReturnValue({ data: baseProfile, isLoading: false, error: null } as any);
    vi.mocked(useProfileForm).mockReturnValue(defaultForm() as any);

    renderWithQuery(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
    });

    await act(async () => {
      screen.getByRole('button', { name: /edit profile/i }).click();
    });

    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  test('submits profile form successfully', async () => {
    const mockMutate = vi.fn();
    vi.mocked(useAuth).mockReturnValue(defaultAuth() as any);
    vi.mocked(useProfileQuery).mockReturnValue({ data: baseProfile, isLoading: false, error: null } as any);
    vi.mocked(useProfileForm).mockReturnValue({ form: { control: {}, register: vi.fn(() => ({})), handleSubmit: vi.fn((cb: any) => vi.fn().mockImplementation(cb)), reset: vi.fn(), formState: { errors: {} } }, isSubmitting: false, onSubmit: vi.fn(), mutation: { isPending: false, mutate: mockMutate, reset: vi.fn() } } as any);

    renderWithQuery(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
    });

    await act(async () => {
      screen.getByRole('button', { name: /edit profile/i }).click();
    });

    await act(async () => {
      screen.getByRole('button', { name: /save/i }).click();
    });

    expect(mockMutate).toHaveBeenCalled();
  });

  test('saves profile on enter key', async () => {
    const mockMutate = vi.fn();
    vi.mocked(useAuth).mockReturnValue(defaultAuth() as any);
    vi.mocked(useProfileQuery).mockReturnValue({ data: baseProfile, isLoading: false, error: null } as any);
    vi.mocked(useProfileForm).mockReturnValue({ form: { control: {}, register: vi.fn(() => ({})), handleSubmit: vi.fn((cb: any) => vi.fn().mockImplementation(cb)), reset: vi.fn(), formState: { errors: {} } }, isSubmitting: false, onSubmit: vi.fn(), mutation: { isPending: false, mutate: mockMutate, reset: vi.fn() } } as any);

    const { container } = renderWithQuery(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
    });

    await act(async () => {
      screen.getByRole('button', { name: /edit profile/i }).click();
    });

    const formEl = container.querySelector('form');
    fireEvent.submit(formEl!);

    expect(mockMutate).toHaveBeenCalled();
  });

  test('changes password successfully', async () => {
    let capturedFn: ((data: any) => Promise<any>) | null = null;
    vi.mocked(useMutation).mockImplementation((options: any) => {
      capturedFn = options.mutationFn;
      return { isPending: false, isError: false, error: null, data: null, mutate: (d: any) => { capturedFn?.(d); }, mutateAsync: vi.fn(), reset: vi.fn() } as any;
    });

    vi.mocked(useAuth).mockReturnValue(defaultAuth() as any);
    vi.mocked(useProfileQuery).mockReturnValue({ data: baseProfile, isLoading: false, error: null } as any);
    vi.mocked(useProfileForm).mockReturnValue(defaultForm() as any);

    renderWithQuery(<ProfilePage />);

    const currentPasswordInput = screen.getByLabelText(/current password/i);
    const newPasswordInput = screen.getByLabelText(/^new password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);

    await userEvent.type(currentPasswordInput, 'oldPass123');
    await userEvent.type(newPasswordInput, 'newPass123');
    await userEvent.type(confirmPasswordInput, 'newPass123');

    await act(async () => {
      screen.getByRole('button', { name: /change password|update password/i }).click();
    });

    expect(api.put).toHaveBeenCalled();
  });

  test('shows inline error when passwords do not match', async () => {
    vi.mocked(useAuth).mockReturnValue(defaultAuth() as any);
    vi.mocked(useProfileQuery).mockReturnValue({ data: baseProfile, isLoading: false, error: null } as any);
    vi.mocked(useProfileForm).mockReturnValue(defaultForm() as any);

    renderWithQuery(<ProfilePage />);

    const currentPasswordInput = screen.getByLabelText(/current password/i);
    const newPasswordInput = screen.getByLabelText(/^new password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);

    await userEvent.type(currentPasswordInput, 'oldPass123');
    await userEvent.type(newPasswordInput, 'newPass123');
    await userEvent.type(confirmPasswordInput, 'different');

    await act(async () => {
      screen.getByRole('button', { name: /change password|update password/i }).click();
    });

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  test('shows error toast when current password is incorrect', async () => {
    const mockError = new Error('Current password is incorrect');
    vi.mocked(api.put).mockRejectedValue(mockError);

    vi.mocked(useMutation).mockImplementation((options: any) => {
      return {
        isPending: false,
        isError: false,
        error: null,
        data: null,
        mutate: async (d: any) => {
          try {
            await options.mutationFn(d);
            options.onSuccess?.();
          } catch (e) {
            options.onError?.(e);
          }
        },
        mutateAsync: vi.fn(),
        reset: vi.fn(),
      } as any;
    });

    vi.mocked(useAuth).mockReturnValue(defaultAuth() as any);
    vi.mocked(useProfileQuery).mockReturnValue({ data: baseProfile, isLoading: false, error: null } as any);
    vi.mocked(useProfileForm).mockReturnValue(defaultForm() as any);

    renderWithQuery(<ProfilePage />);

    const currentPasswordInput = screen.getByLabelText(/current password/i);
    const newPasswordInput = screen.getByLabelText(/^new password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);

    await userEvent.type(currentPasswordInput, 'wrongPassword');
    await userEvent.type(newPasswordInput, 'newPass123');
    await userEvent.type(confirmPasswordInput, 'newPass123');

    await act(async () => {
      screen.getByRole('button', { name: /change password|update password/i }).click();
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  test('shows avatar upload modal when clicking avatar edit', async () => {
    vi.mocked(useAuth).mockReturnValue(defaultAuth() as any);
    vi.mocked(useProfileQuery).mockReturnValue({ data: baseProfile, isLoading: false, error: null } as any);

    renderWithQuery(<ProfilePage />);

    const editAvatarBtn = screen.getByRole('button', { name: 'JD' });
    await act(async () => {
      editAvatarBtn.click();
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('shows email verification banner when not verified', () => {
    const unverifiedProfile = { ...authUser, emailVerified: false };
    vi.mocked(useAuth).mockReturnValue({ ...defaultAuth(), user: unverifiedProfile, isEmailVerified: false } as any);
    vi.mocked(useProfileQuery).mockReturnValue({ data: { ...baseProfile, emailVerified: false }, isLoading: false, error: null } as any);
    vi.mocked(useEmailVerification).mockReturnValue({ isVerified: false, isCooldown: false, cooldownSeconds: 0, resend: vi.fn(), verify: vi.fn(), isVerifying: false, verifyResult: null } as any);

    renderWithQuery(<ProfilePage />);

    expect(screen.getByText('Email not verified')).toBeInTheDocument();
  });
});
