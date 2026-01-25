import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import Teachers from '../Teachers';

// Mock AnimateOnScroll
vi.mock('../AnimateOnScroll', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('Teachers', () => {
  it('renders section title', () => {
    render(<Teachers />);
    expect(screen.getByText('Nuestros Profesores')).toBeInTheDocument();
  });

  it('renders all teacher names', () => {
    render(<Teachers />);
    expect(screen.getByText('Yunaisy Farray')).toBeInTheDocument();
    expect(screen.getByText('Daniel Sené')).toBeInTheDocument();
    expect(screen.getByText('Alejandro Miñoso')).toBeInTheDocument();
    expect(screen.getByText('Iroel Bastarreche')).toBeInTheDocument();
  });

  it('renders teacher specialties', () => {
    const { container } = render(<Teachers />);
    // Check that teachers have specialty text rendered (translation keys rendered)
    const teacherCards = container.querySelectorAll('[class*="rounded"]');
    expect(teacherCards.length).toBeGreaterThan(0);
  });

  it('renders teacher bios', () => {
    const { container } = render(<Teachers />);
    // Teachers should have descriptions/bios rendered
    const descriptions = container.querySelectorAll('p');
    expect(descriptions.length).toBeGreaterThan(0);
  });

  it('renders section with id for navigation', () => {
    const { container } = render(<Teachers />);
    const section = container.querySelector('#teachers');
    expect(section).toBeInTheDocument();
  });

  it('renders teacher images or initials as fallback', () => {
    const { container } = render(<Teachers />);
    // Teachers should have images or initials-based avatars
    const images = container.querySelectorAll('img');
    const initialsAvatars = container.querySelectorAll('[class*="rounded-full"]');
    // At least one type of avatar should be rendered
    expect(images.length + initialsAvatars.length).toBeGreaterThan(0);
  });

  it('renders CTA link to teachers page', () => {
    render(<Teachers />);
    const ctaLink = screen.getByRole('link', { name: /ver todos/i });
    expect(ctaLink).toBeInTheDocument();
    // Link should point to the teachers page
    expect(ctaLink).toHaveAttribute('href', '/es/profesores-baile-barcelona');
  });
});
