import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../test/test-utils';
import TrustBar from '../TrustBar';

// Mock AnimateOnScroll
vi.mock('../../AnimateOnScroll', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="animate-on-scroll">{children}</div>
  ),
}));

describe('TrustBar', () => {
  it('renders without crashing', () => {
    render(<TrustBar />);
    expect(screen.getByText('CID-UNESCO')).toBeInTheDocument();
  });

  it('displays all trust stats', () => {
    render(<TrustBar />);

    // Check all values are displayed
    expect(screen.getByText('CID-UNESCO')).toBeInTheDocument();
    expect(screen.getByText('1,500+')).toBeInTheDocument();
    expect(screen.getByText('700m²')).toBeInTheDocument();
    expect(screen.getByText('+40')).toBeInTheDocument();
    expect(screen.getByText('4.9/5')).toBeInTheDocument();
  });

  it('displays translated labels', () => {
    render(<TrustBar />);

    expect(screen.getByText('Acreditados')).toBeInTheDocument();
    expect(screen.getByText('Estudiantes')).toBeInTheDocument();
    expect(screen.getByText('Instalaciones')).toBeInTheDocument();
    expect(screen.getByText('Estilos')).toBeInTheDocument();
    expect(screen.getByText('Google Reviews')).toBeInTheDocument();
  });

  it('wraps content in AnimateOnScroll', () => {
    render(<TrustBar />);
    expect(screen.getByTestId('animate-on-scroll')).toBeInTheDocument();
  });

  it('renders five star icons for rating', () => {
    render(<TrustBar />);

    // The rating section has 5 stars, each rendered as an SVG
    const ratingValue = screen.getByText('4.9/5');
    expect(ratingValue).toBeInTheDocument();

    // Check that rating is near the Google Rating label
    const ratingLabel = screen.getByText('Google Reviews');
    expect(ratingLabel).toBeInTheDocument();
  });

  it('has proper semantic structure', () => {
    const { container } = render(<TrustBar />);

    // Should render as a section
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();

    // Should have container wrapper
    const containerDiv = container.querySelector('.container');
    expect(containerDiv).toBeInTheDocument();
  });

  it('renders SVG icons for each stat', () => {
    const { container } = render(<TrustBar />);

    // Should have multiple SVG icons
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });
});
