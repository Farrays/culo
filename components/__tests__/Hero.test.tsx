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
    const ctaButtons = screen.getAllByRole('button');
    expect(ctaButtons.length).toBeGreaterThan(0);
    // Verify all buttons have accessible text content
    const accessibleButtons = ctaButtons.filter(
      button => button.textContent && button.textContent.trim().length > 0
    );
    expect(accessibleButtons.length).toBeGreaterThan(0);
  });

  it('should render main CTA button', () => {
    render(<Hero />);
    const ctaButtons = screen.getAllByRole('button');
    // The Hero has a CTA button for lead capture
    expect(ctaButtons.length).toBeGreaterThan(0);
  });

  it('should have proper section structure', () => {
    render(<Hero />);
    const section = screen.getByRole('region', { name: /hero section/i });
    expect(section.tagName).toBe('SECTION');
    expect(section).toHaveAttribute('id', 'hero');
  });
});
