// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-plugin-prettier';

// Browser globals
const browserGlobals = {
  window: 'readonly',
  document: 'readonly',
  navigator: 'readonly',
  console: 'readonly',
  process: 'readonly',
  HTMLElement: 'readonly',
  HTMLDivElement: 'readonly',
  HTMLImageElement: 'readonly',
  HTMLButtonElement: 'readonly',
  IntersectionObserver: 'readonly',
  Image: 'readonly',
  requestAnimationFrame: 'readonly',
  MouseEvent: 'readonly',
  MediaQueryListEvent: 'readonly',
  SVGSVGElement: 'readonly',
  localStorage: 'readonly',
  sessionStorage: 'readonly',
  fetch: 'readonly',
  React: 'readonly',
  Element: 'readonly',
  KeyboardEvent: 'readonly',
  CustomEvent: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  setInterval: 'readonly',
  clearInterval: 'readonly',
  URL: 'readonly',
  HTMLVideoElement: 'readonly',
  HTMLAnchorElement: 'readonly',
  HTMLTextAreaElement: 'readonly',
  HTMLSelectElement: 'readonly',
  HTMLInputElement: 'readonly',
  Storage: 'readonly',
  AbortController: 'readonly',
  DOMException: 'readonly',
  // Service Worker related
  ServiceWorkerRegistration: 'readonly',
  MessageEvent: 'readonly',
};

// Node globals (for scripts and tests)
const nodeGlobals = {
  process: 'readonly',
  console: 'readonly',
  global: 'writable',
};

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: browserGlobals,
    },
    plugins: {
      '@typescript-eslint': typescript,
      react,
      'react-hooks': reactHooks,
      prettier,
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // React rules
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // General
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',

      // Prettier integration
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs', 'test/**/*.ts'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...nodeGlobals,
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
  },
  {
    // Disable no-useless-escape for i18n files (apostrophes in translations)
    files: ['i18n/locales/*.ts'],
    rules: {
      'no-useless-escape': 'off',
    },
  },
  {
    ignores: [
      'i18n/locales/es-temp.cjs',
      'node_modules/',
      'dist/',
      '.next/',
      'coverage/',
      'storybook-static/',
      '*.config.js',
      '*.config.mjs',
      'vite.config.ts',
      'scripts/',
      // Example/documentation files (not part of codebase)
      'FormularioReserva-*.tsx',
      'api-*.js',
      'src-components-*.tsx',
      '*-example.tsx',
      '*-example.js',
      'src/pages/test/',
      // E2E tests and service worker (different runtime)
      'e2e/',
      'playwright.config.ts',
      'public/sw.js',
      // Development/temporary scripts (not in git)
      'analyze-descriptions.mjs',
      'analyze-simple.mjs',
      'comprehensive-fix.mjs',
      'expand-short-descriptions.mjs',
      'final-cleanup.mjs',
      'final-mass-optimize.mjs',
      'find-improvements.mjs',
      'mass-optimize.mjs',
      'optimize-descriptions.mjs',
      'optimize-long.mjs',
      'prerender-final.mjs',
      'prerender-fixed.mjs',
      'prerender-optimized.mjs',
      'prerender-pass2.mjs',
      'quick-analyze.mjs',
      'remove-all-gratis.mjs',
      'second-pass-optimize.mjs',
      'trim-final-8.mjs',
      'trim-too-long.mjs',
    ],
  },
  ...storybook.configs['flat/recommended'],
];
