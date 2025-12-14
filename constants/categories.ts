import type { Category } from '../types/categories';

// Categories data for Home Page
// Primary color verified: #c82260 (primary-accent in tailwind.config)
// Images: Unsplash URLs (temporary - replace with own images)

export const CATEGORIES: Category[] = [
  {
    key: 'salsa_bachata',
    pillarSlug: '/clases/salsa-bachata-barcelona',
    imageUrl:
      'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&h=600&fit=crop&q=80', // Salsa dancers
  },
  {
    key: 'danza',
    pillarSlug: '/clases/danza-barcelona',
    imageUrl:
      'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&h=600&fit=crop&q=80', // Ballet
  },
  {
    key: 'urbano',
    pillarSlug: '/clases/danzas-urbanas-barcelona',
    imageUrl: 'https://images.unsplash.com/photo-1545224144-b38cd309ef69?w=800&h=600&fit=crop&q=80', // Hip hop dance studio
  },
  {
    key: 'fitness',
    pillarSlug: '/clases/entrenamiento-bailarines-barcelona',
    imageUrl:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=80', // Fitness workout
  },
  {
    key: 'todas',
    pillarSlug: '/clases/baile-barcelona',
    imageUrl:
      'https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=800&h=600&fit=crop&q=80', // All dance classes
  },
];

// TODO: Replace Unsplash URLs with own images
// Suggested path: /images/categories/[salsa_bachata|danza|urbano|fitness|mananas|otras].jpg
// Recommended dimensions: 800x600px (ratio 4:3)
