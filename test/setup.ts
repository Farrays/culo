import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// ============================================================================
// i18NEXT CONFIGURATION FOR TESTS
// ============================================================================
// Initialize i18next with test configuration
// This ensures all react-i18next hooks work properly in tests
import './i18n-test-config';

// ============================================================================
// GLOBAL MOCKS
// ============================================================================

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
global.localStorage = localStorageMock as unknown as Storage;

// Mock scrollTo
global.scrollTo = vi.fn();

// ============================================================================
// i18NEXT - NO MOCK NEEDED
// ============================================================================
// useI18n is now a direct re-export of useTranslation from react-i18next
// Tests use the real i18n instance from test/i18n-test-config.ts via test-utils.tsx
// This provides proper Spanish translations matching production
