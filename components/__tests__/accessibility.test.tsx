import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { I18nProvider } from '../../hooks/useI18n';
import Header from '../Header';
import Footer from '../Footer';
import Breadcrumb from '../shared/Breadcrumb';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

/**
 * Accessibility Tests with jest-axe
 * Tests critical components for WCAG 2.1 AA compliance
 */

describe('Accessibility - Header', () => {
  it('should not have any automatically detectable accessibility issues', async () => {
    const { container } = render(
      <HelmetProvider>
        <BrowserRouter>
          <I18nProvider>
            <Header />
          </I18nProvider>
        </BrowserRouter>
      </HelmetProvider>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Accessibility - Footer', () => {
  it('should not have any automatically detectable accessibility issues', async () => {
    const { container } = render(
      <HelmetProvider>
        <BrowserRouter>
          <I18nProvider>
            <Footer />
          </I18nProvider>
        </BrowserRouter>
      </HelmetProvider>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Accessibility - Breadcrumb', () => {
  it('should not have any automatically detectable accessibility issues', async () => {
    const breadcrumbItems = [
      { name: 'Home', url: '/es' },
      { name: 'Clases', url: '/es/clases' },
      { name: 'Dancehall', url: '/es/clases/dancehall-barcelona', isActive: true },
    ];

    const { container } = render(
      <BrowserRouter>
        <Breadcrumb items={breadcrumbItems} />
      </BrowserRouter>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA attributes', () => {
    const breadcrumbItems = [
      { name: 'Home', url: '/es' },
      { name: 'Clases', url: '/es/clases', isActive: true },
    ];

    const { container } = render(
      <BrowserRouter>
        <Breadcrumb items={breadcrumbItems} />
      </BrowserRouter>
    );

    const nav = container.querySelector('nav');
    expect(nav).toHaveAttribute('aria-label', 'Breadcrumb');
  });
});
