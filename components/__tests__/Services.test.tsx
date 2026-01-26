import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import Services from '../Services';

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
    expect(screen.getByText('Mucho Más Que Una Escuela de Baile')).toBeInTheDocument();
  });

  it('renders section intro', () => {
    render(<Services />);
    expect(
      screen.getByText(
        /En Farray's International Dance Center ofrecemos mucho más que clases de baile/
      )
    ).toBeInTheDocument();
  });

  it('renders section with id for navigation', () => {
    const { container } = render(<Services />);
    const section = container.querySelector('#services');
    expect(section).toBeInTheDocument();
  });

  it('renders 3 featured service cards by default', () => {
    render(<Services />);
    // By default, only 3 featured services are shown: rental, corporate, gift
    const serviceTitles = screen.getAllByRole('heading', { level: 3 });
    expect(serviceTitles.length).toBe(3);
  });

  it('renders all 9 service cards when showAll is true', () => {
    render(<Services showAll />);
    const serviceTitles = screen.getAllByRole('heading', { level: 3 });
    expect(serviceTitles.length).toBe(9);
  });

  it('renders featured service titles (rental, corporate, gift)', () => {
    render(<Services />);
    expect(screen.getByText('Alquiler de Salas')).toBeInTheDocument();
    expect(screen.getByText('Servicios para Empresas')).toBeInTheDocument();
    expect(screen.getByText('Regala Baile')).toBeInTheDocument();
  });

  it('renders all service titles when showAll is true', () => {
    render(<Services showAll />);
    expect(screen.getByText('Alquiler de Salas')).toBeInTheDocument();
    expect(screen.getByText('Grabaciones y Fotografía')).toBeInTheDocument();
    expect(screen.getByText('Fiestas y Despedidas')).toBeInTheDocument();
    expect(screen.getByText('Clases Particulares')).toBeInTheDocument();
  });

  it('renders service descriptions', () => {
    render(<Services />);
    expect(screen.getByText(/Salas amplias y equipadas para ensayos/)).toBeInTheDocument();
  });

  it('renders service CTA links', () => {
    render(<Services />);
    expect(screen.getByText('Reserva tu Sala')).toBeInTheDocument();
    expect(screen.getByText('Solicitar Team Building')).toBeInTheDocument();
    expect(screen.getByText('Regala una Experiencia')).toBeInTheDocument();
  });

  it('renders icons for featured services', () => {
    render(<Services />);
    // Featured services: rental (KeyIcon), corporate (BuildingOfficeIcon), gift (HeartIcon)
    expect(screen.getByTestId('key-icon')).toBeInTheDocument();
    expect(screen.getByTestId('building-icon')).toBeInTheDocument();
    expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
  });

  it('renders links with correct href attributes', () => {
    render(<Services />);
    const rentalLink = screen.getByRole('link', { name: /alquiler de salas/i });
    // Link now points to dedicated rental page instead of anchor
    expect(rentalLink).toHaveAttribute('href', '/es/alquiler-salas-baile-barcelona');
  });

  it('renders view all services link when not showing all', () => {
    render(<Services />);
    expect(screen.getByText('Ver todos los servicios')).toBeInTheDocument();
  });
});
