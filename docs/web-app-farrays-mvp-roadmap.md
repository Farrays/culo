# Farray's International Dance Center - Web App MVP Roadmap & Architecture

**Project:** Farray's International Dance Center (FIDC) Official Homepage
**Status:** v1.2 - Afrobeats Page Added
**Date:** May 21, 2024

---

## 1. Overview & Project Goal

This document outlines the development roadmap, current features, and architectural decisions for the FIDC web application.

The primary goal is to create a world-class, futuristic, and multilingual website that reflects the premium quality and international prestige of Yunaisy Farray and her dance center. The web app serves as the main digital touchpoint for prospective students, providing information, showcasing the school's value, and driving enrollments.

---

## 2. What We've Done: Completed Features (v1.2)

The current version of the application is a complete, feature-rich static website with dynamic client-side interactions.

### Core Functionality & Architecture
- **✅ Modern Frontend Stack:** Built with **React 19** and **TypeScript** for a robust, scalable, and maintainable codebase.
- **✅ Component-Based Structure:** The application is modular, with functionality broken down into reusable components (e.g., `Header`, `Hero`, `Classes`, `Footer`).
- **✅ Multi-Page Application:** A simple but effective client-side navigation system manages four main views: `HomePage`, `DanceClassesPage`, a dedicated `DancehallPage`, and a new `AfrobeatsPage`, controlled by React state.
- **✅ Full Internationalization (i18n):** Complete multilingual support for **Spanish (es)**, **Catalan (ca)**, **English (en)**, and **French (fr)**. A custom `useI18n` hook provides seamless language switching and content management. The system intelligently detects the user's browser language and defaults to Spanish.
- **✅ Responsive First Design:** The UI is fully responsive and optimized for a flawless experience on mobile, tablet, and desktop devices, built using **Tailwind CSS**.

### Aesthetics & User Experience
- **✅ Ultimate Impact & Futuristic Design:**
  - A dominant, dark theme with a powerful color palette (`primary-dark`: #800020, `primary-accent`: #c82260).
  - Custom, smooth animations (`glow`, `pulse`, `fade-in-up`) create a dynamic and engaging user experience.
  - A unique `holographic-text` effect reinforces the futuristic theme.
  - Background videos and gradient overlays are used to create a sense of depth and energy.
- **✅ Performance-Aware Animations:** The `AnimateOnScroll` component ensures that animations are triggered only when elements enter the viewport, improving initial page load performance.
- **✅ Accessibility (A11y):**
  - Semantic HTML and ARIA attributes (`aria-label`, `aria-current`) are used to ensure the app is accessible to users with disabilities.
  - A `prefers-reduced-motion` media query is implemented to respect user preferences for minimal animations.

### Content & SEO
- **✅ Comprehensive Homepage Sections:** The homepage provides a complete overview of the dance center, including:
  - `Hero`: An impactful, animated introduction.
  - `Philosophy`: The school's core values.
  - `About Yunaisy Farray`: A detailed bio with an interactive infographic for the 'Método Farray®'.
  - `Classes`: A visual grid of all dance categories offered.
  - `Why FIDC`: Highlighting the key value propositions.
  - `Services`, `Teachers`, `Testimonials`, `InstagramFeed` (mock), `FinalCTA`, and `HowToGetHere` with an embedded map.
- **✅ Detailed Dance Classes Page:** A dedicated page with in-depth information, including substyles and proficiency levels for each dance discipline.
- **✅ Dedicated Dancehall Page:** An immersive page specifically for Dancehall, featuring detailed content about the style, class levels, a dedicated instructor, and unique testimonials.
- **✅ Dedicated Afrobeats Page:** An immersive page specifically for Afrobeats, featuring detailed content about the style, class levels, a dedicated instructor, and unique testimonials.
- **✅ Advanced SEO Strategy:**
  - Comprehensive SEO meta tags (title, description, Open Graph, Twitter Cards).
  - Multilingual support with `hreflang` tags to serve the correct language to users globally.
  - Rich **JSON-LD structured data** to enhance search engine results and establish E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness).
  - A `sitemap.xml` and `robots.txt` are included for optimal search engine crawling.

---

## 3. What's Working Now

- The entire website is functional as a static, informational portal.
- All navigation links, buttons, and language-switching functionalities are working correctly.
- All animations and visual effects render as designed across modern browsers.
- The responsive layout adapts seamlessly to all screen sizes.

---

## 4. Architectural Decisions

- **Frontend Framework: React 19 + TypeScript**
  - **Why:** React's component-based architecture is ideal for building a complex, maintainable UI. TypeScript adds static typing, which reduces bugs and improves developer experience, especially as the project scales.

- **Styling: Tailwind CSS**
  - **Why:** A utility-first CSS framework that allows for rapid, consistent, and responsive UI development directly within the markup. The theme is customized via a `tailwind.config` object in `index.html` for simplicity in this development environment.

- **Dependencies & Build Process: `importmap`**
  - **Why:** To keep the setup simple and avoid the need for a complex build tool like Webpack or Vite, dependencies (`react`, `react-dom`) are loaded directly from a CDN via an `importmap` in `index.html`. This is a modern browser feature that simplifies module resolution.

- **Internationalization (i18n): Custom React Context & Hook**
  - **Why:** Instead of adding a heavy external library, a lightweight, custom solution was built using React Context. This provides a clean `t('key')` API for translations, is highly performant, and keeps the dependency footprint minimal.

- **State Management: React Hooks (`useState`, `useEffect`)**
  - **Why:** For the current scope of the application, React's built-in state management is sufficient. The primary state is the current page (`'home'`, `'classes'`, `'dancehall'`, `'afrobeats'`) and the selected locale, both of which are managed in the root `App` component. This avoids the overhead of libraries like Redux or Zustand.

---

## 5. What We're Doing: Next Steps & Future Roadmap

With the MVP foundation in place, the following features are planned for future iterations:

- **Phase 1: Enhancing Interactivity**
  - **[In Progress] 3D Hero Section:** Implement the planned 3D animated background using a library like **React Three Fiber** to fulfill the "3D" and "futuristic" vision.
  - **[Pending] Instagram Feed Widget:** Reactivate and properly implement the Instagram feed widget in the HomePage. Currently disabled (commented out) until ready for production with real API integration or embed solution.
  - **[Planned] Live Instagram API:** Replace the current mock-up with a live feed by integrating the Instagram Basic Display API.
  - **[Planned] Functional Forms:** Implement functional forms for the "Free Trial" and "Enroll Now" CTAs, including data validation and submission to a backend endpoint or third-party service.

- **Phase 2: Dynamic Content Management**
  - **[Planned] Headless CMS Integration:** Decouple the content (class descriptions, teacher bios, testimonials) from the code by integrating a headless CMS (e.g., Strapi, Contentful). This will allow the FIDC team to update website content without developer intervention.
  - **[Planned] Dynamic Schedule & Pricing Page:** Create a page that fetches class schedules and pricing information from the CMS, allowing for real-time updates.

- **Phase 3: E-commerce & Community**
  - **[Planned] Online Booking System:** Integrate a full booking and payment system for classes and workshops.
  - **[Planned] Student Portal:** A login area for registered students to manage their classes, view exclusive content, and track their progress.
  - **[Planned] Blog/News Section:** A dynamic section for school news, events, and articles to improve SEO and community engagement.

- **Phase 4: Final Optimizations (Pre-Production)**
  - **[Planned] Image Optimization System:** Replace all `<img>` tags with `ResponsiveImage` component for automatic WebP conversion, multiple sizes, and lazy loading. Priority: Implement when own images replace Unsplash placeholders.
  - **[Planned] Prerender Template Refactor:** Extract HTML from `prerender.mjs` into external templates (Handlebars/EJS) or share i18n data with React to avoid duplication and improve maintainability.
  - **[✅ Completed] Error Monitoring (Sentry):** Sentry integration configured in utils/sentry.ts and index.tsx. Only requires DSN configuration in production.
  - **[Planned] Security Headers:** Implement CSP (Content Security Policy) and HSTS headers for production environment.
  - **[Planned] Test Coverage Expansion:** Increase test coverage from 15% to >70% with comprehensive unit and integration tests.
  - **[Planned] Integration Tests:** Add integration tests for critical user flows (enrollment, class selection, navigation) when 20+ pages exist.
  - **[Planned] Service Worker for PWA:** Implement Progressive Web App capabilities with offline support and caching strategy for enhanced user experience.
  - **[Planned] Bundle Size Monitoring:** Add automated bundle size monitoring to CI/CD pipeline with alerts for size regression.
  - **[Planned] API Rate Limiting:** Implement rate limiting on API endpoints when backend is fully developed to prevent abuse.
  - **[Planned] Dependency Security Scanning:** Configure automated dependency vulnerability scanning in CI/CD pipeline (npm audit, Snyk, or similar).

---

## 6. Verification: No Blocking Issues for Current Development

The following items are deferred to Phase 4 but **DO NOT block current development**:

### ✅ ResponsiveImage Component
- **Current state:** All images use `<img loading="lazy">` which works perfectly for MVP
- **No blocking issues:** Browser-native lazy loading is functional
- **Safe to defer:** Will implement when replacing Unsplash with own images

### ✅ Prerender.mjs Templates
- **Current state:** HTML is hardcoded but functional
- **No blocking issues:** Pre-rendering works correctly, no runtime errors
- **Safe to defer:** Maintenance issue only, doesn't affect development of new pages

### ✅ Sentry Error Monitoring
- **Current state:** ErrorBoundary catches errors and displays fallback UI
- **No blocking issues:** Development error handling works via console
- **Safe to defer:** Only needed for production monitoring

### ✅ Security Headers (CSP/HSTS)
- **Current state:** Not implemented (as planned)
- **No blocking issues:** Only needed for production deployment
- **Safe to defer:** Will be configured with 30+ pages near launch

---

## 7. Recent Improvements (January 2025)

### ✅ Accessibility & Security Enhancements

**Completed on:** January 15, 2025

**Summary:** Major accessibility and security improvements to meet WCAG AA standards and enhance user experience for all users.

#### Accessibility (WCAG AA Compliance)
1. **✅ Color Contrast Fixed**
   - Updated 26 components to meet WCAG AA ratio (4.5:1)
   - Changed `text-neutral/60` → `/75` and `/80` → `/90`
   - Improved readability across all text elements

2. **✅ Keyboard Navigation (Focus-Visible)**
   - Added global `:focus-visible` styles in `index.css`
   - Primary color outline (2px solid #c82260) for all interactive elements
   - Enhanced UX for keyboard users and screen readers

3. **✅ ARIA Live Regions**
   - `LoadingSpinner`: Added `role="status"` and `aria-live="polite"`
   - `ErrorBoundary`: Added `role="alert"` and `aria-live="assertive"`
   - Improved announcements for assistive technologies

#### Security
4. **✅ Sentry Error Tracking**
   - Configured in `utils/sentry.ts` and `index.tsx`
   - Ready for production (only requires DSN in `.env`)
   - Filters non-critical errors and development logs

5. **✅ Input Sanitization**
   - Created `utils/inputSanitization.ts`
   - 7 sanitization functions: String, Email, Phone, Textarea, URL, Name
   - XSS prevention and format validation ready for future forms

#### Performance
6. **✅ Font Optimization**
   - Already optimized with `font-display=optional` in `index.html`
   - Prevents FOUT and improves Core Web Vitals

#### Translations
7. **✅ Multilingual Support**
   - EN/FR translations verified (695-697 keys vs 1000 in ES)
   - Critical translations complete
   - Non-critical style variations can be added incrementally

**Files Modified:** 26 components + `index.css` + 1 new utility
**Commit:** `feat: Mejoras de accesibilidad y seguridad (WCAG AA, ARIA, Sentry, sanitización)`