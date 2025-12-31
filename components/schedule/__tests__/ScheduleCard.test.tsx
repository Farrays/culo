import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ScheduleCard } from '../ScheduleCard';
import type { ScheduleClass } from '../../../constants/schedule-data';

// Mock useI18n
vi.mock('../../../hooks/useI18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    locale: 'es',
  }),
}));

// Mock schedule data constants
vi.mock('../../../constants/horarios-page-data', () => ({
  DAYS_I18N: {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo',
  },
  getClassBadges: () => [],
}));

const mockScheduleClass: ScheduleClass = {
  className: 'Salsa Cubana',
  day: 'monday',
  time: '19:00',
  duration: 60,
  level: 'beginner',
  teacher: 'Yunaisy Farray',
  room: 'Sala A',
  category: 'latin',
};

const mockScheduleClassWithLink: ScheduleClass = {
  ...mockScheduleClass,
  link: '/clases/salsa-cubana-barcelona',
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ScheduleCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders class name', () => {
    renderWithRouter(<ScheduleCard scheduleClass={mockScheduleClass} />);
    expect(screen.getByText('Salsa Cubana')).toBeInTheDocument();
  });

  it('renders class time', () => {
    renderWithRouter(<ScheduleCard scheduleClass={mockScheduleClass} />);
    expect(screen.getByText('19:00')).toBeInTheDocument();
  });

  it('renders teacher name', () => {
    renderWithRouter(<ScheduleCard scheduleClass={mockScheduleClass} />);
    expect(screen.getByText(/Yunaisy Farray/)).toBeInTheDocument();
  });

  it('renders level badge', () => {
    renderWithRouter(<ScheduleCard scheduleClass={mockScheduleClass} />);
    expect(screen.getByText('horariosV2_level_principiantes')).toBeInTheDocument();
  });

  it('renders with default props', () => {
    renderWithRouter(<ScheduleCard scheduleClass={mockScheduleClass} />);
    expect(screen.getByText('Salsa Cubana')).toBeInTheDocument();
  });

  it('renders without actions when showActions is false', () => {
    renderWithRouter(<ScheduleCard scheduleClass={mockScheduleClass} showActions={false} />);
    // Share button should not be present
    const shareButtons = screen.queryAllByRole('button');
    expect(shareButtons.length).toBeLessThanOrEqual(1);
  });

  it('renders link to class page when link is provided', () => {
    renderWithRouter(<ScheduleCard scheduleClass={mockScheduleClassWithLink} />);
    // Find link containing the class URL
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/es/clases/salsa-cubana-barcelona');
  });

  it('renders as div when no link is provided', () => {
    const { container } = renderWithRouter(<ScheduleCard scheduleClass={mockScheduleClass} />);
    // Should not render as a link
    const links = screen.queryAllByRole('link');
    expect(links.length).toBe(0);
    // Should render as a div
    expect(container.querySelector('div.relative')).toBeInTheDocument();
  });

  it('handles share button click', async () => {
    // Mock navigator.share
    const mockShare = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', {
      value: mockShare,
      writable: true,
      configurable: true,
    });

    renderWithRouter(<ScheduleCard scheduleClass={mockScheduleClass} />);

    // The share button uses translation key as text
    const shareButton = screen.getByRole('button', { name: /horariosV2_card_share/i });
    await fireEvent.click(shareButton);

    expect(mockShare).toHaveBeenCalled();
  });

  it('falls back to clipboard when share is not available', async () => {
    // Remove navigator.share
    Object.defineProperty(navigator, 'share', {
      value: undefined,
      configurable: true,
    });

    // Mock clipboard
    const mockClipboard = {
      writeText: vi.fn().mockResolvedValue(undefined),
    };
    Object.defineProperty(navigator, 'clipboard', {
      value: mockClipboard,
      writable: true,
      configurable: true,
    });

    renderWithRouter(<ScheduleCard scheduleClass={mockScheduleClass} />);

    // The share button uses translation key as text
    const shareButton = screen.getByRole('button', { name: /horariosV2_card_share/i });
    await fireEvent.click(shareButton);

    expect(mockClipboard.writeText).toHaveBeenCalled();
  });

  it('renders with different level', () => {
    const advancedClass: ScheduleClass = {
      ...mockScheduleClass,
      level: 'advanced',
    };

    renderWithRouter(<ScheduleCard scheduleClass={advancedClass} />);
    expect(screen.getByText('horariosV2_level_avanzado')).toBeInTheDocument();
  });

  it('renders with custom color class', () => {
    const { container } = renderWithRouter(
      <ScheduleCard scheduleClass={mockScheduleClass} colorClass="emerald-500" />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders day of the week', () => {
    renderWithRouter(<ScheduleCard scheduleClass={mockScheduleClass} />);
    // The day should be rendered somewhere
    expect(screen.getByText(/lunes/i)).toBeInTheDocument();
  });
});
