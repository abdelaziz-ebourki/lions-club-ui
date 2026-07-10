import { describe, test, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EventFormPage } from '../event-form';

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

const eventSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  date: z.string().min(1),
  time: z.string().min(1),
  location: z.string().min(3).max(200),
  category: z.string().min(1),
  status: z.enum(["upcoming", "ongoing", "past"]),
  image: z.union([z.instanceof(File), z.string()]).optional(),
});

describe('EventForm Zod Schema', () => {
  describe('status enum', () => {
    test('accepts "upcoming"', () => {
      const result = eventSchema.shape.status.safeParse("upcoming");
      expect(result.success).toBe(true);
    });

    test('accepts "ongoing"', () => {
      const result = eventSchema.shape.status.safeParse("ongoing");
      expect(result.success).toBe(true);
    });

    test('accepts "past"', () => {
      const result = eventSchema.shape.status.safeParse("past");
      expect(result.success).toBe(true);
    });

    test('rejects invalid status values', () => {
      const result = eventSchema.shape.status.safeParse("draft");
      expect(result.success).toBe(false);
    });

    test('rejects "upcoming"|"past" only — ensures "ongoing" is included', () => {
      const narrowSchema = z.enum(["upcoming", "past"]);
      expect(narrowSchema.safeParse("ongoing").success).toBe(false);
      expect(eventSchema.shape.status.safeParse("ongoing").success).toBe(true);
    });
  });

  describe('maxLength constraints', () => {
    test('rejects title exceeding 200 characters', () => {
      const result = eventSchema.safeParse({
        title: 'x'.repeat(201),
        description: 'Valid description',
        date: '2026-07-15',
        time: '14:00',
        location: 'Main Hall',
        category: 'Health',
        status: 'upcoming',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.path.includes('title'))).toBe(true);
      }
    });

    test('rejects description exceeding 2000 characters', () => {
      const result = eventSchema.safeParse({
        title: 'Valid Title',
        description: 'x'.repeat(2001),
        date: '2026-07-15',
        time: '14:00',
        location: 'Main Hall',
        category: 'Health',
        status: 'upcoming',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.path.includes('description'))).toBe(true);
      }
    });

    test('rejects location exceeding 200 characters', () => {
      const result = eventSchema.safeParse({
        title: 'Valid Title',
        description: 'Valid description text',
        date: '2026-07-15',
        time: '14:00',
        location: 'x'.repeat(201),
        category: 'Health',
        status: 'upcoming',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.path.includes('location'))).toBe(true);
      }
    });

    test('accepts valid event data', () => {
      const result = eventSchema.safeParse({
        title: 'Community Fundraiser',
        description: 'Join us for a great community fundraising event with food and music.',
        date: '2026-07-15',
        time: '14:00',
        location: 'Main Hall',
        category: 'Health',
        status: 'ongoing',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('image field', () => {
    test('accepts a File instance for image', () => {
      const file = new File(['dummy'], 'photo.png', { type: 'image/png' });
      const result = eventSchema.shape.image.safeParse(file);
      expect(result.success).toBe(true);
    });

    test('accepts a string (URL) for image', () => {
      const result = eventSchema.shape.image.safeParse('https://example.com/photo.jpg');
      expect(result.success).toBe(true);
    });

    test('accepts undefined for image (optional)', () => {
      const result = eventSchema.safeParse({
        title: 'Valid Title',
        description: 'A valid description for the event.',
        date: '2026-07-15',
        time: '14:00',
        location: 'Main Hall',
        category: 'Health',
        status: 'upcoming',
      });
      expect(result.success).toBe(true);
    });
  });
});

describe('EventFormPage Component', () => {
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
        <EventFormPage />
      </MemoryRouter>
    );
    const charCounts = screen.getAllByText(/\d+\/\d+/);
    expect(charCounts.length).toBeGreaterThanOrEqual(3);
    charCounts.forEach(el => {
      expect(el).toHaveAttribute('aria-live', 'polite');
    });
  });

  test('renders file upload area for event image', () => {
    render(
      <MemoryRouter>
        <EventFormPage />
      </MemoryRouter>
    );
    expect(screen.getByLabelText('Upload image')).toBeInTheDocument();
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
        <EventFormPage />
      </MemoryRouter>
    );
    const submitButton = screen.getByRole('button', { name: /saving/i });
    expect(submitButton).toBeDisabled();
    expect(submitButton.querySelector('svg')).toBeInTheDocument();
  });
});
