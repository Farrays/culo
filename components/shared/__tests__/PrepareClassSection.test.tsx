import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PrepareClassSection, { type PrepareConfig } from '../PrepareClassSection';

// Mock useI18n
vi.mock('../../../hooks/useI18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        prepareTitle: 'Prepárate para tu clase',
        prepareSubtitle: 'Todo lo que necesitas saber',
        testPrepareWhatToBring: '¿Qué traer?',
        testPrepareBefore: 'Antes de llegar',
        testPrepareAvoid: 'Evita',
        testPrepareItem1: 'Ropa cómoda',
        testPrepareItem2: 'Zapatillas limpias',
        testPrepareItem3: 'Botella de agua',
        testPrepareBeforeItem1: 'Come ligero',
        testPrepareBeforeItem2: 'Llega 10 minutos antes',
        testPrepareAvoidItem1: 'Ropa ajustada',
        testPrepareAvoidItem2: 'Perfume fuerte',
        testPrepareTeacherTip: 'Consejo del profesor',
        testPrepareTeacherQuote: 'La práctica hace al maestro',
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

// Mock icons
vi.mock('../../../lib/icons', () => ({
  CheckIcon: ({ className }: { className?: string }) => (
    <svg data-testid="check-icon" className={className} />
  ),
  ClockIcon: ({ className }: { className?: string }) => (
    <svg data-testid="clock-icon" className={className} />
  ),
}));

describe('PrepareClassSection', () => {
  const mockConfig: PrepareConfig = {
    prefix: 'testPrepare',
    whatToBringCount: 3,
    beforeCount: 2,
    avoidCount: 2,
    teacher: {
      name: 'María García',
      credential: 'Profesora certificada',
    },
  };

  const defaultProps = {
    titleKey: 'prepareTitle',
    subtitleKey: 'prepareSubtitle',
    config: mockConfig,
  };

  it('renders section with default id', () => {
    const { container } = render(<PrepareClassSection {...defaultProps} />);
    const section = container.querySelector('#prepare');
    expect(section).toBeInTheDocument();
  });

  it('renders section with custom id', () => {
    const { container } = render(<PrepareClassSection {...defaultProps} id="custom-prepare" />);
    const section = container.querySelector('#custom-prepare');
    expect(section).toBeInTheDocument();
  });

  it('renders section title', () => {
    render(<PrepareClassSection {...defaultProps} />);
    expect(screen.getByText('Prepárate para tu clase')).toBeInTheDocument();
  });

  it('renders section subtitle', () => {
    render(<PrepareClassSection {...defaultProps} />);
    expect(screen.getByText('Todo lo que necesitas saber')).toBeInTheDocument();
  });

  it('renders what to bring card header', () => {
    render(<PrepareClassSection {...defaultProps} />);
    expect(screen.getByText('¿Qué traer?')).toBeInTheDocument();
  });

  it('renders before arriving card header', () => {
    render(<PrepareClassSection {...defaultProps} />);
    expect(screen.getByText('Antes de llegar')).toBeInTheDocument();
  });

  it('renders avoid card header', () => {
    render(<PrepareClassSection {...defaultProps} />);
    expect(screen.getByText('Evita')).toBeInTheDocument();
  });

  it('renders correct number of what to bring items', () => {
    render(<PrepareClassSection {...defaultProps} />);
    expect(screen.getByText('Ropa cómoda')).toBeInTheDocument();
    expect(screen.getByText('Zapatillas limpias')).toBeInTheDocument();
    expect(screen.getByText('Botella de agua')).toBeInTheDocument();
  });

  it('renders correct number of before items', () => {
    render(<PrepareClassSection {...defaultProps} />);
    expect(screen.getByText('Come ligero')).toBeInTheDocument();
    expect(screen.getByText('Llega 10 minutos antes')).toBeInTheDocument();
  });

  it('renders correct number of avoid items', () => {
    render(<PrepareClassSection {...defaultProps} />);
    expect(screen.getByText('Ropa ajustada')).toBeInTheDocument();
    expect(screen.getByText('Perfume fuerte')).toBeInTheDocument();
  });

  it('renders teacher quote section', () => {
    render(<PrepareClassSection {...defaultProps} />);
    expect(screen.getByText('Consejo del profesor')).toBeInTheDocument();
    expect(screen.getByText('La práctica hace al maestro')).toBeInTheDocument();
  });

  it('renders teacher name and credential', () => {
    render(<PrepareClassSection {...defaultProps} />);
    expect(screen.getByText(/María García/)).toBeInTheDocument();
    expect(screen.getByText(/Profesora certificada/)).toBeInTheDocument();
  });

  it('renders teacher initials when no image provided', () => {
    render(<PrepareClassSection {...defaultProps} />);
    expect(screen.getByText('MG')).toBeInTheDocument();
  });

  it('renders teacher image when provided', () => {
    const configWithImage: PrepareConfig = {
      ...mockConfig,
      teacher: {
        ...mockConfig.teacher,
        image: '/images/teacher.jpg',
      },
    };

    render(<PrepareClassSection {...defaultProps} config={configWithImage} />);
    const img = screen.getByAltText('Foto de María García');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/images/teacher.jpg');
  });

  it('applies custom className', () => {
    const { container } = render(
      <PrepareClassSection {...defaultProps} className="custom-class" />
    );
    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-class');
  });

  it('renders check icons for what to bring items', () => {
    render(<PrepareClassSection {...defaultProps} />);
    const checkIcons = screen.getAllByTestId('check-icon');
    expect(checkIcons.length).toBe(mockConfig.whatToBringCount);
  });

  it('renders clock icon for before section', () => {
    render(<PrepareClassSection {...defaultProps} />);
    const clockIcon = screen.getByTestId('clock-icon');
    expect(clockIcon).toBeInTheDocument();
  });
});
