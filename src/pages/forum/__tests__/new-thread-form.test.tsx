import { describe, test, expect } from 'vitest';
import { z } from 'zod';

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
