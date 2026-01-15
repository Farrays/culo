import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { imagetools } from 'vite-imagetools';
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Image optimization - automatically generates WebP/AVIF
    imagetools({
      defaultDirectives: url => {
        if (url.searchParams.has('optimize')) {
          return new URLSearchParams({
            format: 'webp;avif;jpg',
            quality: '80',
          });
        }
        return new URLSearchParams();
      },
    }),
    // Bundle analyzer - generates stats.html after build
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap', // or 'sunburst', 'network'
    }),
    // Brotli compression (better than gzip: 15-20% smaller)
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024, // Only compress files larger than 1KB
      deleteOriginFile: false,
    }),
    // Gzip compression (fallback for older browsers)
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
      deleteOriginFile: false,
    }),
  ],
  build: {
    // Source maps for Sentry - 'hidden' generates maps without exposing source code
    sourcemap: 'hidden',
    // Single CSS file for better caching
    cssCodeSplit: false,
    // Minification with Terser for better compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        // Better chunk naming for long-term caching
        chunkFileNames: chunkInfo => {
          // Stable names for translation chunks (locale files)
          if (chunkInfo.name && /^(es|en|ca|fr)$/.test(chunkInfo.name)) {
            return `assets/${chunkInfo.name}-[hash].js`;
          }
          return 'assets/[name]-[hash].js';
        },
        manualChunks: id => {
          // Vendor chunks - core React
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'react-vendor';
          }
          // Router and helmet
          if (
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/react-helmet')
          ) {
            return 'router-vendor';
          }
          // Analytics (lazy-loaded)
          if (id.includes('node_modules/web-vitals')) return 'analytics';
          // Sanitization
          if (id.includes('node_modules/dompurify')) return 'sanitization';
          // i18n translations - separate chunk per locale for reduced initial load
          if (id.includes('/locales/es.ts')) return 'i18n-es';
          if (id.includes('/locales/en.ts')) return 'i18n-en';
          if (id.includes('/locales/ca.ts')) return 'i18n-ca';
          if (id.includes('/locales/fr.ts')) return 'i18n-fr';
          // Scheduler (React internals, often unused)
          if (id.includes('node_modules/scheduler')) return 'react-vendor';
          return undefined;
        },
      },
    },
    // Module preload for faster loading
    modulePreload: {
      polyfill: true,
    },
  },
  css: {
    // Ensure CSS is processed correctly
    devSourcemap: false,
  },
});
