import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProblemSolutionSection from '../ProblemSolutionSection';

// Mock useI18n
vi.mock('../../../hooks/useI18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        pas_title: '¿Te suena familiar?',
        pas_subtitle: 'No estás solo',
        pas_problem1: 'Problema 1',
        pas_problem2: 'Problema 2',
        pas_problem3: 'Problema 3',
        pas_problem4: 'Problema 4',
        pas_agitation1: 'Agitación 1',
        pas_agitation2: 'Agitación 2',
        pas_solution1: 'Hay una solución',
        pas_solution2: 'El Método Farray',
        pas_cta: 'Descubre cómo',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock AnimateOnScroll
vi.mock('../../AnimateOnScroll', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="animate-wrapper">{children}</div>
  ),
}));

describe('ProblemSolutionSection', () => {
  beforeEach(() => {
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('renders without crashing', () => {
    render(<ProblemSolutionSection />);
    expect(screen.getByText('¿Te suena familiar?')).toBeInTheDocument();
  });

  it('displays section title and subtitle', () => {
    render(<ProblemSolutionSection />);

    expect(screen.getByText('¿Te suena familiar?')).toBeInTheDocument();
    expect(screen.getByText('No estás solo')).toBeInTheDocument();
  });

  it('displays all four problems', () => {
    render(<ProblemSolutionSection />);

    expect(screen.getByText('Problema 1')).toBeInTheDocument();
    expect(screen.getByText('Problema 2')).toBeInTheDocument();
    expect(screen.getByText('Problema 3')).toBeInTheDocument();
    expect(screen.getByText('Problema 4')).toBeInTheDocument();
  });

  it('displays agitation text', () => {
    render(<ProblemSolutionSection />);

    expect(screen.getByText('Agitación 1')).toBeInTheDocument();
    expect(screen.getByText('Agitación 2')).toBeInTheDocument();
  });

  it('displays solution section', () => {
    render(<ProblemSolutionSection />);

    expect(screen.getByText('Hay una solución')).toBeInTheDocument();
    expect(screen.getByText('El Método Farray')).toBeInTheDocument();
  });

  it('displays CTA button', () => {
    render(<ProblemSolutionSection />);

    const ctaButton = screen.getByText('Descubre cómo');
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton.tagName.toLowerCase()).toBe('button');
  });

  it('scrolls to method section on CTA click', () => {
    // Setup mock element
    const mockElement = document.createElement('div');
    mockElement.id = 'method-section';
    document.body.appendChild(mockElement);

    render(<ProblemSolutionSection />);

    const ctaButton = screen.getByText('Descubre cómo');
    fireEvent.click(ctaButton);

    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

    // Cleanup
    document.body.removeChild(mockElement);
  });

  it('handles CTA click when method section does not exist', () => {
    render(<ProblemSolutionSection />);

    const ctaButton = screen.getByText('Descubre cómo');

    // Should not throw error
    expect(() => fireEvent.click(ctaButton)).not.toThrow();
  });

  it('renders problem cards with correct styling', () => {
    const { container } = render(<ProblemSolutionSection />);

    // Should have problem cards with red styling
    const problemCards = container.querySelectorAll('.bg-red-500\\/5');
    expect(problemCards.length).toBe(4);
  });

  it('renders X icons for problems', () => {
    const { container } = render(<ProblemSolutionSection />);

    // Should have red X icons
    const xIcons = container.querySelectorAll('.text-red-400');
    expect(xIcons.length).toBe(4);
  });

  it('has proper section structure', () => {
    const { container } = render(<ProblemSolutionSection />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('py-12', 'md:py-16', 'bg-black');
  });

  it('uses AnimateOnScroll wrapper for animations', () => {
    render(<ProblemSolutionSection />);

    // Multiple AnimateOnScroll wrappers should be present
    const animateWrappers = screen.getAllByTestId('animate-wrapper');
    expect(animateWrappers.length).toBeGreaterThan(0);
  });

  it('renders holographic text for title and solution', () => {
    const { container } = render(<ProblemSolutionSection />);

    const holographicElements = container.querySelectorAll('.holographic-text');
    expect(holographicElements.length).toBe(2); // Title and solution
  });

  it('renders solution card with backdrop blur', () => {
    const { container } = render(<ProblemSolutionSection />);

    const solutionCard = container.querySelector('.backdrop-blur-md');
    expect(solutionCard).toBeInTheDocument();
  });
});
