import { render, screen, fireEvent } from '@testing-library/react';
import { ThreadStatus } from '../thread-status';
import type { ForumThreadStatus } from '@/types';

describe('ThreadStatus', () => {
  const renderComponent = (status: ForumThreadStatus, isAdmin = false, isLoading = false) => {
    return render(
      <ThreadStatus
        status={status}
        isAdmin={isAdmin}
        isLoading={isLoading}
        onStatusChange={vi.fn()}
      />
    );
  };

  describe('Status Badges', () => {
    test('renders Pinned badge (gold) when status === "pinned"', () => {
      renderComponent('pinned');
      const badge = screen.getByText('Pinned');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-accent/10', 'text-accent');
    });

    test('renders Locked badge (red) when status === "locked"', () => {
      renderComponent('locked');
      const badge = screen.getByText('Locked');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-destructive/10', 'text-destructive');
    });

    test('renders Active badge (blue) when status === "active"', () => {
      renderComponent('active');
      const badge = screen.getByText('Active');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-primary/10', 'text-primary');
    });

    test('renders Archived badge (muted) when status === "archived"', () => {
      renderComponent('archived');
      const badge = screen.getByText('Archived');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-muted', 'text-muted-foreground');
    });

    test('renders nothing when status === "normal"', () => {
      renderComponent('normal');
      expect(screen.queryByText('Pinned')).not.toBeInTheDocument();
      expect(screen.queryByText('Locked')).not.toBeInTheDocument();
      expect(screen.queryByText('Active')).not.toBeInTheDocument();
      expect(screen.queryByText('Archived')).not.toBeInTheDocument();
    });
  });

  describe('Admin Toggles', () => {
    test('shows pin toggle for admin when not pinned', () => {
      renderComponent('normal', true);
      const pinButton = screen.getByTestId('pin-button');
      expect(pinButton).toBeInTheDocument();
    });

    test('shows unpin toggle for admin when pinned', () => {
      renderComponent('pinned', true);
      const unpinButton = screen.getByTestId('unpin-button');
      expect(unpinButton).toBeInTheDocument();
    });

    test('shows lock toggle for admin when not locked', () => {
      renderComponent('normal', true);
      const lockButton = screen.getByTestId('lock-button');
      expect(lockButton).toBeInTheDocument();
    });

    test('shows unlock toggle for admin when locked', () => {
      renderComponent('locked', true);
      const unlockButton = screen.getByTestId('unlock-button');
      expect(unlockButton).toBeInTheDocument();
    });

    test('hides toggles for non-admin users', () => {
      renderComponent('normal', false);
      expect(screen.queryByTestId('pin-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('lock-button')).not.toBeInTheDocument();
    });

    test('calls onStatusChange with "pinned" when pin button clicked', () => {
      const handleStatusChange = vi.fn();
      render(<ThreadStatus status="normal" isAdmin isLoading={false} onStatusChange={handleStatusChange} />);
      const pinButton = screen.getByTestId('pin-button');
      fireEvent.click(pinButton);
      expect(handleStatusChange).toHaveBeenCalledWith('pinned');
    });

    test('calls onStatusChange with "locked" when lock button clicked', () => {
      const handleStatusChange = vi.fn();
      render(<ThreadStatus status="normal" isAdmin isLoading={false} onStatusChange={handleStatusChange} />);
      const lockButton = screen.getByTestId('lock-button');
      fireEvent.click(lockButton);
      expect(handleStatusChange).toHaveBeenCalledWith('locked');
    });

    test('shows loading state during status update', () => {
      renderComponent('normal', true, true);
      const pinButton = screen.getByTestId('pin-button');
      expect(pinButton).toBeDisabled();
      // Icon-only button shows loading via disabled state
    });
  });

  describe('Tooltips', () => {
    test('shows tooltip on Pinned badge', () => {
      renderComponent('pinned');
      const badge = screen.getByText('Pinned');
      expect(badge).toHaveAttribute('title', 'This thread is pinned to the top');
    });

    test('shows tooltip on Locked badge', () => {
      renderComponent('locked');
      const badge = screen.getByText('Locked');
      expect(badge).toHaveAttribute('title', 'This thread is locked, no new replies allowed');
    });
  });
});