import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import React from 'react';
import '@testing-library/jest-dom';

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' }),
    useParams: () => ({}),
    Link: ({ children, to, ...props }: any) => (
      React.createElement('a', { href: to, ...props }, children)
    ),
  };
});

// Mock @tanstack/react-query
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: vi.fn(),
    useMutation: vi.fn(),
    useQueryClient: vi.fn(() => ({
      invalidateQueries: vi.fn(),
      setQueryData: vi.fn(),
      getQueryData: vi.fn(),
    })),
  };
});

// Mock api
vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock react-i18next
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  const enCommon = await import('@/i18n/locales/en/common.json');
  const enAdmin = await import('@/i18n/locales/en/admin.json');
  const enErrors = await import('@/i18n/locales/en/errors.json');
  const enForum = await import('@/i18n/locales/en/forum.json');
  const enContact = await import('@/i18n/locales/en/contact.json');
  const enAbout = await import('@/i18n/locales/en/about.json');
  const enSearch = await import('@/i18n/locales/en/search.json');
  const enEvents = await import('@/i18n/locales/en/events.json');
  const enNews = await import('@/i18n/locales/en/news.json');
  const enGallery = await import('@/i18n/locales/en/gallery.json');
  const enMembers = await import('@/i18n/locales/en/members.json');
  const enProfile = await import('@/i18n/locales/en/profile.json');
  const enAuth = await import('@/i18n/locales/en/auth.json');
  const get = (obj: any, path: string) => path.split('.').reduce((o, k) => o?.[k], obj);
  const nsMap: Record<string, any> = {
    common: enCommon.default ?? enCommon,
    admin: enAdmin.default ?? enAdmin,
    errors: enErrors.default ?? enErrors,
    forum: enForum.default ?? enForum,
    contact: enContact.default ?? enContact,
    about: enAbout.default ?? enAbout,
    search: enSearch.default ?? enSearch,
    events: enEvents.default ?? enEvents,
    news: enNews.default ?? enNews,
    gallery: enGallery.default ?? enGallery,
    members: enMembers.default ?? enMembers,
    profile: enProfile.default ?? enProfile,
    auth: enAuth.default ?? enAuth,
  };
  const resolveKey = (key: string, nsHint?: string | string[]) => {
    const colonIdx = key.indexOf(':');
    if (colonIdx !== -1) {
      const ns = key.slice(0, colonIdx);
      const subKey = key.slice(colonIdx + 1);
      if (nsMap[ns]) return get(nsMap[ns], subKey);
      return get(nsMap.common, key);
    }
    // Try ns hint first
    const hints = nsHint ? (Array.isArray(nsHint) ? nsHint : [nsHint]) : [];
    for (const h of hints) {
      if (nsMap[h]) {
        const v = get(nsMap[h], key);
        if (v !== undefined) return v;
        // plural fallback
        if (typeof v === 'undefined') {
          // try with _plural already handled outside
        }
      }
    }
    // fallback try all
    for (const map of Object.values(nsMap)) {
      const v = get(map, key);
      if (v !== undefined) return v;
    }
    return undefined;
  };
  const mockI18n: any = {
    language: 'en',
    dir: (lng: string) => (lng === 'ar' ? 'rtl' : 'ltr'),
    changeLanguage: async (lng: string) => {
      mockI18n.language = lng;
      document.documentElement.lang = lng;
      document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem('i18nextLng', lng);
      document.cookie = `i18nextLng=${lng}; path=/`;
      try {
        const real = (await import('@/i18n/config')).default;
        await real.changeLanguage(lng);
      } catch {
        // ignore
      }
      return Promise.resolve();
    },
    on: () => {},
    off: () => {},
    isInitialized: true,
  };
  return {
    ...actual,
    useTranslation: (ns?: string | string[]) => ({
      t: (key: string, opts?: any) => {
        let lookupKey = key;
        // plural handling: if count !==1 and key_plural exists
        if (opts && typeof opts.count === 'number' && opts.count !== 1) {
          const pluralKey = `${key}_plural`;
          const pluralVal = resolveKey(pluralKey, ns);
          if (pluralVal !== undefined) lookupKey = pluralKey;
        }
        const val = resolveKey(lookupKey, ns);
        if (typeof val === 'string') {
          let res = val;
          if (opts) {
            for (const [k, v] of Object.entries(opts)) {
              if (k === 'defaultValue') continue;
              res = res.replace(`{{${k}}}`, String(v));
            }
          }
          return res;
        }
        if (opts?.defaultValue) return opts.defaultValue;
        return key;
      },
      i18n: mockI18n,
    }),
    Trans: ({ children }: any) => children,
  };
});

// Mock contexts
vi.mock('@/contexts/auth', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    refreshUser: vi.fn(),
    loading: false,
  }),
}));

vi.mock('@/contexts/theme', () => ({
  useTheme: () => ({
    theme: 'light',
    toggle: vi.fn(),
    setTheme: vi.fn(),
  }),
}));
