/**
 * ClassCard Component Tests - V1 Style
 * Tests for compact class card with whole-card selection
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../../test/test-utils';
import { ClassCard } from '../components/ClassCard';
import type { ClassData } from '../types/booking';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

// Mock class data
const createMockClass = (overrides?: Partial<ClassData>): ClassData => ({
  id: 1,
  name: 'Salsa Nivel Básico',
  date: '20/01/2025',
  time: '19:00',
  dayOfWeek: 'Lunes',
  spotsAvailable: 10,
  isFull: false,
  location: "Farray's Center",
  instructor: 'Carlos',
  style: 'salsa',
  level: 'basico',
  rawStartsAt: '2025-01-20T19:00:00',
  duration: 60,
  description: 'Clase de salsa para principiantes',
  ...overrides,
});

describe('ClassCard', () => {
  const mockOnSelect = vi.fn();
  const mockOnShowInfo = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render class name', () => {
      const classData = createMockClass();
      render(
        <ClassCard classData={classData} onSelect={mockOnSelect} onShowInfo={mockOnShowInfo} />
      );

      expect(screen.getByText('Salsa Nivel Básico')).toBeInTheDocument();
    });

    it('should render day of week and date', () => {
      const classData = createMockClass({ dayOfWeek: 'Martes', date: '21/01/2025' });
      render(
        <ClassCard classData={classData} onSelect={mockOnSelect} onShowInfo={mockOnShowInfo} />
      );

      expect(screen.getByText(/Martes/)).toBeInTheDocument();
      expect(screen.getByText(/21\/01\/2025/)).toBeInTheDocument();
    });

    it('should render class time', () => {
      const classData = createMockClass({ time: '20:30' });
      render(
        <ClassCard classData={classData} onSelect={mockOnSelect} onShowInfo={mockOnShowInfo} />
      );

      expect(screen.getByText('20:30')).toBeInTheDocument();
    });

    it('should render instructor name', () => {
      const classData = createMockClass({ instructor: 'María' });
      render(
        <ClassCard classData={classData} onSelect={mockOnSelect} onShowInfo={mockOnShowInfo} />
      );

      expect(screen.getByText('María')).toBeInTheDocument();
    });

    it('should render +info button when description exists', () => {
      const classData = createMockClass({ description: 'Some description' });
      render(
        <ClassCard classData={classData} onSelect={mockOnSelect} onShowInfo={mockOnShowInfo} />
      );

      expect(screen.getByText('+info')).toBeInTheDocument();
    });

    it('should not render +info button when no description', () => {
      const classData = createMockClass({ description: '' });
      render(
        <ClassCard classData={classData} onSelect={mockOnSelect} onShowInfo={mockOnShowInfo} />
      );

      expect(screen.queryByText('+info')).not.toBeInTheDocument();
    });
  });

  describe('duration formatting', () => {
    it('should format duration in minutes', () => {
      const classData = createMockClass({ duration: 45 });
      render(
        <ClassCard classData={classData} onSelect={mockOnSelect} onShowInfo={mockOnShowInfo} />
      );

      expect(screen.getByText('45min')).toBeInTheDocument();
    });

    it('should format duration in hours', () => {
      const classData = createMockClass({ duration: 60 });
      render(
        <ClassCard classData={classData} onSelect={mockOnSelect} onShowInfo={mockOnShowInfo} />
      );

      expect(screen.getByText('1h')).toBeInTheDocument();
    });

    it('should format duration in hours and minutes', () => {
      const classData = createMockClass({ duration: 90 });
      render(
        <ClassCard classData={classData} onSelect={mockOnSelect} onShowInfo={mockOnShowInfo} />
      );

      expect(screen.getByText('1h 30min')).toBeInTheDocument();
    });
  });

  describe('full class state', () => {
    it('should show full indicator when class is full', () => {
      const classData = createMockClass({ isFull: true });
      render(
        <ClassCard classData={classData} onSelect={mockOnSelect} onShowInfo={mockOnShowInfo} />
      );

      // Full indicator should appear
      expect(screen.getByText(/Completo/)).toBeInTheDocument();
    });

    it('should disable the card when class is full', () => {
      const classData = createMockClass({ isFull: true });
      render(
        <ClassCard classData={classData} onSelect={mockOnSelect} onShowInfo={mockOnShowInfo} />
      );

      // The main card (div with role="button") should be aria-disabled
      const cardButton = screen.getAllByRole('button')[0];
      expect(cardButton).toHaveAttribute('aria-disabled', 'true');
    });

    it('should have reduced opacity when class is full', () => {
      const classData = createMockClass({ isFull: true });
      const { container } = render(
        <ClassCard classData={classData} onSelect={mockOnSelect} onShowInfo={mockOnShowInfo} />
      );

      // Should have opacity-60 class
      const card = container.querySelector('.opacity-60');
      expect(card).toBeInTheDocument();
    });
  });

  describe('NEW badge', () => {
    it('should show NEW badge when isNew is true', () => {
      const classData = createMockClass({ isNew: true });
      render(
        <ClassCard classData={classData} onSelect={mockOnSelect} onShowInfo={mockOnShowInfo} />
      );

      expect(screen.getByText(/NUEVA/)).toBeInTheDocument();
    });

    it('should not show NEW badge when isNew is false', () => {
      const classData = createMockClass({ isNew: false });
      render(
        <ClassCard classData={classData} onSelect={mockOnSelect} onShowInfo={mockOnShowInfo} />
      );

      expect(screen.queryByText(/NUEVA/)).not.toBeInTheDocument();
    });

    it('should not show NEW badge when isNew is undefined', () => {
      const classData = createMockClass(); // isNew not set
      render(
        <ClassCard classData={classData} onSelect={mockOnSelect} onShowInfo={mockOnShowInfo} />
      );

      expect(screen.queryByText(/NUEVA/)).not.toBeInTheDocument();
    });

    it('should show NEW badge when newUntil is in the future', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7); // 7 days from now
      const classData = createMockClass({
        isNew: true,
        newUntil: futureDate.toISOString().split('T')[0],
      });
      render(
        <ClassCard classData={classData} onSelect={mockOnSelect} onShowInfo={mockOnShowInfo} />
      );

      expect(screen.getByText(/NUEVA/)).toBeInTheDocument();
    });

    it('should not show NEW badge when newUntil is in the past', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 7); // 7 days ago
      const classData = createMockClass({
        isNew: true,
        newUntil: pastDate.toISOString().split('T')[0],
      });
      render(
        <ClassCard classData={classData} onSelect={mockOnSelect} onShowInfo={mockOnShowInfo} />
      );

      expect(screen.queryByText(/NUEVA/)).not.toBeInTheDocument();
    });

    it('should show NEW badge when isNew is true and newUntil is not set', () => {
      const classData = createMockClass({ isNew: true }); // No newUntil = always show
      render(
        <ClassCard classData={classData} onSelect={mockOnSelect} onShowInfo={mockOnShowInfo} />
      );

      expect(screen.getByText(/NUEVA/)).toBeInTheDocument();
    });

    it('should have amber styling for NEW badge', () => {
      const classData = createMockClass({ isNew: true });
      const { container } = render(
        <ClassCard classData={classData} onSelect={mockOnSelect} onShowInfo={mockOnShowInfo} />
      );

      // Should have amber-400 text color class
      const badge = container.querySelector('.text-amber-400');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('card selection', () => {
    it('should call onSelect when card is clicked', () => {
      const classData = createMockClass();
      render(
        <ClassCard classData={classData} onSelect={mockOnSelect} onShowInfo={mockOnShowInfo} />
      );

      // Click the main card button
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      fireEvent.click(buttons[0] as HTMLElement);

      expect(mockOnSelect).toHaveBeenCalledTimes(1);
      expect(mockOnSelect).toHaveBeenCalledWith(classData);
    });

    it('should not call onSelect when class is full', () => {
      const classData = createMockClass({ isFull: true });
      render(
        <ClassCard classData={classData} onSelect={mockOnSelect} onShowInfo={mockOnShowInfo} />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      fireEvent.click(buttons[0] as HTMLElement);

      expect(mockOnSelect).not.toHaveBeenCalled();
    });

    it('should show selected state with accent border', () => {
      const classData = createMockClass();
      const { container } = render(
        <ClassCard
          classData={classData}
          onSelect={mockOnSelect}
          onShowInfo={mockOnShowInfo}
          isSelected={true}
        />
      );

      // Should have primary-accent border when selected
      const card = container.querySelector('.border-primary-accent');
      expect(card).toBeInTheDocument();
    });

    it('should show check icon when selected', () => {
      const classData = createMockClass();
      const { container } = render(
        <ClassCard
          classData={classData}
          onSelect={mockOnSelect}
          onShowInfo={mockOnShowInfo}
          isSelected={true}
        />
      );

      // Should have a check icon (SVG with check path)
      const checkIcons = container.querySelectorAll('svg');
      const hasCheckIcon = Array.from(checkIcons).some(svg =>
        svg.innerHTML.includes('M5 13l4 4L19 7')
      );
      expect(hasCheckIcon).toBe(true);
    });
  });

  describe('info button', () => {
    it('should call onShowInfo when +info is clicked', () => {
      const classData = createMockClass({ description: 'Has description' });
      render(
        <ClassCard classData={classData} onSelect={mockOnSelect} onShowInfo={mockOnShowInfo} />
      );

      const infoButton = screen.getByText('+info');
      fireEvent.click(infoButton);

      expect(mockOnShowInfo).toHaveBeenCalledTimes(1);
      expect(mockOnShowInfo).toHaveBeenCalledWith(classData);
    });

    it('should not trigger card selection when clicking +info', () => {
      const classData = createMockClass({ description: 'Has description' });
      render(
        <ClassCard classData={classData} onSelect={mockOnSelect} onShowInfo={mockOnShowInfo} />
      );

      const infoButton = screen.getByText('+info');
      fireEvent.click(infoButton);

      // Only onShowInfo should be called, not onSelect
      expect(mockOnSelect).not.toHaveBeenCalled();
      expect(mockOnShowInfo).toHaveBeenCalled();
    });
  });

  describe('share button', () => {
    it('should render share button', () => {
      const classData = createMockClass();
      render(
        <ClassCard classData={classData} onSelect={mockOnSelect} onShowInfo={mockOnShowInfo} />
      );

      // Should have a button with share aria-label
      const buttons = screen.getAllByRole('button');
      const shareButton = buttons.find(btn =>
        btn.getAttribute('aria-label')?.includes('Compartir')
      );
      expect(shareButton).toBeInTheDocument();
    });

    it('should copy URL when share button is clicked', async () => {
      const classData = createMockClass({ id: 123 });
      render(
        <ClassCard classData={classData} onSelect={mockOnSelect} onShowInfo={mockOnShowInfo} />
      );

      const buttons = screen.getAllByRole('button');
      const shareButton = buttons.find(btn =>
        btn.getAttribute('aria-label')?.includes('Compartir')
      );

      if (shareButton) {
        fireEvent.click(shareButton);

        // Should have tried to copy to clipboard
        expect(navigator.clipboard.writeText).toHaveBeenCalled();
      }
    });

    it('should not trigger card selection when clicking share', async () => {
      const classData = createMockClass();
      render(
        <ClassCard classData={classData} onSelect={mockOnSelect} onShowInfo={mockOnShowInfo} />
      );

      const buttons = screen.getAllByRole('button');
      const shareButton = buttons.find(btn =>
        btn.getAttribute('aria-label')?.includes('Compartir')
      );

      if (shareButton) {
        fireEvent.click(shareButton);
        expect(mockOnSelect).not.toHaveBeenCalled();
      }
    });
  });

  describe('accessibility', () => {
    it('should have proper button types', () => {
      const classData = createMockClass({ description: 'Has description' });
      render(
        <ClassCard classData={classData} onSelect={mockOnSelect} onShowInfo={mockOnShowInfo} />
      );

      const buttons = screen.getAllByRole('button');
      // Filter to only check actual <button> elements (exclude div[role="button"])
      const buttonElements = buttons.filter(btn => btn.tagName.toLowerCase() === 'button');
      buttonElements.forEach(button => {
        expect(button).toHaveAttribute('type', 'button');
      });
      expect(buttonElements.length).toBeGreaterThan(0);
    });

    it('should have aria-label on share button', () => {
      const classData = createMockClass();
      render(
        <ClassCard classData={classData} onSelect={mockOnSelect} onShowInfo={mockOnShowInfo} />
      );

      const buttons = screen.getAllByRole('button');
      const shareButton = buttons.find(btn =>
        btn.getAttribute('aria-label')?.includes('Compartir')
      );
      expect(shareButton).toHaveAttribute('aria-label');
    });

    it('should have aria-label on +info button', () => {
      const classData = createMockClass({ description: 'Has description' });
      render(
        <ClassCard classData={classData} onSelect={mockOnSelect} onShowInfo={mockOnShowInfo} />
      );

      const infoButton = screen.getByText('+info');
      expect(infoButton).toHaveAttribute('aria-label');
    });
  });

  describe('memoization', () => {
    it('should have displayName for debugging', () => {
      expect(ClassCard.displayName).toBe('ClassCard');
    });
  });
});
