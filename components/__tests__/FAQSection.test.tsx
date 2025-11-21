import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import FAQSection from '../FAQSection';

const mockFAQs = [
  {
    id: 'faq-1',
    question: 'What is the test question?',
    answer: 'This is the test answer.',
  },
  {
    id: 'faq-2',
    question: 'Another test question?',
    answer: 'Another test answer.',
  },
];

describe('FAQSection', () => {
  it('should render FAQ section title', () => {
    render(<FAQSection faqs={mockFAQs} title="Test FAQs" pageUrl="https://test.com" />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('should render all FAQ questions', () => {
    render(<FAQSection faqs={mockFAQs} title="Test FAQs" pageUrl="https://test.com" />);
    expect(screen.getByText('What is the test question?')).toBeInTheDocument();
    expect(screen.getByText('Another test question?')).toBeInTheDocument();
  });

  it('should toggle answer visibility on click', async () => {
    const user = userEvent.setup();
    render(<FAQSection faqs={mockFAQs} title="Test FAQs" pageUrl="https://test.com" />);

    const firstQuestion = screen.getByText('What is the test question?');
    const button = firstQuestion.closest('button');

    if (button) {
      await user.click(button);
      expect(screen.getByText('This is the test answer.')).toBeVisible();
    }
  });

  it('should have proper ARIA attributes', () => {
    render(<FAQSection faqs={mockFAQs} title="Test FAQs" pageUrl="https://test.com" />);
    const buttons = screen.getAllByRole('button');

    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-expanded');
    });
  });
});
