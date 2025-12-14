import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Mock IntersectionObserver - proper implementation
class MockIntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}

global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
// eslint-disable-next-line no-undef
global.localStorage = localStorageMock as unknown as Storage;

// Mock scrollTo
global.scrollTo = vi.fn();

// Mock useI18n hook globally
vi.mock('../hooks/useI18n', () => {
  const mockTranslations: Record<string, string> = {
    // Common
    navHome: 'Home',
    navClasses: 'Classes',
    enrollNow: 'Enroll Now',
    skipToMainContent: 'Skip to main content',

    // Contact Page
    contactTitle: 'Contact Us',
    contact_breadcrumb_home: 'Home',
    contact_breadcrumb_current: 'Contact',
    contact_hero_title: 'Get in Touch',
    contact_hero_subtitle:
      'We are here to help you. Write to us and we will respond as soon as possible.',
    contact_info_title: 'Contact Information',
    contact_address_title: 'Address',
    contact_address_text: 'Calle Entença nº 100, Barcelona',
    contact_phone_title: 'Phone',
    contact_email_title: 'Email',
    contact_form_title: 'Send us a message',
    contact_form_name: 'Name',
    contact_form_email: 'Email',
    contact_form_phone: 'Phone',
    contact_form_message: 'Message',
    contact_form_submit: 'Send Message',

    // HomePage
    pageTitle: "Farray's International Dance Center",
    metaDescription: 'Elite dance academy in Barcelona',
  };

  return {
    useI18n: () => ({
      locale: 'en',
      setLocale: vi.fn(),
      t: (key: string) => mockTranslations[key] || key,
      isLoading: false,
    }),
    I18nProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});
