import { describe, test, expect } from 'vitest';
import { newsHandlers } from '../news';

describe('MSW News Handlers', () => {
  const getHandler = (method: string, path: string) =>
    (newsHandlers as any[]).find((h: any) => (h.info?.method ?? h.method) === method && (h.info?.path ?? h.path) === path);

  describe('GET /api/news/admin', () => {
    test('handler exists', () => {
      const handler = getHandler('GET', '/api/news/admin');
      expect(handler).toBeDefined();
    });
  });

  describe('GET /api/news/admin/:id', () => {
    test('handler exists', () => {
      const handler = getHandler('GET', '/api/news/admin/:id');
      expect(handler).toBeDefined();
    });
  });

  describe('GET /api/news', () => {
    test('handler exists', () => {
      const handler = getHandler('GET', '/api/news');
      expect(handler).toBeDefined();
    });
  });

  describe('GET /api/news/featured', () => {
    test('handler exists', () => {
      const handler = getHandler('GET', '/api/news/featured');
      expect(handler).toBeDefined();
    });
  });

  describe('GET /api/news/:slug', () => {
    test('handler exists', () => {
      const handler = getHandler('GET', '/api/news/:slug');
      expect(handler).toBeDefined();
    });
  });

  describe('POST /api/news', () => {
    test('handler exists', () => {
      const handler = getHandler('POST', '/api/news');
      expect(handler).toBeDefined();
    });
  });

  describe('PUT /api/news/:id', () => {
    test('handler exists', () => {
      const handler = getHandler('PUT', '/api/news/:id');
      expect(handler).toBeDefined();
    });
  });

  describe('DELETE /api/news/:id', () => {
    test('handler exists', () => {
      const handler = getHandler('DELETE', '/api/news/:id');
      expect(handler).toBeDefined();
    });
  });

  describe('handler registration order', () => {
    test('admin endpoints registered before :slug catch-all', () => {
      const handlers = newsHandlers as any[];
      const adminIndex = handlers.findIndex(h => (h.info?.path ?? h.path) === '/api/news/admin');
      const adminIdIndex = handlers.findIndex(h => (h.info?.path ?? h.path) === '/api/news/admin/:id');
      const slugIndex = handlers.findIndex(h => (h.info?.path ?? h.path) === '/api/news/:slug');

      expect(adminIndex).toBeLessThan(slugIndex);
      expect(adminIdIndex).toBeLessThan(slugIndex);
    });
  });
});