import { vi } from 'vitest';

/**
 * Mock translations for testing
 * Returns the key itself as the translation (useful for testing)
 */
export const mockTranslations = {
  // Common
  navHome: 'Home',
  navClasses: 'Classes',
  navDanza: 'Dance',
  navDanzasUrbanas: 'Urban Dance',
  navDancehall: 'Dancehall',
  navSalsaBachata: 'Salsa & Bachata',
  navPrepFisica: 'Physical Training',
  headerContact: 'Contact',
  headerFAQ: 'FAQ',
  enrollNow: 'Enroll Now',
  skipToMainContent: 'Skip to main content',

  // Contact Page
  contactTitle: 'Contact Us',
  contact_breadcrumb_home: 'Home',
  contact_hero_title: 'Get in Touch',
  contact_info_title: 'Contact Information',
  contact_address_title: 'Address',
  contact_phone_title: 'Phone',
  contact_email_title: 'Email',
  contact_form_title: 'Send us a message',
  contact_form_name: 'Name',
  contact_form_name_placeholder: 'Your name',
  contact_form_email: 'Email',
  contact_form_email_placeholder: 'your@email.com',
  contact_form_phone: 'Phone',
  contact_form_phone_placeholder: '+34 600 000 000',
  contact_form_message: 'Message',
  contact_form_message_placeholder: 'Your message',
  contact_form_submit: 'Send Message',

  // HomePage
  pageTitle: "Farray's International Dance Center",
  metaDescription: 'Elite dance academy in Barcelona',

  // Other common keys
  loadingText: 'Loading...',
};

/**
 * Mock useI18n hook for testing
 */
export const mockUseI18n = {
  locale: 'es' as const,
  setLocale: vi.fn(),
  t: (key: string): string => mockTranslations[key as keyof typeof mockTranslations] || key,
  isLoading: false,
};

/**
 * Setup mock for useI18n hook
 * Call this in tests that need i18n mocking
 */
export const setupI18nMock = (): void => {
  vi.mock('../hooks/useI18n', () => ({
    useI18n: () => mockUseI18n,
    I18nProvider: ({ children }: { children: React.ReactNode }) => children,
  }));
};
