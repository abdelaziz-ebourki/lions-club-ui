import { describe, test, expect } from 'vitest';
import { z } from 'zod';

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
