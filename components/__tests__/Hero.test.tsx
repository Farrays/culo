import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import Hero from '../Hero';

describe('Hero', () => {
  it('should render hero section with aria-label', () => {
    render(<Hero />);
    const hero = screen.getByLabelText(/hero section/i);
    expect(hero).toBeInTheDocument();
  });

  it('should render main heading', () => {
    render(<Hero />);
    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings.length).toBeGreaterThan(0);
  });

  it('should render CTA button with accessible name', () => {
    render(<Hero />);
    const ctaLinks = screen.getAllByRole('link');
    expect(ctaLinks.length).toBeGreaterThan(0);
    // Verify at least one link has aria-label
    const accessibleLinks = ctaLinks.filter(link => link.hasAttribute('aria-label'));
    expect(accessibleLinks.length).toBeGreaterThan(0);
  });

  it('should render scroll indicator', () => {
    render(<Hero />);
    const scrollLinks = screen.getAllByRole('link');
    const scrollToClasses = scrollLinks.filter(link => link.getAttribute('href') === '#classes');
    expect(scrollToClasses.length).toBeGreaterThan(0);
  });

  it('should have proper section structure', () => {
    render(<Hero />);
    const section = screen.getByRole('region', { name: /hero section/i });
    expect(section.tagName).toBe('SECTION');
    expect(section).toHaveAttribute('id', 'hero');
  });
});
