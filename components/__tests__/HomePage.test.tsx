import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import HomePage from '../HomePage';

describe('HomePage', () => {
  it('should render hero section', () => {
    render(<HomePage />);
    const hero = screen.getByLabelText(/hero section/i);
    expect(hero).toBeInTheDocument();
  });

  it('should render main heading', () => {
    render(<HomePage />);
    const heading = screen.getAllByRole('heading')[0];
    expect(heading).toBeInTheDocument();
  });

  it('should have CTA buttons', () => {
    render(<HomePage />);
    const buttons = screen.getAllByRole('link');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should render navigation links', () => {
    render(<HomePage />);
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('href');
    });
  });
});
