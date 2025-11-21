import React, { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nProvider } from '../hooks/useI18n';
import { HelmetProvider } from 'react-helmet-async';

/**
 * Custom render function that wraps components with all necessary providers
 * for testing (Router, I18n, Helmet)
 */
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <I18nProvider>{children}</I18nProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
};

/**
 * Custom render with providers
 * Usage: renderWithProviders(<YourComponent />)
 */
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>): RenderResult =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Override render method
export { customRender as render };
