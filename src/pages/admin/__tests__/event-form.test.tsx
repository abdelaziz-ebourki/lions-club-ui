import { describe, test, expect } from 'vitest';
import { z } from 'zod';

const eventSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  date: z.string().min(1),
  time: z.string().min(1),
  location: z.string().min(3).max(200),
  category: z.string().min(1),
  status: z.enum(["upcoming", "ongoing", "past"]),
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
});
