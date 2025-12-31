import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MethodSection from '../MethodSection';

// Mock useI18n
vi.mock('../../../hooks/useI18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        method_problem_title: '¿Por qué la mayoría no progresa?',
        method_problem_text: 'Texto del problema',
        method_solution_title: 'Los 3 Pilares del Método Farray',
        method_pillar1_title: 'Disciplina',
        method_pillar1_desc: 'Descripción disciplina',
        method_pillar2_title: 'Ritmo',
        method_pillar2_desc: 'Descripción ritmo',
        method_pillar3_title: 'Innovación',
        method_pillar3_desc: 'Descripción innovación',
        method_result_promise: 'Resultado garantizado',
        method_cta: 'Conoce el método',
      };
      return translations[key] || key;
    },
    locale: 'es',
  }),
}));

// Mock AnimateOnScroll
vi.mock('../../AnimateOnScroll', () => ({
  default: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="animate-wrapper" className={className}>
      {children}
    </div>
  ),
}));

const mockConfig = {
  problemTitleKey: 'method_problem_title',
  problemTextKey: 'method_problem_text',
  solutionTitleKey: 'method_solution_title',
  pillars: [
    { iconKey: 'discipline', titleKey: 'method_pillar1_title', descKey: 'method_pillar1_desc' },
    { iconKey: 'rhythm', titleKey: 'method_pillar2_title', descKey: 'method_pillar2_desc' },
    { iconKey: 'innovation', titleKey: 'method_pillar3_title', descKey: 'method_pillar3_desc' },
  ],
  resultPromiseKey: 'method_result_promise',
  ctaTextKey: 'method_cta',
};

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('MethodSection', () => {
  it('renders without crashing', () => {
    renderWithRouter(<MethodSection config={mockConfig} />);
    expect(screen.getByText('¿Por qué la mayoría no progresa?')).toBeInTheDocument();
  });

  it('displays problem title and text', () => {
    renderWithRouter(<MethodSection config={mockConfig} />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      '¿Por qué la mayoría no progresa?'
    );
    expect(screen.getByText('Texto del problema')).toBeInTheDocument();
  });

  it('displays solution title', () => {
    renderWithRouter(<MethodSection config={mockConfig} />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Los 3 Pilares del Método Farray'
    );
  });

  it('displays all three pillars', () => {
    renderWithRouter(<MethodSection config={mockConfig} />);

    expect(screen.getByText('Disciplina')).toBeInTheDocument();
    expect(screen.getByText('Ritmo')).toBeInTheDocument();
    expect(screen.getByText('Innovación')).toBeInTheDocument();

    expect(screen.getByText('Descripción disciplina')).toBeInTheDocument();
    expect(screen.getByText('Descripción ritmo')).toBeInTheDocument();
    expect(screen.getByText('Descripción innovación')).toBeInTheDocument();
  });

  it('displays result promise', () => {
    renderWithRouter(<MethodSection config={mockConfig} />);
    expect(screen.getByText('Resultado garantizado')).toBeInTheDocument();
  });

  it('displays CTA link with correct href', () => {
    renderWithRouter(<MethodSection config={mockConfig} />);

    const ctaLink = screen.getByText('Conoce el método');
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink.closest('a')).toHaveAttribute('href', '/es/metodo-farray');
  });

  it('renders SVG icons for each pillar', () => {
    const { container } = renderWithRouter(<MethodSection config={mockConfig} />);

    // Each pillar should have an SVG icon
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThanOrEqual(3);
  });

  it('has correct section id for scroll targeting', () => {
    const { container } = renderWithRouter(<MethodSection config={mockConfig} />);

    const section = container.querySelector('#method-section');
    expect(section).toBeInTheDocument();
  });

  it('uses AnimateOnScroll for animations', () => {
    renderWithRouter(<MethodSection config={mockConfig} />);

    const animateWrappers = screen.getAllByTestId('animate-wrapper');
    expect(animateWrappers.length).toBeGreaterThan(0);
  });

  it('renders pillar cards with correct structure', () => {
    const { container } = renderWithRouter(<MethodSection config={mockConfig} />);

    // Check for pillar card styling
    const pillarCards = container.querySelectorAll('.backdrop-blur-md');
    expect(pillarCards.length).toBe(3);
  });

  it('applies holographic text styling to titles', () => {
    const { container } = renderWithRouter(<MethodSection config={mockConfig} />);

    const holographicElements = container.querySelectorAll('.holographic-text');
    expect(holographicElements.length).toBeGreaterThan(0);
  });

  it('has proper section styling', () => {
    const { container } = renderWithRouter(<MethodSection config={mockConfig} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('py-12', 'md:py-16', 'bg-black');
  });

  it('renders arrow in CTA link', () => {
    renderWithRouter(<MethodSection config={mockConfig} />);

    expect(screen.getByText('→')).toBeInTheDocument();
  });

  it('handles unknown pillar icon gracefully (fallback to discipline)', () => {
    const configWithUnknownIcon = {
      ...mockConfig,
      pillars: [
        {
          iconKey: 'unknown_icon',
          titleKey: 'method_pillar1_title',
          descKey: 'method_pillar1_desc',
        },
      ],
    };

    // Should not throw
    expect(() => renderWithRouter(<MethodSection config={configWithUnknownIcon} />)).not.toThrow();
  });
});
