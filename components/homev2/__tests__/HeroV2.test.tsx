import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HeroV2 from '../HeroV2';

// Mock useI18n
vi.mock('../../../hooks/useI18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        hero_headline: 'Bailar es Vivir',
        hero_subheadline: 'La escuela de baile',
        hero_tagline: 'Donde el arte cobra vida',
        hero_value_proposition: 'Aprende a bailar con los mejores',
        hero_urgency: 'Primera clase gratis',
        hero_cta_reserve: 'Reserva tu clase',
        hero_cta_schedule: 'Ver horarios',
      };
      return translations[key] || key;
    },
    locale: 'es',
  }),
}));

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
  backgroundVideo: undefined,
  socialProof: {
    rating: '4.9',
    reviewCount: 200,
  },
  cta1: {
    textKey: 'hero_cta_reserve',
    href: '/reservar',
  },
  cta2: {
    textKey: 'hero_cta_schedule',
    href: '/horarios',
  },
};

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('HeroV2', () => {
  it('renders without crashing', () => {
    renderWithRouter(<HeroV2 config={mockConfig} />);
    expect(screen.getByText('Bailar es Vivir')).toBeInTheDocument();
  });

  it('displays headline and subheadline', () => {
    renderWithRouter(<HeroV2 config={mockConfig} />);

    expect(screen.getByText('Bailar es Vivir')).toBeInTheDocument();
    expect(screen.getByText('La escuela de baile')).toBeInTheDocument();
  });

  it('displays tagline and value proposition', () => {
    renderWithRouter(<HeroV2 config={mockConfig} />);

    expect(screen.getByText('Donde el arte cobra vida')).toBeInTheDocument();
    expect(screen.getByText('Aprende a bailar con los mejores')).toBeInTheDocument();
  });

  it('displays social proof rating', () => {
    renderWithRouter(<HeroV2 config={mockConfig} />);

    expect(screen.getByText('4.9')).toBeInTheDocument();
    expect(screen.getByText(/200\+ opiniones en Google/)).toBeInTheDocument();
  });

  it('displays urgency message', () => {
    renderWithRouter(<HeroV2 config={mockConfig} />);
    expect(screen.getByText('Primera clase gratis')).toBeInTheDocument();
  });

  it('opens modal on CTA click', () => {
    renderWithRouter(<HeroV2 config={mockConfig} />);

    const ctaButton = screen.getByText('Reserva tu clase');
    fireEvent.click(ctaButton);

    expect(screen.getByTestId('lead-modal')).toBeInTheDocument();
  });

  it('closes modal when close button clicked', () => {
    renderWithRouter(<HeroV2 config={mockConfig} />);

    // Open modal
    fireEvent.click(screen.getByText('Reserva tu clase'));
    expect(screen.getByTestId('lead-modal')).toBeInTheDocument();

    // Close modal
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByTestId('lead-modal')).not.toBeInTheDocument();
  });

  it('renders schedule link with correct href', () => {
    renderWithRouter(<HeroV2 config={mockConfig} />);

    const scheduleLink = screen.getByText('Ver horarios');
    expect(scheduleLink.closest('a')).toHaveAttribute(
      'href',
      '/es/horarios-clases-baile-barcelona'
    );
  });

  it('renders 5 star icons for social proof', () => {
    const { container } = renderWithRouter(<HeroV2 config={mockConfig} />);

    const starsContainer = container.querySelector('.text-yellow-400');
    expect(starsContainer).toBeInTheDocument();

    const stars = starsContainer?.querySelectorAll('svg');
    expect(stars?.length).toBe(5);
  });

  it('renders with image background by default', () => {
    const { container } = renderWithRouter(<HeroV2 config={mockConfig} />);

    const bgImage = container.querySelector('img[src="/hero-bg.jpg"]');
    expect(bgImage).toBeInTheDocument();
  });

  it('renders with video background when configured', () => {
    const videoConfig = {
      ...mockConfig,
      backgroundType: 'video' as const,
      backgroundVideo: '/hero-video.mp4',
    };

    const { container } = renderWithRouter(<HeroV2 config={videoConfig} />);

    const video = container.querySelector('video');
    expect(video).toBeInTheDocument();
    // Video source should be present
    const source = video?.querySelector('source');
    expect(source).toHaveAttribute('src', '/hero-video.mp4');
  });

  it('has proper h1 structure', () => {
    renderWithRouter(<HeroV2 config={mockConfig} />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Bailar es Vivir');
  });

  it('has accessible section label', () => {
    renderWithRouter(<HeroV2 config={mockConfig} />);

    const section = screen.getByRole('region', { name: /hero section/i });
    expect(section).toBeInTheDocument();
  });
});
