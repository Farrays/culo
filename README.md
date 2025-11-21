<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# Farray's International Dance Center - Web

[![CI/CD Pipeline](https://github.com/YOUR_USERNAME/web-local/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/web-local/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646cff.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)

**Multilingual dance school website with server-side prerendering (SSR)**

</div>

## 🚀 Quick Start

**Prerequisites:**  
- Node.js 20+ (LTS recommended)
- npm 10+

**Development:**

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables (optional):
   ```bash
   cp .env.example .env
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:5173`

**Production Build:**

```bash
npm run build        # Builds + prerenders 53 pages
npm run preview      # Preview production build locally
```

## 📦 Project Structure

```
web-local/
├── components/          # React page & section components
│   ├── DancehallPage.tsx
│   ├── DanceClassesPage.tsx
│   ├── shared/          # Reusable components (Breadcrumb, etc.)
│   └── __tests__/       # Component tests
├── hooks/               # Custom React hooks (useI18n)
├── i18n/locales/        # Translation files (es/ca/en/fr)
├── public/images/       # Optimized images (WebP, JPG)
├── scripts/             # Build scripts (image optimization, etc.)
├── .github/workflows/   # CI/CD (GitHub Actions)
└── prerender.mjs        # SSR prerendering config
```

## 🌍 Features

- ✅ **Multilingual**: Spanish, Catalan, English, French
- ✅ **SEO Optimized**: 53 prerendered pages with schema markup
- ✅ **Performance**: Code splitting, lazy loading, <200KB gzip
- ✅ **Accessibility**: WCAG 2.1 AA compliant
- ✅ **CI/CD**: Automated tests, type checking, builds
- ✅ **Responsive**: Mobile-first design (320px → 1920px)

## 🧪 Testing & Quality

```bash
npm run test             # Run tests (watch mode)
npm run test:run         # Run tests once (CI mode)
npm run test:coverage    # Generate coverage report
npm run lint             # ESLint check
npm run lint:fix         # Auto-fix linting issues
npm run typecheck        # TypeScript type checking
```

## 📚 Documentation

- [Architecture](ARCHITECTURE.md) - System design & patterns
- [Deployment](DEPLOYMENT.md) - Vercel deployment guide
- [Workflow Guide](.claude/WORKFLOW_GUIDE.md) - Development workflow
- [QA Checklist](.claude/QA_CHECKLIST.md) - Pre-deployment checklist

## 🔑 Environment Variables

See [`.env.example`](.env.example) for full documentation.

**Required for production:**
- `VITE_SENTRY_DSN` - Error tracking (Sentry)
- `VITE_GA_MEASUREMENT_ID` - Analytics (Google Analytics)

**Set in Vercel dashboard** → Settings → Environment Variables

## 📄 License

Proprietary - © 2025 Farray's International Dance Center

---

**Built with:** React 19 • TypeScript • Vite • TailwindCSS • React Router
