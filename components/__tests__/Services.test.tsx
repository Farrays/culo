import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Services from '../Services';

// Helper function to render with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

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
        servicesViewAll: 'Ver todos los servicios',
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
    renderWithRouter(<Services />);
    expect(screen.getByText('Nuestros Servicios')).toBeInTheDocument();
  });

  it('renders section intro', () => {
    renderWithRouter(<Services />);
    expect(screen.getByText('Descubre todo lo que ofrecemos')).toBeInTheDocument();
  });

  it('renders section with id for navigation', () => {
    const { container } = renderWithRouter(<Services />);
    const section = container.querySelector('#services');
    expect(section).toBeInTheDocument();
  });

  it('renders 3 featured service cards by default', () => {
    renderWithRouter(<Services />);
    // By default, only 3 featured services are shown: rental, corporate, gift
    const serviceTitles = screen.getAllByRole('heading', { level: 3 });
    expect(serviceTitles.length).toBe(3);
  });

  it('renders all 9 service cards when showAll is true', () => {
    renderWithRouter(<Services showAll />);
    const serviceTitles = screen.getAllByRole('heading', { level: 3 });
    expect(serviceTitles.length).toBe(9);
  });

  it('renders featured service titles (rental, corporate, gift)', () => {
    renderWithRouter(<Services />);
    expect(screen.getByText('Alquiler de Salas')).toBeInTheDocument();
    expect(screen.getByText('Eventos Corporativos')).toBeInTheDocument();
    expect(screen.getByText('Tarjetas Regalo')).toBeInTheDocument();
  });

  it('renders all service titles when showAll is true', () => {
    renderWithRouter(<Services showAll />);
    expect(screen.getByText('Alquiler de Salas')).toBeInTheDocument();
    expect(screen.getByText('Sesiones Fotográficas')).toBeInTheDocument();
    expect(screen.getByText('Fiestas Privadas')).toBeInTheDocument();
    expect(screen.getByText('Clases Privadas')).toBeInTheDocument();
  });

  it('renders service descriptions', () => {
    renderWithRouter(<Services />);
    expect(screen.getByText('Alquila nuestras salas para tus ensayos.')).toBeInTheDocument();
  });

  it('renders service CTA links', () => {
    renderWithRouter(<Services />);
    expect(screen.getByText('Reservar sala')).toBeInTheDocument();
    expect(screen.getByText('Solicitar info')).toBeInTheDocument();
    expect(screen.getByText('Comprar')).toBeInTheDocument();
  });

  it('renders icons for featured services', () => {
    renderWithRouter(<Services />);
    // Featured services: rental (KeyIcon), corporate (BuildingOfficeIcon), gift (HeartIcon)
    expect(screen.getByTestId('key-icon')).toBeInTheDocument();
    expect(screen.getByTestId('building-icon')).toBeInTheDocument();
    expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
  });

  it('renders links with correct href attributes', () => {
    renderWithRouter(<Services />);
    const rentalLink = screen.getByRole('link', { name: /alquiler de salas/i });
    // Link now points to dedicated rental page instead of anchor
    expect(rentalLink).toHaveAttribute('href', '/es/alquiler-salas-baile-barcelona');
  });

  it('renders view all services link when not showing all', () => {
    renderWithRouter(<Services />);
    expect(screen.getByText('Ver todos los servicios')).toBeInTheDocument();
  });
});
