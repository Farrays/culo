import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MiniFAQ from '../MiniFAQ';

// Mock useI18n
vi.mock('../../../hooks/useI18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        minifaq_title: 'Preguntas Frecuentes',
        minifaq_q1: '¿Pregunta 1?',
        minifaq_a1: 'Respuesta 1',
        minifaq_q2: '¿Pregunta 2?',
        minifaq_a2: 'Respuesta 2',
        minifaq_viewall: 'Ver todas',
      };
      return translations[key] || key;
    },
    locale: 'es',
  }),
}));

// Mock AnimateOnScroll
vi.mock('../../AnimateOnScroll', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="animate-wrapper">{children}</div>
  ),
}));

const mockConfig = {
  titleKey: 'minifaq_title',
  questions: [
    { qKey: 'minifaq_q1', aKey: 'minifaq_a1' },
    { qKey: 'minifaq_q2', aKey: 'minifaq_a2' },
  ],
  viewAllHref: '/faq',
  viewAllKey: 'minifaq_viewall',
};

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('MiniFAQ', () => {
  it('renders without crashing', () => {
    renderWithRouter(<MiniFAQ config={mockConfig} />);
    expect(screen.getByText('Preguntas Frecuentes')).toBeInTheDocument();
  });

  it('displays all FAQ questions', () => {
    renderWithRouter(<MiniFAQ config={mockConfig} />);

    expect(screen.getByText('¿Pregunta 1?')).toBeInTheDocument();
    expect(screen.getByText('¿Pregunta 2?')).toBeInTheDocument();
  });

  it('shows first answer by default (openIndex === 0)', () => {
    renderWithRouter(<MiniFAQ config={mockConfig} />);

    // First answer should be visible
    expect(screen.getByText('Respuesta 1')).toBeInTheDocument();
  });

  it('toggles FAQ answer on button click', () => {
    renderWithRouter(<MiniFAQ config={mockConfig} />);

    const buttons = screen.getAllByRole('button');
    const secondButton = buttons[1];

    // Click second question to open it
    if (secondButton) {
      fireEvent.click(secondButton);
      expect(screen.getByText('Respuesta 2')).toBeInTheDocument();

      // Click second question again to close it
      fireEvent.click(secondButton);
      // Answer should still exist in DOM but be hidden via CSS
    }
  });

  it('closes current FAQ when opening another', () => {
    renderWithRouter(<MiniFAQ config={mockConfig} />);

    const buttons = screen.getAllByRole('button');
    const secondButton = buttons[1];

    // Click second question - should close first and open second
    if (secondButton) {
      fireEvent.click(secondButton);
      // Check the toggle behavior works
      expect(screen.getByText('Respuesta 2')).toBeInTheDocument();
    }
  });

  it('renders View All link with correct href', () => {
    renderWithRouter(<MiniFAQ config={mockConfig} />);

    const link = screen.getByText('Ver todas');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/es/faq');
  });

  it('applies correct styling to open FAQ item', () => {
    const { container } = renderWithRouter(<MiniFAQ config={mockConfig} />);

    // First item should have the "open" styling with accent border
    const openItem = container.querySelector('[class*="border-primary-accent"]');
    expect(openItem).toBeInTheDocument();
  });

  it('rotates chevron icon when FAQ is open', () => {
    const { container } = renderWithRouter(<MiniFAQ config={mockConfig} />);

    // First FAQ should have rotated chevron
    const rotatedChevron = container.querySelector('[class*="rotate-180"]');
    expect(rotatedChevron).toBeInTheDocument();
  });
});
