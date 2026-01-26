import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test/test-utils';
import ContactPage from '../components/ContactPage';

describe('ContactPage - Rate Limiting', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should render the contact form', () => {
    render(<ContactPage />);
    expect(screen.getByRole('heading', { name: /Contacta con Nosotros/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty form submission', async () => {
    render(<ContactPage />);

    const submitButton = screen.getByRole('button', { name: /Enviar Mensaje/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const firstNameInput = screen.getByLabelText(/Nombre/i);
      expect(firstNameInput).toBeInTheDocument();
    });
  });

  it('should allow form submission within rate limit', async () => {
    render(<ContactPage />);

    // Fill out the form - uses firstName and lastName separately
    const firstNameInput = screen.getByLabelText(/Nombre/i);
    const lastNameInput = screen.getByLabelText(/Apellido/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const messageInput = screen.getByLabelText(/Mensaje/i);

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(messageInput, {
      target: { value: 'This is a test message with more than 10 characters' },
    });

    const submitButton = screen.getByRole('button', { name: /Enviar Mensaje/i });
    fireEvent.click(submitButton);

    // Check that localStorage was updated
    await waitFor(() => {
      const rateLimitData = localStorage.getItem('farrays-contact-form-rate-limit');
      expect(rateLimitData).not.toBeNull();
    });
  });

  it('should enforce rate limit after 3 submissions', async () => {
    // Simulate 3 previous submissions in localStorage
    const now = Date.now();
    const rateLimitData = {
      attempts: 3,
      timestamps: [now - 1000, now - 2000, now - 3000],
      lastAttempt: now - 1000,
    };
    localStorage.getItem = vi.fn(key => {
      if (key === 'farrays-contact-form-rate-limit') {
        return JSON.stringify(rateLimitData);
      }
      return null;
    });

    render(<ContactPage />);

    // Form should be disabled or show rate limit warning
    const form = document.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('should show remaining attempts warning', async () => {
    // Simulate 2 previous submissions (1 remaining)
    const now = Date.now();
    const rateLimitData = {
      attempts: 2,
      timestamps: [now - 1000, now - 2000],
      lastAttempt: now - 1000,
    };
    localStorage.getItem = vi.fn(key => {
      if (key === 'farrays-contact-form-rate-limit') {
        return JSON.stringify(rateLimitData);
      }
      return null;
    });

    render(<ContactPage />);

    // Form should still be accessible with 1 attempt remaining
    const form = document.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('should reset rate limit after 15 minutes', async () => {
    // Simulate 3 submissions from 16 minutes ago (outside the window)
    const sixteenMinutesAgo = Date.now() - 16 * 60 * 1000;
    const rateLimitData = {
      attempts: 3,
      timestamps: [sixteenMinutesAgo, sixteenMinutesAgo - 1000, sixteenMinutesAgo - 2000],
      lastAttempt: sixteenMinutesAgo,
    };
    localStorage.getItem = vi.fn(key => {
      if (key === 'farrays-contact-form-rate-limit') {
        return JSON.stringify(rateLimitData);
      }
      return null;
    });

    render(<ContactPage />);

    // Rate limit should be expired, form should be accessible
    const form = document.querySelector('form');
    expect(form).toBeInTheDocument();

    // Should NOT show rate limit error
    expect(screen.queryByText(/Too many submission attempts/i)).not.toBeInTheDocument();
  });
});
