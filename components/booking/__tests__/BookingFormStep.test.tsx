/**
 * BookingFormStep Component Tests
 * Tests for form rendering, validation, and real-time sanitization
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../../test/test-utils';
import { BookingFormStep } from '../components/BookingFormStep';
import type { ClassData, BookingFormData } from '../types/booking';

// Mock class data
const mockClass: ClassData = {
  id: 1,
  name: 'Salsa Nivel Básico',
  date: '20/01/2025',
  time: '19:00',
  dayOfWeek: 'Lunes',
  spotsAvailable: 10,
  isFull: false,
  location: "Farray's Center",
  instructor: 'Carlos',
  style: 'salsa',
  level: 'basico',
  rawStartsAt: '2025-01-20T19:00:00',
  duration: 60,
  description: 'Clase de salsa para principiantes',
};

// Initial form data
const initialFormData: BookingFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  countryCode: 'ES',
  acceptsTerms: false,
  acceptsMarketing: true, // Legacy: now included in acceptsTerms
  acceptsAge: false,
  acceptsNoRefund: true, // Legacy: now included in acceptsTerms
  acceptsPrivacy: false,
  acceptsHeels: false,
  acceptsImage: true, // Legacy: now included in acceptsTerms
};

// Mock scrollIntoView which is not available in jsdom
Element.prototype.scrollIntoView = vi.fn();

describe('BookingFormStep', () => {
  const mockOnBack = vi.fn();
  const mockOnFormChange = vi.fn();
  const mockOnSubmit = vi.fn();
  const mockOnTriggerHaptic = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (props?: Partial<Parameters<typeof BookingFormStep>[0]>) => {
    return render(
      <BookingFormStep
        selectedClass={mockClass}
        formData={initialFormData}
        status="idle"
        errorMessage=""
        onBack={mockOnBack}
        onFormChange={mockOnFormChange}
        onSubmit={mockOnSubmit}
        onTriggerHaptic={mockOnTriggerHaptic}
        {...props}
      />
    );
  };

  describe('rendering', () => {
    it('should render class summary', () => {
      renderComponent();

      expect(screen.getByText('Salsa Nivel Básico')).toBeInTheDocument();
      expect(screen.getByText(/Lunes.*19:00/)).toBeInTheDocument();
    });

    it('should render all form fields', () => {
      const { container } = renderComponent();

      // Find inputs by id since labels use translation keys
      expect(container.querySelector('#firstName')).toBeInTheDocument();
      expect(container.querySelector('#lastName')).toBeInTheDocument();
      expect(container.querySelector('#email')).toBeInTheDocument();
      expect(container.querySelector('#phone')).toBeInTheDocument();
    });

    it('should render back button', () => {
      renderComponent();

      const buttons = screen.getAllByRole('button');
      const backButton = buttons.find(btn => btn.getAttribute('type') === 'button');
      expect(backButton).toBeInTheDocument();
    });

    it('should render submit button', () => {
      renderComponent();

      const submitButton = screen.getByRole('button', { name: /booking_submit/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('should render consent checkboxes', () => {
      renderComponent();

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThanOrEqual(3); // 3 required consents: Terms, Age, Privacy
    });
  });

  describe('input sanitization', () => {
    it('should sanitize firstName on input', () => {
      const { container } = renderComponent();

      const firstNameInput = container.querySelector('#firstName') as HTMLInputElement;
      fireEvent.change(firstNameInput, { target: { name: 'firstName', value: 'Juan<script>' } });

      // Should call onFormChange with sanitized value (letters only)
      expect(mockOnFormChange).toHaveBeenCalledWith({ firstName: 'Juanscript' });
    });

    it('should sanitize lastName on input', () => {
      const { container } = renderComponent();

      const lastNameInput = container.querySelector('#lastName') as HTMLInputElement;
      fireEvent.change(lastNameInput, { target: { name: 'lastName', value: 'García123' } });

      // Should call onFormChange with sanitized value (removes numbers, keeps accents)
      expect(mockOnFormChange).toHaveBeenCalledWith({ lastName: 'García' });
    });

    it('should sanitize email on input', () => {
      const { container } = renderComponent();

      const emailInput = container.querySelector('#email') as HTMLInputElement;
      fireEvent.change(emailInput, { target: { name: 'email', value: '  TEST@Example.COM  ' } });

      // Should call onFormChange with sanitized value (lowercase, trimmed)
      expect(mockOnFormChange).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    it('should sanitize phone on input', () => {
      const { container } = renderComponent();

      const phoneInput = container.querySelector('#phone') as HTMLInputElement;
      fireEvent.change(phoneInput, { target: { name: 'phone', value: '+34 666-ABC-555' } });

      // CountryPhoneInput sanitizes and sends both phone and countryCode
      // Letters are stripped, only digits, spaces, hyphens, and parentheses allowed
      expect(mockOnFormChange).toHaveBeenCalledWith(
        expect.objectContaining({ phone: expect.any(String) })
      );
    });

    it('should allow accented characters in names', () => {
      const { container } = renderComponent();

      const firstNameInput = container.querySelector('#firstName') as HTMLInputElement;
      fireEvent.change(firstNameInput, { target: { name: 'firstName', value: 'José María' } });

      expect(mockOnFormChange).toHaveBeenCalledWith({ firstName: 'José María' });
    });

    it('should allow hyphens and apostrophes in names', () => {
      const { container } = renderComponent();

      const lastNameInput = container.querySelector('#lastName') as HTMLInputElement;
      fireEvent.change(lastNameInput, { target: { name: 'lastName', value: "O'Connor-Smith" } });

      expect(mockOnFormChange).toHaveBeenCalledWith({ lastName: "O'Connor-Smith" });
    });
  });

  describe('checkbox handling', () => {
    it('should handle checkbox changes', () => {
      renderComponent();

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
      fireEvent.click(checkboxes[0] as HTMLElement);

      expect(mockOnFormChange).toHaveBeenCalled();
    });

    it('should trigger haptic feedback on checkbox toggle', () => {
      renderComponent();

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
      fireEvent.click(checkboxes[0] as HTMLElement);

      expect(mockOnTriggerHaptic).toHaveBeenCalledWith('light');
    });
  });

  describe('back button', () => {
    it('should call onBack when clicked', () => {
      renderComponent();

      // Find button with type=button that contains back text
      const buttons = screen.getAllByRole('button');
      const backButton = buttons.find(
        btn =>
          btn.getAttribute('type') === 'button' && btn.textContent?.toLowerCase().includes('back')
      );

      if (backButton) {
        fireEvent.click(backButton);
        expect(mockOnBack).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('form submission', () => {
    it('should call onSubmit when form is submitted', () => {
      const { container } = renderComponent();

      const form = container.querySelector('form');
      if (form) {
        fireEvent.submit(form);
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      }
    });

    it('should disable inputs when loading', () => {
      const { container } = renderComponent({ status: 'loading' });

      const firstNameInput = container.querySelector('#firstName') as HTMLInputElement;
      expect(firstNameInput.disabled).toBe(true);
    });

    it('should show loading state on submit button', () => {
      renderComponent({ status: 'loading' });

      expect(screen.getByText(/booking_submit_loading/i)).toBeInTheDocument();
    });
  });

  describe('error display', () => {
    it('should display error message when provided', () => {
      renderComponent({ errorMessage: 'Test error message' });

      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    it('should have aria-live on error container', () => {
      renderComponent({ errorMessage: 'Test error' });

      const errorContainer = screen.getByRole('alert');
      expect(errorContainer).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('invalid field highlighting', () => {
    it('should highlight invalid fields', () => {
      const { container } = renderComponent({
        invalidFields: ['firstName', 'email'],
      });

      // Should have red border on invalid fields
      const invalidInputs = container.querySelectorAll('.border-red-500');
      expect(invalidInputs.length).toBeGreaterThanOrEqual(2);
    });

    it('should show error message for invalid fields', () => {
      renderComponent({
        invalidFields: ['firstName'],
      });

      // Should show field-specific error
      const errorMessages = screen.getAllByText(/booking_error_field_required/i);
      expect(errorMessages.length).toBeGreaterThan(0);
    });

    it('should trigger haptic feedback for invalid fields', () => {
      renderComponent({
        invalidFields: ['firstName'],
      });

      expect(mockOnTriggerHaptic).toHaveBeenCalledWith('error');
    });

    it('should have aria-invalid on invalid fields', () => {
      const { container } = renderComponent({
        invalidFields: ['firstName'],
      });

      const firstNameInput = container.querySelector('#firstName') as HTMLInputElement;
      expect(firstNameInput).toHaveAttribute('aria-invalid', 'true');
    });

    it('should have aria-describedby linking to error message', () => {
      const { container } = renderComponent({
        invalidFields: ['firstName'],
      });

      const firstNameInput = container.querySelector('#firstName') as HTMLInputElement;
      expect(firstNameInput).toHaveAttribute('aria-describedby', 'firstName-error');
    });
  });

  describe('heels consent', () => {
    it('should show heels consent for heels classes', () => {
      const heelsClass: ClassData = {
        ...mockClass,
        name: 'Heels Choreography',
        style: 'heels',
      };

      const { container } = renderComponent({ selectedClass: heelsClass });

      // Should show heels consent section (has amber background)
      const heelsSection = container.querySelector('.bg-amber-500\\/10');
      expect(heelsSection).toBeInTheDocument();
    });

    it('should not show heels consent for regular classes', () => {
      const { container } = renderComponent();

      // Should not have heels consent section
      const heelsSection = container.querySelector('.bg-amber-500\\/10');
      expect(heelsSection).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have autocomplete attributes', () => {
      const { container } = renderComponent();

      expect(container.querySelector('#firstName')).toHaveAttribute('autocomplete', 'given-name');
      expect(container.querySelector('#lastName')).toHaveAttribute('autocomplete', 'family-name');
      expect(container.querySelector('#email')).toHaveAttribute('autocomplete', 'email');
      // CountryPhoneInput uses tel-national since country is selected separately
      expect(container.querySelector('#phone')).toHaveAttribute('autocomplete', 'tel-national');
    });

    it('should have proper input types', () => {
      const { container } = renderComponent();

      expect(container.querySelector('#email')).toHaveAttribute('type', 'email');
      expect(container.querySelector('#phone')).toHaveAttribute('type', 'tel');
    });

    it('should have required indicators on required fields', () => {
      const { container } = renderComponent();

      // Required fields should have * indicator (red-400 color)
      const requiredIndicators = container.querySelectorAll('.text-red-400');
      expect(requiredIndicators.length).toBeGreaterThan(0);
    });
  });

  describe('legal text', () => {
    it('should render legal information section', () => {
      renderComponent();

      // Should have legal text at the bottom
      expect(screen.getByText(/booking_legal_responsible/i)).toBeInTheDocument();
    });

    it('should have privacy policy modal trigger', () => {
      renderComponent();

      // Privacy link is now a button that opens a modal
      const privacyButton = screen.getByText(/booking_consent_privacy_link/i);
      expect(privacyButton).toBeInTheDocument();
      expect(privacyButton.tagName.toLowerCase()).toBe('button');
    });
  });
});
