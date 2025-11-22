import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnimateOnScroll from '../AnimateOnScroll';

describe('AnimateOnScroll', () => {
  it('should render children content', () => {
    render(
      <AnimateOnScroll>
        <div data-testid="test-child">Test Content</div>
      </AnimateOnScroll>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should apply animation class', () => {
    const { container } = render(
      <AnimateOnScroll>
        <div>Content</div>
      </AnimateOnScroll>
    );

    const wrapper = container.querySelector('[class*="opacity-0"]');
    expect(wrapper).toBeInTheDocument();
  });

  it('should support custom delay', () => {
    render(
      <AnimateOnScroll delay={500}>
        <div>Content</div>
      </AnimateOnScroll>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
