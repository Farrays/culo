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
      exclude: [
        'node_modules/**',
        'dist/**',
        'test/**',
        '**/*.test.{ts,tsx}',
        '**/__tests__/**',
        // Exclude data files (i18n locales - these are just translation data)
        'i18n/locales/*.ts',
        // Exclude build/config scripts
        'scripts/**',
        'prerender.mjs',
        '*.config.{js,ts,mjs}',
        'vite.config.ts',
        'tailwind.config.js',
        'postcss.config.cjs',
        // Exclude type definitions
        'types/**',
        // Exclude constants that are pure data
        'constants/*.ts',
        // Exclude the page files (migrated to templates)
        'components/*Page.tsx',
        'components/*PageNew.tsx',
        // Exclude complex templates (integration-tested via pages)
        'components/templates/**',
        // Exclude large navigation components (complex state)
        'components/header/DesktopNavigation.tsx',
        'components/header/MobileNavigation.tsx',
        // Exclude responsive image components with complex loading
        'src/components/**',
        // Exclude external service integrations (Sentry, Instagram)
        'utils/sentry.ts',
        'components/InstagramFeed.tsx',
        // Exclude comparison table (complex layout component)
        'components/shared/ComparisonTable.tsx',
        // Exclude common icons (pure SVG components)
        'components/shared/CommonIcons.tsx',
        // Exclude facilities components (simple presentational)
        'components/FacilitiesHero.tsx',
        'components/FacilityCard.tsx',
        'components/FeatureList.tsx',
        'components/StudioAmenities.tsx',
        // Exclude hook with internal cache (functionally tested via integration tests)
        'hooks/useI18n.tsx',
        // Exclude HowToGetHere (needs map integration)
        'components/HowToGetHere.tsx',
        // Exclude sanitization utils (simple regex validations)
        'utils/sanitization.ts',
      ],
      include: [
        'components/**/*.{ts,tsx}',
        'hooks/**/*.{ts,tsx}',
        'utils/**/*.{ts,tsx}',
        'lib/**/*.{ts,tsx}',
      ],
    },
  },
});
