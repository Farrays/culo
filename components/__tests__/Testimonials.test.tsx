import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import Testimonials from '../Testimonials';

describe('Testimonials', () => {
  it('should render testimonials section with aria-labelledby', () => {
    render(<Testimonials />);
    const section = document.querySelector('section#testimonials');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('aria-labelledby', 'testimonials-heading');
  });

  it('should render testimonials heading with correct id', () => {
    render(<Testimonials />);
    const heading = document.querySelector('#testimonials-heading');
    expect(heading).toBeInTheDocument();
    expect(heading?.tagName).toBe('H2');
  });

  it('should render Google Reviews badge link', () => {
    render(<Testimonials />);
    const googleLink = screen.getByRole('link', { name: /ver reseñas en google/i });
    expect(googleLink).toHaveAttribute('href', 'https://g.page/r/CWBvYu8J9aJAEBM/review');
    expect(googleLink).toHaveAttribute('target', '_blank');
    expect(googleLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should render multiple testimonial cards', () => {
    render(<Testimonials />);
    const blockquotes = screen.getAllByRole('blockquote');
    expect(blockquotes.length).toBeGreaterThan(0);
  });

  it('should render star ratings with aria-labels', () => {
    render(<Testimonials />);
    const ratings = screen.getAllByRole('img');
    const starRatings = ratings.filter(rating =>
      rating.getAttribute('aria-label')?.includes('estrellas')
    );
    expect(starRatings.length).toBeGreaterThan(0);
  });

  it('should render testimonial author images with alt text', () => {
    render(<Testimonials />);
    const images = screen.getAllByRole('img');
    const authorImages = images.filter(img => img.getAttribute('alt')?.includes('Foto de perfil'));
    expect(authorImages.length).toBeGreaterThan(0);
  });
});
