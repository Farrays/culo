import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { imagetools } from 'vite-imagetools';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Image optimization - automatically generates WebP/AVIF
    imagetools({
      defaultDirectives: (url) => {
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
  ],
  build: {
    // Enable source maps for Sentry error tracking
    sourcemap: true,
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
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom', 'react-helmet-async'],
          // Security & monitoring chunks
          'sentry': ['@sentry/react'],
          'analytics': ['web-vitals'],
          'sanitization': ['dompurify'],
        },
      },
    },
  },
  css: {
    // Ensure CSS is processed correctly
    devSourcemap: false,
  },
});
