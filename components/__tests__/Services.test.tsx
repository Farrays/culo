import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Services from '../Services';

// Mock useI18n
vi.mock('../../hooks/useI18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        servicesTitle: 'Nuestros Servicios',
        servicesIntro: 'Descubre todo lo que ofrecemos',
        serviceRentalTitle: 'Alquiler de Salas',
        serviceRentalDesc: 'Alquila nuestras salas para tus ensayos.',
        serviceRentalCTA: 'Reservar sala',
        servicePhotoTitle: 'Sesiones Fotográficas',
        servicePhotoDesc: 'Sesiones de fotos profesionales.',
        servicePhotoCTA: 'Reservar sesión',
        servicePartiesTitle: 'Fiestas Privadas',
        servicePartiesDesc: 'Organiza tu evento con nosotros.',
        servicePartiesCTA: 'Más información',
        servicePrivateTitle: 'Clases Privadas',
        servicePrivateDesc: 'Clases personalizadas.',
        servicePrivateCTA: 'Reservar clase',
        serviceAgencyTitle: 'Agencia',
        serviceAgencyDesc: 'Servicios de agencia.',
        serviceAgencyCTA: 'Contactar',
        serviceCorporateTitle: 'Eventos Corporativos',
        serviceCorporateDesc: 'Team building y eventos.',
        serviceCorporateCTA: 'Solicitar info',
        serviceGiftTitle: 'Tarjetas Regalo',
        serviceGiftDesc: 'Regala clases de baile.',
        serviceGiftCTA: 'Comprar',
        serviceEventsTitle: 'Eventos',
        serviceEventsDesc: 'Participa en nuestros eventos.',
        serviceEventsCTA: 'Ver eventos',
        serviceMerchandisingTitle: 'Merchandising',
        serviceMerchandisingDesc: 'Productos de la escuela.',
        serviceMerchandisingCTA: 'Ver productos',
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

// Mock icons
vi.mock('../../lib/icons', () => ({
  KeyIcon: () => <svg data-testid="key-icon" />,
  CameraIcon: () => <svg data-testid="camera-icon" />,
  SparklesIcon: () => <svg data-testid="sparkles-icon" />,
  UserIcon: () => <svg data-testid="user-icon" />,
  PlayCircleIcon: () => <svg data-testid="play-icon" />,
  BuildingOfficeIcon: () => <svg data-testid="building-icon" />,
  HeartIcon: () => <svg data-testid="heart-icon" />,
  CalendarDaysIcon: () => <svg data-testid="calendar-icon" />,
  ShoppingBagIcon: () => <svg data-testid="shopping-icon" />,
}));

describe('Services', () => {
  it('renders section title', () => {
    render(<Services />);
    expect(screen.getByText('Nuestros Servicios')).toBeInTheDocument();
  });

  it('renders section intro', () => {
    render(<Services />);
    expect(screen.getByText('Descubre todo lo que ofrecemos')).toBeInTheDocument();
  });

  it('renders section with id for navigation', () => {
    const { container } = render(<Services />);
    const section = container.querySelector('#services');
    expect(section).toBeInTheDocument();
  });

  it('renders all service titles', () => {
    render(<Services />);
    expect(screen.getByText('Alquiler de Salas')).toBeInTheDocument();
    expect(screen.getByText('Sesiones Fotográficas')).toBeInTheDocument();
    expect(screen.getByText('Fiestas Privadas')).toBeInTheDocument();
    expect(screen.getByText('Clases Privadas')).toBeInTheDocument();
  });

  it('renders service descriptions', () => {
    render(<Services />);
    expect(screen.getByText('Alquila nuestras salas para tus ensayos.')).toBeInTheDocument();
  });

  it('renders service CTA links', () => {
    render(<Services />);
    expect(screen.getByText('Reservar sala')).toBeInTheDocument();
    expect(screen.getByText('Reservar sesión')).toBeInTheDocument();
  });

  it('renders icons for each service', () => {
    render(<Services />);
    expect(screen.getByTestId('key-icon')).toBeInTheDocument();
    expect(screen.getByTestId('camera-icon')).toBeInTheDocument();
    expect(screen.getByTestId('sparkles-icon')).toBeInTheDocument();
  });

  it('renders 9 service cards', () => {
    render(<Services />);
    // Count the number of service titles
    const serviceTitles = screen.getAllByRole('heading', { level: 3 });
    expect(serviceTitles.length).toBe(9);
  });

  it('renders links with correct href attributes', () => {
    render(<Services />);
    const rentalLink = screen.getByRole('link', { name: /alquiler de salas/i });
    expect(rentalLink).toHaveAttribute('href', '#rental');
  });
});
