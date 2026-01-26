import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../test/test-utils';
import FinalCTAV2 from '../FinalCTAV2';

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

describe('FinalCTAV2', () => {
  it('renders without crashing', () => {
    render(<FinalCTAV2 config={mockConfig} />);
    expect(screen.getByText('finalcta_title1')).toBeInTheDocument();
  });

  it('displays main title', () => {
    render(<FinalCTAV2 config={mockConfig} />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('finalcta_title1');
  });

  it('displays all subtitle lines', () => {
    render(<FinalCTAV2 config={mockConfig} />);

    expect(screen.getByText('finalcta_subtitle1')).toBeInTheDocument();
    expect(screen.getByText('finalcta_subtitle2')).toBeInTheDocument();
    expect(screen.getByText('finalcta_subtitle3')).toBeInTheDocument();
  });

  it('displays both CTAs', () => {
    render(<FinalCTAV2 config={mockConfig} />);

    expect(screen.getByText('finalcta_cta1')).toBeInTheDocument();
    expect(screen.getByText('finalcta_cta2')).toBeInTheDocument();
  });

  it('renders primary CTA link with correct href', () => {
    render(<FinalCTAV2 config={mockConfig} />);

    const primaryLink = screen.getByText('finalcta_cta1').closest('a');
    expect(primaryLink).toHaveAttribute('href', '/es/reservar');
  });

  it('renders secondary CTA link with correct href', () => {
    render(<FinalCTAV2 config={mockConfig} />);

    const secondaryLink = screen.getByText('finalcta_cta2').closest('a');
    expect(secondaryLink).toHaveAttribute('href', '/es/horarios');
  });

  it('displays trust line', () => {
    render(<FinalCTAV2 config={mockConfig} />);

    expect(screen.getByText('finalcta_trust')).toBeInTheDocument();
  });

  it('uses AnimateOnScroll wrappers', () => {
    render(<FinalCTAV2 config={mockConfig} />);

    const animateWrappers = screen.getAllByTestId('animate-wrapper');
    expect(animateWrappers.length).toBeGreaterThan(0);
  });

  it('has section with id for anchor linking', () => {
    const { container } = render(<FinalCTAV2 config={mockConfig} />);

    const section = container.querySelector('#final-cta');
    expect(section).toBeInTheDocument();
  });

  it('applies holographic text styling to title', () => {
    const { container } = render(<FinalCTAV2 config={mockConfig} />);

    const holographicElements = container.querySelectorAll('.holographic-text');
    expect(holographicElements.length).toBeGreaterThan(0);
  });

  it('renders arrow icon in primary CTA', () => {
    const { container } = render(<FinalCTAV2 config={mockConfig} />);

    const arrowSvg = container.querySelector('svg');
    expect(arrowSvg).toBeInTheDocument();
  });

  it('has proper section structure', () => {
    const { container } = render(<FinalCTAV2 config={mockConfig} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('relative', 'py-12', 'md:py-16', 'overflow-hidden');
  });
});
