/**
 * Reviews Data - Types and Constants for Google Reviews System
 * Enterprise-grade review management for Farray's International Dance Center
 */

// =============================================================================
// TYPES
// =============================================================================

export type DanceCategory =
  | 'salsa-cubana'
  | 'bachata'
  | 'heels-femmology'
  | 'urbanas'
  | 'contemporaneo'
  | 'afro'
  | 'fitness'
  | 'general';

export interface GoogleReview {
  id: string;
  author: string;
  authorInfo?: string;
  rating: 5;
  date: string;
  dateISO: string;
  text: string;
  isTranslated?: boolean;
  originalLanguage?: string;
  categories: DanceCategory[];
  teachers: string[];
  sentiment: 'positive' | 'neutral';
}

export interface ReviewStats {
  total: number;
  avgRating: number;
  byCategory: Record<DanceCategory, number>;
  byTeacher: Record<string, number>;
}

// =============================================================================
// CONSTANTS - CATEGORY KEYWORDS
// =============================================================================

export const CATEGORY_KEYWORDS: Record<DanceCategory, string[]> = {
  'salsa-cubana': ['salsa cubana', 'salsa', 'cubana', 'casino', 'rueda', 'timba', 'son cubano'],
  bachata: [
    'bachata',
    'sensual',
    'bachata sensual',
    'bachata moderna',
    'bachata lady',
    'dominicana',
  ],
  'heels-femmology': [
    'heels',
    'tacones',
    'femmology',
    'sexy style',
    'lady style',
    'stiletto',
    'sexy reggaeton',
  ],
  urbanas: [
    'hip hop',
    'hip-hop',
    'hiphop',
    'dancehall',
    'twerk',
    'twerking',
    'afrobeats',
    'afrobeat',
    'reggaeton',
    'urbano',
    'urbanas',
    'urban',
    'breaking',
    'breakdance',
    'locking',
    'popping',
  ],
  contemporaneo: [
    'contemporáneo',
    'contemporanea',
    'contemporáneo',
    'contemporary',
    'ballet',
    'modern jazz',
    'modern',
    'jazz',
    'danza moderna',
  ],
  afro: [
    'afro jazz',
    'afro-jazz',
    'afrojazz',
    'afro dance',
    'afro contemporáneo',
    'afrocubano',
    'afro cubano',
    'folklore',
    'folklórico',
    'orishas',
    'rumba',
    'africano',
    'african',
  ],
  fitness: [
    'stretching',
    'yoga',
    'body conditioning',
    'conditioning',
    'glúteos',
    'gluteos',
    'fit',
    'fitness',
    'cuerpo fit',
    'bum bum',
    'tai-chi',
    'tai chi',
    'taichi',
  ],
  general: [], // Fallback category
};

// =============================================================================
// CONSTANTS - VALID TEACHERS (currently active)
// =============================================================================

export const VALID_TEACHERS: Record<string, string[]> = {
  yunaisy: ['yunaisy', 'farray'],
  daniel: ['daniel', 'sené', 'sene'],
  alejandro: ['alejandro', 'miñoso', 'minoso'],
  lia: ['lia', 'valdes', 'valdés'],
  iroel: ['iroel', 'iro', 'bastarreche'],
  charlie: ['charlie', 'breezy'],
  grechen: ['grechen', 'grechén', 'méndez', 'mendez'],
  marcos: ['marcos', 'martínez', 'martinez'],
  crisag: ['crisag', 'cris ag'],
  yasmina: ['yasmina', 'yas', 'fernández', 'fernandez'],
  redbhlue: ['redbhlue', 'redblueh', 'red blue'],
  sandra: ['sandra', 'gómez', 'gomez'],
  isabel: ['isabel', 'lópez', 'lopez'],
  eugenia: ['eugenia', 'euge', 'trujillo'],
  mathias: ['mathias', 'mathi', 'font'],
  carlos: ['carlos canto', 'canto'],
  noemi: ['noemi', 'noemí'],
  juan: ['juan alvarez', 'alvarez'],
  augusto: ['augusto'], // Reception
  cristina: ['cristina'], // Reception (mentioned in reviews)
};

// Flattened list for quick matching
export const VALID_TEACHER_KEYWORDS = Object.values(VALID_TEACHERS).flat();

// =============================================================================
// CONSTANTS - EXCLUDED TEACHERS (no longer active)
// =============================================================================

export const EXCLUDED_TEACHERS = [
  'yenifer',
  'lavin',
  'thomas',
  'toams',
  'keita',
  'ela arnal',
  'ela ',
  'ella arnal',
  'ella ',
  'adrian',
  'adrián',
  'makurya',
  'danger',
  'julio',
  'napoles',
  'nápoles',
];

// =============================================================================
// CONSTANTS - PAGE TO CATEGORY MAPPING
// =============================================================================

export const PAGE_CATEGORY_MAP: Record<string, DanceCategory[]> = {
  // Salsa pages
  'salsa-cubana': ['salsa-cubana'],
  'salsa-barcelona': ['salsa-cubana'],
  'clases-salsa-barcelona': ['salsa-cubana'],

  // Bachata pages
  'bachata-barcelona': ['bachata'],
  'clases-bachata-barcelona': ['bachata'],
  'bachata-lady-style-barcelona': ['bachata'],

  // Heels/Femmology pages
  'heels-barcelona': ['heels-femmology'],
  'femmology-barcelona': ['heels-femmology'],
  'salsa-lady-style': ['heels-femmology', 'salsa-cubana'],

  // Urban dance pages
  'danzas-urbanas-barcelona': ['urbanas'],
  'hip-hop-barcelona': ['urbanas'],
  'dancehall-barcelona': ['urbanas'],
  'clases-twerk-barcelona': ['urbanas'],
  'afrobeats-barcelona': ['urbanas', 'afro'],

  // Contemporary/Ballet pages
  'danza-contemporanea-barcelona': ['contemporaneo'],
  'ballet-barcelona': ['contemporaneo'],

  // Afro pages
  'afro-dance-barcelona': ['afro'],
  'afro-jazz-barcelona': ['afro'],

  // Fitness pages
  'fitness-barcelona': ['fitness'],

  // General pages (show all)
  'clases-baile-barcelona': ['general'],
  home: ['general'],
  profesores: ['general'],
};

// =============================================================================
// CONSTANTS - GOOGLE BUSINESS PROFILE
// =============================================================================

export const GOOGLE_BUSINESS_PROFILE = {
  url: 'https://g.page/r/CWBvYu8J9aJAEBM/review',
  placeId: 'ChIJAW9i7-8iQg0RYGK_CflivUA',
  name: "Farray's International Dance Center",
  totalReviews: 509,
  averageRating: 5.0,
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Converts relative date strings to ISO format
 * @param relativeDate - e.g., "Hace 3 meses", "Hace un año"
 * @returns ISO date string
 */
export function relativeToISO(relativeDate: string): string {
  const now = new Date();
  const lower = relativeDate.toLowerCase();

  // Parse Spanish relative dates
  if (lower.includes('semana')) {
    const weeks = parseInt(lower.match(/\d+/)?.[0] || '1');
    now.setDate(now.getDate() - weeks * 7);
  } else if (lower.includes('mes')) {
    const months = parseInt(lower.match(/\d+/)?.[0] || '1');
    now.setMonth(now.getMonth() - months);
  } else if (lower.includes('año') || lower.includes('year')) {
    const years = parseInt(lower.match(/\d+/)?.[0] || '1');
    now.setFullYear(now.getFullYear() - years);
  } else if (lower.includes('día') || lower.includes('day')) {
    const days = parseInt(lower.match(/\d+/)?.[0] || '1');
    now.setDate(now.getDate() - days);
  }

  return now.toISOString().split('T')[0] ?? now.toISOString();
}

/**
 * Detects categories from review text
 */
export function detectCategories(text: string): DanceCategory[] {
  const lowerText = text.toLowerCase();
  const detected: DanceCategory[] = [];

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === 'general') continue;
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        detected.push(category as DanceCategory);
        break;
      }
    }
  }

  return detected.length > 0 ? detected : ['general'];
}

/**
 * Detects mentioned teachers from review text
 */
export function detectTeachers(text: string): string[] {
  const lowerText = text.toLowerCase();
  const mentioned: string[] = [];

  for (const [teacherName, keywords] of Object.entries(VALID_TEACHERS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        mentioned.push(teacherName);
        break;
      }
    }
  }

  return mentioned;
}

/**
 * Checks if review mentions any excluded teacher
 */
export function hasExcludedTeacher(text: string): boolean {
  const lowerText = text.toLowerCase();
  return EXCLUDED_TEACHERS.some(teacher => lowerText.includes(teacher.toLowerCase()));
}

/**
 * Generates a unique ID for a review
 */
export function generateReviewId(author: string, date: string, index: number): string {
  const sanitized = author
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .substring(0, 20);
  return `review-${sanitized}-${date.replace(/[^0-9]/g, '')}-${index}`;
}
