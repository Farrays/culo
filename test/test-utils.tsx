/**
 * Testing Utilities - Enterprise-grade Test Helpers
 *
 * Custom render function and utilities for testing React components
 * with all necessary providers (i18n, routing, etc.)
 *
 * Usage:
 *   import { render, screen } from '../test/test-utils';
 *   render(<MyComponent />);
 *
 * @see https://testing-library.com/docs/react-testing-library/setup
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import i18n from './i18n-test-config';

// ============================================================================
// PROVIDERS WRAPPER
// ============================================================================

interface AllProvidersProps {
  children: React.ReactNode;
}

/**
 * Wrapper component that provides all necessary context providers for testing
 * Add new providers here as needed (Redux, Theme, etc.)
 */
const AllProviders: React.FC<AllProvidersProps> = ({ children }) => {
  return (
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>{children}</BrowserRouter>
      </I18nextProvider>
    </HelmetProvider>
  );
};

// ============================================================================
// CUSTOM RENDER
// ============================================================================

/**
 * Custom render function that wraps components with all providers
 * Use this instead of RTL's render in all tests
 *
 * @example
 * ```tsx
 * import { render, screen } from '../test/test-utils';
 *
 * test('renders component', () => {
 *   render(<MyComponent />);
 *   expect(screen.getByText('Hello')).toBeInTheDocument();
 * });
 * ```
 */
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>): RenderResult =>
  render(ui, { wrapper: AllProviders, ...options });

// ============================================================================
// EXPORTS
// ============================================================================

// Re-export everything from React Testing Library
export * from '@testing-library/react';

// Override render with our custom version
export { customRender as render };

// Export i18n instance for tests that need direct access
export { i18n };
