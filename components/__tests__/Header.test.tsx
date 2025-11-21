import { describe, it, expect } from 'vitest';
import { render } from '../../test/test-utils';
import Header from '../Header';

describe('Header', () => {
  it('renders without crashing', () => {
    const { container } = render(<Header />);
    expect(container).toBeTruthy();
  });

  it('contains navigation', () => {
    const { container } = render(<Header />);
    const header = container.querySelector('header');
    expect(header).toBeTruthy();
  });

  it('has a logo link', () => {
    const { container } = render(<Header />);
    const logoLink = container.querySelector('a[aria-label="FIDC Home"]');
    expect(logoLink).toBeTruthy();
  });
});
