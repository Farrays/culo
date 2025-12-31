import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FinalCTAV2 from '../FinalCTAV2';

// Mock useI18n
vi.mock('../../../hooks/useI18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        finalcta_title1: 'Tu momento es ahora',
        finalcta_subtitle1: 'No esperes más',
        finalcta_subtitle2: 'Únete a la comunidad',
        finalcta_subtitle3: 'Transforma tu vida',
        finalcta_cta1: 'Reservar ahora',
        finalcta_cta2: 'Ver horarios',
        finalcta_trust: 'Más de 1500 alumnos satisfechos',
      };
      return translations[key] || key;
    },
    locale: 'es',
  }),
}));

// Mock AnimateOnScroll
vi.mock('../../AnimateOnScroll', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="animate-wrapper">{children}</div>
  ),
}));

const mockConfig = {
  titleLine1Key: 'finalcta_title1',
  titleLine2Key: 'finalcta_title2',
  subtitleLine1Key: 'finalcta_subtitle1',
  subtitleLine2Key: 'finalcta_subtitle2',
  subtitleLine3Key: 'finalcta_subtitle3',
  cta1TextKey: 'finalcta_cta1',
  cta1Href: '/reservar',
  cta2TextKey: 'finalcta_cta2',
  cta2Href: '/horarios',
  trustLineKey: 'finalcta_trust',
};

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('FinalCTAV2', () => {
  it('renders without crashing', () => {
    renderWithRouter(<FinalCTAV2 config={mockConfig} />);
    expect(screen.getByText('Tu momento es ahora')).toBeInTheDocument();
  });

  it('displays main title', () => {
    renderWithRouter(<FinalCTAV2 config={mockConfig} />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Tu momento es ahora');
  });

  it('displays all subtitle lines', () => {
    renderWithRouter(<FinalCTAV2 config={mockConfig} />);

    expect(screen.getByText('No esperes más')).toBeInTheDocument();
    expect(screen.getByText('Únete a la comunidad')).toBeInTheDocument();
    expect(screen.getByText('Transforma tu vida')).toBeInTheDocument();
  });

  it('displays both CTAs', () => {
    renderWithRouter(<FinalCTAV2 config={mockConfig} />);

    expect(screen.getByText('Reservar ahora')).toBeInTheDocument();
    expect(screen.getByText('Ver horarios')).toBeInTheDocument();
  });

  it('renders primary CTA link with correct href', () => {
    renderWithRouter(<FinalCTAV2 config={mockConfig} />);

    const primaryLink = screen.getByText('Reservar ahora').closest('a');
    expect(primaryLink).toHaveAttribute('href', '/es/reservar');
  });

  it('renders secondary CTA link with correct href', () => {
    renderWithRouter(<FinalCTAV2 config={mockConfig} />);

    const secondaryLink = screen.getByText('Ver horarios').closest('a');
    expect(secondaryLink).toHaveAttribute('href', '/es/horarios');
  });

  it('displays trust line', () => {
    renderWithRouter(<FinalCTAV2 config={mockConfig} />);

    expect(screen.getByText('Más de 1500 alumnos satisfechos')).toBeInTheDocument();
  });

  it('uses AnimateOnScroll wrappers', () => {
    renderWithRouter(<FinalCTAV2 config={mockConfig} />);

    const animateWrappers = screen.getAllByTestId('animate-wrapper');
    expect(animateWrappers.length).toBeGreaterThan(0);
  });

  it('has section with id for anchor linking', () => {
    const { container } = renderWithRouter(<FinalCTAV2 config={mockConfig} />);

    const section = container.querySelector('#final-cta');
    expect(section).toBeInTheDocument();
  });

  it('applies holographic text styling to title', () => {
    const { container } = renderWithRouter(<FinalCTAV2 config={mockConfig} />);

    const holographicElements = container.querySelectorAll('.holographic-text');
    expect(holographicElements.length).toBeGreaterThan(0);
  });

  it('renders arrow icon in primary CTA', () => {
    const { container } = renderWithRouter(<FinalCTAV2 config={mockConfig} />);

    const arrowSvg = container.querySelector('svg');
    expect(arrowSvg).toBeInTheDocument();
  });

  it('has proper section structure', () => {
    const { container } = renderWithRouter(<FinalCTAV2 config={mockConfig} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('relative', 'py-12', 'md:py-16', 'overflow-hidden');
  });
});
