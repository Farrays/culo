import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LevelCardsSection, { type LevelConfig } from '../LevelCardsSection';

// Mock useI18n
vi.mock('../../../hooks/useI18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        testLevelsTitle: 'Nuestros Niveles',
        testBeginnerTitle: 'Nivel Principiante',
        testBeginnerDesc: 'Para quienes empiezan desde cero',
        testIntermediateTitle: 'Nivel Intermedio',
        testIntermediateDesc: 'Para quienes ya tienen experiencia',
        testAdvancedTitle: 'Nivel Avanzado',
        testAdvancedDesc: 'Para bailarines experimentados',
      };
      return translations[key] || key;
    },
    locale: 'es',
    isLoading: false,
    setLocale: vi.fn(),
  }),
}));

// Mock AnimateOnScroll
vi.mock('../../AnimateOnScroll', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('LevelCardsSection', () => {
  const twoLevels: LevelConfig[] = [
    {
      id: 'beginner',
      levelKey: 'beginnerLevel',
      titleKey: 'testBeginnerTitle',
      descKey: 'testBeginnerDesc',
      duration: '0-3 meses',
      color: 'primary-dark',
    },
    {
      id: 'intermediate',
      levelKey: 'intermediateLevel',
      titleKey: 'testIntermediateTitle',
      descKey: 'testIntermediateDesc',
      duration: '3-9 meses',
      color: 'primary-accent',
    },
  ];

  const threeLevels: LevelConfig[] = [
    ...twoLevels,
    {
      id: 'advanced',
      levelKey: 'advancedLevel',
      titleKey: 'testAdvancedTitle',
      descKey: 'testAdvancedDesc',
      duration: '+9 meses',
      color: 'primary-accent',
    },
  ];

  it('renders section title', () => {
    render(<LevelCardsSection titleKey="testLevelsTitle" levels={twoLevels} />);

    expect(screen.getByText('Nuestros Niveles')).toBeInTheDocument();
  });

  it('renders all level cards', () => {
    render(<LevelCardsSection titleKey="testLevelsTitle" levels={threeLevels} />);

    expect(screen.getByText('Nivel Principiante')).toBeInTheDocument();
    expect(screen.getByText('Nivel Intermedio')).toBeInTheDocument();
    expect(screen.getByText('Nivel Avanzado')).toBeInTheDocument();
  });

  it('renders level descriptions', () => {
    render(<LevelCardsSection titleKey="testLevelsTitle" levels={twoLevels} />);

    expect(screen.getByText('Para quienes empiezan desde cero')).toBeInTheDocument();
    expect(screen.getByText('Para quienes ya tienen experiencia')).toBeInTheDocument();
  });

  it('renders duration for each level', () => {
    render(<LevelCardsSection titleKey="testLevelsTitle" levels={threeLevels} />);

    expect(screen.getByText('0-3 meses')).toBeInTheDocument();
    expect(screen.getByText('3-9 meses')).toBeInTheDocument();
    expect(screen.getByText('+9 meses')).toBeInTheDocument();
  });

  it('renders level badges', () => {
    render(<LevelCardsSection titleKey="testLevelsTitle" levels={threeLevels} />);

    expect(screen.getByText('PRINCIPIANTE')).toBeInTheDocument();
    expect(screen.getByText('INTERMEDIO')).toBeInTheDocument();
    expect(screen.getByText('AVANZADO')).toBeInTheDocument();
  });

  it('applies custom id', () => {
    const { container } = render(
      <LevelCardsSection id="custom-levels" titleKey="testLevelsTitle" levels={twoLevels} />
    );

    const section = container.querySelector('#custom-levels');
    expect(section).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <LevelCardsSection titleKey="testLevelsTitle" levels={twoLevels} className="custom-class" />
    );

    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-class');
  });

  it('handles basic level badge', () => {
    const basicLevels: LevelConfig[] = [
      {
        id: 'basic',
        levelKey: 'basicLevel',
        titleKey: 'testBeginnerTitle',
        descKey: 'testBeginnerDesc',
        duration: '0-3 meses',
        color: 'primary-dark',
      },
    ];

    render(<LevelCardsSection titleKey="testLevelsTitle" levels={basicLevels} />);

    expect(screen.getByText('BÁSICO')).toBeInTheDocument();
  });

  it('handles unknown level key', () => {
    const unknownLevels: LevelConfig[] = [
      {
        id: 'unknown',
        levelKey: 'customLevel',
        titleKey: 'testBeginnerTitle',
        descKey: 'testBeginnerDesc',
        duration: '0-3 meses',
        color: 'primary-dark',
      },
    ];

    render(<LevelCardsSection titleKey="testLevelsTitle" levels={unknownLevels} />);

    expect(screen.getByText('CUSTOMLEVEL')).toBeInTheDocument();
  });
});
