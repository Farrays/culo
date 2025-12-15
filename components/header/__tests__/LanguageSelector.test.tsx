import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSelector from '../LanguageSelector';
import type { Locale } from '../../../types';

// Mock icons
vi.mock('../../../lib/icons', () => ({
  GlobeIcon: ({ className }: { className?: string }) => (
    <svg data-testid="globe-icon" className={className} />
  ),
  ChevronDownIcon: ({ className }: { className?: string }) => (
    <svg data-testid="chevron-icon" className={className} />
  ),
}));

describe('LanguageSelector', () => {
  const languageNames: Record<Locale, string> = {
    es: 'Español',
    en: 'English',
    ca: 'Català',
    fr: 'Français',
  };

  const defaultProps = {
    locale: 'es' as Locale,
    isOpen: false,
    onToggle: vi.fn(),
    handleLanguageChange: vi.fn(),
    languageNames,
  };

  it('renders current locale', () => {
    render(<LanguageSelector {...defaultProps} />);
    expect(screen.getByText('ES')).toBeInTheDocument();
  });

  it('renders globe icon', () => {
    render(<LanguageSelector {...defaultProps} />);
    expect(screen.getByTestId('globe-icon')).toBeInTheDocument();
  });

  it('renders chevron icon', () => {
    render(<LanguageSelector {...defaultProps} />);
    expect(screen.getByTestId('chevron-icon')).toBeInTheDocument();
  });

  it('has correct aria-expanded when closed', () => {
    render(<LanguageSelector {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('has correct aria-expanded when open', () => {
    render(<LanguageSelector {...defaultProps} isOpen={true} />);
    // When dropdown is open, there are multiple buttons - get the main one (first with aria-expanded)
    const buttons = screen.getAllByRole('button');
    const mainButton = buttons[0];
    expect(mainButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('calls onToggle when button is clicked', () => {
    const onToggle = vi.fn();
    render(<LanguageSelector {...defaultProps} onToggle={onToggle} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(onToggle).toHaveBeenCalled();
  });

  it('shows dropdown when open', () => {
    render(<LanguageSelector {...defaultProps} isOpen={true} />);

    expect(screen.getByText('Español')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Català')).toBeInTheDocument();
    expect(screen.getByText('Français')).toBeInTheDocument();
  });

  it('does not show dropdown when closed', () => {
    render(<LanguageSelector {...defaultProps} isOpen={false} />);

    expect(screen.queryByText('Español')).not.toBeInTheDocument();
    expect(screen.queryByText('English')).not.toBeInTheDocument();
  });

  it('calls handleLanguageChange when language is selected', () => {
    const handleLanguageChange = vi.fn();
    render(
      <LanguageSelector
        {...defaultProps}
        isOpen={true}
        handleLanguageChange={handleLanguageChange}
      />
    );

    fireEvent.click(screen.getByText('English'));
    expect(handleLanguageChange).toHaveBeenCalledWith('en');
  });

  it('highlights current language in dropdown', () => {
    render(<LanguageSelector {...defaultProps} isOpen={true} />);

    // Find the Spanish button (current locale)
    const spanishButton = screen.getByText('Español').closest('button');
    expect(spanishButton).toHaveClass('bg-primary-accent');
  });

  it('responds to Enter key press', () => {
    const onToggle = vi.fn();
    render(<LanguageSelector {...defaultProps} onToggle={onToggle} />);

    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter' });

    expect(onToggle).toHaveBeenCalled();
  });

  it('responds to Space key press', () => {
    const onToggle = vi.fn();
    render(<LanguageSelector {...defaultProps} onToggle={onToggle} />);

    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: ' ' });

    expect(onToggle).toHaveBeenCalled();
  });

  it('displays all 4 language options in dropdown', () => {
    render(<LanguageSelector {...defaultProps} isOpen={true} />);

    const buttons = screen.getAllByRole('button');
    // Main button + 4 language buttons
    expect(buttons.length).toBe(5);
  });
});
