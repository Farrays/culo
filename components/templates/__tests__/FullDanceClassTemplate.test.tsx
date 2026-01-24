import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../test/test-utils';
import FullDanceClassTemplate from '../FullDanceClassTemplate';
import type { FullDanceClassConfig } from '../FullDanceClassTemplate';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

// Minimal config for testing
const mockConfig: FullDanceClassConfig = {
  styleKey: 'testStyle',
  stylePath: 'test-style-barcelona',
  faqsConfig: [
    {
      id: 'test-faq-1',
      questionKey: 'testFaqQ1',
      answerKey: 'testFaqA1',
    },
  ],
  testimonials: [
    {
      id: 1,
      name: 'Test User',
      image: '',
      rating: 5,
      city: {
        en: 'Barcelona, Spain',
        es: 'Barcelona, España',
        ca: 'Barcelona, Espanya',
        fr: 'Barcelone, Espagne',
      },
      quote: {
        en: 'Great classes!',
        es: '¡Clases geniales!',
        ca: 'Classes genials!',
        fr: 'Super cours!',
      },
    },
  ],
  scheduleKeys: [
    {
      id: '1',
      dayKey: 'monday',
      className: 'Test Class',
      time: '19:00 - 20:00',
      teacher: 'Test Teacher',
      levelKey: 'basicLevel',
    },
  ],
  teachers: [
    {
      name: 'Test Teacher',
      specialtyKey: 'testTeacherSpecialty',
      bioKey: 'testTeacherBio',
    },
  ],
  breadcrumbConfig: {
    homeKey: 'testBreadcrumbHome',
    classesKey: 'testBreadcrumbClasses',
    categoryKey: 'testBreadcrumbCategory',
    categoryUrl: '/clases/test-category',
    currentKey: 'testBreadcrumbCurrent',
  },
  hero: {
    minutes: 60,
    calories: 400,
    funPercent: 100,
    gradientColor: 'primary',
  },
  whatIsSection: {
    enabled: true,
    paragraphCount: 2,
  },
  identificationSection: {
    enabled: true,
    itemCount: 3,
  },
  transformationSection: {
    enabled: true,
    itemCount: 3,
  },
  whyChooseSection: {
    enabled: true,
    itemOrder: [1, 2, 3],
  },
  whyTodaySection: {
    enabled: false,
  },
  videoSection: {
    enabled: false,
    videos: [],
  },
  logosSection: {
    enabled: false,
  },
  nearbySection: {
    enabled: false,
  },
  culturalHistory: {
    enabled: false,
  },
  courseConfig: {
    teachesKey: 'schema_test_teaches',
    prerequisitesKey: 'schema_test_prerequisites',
    lessonsKey: 'schema_test_lessons',
    duration: 'PT1H',
  },
};

describe('FullDanceClassTemplate', () => {
  it('should render without crashing', () => {
    const { container } = render(<FullDanceClassTemplate config={mockConfig} />);
    expect(container).toBeInTheDocument();
  });

  it('should render the main element', () => {
    render(<FullDanceClassTemplate config={mockConfig} />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should render hero section', () => {
    render(<FullDanceClassTemplate config={mockConfig} />);
    // Hero section should have an h1
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('should render schedule section when scheduleKeys provided', () => {
    render(<FullDanceClassTemplate config={mockConfig} />);
    // Schedule section should exist
    const scheduleSection = document.querySelector('#schedule');
    expect(scheduleSection).toBeInTheDocument();
  });

  it('should render teachers section when teachers provided', () => {
    render(<FullDanceClassTemplate config={mockConfig} />);
    // Teachers section should exist
    const teachersSection = document.querySelector('#teachers');
    expect(teachersSection).toBeInTheDocument();
  });

  it('should render FAQ section when FAQs provided', () => {
    render(<FullDanceClassTemplate config={mockConfig} />);
    // FAQ section should exist
    const faqSection = document.querySelector('#faq');
    expect(faqSection).toBeInTheDocument();
  });

  it('should render CTA buttons in hero', () => {
    render(<FullDanceClassTemplate config={mockConfig} />);
    // Should have at least one CTA link
    const ctaLinks = screen.getAllByRole('link');
    expect(ctaLinks.length).toBeGreaterThan(0);
  });

  it('should skip disabled sections', () => {
    const configWithDisabledSections: FullDanceClassConfig = {
      ...mockConfig,
      videoSection: { enabled: false, videos: [] },
      logosSection: { enabled: false },
      nearbySection: { enabled: false },
      culturalHistory: { enabled: false },
    };

    render(<FullDanceClassTemplate config={configWithDisabledSections} />);

    // Video section should not exist
    const videoSection = document.querySelector('#video');
    expect(videoSection).toBeNull();
  });

  it('should render transformation section when enabled', () => {
    render(<FullDanceClassTemplate config={mockConfig} />);
    // Look for transformation section heading
    const transformSection = document.querySelector('[id*="transform"]');
    expect(transformSection).toBeInTheDocument();
  });

  it('should render identification section when enabled', () => {
    render(<FullDanceClassTemplate config={mockConfig} />);
    // Look for identification section
    const identifySection = document.querySelector('[id*="identify"]');
    expect(identifySection).toBeInTheDocument();
  });
});
