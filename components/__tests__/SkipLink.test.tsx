import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SkipLink from '../SkipLink';
import { I18nProvider } from '../../hooks/useI18n';

describe('SkipLink', () => {
  it('should render skip to main content link', () => {
    render(
      <I18nProvider>
        <SkipLink />
      </I18nProvider>
    );

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '#main-content');
  });

  it('should be screen reader accessible', () => {
    render(
      <I18nProvider>
        <SkipLink />
      </I18nProvider>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveClass('sr-only');
  });

  it('should become visible on focus', () => {
    render(
      <I18nProvider>
        <SkipLink />
      </I18nProvider>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveClass('focus:not-sr-only');
  });
});
