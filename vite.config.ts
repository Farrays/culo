import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { imagetools } from 'vite-imagetools';
import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // PWA with Service Worker for offline caching and performance
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'images/**/*'],
      workbox: {
        // Force SW to update immediately and take control
        skipWaiting: true,
        clientsClaim: true,
        // Cache strategies for different resource types
        runtimeCaching: [
          {
            // Cache images with stale-while-revalidate (fast, fresh eventually)
            urlPattern: /\.(?:png|jpg|jpeg|webp|avif|svg|gif)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            // Cache fonts with cache-first (rarely change)
            urlPattern: /\.(?:woff|woff2|ttf|eot)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            // Cache JS/CSS with stale-while-revalidate
            urlPattern: /\.(?:js|css)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
          {
            // Cache API/page requests with network-first (always try fresh)
            urlPattern: /^https:\/\/www\.farrayscenter\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 1 day
              },
            },
          },
        ],
        // Pre-cache critical assets (exclude HTML to avoid hydration issues with stale cache)
        globPatterns: ['**/*.{js,css,ico,png,svg,woff2}'],
        // Don't pre-cache everything to keep SW size small
        globIgnores: ['**/stats.html', '**/node_modules/**'],
        // Don't use navigateFallback - let the network handle HTML requests
        // This prevents stale HTML from being served
        navigateFallback: null,
      },
      manifest: {
        name: "Farray's International Dance Center",
        short_name: "Farray's",
        description: 'Academia de baile en Barcelona - Salsa, Bachata, Dancehall y más',
        theme_color: '#0f0f0f',
        background_color: '#0f0f0f',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/images/logo-fidc.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/images/logo-fidc.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
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
    // Optimize chunk splitting for better performance
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
          // Separate React core from React-DOM for better caching
          if (id.includes('node_modules/react/') && !id.includes('react-dom')) {
            return 'react-core';
          }
          if (id.includes('node_modules/react-dom')) {
            return 'react-dom';
          }
          // Router + Helmet bundled together (prevents initialization order issues)
          if (id.includes('node_modules/react-router') || id.includes('node_modules/react-helmet')) {
            return 'router-vendor';
          }
          // Scheduler (React internals)
          if (id.includes('node_modules/scheduler')) {
            return 'react-core';
          }
          // Analytics (lazy-loaded)
          if (id.includes('node_modules/web-vitals')) return 'analytics';
          // Sanitization
          if (id.includes('node_modules/dompurify')) return 'sanitization';

          // i18n translations are now loaded dynamically via resourcesToBackend
          // (JSON files loaded on demand, not bundled as JS chunks)

          // Heavy media constants - separate chunk (only loaded when needed)
          // These are NOT needed on HomePage, so we isolate them
          if (
            id.includes('/constants/image-alt-texts') ||
            id.includes('/constants/style-images') ||
            id.includes('/constants/teacher-registry') ||
            id.includes('/constants/teacher-images')
          ) {
            return 'constants-media';
          }
          // Blog constants separate (loaded on-demand)
          if (id.includes('/constants/blog/')) {
            return 'blog-constants';
          }
          // Other constants: let Vite bundle them naturally with their consumers
          // This allows HomePage to only load categories.ts + homepage-v2-config.ts

          // Templates - separate chunk (large components)
          if (id.includes('/templates/')) {
            return 'templates';
          }

          // Schema components
          if (id.includes('SchemaMarkup') || id.includes('/schemas/')) {
            return 'schemas';
          }

          return undefined;
        },
      },
    },
    // Increase warning limit for i18n bundles
    // i18n locale files are 1.4-1.6MB each, but only ONE is loaded per user session
    // This is acceptable because: 1) lazy-loaded per locale, 2) cached, 3) Brotli-compressed (~400KB)
    chunkSizeWarningLimit: 1700,
    // Module preload configuration
    // Disable preload for heavy chunks not needed on initial page load (improves LCP for SEO)
    modulePreload: {
      polyfill: true,
      resolveDependencies: (_filename, deps) => {
        // Don't preload heavy chunks that aren't needed on homepage
        // These will still load when actually needed (lazy navigation)
        const heavyChunks = ['templates', 'constants-media', 'blog-constants', 'hls', 'blog-'];
        return deps.filter(dep => !heavyChunks.some(chunk => dep.includes(chunk)));
      },
    },
  },
  css: {
    // Ensure CSS is processed correctly
    devSourcemap: false,
  },
});
