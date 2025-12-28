// Dance Classes Hub - Data structure for /clases/baile-barcelona page
// Combines existing category data with new hub-specific information

export interface StyleLink {
  key: string; // Translation key suffix: 'danceClassesHub_style_{key}'
  url: string; // URL path (without locale prefix)
}

export interface HubCategory {
  key: string; // Category identifier: 'contemporary', 'urban', etc.
  titleKey: string; // Existing translation key from classCat*
  descriptionKey: string; // Existing translation key from classCat*
  detailedDescriptionKey: string; // Existing translation key from classDetail*
  pillarUrl: string; // Category pillar page URL
  imageUrl: string; // Background image URL for card
  featuredStyles: StyleLink[]; // 3 featured styles shown in card
  allStyles: StyleLink[]; // All styles shown in modal
}

export const HUB_CATEGORIES: HubCategory[] = [
  // 1. Danza (Ballet/Contemporáneo/Jazz)
  // Uses SAME image as categories.ts for visual consistency (HOME → HUB)
  {
    key: 'contemporary',
    titleKey: 'classCatContemporaryTitle',
    descriptionKey: 'classCatContemporaryDesc',
    detailedDescriptionKey: 'classDetailContemporaryDesc',
    pillarUrl: '/clases/danza-barcelona',
    imageUrl: '/images/categories/danza.webp',
    featuredStyles: [
      { key: 'ballet_clasico', url: '/clases/ballet-barcelona' },
      { key: 'danza_contemporanea', url: '/clases/contemporaneo-barcelona' },
      { key: 'modern_jazz', url: '/clases/modern-jazz-barcelona' },
    ],
    allStyles: [
      { key: 'afro_contemporaneo', url: '/clases/afro-contemporaneo-barcelona' },
      { key: 'afro_jazz', url: '/clases/afro-jazz' },
      { key: 'ballet_clasico', url: '/clases/ballet-barcelona' },
      { key: 'danza_contemporanea', url: '/clases/contemporaneo-barcelona' },
      { key: 'modern_jazz', url: '/clases/modern-jazz-barcelona' },
    ],
  },

  // 2. Danzas Urbanas / Hip Hop (ordenado alfabéticamente)
  // Uses SAME image as categories.ts for visual consistency (HOME → HUB)
  {
    key: 'urban',
    titleKey: 'classCatUrbanTitle',
    descriptionKey: 'classCatUrbanDesc',
    detailedDescriptionKey: 'classDetailUrbanDesc',
    pillarUrl: '/clases/danzas-urbanas-barcelona',
    imageUrl: '/images/classes/hip-hop-reggaeton/img/clases-hip-hop-reaggaeton-barcelona_640.webp',
    featuredStyles: [
      { key: 'dancehall', url: '/clases/dancehall-barcelona' },
      { key: 'heels_barcelona', url: '/clases/heels-barcelona' },
      { key: 'hip_hop_reggaeton', url: '/clases/hip-hop-reggaeton-barcelona' },
    ],
    allStyles: [
      // Ordenado alfabéticamente - URLs de páginas que existen
      { key: 'afrobeat', url: '/clases/afrobeats-barcelona' },
      { key: 'dancehall', url: '/clases/dancehall-barcelona' },
      { key: 'femmology_heels', url: '/clases/femmology' },
      { key: 'heels_barcelona', url: '/clases/heels-barcelona' },
      { key: 'hip_hop', url: '/clases/hip-hop-barcelona' },
      { key: 'hip_hop_reggaeton', url: '/clases/hip-hop-reggaeton-barcelona' },
      { key: 'reggaeton_cubano', url: '/clases/reggaeton-cubano-barcelona' },
      { key: 'sexy_reggaeton', url: '/clases/sexy-reggaeton-barcelona' },
      { key: 'sexy_style', url: '/clases/sexy-style-barcelona' },
      { key: 'twerk', url: '/clases/twerk-barcelona' },
    ],
  },

  // 3. Salsa y Bachata (Parejas / Latinos)
  // Uses SAME image as categories.ts for visual consistency (HOME → HUB)
  {
    key: 'latin',
    titleKey: 'classCatLatinTitle',
    descriptionKey: 'classCatLatinDesc',
    detailedDescriptionKey: 'classDetailLatinDesc',
    pillarUrl: '/clases/salsa-bachata-barcelona',
    imageUrl: '/images/categories/salsa-bachata.webp',
    featuredStyles: [
      { key: 'salsa_bachata', url: '/clases/salsa-bachata-barcelona' },
      { key: 'bachata_sensual', url: '/clases/bachata-barcelona' },
    ],
    allStyles: [
      { key: 'bachata_sensual', url: '/clases/bachata-barcelona' },
      { key: 'bachata_lady_style', url: '/clases/bachata-lady-style-barcelona' },
      { key: 'folklore_cubano', url: '/clases/folklore-cubano' },
      { key: 'salsa_cubana', url: '/clases/salsa-cubana-barcelona' },
      { key: 'salsa_lady_style', url: '/clases/salsa-lady-style-barcelona' },
      { key: 'salsa_lady_timba', url: '/clases/timba-barcelona' },
      { key: 'timba_cubana', url: '/clases/timba-barcelona' },
    ],
  },

  // 4. Fitness para bailarines
  // Uses SAME image as categories.ts for visual consistency (HOME → HUB)
  {
    key: 'fitness',
    titleKey: 'classCatFitnessTitle',
    descriptionKey: 'classCatFitnessDesc',
    detailedDescriptionKey: 'classDetailFitnessDesc',
    pillarUrl: '/clases/entrenamiento-bailarines-barcelona',
    imageUrl: '/images/categories/fitness.webp',
    featuredStyles: [
      { key: 'cuerpo_fit', url: '/clases/cuerpo-fit' },
      { key: 'body_conditioning', url: '/clases/acondicionamiento-fisico-bailarines' },
      { key: 'stretching', url: '/clases/stretching-barcelona' },
    ],
    allStyles: [
      { key: 'body_conditioning', url: '/clases/acondicionamiento-fisico-bailarines' },
      { key: 'bum_bum', url: '/clases/ejercicios-gluteos-barcelona' },
      { key: 'cuerpo_fit', url: '/clases/cuerpo-fit' },
      { key: 'stretching', url: '/clases/stretching-barcelona' },
    ],
  },
];

// Featured styles for the "Estilos destacados" section
// Solo incluye páginas que realmente existen en App.tsx
export const FEATURED_STYLES: StyleLink[] = [
  // Danza
  { key: 'afro_contemporaneo', url: '/clases/afro-contemporaneo-barcelona' },
  { key: 'afro_jazz', url: '/clases/afro-jazz' },
  { key: 'ballet_clasico', url: '/clases/ballet-barcelona' },
  { key: 'danza_contemporanea', url: '/clases/contemporaneo-barcelona' },
  { key: 'modern_jazz', url: '/clases/modern-jazz-barcelona' },
  // Urbanas
  { key: 'afrobeat', url: '/clases/afrobeats-barcelona' },
  { key: 'dancehall', url: '/clases/dancehall-barcelona' },
  { key: 'femmology_heels', url: '/clases/femmology' },
  { key: 'heels_barcelona', url: '/clases/heels-barcelona' },
  { key: 'hip_hop', url: '/clases/hip-hop-barcelona' },
  { key: 'hip_hop_reggaeton', url: '/clases/hip-hop-reggaeton-barcelona' },
  { key: 'reggaeton_cubano', url: '/clases/reggaeton-cubano-barcelona' },
  { key: 'sexy_reggaeton', url: '/clases/sexy-reggaeton-barcelona' },
  { key: 'sexy_style', url: '/clases/sexy-style-barcelona' },
  { key: 'twerk', url: '/clases/twerk-barcelona' },
  // Latinos
  { key: 'bachata_sensual', url: '/clases/bachata-barcelona' },
  { key: 'bachata_lady_style', url: '/clases/bachata-lady-style-barcelona' },
  { key: 'folklore_cubano', url: '/clases/folklore-cubano' },
  { key: 'salsa_cubana', url: '/clases/salsa-cubana-barcelona' },
  { key: 'salsa_lady_style', url: '/clases/salsa-lady-style-barcelona' },
  { key: 'salsa_lady_timba', url: '/clases/timba-barcelona' },
  { key: 'timba_cubana', url: '/clases/timba-barcelona' },
  // Fitness
  { key: 'body_conditioning', url: '/clases/acondicionamiento-fisico-bailarines' },
  { key: 'bum_bum', url: '/clases/ejercicios-gluteos-barcelona' },
  { key: 'cuerpo_fit', url: '/clases/cuerpo-fit' },
  { key: 'stretching', url: '/clases/stretching-barcelona' },
];
