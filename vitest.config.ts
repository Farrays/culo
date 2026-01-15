import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      // Realistic thresholds for this codebase
      // Focus on hooks, utilities, and reusable components
      // Thresholds set to current baseline - increase as more tests are added
      thresholds: {
        statements: 23,
        branches: 50,
        functions: 45,
        lines: 23,
      },
      exclude: [
        // === BUILD & CONFIG (not application code) ===
        'node_modules/**',
        'dist/**',
        'test/**',
        '**/*.test.{ts,tsx}',
        '**/__tests__/**',
        '**/*.stories.{ts,tsx}',
        'scripts/**',
        'prerender.mjs',
        '*.config.{js,ts,mjs,cjs}',
        'vite.config.ts',
        'tailwind.config.js',
        'postcss.config.cjs',
        'types/**',

        // === DATA FILES (no logic to test) ===
        'i18n/locales/*.ts', // 12000+ lines of translation strings
        'constants/**/*.ts', // Pure data constants

        // === LANDING PAGES (Facebook Ads only, not indexed) ===
        'components/landing/**',

        // === PAGE COMPOSITIONS (tested via E2E, not unit tests) ===
        'components/pages/**', // Full page components
        'components/templates/**', // Layout templates

        // === EXTERNAL INTEGRATIONS (require mocking entire services) ===
        'utils/sentry.ts',
        'components/InstagramFeed.tsx',
        'components/HowToGetHere.tsx', // Google Maps integration

        // === PURE PRESENTATIONAL (SVG icons, no logic) ===
        'lib/icons.tsx',
        'components/shared/CommonIcons.tsx',

        // === INDEX FILES (re-exports only) ===
        '**/index.ts',
      ],
      include: ['components/**/*.{ts,tsx}', 'hooks/**/*.{ts,tsx}', 'utils/**/*.{ts,tsx}'],
    },
  },
});
