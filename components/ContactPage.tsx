import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';
import Breadcrumb from './shared/Breadcrumb';
import AnimateOnScroll from './AnimateOnScroll';
import Icon from './Icon';
import { CheckIcon } from '../lib/icons';
import {
  trackEvent,
  trackLeadConversion,
  LEAD_VALUES,
  pushToDataLayer,
  getMetaCookies,
} from '../utils/analytics';

// ============================================================================
// CONSTANTS
// ============================================================================

// Rate limiting constants (client-side)
const RATE_LIMIT_KEY = 'farrays-contact-form-rate-limit';
const MAX_ATTEMPTS = 3;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// API endpoint (en Vercel - el token esta seguro en el servidor)
const CONTACT_API_URL = '/api/contact';

// Opciones de "¿Cómo nos conociste?"
const DISCOVERY_OPTIONS = [
  { value: '', labelKey: 'contact_discovery_placeholder' },
  { value: 'Google', labelKey: 'contact_discovery_google' },
  { value: 'Instagram', labelKey: 'contact_discovery_instagram' },
  { value: 'Facebook', labelKey: 'contact_discovery_facebook' },
  { value: 'Pasando por delante', labelKey: 'contact_discovery_passingby' },
  { value: 'Recomendacion', labelKey: 'contact_discovery_friend' },
  { value: 'Evento', labelKey: 'contact_discovery_event' },
  { value: 'Otro', labelKey: 'contact_discovery_other' },
];

// Opciones de asunto
const SUBJECT_OPTIONS = [
  { value: 'general', labelKey: 'contact_form_subject_general' },
  { value: 'classes', labelKey: 'contact_form_subject_classes' },
  { value: 'schedule', labelKey: 'contact_form_subject_schedule' },
  { value: 'private', labelKey: 'contact_form_subject_private' },
  { value: 'events', labelKey: 'contact_form_subject_events' },
  { value: 'other', labelKey: 'contact_form_subject_other' },
];

// ============================================================================
// TYPES
// ============================================================================

interface RateLimitData {
  attempts: number;
  timestamps: number[];
  lastAttempt: number;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  comoconoce: string;
  subject: string;
  message: string;
  acceptsPrivacy: boolean;
}

type FormStatus = 'idle' | 'sending' | 'success' | 'error' | 'rate_limited';

// ============================================================================
// COMPONENT
// ============================================================================

const ContactPage: React.FC = () => {
  const { t, i18n } = useTranslation([
    'common',
    'booking',
    'schedule',
    'calendar',
    'home',
    'classes',
    'blog',
    'faq',
    'about',
    'contact',
    'pages',
  ]);
  const locale = i18n.language;
  const baseUrl = 'https://www.farrayscenter.com';
  const successRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    comoconoce: '',
    subject: 'general',
    message: '',
    acceptsPrivacy: false,
  });

  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    remaining: number;
    resetTime: number | null;
  }>({
    remaining: MAX_ATTEMPTS,
    resetTime: null,
  });

  // ============================================================================
  // RATE LIMITING (Client-side)
  // ============================================================================

  const getRateLimitData = (): RateLimitData => {
    try {
      const stored = localStorage.getItem(RATE_LIMIT_KEY);
      if (!stored) {
        return { attempts: 0, timestamps: [], lastAttempt: 0 };
      }
      return JSON.parse(stored);
    } catch {
      return { attempts: 0, timestamps: [], lastAttempt: 0 };
    }
  };

  const setRateLimitData = (data: RateLimitData): void => {
    try {
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
    } catch {
      // LocalStorage not available or quota exceeded
    }
  };

  const checkRateLimit = (): { allowed: boolean; remaining: number; resetTime: number | null } => {
    const now = Date.now();
    const data = getRateLimitData();

    // Filter out timestamps older than the rate limit window
    const recentTimestamps = data.timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);

    if (recentTimestamps.length >= MAX_ATTEMPTS) {
      const oldestTimestamp = Math.min(...recentTimestamps);
      const resetTime = oldestTimestamp + RATE_LIMIT_WINDOW_MS;
      return { allowed: false, remaining: 0, resetTime };
    }

    return {
      allowed: true,
      remaining: MAX_ATTEMPTS - recentTimestamps.length,
      resetTime: null,
    };
  };

  const recordAttempt = (): void => {
    const now = Date.now();
    const data = getRateLimitData();
    const recentTimestamps = data.timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);

    setRateLimitData({
      attempts: data.attempts + 1,
      timestamps: [...recentTimestamps, now],
      lastAttempt: now,
    });
  };

  // Update rate limit info on mount and after submissions
  useEffect(() => {
    const updateRateLimitInfo = () => {
      const { remaining, resetTime } = checkRateLimit();
      setRateLimitInfo({ remaining, resetTime });
    };

    updateRateLimitInfo();
    const interval = setInterval(updateRateLimitInfo, 60000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formStatus]);

  // ============================================================================
  // VALIDATION
  // ============================================================================

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s+()-]{7,20}$/;
    return phoneRegex.test(phone);
  };

  const validateName = (name: string): boolean => {
    return name.trim().length >= 2 && name.trim().length <= 100;
  };

  const validateMessage = (message: string): boolean => {
    return message.trim().length >= 10 && message.trim().length <= 2000;
  };

  const sanitizeInput = (input: string): string => {
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
  };

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, acceptsPrivacy: e.target.checked }));
    if (validationErrors['acceptsPrivacy']) {
      setValidationErrors(prev => ({ ...prev, acceptsPrivacy: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    // Check rate limit FIRST
    const rateLimitCheck = checkRateLimit();
    if (!rateLimitCheck.allowed) {
      setFormStatus('rate_limited');
      return;
    }

    setFormStatus('sending');

    // Sanitize all inputs
    const sanitizedData = {
      firstName: sanitizeInput(formData.firstName),
      lastName: sanitizeInput(formData.lastName),
      email: sanitizeInput(formData.email),
      phoneNumber: sanitizeInput(formData.phoneNumber),
      comoconoce: formData.comoconoce,
      subject: formData.subject,
      message: sanitizeInput(formData.message),
      acceptsPrivacy: formData.acceptsPrivacy,
    };

    // Validate sanitized data
    const errors: Record<string, string> = {};

    if (!validateName(sanitizedData.firstName)) {
      errors['firstName'] = t('contact_error_firstName');
    }

    if (!validateName(sanitizedData.lastName)) {
      errors['lastName'] = t('contact_error_lastName');
    }

    if (!validateEmail(sanitizedData.email)) {
      errors['email'] = t('contact_error_email');
    }

    if (!validatePhone(sanitizedData.phoneNumber)) {
      errors['phoneNumber'] = t('contact_error_phone');
    }

    if (!validateMessage(sanitizedData.message)) {
      errors['message'] = t('contact_error_message');
    }

    // LOPD: El consentimiento es OBLIGATORIO
    if (!sanitizedData.acceptsPrivacy) {
      errors['acceptsPrivacy'] = t('contact_error_privacy');
    }

    // If there are validation errors, stop and show them
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setFormStatus('error');
      return;
    }

    // Record this submission attempt for rate limiting
    recordAttempt();

    try {
      // En desarrollo local, simular exito (la API solo funciona en Vercel)
      if (import.meta.env.DEV) {
        console.warn('[DEV] Contact form data:', {
          firstName: sanitizedData.firstName,
          lastName: sanitizedData.lastName,
          email: sanitizedData.email,
          phoneNumber: sanitizedData.phoneNumber,
          comoconoce: sanitizedData.comoconoce,
          Asunto: sanitizedData.subject,
          Mensaje: sanitizedData.message,
          acceptsPrivacy: sanitizedData.acceptsPrivacy,
        });
        console.warn('[DEV] Would track: contact_form_submit event');
        await new Promise(resolve => setTimeout(resolve, 1500));
        setFormStatus('success');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          comoconoce: '',
          subject: 'general',
          message: '',
          acceptsPrivacy: false,
        });
        setTimeout(() => {
          successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        setTimeout(() => setFormStatus('idle'), 8000);
        return;
      }

      // Enviar a la API
      const { fbc, fbp } = getMetaCookies();
      const response = await fetch(CONTACT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: sanitizedData.firstName,
          lastName: sanitizedData.lastName,
          email: sanitizedData.email,
          phoneNumber: sanitizedData.phoneNumber,
          comoconoce: sanitizedData.comoconoce,
          Asunto: sanitizedData.subject,
          Mensaje: sanitizedData.message,
          acceptsPrivacy: sanitizedData.acceptsPrivacy,
          fbc,
          fbp,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      const responseData = await response.json().catch(() => ({ success: true }));

      setFormStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        comoconoce: '',
        subject: 'general',
        message: '',
        acceptsPrivacy: false,
      });

      // Track successful submission - dataLayer + GA4 + Meta Pixel
      trackLeadConversion({
        leadSource: 'contact_form',
        formName: `Contact Form - ${sanitizedData.subject}`,
        leadValue: LEAD_VALUES.CONTACT_FORM,
        pagePath: window.location.pathname,
        eventId: responseData.eventId,
      });

      // Also push specific contact_form_submit event for GTM triggers
      pushToDataLayer({
        event: 'contact_form_submit',
        form_name: 'contact',
        subject: sanitizedData.subject,
        discovery_source: sanitizedData.comoconoce || 'not_specified',
        lead_value: LEAD_VALUES.CONTACT_FORM,
        currency: 'EUR',
      });

      // Scroll to success message for better UX
      setTimeout(() => {
        successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

      setTimeout(() => setFormStatus('idle'), 8000);
    } catch (err) {
      console.error('Contact form submission error:', err);
      setFormStatus('error');

      // Track form errors for debugging
      trackEvent('contact_form_error', {
        form_name: 'contact',
        error_type: 'submission_failed',
      });
    }
  };

  // ============================================================================
  // SCHEMA MARKUP
  // ============================================================================

  // ContactPage + LocalBusiness schema for SEO geo-targeting
  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: t('contact_page_title'),
    description: t('contact_page_description'),
    url: `${baseUrl}/${locale}/contacto`,
    // Reference build-time LocalBusiness by @id instead of duplicating it
    mainEntity: {
      '@id': `${baseUrl}/#danceschool`,
    },
  };

  const breadcrumbItems = [
    { name: t('contact_breadcrumb_home'), url: `/${locale}` },
    { name: t('contact_breadcrumb_current'), url: `/${locale}/contacto`, isActive: true },
  ];

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <>
      <Helmet>
        <title>{t('contact_page_title')} | Farray&apos;s Center</title>
        <meta name="description" content={t('contact_page_description')} />
        <link rel="canonical" href={`${baseUrl}/${locale}/contacto`} />
        <meta property="og:title" content={`${t('contact_page_title')} | Farray&apos;s Center`} />
        <meta property="og:description" content={t('contact_page_description')} />
        <meta property="og:url" content={`${baseUrl}/${locale}/contacto`} />
        <meta property="og:type" content="website" />
        {/* BreadcrumbList generated at build-time by prerender.mjs */}
        <script type="application/ld+json">{JSON.stringify(contactPageSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-black pt-20 md:pt-24">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden min-h-[500px] flex items-center">
          {/* Background - Enterprise pattern */}
          <div className="absolute inset-0 bg-black">
            {/* Hero background image with configurable opacity */}
            <div className="absolute inset-0" style={{ opacity: 0.35 }}>
              <picture>
                <source srcSet="/images/optimized/mgs_3703.webp" type="image/webp" />
                <img
                  src="/images/optimized/mgs_3703.jpg"
                  alt={t('contacto_hero_image_alt')}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center 30%' }}
                  loading="eager"
                  fetchPriority="high"
                />
              </picture>
            </div>
            {/* Gradient overlays for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/20 via-transparent to-black/50"></div>
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <Breadcrumb items={breadcrumbItems} textColor="text-neutral/70" />

            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto text-center">
                <h1
                  className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6"
                  style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 24px rgba(0,0,0,0.6)' }}
                >
                  {t('contact_hero_title')}
                </h1>
                <p className="text-xl md:text-2xl text-neutral/90 leading-relaxed">
                  {t('contact_hero_subtitle')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Contact Form and Map Section */}
        <section className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-start max-w-7xl mx-auto">
              {/* Contact Form */}
              <div className="w-full lg:w-1/2">
                <AnimateOnScroll>
                  <div className="bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl p-8 lg:p-10">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-neutral mb-6 holographic-text">
                      {t('contact_form_title')}
                    </h2>
                    <p className="text-neutral/90 mb-8 leading-relaxed">
                      {t('contact_form_subtitle')}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Name row: firstName + lastName */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="firstName"
                            className="block text-neutral font-semibold mb-2"
                          >
                            {t('contact_form_firstName')} <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            minLength={2}
                            maxLength={100}
                            autoComplete="given-name"
                            aria-invalid={!!validationErrors['firstName']}
                            aria-describedby={
                              validationErrors['firstName'] ? 'firstName-error' : undefined
                            }
                            className={`w-full px-4 py-3 bg-black/70 border rounded-lg text-neutral focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/50 transition-all ${validationErrors['firstName'] ? 'border-red-500' : 'border-primary-dark/50'}`}
                            placeholder={t('contact_form_firstName_placeholder')}
                          />
                          {validationErrors['firstName'] && (
                            <p
                              id="firstName-error"
                              className="mt-1 text-sm text-red-400"
                              role="alert"
                            >
                              {validationErrors['firstName']}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="lastName"
                            className="block text-neutral font-semibold mb-2"
                          >
                            {t('contact_form_lastName')} <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            minLength={2}
                            maxLength={100}
                            autoComplete="family-name"
                            aria-invalid={!!validationErrors['lastName']}
                            aria-describedby={
                              validationErrors['lastName'] ? 'lastName-error' : undefined
                            }
                            className={`w-full px-4 py-3 bg-black/70 border rounded-lg text-neutral focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/50 transition-all ${validationErrors['lastName'] ? 'border-red-500' : 'border-primary-dark/50'}`}
                            placeholder={t('contact_form_lastName_placeholder')}
                          />
                          {validationErrors['lastName'] && (
                            <p
                              id="lastName-error"
                              className="mt-1 text-sm text-red-400"
                              role="alert"
                            >
                              {validationErrors['lastName']}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-neutral font-semibold mb-2">
                          {t('contact_form_email')} <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          autoComplete="email"
                          aria-invalid={!!validationErrors['email']}
                          aria-describedby={validationErrors['email'] ? 'email-error' : undefined}
                          className={`w-full px-4 py-3 bg-black/70 border rounded-lg text-neutral focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/50 transition-all ${validationErrors['email'] ? 'border-red-500' : 'border-primary-dark/50'}`}
                          placeholder={t('contact_form_email_placeholder')}
                        />
                        {validationErrors['email'] && (
                          <p id="email-error" className="mt-1 text-sm text-red-400" role="alert">
                            {validationErrors['email']}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label
                          htmlFor="phoneNumber"
                          className="block text-neutral font-semibold mb-2"
                        >
                          {t('contact_form_phone')} <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          required
                          autoComplete="tel"
                          aria-invalid={!!validationErrors['phoneNumber']}
                          aria-describedby={
                            validationErrors['phoneNumber'] ? 'phoneNumber-error' : undefined
                          }
                          className={`w-full px-4 py-3 bg-black/70 border rounded-lg text-neutral focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/50 transition-all ${validationErrors['phoneNumber'] ? 'border-red-500' : 'border-primary-dark/50'}`}
                          placeholder={t('contact_form_phone_placeholder')}
                        />
                        {validationErrors['phoneNumber'] && (
                          <p
                            id="phoneNumber-error"
                            className="mt-1 text-sm text-red-400"
                            role="alert"
                          >
                            {validationErrors['phoneNumber']}
                          </p>
                        )}
                      </div>

                      {/* Como nos conociste */}
                      <div>
                        <label
                          htmlFor="comoconoce"
                          className="block text-neutral font-semibold mb-2"
                        >
                          {t('contact_form_discovery')}
                        </label>
                        <select
                          id="comoconoce"
                          name="comoconoce"
                          value={formData.comoconoce}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-black/70 border border-primary-dark/50 rounded-lg text-neutral focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/50 transition-all appearance-none cursor-pointer"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23888'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 12px center',
                            backgroundSize: '20px',
                          }}
                        >
                          {DISCOVERY_OPTIONS.map(option => (
                            <option key={option.value} value={option.value} className="bg-black">
                              {t(option.labelKey)}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Subject */}
                      <div>
                        <label htmlFor="subject" className="block text-neutral font-semibold mb-2">
                          {t('contact_form_subject')} <span className="text-red-400">*</span>
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-black/70 border border-primary-dark/50 rounded-lg text-neutral focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/50 transition-all appearance-none cursor-pointer"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23888'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 12px center',
                            backgroundSize: '20px',
                          }}
                        >
                          {SUBJECT_OPTIONS.map(option => (
                            <option key={option.value} value={option.value} className="bg-black">
                              {t(option.labelKey)}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Message */}
                      <div>
                        <label htmlFor="message" className="block text-neutral font-semibold mb-2">
                          {t('contact_form_message')} <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          minLength={10}
                          maxLength={2000}
                          rows={6}
                          aria-invalid={!!validationErrors['message']}
                          aria-describedby={
                            validationErrors['message'] ? 'message-error' : undefined
                          }
                          className={`w-full px-4 py-3 bg-black/70 border rounded-lg text-neutral focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/50 transition-all resize-none ${validationErrors['message'] ? 'border-red-500' : 'border-primary-dark/50'}`}
                          placeholder={t('contact_form_message_placeholder')}
                        />
                        {validationErrors['message'] && (
                          <p id="message-error" className="mt-1 text-sm text-red-400" role="alert">
                            {validationErrors['message']}
                          </p>
                        )}
                      </div>

                      {/* LOPD/RGPD Consent Checkbox - OBLIGATORIO */}
                      <div className="pt-2">
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <div className="relative flex-shrink-0 mt-0.5">
                            <input
                              type="checkbox"
                              id="acceptsPrivacy"
                              name="acceptsPrivacy"
                              checked={formData.acceptsPrivacy}
                              onChange={handleCheckboxChange}
                              aria-invalid={!!validationErrors['acceptsPrivacy']}
                              aria-describedby={
                                validationErrors['acceptsPrivacy'] ? 'privacy-error' : undefined
                              }
                              className="peer sr-only"
                            />
                            <div
                              className={`w-5 h-5 border-2 rounded bg-white/5 peer-checked:bg-primary-accent peer-checked:border-primary-accent transition-all peer-focus:ring-2 peer-focus:ring-primary-accent/50 group-hover:border-white/50 flex items-center justify-center ${validationErrors['acceptsPrivacy'] ? 'border-red-500' : 'border-white/30'}`}
                            >
                              <CheckIcon className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" />
                            </div>
                            <CheckIcon className="absolute inset-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                          </div>
                          <span className="text-sm text-neutral/80 leading-tight">
                            {t('contact_consent_text')}{' '}
                            <Link
                              to={`/${locale}/politica-privacidad`}
                              className="text-primary-accent hover:underline"
                              target="_blank"
                            >
                              {t('contact_consent_link')}
                            </Link>{' '}
                            <span className="text-red-400">*</span>
                          </span>
                        </label>
                        {validationErrors['acceptsPrivacy'] && (
                          <p
                            id="privacy-error"
                            className="mt-1 text-sm text-red-400 ml-8"
                            role="alert"
                          >
                            {validationErrors['acceptsPrivacy']}
                          </p>
                        )}
                      </div>

                      {/* Rate limit warning */}
                      {rateLimitInfo.remaining <= 1 &&
                        rateLimitInfo.remaining > 0 &&
                        formStatus !== 'rate_limited' && (
                          <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 text-yellow-400">
                            <p className="font-semibold">
                              {t('contact_rate_limit_warning').replace(
                                '{remaining}',
                                String(rateLimitInfo.remaining)
                              )}
                            </p>
                            <p className="text-sm mt-1">{t('contact_rate_limit_info')}</p>
                          </div>
                        )}

                      {/* Success message - Enhanced visibility */}
                      {formStatus === 'success' && (
                        <div
                          ref={successRef}
                          className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500 rounded-xl p-6 text-center animate-pulse shadow-lg shadow-green-500/20"
                          role="alert"
                          aria-live="polite"
                        >
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                              <CheckIcon className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-green-400">
                              {t('contact_success_title') || '¡Mensaje Enviado!'}
                            </h3>
                            <p className="text-green-300 text-lg">{t('contact_form_success')}</p>
                            <p className="text-neutral/70 text-sm mt-2">
                              {t('contact_success_response_time') ||
                                'Te responderemos en menos de 24 horas'}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Error message */}
                      {formStatus === 'error' && (
                        <div
                          className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400"
                          role="alert"
                          aria-live="assertive"
                        >
                          {t('contact_form_error')}
                        </div>
                      )}

                      {/* Rate limited message */}
                      {formStatus === 'rate_limited' && (
                        <div
                          className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400"
                          role="alert"
                          aria-live="assertive"
                        >
                          <p className="font-semibold">{t('contact_rate_limited_title')}</p>
                          <p className="text-sm mt-1">
                            {t('contact_rate_limited_message').replace(
                              '{minutes}',
                              String(
                                rateLimitInfo.resetTime
                                  ? Math.ceil((rateLimitInfo.resetTime - Date.now()) / 60000)
                                  : 15
                              )
                            )}
                          </p>
                          <p className="text-xs mt-2 text-red-300">
                            {t('contact_rate_limited_alternative')}{' '}
                            <a href="tel:+34622247085" className="underline">
                              +34 622 247 085
                            </a>{' '}
                            {t('contact_or')}{' '}
                            <a href="mailto:info@farrayscenter.com" className="underline">
                              info@farrayscenter.com
                            </a>
                          </p>
                        </div>
                      )}

                      {/* Submit button */}
                      <button
                        type="submit"
                        disabled={formStatus === 'sending' || formStatus === 'rate_limited'}
                        className="w-full bg-primary-accent text-white font-bold text-lg py-4 px-8 rounded-full transition-all duration-300 hover:bg-primary-accent/90 hover:shadow-accent-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {formStatus === 'sending' ? (
                          <>
                            <div
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                              aria-hidden="true"
                            />
                            <span>{t('contact_form_sending')}</span>
                          </>
                        ) : formStatus === 'rate_limited' ? (
                          t('contact_rate_limited_button')
                        ) : (
                          t('contact_form_submit')
                        )}
                      </button>

                      {/* Legal text - LOPD compliance */}
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-[10px] leading-relaxed text-neutral/70">
                          {t('contact_legal_text')}
                        </p>
                        <div className="flex gap-4 mt-2">
                          <Link
                            to={`/${locale}/politica-privacidad`}
                            className="text-[10px] text-primary-accent/70 hover:text-primary-accent transition-colors"
                          >
                            {t('contact_privacy_link')}
                          </Link>
                          <Link
                            to={`/${locale}/aviso-legal`}
                            className="text-[10px] text-primary-accent/70 hover:text-primary-accent transition-colors"
                          >
                            {t('contact_legal_link')}
                          </Link>
                        </div>
                      </div>
                    </form>
                  </div>
                </AnimateOnScroll>
              </div>

              {/* Google Maps */}
              <div className="w-full lg:w-1/2 h-[500px] lg:h-[800px] lg:sticky lg:top-24">
                <AnimateOnScroll delay={300} className="h-full">
                  <div className="overflow-hidden rounded-2xl border-2 border-primary-dark/50 shadow-lg h-full">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2993.7083603486235!2d2.148014315104171!3d41.38042057926481!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a49882fa7aaaa9%3A0x47a79ab582164caf!2sFarray%E2%80%99s+International+Dance+Center+-+Escuela+de+Salsa+Cubana%2C+Bailes+Sociales+y+Danza!5e1!3m2!1ses!2ses!4v1504633190526"
                      className="w-full h-full border-0"
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Farray's International Dance Center Location Map"
                    ></iframe>
                  </div>
                </AnimateOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info Card - Moved to bottom */}
        <section className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto">
                <div className="bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-xl p-10 hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300">
                  <h3 className="text-2xl font-bold text-neutral mb-8 text-center">
                    {t('contact_info_title')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="bg-primary-dark/30 p-3 rounded-xl">
                        <Icon name="map-pin" className="h-6 w-6 text-primary-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral mb-1">
                          {t('contact_address_title')}
                        </h4>
                        <p className="text-neutral/90">Calle Entenca 100, Barcelona 08015</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="bg-primary-dark/30 p-3 rounded-xl">
                        <svg
                          className="h-6 w-6 text-primary-accent"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral mb-1">
                          {t('contact_phone_title')}
                        </h4>
                        <a
                          href="tel:+34622247085"
                          className="text-neutral/90 hover:text-primary-accent transition-colors text-lg"
                        >
                          +34 622 247 085
                        </a>
                      </div>
                    </div>

                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="bg-primary-dark/30 p-3 rounded-xl">
                        <svg
                          className="h-6 w-6 text-primary-accent"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral mb-1">
                          {t('contact_email_title')}
                        </h4>
                        <a
                          href="mailto:info@farrayscenter.com"
                          className="text-neutral/90 hover:text-primary-accent transition-colors"
                        >
                          info@farrayscenter.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactPage;
