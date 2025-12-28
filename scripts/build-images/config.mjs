/**
 * Image Build System - Configuration
 * ===================================
 * Enterprise-level image optimization configuration
 *
 * @author Farray's International Dance Center
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..', '..');

export const CONFIG = {
  // ============================================================================
  // VERSION - Used for cache invalidation
  // ============================================================================
  version: '2.0.0',

  // ============================================================================
  // RESPONSIVE BREAKPOINTS
  // ============================================================================
  breakpoints: {
    xs: 320,      // Mobile small
    sm: 640,      // Mobile large
    md: 768,      // Tablet
    lg: 1024,     // Tablet landscape / Desktop small
    xl: 1440,     // Desktop
    xxl: 1920,    // Desktop large / Retina
  },

  // Get breakpoints as array
  get breakpointSizes() {
    return Object.values(this.breakpoints);
  },

  // ============================================================================
  // OUTPUT FORMATS AND QUALITY
  // ============================================================================
  formats: {
    avif: {
      quality: 70,
      effort: 4,        // 0-9, higher = slower but smaller
      chromaSubsampling: '4:2:0',
    },
    webp: {
      quality: 80,
      effort: 4,        // 0-6
      smartSubsample: true,
    },
    jpeg: {
      quality: 82,
      mozjpeg: true,    // Use mozjpeg encoder for better compression
      chromaSubsampling: '4:2:0',
    },
  },

  // Format processing order (best compression first)
  get formatOrder() {
    return ['avif', 'webp', 'jpeg'];
  },

  // ============================================================================
  // PLACEHOLDER (LQIP) SETTINGS
  // ============================================================================
  placeholder: {
    width: 20,          // Tiny thumbnail width
    quality: 20,        // Low quality for small size
    blur: 10,           // Blur radius
    format: 'webp',     // Output format for base64
  },

  // ============================================================================
  // ASPECT RATIOS
  // ============================================================================
  aspectRatios: {
    '16:9': { width: 16, height: 9, name: 'widescreen' },
    '4:3': { width: 4, height: 3, name: 'standard' },
    '3:2': { width: 3, height: 2, name: 'photo' },
    '1:1': { width: 1, height: 1, name: 'square' },
    '9:16': { width: 9, height: 16, name: 'portrait' },
    '4:5': { width: 4, height: 5, name: 'instagram' },
    '3:4': { width: 3, height: 4, name: 'card' },
  },

  // ============================================================================
  // FOCUS POINTS FOR CROPPING
  // ============================================================================
  focusPoints: {
    center: { x: 0.5, y: 0.5 },
    top: { x: 0.5, y: 0.25 },
    bottom: { x: 0.5, y: 0.75 },
    left: { x: 0.25, y: 0.5 },
    right: { x: 0.75, y: 0.5 },
    'top-left': { x: 0.25, y: 0.25 },
    'top-right': { x: 0.75, y: 0.25 },
    'bottom-left': { x: 0.25, y: 0.75 },
    'bottom-right': { x: 0.75, y: 0.75 },
  },

  // ============================================================================
  // DANCE CLASSES
  // ============================================================================
  classes: [
    'dancehall',
    'twerk',
    'afrobeat',
    'hip-hop-reggaeton',
    'sexy-reggaeton',
    'reggaeton-cubano',
    'femmology',
    'sexy-style',
    'modern-jazz',
    'ballet',
    'contemporaneo',
    'afro-contemporaneo',
    'afro-jazz',
    'stretching',
    'salsa-cubana',
    'bachata',
    'timba',
    'folklore-cubano',
    'salsa-lady-style',
    'bum-bum',
  ],

  // ============================================================================
  // SPECIAL FOLDERS (non-class images)
  // ============================================================================
  specialFolders: {
    categories: {
      path: 'categories',
      description: 'Category cards for Home and Hub pages',
      aspectRatio: '4:3',
      breakpoints: [320, 640, 768, 1024],
    },
    teachers: {
      path: 'teachers',
      description: 'Teacher profile photos',
      aspectRatio: '3:4',
      focus: 'attention',  // Smart crop - focuses on faces
      breakpoints: [320, 640, 960],
    },
    logo: {
      path: 'logo',
      description: 'Logo images',
      aspectRatio: null, // Keep original
      breakpoints: [128, 256, 512, 1024],
    },
    blog: {
      path: 'blog',
      description: 'Blog article images',
      aspectRatio: '16:9',
      breakpoints: [320, 640, 768, 1024, 1440],
    },
    hero: {
      path: 'hero',
      description: 'Hero banner images',
      aspectRatio: '16:9',
      breakpoints: [640, 768, 1024, 1440, 1920],
    },
  },

  // ============================================================================
  // PATHS
  // ============================================================================
  paths: {
    root: ROOT_DIR,
    public: join(ROOT_DIR, 'public'),
    images: join(ROOT_DIR, 'public', 'images'),
    classes: join(ROOT_DIR, 'public', 'images', 'classes'),
    categories: join(ROOT_DIR, 'public', 'images', 'categories'),
    teachers: join(ROOT_DIR, 'public', 'images', 'teachers'),
    logo: join(ROOT_DIR, 'public', 'images', 'logo'),
    blog: join(ROOT_DIR, 'public', 'images', 'blog'),
    hero: join(ROOT_DIR, 'public', 'images', 'hero'),
    manifests: join(ROOT_DIR, 'public', 'images', 'manifests'),
    cache: join(ROOT_DIR, 'node_modules', '.cache', 'build-images'),
  },

  // Template paths for classes
  getClassPaths(className) {
    const base = join(this.paths.classes, className);
    return {
      raw: join(base, 'raw'),
      img: join(base, 'img'),
      manifest: join(this.paths.manifests, className),
    };
  },

  // Template paths for special folders
  getSpecialPaths(folderName) {
    const base = this.paths[folderName] || join(this.paths.images, folderName);
    return {
      raw: join(base, 'raw'),
      img: join(base, 'img'),
      manifest: join(this.paths.manifests, folderName),
    };
  },

  // ============================================================================
  // PROCESSING OPTIONS
  // ============================================================================
  processing: {
    maxConcurrency: 4,    // Parallel processing limit
    batchSize: 8,         // Images per batch
    skipExisting: true,   // Skip already processed images (cache)
  },

  // ============================================================================
  // SEO KEYWORDS BY CLASS
  // ============================================================================
  seoKeywords: {
    'dancehall': 'dancehall-classes',
    'twerk': 'twerk-classes',
    'afrobeat': 'afrobeat-dance',
    'hip-hop-reggaeton': 'hip-hop-reggaeton',
    'sexy-reggaeton': 'sexy-reggaeton',
    'reggaeton-cubano': 'cuban-reggaeton',
    'femmology': 'femmology-dance',
    'sexy-style': 'sexy-style-dance',
    'modern-jazz': 'modern-jazz',
    'ballet': 'ballet-classes',
    'contemporaneo': 'contemporary-dance',
    'afro-contemporaneo': 'afro-contemporary',
    'afro-jazz': 'afro-jazz-dance',
    'stretching': 'stretching-classes',
    'salsa-cubana': 'cuban-salsa',
    'bachata': 'bachata-classes',
    'timba': 'timba-dance',
    'folklore-cubano': 'cuban-folklore',
    'salsa-lady-style': 'salsa-lady-style',
    'bum-bum': 'bum-bum-dance',
  },

  // ============================================================================
  // FILE PATTERNS
  // ============================================================================
  patterns: {
    // Supported input formats
    input: /\.(jpe?g|png|webp|tiff?)$/i,
    // Files to ignore
    ignore: /^(\.|_)|thumbs\.db|\.ds_store/i,
  },
};

export default CONFIG;
