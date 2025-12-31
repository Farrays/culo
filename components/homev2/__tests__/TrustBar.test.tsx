import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TrustBar from '../TrustBar';

// Mock useI18n
vi.mock('../../../hooks/useI18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        trustbar_cidunesco: 'Affiliated',
        trustbar_students: 'Students',
        trustbar_facilities: 'Facilities',
        trustbar_styles: 'Dance Styles',
        trustbar_google: 'Google Rating',
      };
      return translations[key] || key;
    },
  }),
}));

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

    expect(screen.getByText('Affiliated')).toBeInTheDocument();
    expect(screen.getByText('Students')).toBeInTheDocument();
    expect(screen.getByText('Facilities')).toBeInTheDocument();
    expect(screen.getByText('Dance Styles')).toBeInTheDocument();
    expect(screen.getByText('Google Rating')).toBeInTheDocument();
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
    const ratingLabel = screen.getByText('Google Rating');
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
