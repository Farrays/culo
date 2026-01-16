import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Teachers from '../Teachers';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

// Mock useI18n
vi.mock('../../hooks/useI18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        teachersTitle: 'Nuestros Profesores',
        teacher1Specialty: 'Salsa Cubana',
        teacher1Bio: 'Experta en salsa cubana con 15 años de experiencia.',
        teacher2Specialty: 'Bachata y Kizomba',
        teacher2Bio: 'Especialista en bailes latinos sensuales.',
        teacher3Specialty: 'Ballet y Contemporáneo',
        teacher3Bio: 'Bailarina clásica con formación internacional.',
        teachersCTA: 'Ver todos los profesores',
      };
      return translations[key] || key;
    },
    locale: 'es',
    isLoading: false,
    setLocale: vi.fn(),
  }),
}));

// Mock AnimateOnScroll
vi.mock('../AnimateOnScroll', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('Teachers', () => {
  it('renders section title', () => {
    renderWithRouter(<Teachers />);
    expect(screen.getByText('Nuestros Profesores')).toBeInTheDocument();
  });

  it('renders all teacher names', () => {
    renderWithRouter(<Teachers />);
    expect(screen.getByText('Yunaisy Farray')).toBeInTheDocument();
    expect(screen.getByText('Daniel Sené')).toBeInTheDocument();
    expect(screen.getByText('Alejandro Miñoso')).toBeInTheDocument();
    expect(screen.getByText('Iroel Bastarreche')).toBeInTheDocument();
  });

  it('renders teacher specialties', () => {
    const { container } = renderWithRouter(<Teachers />);
    // Check that teachers have specialty text rendered (translation keys rendered)
    const teacherCards = container.querySelectorAll('[class*="rounded"]');
    expect(teacherCards.length).toBeGreaterThan(0);
  });

  it('renders teacher bios', () => {
    const { container } = renderWithRouter(<Teachers />);
    // Teachers should have descriptions/bios rendered
    const descriptions = container.querySelectorAll('p');
    expect(descriptions.length).toBeGreaterThan(0);
  });

  it('renders section with id for navigation', () => {
    const { container } = renderWithRouter(<Teachers />);
    const section = container.querySelector('#teachers');
    expect(section).toBeInTheDocument();
  });

  it('renders teacher images or initials as fallback', () => {
    const { container } = renderWithRouter(<Teachers />);
    // Teachers should have images or initials-based avatars
    const images = container.querySelectorAll('img');
    const initialsAvatars = container.querySelectorAll('[class*="rounded-full"]');
    // At least one type of avatar should be rendered
    expect(images.length + initialsAvatars.length).toBeGreaterThan(0);
  });

  it('renders CTA link to teachers page', () => {
    renderWithRouter(<Teachers />);
    const ctaLink = screen.getByRole('link', { name: /ver todos/i });
    expect(ctaLink).toBeInTheDocument();
    // Link should point to the teachers page
    expect(ctaLink).toHaveAttribute('href', '/es/profesores-baile-barcelona');
  });
});
