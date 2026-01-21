# Prompt Enterprise: Crear Nueva Página de Clase de Baile

## Instrucción para Claude

Necesito crear la página de **[NOMBRE DEL ESTILO]** en Barcelona para Farray's Center, siguiendo el patrón enterprise exacto usado en K-Pop y Commercial Dance.

---

## A) ARCHIVOS A CREAR (3 archivos)

### 1. `components/[Estilo]DancePage.tsx` (3 líneas)

```tsx
import FullDanceClassTemplate from './templates/FullDanceClassTemplate';
import { [ESTILO]_PAGE_CONFIG } from '../constants/[estilo]-config';

const [Estilo]DancePage: React.FC = () => {
  return <FullDanceClassTemplate config={[ESTILO]_PAGE_CONFIG} />;
};

export default [Estilo]DancePage;
```

### 2. `constants/[estilo].ts` (datos)

```typescript
import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration (15 FAQs)
export const [ESTILO]_FAQS_CONFIG: FAQ[] = [
  { id: '[estilo]-1', questionKey: '[estilo]FaqQ1', answerKey: '[estilo]FaqA1' },
  // ... hasta 15
];

// Testimonials (usar categoría apropiada de Google Reviews)
export const [ESTILO]_TESTIMONIALS: Testimonial[] = [...GOOGLE_REVIEWS_TESTIMONIALS];

// Course schema configuration
export const [ESTILO]_COURSE_CONFIG = {
  teaches: '[Descripción técnica del estilo]',
  prerequisites: 'Ninguno',
  lessons: 'Próximamente',
  duration: 'PT1H',
};

// Schedule data (vacío = waitlist mode)
export const [ESTILO]_SCHEDULE_KEYS: Array<{
  id: string;
  dayKey: string;
  className: string;
  time: string;
  teacher: string;
  levelKey: string;
}> = [];

// Level descriptions - Solo Iniciación para páginas nuevas
export const [ESTILO]_LEVELS = [
  {
    id: 'iniciacion',
    levelKey: 'beginnerLevel',
    titleKey: '[estilo]LevelBeginnerTitle',
    descKey: '[estilo]LevelBeginnerDesc',
    duration: '0-3 meses',
    color: 'primary-dark' as const,
  },
];

// Prepare config (comentado hasta asignar profesor)
export const [ESTILO]_PREPARE_CONFIG = {
  prefix: '[estilo]Prepare',
  whatToBringCount: 5,
  beforeCount: 3,
  avoidCount: 3,
  teacher: {
    name: "Farray's Center",
    credential: 'Especialista en [Estilo]',
    image: '/images/teachers/placeholder-teacher.svg',
  },
};
```

### 3. `constants/[estilo]-config.ts` (configuración completa)

```typescript
import {
  [ESTILO]_TESTIMONIALS,
  [ESTILO]_FAQS_CONFIG,
  [ESTILO]_SCHEDULE_KEYS,
  [ESTILO]_LEVELS,
  // [ESTILO]_PREPARE_CONFIG, // Descomentar cuando haya profesor
} from './[estilo]';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const [ESTILO]_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: '[estilo]',
  stylePath: '[estilo]-dance-barcelona', // o '[estilo]-barcelona' según el estilo

  // === REQUIRED DATA ===
  faqsConfig: [ESTILO]_FAQS_CONFIG,
  testimonials: [ESTILO]_TESTIMONIALS,
  scheduleKeys: [ESTILO]_SCHEDULE_KEYS,

  // Teachers (pendiente asignación - vacío por ahora)
  teachers: [],

  // Breadcrumb (4 niveles: Home > Classes > Category > Current)
  breadcrumbConfig: {
    homeKey: '[estilo]BreadcrumbHome',
    classesKey: '[estilo]BreadcrumbClasses',
    categoryKey: '[estilo]BreadcrumbCategory', // Urbanas/Latinas/Artísticas
    categoryUrl: '/clases/[categoria]-barcelona', // URL de la categoría padre
    currentKey: '[estilo]BreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: [ESTILO]_LEVELS,
  // prepareConfig: [ESTILO]_PREPARE_CONFIG, // Oculto hasta asignar profesor

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 400, // Ajustar según intensidad del estilo (350-500)
    funPercent: 100,
    gradientColor: 'primary', // Opciones: 'primary', 'secondary', 'accent'
    // heroImage: '/images/classes/[estilo]-hero.webp', // Descomentar cuando haya foto
  },

  // Disable Momence sync hasta programar clases
  useDynamicSchedule: false,

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 4,
    hasQuestionAnswer: true,
    // image: '/images/classes/[estilo]-what-is.webp', // Descomentar cuando haya foto
  },

  identificationSection: {
    enabled: true,
    itemCount: 6,
    hasTransition: true,
    hasNeedEnroll: true,
  },

  transformationSection: {
    enabled: true,
    itemCount: 6,
  },

  whyChooseSection: {
    enabled: true,
    itemOrder: [1, 2, 3, 4, 5, 7], // 6 items
  },

  whyTodaySection: {
    enabled: true,
    paragraphCount: 3,
  },

  videoSection: {
    enabled: false, // Deshabilitado hasta tener video
    videos: [],
    placeholderCount: 0,
  },

  logosSection: {
    enabled: true,
  },

  nearbySection: {
    enabled: true,
    keyPrefix: '[estilo]',
  },

  culturalHistory: {
    enabled: true,
    titleKey: '[estilo]CulturalHistoryTitle',
    shortDescKey: '[estilo]CulturalShort',
    fullHistoryKey: '[estilo]CulturalFull',
  },

  // === GOOGLE REVIEWS SECTION ===
  // Categorías disponibles:
  // - 'general' → Para estilos nuevos sin categoría específica
  // - 'urbanas' → Hip Hop, Commercial, Afrobeats, Dancehall, K-Pop
  // - 'latinas' → Bachata, Salsa, Kizomba, Merengue
  // - 'artisticas' → Ballet, Contemporáneo, Modern Jazz
  googleReviewsSection: {
    enabled: true,
    category: '[categoria]', // Elegir según el estilo
    limit: 6,
    showGoogleBadge: true,
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teaches: '[Descripción técnica del estilo para schema.org]',
    prerequisites: 'Ninguno',
    lessons: 'Próximamente',
    duration: 'PT1H',
  },

  videoSchema: {
    titleKey: '[estilo]VideoTitle',
    descKey: '[estilo]VideoDesc',
    thumbnailUrl: '',
    videoId: '',
  },

  personSchemas: [], // Vacío hasta asignar profesores

  // === RELATED CLASSES (internal linking) ===
  // Elegir 3 clases relacionadas del mismo grupo o complementarias
  relatedClasses: {
    enabled: true,
    classes: [
      {
        slug: '[clase-relacionada-1]-barcelona',
        nameKey: 'related[Clase1]Name',
        descriptionKey: 'related[Clase1]Desc',
      },
      {
        slug: '[clase-relacionada-2]-barcelona',
        nameKey: 'related[Clase2]Name',
        descriptionKey: 'related[Clase2]Desc',
      },
      {
        slug: '[clase-relacionada-3]-barcelona',
        nameKey: 'related[Clase3]Name',
        descriptionKey: 'related[Clase3]Desc',
      },
    ],
  },

  // === COMPARISON SECTIONS (OPCIONAL) ===
  // Solo si el estilo tiene comparaciones naturales con otros
  // Opciones disponibles:
  // - latinDanceComparison: true → Para bailes latinos (Bachata vs Salsa vs Kizomba)
  // - artisticDanceComparison: true → Para bailes artísticos (Ballet vs Contemporáneo)
  // Dejar sin definir si no aplica
};
```

---

## B) ARCHIVOS A MODIFICAR (6 archivos)

### 4. `App.tsx`

```typescript
// Añadir lazy import (~línea 70, orden alfabético)
const [Estilo]DancePage = lazy(() => import('./components/[Estilo]DancePage'));

// Añadir ruta (~línea 375, dentro de las rutas de clases)
<Route path="/:locale/clases/[estilo]-dance-barcelona" element={<[Estilo]DancePage />} />
```

### 5. `prerender.mjs`

```javascript
// A) Añadir 4 rutas (una por locale) en el array routes:
{ path: 'es/clases/[estilo]-dance-barcelona', lang: 'es', page: '[estilo]Dance' },
{ path: 'ca/clases/[estilo]-dance-barcelona', lang: 'ca', page: '[estilo]Dance' },
{ path: 'en/clases/[estilo]-dance-barcelona', lang: 'en', page: '[estilo]Dance' },
{ path: 'fr/clases/[estilo]-dance-barcelona', lang: 'fr', page: '[estilo]Dance' },

// B) Añadir metadata en metadata.es, metadata.ca, metadata.en, metadata.fr:
[estilo]Dance: {
  title: 'Clases de [Estilo] en Barcelona | Farray\'s Center',
  description: '[Descripción SEO 150-160 chars con keywords principales]',
},

// C) Añadir en pagePath mapping para hreflang:
'[estilo]Dance': '[estilo]-dance-barcelona',
```

### 6-9. Traducciones en 4 idiomas

Archivos: `i18n/locales/es.ts`, `ca.ts`, `en.ts`, `fr.ts`

**~144 claves por idioma, organizadas así:**

| Sección          | Claves | Prefijo                                |
| ---------------- | ------ | -------------------------------------- |
| Meta/SEO         | 3      | `[estilo]Meta*`                        |
| Breadcrumb       | 4      | `[estilo]Breadcrumb*`                  |
| Hero             | 6      | `[estilo]Hero*`                        |
| What Is          | 6      | `[estilo]WhatIs*`                      |
| Cultural History | 3      | `[estilo]Cultural*`                    |
| Identification   | 10     | `[estilo]Identification*`              |
| Transformation   | 13     | `[estilo]Transform*`                   |
| Why Choose       | 12     | `[estilo]WhyChoose*`                   |
| Why Today        | 5      | `[estilo]WhyToday*`                    |
| Levels           | 6      | `[estilo]Level*`                       |
| FAQs             | 30     | `[estilo]FaqQ1-15`, `[estilo]FaqA1-15` |
| Nearby/SEO Local | 6      | `[estilo]Nearby*`                      |
| Logos            | 3      | `[estilo]Logos*`                       |
| CTAs             | 8      | `[estilo]Cta*`                         |
| Otros            | ~29    | Varios                                 |

---

## C) SEO LOCAL/GEO (Barcelona específico)

### Clave `[estilo]NearbyMetro` - SIN EMOJIS

Formato correcto (igual que K-Pop, Commercial, etc.):

```typescript
[estilo]NearbyMetro:
  'Metro: Rocafort (L1) 4 min, Plaza España (L1, L3) 5 min, Entença (L5) 6 min, Hostafrancs (L1) 5 min. Tren: Sants Estació (Renfe, AVE, FGC) 8 min. Bus: H10, 27, 109, D40 en la puerta. Bicing: 3 estaciones a menos de 100m.',
```

### Clave `[estilo]NearbyDesc` - Ubicación + beneficios

```typescript
[estilo]NearbyDesc:
  'Nuestra academia está en el corazón de Barcelona, en la zona de Sants-Hostafrancs. [Mencionar accesibilidad y ventajas de la ubicación para este estilo específico].',
```

---

## D) CONTENIDO REQUERIDO POR SECCIÓN

### 1. What Is Section (4 párrafos)

- P1: Definición del estilo y origen
- P2: Características técnicas distintivas
- P3: Beneficios físicos y emocionales
- P4: Por qué aprenderlo en Farray's

### 2. Cultural History (3 partes)

- Title: Título atractivo sobre la historia
- Short: Resumen de 2-3 líneas
- Full: Historia completa (300-500 palabras) con:
  - Orígenes históricos/geográficos
  - Evolución del estilo
  - Figuras importantes
  - Estado actual y tendencias

### 3. Identification Section (6 items)

Señales de que este estilo es para ti:

- Item 1-6: Características/deseos que identifican al alumno ideal

### 4. Transformation Section (6 items)

Beneficios que obtendrás:

- Item 1-6: Transformaciones físicas, técnicas y emocionales

### 5. Why Choose Section (6 items)

Por qué elegir Farray's:

- Metodología única
- Ambiente inclusivo
- Ubicación privilegiada
- Profesores expertos
- Comunidad activa
- Precio justo

### 6. Why Today Section (3 párrafos)

Urgencia y motivación para empezar hoy

### 7. FAQs (15 preguntas/respuestas)

Cubrir:

- Requisitos previos
- Ropa/calzado
- Niveles disponibles
- Horarios
- Precios
- Diferencias con otros estilos
- Edad mínima/máxima
- Beneficios físicos
- Tiempo para ver resultados
- Clases de prueba

---

## E) VERIFICACIÓN POST-CREACIÓN

### Build

```bash
npm run build
```

Verificar que existan:

- `dist/es/clases/[estilo]-dance-barcelona/index.html`
- `dist/ca/clases/[estilo]-dance-barcelona/index.html`
- `dist/en/clases/[estilo]-dance-barcelona/index.html`
- `dist/fr/clases/[estilo]-dance-barcelona/index.html`

### Dev Server

```bash
npm run dev
# Navegar a http://localhost:5173/es/clases/[estilo]-dance-barcelona
```

### Checklist Final

- [ ] Sin errores de claves de traducción en consola
- [ ] Title y description correctos en `<head>`
- [ ] Breadcrumbs navegables
- [ ] FAQs expandibles funcionando
- [ ] Google Reviews cargando
- [ ] Related classes con links correctos
- [ ] Formulario de waitlist visible (si no hay horarios)

---

## F) EJEMPLO: KIZOMBA

Para crear la página de Kizomba, reemplazar:

- `[ESTILO]` → `KIZOMBA`
- `[Estilo]` → `Kizomba`
- `[estilo]` → `kizomba`
- `[categoria]` → `latinas`
- `categoryUrl` → `/clases/bailes-latinos-barcelona`
- `categoryKey` → `kizombaBreadcrumbLatinas`
- Google Reviews category → `'latinas'`
- Related classes → Bachata, Salsa, Zouk

---

## G) NOTAS IMPORTANTES

1. **Waitlist Mode**: Todas las páginas nuevas empiezan sin horarios (`useDynamicSchedule: false`)

2. **Sin Profesores**: `teachers: []` hasta asignar profesor real

3. **Sin Imágenes**: Comentar `heroImage` y `whatIsSection.image` hasta tener fotos

4. **Sin Videos**: `videoSection.enabled: false` hasta tener contenido

5. **Comparison Sections**: Solo añadir si el estilo tiene comparaciones naturales:
   - `latinDanceComparison: true` para bailes latinos
   - `artisticDanceComparison: true` para bailes artísticos

6. **NearbyMetro**: SIEMPRE sin emojis, formato texto plano

7. **Contenido Humanizado**: Evitar lenguaje genérico de IA. Usar datos específicos, historia real, beneficios concretos.
