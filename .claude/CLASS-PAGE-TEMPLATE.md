# Template para Crear Nuevas Páginas de Clases

Este documento contiene la estructura completa para crear una nueva página de estilo de baile, basado en las páginas optimizadas de ContemporaneoPage y AfroContemporaneoPage (10/10).

## Archivos a Crear/Modificar

1. `components/[StyleName]Page.tsx` - Componente React
2. `constants/[style-name].ts` - Configuración de datos
3. `i18n/locales/es.ts` - Traducciones españolas
4. `i18n/locales/en.ts`, `ca.ts`, `fr.ts` - Otras traducciones
5. `App.tsx` - Añadir ruta
6. `constants/danceClassesHub.ts` - Añadir al hub de clases

---

## 1. ESTRUCTURA DEL COMPONENTE (Page.tsx)

### Secciones en Orden (14 secciones):

```
1. HERO Section
   - Breadcrumb (4 niveles)
   - Title + Subtitle + Description + Location
   - Social Proof (4.9/5, 505+ reseñas, +15.000 alumnos, 8 años)
   - CTA Buttons (2)
   - Key Stats (3: minutos, calorías, técnica/diversión)

2. What Is Section
   - Título
   - 4 párrafos descriptivos
   - Pregunta + Respuesta

3. Schedule Section (componente ScheduleSection)

3b. Level Cards
   - Tarjetas según niveles ofrecidos

4. Teachers Section
   - Título + Subtítulo
   - Grid de profesores (con foto, nombre, especialidad, bio)
   - Frase de cierre

4b. Prepara tu Primera Clase
   - Qué traer (5 items)
   - Antes de llegar (3 items)
   - Evita (3 items)
   - Consejo del profesor (blockquote)

4c. Comparison Table
   - Tabla comparativa con otros estilos
   - Mobile: Cards view
   - Desktop: Table view
   - "What does this mean for you?" section

5. Identification Section (Puntos de dolor)
   - Título
   - 6 situaciones identificables
   - Transición
   - Necesitas enrollarte
   - Agitación
   - Solución
   - Cierre

6. Transformation Section
   - Título
   - 6 transformaciones (antes/después)

7. Why Choose Farray's + Logos
   - 7 cards de beneficios
   - Trust Bar (8+ años, 1500+ activos, 15000+ satisfechos)
   - Logos de medios

8. Why Today Section
   - 3 razones para empezar hoy
   - 2 frases de cierre

9. Video Section (YouTubeEmbed)

10. Testimonials (componente Testimonials)

11. Final CTA Section
    - Título + Subtítulo + Descripción + Frase graciosa
    - 2 CTAs

12. Cultural History (CulturalHistorySection con GEO)
    - Contenido expandible con citas **"texto citable"**

13. FAQ Section (15 FAQs)

14. Local SEO Section
    - Áreas cercanas con tiempos
```

---

## 2. ARCHIVO DE CONSTANTES (constants/[style-name].ts)

```typescript
import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration (15 FAQs for comprehensive SEO)
export const [STYLE]_FAQS_CONFIG: FAQ[] = [
  { id: '[style]-1', questionKey: '[style]FaqQ1', answerKey: '[style]FaqA1' },
  { id: '[style]-2', questionKey: '[style]FaqQ2', answerKey: '[style]FaqA2' },
  // ... hasta 15
];

// Testimonials
export const [STYLE]_TESTIMONIALS: Testimonial[] = [
  ...GOOGLE_REVIEWS_TESTIMONIALS,
  {
    id: 4,
    name: 'Nombre A.',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'English quote...',
      es: 'Quote en español...',
      ca: 'Quote en català...',
      fr: 'Quote en français...',
    },
  },
];

// Course schema configuration
export const [STYLE]_COURSE_CONFIG = {
  teaches: 'Keywords del estilo, técnicas, movimientos',
  prerequisites: 'Ninguno - clases para todos los niveles',
  lessons: 'Clases semanales',
  duration: 'PT1H',
};

// Schedule data
export const [STYLE]_SCHEDULE_KEYS = [
  {
    id: '1',
    dayKey: 'monday', // monday, tuesday, wednesday, thursday, friday, saturday
    className: 'Nombre Clase Nivel',
    time: '19:00 - 20:00',
    teacher: 'Nombre Profesor',
    levelKey: 'basicLevel', // basicLevel, intermediateLevel, advancedLevel, allLevels
  },
  // ... más horarios
];

// Level descriptions
export const [STYLE]_LEVELS = [
  {
    id: 'basico',
    levelKey: 'basicLevel',
    titleKey: '[style]LevelBasicTitle',
    descKey: '[style]LevelBasicDesc',
    teacher: 'Nombre Profesor',
    schedule: 'Día HH:MM - HH:MM',
    color: 'blue', // blue, orange, purple
  },
  // ... más niveles
];

// Nearby neighborhoods for local SEO
export const [STYLE]_NEARBY_AREAS = [
  { name: 'Plaza España', time: '5 min andando' },
  { name: 'Hostafrancs', time: '5 min andando' },
  { name: 'Sants Estació', time: '10 min andando' },
  { name: 'Les Corts', time: '15 min' },
  { name: 'Eixample Esquerra', time: '15 min' },
  { name: 'Poble Sec', time: '10 min' },
  { name: 'Sant Antoni', time: '12 min' },
  { name: "L'Hospitalet", time: '10 min' },
];

// Breadcrumb keys (4 niveles)
export const [STYLE]_BREADCRUMB_KEYS = {
  home: '[style]BreadcrumbHome',
  classes: '[style]BreadcrumbClasses',
  category: '[style]BreadcrumbCategory', // Urbanas, Técnica, Latinas, etc.
  current: '[style]BreadcrumbCurrent',
};

// YouTube video ID
export const [STYLE]_VIDEO_ID = 'YOUR_YOUTUBE_VIDEO_ID';

// ===== GEO OPTIMIZATION: Citable Statistics Keys =====
export const [STYLE]_GEO_KEYS = {
  definicion: '[style]CitableDefinicion',
  origin: '[style]CitableOrigen',
  tecnicas: '[style]CitableTecnicas',
  metodologia: '[style]CitableMetodologia',
  statistics: '[style]Statistics',
  globalEvolution: '[style]CitableEvolucionGlobal',
  music: '[style]CitableMusica',
  identityPower: '[style]CitableIdentidadPoder',
  fact1: '[style]CitableFact1',
  fact2: '[style]CitableFact2',
  fact3: '[style]CitableFact3',
  legado: '[style]CitableLegado',
};

// Hero Stats configuration
export const [STYLE]_HERO_STATS = {
  minutes: '60', // o '60-90'
  calories: 500,
  funPercent: 100, // o techniquePercent: 100
};
```

---

## 3. TEMPLATE DE TRADUCCIONES (i18n/locales/es.ts)

```typescript
// ===== [StyleName] Page =====

// Meta
[style]PageTitle: 'Clases de [StyleName] en Barcelona | Farray\'s Center',
[style]MetaDescription: 'Aprende [StyleName] en Barcelona con profesores especializados. Clases para todos los niveles cerca de Plaza España y Sants. ¡Reserva tu clase de prueba!',

// Breadcrumb (4 niveles)
[style]BreadcrumbHome: 'Inicio',
[style]BreadcrumbClasses: 'Clases de Baile',
[style]BreadcrumbCategory: '[Categoría]', // Danzas Urbanas, Técnica, Latinas, etc.
[style]BreadcrumbCurrent: 'Clases de [StyleName]',

// Hero
[style]HeroTitle: 'Clases de [StyleName] en Barcelona',
[style]HeroSubtitle: 'Subtítulo atractivo del estilo',
[style]HeroDesc: 'Descripción principal que engancha al usuario.',
[style]HeroLocation: 'Clases desde nivel principiante hasta avanzado, entre Plaza España y Sants',

// CTAs
[style]CTA1: 'Hazte Socio Ahora',
[style]CTA1Subtext: 'Quedan pocas plazas este mes',
[style]CTA2: 'Reserva tu Clase de Prueba',
[style]CTA2Subtext: 'Oferta por tiempo limitado',
[style]CTAGroup: 'Opciones de inscripción',

// What Is Section
[style]WhatIsTitle: '¿Qué es [StyleName] y por qué te va a transformar?',
[style]WhatIsP1: 'Primer párrafo descriptivo del estilo.',
[style]WhatIsP2: 'Segundo párrafo sobre técnicas y metodología.',
[style]WhatIsP3: 'Tercer párrafo sobre beneficios.',
[style]WhatIsP4: 'Cuarto párrafo sobre la experiencia en Farray\'s.',
[style]WhatIsQuestionTitle: '¿Te preguntas si es para ti?',
[style]WhatIsQuestionAnswer: 'Sí, lo es.',

// Schedule
[style]ScheduleTitle: 'Horario de clases de [StyleName]',
[style]ScheduleSubtitle: 'Varios niveles para que encuentres tu clase perfecta',

// Levels
[style]LevelBasicTitle: '[StyleName] Básico',
[style]LevelBasicDesc: 'Descripción del nivel básico.',
[style]LevelIntermediateTitle: '[StyleName] Intermedio',
[style]LevelIntermediateDesc: 'Descripción del nivel intermedio.',
// ... más niveles según corresponda

// Teachers
[style]TeachersTitle: 'Conoce a tus profesores de [StyleName]',
[style]TeachersSubtitle: 'Expertos con años de experiencia',
[style]Teacher1Specialty: 'Especialidad del profesor 1',
[style]Teacher1Bio: 'Biografía del profesor 1.',
[style]Teacher2Specialty: 'Especialidad del profesor 2',
[style]Teacher2Bio: 'Biografía del profesor 2.',
// ... más profesores
[style]TeachersClosing: 'Frase de cierre sobre los profesores.',

// Prepare Section
[style]PrepareTitle: 'Prepara tu primera clase de [StyleName]',
[style]PrepareSubtitle: 'Todo lo que necesitas saber antes de venir',
[style]PrepareWhatToBring: '¿Qué traer?',
[style]PrepareItem1: 'Ropa cómoda que permita movimiento',
[style]PrepareItem2: 'Zapatillas deportivas (o descalzo según estilo)',
[style]PrepareItem3: 'Botella de agua',
[style]PrepareItem4: 'Toalla pequeña',
[style]PrepareItem5: 'Ganas de pasarlo bien',
[style]PrepareBefore: 'Antes de llegar',
[style]PrepareBeforeItem1: 'Llega 10-15 minutos antes',
[style]PrepareBeforeItem2: 'Come algo ligero 1-2 horas antes',
[style]PrepareBeforeItem3: 'Hidrátate bien durante el día',
[style]PrepareAvoid: 'Evita',
[style]PrepareAvoidItem1: 'Ropa muy ajustada que limite movimiento',
[style]PrepareAvoidItem2: 'Comer justo antes de clase',
[style]PrepareAvoidItem3: 'Joyas o accesorios que molesten',
[style]PrepareTeacherTip: 'Consejo de [NombreProfesor]:',
[style]PrepareTeacherQuote: 'Frase inspiradora del profesor.',

// Comparison Table
[style]CompareTitle: '¿Cómo se compara [StyleName] con otros estilos?',
[style]CompareSubtitle: 'Encuentra el estilo que mejor se adapta a ti',
[style]CompareCapacity: 'Capacidad',
[style]Compare[Style]: '[StyleName]',
[style]CompareOther1: 'Otro Estilo 1',
[style]CompareOther2: 'Otro Estilo 2',
[style]CompareOther3: 'Otro Estilo 3',
[style]CompareRow1: 'Aspecto comparativo 1',
[style]CompareRow2: 'Aspecto comparativo 2',
// ... hasta 11 rows
[style]CompareMeaningTitle: '¿Qué significa esto para ti?',
[style]CompareMeaning1Title: 'Beneficio 1',
[style]CompareMeaning1Desc: 'Descripción del beneficio 1.',
[style]CompareMeaning2Title: 'Beneficio 2',
[style]CompareMeaning2Desc: 'Descripción del beneficio 2.',
[style]CompareMeaning3Title: 'Beneficio 3',
[style]CompareMeaning3Desc: 'Descripción del beneficio 3.',
[style]CompareMeaning4Title: 'Beneficio 4',
[style]CompareMeaning4Desc: 'Descripción del beneficio 4.',
[style]CompareConclusion: 'Frase de conclusión sobre el estilo.',

// Identify Section
[style]IdentifyTitle: '¿Te identificas con alguna de estas situaciones?',
[style]IdentifyListLabel: 'Lista de situaciones con las que te puedes identificar',
[style]Identify1: 'Situación identificable 1',
[style]Identify2: 'Situación identificable 2',
[style]Identify3: 'Situación identificable 3',
[style]Identify4: 'Situación identificable 4',
[style]Identify5: 'Situación identificable 5',
[style]Identify6: 'Situación identificable 6',
[style]IdentifyTransition: 'Si has dicho "sí" a alguno de estos puntos, ya sabes lo que necesitas.',
[style]NeedEnrollTitle: 'Necesitas apuntarte a clases de [StyleName]',
[style]IdentifyAgitate1: 'Frase de agitación sobre no actuar.',
[style]IdentifySolution: 'En Farray\'s Center encontrarás un espacio pensado para ti.',
[style]IdentifyClosing: 'Frase de cierre motivacional.',

// Transform Section
[style]TransformTitle: 'Imagina tu antes y después',
[style]Transform1Title: 'Transformación 1',
[style]Transform1Desc: 'Descripción de la transformación 1.',
[style]Transform2Title: 'Transformación 2',
[style]Transform2Desc: 'Descripción de la transformación 2.',
[style]Transform3Title: 'Transformación 3',
[style]Transform3Desc: 'Descripción de la transformación 3.',
[style]Transform4Title: 'Transformación 4',
[style]Transform4Desc: 'Descripción de la transformación 4.',
[style]Transform5Title: 'Transformación 5',
[style]Transform5Desc: 'Descripción de la transformación 5.',
[style]Transform6Title: 'Transformación 6',
[style]Transform6Desc: 'Descripción de la transformación 6.',
[style]TransformCTA: '¿Por qué elegir Farray\'s Center?',
[style]TransformCTASubtitle: 'Tu academia de [StyleName] en Barcelona',

// Why Choose Section (7 items)
[style]WhyChoose1Title: 'Academia reconocida por el CID UNESCO',
[style]WhyChoose1Desc: 'Dirigida por Yunaisy Farray, con reconocimiento internacional.',
[style]WhyChoose2Title: 'Ubicación inmejorable',
[style]WhyChoose2Desc: 'Calle Entença 100, entre Plaza España y Sants.',
[style]WhyChoose3Title: 'Ambiente familiar y profesional',
[style]WhyChoose3Desc: 'Acogedor, inclusivo, sin juicios.',
[style]WhyChoose4Title: 'Instalaciones de primer nivel',
[style]WhyChoose4Desc: 'Más de 700 m², salas amplias, sonido profesional.',
[style]WhyChoose5Title: 'Academia multidisciplinar',
[style]WhyChoose5Desc: 'Más de 25 estilos para explorar.',
[style]WhyChoose6Title: 'Gala anual + workshops',
[style]WhyChoose6Desc: 'Brilla en escenario profesional.',
[style]WhyChoose7Title: 'Profesores especializados',
[style]WhyChoose7Desc: 'Expertos en [StyleName] con años de experiencia.',

// Logos
[style]LogosTitle: 'Has podido vernos en…',
[style]LogosIntlFestivalsText: 'y en los mejores festivales de baile del mundo',

// Video
[style]VideoTitle: 'Descubre nuestras clases de [StyleName]',
[style]VideoDesc: 'Mira cómo es una clase en Farray\'s: energía, técnica y buen rollo.',

// Why Today
[style]WhyTodayFullTitle: '¿Por qué hoy es el mejor momento para empezar?',
[style]WhyToday1: 'Primera razón para empezar hoy.',
[style]WhyToday2: 'Segunda razón para empezar hoy.',
[style]WhyToday3: 'Tercera razón para empezar hoy.',
[style]WhyTodayClosing1: 'En Farray\'s no vendemos clases. Creamos experiencias.',
[style]WhyTodayClosing2: 'Te esperamos con música, profes carismáticos y energía única.',

// Final CTA
[style]FinalCTATitle: 'Únete a la comunidad de [StyleName] de Barcelona',
[style]FinalCTASubtitle: 'Da el paso.',
[style]FinalCTADesc: 'Reserva tu plaza ahora y no dejes que te lo cuenten.',
[style]FinalCTAFunny: 'Frase graciosa sobre las plazas limitadas.',

// FAQ Title
[style]FaqTitle: 'Preguntas Frecuentes sobre [StyleName] en Barcelona',

// 15 FAQs
[style]FaqQ1: '¿Cómo funcionan las clases de [StyleName]?',
[style]FaqA1: 'Respuesta completa...',
[style]FaqQ2: '¿Puedo empezar desde cero?',
[style]FaqA2: 'Respuesta completa...',
// ... hasta Q15/A15 (última con datos de contacto)

// Local SEO
[style]NearbyTitle: 'Clases de [StyleName] cerca de ti',
[style]NearbyDesc: 'Estamos en el corazón de Barcelona, accesibles desde cualquier punto.',
[style]NearbySearchText: '¿Buscas clases de [StyleName] cerca de...?',
[style]NearbyMetro: 'Metro Hostafrancs (L1), Plaza España (L1, L3), Sants Estació (L3, L5, Renfe)',

// Course Schema
[style]CourseSchemaName: 'Clases de [StyleName] en Barcelona - Farray\'s Center',
[style]CourseSchemaDesc: 'Aprende [StyleName] con profesores especializados.',

// Cultural History
[style]CulturalHistoryTitle: 'Historia y Cultura del [StyleName]',
[style]CulturalShort: 'Breve introducción a la historia del estilo (1-2 frases).',
[style]CulturalFull: `### Sección 1: Orígenes

Contenido sobre los orígenes del estilo.

**"Cita destacada GEO-optimizada para IAs."**

### Sección 2: Evolución

Contenido sobre la evolución del estilo.

**"Otra cita destacada GEO-optimizada."**

### Sección 3: El estilo hoy

Contenido sobre el estado actual.

**"Cita final GEO-optimizada."**`,

// ===== GEO OPTIMIZATION: Citable Statistics =====
[style]CitableDefinicion: 'Definición oficial del estilo para ser citada por IAs.',
[style]CitableOrigen: 'Origen histórico con fechas y nombres específicos.',
[style]CitableTecnicas: 'Técnicas principales del estilo.',
[style]CitableMetodologia: 'Metodología de enseñanza en Farray\'s.',
[style]Statistics: 'Estadísticas científicas sobre beneficios.',
[style]CitableEvolucionGlobal: 'Evolución global del estilo.',
[style]CitableMusica: 'Música asociada al estilo.',
[style]CitableIdentidadPoder: 'Aspectos de identidad y empoderamiento.',
[style]CitableFact1: 'Dato citable 1 (ej: calorías quemadas).',
[style]CitableFact2: 'Dato citable 2 (ej: beneficios cognitivos).',
[style]CitableFact3: 'Dato citable 3 (ej: valoración en Google).',
[style]CitableLegado: 'Legado del estilo.',
```

---

## 4. CHECKLIST ANTES DE CREAR

- [ ] Definir nombre del estilo (ej: `afrojazz`, `sexyStyle`, `reggaetonCubano`)
- [ ] Identificar categoría (Urbanas, Técnica, Latinas, etc.)
- [ ] Obtener horarios reales
- [ ] Identificar profesores y sus bios
- [ ] Definir niveles ofrecidos
- [ ] Preparar contenido GEO (citas, estadísticas)
- [ ] Preparar 15 FAQs optimizadas para SEO
- [ ] Obtener ID de video de YouTube (si existe)
- [ ] Preparar fotos de profesores (320x320, 640x640 en webp y jpg)

---

## 5. IMPORTS NECESARIOS EN EL COMPONENTE

```typescript
import { Helmet } from 'react-helmet-async';
import { useI18n } from '../hooks/useI18n';
import Breadcrumb from './shared/Breadcrumb';
import {
  [STYLE]_TESTIMONIALS,
  [STYLE]_FAQS_CONFIG,
  [STYLE]_SCHEDULE_KEYS,
  [STYLE]_NEARBY_AREAS,
} from '../constants/[style-name]';
import AnimateOnScroll from './AnimateOnScroll';
import CulturalHistorySection from './CulturalHistorySection';
import ScheduleSection from './ScheduleSection';
import FAQSection from './FAQSection';
import AnimatedCounter from './AnimatedCounter';
import YouTubeEmbed from './YouTubeEmbed';
import { LocalBusinessSchema, CourseSchema, AggregateReviewsSchema } from './SchemaMarkup';
import {
  StarRating,
  CheckIcon,
  CheckCircleIcon,
  ClockIcon,
  FlameIcon,
  StarIcon,
} from './shared/Icons';
```

---

## 6. NOTAS IMPORTANTES

1. **Social Proof fijo**: 4.9/5, 505+ reseñas, +15.000 alumnos, 8 años en Barcelona
2. **Key Stats**: Usar valores estáticos para mejor rendimiento (`~500/h` en vez de AnimatedCounter para calorías)
3. **GEO Citations**: Las citas en CulturalFull deben estar en formato **"Texto citable."**
4. **FAQs**: La FAQ 15 SIEMPRE debe incluir datos de contacto con enlaces
5. **ESLint**: Evitar imports no usados, usar Prettier para formateo
6. **Accesibilidad**: Usar aria-labels, roles, ids para secciones

---

Actualizado: Diciembre 2024
Basado en: ContemporaneoPage.tsx y AfroContemporaneoPage.tsx (10/10)
