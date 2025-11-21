import { describe, it, expect } from 'vitest';
import { render } from '../../test/test-utils';
import SEO from '../SEO';

describe('SEO Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<SEO />);
    expect(container).toBeTruthy();
  });

  it('is wrapped by Helmet provider', () => {
    const { container } = render(<SEO />);
    // Helmet doesn't render visible content, just updates head
    expect(container.firstChild).toBeNull();
  });
});
