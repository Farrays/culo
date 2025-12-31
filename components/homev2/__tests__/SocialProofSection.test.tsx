import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SocialProofSection from '../SocialProofSection';

// Mock useI18n
vi.mock('../../../hooks/useI18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        social_proof_title: 'Por qué confiar en nosotros',
        social_students: 'Estudiantes',
        social_years: 'Años',
        social_styles: 'Estilos',
        social_sqm: 'Metros cuadrados',
        social_reviews_link: 'reseñas en Google',
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

const mockConfig = {
  titleKey: 'social_proof_title',
  stats: [
    { value: '1500+', labelKey: 'social_students' },
    { value: '35', labelKey: 'social_years' },
    { value: '40+', labelKey: 'social_styles' },
    { value: '700', labelKey: 'social_sqm' },
  ],
  googleReviews: {
    rating: '4.9',
    count: '200+',
    linkKey: 'social_reviews_link',
  },
  logos: [
    { name: 'Got Talent', src: '/logos/got-talent.png' },
    { name: 'TV3', src: '/logos/tv3.png' },
  ],
};

describe('SocialProofSection', () => {
  it('renders without crashing', () => {
    render(<SocialProofSection config={mockConfig} />);
    expect(screen.getByText('Por qué confiar en nosotros')).toBeInTheDocument();
  });

  it('displays section title', () => {
    render(<SocialProofSection config={mockConfig} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Por qué confiar en nosotros'
    );
  });

  it('displays all stats with values and labels', () => {
    render(<SocialProofSection config={mockConfig} />);

    expect(screen.getByText('1500+')).toBeInTheDocument();
    expect(screen.getByText('Estudiantes')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
    expect(screen.getByText('Años')).toBeInTheDocument();
    expect(screen.getByText('40+')).toBeInTheDocument();
    expect(screen.getByText('Estilos')).toBeInTheDocument();
    expect(screen.getByText('700')).toBeInTheDocument();
    expect(screen.getByText('Metros cuadrados')).toBeInTheDocument();
  });

  it('renders Google Reviews badge with correct rating', () => {
    render(<SocialProofSection config={mockConfig} />);

    expect(screen.getByText('4.9')).toBeInTheDocument();
    expect(screen.getByText('200+')).toBeInTheDocument();
    expect(screen.getByText('reseñas en Google')).toBeInTheDocument();
  });

  it('renders Google Reviews link with correct href', () => {
    render(<SocialProofSection config={mockConfig} />);

    const googleLink = screen.getByRole('link');
    expect(googleLink).toHaveAttribute('href', 'https://g.page/r/CWgdDe92LVnmEBM/review');
    expect(googleLink).toHaveAttribute('target', '_blank');
    expect(googleLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders 5 star icons', () => {
    const { container } = render(<SocialProofSection config={mockConfig} />);

    const starsContainer = container.querySelector('.text-yellow-400');
    expect(starsContainer).toBeInTheDocument();

    const stars = starsContainer?.querySelectorAll('svg');
    expect(stars?.length).toBe(5);
  });

  it('renders logo images', () => {
    render(<SocialProofSection config={mockConfig} />);

    const gotTalentImg = screen.getByAltText('Got Talent');
    const tv3Img = screen.getByAltText('TV3');

    expect(gotTalentImg).toBeInTheDocument();
    expect(tv3Img).toBeInTheDocument();
  });

  it('displays "Apariciones en" text', () => {
    render(<SocialProofSection config={mockConfig} />);
    expect(screen.getByText('Apariciones en')).toBeInTheDocument();
  });

  it('handles image error by showing fallback text', () => {
    render(<SocialProofSection config={mockConfig} />);

    const logoImg = screen.getByAltText('Got Talent');

    // Simulate image error
    fireEvent.error(logoImg);

    // Image should be hidden
    expect(logoImg).toHaveStyle('display: none');
  });

  it('applies grayscale effect to logos', () => {
    const { container } = render(<SocialProofSection config={mockConfig} />);

    const logoContainers = container.querySelectorAll('.grayscale');
    expect(logoContainers.length).toBe(2);
  });

  it('uses AnimateOnScroll wrappers for animations', () => {
    render(<SocialProofSection config={mockConfig} />);

    const animateWrappers = screen.getAllByTestId('animate-wrapper');
    expect(animateWrappers.length).toBeGreaterThan(0);
  });

  it('renders Google logo SVG', () => {
    const { container } = render(<SocialProofSection config={mockConfig} />);

    // Check for Google blue color in SVG
    const googleBlue = container.querySelector('[fill="#4285F4"]');
    expect(googleBlue).toBeInTheDocument();
  });

  it('has proper section structure', () => {
    const { container } = render(<SocialProofSection config={mockConfig} />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('py-12', 'md:py-16', 'bg-black');
  });
});
