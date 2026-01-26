import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../../test/test-utils';
import ProblemSolutionSection from '../ProblemSolutionSection';

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
    expect(screen.getByText('¿Te Suena Familiar?')).toBeInTheDocument();
  });

  it('displays section title and subtitle', () => {
    render(<ProblemSolutionSection />);

    expect(screen.getByText('¿Te Suena Familiar?')).toBeInTheDocument();
    expect(
      screen.getByText('Si alguna de estas frases resuena contigo, no estás solo.')
    ).toBeInTheDocument();
  });

  it('displays all four problems', () => {
    render(<ProblemSolutionSection />);

    expect(screen.getByText(/Llevas años queriendo aprender a bailar/)).toBeInTheDocument();
    expect(screen.getByText(/Probaste otras escuelas y te sentiste/)).toBeInTheDocument();
    expect(screen.getByText(/Los horarios nunca cuadran/)).toBeInTheDocument();
    expect(screen.getByText(/Sientes que "no tienes ritmo"/)).toBeInTheDocument();
  });

  it('displays agitation text', () => {
    render(<ProblemSolutionSection />);

    expect(screen.getByText(/Cada día que pasa es un día menos/)).toBeInTheDocument();
    expect(screen.getByText(/Y la verdad es que el problema nunca fuiste tú/)).toBeInTheDocument();
  });

  it('displays solution section', () => {
    render(<ProblemSolutionSection />);

    expect(screen.getByText(/El problema era no encontrar EL MÉTODO correcto/)).toBeInTheDocument();
    expect(screen.getByText(/En Farray's, hemos creado algo diferente/)).toBeInTheDocument();
  });

  it('displays CTA button', () => {
    render(<ProblemSolutionSection />);

    const ctaButton = screen.getByText('Descubre el Método Farray®');
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton.tagName.toLowerCase()).toBe('button');
  });

  it('scrolls to method section on CTA click', () => {
    // Setup mock element
    const mockElement = document.createElement('div');
    mockElement.id = 'method-section';
    document.body.appendChild(mockElement);

    render(<ProblemSolutionSection />);

    const ctaButton = screen.getByText('Descubre el Método Farray®');
    fireEvent.click(ctaButton);

    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

    // Cleanup
    document.body.removeChild(mockElement);
  });

  it('handles CTA click when method section does not exist', () => {
    render(<ProblemSolutionSection />);

    const ctaButton = screen.getByText('Descubre el Método Farray®');

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
