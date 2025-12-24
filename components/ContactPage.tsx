import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import { useI18n } from '../hooks/useI18n';
import Breadcrumb from './shared/Breadcrumb';
import AnimateOnScroll from './AnimateOnScroll';
import Icon from './Icon';

// Rate limiting constants
const RATE_LIMIT_KEY = 'farrays-contact-form-rate-limit';
const MAX_ATTEMPTS = 3;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

interface RateLimitData {
  attempts: number;
  timestamps: number[];
  lastAttempt: number;
}

const ContactPage: React.FC = () => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  });

  const [formStatus, setFormStatus] = useState<
    'idle' | 'sending' | 'success' | 'error' | 'rate_limited'
  >('idle');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    remaining: number;
    resetTime: number | null;
  }>({
    remaining: MAX_ATTEMPTS,
    resetTime: null,
  });

  // Rate limiting functions
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
    const interval = setInterval(updateRateLimitInfo, 1000); // Update every second for countdown

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formStatus]);

  // Enhanced validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // Phone is optional
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: '' });
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
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      phone: sanitizeInput(formData.phone),
      subject: formData.subject, // Subject is from select, already safe
      message: sanitizeInput(formData.message),
    };

    // Validate sanitized data
    const errors: Record<string, string> = {};

    if (!validateName(sanitizedData.name)) {
      errors['name'] = 'Name must be between 2 and 100 characters';
    }

    if (!validateEmail(sanitizedData.email)) {
      errors['email'] = 'Please enter a valid email address';
    }

    if (sanitizedData.phone && !validatePhone(sanitizedData.phone)) {
      errors['phone'] = 'Please enter a valid phone number';
    }

    if (!validateMessage(sanitizedData.message)) {
      errors['message'] = 'Message must be between 10 and 2000 characters';
    }

    // If there are validation errors, stop and show them
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setFormStatus('error');
      return;
    }

    // Record this submission attempt for rate limiting
    recordAttempt();

    // TODO: Implement server-side rate limiting when backend API is created:
    // - Use express-rate-limit or similar middleware (e.g., 5 requests per hour per IP)
    // - Implement reCAPTCHA v3 for additional bot protection
    // - Log suspicious activity patterns for monitoring
    // - Add IP-based blocking for repeated abuse
    // - Consider implementing email verification for high-value forms

    // Simulate form submission (replace with actual API call)
    // In production, send sanitizedData to backend API endpoint (e.g., POST /api/contact)

    setTimeout(() => {
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: 'general', message: '' });

      setTimeout(() => setFormStatus('idle'), 5000);
    }, 1500);
  };

  // Schema Markup - BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('contact_breadcrumb_home'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('contact_breadcrumb_current'),
        item: `${baseUrl}/${locale}/contacto`,
      },
    ],
  };

  // Breadcrumb items for visual navigation with microdata
  const breadcrumbItems = [
    { name: t('contact_breadcrumb_home'), url: `/${locale}` },
    { name: t('contact_breadcrumb_current'), url: `/${locale}/contacto`, isActive: true },
  ];

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
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-black pt-20 md:pt-24">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-b from-black via-primary-dark/10 to-black">
          <div className="container mx-auto px-6">
            {/* Breadcrumb with Microdata */}
            <Breadcrumb items={breadcrumbItems} textColor="text-neutral/70" />

            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-neutral mb-6 holographic-text">
                  {t('contact_hero_title')}
                </h1>
                <p className="text-xl md:text-2xl text-neutral/90 leading-relaxed">
                  {t('contact_hero_subtitle')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Contact Info Card */}
        <section className="py-8 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto mb-4">
                <div className="bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-xl p-10 hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300">
                  <h3 className="text-2xl font-bold text-neutral mb-8 text-center">
                    {t('contact_info_title')}
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary-dark/30 p-3 rounded-xl flex-shrink-0">
                        <Icon name="map-pin" className="h-6 w-6 text-primary-accent" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-neutral mb-1">
                          {t('contact_address_title')}
                        </h4>
                        <p className="text-neutral/90">Calle Entença nº 100, Barcelona</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-primary-dark/30 p-3 rounded-xl flex-shrink-0">
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
                      <div className="flex-grow">
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

                    <div className="flex items-start gap-4">
                      <div className="bg-primary-dark/30 p-3 rounded-xl flex-shrink-0">
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
                      <div className="flex-grow">
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

        {/* Contact Form and Map Section */}
        <section className="py-20 bg-black">
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

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-neutral font-semibold mb-2">
                          {t('contact_form_name')} *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          minLength={2}
                          maxLength={100}
                          className={`w-full px-4 py-3 bg-black/70 border rounded-lg text-neutral focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/50 transition-all ${validationErrors['name'] ? 'border-red-500' : 'border-primary-dark/50'}`}
                          placeholder={t('contact_form_name_placeholder')}
                        />
                        {validationErrors['name'] && (
                          <p className="mt-1 text-sm text-red-400">{validationErrors['name']}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-neutral font-semibold mb-2">
                          {t('contact_form_email')} *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className={`w-full px-4 py-3 bg-black/70 border rounded-lg text-neutral focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/50 transition-all ${validationErrors['email'] ? 'border-red-500' : 'border-primary-dark/50'}`}
                          placeholder={t('contact_form_email_placeholder')}
                        />
                        {validationErrors['email'] && (
                          <p className="mt-1 text-sm text-red-400">{validationErrors['email']}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-neutral font-semibold mb-2">
                          {t('contact_form_phone')}
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 bg-black/70 border rounded-lg text-neutral focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/50 transition-all ${validationErrors['phone'] ? 'border-red-500' : 'border-primary-dark/50'}`}
                          placeholder={t('contact_form_phone_placeholder')}
                        />
                        {validationErrors['phone'] && (
                          <p className="mt-1 text-sm text-red-400">{validationErrors['phone']}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-neutral font-semibold mb-2">
                          {t('contact_form_subject')} *
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-black/70 border border-primary-dark/50 rounded-lg text-neutral focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/50 transition-all"
                        >
                          <option value="general">{t('contact_form_subject_general')}</option>
                          <option value="classes">{t('contact_form_subject_classes')}</option>
                          <option value="schedule">{t('contact_form_subject_schedule')}</option>
                          <option value="private">{t('contact_form_subject_private')}</option>
                          <option value="events">{t('contact_form_subject_events')}</option>
                          <option value="other">{t('contact_form_subject_other')}</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-neutral font-semibold mb-2">
                          {t('contact_form_message')} *
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
                          className={`w-full px-4 py-3 bg-black/70 border rounded-lg text-neutral focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/50 transition-all resize-none ${validationErrors['message'] ? 'border-red-500' : 'border-primary-dark/50'}`}
                          placeholder={t('contact_form_message_placeholder')}
                        />
                        {validationErrors['message'] && (
                          <p className="mt-1 text-sm text-red-400">{validationErrors['message']}</p>
                        )}
                      </div>

                      {/* Rate limit warning */}
                      {rateLimitInfo.remaining <= 1 &&
                        rateLimitInfo.remaining > 0 &&
                        formStatus !== 'rate_limited' && (
                          <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 text-yellow-400">
                            <p className="font-semibold">
                              ⚠️ Warning: {rateLimitInfo.remaining} attempt
                              {rateLimitInfo.remaining === 1 ? '' : 's'} remaining
                            </p>
                            <p className="text-sm mt-1">
                              To prevent spam, you can only submit {MAX_ATTEMPTS} messages per 15
                              minutes.
                            </p>
                          </div>
                        )}

                      {formStatus === 'success' && (
                        <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 text-green-400">
                          {t('contact_form_success')}
                        </div>
                      )}

                      {formStatus === 'error' && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
                          {t('contact_form_error')}
                        </div>
                      )}

                      {formStatus === 'rate_limited' && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
                          <p className="font-semibold">🚫 Too many submission attempts</p>
                          <p className="text-sm mt-1">
                            You&apos;ve reached the maximum of {MAX_ATTEMPTS} submissions per 15
                            minutes. Please try again{' '}
                            {rateLimitInfo.resetTime && (
                              <>
                                in {Math.ceil((rateLimitInfo.resetTime - Date.now()) / 60000)}{' '}
                                minutes
                              </>
                            )}
                            .
                          </p>
                          <p className="text-xs mt-2 text-red-300">
                            If you need immediate assistance, please call us at{' '}
                            <a href="tel:+34622247085" className="underline">
                              +34 622 247 085
                            </a>{' '}
                            or email{' '}
                            <a href="mailto:info@farrayscenter.com" className="underline">
                              info@farrayscenter.com
                            </a>
                          </p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={formStatus === 'sending' || formStatus === 'rate_limited'}
                        className="w-full bg-primary-accent text-white font-bold text-lg py-4 px-8 rounded-full transition-all duration-300 hover:bg-primary-accent/90 hover:shadow-accent-glow disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {formStatus === 'sending'
                          ? t('contact_form_sending')
                          : formStatus === 'rate_limited'
                            ? '🚫 Rate Limited'
                            : t('contact_form_submit')}
                      </button>
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
      </div>
    </>
  );
};

export default ContactPage;
