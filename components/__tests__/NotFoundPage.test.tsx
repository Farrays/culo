import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import NotFoundPage from '../NotFoundPage';

describe('NotFoundPage', () => {
  it('should render 404 heading', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('should render title and subtitle', () => {
    render(<NotFoundPage />);
    // Look for translated content via role
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('should render back home link', () => {
    render(<NotFoundPage />);
    const homeLinks = screen.getAllByRole('link');
    // Should have at least 2 main CTA links (home and classes)
    expect(homeLinks.length).toBeGreaterThanOrEqual(2);
  });

  it('should have correct href for home link', () => {
    render(<NotFoundPage />);
    const links = screen.getAllByRole('link');
    // First link should point to home (locale path)
    const homeLink = links.find(link => link.getAttribute('href')?.match(/^\/[a-z]{2}$/));
    expect(homeLink).toBeInTheDocument();
  });

  it('should have correct href for classes link', () => {
    render(<NotFoundPage />);
    const links = screen.getAllByRole('link');
    const classesLink = links.find(link => link.getAttribute('href')?.includes('/clases'));
    expect(classesLink).toBeInTheDocument();
  });

  it('should render navigation links to popular pages', () => {
    render(<NotFoundPage />);
    const links = screen.getAllByRole('link');

    // Should have links to dancehall, salsa-bachata, and danzas-urbanas
    const dancehallLink = links.find(link => link.getAttribute('href')?.includes('dancehall'));
    const salsaLink = links.find(link => link.getAttribute('href')?.includes('salsa-bachata'));
    const urbanLink = links.find(link => link.getAttribute('href')?.includes('danzas-urbanas'));

    expect(dancehallLink).toBeInTheDocument();
    expect(salsaLink).toBeInTheDocument();
    expect(urbanLink).toBeInTheDocument();
  });

  it('should have accessible structure', () => {
    render(<NotFoundPage />);

    // Main container should exist
    const container = document.querySelector('.min-h-screen');
    expect(container).toBeInTheDocument();

    // Should have proper heading hierarchy
    const h1 = screen.getByRole('heading', { level: 1 });
    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h1).toBeInTheDocument();
    expect(h2).toBeInTheDocument();
  });
});
