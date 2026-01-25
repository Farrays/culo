import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../../test/test-utils';
import { ScheduleCard } from '../ScheduleCard';
import type { ScheduleClass } from '../../../constants/schedule-data';

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
  id: 'salsa-cubana-monday-1900',
  styleName: 'Salsa Cubana',
  className: 'Salsa Cubana',
  day: 'monday',
  time: '19:00',
  level: 'beginner',
  teacher: 'Yunaisy Farray',
  category: 'latino',
};

const mockScheduleClassWithLink: ScheduleClass = {
  ...mockScheduleClass,
  link: '/clases/salsa-cubana-barcelona',
};

describe('ScheduleCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders class name', () => {
    render(<ScheduleCard scheduleClass={mockScheduleClass} />);
    expect(screen.getByText('Salsa Cubana')).toBeInTheDocument();
  });

  it('renders class time', () => {
    render(<ScheduleCard scheduleClass={mockScheduleClass} />);
    expect(screen.getByText('19:00')).toBeInTheDocument();
  });

  it('renders teacher name', () => {
    render(<ScheduleCard scheduleClass={mockScheduleClass} />);
    expect(screen.getByText(/Yunaisy Farray/)).toBeInTheDocument();
  });

  it('renders level badge', () => {
    render(<ScheduleCard scheduleClass={mockScheduleClass} />);
    expect(screen.getByText('horariosV2_level_principiantes')).toBeInTheDocument();
  });

  it('renders with default props', () => {
    render(<ScheduleCard scheduleClass={mockScheduleClass} />);
    expect(screen.getByText('Salsa Cubana')).toBeInTheDocument();
  });

  it('renders without actions when showActions is false', () => {
    render(<ScheduleCard scheduleClass={mockScheduleClass} showActions={false} />);
    // Share button should not be present
    const shareButtons = screen.queryAllByRole('button');
    expect(shareButtons.length).toBeLessThanOrEqual(1);
  });

  it('renders link to class page when link is provided', () => {
    render(<ScheduleCard scheduleClass={mockScheduleClassWithLink} />);
    // Find link containing the class URL
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/es/clases/salsa-cubana-barcelona');
  });

  it('renders as div when no link is provided', () => {
    const { container } = render(<ScheduleCard scheduleClass={mockScheduleClass} />);
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

    render(<ScheduleCard scheduleClass={mockScheduleClass} />);

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

    render(<ScheduleCard scheduleClass={mockScheduleClass} />);

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

    render(<ScheduleCard scheduleClass={advancedClass} />);
    expect(screen.getByText('horariosV2_level_avanzado')).toBeInTheDocument();
  });

  it('renders with custom color class', () => {
    const { container } = render(
      <ScheduleCard scheduleClass={mockScheduleClass} colorClass="emerald-500" />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders day of the week', () => {
    render(<ScheduleCard scheduleClass={mockScheduleClass} />);
    // The day should be rendered somewhere
    expect(screen.getByText(/lunes/i)).toBeInTheDocument();
  });
});
