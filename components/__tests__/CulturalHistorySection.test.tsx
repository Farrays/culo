import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CulturalHistorySection from '../CulturalHistorySection';

// Mock AnimateOnScroll
vi.mock('../AnimateOnScroll', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock ChevronDownIcon
vi.mock('../../lib/icons', () => ({
  ChevronDownIcon: ({ className }: { className?: string }) => (
    <svg data-testid="chevron-icon" className={className} />
  ),
}));

describe('CulturalHistorySection', () => {
  const mockT = (key: string) => {
    const translations: Record<string, string> = {
      culturalTitle: 'Historia del Dancehall',
      shortDesc: 'El Dancehall es un género de música y baile originario de Jamaica.',
      fullHistory:
        '### Orígenes\nEl Dancehall nació en Kingston, Jamaica, a finales de los años 70.\n### Evolución\nEvolucionó del reggae con ritmos más rápidos.',
    };
    return translations[key] || key;
  };

  const defaultProps = {
    titleKey: 'culturalTitle',
    shortDescKey: 'shortDesc',
    fullHistoryKey: 'fullHistory',
    readMoreText: 'Leer más',
    readLessText: 'Leer menos',
    t: mockT,
  };

  it('renders section title', () => {
    render(<CulturalHistorySection {...defaultProps} />);

    expect(screen.getByText('Historia del Dancehall')).toBeInTheDocument();
  });

  it('renders short description', () => {
    render(<CulturalHistorySection {...defaultProps} />);

    expect(
      screen.getByText('El Dancehall es un género de música y baile originario de Jamaica.')
    ).toBeInTheDocument();
  });

  it('shows read more button', () => {
    render(<CulturalHistorySection {...defaultProps} />);

    expect(screen.getByText('Leer más')).toBeInTheDocument();
  });

  it('expands to show full history when clicking read more', () => {
    render(<CulturalHistorySection {...defaultProps} />);

    const readMoreButton = screen.getByText('Leer más');
    fireEvent.click(readMoreButton);

    expect(screen.getByText('Orígenes')).toBeInTheDocument();
    expect(screen.getByText('Leer menos')).toBeInTheDocument();
  });

  it('collapses when clicking read less', () => {
    render(<CulturalHistorySection {...defaultProps} />);

    // Expand first
    fireEvent.click(screen.getByText('Leer más'));
    expect(screen.getByText('Leer menos')).toBeInTheDocument();

    // Collapse
    fireEvent.click(screen.getByText('Leer menos'));
    expect(screen.getByText('Leer más')).toBeInTheDocument();
  });

  it('renders section with proper structure', () => {
    const { container } = render(<CulturalHistorySection {...defaultProps} />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('has correct section id', () => {
    const { container } = render(<CulturalHistorySection {...defaultProps} />);

    const section = container.querySelector('#cultural-history');
    expect(section).toBeInTheDocument();
  });

  it('button has correct aria attributes', () => {
    render(<CulturalHistorySection {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls', 'cultural-history-content');
  });

  it('updates aria-expanded when toggled', () => {
    render(<CulturalHistorySection {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });
});
