import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ScheduleSection from '../ScheduleSection';

// Mock AnimateOnScroll
vi.mock('../AnimateOnScroll', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('ScheduleSection', () => {
  const mockT = (key: string) => {
    const translations: Record<string, string> = {
      scheduleTitle: 'Horarios de Clase',
      scheduleSubtitle: 'Encuentra tu clase ideal',
    };
    return translations[key] || key;
  };

  const mockSchedules = [
    {
      id: '1',
      day: 'Lunes',
      className: 'Dancehall Principiantes',
      time: '18:00 - 19:00',
      teacher: 'Isabel López',
      level: 'Principiante',
    },
    {
      id: '2',
      day: 'Miércoles',
      className: 'Dancehall Intermedio',
      time: '19:00 - 20:00',
      teacher: 'Sandra Gómez',
      level: 'Intermedio',
    },
  ];

  it('renders section title', () => {
    render(
      <ScheduleSection
        titleKey="scheduleTitle"
        subtitleKey="scheduleSubtitle"
        schedules={mockSchedules}
        t={mockT}
      />
    );

    expect(screen.getByText('Horarios de Clase')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(
      <ScheduleSection
        titleKey="scheduleTitle"
        subtitleKey="scheduleSubtitle"
        schedules={mockSchedules}
        t={mockT}
      />
    );

    expect(screen.getByText('Encuentra tu clase ideal')).toBeInTheDocument();
  });

  it('renders all schedules', () => {
    render(
      <ScheduleSection
        titleKey="scheduleTitle"
        subtitleKey="scheduleSubtitle"
        schedules={mockSchedules}
        t={mockT}
      />
    );

    expect(screen.getByText('Dancehall Principiantes')).toBeInTheDocument();
    expect(screen.getByText('Dancehall Intermedio')).toBeInTheDocument();
  });

  it('renders schedule times', () => {
    render(
      <ScheduleSection
        titleKey="scheduleTitle"
        subtitleKey="scheduleSubtitle"
        schedules={mockSchedules}
        t={mockT}
      />
    );

    expect(screen.getByText('18:00 - 19:00')).toBeInTheDocument();
    expect(screen.getByText('19:00 - 20:00')).toBeInTheDocument();
  });

  it('renders teacher names', () => {
    render(
      <ScheduleSection
        titleKey="scheduleTitle"
        subtitleKey="scheduleSubtitle"
        schedules={mockSchedules}
        t={mockT}
      />
    );

    expect(screen.getByText('Isabel López')).toBeInTheDocument();
    expect(screen.getByText('Sandra Gómez')).toBeInTheDocument();
  });

  it('renders days', () => {
    render(
      <ScheduleSection
        titleKey="scheduleTitle"
        subtitleKey="scheduleSubtitle"
        schedules={mockSchedules}
        t={mockT}
      />
    );

    expect(screen.getByText('Lunes')).toBeInTheDocument();
    expect(screen.getByText('Miércoles')).toBeInTheDocument();
  });

  it('renders levels', () => {
    render(
      <ScheduleSection
        titleKey="scheduleTitle"
        subtitleKey="scheduleSubtitle"
        schedules={mockSchedules}
        t={mockT}
      />
    );

    expect(screen.getByText('Principiante')).toBeInTheDocument();
    expect(screen.getByText('Intermedio')).toBeInTheDocument();
  });

  it('renders section with id for anchor links', () => {
    const { container } = render(
      <ScheduleSection
        titleKey="scheduleTitle"
        subtitleKey="scheduleSubtitle"
        schedules={mockSchedules}
        t={mockT}
      />
    );

    const section = container.querySelector('#schedule');
    expect(section).toBeInTheDocument();
  });

  it('renders note when provided', () => {
    const schedulesWithNote = [
      {
        id: '1',
        day: 'Lunes',
        className: 'Dancehall Principiantes',
        time: '18:00 - 19:00',
        teacher: 'Isabel López',
        level: 'Principiante',
        note: 'A partir del 16 de enero',
      },
    ];

    render(
      <ScheduleSection
        titleKey="scheduleTitle"
        subtitleKey="scheduleSubtitle"
        schedules={schedulesWithNote}
        t={mockT}
      />
    );

    expect(screen.getByText('A partir del 16 de enero')).toBeInTheDocument();
  });

  it('handles empty schedules array', () => {
    render(
      <ScheduleSection
        titleKey="scheduleTitle"
        subtitleKey="scheduleSubtitle"
        schedules={[]}
        t={mockT}
      />
    );

    expect(screen.getByText('Horarios de Clase')).toBeInTheDocument();
  });
});
