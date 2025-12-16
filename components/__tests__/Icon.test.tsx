import { describe, it, expect } from 'vitest';
import { render } from '../../test/test-utils';
import Icon, { IconName } from '../Icon';

describe('Icon', () => {
  it('should render an SVG element', () => {
    const { container } = render(<Icon name="globe" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should have correct xmlns attribute', () => {
    const { container } = render(<Icon name="globe" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
  });

  it('should reference sprite with correct icon name', () => {
    const { container } = render(<Icon name="globe" />);
    const use = container.querySelector('use');
    expect(use).toBeInTheDocument();
    expect(use).toHaveAttribute('href', '/icons/sprite.svg#icon-globe');
  });

  it('should apply className prop', () => {
    const { container } = render(<Icon name="star" className="h-6 w-6 text-primary" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('h-6', 'w-6', 'text-primary');
  });

  it('should pass through additional SVG props', () => {
    const { container } = render(
      <Icon name="heart" aria-hidden="true" data-testid="heart-icon" fill="currentColor" />
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('data-testid', 'heart-icon');
    expect(svg).toHaveAttribute('fill', 'currentColor');
  });

  it('should render different icon names correctly', () => {
    const iconNames: IconName[] = [
      'globe',
      'sparkles',
      'building',
      'star',
      'trophy',
      'academic-cap',
      'chart-bar',
      'map-pin',
      'clock',
      'badge-check',
      'heart',
      'users',
      'calendar',
      'gift',
      'cake',
    ];

    iconNames.forEach(name => {
      const { container } = render(<Icon name={name} />);
      const use = container.querySelector('use');
      expect(use).toHaveAttribute('href', `/icons/sprite.svg#icon-${name}`);
    });
  });

  it('should support style prop', () => {
    const { container } = render(<Icon name="clock" style={{ width: '24px', height: '24px' }} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveStyle({ width: '24px', height: '24px' });
  });

  it('should support viewBox prop', () => {
    const { container } = render(<Icon name="users" viewBox="0 0 24 24" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('should be accessible with role attribute', () => {
    const { container } = render(<Icon name="calendar" role="img" aria-label="Calendar" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).toHaveAttribute('aria-label', 'Calendar');
  });

  it('should support onClick handler', () => {
    let clicked = false;
    const handleClick = () => {
      clicked = true;
    };

    const { container } = render(<Icon name="gift" onClick={handleClick} />);
    const svg = container.querySelector('svg');
    svg?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(clicked).toBe(true);
  });
});
