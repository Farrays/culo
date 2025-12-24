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
  {
    key: 'contemporary',
    titleKey: 'classCatContemporaryTitle',
    descriptionKey: 'classCatContemporaryDesc',
    detailedDescriptionKey: 'classDetailContemporaryDesc',
    pillarUrl: '/clases/danza-barcelona',
    imageUrl:
      'https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=800&h=600&fit=crop&q=80&auto=format',
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
  {
    key: 'urban',
    titleKey: 'classCatUrbanTitle',
    descriptionKey: 'classCatUrbanDesc',
    detailedDescriptionKey: 'classDetailUrbanDesc',
    pillarUrl: '/clases/danzas-urbanas-barcelona',
    imageUrl:
      'https://images.unsplash.com/photo-1547153760-18fc9c88c1c8?w=800&h=600&fit=crop&q=80&auto=format',
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
  {
    key: 'latin',
    titleKey: 'classCatLatinTitle',
    descriptionKey: 'classCatLatinDesc',
    detailedDescriptionKey: 'classDetailLatinDesc',
    pillarUrl: '/clases/salsa-bachata-barcelona',
    imageUrl:
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&h=600&fit=crop&q=80&auto=format',
    featuredStyles: [
      { key: 'salsa_bachata', url: '/clases/salsa-bachata-barcelona' },
      { key: 'bachata_sensual', url: '/clases/bachata-barcelona' },
    ],
    allStyles: [
      { key: 'bachata_sensual', url: '/clases/bachata-barcelona' },
      { key: 'salsa_bachata', url: '/clases/salsa-bachata-barcelona' },
    ],
  },

  // 4. Fitness para bailarines
  {
    key: 'fitness',
    titleKey: 'classCatFitnessTitle',
    descriptionKey: 'classCatFitnessDesc',
    detailedDescriptionKey: 'classDetailFitnessDesc',
    pillarUrl: '/clases/entrenamiento-bailarines-barcelona',
    imageUrl:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop&q=80&auto=format',
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
  { key: 'salsa_bachata', url: '/clases/salsa-bachata-barcelona' },
  // Fitness
  { key: 'body_conditioning', url: '/clases/acondicionamiento-fisico-bailarines' },
  { key: 'bum_bum', url: '/clases/ejercicios-gluteos-barcelona' },
  { key: 'cuerpo_fit', url: '/clases/cuerpo-fit' },
  { key: 'stretching', url: '/clases/stretching-barcelona' },
];
