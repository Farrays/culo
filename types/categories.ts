// Types for Categories Section (Home Page)
// Verified: Vite + React architecture

export interface Category {
  key: string; // 'salsa_bachata', 'danza', 'urbano', etc.
  pillarSlug: string; // '/clases/salsa-bachata-barcelona/', '/clases-danza-barcelona/', etc.
  imageUrl: string; // Unsplash URL temporal
}

export interface CategoryCardProps {
  category: Category;
}
