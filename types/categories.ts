// Types for Categories Section (Home Page)
// Verified: Vite + React architecture

export interface OptimizedImage {
  src: string; // Default JPEG src
  srcSetAvif: string; // AVIF srcset
  srcSetWebp: string; // WebP srcset
  srcSetJpeg: string; // JPEG srcset
  placeholder?: string; // LQIP base64 data URL
  dominantColor?: string; // Dominant color for placeholder
  objectPosition?: string; // CSS object-position for cropping control (e.g., 'top', 'center 30%')
}

export interface Category {
  key: string; // 'salsa_bachata', 'danza', 'urbano', 'fitness', 'todas'
  pillarSlug: string; // '/clases/salsa-bachata-barcelona', '/clases/danza-barcelona', etc.
  imageUrl: string; // Fallback URL
  optimizedImage?: OptimizedImage; // Optimized image with srcsets
}

export interface CategoryCardProps {
  category: Category;
}
