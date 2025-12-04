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
    pillarUrl: '/clases/danza-barcelona/',
    imageUrl:
      'https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=800&h=600&fit=crop&q=80&auto=format',
    featuredStyles: [
      { key: 'ballet_clasico', url: '/clases/ballet-clasico-barcelona/' },
      { key: 'danza_contemporanea', url: '/clases/danza-contemporanea-barcelona/' },
      { key: 'modern_jazz', url: '/clases/modern-jazz-barcelona/' },
    ],
    allStyles: [
      { key: 'afro_contemporaneo', url: '/clases/afro-contemporaneo-barcelona/' },
      { key: 'afro_jazz', url: '/clases/afro-jazz-barcelona/' },
      { key: 'ballet_clasico', url: '/clases/ballet-clasico-barcelona/' },
      { key: 'danza_contemporanea', url: '/clases/danza-contemporanea-barcelona/' },
      { key: 'modern_jazz', url: '/clases/modern-jazz-barcelona/' },
      { key: 'stretching', url: '/clases/stretching-barcelona/' },
    ],
  },

  // 2. Danzas Urbanas / Hip Hop (ordenado alfabéticamente)
  {
    key: 'urban',
    titleKey: 'classCatUrbanTitle',
    descriptionKey: 'classCatUrbanDesc',
    detailedDescriptionKey: 'classDetailUrbanDesc',
    pillarUrl: '/clases/danzas-urbanas-barcelona/',
    imageUrl:
      'https://images.unsplash.com/photo-1547153760-18fc9c88c1c8?w=800&h=600&fit=crop&q=80&auto=format',
    featuredStyles: [
      { key: 'dancehall', url: '/clases/dancehall-barcelona' },
      { key: 'heels_barcelona', url: '/clases/heels-barcelona' },
      { key: 'hip_hop_reggaeton', url: '/clases/hip-hop-reggaeton-barcelona' },
    ],
    allStyles: [
      // Ordenado alfabéticamente - URLs sin barra final
      { key: 'afrobeat', url: '/clases/afrobeats-barcelona' },
      { key: 'commercial_dance', url: '/clases/commercial-dance-barcelona' },
      { key: 'dancehall', url: '/clases/dancehall-barcelona' },
      { key: 'femmology_heels', url: '/clases/femmology' },
      { key: 'heels_barcelona', url: '/clases/heels-barcelona' },
      { key: 'hip_hop', url: '/clases/hip-hop-barcelona' },
      { key: 'hip_hop_reggaeton', url: '/clases/hip-hop-reggaeton-barcelona' },
      { key: 'k_pop', url: '/clases/k-pop-barcelona' },
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
    pillarUrl: '/clases/salsa-bachata-barcelona/',
    imageUrl:
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&h=600&fit=crop&q=80&auto=format',
    featuredStyles: [
      { key: 'salsa_cubana', url: '/clases/salsa-cubana-barcelona/' },
      { key: 'bachata', url: '/clases/bachata-barcelona/' },
      { key: 'timba_cubana', url: '/clases/timba-cubana-barcelona/' },
    ],
    allStyles: [
      { key: 'bachata', url: '/clases/bachata-barcelona/' },
      { key: 'folklore_cubano', url: '/clases/folklore-cubano-barcelona/' },
      { key: 'salsa_cubana', url: '/clases/salsa-cubana-barcelona/' },
      { key: 'salsa_lady_style', url: '/clases/salsa-lady-style-barcelona/' },
      { key: 'salsa_lady_timba', url: '/clases/salsa-lady-timba-barcelona/' },
      { key: 'timba_cubana', url: '/clases/timba-cubana-barcelona/' },
      { key: 'son_cubano', url: '/clases/son-cubano-barcelona/' },
      { key: 'men_style_salsa', url: '/clases/men-style-salsa-barcelona/' },
    ],
  },

  // 4. Fitness para bailarines
  {
    key: 'fitness',
    titleKey: 'classCatFitnessTitle',
    descriptionKey: 'classCatFitnessDesc',
    detailedDescriptionKey: 'classDetailFitnessDesc',
    pillarUrl: '/clases/entrenamiento-bailarines-barcelona/',
    imageUrl:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop&q=80&auto=format',
    featuredStyles: [
      { key: 'bum_bum_gluteos', url: '/clases/bum-bum-gluteos-barcelona/' },
      { key: 'stretching', url: '/clases/stretching-barcelona/' },
      { key: 'pilates', url: '/clases/pilates-barcelona/' },
    ],
    allStyles: [
      { key: 'bum_bum_gluteos', url: '/clases/bum-bum-gluteos-barcelona/' },
      { key: 'bum_bum_fit', url: '/clases/bum-bum-fit-barcelona/' },
      { key: 'body_conditioning', url: '/clases/body-conditioning-stretching-barcelona/' },
      { key: 'stretching', url: '/clases/stretching-barcelona/' },
      { key: 'dance_barre', url: '/clases/dance-barre-barcelona/' },
      { key: 'pilates', url: '/clases/pilates-barcelona/' },
    ],
  },

  // 5. Clases por las mañanas
  {
    key: 'morning',
    titleKey: 'classCatMorningTitle',
    descriptionKey: 'classCatMorningDesc',
    detailedDescriptionKey: 'classDetailMorningDesc',
    pillarUrl: '/clases/baile-mananas-barcelona/',
    imageUrl:
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=600&fit=crop&q=80&auto=format',
    featuredStyles: [
      { key: 'afro_jazz', url: '/clases/afro-jazz-barcelona/' },
      { key: 'danza_contemporanea', url: '/clases/danza-contemporanea-barcelona/' },
      { key: 'sexy_reggaeton', url: '/clases/sexy-reggaeton-barcelona/' },
    ],
    allStyles: [
      { key: 'afro_jazz', url: '/clases/afro-jazz-barcelona/' },
      { key: 'danza_contemporanea', url: '/clases/danza-contemporanea-barcelona/' },
      { key: 'sexy_reggaeton', url: '/clases/sexy-reggaeton-barcelona/' },
      { key: 'sexy_style', url: '/clases/sexy-style-barcelona/' },
      { key: 'otras_danzas', url: '/clases/otras-danzas-barcelona/' },
    ],
  },

  // 6. Danzas del mundo y exóticas
  {
    key: 'world',
    titleKey: 'classCatWorldTitle',
    descriptionKey: 'classCatWorldDesc',
    detailedDescriptionKey: 'classDetailWorldDesc',
    pillarUrl: '/clases/otras-danzas-barcelona/',
    imageUrl:
      'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&h=600&fit=crop&q=80&auto=format',
    featuredStyles: [
      { key: 'kizomba', url: '/clases/kizomba-barcelona/' },
      { key: 'flamenco', url: '/clases/flamenco-barcelona/' },
      { key: 'sevillanas', url: '/clases/sevillanas-barcelona/' },
    ],
    allStyles: [
      { key: 'kizomba', url: '/clases/kizomba-barcelona/' },
      { key: 'semba', url: '/clases/semba-barcelona/' },
      { key: 'kompa', url: '/clases/kompa-barcelona/' },
      { key: 'flamenco', url: '/clases/flamenco-barcelona/' },
      { key: 'sevillanas', url: '/clases/sevillanas-barcelona/' },
      { key: 'telas_aereas', url: '/clases/telas-aereas-aro-barcelona/' },
      { key: 'acro_yoga', url: '/clases/acro-yoga-barcelona/' },
    ],
  },
];

// Featured styles for the "Estilos destacados" section
export const FEATURED_STYLES: StyleLink[] = [
  { key: 'afro_contemporaneo', url: '/clases/afro-contemporaneo-barcelona/' },
  { key: 'afro_jazz', url: '/clases/afro-jazz-barcelona/' },
  { key: 'femmology_heels', url: '/clases/femmology' },
  { key: 'danza_contemporanea', url: '/clases/danza-contemporanea-barcelona/' },
  { key: 'sexy_reggaeton', url: '/clases/sexy-reggaeton-barcelona/' },
  { key: 'dancehall', url: '/clases/dancehall-barcelona/' },
  { key: 'hip_hop', url: '/clases/hip-hop-barcelona/' },
  { key: 'salsa_cubana', url: '/clases/salsa-cubana-barcelona/' },
  { key: 'bachata', url: '/clases/bachata-barcelona/' },
  { key: 'ballet_clasico', url: '/clases/ballet-clasico-barcelona/' },
  { key: 'afrobeat', url: '/clases/afrobeat-barcelona/' },
  { key: 'sexy_style', url: '/clases/sexy-style-barcelona/' },
];
