/**
 * Teacher Images - Centralized System
 * Enterprise-grade mapping of teachers to their images and dance styles
 *
 * This file provides:
 * - Centralized image paths for all teachers
 * - Mapping of teachers to dance styles they teach
 * - Helper functions to get teacher info for any class page
 */

import type { TeacherInfo } from '../components/templates/FullDanceClassTemplate';

// ============================================================================
// TYPES
// ============================================================================

export interface TeacherImageConfig {
  /** Teacher unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Base path without size suffix (e.g., '/images/teachers/img/maestra-yunaisy-farray') */
  basePath: string;
  /** Object position for face focus (default: 'center 20%') */
  objectPosition?: string;
  /** Available sizes for this teacher's photo */
  sizes: number[];
  /** Available formats */
  formats: ('avif' | 'webp' | 'jpg')[];
  /** Dance styles this teacher teaches (for automatic mapping) */
  styles: string[];
  /** Is this teacher the director? */
  isDirector?: boolean;
}

export type TeacherAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// ============================================================================
// TEACHER IMAGE DATABASE
// ============================================================================

export const TEACHER_IMAGES: Record<string, TeacherImageConfig> = {
  'yunaisy-farray': {
    id: 'yunaisy-farray',
    name: 'Yunaisy Farray',
    basePath: '/images/teachers/img/maestra-yunaisy-farray',
    objectPosition: 'center 20%',
    sizes: [320, 640, 960],
    formats: ['avif', 'webp', 'jpg'],
    styles: [
      'afro-jazz',
      'salsa-lady-style',
      'bachata-lady-style',
      'afro-contemporaneo',
      'salsa-cubana',
      'timba',
      'folklore-cubano',
    ],
    isDirector: true,
  },
  'daniel-sene': {
    id: 'daniel-sene',
    name: 'Daniel Sené',
    basePath: '/images/teachers/img/profesor-daniel-sen-',
    objectPosition: 'center 20%',
    sizes: [320, 640, 960],
    formats: ['avif', 'webp', 'jpg'],
    styles: ['ballet', 'contemporaneo', 'yoga', 'tai-chi', 'stretching'],
  },
  'alejandro-minoso': {
    id: 'alejandro-minoso',
    name: 'Alejandro Miñoso',
    basePath: '/images/teachers/img/profesor-alejandro-mi-oso',
    objectPosition: 'center 20%',
    sizes: [320, 640, 960],
    formats: ['avif', 'webp', 'jpg'],
    styles: ['ballet', 'modern-jazz', 'afro-jazz', 'afro-contemporaneo', 'contemporaneo'],
  },
  'sandra-gomez': {
    id: 'sandra-gomez',
    name: 'Sandra Gómez',
    basePath: '/images/teachers/img/profesora-sandra-gomez',
    objectPosition: 'center 20%',
    sizes: [320, 640, 960],
    formats: ['webp', 'jpg'],
    styles: ['dancehall', 'twerk'],
  },
  'isabel-lopez': {
    id: 'isabel-lopez',
    name: 'Isabel López',
    basePath: '/images/teachers/img/profesora-isabel-l-pez',
    objectPosition: 'center 20%',
    sizes: [320, 640, 960],
    formats: ['avif', 'webp', 'jpg'],
    styles: ['dancehall', 'twerk'],
  },
  'marcos-martinez': {
    id: 'marcos-martinez',
    name: 'Marcos Martínez',
    basePath: '/images/teachers/img/profesor-marcos-mart-nez',
    objectPosition: 'center 20%',
    sizes: [320, 640, 960],
    formats: ['avif', 'webp', 'jpg'],
    styles: ['hip-hop', 'breaking', 'locking', 'popping', 'hip-hop-reggaeton'],
  },
  'yasmina-fernandez': {
    id: 'yasmina-fernandez',
    name: 'Yasmina Fernández',
    // Enterprise: foto más reciente dic 29 con AVIF (usando URL encoding para acento)
    basePath: '/images/teachers/img/profesora-yasmina-fern%C3%A1ndez',
    objectPosition: 'center 15%',
    sizes: [320, 640, 960],
    formats: ['avif', 'webp', 'jpg'],
    styles: ['salsa-cubana', 'salsa-lady-style', 'sexy-style', 'sexy-reggaeton'],
  },
  'lia-valdes': {
    id: 'lia-valdes',
    name: 'Lia Valdes',
    basePath: '/images/teachers/img/profesora-lia-valdes',
    // Enterprise: subir y acercar foto - face focus más alto
    objectPosition: 'center 10%',
    sizes: [320, 640, 960],
    formats: ['avif', 'webp', 'jpg'],
    styles: ['salsa-cubana', 'salsa-lady-style'],
  },
  'iroel-bastarreche': {
    id: 'iroel-bastarreche',
    name: 'Iroel Bastarreche',
    basePath: '/images/teachers/img/profesor-iroel-bastarreche',
    // Enterprise: subir ligeramente la foto
    objectPosition: 'center 15%',
    sizes: [320, 640, 960],
    formats: ['avif', 'webp', 'jpg'],
    styles: ['salsa-cubana', 'folklore-cubano', 'afro-contemporaneo'],
  },
  'charlie-breezy': {
    id: 'charlie-breezy',
    name: 'Charlie Breezy',
    basePath: '/images/teachers/img/profesor-charlie-breezy',
    objectPosition: 'center 20%',
    sizes: [320, 640, 960],
    formats: ['avif', 'webp', 'jpg'],
    styles: ['afro-contemporaneo', 'hip-hop', 'afrobeats'],
  },
  'eugenia-trujillo': {
    id: 'eugenia-trujillo',
    name: 'Eugenia Trujillo',
    basePath: '/images/teachers/img/profesora-eugenio-trujillo',
    objectPosition: 'center 35%',
    sizes: [320, 640, 960],
    formats: ['avif', 'webp', 'jpg'],
    styles: ['bachata-lady-style', 'bachata-en-pareja', 'salsa-la', 'bachata'],
  },
  'mathias-font': {
    id: 'mathias-font',
    name: 'Mathias Font',
    basePath: '/images/teachers/img/profesor-mathias-font',
    objectPosition: 'center 20%',
    sizes: [320, 640, 960],
    formats: ['avif', 'webp', 'jpg'],
    styles: ['bachata', 'bachata-sensual'],
  },
  'carlos-canto': {
    id: 'carlos-canto',
    name: 'Carlos Canto',
    basePath: '/images/teachers/img/profesor-carlos-canto',
    objectPosition: 'center 20%',
    sizes: [320, 640, 960],
    formats: ['avif', 'webp', 'jpg'],
    styles: ['bachata', 'bachata-moderna'],
  },
  noemi: {
    id: 'noemi',
    name: 'Noemi',
    basePath: '/images/teachers/img/profesora-noemi-guerin-',
    objectPosition: 'center 20%',
    sizes: [320, 640, 960],
    formats: ['avif', 'webp', 'jpg'],
    styles: ['bachata', 'bachata-lady-style'],
  },
  redbhlue: {
    id: 'redbhlue',
    name: 'Redbhlue',
    basePath: '/images/teachers/img/profesor-redblueh',
    objectPosition: 'center 20%',
    sizes: [320, 640, 960],
    formats: ['avif', 'webp', 'jpg'],
    styles: ['afrobeats', 'afro-dance'],
  },
  'juan-alvarez': {
    id: 'juan-alvarez',
    name: 'Juan Alvarez',
    basePath: '/images/teachers/img/profesor-juan-alvarez',
    objectPosition: 'center 20%',
    sizes: [320, 640, 960],
    formats: ['avif', 'webp', 'jpg'],
    styles: ['bachata-sensual'],
  },
  crisag: {
    id: 'crisag',
    name: 'CrisAg',
    basePath: '/images/teachers/img/profesora-crisag',
    objectPosition: 'center 20%',
    sizes: [320, 640, 960],
    formats: ['webp', 'jpg'],
    styles: ['body-conditioning', 'cuerpo-fit', 'bum-bum', 'stretching'],
  },
  // Alias for cris-ag (backwards compatibility)
  'cris-ag': {
    id: 'cris-ag',
    name: 'CrisAg',
    basePath: '/images/teachers/img/profesora-crisag',
    objectPosition: 'center 20%',
    sizes: [320, 640, 960],
    formats: ['webp', 'jpg'],
    styles: ['body-conditioning', 'cuerpo-fit', 'bum-bum', 'stretching'],
  },
  'grechen-mendez': {
    id: 'grechen-mendez',
    name: 'Grechén Méndez',
    basePath: '/images/teachers/img/profesora-grechen-m-ndez',
    objectPosition: 'center 20%',
    sizes: [320, 640, 960],
    formats: ['avif', 'webp', 'jpg'],
    styles: ['folklore-cubano', 'danzas-afrocubanas', 'rumba', 'timba'],
  },
};

// ============================================================================
// STYLE TO TEACHER MAPPING
// Style keys used in configs (e.g., 'salsaCubana') mapped to teacher IDs
// ============================================================================

export const STYLE_TEACHERS: Record<string, string[]> = {
  // Salsa & Latin
  salsaCubana: ['yunaisy-farray', 'yasmina-fernandez', 'lia-valdes', 'iroel-bastarreche'],
  salsaLadyStyle: ['yunaisy-farray', 'yasmina-fernandez', 'lia-valdes'],
  timba: ['yunaisy-farray', 'grechen-mendez'],

  // Bachata
  bachataV3: ['mathias-font', 'eugenia-trujillo', 'carlos-canto', 'noemi'],
  bachataLady: ['eugenia-trujillo', 'noemi'],
  bachata: ['mathias-font', 'eugenia-trujillo', 'carlos-canto', 'noemi'],
  bachataSensual: ['mathias-font', 'juan-alvarez'],

  // Afro styles
  afrocontemporaneo: ['yunaisy-farray', 'charlie-breezy', 'alejandro-minoso', 'iroel-bastarreche'],
  afrojazz: ['yunaisy-farray', 'alejandro-minoso'],
  afro: ['redbhlue', 'charlie-breezy'], // Afrobeats

  // Urban
  dancehall: ['sandra-gomez', 'isabel-lopez'],
  twerk: ['sandra-gomez', 'isabel-lopez'],
  hipHop: ['marcos-martinez', 'charlie-breezy'],
  hipHopReggaeton: ['marcos-martinez'],
  sexyReggaeton: ['sandra-gomez', 'isabel-lopez', 'yasmina-fernandez'],
  reggaetonCubano: ['yunaisy-farray'],

  // Classical & Contemporary
  ballet: ['daniel-sene', 'alejandro-minoso'],
  contemporaneo: ['daniel-sene', 'alejandro-minoso'],
  modernJazz: ['alejandro-minoso'],

  // Fitness & Wellness
  bumBum: ['crisag'],
  fullBodyCardio: ['yunaisy-farray'],
  cuerpoFit: ['yunaisy-farray', 'crisag'],
  stretching: ['daniel-sene', 'crisag'],
  bodyConditioning: ['crisag'],
  yoga: ['daniel-sene'],
  taiChi: ['daniel-sene'],

  // Other
  folkloreCubano: ['yunaisy-farray', 'iroel-bastarreche', 'grechen-mendez'],
  danzasAfrocubanas: ['grechen-mendez'],
  rumba: ['grechen-mendez', 'iroel-bastarreche'],
  femmology: ['yunaisy-farray'],
  heels: ['eugenia-trujillo'],
  sexyStyle: ['eugenia-trujillo', 'yasmina-fernandez'],
  baileMananas: ['yunaisy-farray'],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get teacher image configuration by ID
 */
export function getTeacherImage(teacherId: string): TeacherImageConfig | undefined {
  return TEACHER_IMAGES[teacherId];
}

/**
 * Generate srcSet string for a teacher's image
 */
export function getTeacherImageSrcSet(teacherId: string, format: 'webp' | 'jpg' = 'webp'): string {
  const teacher = TEACHER_IMAGES[teacherId];
  if (!teacher) return '';

  return teacher.sizes.map(size => `${teacher.basePath}_${size}.${format} ${size}w`).join(', ');
}

/**
 * Get the default image path for a teacher (320px webp)
 */
export function getTeacherImagePath(teacherId: string, size: number = 320): string {
  const teacher = TEACHER_IMAGES[teacherId];
  if (!teacher) return '';

  const format = teacher.formats.includes('webp') ? 'webp' : teacher.formats[0];
  return `${teacher.basePath}_${size}.${format}`;
}

/**
 * Get TeacherInfo objects for a specific dance style
 * Ready to use in FullDanceClassTemplate configs
 */
export function getTeachersForStyle(
  styleKey: string,
  specialtyKeyPrefix: string,
  options?: {
    limit?: number;
    includeTags?: boolean;
  }
): TeacherInfo[] {
  const teacherIds = STYLE_TEACHERS[styleKey] || [];
  const limit = options?.limit ?? teacherIds.length;

  return teacherIds.slice(0, limit).map((teacherId, index) => {
    const teacher = TEACHER_IMAGES[teacherId];
    if (!teacher) {
      return {
        name: teacherId,
        specialtyKey: `${specialtyKeyPrefix}Teacher${index + 1}Specialty`,
        bioKey: `${specialtyKeyPrefix}Teacher${index + 1}Bio`,
      };
    }

    const result: TeacherInfo = {
      name: teacher.name,
      specialtyKey: `${specialtyKeyPrefix}Teacher${index + 1}Specialty`,
      bioKey: `${specialtyKeyPrefix}Teacher${index + 1}Bio`,
      image: getTeacherImagePath(teacherId, 320),
      imageSrcSet: getTeacherImageSrcSet(teacherId, 'webp'),
    };

    if (options?.includeTags && teacher.isDirector) {
      result.tags = ['Directora', 'CID-UNESCO', 'ENA Cuba'];
    }

    return result;
  });
}

/**
 * Generate AVIF srcSet string for a teacher's image
 */
export function getTeacherImageSrcSetAvif(teacherId: string): string {
  const teacher = TEACHER_IMAGES[teacherId];
  if (!teacher || !teacher.formats.includes('avif')) return '';

  return teacher.sizes.map(size => `${teacher.basePath}_${size}.avif ${size}w`).join(', ');
}

/**
 * Get a single teacher's info for use in configs
 * Includes all srcSets (WebP + AVIF) and objectPosition for face focus
 */
export function getTeacherInfo(
  teacherId: string,
  specialtyKey: string,
  bioKey: string,
  tags?: string[]
): TeacherInfo {
  const teacher = TEACHER_IMAGES[teacherId];

  if (!teacher) {
    return {
      name: teacherId,
      specialtyKey,
      bioKey,
    };
  }

  return {
    name: teacher.name,
    specialtyKey,
    bioKey,
    image: getTeacherImagePath(teacherId, 320),
    imageSrcSet: getTeacherImageSrcSet(teacherId, 'webp'),
    imageSrcSetAvif: getTeacherImageSrcSetAvif(teacherId),
    objectPosition: teacher.objectPosition || 'center 20%',
    tags,
  };
}

/**
 * Get teacher info for PrepareClassSection quote
 * Returns the teacher object for PREPARE_CONFIG with all image data
 */
export function getTeacherQuoteInfo(
  teacherId: string,
  credential: string
): {
  name: string;
  credential: string;
  image?: string;
  imageSrcSet?: string;
  imageSrcSetAvif?: string;
  objectPosition?: string;
} {
  const teacher = TEACHER_IMAGES[teacherId];

  if (!teacher) {
    return {
      name: teacherId,
      credential,
    };
  }

  return {
    name: teacher.name,
    credential,
    image: getTeacherImagePath(teacherId, 320),
    imageSrcSet: getTeacherImageSrcSet(teacherId, 'webp'),
    imageSrcSetAvif: getTeacherImageSrcSetAvif(teacherId),
    objectPosition: teacher.objectPosition || 'center 20%',
  };
}

/**
 * Avatar size mapping (in pixels)
 */
export const AVATAR_SIZES: Record<TeacherAvatarSize, number> = {
  xs: 32,
  sm: 48,
  md: 64,
  lg: 128,
  xl: 160,
};

/**
 * Get optimal image size for avatar
 */
export function getAvatarImageSize(avatarSize: TeacherAvatarSize): number {
  const pixelSize = AVATAR_SIZES[avatarSize];
  // Use 2x for retina displays
  const retinaSize = pixelSize * 2;
  // Return the closest available size
  if (retinaSize <= 320) return 320;
  if (retinaSize <= 640) return 640;
  return 960;
}
