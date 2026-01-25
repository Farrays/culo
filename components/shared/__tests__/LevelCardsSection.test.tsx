import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../test/test-utils';
import LevelCardsSection, { type LevelConfig } from '../LevelCardsSection';

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

    expect(screen.getByText('testLevelsTitle')).toBeInTheDocument();
  });

  it('renders all level cards', () => {
    render(<LevelCardsSection titleKey="testLevelsTitle" levels={threeLevels} />);

    expect(screen.getByText('testBeginnerTitle')).toBeInTheDocument();
    expect(screen.getByText('testIntermediateTitle')).toBeInTheDocument();
    expect(screen.getByText('testAdvancedTitle')).toBeInTheDocument();
  });

  it('renders level descriptions', () => {
    render(<LevelCardsSection titleKey="testLevelsTitle" levels={twoLevels} />);

    expect(screen.getByText('testBeginnerDesc')).toBeInTheDocument();
    expect(screen.getByText('testIntermediateDesc')).toBeInTheDocument();
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
