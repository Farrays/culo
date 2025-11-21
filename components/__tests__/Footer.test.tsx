import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders footer element', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('contains contact information', () => {
    render(<Footer />);
    // Should have links (social media, etc.)
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('displays copyright or year', () => {
    const { container: _container } = render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    // More flexible: just check footer exists and has some content
    expect(footer).toBeInTheDocument();
    expect(footer.textContent).toBeTruthy();
    // Check for common copyright patterns
    const hasCopyright = footer.textContent?.match(/2024|2025|©|copyright/i);
    expect(hasCopyright).toBeTruthy();
  });
});
