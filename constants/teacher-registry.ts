/**
 * Teacher Registry - Centralized System for Teacher Data
 * Enterprise-grade single source of truth for all teacher information
 *
 * This file provides:
 * - Canonical bio and specialty keys for each teacher
 * - Helper functions to get teacher info with contextual variations
 * - Integration with the existing teacher-images.ts system
 *
 * Architecture:
 * - Layer 1: Identity (static) - from TEACHER_IMAGES
 * - Layer 2: Canonical Bio (source of truth) - teacher.[id].bio
 * - Layer 3: Contextual Specialty (per class) - [styleKey].teacher.[id].specialty
 * - Layer 4: Bio Prefix (optional) - [styleKey].teacher.[id].bioPrefix
 */

import type { TeacherInfo } from '../components/templates/FullDanceClassTemplate';
import {
  TEACHER_IMAGES,
  getTeacherImagePath,
  getTeacherImageSrcSet,
  getTeacherImageSrcSetAvif,
} from './teacher-images';

// ============================================================================
// TYPES
// ============================================================================

export interface TeacherRegistryEntry {
  /** Teacher unique identifier (slug) */
  id: string;
  /** Display name */
  name: string;
  /** Canonical specialty key (source of truth) */
  canonicalSpecialtyKey: string;
  /** Canonical bio key (source of truth) */
  canonicalBioKey: string;
  /** Dance styles this teacher teaches */
  teachesStyles: string[];
  /** Additional metadata */
  meta?: {
    isDirector?: boolean;
    yearsExperience?: number;
    certifications?: string[];
    origin?: string;
  };
}

// ============================================================================
// TEACHER REGISTRY - Central Database
// ============================================================================

export const TEACHER_REGISTRY: Record<string, TeacherRegistryEntry> = {
  // ─────────────────────────────────────────────────
  // DIRECTOR
  // ─────────────────────────────────────────────────
  'yunaisy-farray': {
    id: 'yunaisy-farray',
    name: 'Yunaisy Farray',
    canonicalSpecialtyKey: 'teacher.yunaisyFarray.specialty',
    canonicalBioKey: 'teacher.yunaisyFarray.bio',
    teachesStyles: [
      'afro-jazz',
      'salsa-lady-style',
      'bachata-lady-style',
      'afro-contemporaneo',
      'salsa-cubana',
      'salsa',
      'timba',
      'femmology',
      'heels',
      'cuerpo-fit',
    ],
    meta: {
      isDirector: true,
      yearsExperience: 25,
      certifications: ['ENA Cuba', 'CID-UNESCO', 'Método Farray®'],
      origin: 'Cuba',
    },
  },

  // ─────────────────────────────────────────────────
  // CUBAN TEACHERS (formación académica cubana)
  // ─────────────────────────────────────────────────
  'daniel-sene': {
    id: 'daniel-sene',
    name: 'Daniel Sené',
    canonicalSpecialtyKey: 'teacher.danielSene.specialty',
    canonicalBioKey: 'teacher.danielSene.bio',
    teachesStyles: ['ballet', 'contemporaneo', 'yoga', 'tai-chi', 'stretching'],
    meta: {
      certifications: ['Escuela Nacional de Ballet de Cuba'],
      origin: 'Cuba',
    },
  },

  'alejandro-minoso': {
    id: 'alejandro-minoso',
    name: 'Alejandro Miñoso',
    canonicalSpecialtyKey: 'teacher.alejandroMinoso.specialty',
    canonicalBioKey: 'teacher.alejandroMinoso.bio',
    teachesStyles: ['ballet', 'modern-jazz', 'afro-jazz', 'afro-contemporaneo', 'contemporaneo'],
    meta: {
      certifications: ['ENA Cuba', 'Compañía Carlos Acosta'],
      origin: 'Cuba',
    },
  },

  'lia-valdes': {
    id: 'lia-valdes',
    name: 'Lia Valdes',
    canonicalSpecialtyKey: 'teacher.liaValdes.specialty',
    canonicalBioKey: 'teacher.liaValdes.bio',
    teachesStyles: ['salsa-cubana', 'salsa-lady-style'],
    meta: {
      yearsExperience: 20,
      certifications: ['ENA Cuba', 'El Rey León París'],
      origin: 'Cuba',
    },
  },

  'iroel-bastarreche': {
    id: 'iroel-bastarreche',
    name: 'Iroel Bastarreche',
    canonicalSpecialtyKey: 'teacher.iroelBastarreche.specialty',
    canonicalBioKey: 'teacher.iroelBastarreche.bio',
    teachesStyles: ['salsa-cubana'],
    meta: {
      certifications: ['Ballet Folklórico de Camagüey', 'Método Farray®'],
      origin: 'Cuba',
    },
  },

  'charlie-breezy': {
    id: 'charlie-breezy',
    name: 'Charlie Breezy',
    canonicalSpecialtyKey: 'teacher.charlieBreezy.specialty',
    canonicalBioKey: 'teacher.charlieBreezy.bio',
    teachesStyles: ['afro-contemporaneo', 'hip-hop', 'afrobeats', 'hip-hop-reggaeton'],
    meta: {
      certifications: ['ENA Cuba'],
      origin: 'Cuba',
    },
  },

  'grechen-mendez': {
    id: 'grechen-mendez',
    name: 'Grechén Méndez',
    canonicalSpecialtyKey: 'teacher.grechenMendez.specialty',
    canonicalBioKey: 'teacher.grechenMendez.bio',
    teachesStyles: ['folklore-cubano', 'danzas-afrocubanas', 'rumba', 'timba'],
    meta: {
      yearsExperience: 25,
      certifications: ['ISA Cuba'],
      origin: 'Cuba',
    },
  },

  // ─────────────────────────────────────────────────
  // HIP HOP SPECIALIST
  // ─────────────────────────────────────────────────
  'marcos-martinez': {
    id: 'marcos-martinez',
    name: 'Marcos Martínez',
    canonicalSpecialtyKey: 'teacher.marcosMartinez.specialty',
    canonicalBioKey: 'teacher.marcosMartinez.bio',
    teachesStyles: ['hip-hop', 'breaking', 'locking', 'popping', 'hip-hop-reggaeton'],
    meta: {
      certifications: ['Juez Internacional'],
      origin: 'España',
    },
  },

  // ─────────────────────────────────────────────────
  // BODY CONDITIONING SPECIALIST
  // ─────────────────────────────────────────────────
  crisag: {
    id: 'crisag',
    name: 'CrisAg',
    canonicalSpecialtyKey: 'teacher.crisAg.specialty',
    canonicalBioKey: 'teacher.crisAg.bio',
    teachesStyles: ['body-conditioning', 'cuerpo-fit', 'bum-bum', 'stretching'],
    meta: {
      certifications: ['Método Farray® desde 2012', 'The Cuban School of Arts Londres'],
      origin: 'España',
    },
  },
  'cris-ag': {
    id: 'cris-ag',
    name: 'CrisAg',
    canonicalSpecialtyKey: 'teacher.crisAg.specialty',
    canonicalBioKey: 'teacher.crisAg.bio',
    teachesStyles: ['body-conditioning', 'cuerpo-fit', 'bum-bum', 'stretching'],
    meta: {
      certifications: ['Método Farray® desde 2012', 'The Cuban School of Arts Londres'],
      origin: 'España',
    },
  },

  // ─────────────────────────────────────────────────
  // SALSA/BACHATA SPECIALISTS
  // ─────────────────────────────────────────────────
  'yasmina-fernandez': {
    id: 'yasmina-fernandez',
    name: 'Yasmina Fernández',
    canonicalSpecialtyKey: 'teacher.yasminaFernandez.specialty',
    canonicalBioKey: 'teacher.yasminaFernandez.bio',
    teachesStyles: ['salsa-cubana', 'salsa-lady-style', 'sexy-style', 'sexy-reggaeton'],
    meta: {
      certifications: ['Método Farray® desde 2016'],
      origin: 'España',
    },
  },

  'eugenia-trujillo': {
    id: 'eugenia-trujillo',
    name: 'Eugenia Trujillo',
    canonicalSpecialtyKey: 'teacher.eugeniaTrujillo.specialty',
    canonicalBioKey: 'teacher.eugeniaTrujillo.bio',
    teachesStyles: ['bachata-lady-style', 'bachata-en-pareja', 'salsa-la', 'bachata'],
    meta: {
      certifications: ['Campeona Mundial Salsa LA'],
      origin: 'Uruguay',
    },
  },

  'mathias-font': {
    id: 'mathias-font',
    name: 'Mathias Font',
    canonicalSpecialtyKey: 'teacher.mathiasFont.specialty',
    canonicalBioKey: 'teacher.mathiasFont.bio',
    teachesStyles: ['bachata', 'bachata-sensual'],
    meta: {
      certifications: ['Campeón Mundial Salsa LA'],
      origin: 'Uruguay',
    },
  },

  'carlos-canto': {
    id: 'carlos-canto',
    name: 'Carlos Canto',
    canonicalSpecialtyKey: 'teacher.carlosCanto.specialty',
    canonicalBioKey: 'teacher.carlosCanto.bio',
    teachesStyles: ['bachata', 'bachata-moderna'],
    meta: {
      origin: 'España',
    },
  },

  noemi: {
    id: 'noemi',
    name: 'Noemi',
    canonicalSpecialtyKey: 'teacher.noemi.specialty',
    canonicalBioKey: 'teacher.noemi.bio',
    teachesStyles: ['bachata', 'bachata-lady-style'],
    meta: {
      origin: 'España',
    },
  },

  'juan-alvarez': {
    id: 'juan-alvarez',
    name: 'Juan Alvarez',
    canonicalSpecialtyKey: 'teacher.juanAlvarez.specialty',
    canonicalBioKey: 'teacher.juanAlvarez.bio',
    teachesStyles: ['bachata-sensual'],
    meta: {
      certifications: ['Método Farray®'],
      origin: 'España',
    },
  },

  // ─────────────────────────────────────────────────
  // DANCEHALL/TWERK SPECIALISTS
  // ─────────────────────────────────────────────────
  'sandra-gomez': {
    id: 'sandra-gomez',
    name: 'Sandra Gómez',
    canonicalSpecialtyKey: 'teacher.sandraGomez.specialty',
    canonicalBioKey: 'teacher.sandraGomez.bio',
    teachesStyles: ['dancehall', 'twerk'],
    meta: {
      yearsExperience: 6,
      certifications: ['Formación Jamaicana'],
      origin: 'España',
    },
  },

  'isabel-lopez': {
    id: 'isabel-lopez',
    name: 'Isabel López',
    canonicalSpecialtyKey: 'teacher.isabelLopez.specialty',
    canonicalBioKey: 'teacher.isabelLopez.bio',
    teachesStyles: ['dancehall', 'twerk'],
    meta: {
      yearsExperience: 5,
      certifications: ['Formación Jamaica'],
      origin: 'España',
    },
  },

  // ─────────────────────────────────────────────────
  // AFROBEATS SPECIALIST
  // ─────────────────────────────────────────────────
  redbhlue: {
    id: 'redblueh',
    name: 'Redbhlue',
    canonicalSpecialtyKey: 'teacher.redbhlue.specialty',
    canonicalBioKey: 'teacher.redbhlue.bio',
    teachesStyles: ['afrobeats', 'afro-dance'],
    meta: {
      origin: 'Tanzania',
    },
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Convert slug to camelCase for i18n keys
 * Example: 'isabel-lopez' → 'isabelLopez'
 */
export function toCamelCase(slug: string): string {
  return slug.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Get a teacher from the registry by ID
 */
export function getTeacherFromRegistry(teacherId: string): TeacherRegistryEntry | undefined {
  return TEACHER_REGISTRY[teacherId];
}

/**
 * Get teacher info for a specific class page context
 *
 * This function returns TeacherInfo with:
 * - Contextual specialty key: `[styleKey].teacher.[teacherCamelId].specialty`
 * - Canonical bio key: `teacher.[teacherCamelId].bio`
 * - Optional bio prefix key: `[styleKey].teacher.[teacherCamelId].bioPrefix`
 *
 * @param teacherId - Teacher slug from registry (e.g., 'isabel-lopez')
 * @param styleKey - The class style key (e.g., 'dhV3', 'twerk', 'salsaCubana')
 * @param tags - Optional display tags
 *
 * @example
 * // For dancehall page
 * getTeacherForClass('isabel-lopez', 'dhV3', ['Dancehall Female'])
 * // Returns:
 * // {
 * //   name: 'Isabel López',
 * //   specialtyKey: 'dhV3.teacher.isabelLopez.specialty',
 * //   bioKey: 'teacher.isabelLopez.bio',
 * //   bioPrefixKey: 'dhV3.teacher.isabelLopez.bioPrefix',
 * //   ...imageData
 * // }
 */
export function getTeacherForClass(
  teacherId: string,
  styleKey: string,
  tags?: string[]
): TeacherInfo {
  const registryEntry = TEACHER_REGISTRY[teacherId];
  const imageEntry = TEACHER_IMAGES[teacherId];

  if (!registryEntry) {
    console.warn(`Teacher not found in registry: ${teacherId}`);
    return {
      name: teacherId,
      specialtyKey: `${styleKey}.teacher.unknown.specialty`,
      bioKey: 'teacher.unknown.bio',
    };
  }

  const teacherCamelId = toCamelCase(teacherId);

  const result: TeacherInfo = {
    name: registryEntry.name,
    // Contextual specialty (specific to this class page)
    specialtyKey: `${styleKey}.teacher.${teacherCamelId}.specialty`,
    // Canonical bio (same for all pages, source of truth)
    bioKey: `teacher.${teacherCamelId}.bio`,
    // Note: bioPrefixKey is optional and only added when translations exist
    // Pattern: `${styleKey}.teacher.${teacherCamelId}.bioPrefix`
    tags,
  };

  // Add image data if available
  if (imageEntry) {
    result.image = getTeacherImagePath(teacherId, 320);
    result.imageSrcSet = getTeacherImageSrcSet(teacherId, 'webp');
    result.imageSrcSetAvif = getTeacherImageSrcSetAvif(teacherId);
    result.objectPosition = imageEntry.objectPosition || 'center 20%';
  }

  return result;
}

/**
 * Get teacher info using canonical keys (for teachers page)
 *
 * @param teacherId - Teacher slug from registry
 * @param tags - Optional display tags
 */
export function getTeacherCanonical(teacherId: string, tags?: string[]): TeacherInfo {
  const registryEntry = TEACHER_REGISTRY[teacherId];
  const imageEntry = TEACHER_IMAGES[teacherId];

  if (!registryEntry) {
    console.warn(`Teacher not found in registry: ${teacherId}`);
    return {
      name: teacherId,
      specialtyKey: 'teacher.unknown.specialty',
      bioKey: 'teacher.unknown.bio',
    };
  }

  const result: TeacherInfo = {
    name: registryEntry.name,
    specialtyKey: registryEntry.canonicalSpecialtyKey,
    bioKey: registryEntry.canonicalBioKey,
    tags,
  };

  // Add image data if available
  if (imageEntry) {
    result.image = getTeacherImagePath(teacherId, 320);
    result.imageSrcSet = getTeacherImageSrcSet(teacherId, 'webp');
    result.imageSrcSetAvif = getTeacherImageSrcSetAvif(teacherId);
    result.objectPosition = imageEntry.objectPosition || 'center 20%';
  }

  return result;
}

/**
 * Get all teachers who teach a specific style
 */
export function getTeachersForStyle(style: string): TeacherRegistryEntry[] {
  return Object.values(TEACHER_REGISTRY).filter(teacher => teacher.teachesStyles.includes(style));
}

/**
 * Get all teacher IDs
 */
export function getAllTeacherIds(): string[] {
  return Object.keys(TEACHER_REGISTRY);
}

/**
 * Check if a teacher exists in the registry
 */
export function teacherExists(teacherId: string): boolean {
  return teacherId in TEACHER_REGISTRY;
}
