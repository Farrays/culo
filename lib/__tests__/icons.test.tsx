import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  GlobeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  StarIcon,
  ClockIcon,
  CheckIcon,
  CheckCircleIcon,
  MenuIcon,
  XMarkIcon,
  KeyIcon,
  CameraIcon,
  SparklesIcon,
  UserIcon,
  PlayCircleIcon,
  BuildingOfficeIcon,
  HeartIcon,
  HeartFilledIcon,
  CalendarDaysIcon,
  ShoppingBagIcon,
  InstagramIcon,
  PlayIcon,
  FlameIcon,
} from '../icons';

describe('Icons', () => {
  it('renders GlobeIcon', () => {
    const { container } = render(<GlobeIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders ChevronDownIcon', () => {
    const { container } = render(<ChevronDownIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders ChevronUpIcon', () => {
    const { container } = render(<ChevronUpIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders ChevronRightIcon', () => {
    const { container } = render(<ChevronRightIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders ChevronLeftIcon', () => {
    const { container } = render(<ChevronLeftIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders StarIcon', () => {
    const { container } = render(<StarIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders ClockIcon', () => {
    const { container } = render(<ClockIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders CheckIcon', () => {
    const { container } = render(<CheckIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders CheckCircleIcon', () => {
    const { container } = render(<CheckCircleIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders MenuIcon', () => {
    const { container } = render(<MenuIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders XMarkIcon', () => {
    const { container } = render(<XMarkIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders KeyIcon', () => {
    const { container } = render(<KeyIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders CameraIcon', () => {
    const { container } = render(<CameraIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders SparklesIcon', () => {
    const { container } = render(<SparklesIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders UserIcon', () => {
    const { container } = render(<UserIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders PlayCircleIcon', () => {
    const { container } = render(<PlayCircleIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders BuildingOfficeIcon', () => {
    const { container } = render(<BuildingOfficeIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders HeartIcon', () => {
    const { container } = render(<HeartIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders HeartFilledIcon', () => {
    const { container } = render(<HeartFilledIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders CalendarDaysIcon', () => {
    const { container } = render(<CalendarDaysIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders ShoppingBagIcon', () => {
    const { container } = render(<ShoppingBagIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders InstagramIcon', () => {
    const { container } = render(<InstagramIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders PlayIcon', () => {
    const { container } = render(<PlayIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders FlameIcon', () => {
    const { container } = render(<FlameIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('icons accept className prop', () => {
    const { container } = render(<GlobeIcon className="test-class" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('test-class');
  });
});
