import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SkipLink from '../SkipLink';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/i18n';
import type { ReactNode } from 'react';

// Wrapper component for tests
const I18nTestWrapper = ({ children }: { children: ReactNode }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
);

describe('SkipLink', () => {
  it('should render skip to main content link', () => {
    render(
      <I18nTestWrapper>
        <SkipLink />
      </I18nTestWrapper>
    );

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '#main-content');
  });

  it('should be screen reader accessible', () => {
    render(
      <I18nTestWrapper>
        <SkipLink />
      </I18nTestWrapper>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveClass('sr-only');
  });

  it('should become visible on focus', () => {
    render(
      <I18nTestWrapper>
        <SkipLink />
      </I18nTestWrapper>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveClass('focus:not-sr-only');
  });
});
