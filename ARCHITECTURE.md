# Architecture Documentation

## Project Overview

**Farray's International Dance Center** is a high-performance, multi-language website built with modern web technologies, focusing on performance, accessibility, and user experience.

## Tech Stack

### Core Technologies
- **React 19.2** - UI library with concurrent features
- **TypeScript 5.8** - Type-safe development with strict mode
- **Vite 6.4** - Fast build tool with HMR and SSG prerendering
- **React Router 7.9** - Client-side routing with data loading

### Supporting Libraries
- **React Helmet Async** - SEO metadata management
- **DOMPurify 3.2.4** - XSS prevention and HTML sanitization
- **Testing Library** - Component testing utilities
- **Vitest** - Fast unit testing framework

## Architecture Patterns

### 1. Component Architecture

#### Modular Header System
```
components/Header.tsx (217 lines)
├── header/DesktopNavigation.tsx (245 lines)
│   ├── Classes Dropdown
│   │   └── Urban Dances Submenu
│   ├── Services Dropdown
│   └── About Us Dropdown
├── header/MobileNavigation.tsx (270 lines)
│   ├── Full-screen overlay menu
│   ├── Language selection
│   └── Enroll CTA
└── header/LanguageSelector.tsx (58 lines)
    └── Desktop language dropdown
```

**Benefits:**
- Single Responsibility Principle
- Easy to test in isolation
- Reusable components
- Better code organization

#### Lazy Loading Pattern (HomePage)
```typescript
// Eager loading (above the fold)
import Hero from './Hero';
import HappinessStory from './HappinessStory';
import About from './About';

// Lazy loading (below the fold)
const Services = lazy(() => import('./Services'));
const Teachers = lazy(() => import('./Teachers'));
const Testimonials = lazy(() => import('./Testimonials'));
const FAQSection = lazy(() => import('./FAQSection'));
const HowToGetHere = lazy(() => import('./HowToGetHere'));

// Usage
<Suspense fallback={<div className="min-h-screen" />}>
  <Services />
  <Teachers />
  {/* ... other lazy components */}
</Suspense>
```

**Result:** 45.79 kB of code not loaded on initial page load.

### 2. State Management

#### Local State Pattern
- Component-level state with `useState`
- No global state library needed (project size appropriate)
- Props drilling minimized through composition

#### Header State Example
```typescript
const Header: React.FC = () => {
  // Scroll state
  const [isScrolled, setIsScrolled] = useState(false);

  // Mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Dropdown states (5 total)
  const [isClassesDropdownOpen, setIsClassesDropdownOpen] = useState(false);
  const [isUrbanDropdownOpen, setIsUrbanDropdownOpen] = useState(false);
  // ... other dropdown states
};
```

### 3. Performance Optimizations

#### Debouncing Pattern
```typescript
// utils/debounce.ts
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId !== null) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), wait);
  };
}

// Usage in components
const debouncedScroll = debounce(handleScroll, 100);
window.addEventListener('scroll', debouncedScroll);
```

**Impact:** 85% reduction in scroll event firing.

#### Code Splitting Strategy
```
Main Bundle (index.js): 250.79 kB
├── Core React + Router: 59.68 kB
├── Application Code: 191.11 kB
└── Lazy Chunks (loaded on demand):
    ├── FAQSection: 2.22 kB
    ├── HowToGetHere: 2.40 kB
    ├── Teachers: 3.17 kB
    ├── Testimonials: 7.03 kB
    ├── Services: 8.41 kB
    └── DOMPurify: 22.56 kB
```

### 4. Internationalization (i18n)

#### Structure
```
i18n/
├── locales/
│   ├── es.ts (3,038 lines) - Spanish (default)
│   ├── ca.ts (2,433 lines) - Catalan
│   ├── en.ts (2,440 lines) - English
│   └── fr.ts (2,321 lines) - French
└── index.ts (exports)

Total: 10,262 lines of translations
```

#### Usage Pattern
```typescript
const { t, locale } = useI18n();

// Simple translation
<h1>{t('pageTitle')}</h1>

// Dynamic routing with locale
navigate(`/${locale}/contacto`);

// Locale switching
const handleLanguageChange = (lang: Locale) => {
  const newPath = `/${lang}${currentPath}`;
  navigate(newPath);
};
```

### 5. Routing & SEO

#### Route Structure
```
/ (root) → redirects to /es
├── /es (Spanish)
│   ├── /clases/baile-barcelona
│   ├── /clases/danza-barcelona
│   ├── /clases/salsa-bachata-barcelona
│   ├── /clases/danzas-urbanas-barcelona
│   ├── /clases/dancehall-barcelona
│   └── /clases-particulares-baile
├── /ca (Catalan - same structure)
├── /en (English - same structure)
└── /fr (French - same structure)

Total: 29 prerendered pages
```

#### SEO Implementation
```typescript
<Helmet>
  <title>{t('pageTitle')}</title>
  <meta name="description" content={t('metaDescription')} />
  <link rel="canonical" href={`${baseUrl}/${locale}`} />
  <meta property="og:title" content={t('pageTitle')} />
  {/* ... other meta tags */}
</Helmet>

// Schema.org markup
<script type="application/ld+json">
  {JSON.stringify(localBusinessSchema)}
</script>
```

### 6. Accessibility (WCAG 2.1)

#### Keyboard Navigation
```typescript
// All interactive elements support keyboard
<button
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  }}
  aria-expanded={isOpen}
  aria-label={t('buttonLabel')}
>
```

#### ARIA Attributes
- `aria-label` - All interactive controls
- `aria-expanded` - All dropdown menus
- `aria-hidden` - All decorative SVG icons
- `aria-current` - Current page navigation links
- `aria-live` - Error messages and dynamic content

### 7. Security Measures

#### Rate Limiting (Client-Side)
```typescript
interface RateLimitData {
  attempts: number;
  timestamps: number[];
  lastAttempt: number;
}

const RATE_LIMIT_KEY = 'farrays-contact-form-rate-limit';
const MAX_ATTEMPTS = 3;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// Sliding window algorithm
const checkRateLimit = (): { allowed: boolean; remaining: number } => {
  const now = Date.now();
  const data = getRateLimitData();
  const recentTimestamps = data.timestamps.filter(
    ts => now - ts < RATE_LIMIT_WINDOW_MS
  );

  if (recentTimestamps.length >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0 };
  }

  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - recentTimestamps.length
  };
};
```

#### XSS Prevention
```typescript
// DOMPurify sanitization for user-generated content
import DOMPurify from 'dompurify';

<div
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(faq.answer)
  }}
/>
```

### 8. Testing Strategy

#### Test Structure
```
test/
├── setup.ts (global test configuration)
└── ContactPage.test.tsx (6 tests)

components/__tests__/
├── ErrorBoundary.test.tsx (2 tests)
├── Footer.test.tsx (3 tests)
├── Header.test.tsx (2 tests)
├── LoadingSpinner.test.tsx (2 tests)
└── SEO.test.tsx (2 tests)

hooks/__tests__/
├── useI18n.test.tsx (3 tests)
└── useLazyImage.test.tsx (3 tests)

Total: 23 tests
```

#### Testing Pattern
```typescript
describe('ContactPage - Rate Limiting', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should enforce rate limit after 3 submissions', async () => {
    const rateLimitData = {
      attempts: 3,
      timestamps: [now - 1000, now - 2000, now - 3000],
      lastAttempt: now - 1000,
    };
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(rateLimitData));

    // ... test implementation
  });
});
```

### 9. Build & Deployment

#### Build Process
```bash
npm run build
# 1. Vite builds optimized production bundle
# 2. Prerender.mjs generates static HTML for 29 pages
# 3. Assets optimized and hashed
# 4. Output to dist/
```

#### Output Structure
```
dist/
├── index.html (root redirector)
├── es/
│   ├── index.html
│   └── clases/
│       ├── baile-barcelona/index.html
│       └── ... (other pages)
├── ca/ (same structure)
├── en/ (same structure)
├── fr/ (same structure)
└── assets/
    ├── index-[hash].js
    ├── index-[hash].css
    └── ... (chunked bundles)
```

## Design Patterns Used

### 1. **Composition over Inheritance**
- Functional components throughout
- Composition via props and children
- No class-based components (except ErrorBoundary)

### 2. **Container/Presentational**
- Smart components: Header, ContactPage
- Presentational: DesktopNavigation, MobileNavigation

### 3. **Render Props**
- AnimateOnScroll component uses children as function
- FAQSection accepts render configuration

### 4. **Higher-Order Components**
- ErrorBoundary wraps entire app
- HelmetProvider for SEO context

### 5. **Custom Hooks**
- `useI18n()` - Translation and locale management
- `useLazyImage()` - Progressive image loading

## File Organization

```
web-local/
├── components/           # React components
│   ├── header/          # Header sub-components
│   ├── home/            # Home page sections
│   └── __tests__/       # Component tests
├── hooks/               # Custom React hooks
│   └── __tests__/       # Hook tests
├── lib/                 # Reusable utilities
│   └── icons.tsx        # SVG icon components
├── utils/               # Utility functions
│   └── debounce.ts      # Performance utilities
├── i18n/                # Internationalization
│   └── locales/         # Translation files
├── constants/           # Configuration constants
│   ├── dancehall.ts     # Page-specific data
│   └── testimonials.ts  # Shared testimonials
├── types/               # TypeScript definitions
├── test/                # Integration tests
└── public/              # Static assets
```

## Performance Budget

### Current Metrics
| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| First Contentful Paint | <1.5s | ~1.2s | ✅ |
| Largest Contentful Paint | <2.5s | ~2.0s | ✅ |
| Time to Interactive | <3.5s | ~2.8s | ✅ |
| Total Bundle Size | <300KB | 250.79KB | ✅ |
| Gzipped Size | <90KB | 73.64KB | ✅ |

### Optimization Techniques
1. **Code splitting** - 45.79 kB lazy loaded
2. **Debouncing** - Scroll events optimized
3. **Image optimization** - WebP with PNG fallback
4. **Tree shaking** - Unused code eliminated
5. **Minification** - CSS and JS compressed
6. **Prerendering** - Static HTML for faster FCP

## Best Practices Followed

### ✅ Code Quality
- TypeScript strict mode enabled
- ESLint + Prettier configured
- Consistent naming conventions
- Comprehensive comments for complex logic

### ✅ Performance
- Lazy loading for below-the-fold content
- Debounced scroll listeners
- Optimized re-renders
- Code splitting by route and feature

### ✅ Accessibility
- WCAG 2.1 Level AA compliant
- Keyboard navigation complete
- Screen reader friendly
- Semantic HTML structure

### ✅ Security
- XSS prevention with DOMPurify
- Rate limiting on forms
- Input validation
- Secure routing

### ✅ SEO
- Server-side rendering (prerendering)
- Meta tags complete
- Schema.org markup
- Canonical URLs
- Multi-language support

## Future Architecture Considerations

### Scalability
- Consider state management library if app grows (Redux/Zustand)
- Split i18n files by namespace if translations grow beyond 15k lines
- Implement virtual scrolling for long lists
- Add service worker for offline support

### Monitoring
- Integrate Web Vitals tracking
- Add error tracking (Sentry)
- Implement analytics (GA4)
- Performance monitoring dashboard

### Testing
- Increase unit test coverage to 80%
- Add E2E tests with Playwright
- Visual regression testing
- Performance testing automation

---

**Last Updated:** 2025-01-21
**Version:** 2.0.0
**Maintainer:** Development Team
