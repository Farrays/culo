# Copilot Instructions for Farray's Center Web

## Project Overview

**Farray's Center** is a multilingual (ES/EN/CA/FR) React + TypeScript dance school website with server-side prerendering (SSR). It uses Vite, TailwindCSS, and React Router for a modern, SEO-optimized experience targeting Dancehall, Afrobeats, and other urban dance classes in Barcelona.

**Current branch:** `feature/dancehall-v2-hybrid` – Dynamic page creation system with v2 hybrid layouts.

---

## Architecture & Data Flows

### Core Stack
- **Framework:** React 19 + TypeScript (strict mode)
- **Build:** Vite 6 with React plugin + TailwindCSS 3
- **Routing:** React Router 7 with locale-prefixed URLs (`/:locale/...`)
- **i18n:** Custom hook-based system with lazy-loaded locale modules
- **Rendering:** Hybrid approach—server-side prerendering + client-side hydration
- **Testing:** Vitest + React Testing Library (jsdom environment)
- **Styling:** TailwindCSS with custom holographic effects & brand colors

### URL Structure & Locale Routing
```
/                          → Redirects to /{defaultLocale} (Spanish)
/:locale                   → Home page (es/en/ca/fr)
/:locale/clases            → Classes listing page
/:locale/clases/{slug}     → Individual class detail page (Dancehall, Afrobeats, etc.)
/:locale/404               → Localized 404 page

Legacy redirects:
/clases → /{locale}/clases
/dancehall → /{locale}/clases/dancehall-barcelona  (old URL → new)
```

### I18n System (Critical Architecture)
**Location:** `hooks/useI18n.tsx` + `i18n/locales/`

- **Translation loading:** Lazy-loaded via dynamic `import()` to reduce initial bundle
- **Persistence:** localStorage + cookies (for SSR hydration pre-setting)
- **Priority:** localStorage → cookie → navigator.language → Spanish (default)
- **Cache:** `translationsCache` object prevents reloading same locale
- **Type safety:** `TranslationKeys` type ensures all keys are available

**Key functions:**
```tsx
useI18n()        // Hook: returns { locale, setLocale, t(key), isLoading }
t('key')         // Get translation (returns key if missing in DEV)
setLocale(lang)  // Change locale + persist to localStorage/cookie
```

**Translation files structure:**
```typescript
// i18n/locales/es.ts (and en.ts, ca.ts, fr.ts)
export const es = {
  'homepageHeroTitle': 'Títol en Espanyol',
  'dancehallFaqQ1': '¿Pregunta 1?',
  // ... all keys must be here
} as const;
export type TranslationKeys = typeof es;  // Enforced type
```

### Prerendering & Hydration Pipeline
**Location:** `prerender.mjs` + `index.tsx`

**How it works:**
1. **Build step:** `npm run build` → Vite builds SPA to `dist/`
2. **Prerender step:** `node prerender.mjs` reads `dist/index.html` and generates static pages:
   - Creates nested directories: `dist/{locale}/{page}/index.html`
   - Injects SEO metadata (title, description, canonical, hreflang, OG tags)
   - Pre-sets locale via inline script (`localStorage.setItem()` before React mounts)
   - Marks root div with `data-prerendered="true"` for hydration detection
3. **Client hydration:** `index.tsx` detects prerendered content and calls `hydrateRoot()` instead of `createRoot()`

**Routes prerendered (16 total):**
- 4 languages × 4 pages = 16 static HTML files
- Pages: home, classes (/clases), dancehall (/clases/dancehall-barcelona), afrobeats (/clases/afrobeats-barcelona)

---

## Component Architecture & Patterns

### Page Components
**Location:** `components/DancehallPageV2.tsx` (template), `components/DanceClassesPage.tsx`, etc.

**Key characteristics:**
- Use Helmet for dynamic SEO (from `react-helmet-async`)
- Import i18n hook: `const { t, locale } = useI18n()`
- Structure: Hero → Problem-Agitate → Benefits → Schedule → FAQs → CTA
- Include structured data schema components (`SchemaMarkup.tsx`)
- Lazy load with Suspense in `App.tsx` to reduce initial bundle

**Example pattern:**
```tsx
const DancehallPageV2: React.FC = () => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';
  
  return (
    <>
      <Helmet>
        <title>{t('dancehallPageTitle')}</title>
        <meta name="description" content={t('dancehallPageDesc')} />
        <link rel="canonical" href={`${baseUrl}/${locale}/clases/dancehall-barcelona`} />
      </Helmet>
      <main>
        {/* Page sections */}
      </main>
    </>
  );
};
```

### Reusable Section Components
- `ProblemAgitateSectionV2.tsx` – Problem/solution narrative
- `BenefitsGridSection.tsx` – 6-7 numbered benefits
- `ScheduleSection.tsx` – Class schedules with teacher names
- `FAQSection.tsx` – Accordion FAQs with schema
- `CulturalHistorySection.tsx` – Background/cultural context
- `HowItWorksSection.tsx` – Process explanation with icons
- `AnimateOnScroll.tsx` – Scroll-triggered animations (Intersection Observer)

### Image Optimization
**Location:** `src/components/ResponsiveImage.tsx`, `vite-imagetools` plugin

**Flow:**
1. Place raw image in `public/images/classes/{className}/raw/`
2. Run `npm run build:images` (uses `scripts/build-images.mjs` + Sharp)
3. Generates multiple sizes & formats: `{base}_640.webp`, `{base}_960.webp`, `{base}.jpg`
4. Import with vite-imagetools query: `import img from './image.jpg?url&optimize'`
5. Use `ResponsiveImage` component for responsive `<picture>` rendering

---

## Developer Workflows

### Essential Commands
```bash
npm run dev              # Start Vite dev server (http://localhost:5173)
npm run build            # Production build + prerendering
npm run preview          # Local preview of production build
npm run test             # Run tests in watch mode
npm run test:ui          # Run tests with visual UI
npm run test:run         # Single test run (CI mode)
npm run test:coverage    # Coverage report
npm run lint             # ESLint check (strict mode, no warnings)
npm run lint:fix         # Auto-fix linting issues
npm run format           # Prettier format all files
npm run typecheck        # TypeScript type checking
npm run build:images     # Optimize images (WebP + JPG)
npm run create:class     # Interactive class page generator (Node.js CLI)
```

### Creating a New Class Page
```bash
# 1. Generate template (interactive CLI)
npm run create:class

# Or non-interactive:
npm run create:class -- --name=salsa --instructor="Ana García" --specialty="Salsa Cubana"

# 2. Script creates:
#    - components/SalsaPage.tsx (copied from DancehallPageV2.tsx)
#    - i18n skeleton in each locale file
#    - public/images/classes/salsa/ directory structure

# 3. Next steps:
#    - Add 3 images to: public/images/classes/salsa/raw/
#    - Run: npm run build:images
#    - Update i18n with real text (all 4 languages)
#    - Add route in App.tsx
#    - Test locally: npm run dev
```

### Git Workflow (Safe Branching)
```bash
# 1. Never commit directly to main
git checkout -b feat/new-feature  # or fix/, content/, etc.

# 2. Make changes, review locally
npm run dev
npm run lint
npm run test

# 3. Commit with descriptive message
git add .
git commit -m "feat: Add Salsa class page with SEO

- Created SalsaPage component
- Added i18n translations (4 languages)
- Optimized 3 images
- Included FAQs with schema markup"

# 4. Push & open PR on GitHub
git push -u origin feat/new-feature

# 5. Vercel generates preview URL automatically
# 6. Review preview, then merge PR
```

### Pre-Deployment Checklist (from `.claude/QA_CHECKLIST.md`)
- [ ] **Functionality:** All features work locally & in Vercel preview
- [ ] **SEO:** Google Rich Results Test passes (schema valid)
- [ ] **Performance:** Lighthouse score > 90 (all metrics)
- [ ] **Responsive:** Mobile (320px) + Tablet (768px) + Desktop (1920px)
- [ ] **i18n:** All 4 languages display correctly, URLs have locale prefix
- [ ] **Images:** Optimized, alt text present, correct aspect ratios
- [ ] **Links:** Internal links work, external links open in `target="_blank"`
- [ ] **Accessibility:** Keyboard navigation, screen reader friendly, WCAG contrast
- [ ] **Code:** No TypeScript errors, ESLint passes, no unused variables
- [ ] **Build:** `npm run build` succeeds, prerender generates 16 pages

---

## Project-Specific Conventions

### Naming Conventions
- **Components:** PascalCase, suffix with `Page` for routes (e.g., `DancehallPageV2.tsx`)
- **Hooks:** camelCase, prefix with `use` (e.g., `useI18n.tsx`, `useLazyImage.tsx`)
- **Translation keys:** camelCase, descriptive (e.g., `dancehallPageTitle`, `dancehallFaqQ1`)
- **Routes:** lowercase with hyphens (e.g., `/clases/dancehall-barcelona`)
- **CSS classes:** Use TailwindCSS utilities; custom classes are minimal

### TypeScript Patterns
- **Strict mode enabled:** All code must pass strict type checking
- **No `any` type** – Always define interfaces or use generics
- **React.FC pattern:** All components are `React.FC<Props>`
- **Union types for variants:** `type Locale = 'en' | 'es' | 'ca' | 'fr'`
- **Props interfaces:** Define for all components (even if empty)

### Component Structure
```tsx
import React, { ... } from 'react';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '../hooks/useI18n';
import type { SomeType } from '../types';

interface ComponentProps {
  // Props with JSDoc comments
  children: React.ReactNode;
}

export const MyComponent: React.FC<ComponentProps> = ({ children }) => {
  const { t, locale } = useI18n();  // Always get locale for consistency
  
  return (
    <>
      <Helmet>
        {/* SEO meta tags */}
      </Helmet>
      <main>
        {/* Component JSX */}
      </main>
    </>
  );
};

export default MyComponent;
```

### Error Handling
- **Error Boundary:** Root component wrapped in `<ErrorBoundary>` (class component)
- **Development vs Production:** Error details shown only in `import.meta.env.DEV`
- **Sentry integration:** In `utils/sentry.ts` (initialized at startup)
- **Missing translations:** Return key string in DEV, warn in console

### Testing Patterns
**Location:** `components/__tests__/`, `hooks/__tests__/`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });
});
```

**Setup:** `test/setup.ts` mocks IntersectionObserver globally

---

## Key Integration Points

### External Dependencies
- **React Router:** Handles locale-based routing, URL parsing, navigation
- **react-helmet-async:** Manages `<head>` SEO tags dynamically
- **Sentry:** Error tracking (optional, configured in `utils/sentry.ts`)
- **vite-imagetools:** Image optimization during build
- **TailwindCSS:** All styling (no CSS modules or styled-components)

### Build Pipeline Hooks
- **Vite plugins:** `@vitejs/plugin-react`, `vite-imagetools`, `rollup-plugin-visualizer`
- **Prerender hook:** Custom `prerender.mjs` runs after Vite build
- **Bundle analysis:** `dist/stats.html` generated after each build

### Cross-Component Communication
- **Global state:** i18n context via `useI18n()` hook
- **Props drilling:** Minimal—most data comes from constants or i18n
- **No Redux/Zustand:** Simple custom hooks are sufficient for current scope

---

## Common Pitfalls to Avoid

1. **Don't modify `main` branch directly** → Always use feature branches
2. **Don't hardcode strings** → Always use `t('key')` for user-facing text
3. **Don't add images without optimization** → Always run `npm run build:images`
4. **Don't skip TypeScript checks** → Run `npm run typecheck` before commit
5. **Don't create routes without locale prefix** → All routes must have `/:locale`
6. **Don't forget hreflang links** → SEO requires all 4 languages declared
7. **Don't use ES5 syntax** → Target ES2022, use modern patterns
8. **Don't test only desktop** → Always verify mobile & tablet layouts

---

## File Structure Reference

```
web/
├── .github/
│   └── copilot-instructions.md     ← You are here
├── .claude/                         ← Claude-specific docs
│   ├── WORKFLOW_GUIDE.md
│   ├── PROMPT_TEMPLATES.md
│   └── QA_CHECKLIST.md
├── components/                      ← React page & section components
│   ├── DancehallPageV2.tsx          ← Template for new pages
│   ├── DanceClassesPage.tsx
│   ├── Header.tsx                   ← Main header + language selector
│   ├── Footer.tsx
│   ├── FAQSection.tsx               ← Reusable sections
│   ├── ScheduleSection.tsx
│   ├── __tests__/                   ← Component tests
│   └── ErrorBoundary.tsx            ← Global error handling
├── hooks/
│   └── useI18n.tsx                  ← Translation & locale management
├── i18n/locales/
│   ├── es.ts, en.ts, ca.ts, fr.ts  ← Translation keys (4 languages)
│   └── index.ts                     ← Lazy loader
├── public/images/classes/
│   ├── dancehall/
│   │   ├── raw/                     ← Original images (source)
│   │   └── img/                     ← Optimized (WebP, JPG, multiple sizes)
│   └── ...other classes
├── scripts/
│   ├── build-images.mjs             ← Image optimization (Sharp)
│   └── create-class-page.mjs        ← Page generator CLI
├── src/components/
│   ├── ResponsiveImage.tsx          ← Responsive image wrapper
│   └── SmartVideo.tsx               ← Video component
├── test/
│   └── setup.ts                     ← Vitest configuration
├── App.tsx                          ← Router definition
├── index.tsx                        ← React entry point (hydration logic)
├── types.ts                         ← Shared TypeScript types
├── vite.config.ts                   ← Vite configuration
├── vitest.config.ts                 ← Test configuration
├── tailwind.config.js               ← TailwindCSS custom colors & animations
├── prerender.mjs                    ← Server-side prerendering script
├── package.json                     ← Dependencies & scripts
└── tsconfig.json                    ← TypeScript strict mode config
```

---

## Quick Reference: When to Edit What

| Task | Files to Edit | Don't Touch |
|------|---------------|------------|
| Add new class page | `components/NewPage.tsx`, `App.tsx`, i18n files, images | Header, Footer, config |
| Update texts | i18n locale files (`i18n/locales/*.ts`) | Component logic |
| Add FAQ to page | Component JSX + i18n keys | Structure/layout |
| Fix styling | TailwindCSS classes in component | `tailwind.config.js` (unless adding colors) |
| Add image | `public/images/classes/{class}/raw/`, run `npm run build:images` | No manual HTML image tags |
| Change URL structure | `App.tsx` routes + `prerender.mjs` routes | Already-published URLs (use redirects) |

---

## Resources & Documentation

- **Internal:** `.claude/README.md` – Project documentation index
- **Deployment:** Vercel (auto-deploy on main, preview on PRs)
- **Type definitions:** `types.ts` – Central TypeScript interfaces
- **SEO validation:** https://search.google.com/test/rich-results
- **Performance:** https://pagespeed.web.dev/
- **Accessibility:** https://webaim.org/resources/contrastchecker/

---

**Last updated:** 2025-01-11 | **Branch:** feature/dancehall-v2-hybrid
