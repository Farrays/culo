import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import DanceClassesPage from '../DanceClassesPage';

describe('DanceClassesPage', () => {
  it('should render page title', () => {
    render(<DanceClassesPage />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('should render breadcrumb navigation', () => {
    render(<DanceClassesPage />);
    const breadcrumb = screen.getByRole('navigation', { name: /breadcrumb/i });
    expect(breadcrumb).toBeInTheDocument();
  });

  it('should render all dance category cards', () => {
    render(<DanceClassesPage />);
    // Should have multiple category cards
    const cards = screen.getAllByRole('article');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should have accessible links to class pages', () => {
    render(<DanceClassesPage />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });
});
