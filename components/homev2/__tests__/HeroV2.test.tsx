import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test/test-utils';
import HeroV2 from '../HeroV2';

// Mock LeadCaptureModal
vi.mock('../../shared/LeadCaptureModal', () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="lead-modal">
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

const mockConfig = {
  headlineKey: 'hero_headline',
  subheadlineKey: 'hero_subheadline',
  taglineKey: 'hero_tagline',
  valuePropositionKey: 'hero_value_proposition',
  backgroundType: 'image' as const,
  backgroundImage: '/hero-bg.jpg',
  backgroundVideo: null as string | null,
  socialProof: {
    rating: '4.9',
    reviewCount: '200+',
    studentsActive: '1500+',
    badge: 'CID-UNESCO',
  },
  cta1: {
    textKey: 'hero_cta_reserve',
    subtextKey: 'hero_urgency',
    href: '/reservar',
  },
  cta2: {
    textKey: 'hero_cta_schedule',
    scrollTo: '#horarios',
  },
};

describe('HeroV2', () => {
  it('renders without crashing', () => {
    render(<HeroV2 config={mockConfig} />);
    expect(screen.getByText('Bailar es Vivir')).toBeInTheDocument();
  });

  it('displays headline and subheadline', () => {
    render(<HeroV2 config={mockConfig} />);

    expect(screen.getByText('Bailar es Vivir')).toBeInTheDocument();
    expect(screen.getByText('La escuela de baile')).toBeInTheDocument();
  });

  it('displays tagline and value proposition', () => {
    render(<HeroV2 config={mockConfig} />);

    expect(screen.getByText('Donde el arte cobra vida')).toBeInTheDocument();
    expect(screen.getByText('Aprende a bailar con los mejores')).toBeInTheDocument();
  });

  it('displays social proof rating', () => {
    render(<HeroV2 config={mockConfig} />);

    expect(screen.getByText('4.9')).toBeInTheDocument();
    // Component renders: reviewCount + "+ opiniones en Google"
    expect(screen.getByText(/200\+\+ opiniones en Google/)).toBeInTheDocument();
  });

  it('displays urgency message', () => {
    render(<HeroV2 config={mockConfig} />);
    expect(
      screen.getByText('Oferta Enero: Clase de bienvenida + Regalo sorpresa')
    ).toBeInTheDocument();
  });

  it('opens modal on CTA click', () => {
    render(<HeroV2 config={mockConfig} />);

    const ctaButton = screen.getByText('Reserva tu clase');
    fireEvent.click(ctaButton);

    expect(screen.getByTestId('lead-modal')).toBeInTheDocument();
  });

  it('closes modal when close button clicked', () => {
    render(<HeroV2 config={mockConfig} />);

    // Open modal
    fireEvent.click(screen.getByText('Reserva tu clase'));
    expect(screen.getByTestId('lead-modal')).toBeInTheDocument();

    // Close modal
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByTestId('lead-modal')).not.toBeInTheDocument();
  });

  it('renders schedule link with correct href', () => {
    render(<HeroV2 config={mockConfig} />);

    const scheduleLink = screen.getByText('Ver Horarios');
    expect(scheduleLink.closest('a')).toHaveAttribute(
      'href',
      '/es/horarios-clases-baile-barcelona'
    );
  });

  it('renders 5 star icons for social proof', () => {
    const { container } = render(<HeroV2 config={mockConfig} />);

    const starsContainer = container.querySelector('.text-yellow-400');
    expect(starsContainer).toBeInTheDocument();

    const stars = starsContainer?.querySelectorAll('svg');
    expect(stars?.length).toBe(5);
  });

  it('renders with image background by default', () => {
    const { container } = render(<HeroV2 config={mockConfig} />);

    const bgImage = container.querySelector('img[src="/hero-bg.jpg"]');
    expect(bgImage).toBeInTheDocument();
  });

  it('renders with video background when configured', () => {
    const videoConfig = {
      ...mockConfig,
      backgroundType: 'video' as const,
      backgroundVideo: '/hero-video.mp4',
    };

    const { container } = render(<HeroV2 config={videoConfig} />);

    const video = container.querySelector('video');
    expect(video).toBeInTheDocument();
    // Video source should be present
    const source = video?.querySelector('source');
    expect(source).toHaveAttribute('src', '/hero-video.mp4');
  });

  it('has proper h1 structure', () => {
    render(<HeroV2 config={mockConfig} />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Bailar es Vivir');
  });

  it('has accessible section label', () => {
    render(<HeroV2 config={mockConfig} />);

    const section = screen.getByRole('region', { name: /hero section/i });
    expect(section).toBeInTheDocument();
  });
});
