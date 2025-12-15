<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# Farray's International Dance Center - Web

[![CI/CD Pipeline](https://github.com/Farrays/web-local/actions/workflows/ci.yml/badge.svg)](https://github.com/Farrays/web-local/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)

**Multilingual dance school website with server-side prerendering (SSR)**

[Live Site](https://www.farrayscenter.com) | [Storybook](https://storybook.farrayscenter.com)

</div>

---

## Quick Start

**Prerequisites:**

- Node.js 20+ (LTS recommended)
- npm 10+

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Opens at http://localhost:5173

# Production build (prerenders 53 pages)
npm run build
npm run preview
```

---

## Available Scripts

| Script                    | Description                  |
| ------------------------- | ---------------------------- |
| `npm run dev`             | Start dev server with HMR    |
| `npm run build`           | Production build + prerender |
| `npm run preview`         | Preview production build     |
| `npm run test`            | Run tests (watch mode)       |
| `npm run test:run`        | Run tests once (CI)          |
| `npm run test:coverage`   | Generate coverage report     |
| `npm run lint`            | ESLint check                 |
| `npm run lint:fix`        | Auto-fix linting issues      |
| `npm run typecheck`       | TypeScript type checking     |
| `npm run storybook`       | Launch Storybook (port 6006) |
| `npm run build-storybook` | Build static Storybook       |
| `npm run size`            | Check bundle size limits     |
| `npm run lighthouse`      | Run Lighthouse CI            |

---

## Project Structure

```
web-local/
├── components/           # 114 React components
│   ├── *Page.tsx         # Page components
│   ├── header/           # Header navigation
│   ├── home/             # Homepage sections
│   ├── shared/           # Reusable components
│   ├── templates/        # Page templates
│   ├── stories/          # Storybook stories
│   └── __tests__/        # Component tests (240 tests)
├── constants/            # Dance class configurations
├── hooks/                # Custom hooks (useI18n)
├── i18n/locales/         # Translations (ES, CA, EN, FR)
├── lib/                  # Utilities (icons, helpers)
├── public/images/        # Optimized images (WebP)
├── scripts/              # Build scripts
├── .github/workflows/    # CI/CD pipeline
├── .storybook/           # Storybook config
└── .husky/               # Git hooks (pre-commit)
```

---

## Features

| Feature                                    | Status |
| ------------------------------------------ | ------ |
| Multilingual (ES, CA, EN, FR)              | Done   |
| SEO Optimized (53 prerendered pages)       | Done   |
| Schema Markup (LocalBusiness, Course, FAQ) | Done   |
| Performance (<200KB gzip)                  | Done   |
| Accessibility (WCAG 2.1 AA)                | Done   |
| CI/CD (GitHub Actions)                     | Done   |
| Storybook Documentation                    | Done   |
| Pre-commit Hooks (Husky)                   | Done   |
| Bundle Size Monitoring                     | Done   |

---

## Development Workflow

### Pre-commit Hooks

Husky runs automatically on every commit:

- ESLint with `--fix`
- Prettier formatting

### Component Development

```bash
# Launch Storybook for isolated component development
npm run storybook
```

### Testing

```bash
# Run all 240 tests
npm run test:run

# Watch mode during development
npm run test

# Coverage report
npm run test:coverage
```

### Type Safety

```bash
npm run typecheck
```

---

## CI/CD Pipeline

GitHub Actions runs on every push/PR to `main` and `develop`:

1. **TypeScript** - Type checking
2. **ESLint** - Code quality
3. **Vitest** - 240 unit tests
4. **Build** - Production build validation
5. **Lighthouse** - Performance audits
6. **Security** - npm audit (moderate+ blocking)
7. **Bundle Size** - Comments on PRs with size report

---

## Environment Variables

Copy `.env.example` to `.env` for local development.

| Variable                 | Description           | Required   |
| ------------------------ | --------------------- | ---------- |
| `VITE_SENTRY_DSN`        | Sentry error tracking | Production |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics      | Production |

Set in Vercel: Settings > Environment Variables

---

## Tech Stack

- **Framework:** React 19
- **Language:** TypeScript 5.8
- **Build:** Vite 6.2
- **Styling:** TailwindCSS 3.4
- **Routing:** React Router 7
- **Testing:** Vitest + Testing Library
- **Documentation:** Storybook 10
- **CI/CD:** GitHub Actions
- **Hosting:** Vercel

---

## License

Proprietary - 2025 Farray's International Dance Center
