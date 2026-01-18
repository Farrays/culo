/**
 * Tests for DynamicScheduleSection component
 *
 * Tests the dynamic schedule display with loading, error, and vacation states
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DynamicScheduleSection, {
  ScheduleSkeleton,
  VacationNotice,
  ErrorNotice,
  ScheduleCard,
} from '../DynamicScheduleSection';
import type { ScheduleSession } from '../../hooks/useScheduleSessions';

// Mock translation function
const mockT = (key: string) => {
  const translations: Record<string, string> = {
    scheduleTitle: 'Horarios',
    scheduleSubtitle: 'Nuestras clases disponibles',
    scheduleVacationMessage: 'No hay clases programadas',
    scheduleVacationSubtext: 'Volvemos pronto',
    scheduleVacationCTA: 'Avísame',
    scheduleUsingCached: 'Datos en caché',
    classFull: 'COMPLETO',
    spotsAvailable: 'plazas',
    retry: 'Reintentar',
    beginnerLevel: 'Iniciación',
    basicLevel: 'Básico',
    intermediateLevel: 'Intermedio',
    advancedLevel: 'Avanzado',
    allLevels: 'Todos los niveles',
    dayShort_monday: 'Lun',
    dayShort_tuesday: 'Mar',
    dayShort_wednesday: 'Mié',
    dayShort_thursday: 'Jue',
    dayShort_friday: 'Vie',
    dayShort_saturday: 'Sáb',
    dayShort_sunday: 'Dom',
  };
  return translations[key] || key;
};

// Sample session data
const mockSession: ScheduleSession = {
  id: 1,
  name: 'Bachata Sensual',
  style: 'bachata',
  level: 'intermedio',
  instructor: 'María García',
  dateFormatted: '20 Ene',
  dayKey: 'monday',
  dayOfWeek: 'Lunes',
  time: '19:00',
  endTime: '20:00',
  spotsAvailable: 5,
  isFull: false,
  capacity: 15,
  rawStartsAt: '2026-01-20T19:00:00Z',
  duration: 60,
  category: 'latino',
  pageSlug: 'bachata-barcelona',
};

const mockFullSession: ScheduleSession = {
  ...mockSession,
  id: 2,
  name: 'Salsa Cubana',
  spotsAvailable: 0,
  isFull: true,
};

describe('DynamicScheduleSection', () => {
  it('renders title and subtitle', () => {
    render(
      <DynamicScheduleSection
        t={mockT}
        sessions={[mockSession]}
        titleKey="scheduleTitle"
        subtitleKey="scheduleSubtitle"
      />
    );

    expect(screen.getByText('Horarios')).toBeInTheDocument();
    expect(screen.getByText('Nuestras clases disponibles')).toBeInTheDocument();
  });

  it('renders schedule cards when sessions provided', () => {
    render(<DynamicScheduleSection t={mockT} sessions={[mockSession]} />);

    expect(screen.getByText('Bachata Sensual')).toBeInTheDocument();
    expect(screen.getByText('María García')).toBeInTheDocument();
    expect(screen.getByText('19:00')).toBeInTheDocument();
  });

  it('shows loading skeleton when loading', () => {
    render(<DynamicScheduleSection t={mockT} sessions={[]} loading={true} />);

    // Skeleton has animate-pulse class
    const skeleton = document.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('shows vacation notice when isEmpty is true', () => {
    render(<DynamicScheduleSection t={mockT} sessions={[]} isEmpty={true} />);

    expect(screen.getByText('No hay clases programadas')).toBeInTheDocument();
    expect(screen.getByText('Volvemos pronto')).toBeInTheDocument();
  });

  it('calls onNotifyMe when CTA clicked in vacation state', () => {
    const onNotifyMe = vi.fn();
    render(
      <DynamicScheduleSection t={mockT} sessions={[]} isEmpty={true} onNotifyMe={onNotifyMe} />
    );

    const ctaButton = screen.getByText('Avísame');
    fireEvent.click(ctaButton);

    expect(onNotifyMe).toHaveBeenCalledTimes(1);
  });

  it('shows cached data notice when usingFallback is true', () => {
    render(<DynamicScheduleSection t={mockT} sessions={[mockSession]} usingFallback={true} />);

    expect(screen.getByText('Datos en caché')).toBeInTheDocument();
  });

  it('shows availability when showAvailability is true', () => {
    render(<DynamicScheduleSection t={mockT} sessions={[mockSession]} showAvailability={true} />);

    expect(screen.getByText('5 plazas')).toBeInTheDocument();
  });

  it('shows FULL badge for full classes', () => {
    render(
      <DynamicScheduleSection t={mockT} sessions={[mockFullSession]} showAvailability={true} />
    );

    expect(screen.getByText('COMPLETO')).toBeInTheDocument();
  });

  it('renders multiple sessions', () => {
    render(<DynamicScheduleSection t={mockT} sessions={[mockSession, mockFullSession]} />);

    expect(screen.getByText('Bachata Sensual')).toBeInTheDocument();
    expect(screen.getByText('Salsa Cubana')).toBeInTheDocument();
  });

  it('has correct test ids', () => {
    render(<DynamicScheduleSection t={mockT} sessions={[mockSession]} />);

    expect(screen.getByTestId('schedule-section')).toBeInTheDocument();
    expect(screen.getByTestId('schedule-card')).toBeInTheDocument();
    expect(screen.getByTestId('schedule-date')).toBeInTheDocument();
  });
});

describe('ScheduleSkeleton', () => {
  it('renders skeleton placeholders', () => {
    render(<ScheduleSkeleton />);

    // Should have 3 skeleton cards
    const skeletonCards = document.querySelectorAll('.animate-pulse > div');
    expect(skeletonCards.length).toBe(3);
  });
});

describe('VacationNotice', () => {
  it('renders message and CTA', () => {
    render(<VacationNotice t={mockT} />);

    expect(screen.getByText('No hay clases programadas')).toBeInTheDocument();
    expect(screen.getByText('Volvemos pronto')).toBeInTheDocument();
  });

  it('renders notify button when onNotifyMe provided', () => {
    const onNotifyMe = vi.fn();
    render(<VacationNotice t={mockT} onNotifyMe={onNotifyMe} />);

    const button = screen.getByText('Avísame');
    expect(button).toBeInTheDocument();
  });

  it('does not render button when onNotifyMe not provided', () => {
    render(<VacationNotice t={mockT} />);

    expect(screen.queryByText('Avísame')).not.toBeInTheDocument();
  });
});

describe('ErrorNotice', () => {
  it('renders error message', () => {
    render(<ErrorNotice t={mockT} error="Something went wrong" />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders retry button when onRetry provided', () => {
    const onRetry = vi.fn();
    render(<ErrorNotice t={mockT} error="Error" onRetry={onRetry} />);

    const button = screen.getByText('Reintentar');
    fireEvent.click(button);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

describe('ScheduleCard', () => {
  it('renders session information', () => {
    render(<ScheduleCard session={mockSession} t={mockT} index={0} />);

    expect(screen.getByText('Bachata Sensual')).toBeInTheDocument();
    expect(screen.getByText('19:00')).toBeInTheDocument();
    expect(screen.getByText('María García')).toBeInTheDocument();
  });

  it('shows date formatted', () => {
    render(<ScheduleCard session={mockSession} t={mockT} index={0} />);

    expect(screen.getByText('20 Ene')).toBeInTheDocument();
    expect(screen.getByText('Lun')).toBeInTheDocument();
  });

  it('shows availability when showAvailability is true', () => {
    render(<ScheduleCard session={mockSession} t={mockT} index={0} showAvailability={true} />);

    expect(screen.getByText('5 plazas')).toBeInTheDocument();
  });

  it('shows FULL badge for full sessions', () => {
    render(<ScheduleCard session={mockFullSession} t={mockT} index={0} showAvailability={true} />);

    expect(screen.getByText('COMPLETO')).toBeInTheDocument();
  });

  it('uses different border color for full classes', () => {
    const { container } = render(<ScheduleCard session={mockFullSession} t={mockT} index={0} />);

    const card = container.querySelector('[data-testid="schedule-card"]');
    expect(card?.className).toContain('border-red-500');
  });
});
