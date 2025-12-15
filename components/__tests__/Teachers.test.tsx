import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Teachers from '../Teachers';

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
    render(<Teachers />);
    expect(screen.getByText('Nuestros Profesores')).toBeInTheDocument();
  });

  it('renders all teacher names', () => {
    render(<Teachers />);
    expect(screen.getByText('Yunaisy Farray')).toBeInTheDocument();
    expect(screen.getByText('Joni Pila')).toBeInTheDocument();
    expect(screen.getByText('Elena Petrova')).toBeInTheDocument();
  });

  it('renders teacher specialties', () => {
    render(<Teachers />);
    expect(screen.getByText('Salsa Cubana')).toBeInTheDocument();
    expect(screen.getByText('Bachata y Kizomba')).toBeInTheDocument();
    expect(screen.getByText('Ballet y Contemporáneo')).toBeInTheDocument();
  });

  it('renders teacher bios', () => {
    render(<Teachers />);
    expect(
      screen.getByText('Experta en salsa cubana con 15 años de experiencia.')
    ).toBeInTheDocument();
  });

  it('renders section with id for navigation', () => {
    const { container } = render(<Teachers />);
    const section = container.querySelector('#teachers');
    expect(section).toBeInTheDocument();
  });

  it('renders initials avatars for teachers without photos', () => {
    render(<Teachers />);
    // Yunaisy Farray -> YF
    expect(screen.getByText('YF')).toBeInTheDocument();
    // Joni Pila -> JP
    expect(screen.getByText('JP')).toBeInTheDocument();
    // Elena Petrova -> EP
    expect(screen.getByText('EP')).toBeInTheDocument();
  });

  it('renders CTA link', () => {
    render(<Teachers />);
    const ctaLink = screen.getByRole('link', { name: /ver todos/i });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute('href', '#all-teachers');
  });
});
