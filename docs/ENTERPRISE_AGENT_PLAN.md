# Plan Enterprise: Super Agente Laura v2.0

> **Fecha de Creación:** 2026-02-07
> **Estado:** Pendiente de aprobación
> **Objetivo:** Transformar Laura de un agente funcional a un agente enterprise de clase mundial
> **Stack:** 100% Anthropic (Haiku + Sonnet) - Sin dependencias externas de embeddings

---

## Resumen Ejecutivo

Este documento presenta el plan para convertir al agente de WhatsApp "Laura" en un sistema enterprise con:

1. **Arquitectura Híbrida Anthropic** - Haiku para queries simples, Sonnet para complejas
2. **Sistema Unificado de Estilos** - Un solo archivo maestro usado por todo el sistema
3. **Consultas Momence Optimizadas** - Cache inteligente + queries complejas
4. **Multi-idioma Completo** - 4 idiomas con FAQs completas
5. **Sincronización Automática** - Momence → Knowledge Base
6. **Sin embeddings externos** - Búsqueda por keywords mejorada + contexto Claude

---

## Diagnóstico del Sistema Actual

### Análisis de Archivos Críticos

| Archivo             | Líneas | Función              | Problemas                           |
| ------------------- | ------ | -------------------- | ----------------------------------- |
| `agent.ts`          | 1773   | Core del agente      | 13 estilos duplicados, prompt fijo  |
| `knowledge-base.ts` | 1166   | Base de conocimiento | Sin embeddings, FAQs incompletas    |
| `member-lookup.ts`  | 860    | Consultas Momence    | 12 estilos duplicados, sin caché    |
| `clases.ts`         | 512    | API de clases        | 50 estilos (más completo), caché ok |

### Problema #1: Tres Sistemas de Estilos Diferentes

```
┌─────────────────────────────────────────────────────────────────┐
│                   FRAGMENTACIÓN DE ESTILOS                      │
├─────────────────────────────────────────────────────────────────┤
│ agent.ts:148-161        → 13 estilos (bachata, salsa, reggaeton...)
│ member-lookup.ts:718-738 → 12 estilos (similar pero diferente)
│ clases.ts:114-158       → 50 estilos (el más completo)
└─────────────────────────────────────────────────────────────────┘

RESULTADO: Inconsistencias en detección
- Usuario dice "heels" → agent.ts lo detecta
- Usuario dice "hip hop reggaeton" → clases.ts lo detecta, agent.ts NO
- Usuario dice "cuerpo fit" → clases.ts lo detecta, member-lookup.ts NO
```

**Código duplicado encontrado:**

```typescript
// agent.ts línea 148
const styleKeywords: Record<string, string[]> = {
  bachata: ['bachata'],
  salsa: ['salsa', 'timba', 'cubana'],
  reggaeton: ['reggaeton', 'reggaetón', 'reparto', 'perreo'],
  // ... 10 más
};

// member-lookup.ts línea 718
const styleKeywords: Record<string, string[]> = {
  bachata: ['bachata'],
  salsa: ['salsa', 'timba'],
  reggaeton: ['reggaeton', 'reggaetón', 'reparto', 'perreo'],
  // ... 9 más
};

// clases.ts línea 114
const STYLE_KEYWORDS: Record<string, string[]> = {
  // 50 estilos con mapeos completos
  afrocontemporaneo: ['afro contemporáneo', 'afro contemporaneo', 'afro contemp'],
  ballet: ['ballet', 'ballet clásico', 'ballet clasico'],
  // ... 48 más
};
```

### Problema #2: Knowledge Base Desincronizado

```typescript
// knowledge-base.ts línea 113 - Solo 4 profesores hardcodeados
export const TEACHERS = {
  founder: { name: 'Yunaisy Farray', ... },
  instructors: [
    { name: 'Mathias Font', specialty: 'Bachata Sensual' },
    { name: 'Eugenia Trujillo', specialty: 'Bachata Sensual' },
    { name: 'Sandra Gómez', specialty: 'Twerk' },
  ],
};

// PERO Momence tiene MÁS profesores con:
// - pictureUrl
// - description
// - Clases que imparten
```

### Problema #3: FAQs Incompletas por Idioma

| Idioma  | FAQs Actuales | FAQs Necesarias | Completitud |
| ------- | ------------- | --------------- | ----------- |
| Español | 21            | 21              | 100%        |
| Catalán | 5             | 21              | 24%         |
| Inglés  | 5             | 21              | 24%         |
| Francés | 5             | 21              | 24%         |

### Problema #4: Consultas Ineficientes

```typescript
// member-lookup.ts línea 619 - Solo 7 días, sin caché propio
async fetchUpcomingSessions(styleFilter?: string, daysAhead: number = 7)

// agent.ts línea 786 - Llama a member-lookup sin aprovechar caché de clases.ts
const sessions = await memberLookup.fetchUpcomingSessions(query.styleFilter, 7);

// clases.ts línea 29-33 - Tiene caché de 30 min pero no se reutiliza
const CACHE_TTL_SECONDS = 30 * 60;
const CACHE_KEY = 'momence:sessions:cache';
```

### Problema #5: Búsqueda Sin Scoring

```typescript
// knowledge-base.ts línea 1095 - Búsqueda simple por keywords
export function findFAQAnswer(query: string, lang: SupportedLanguage): FAQ | null {
  const normalizedQuery = query.toLowerCase();
  const faqs = FAQS[lang] || FAQS.es;

  for (const faq of faqs) {
    for (const keyword of faq.keywords) {
      if (normalizedQuery.includes(keyword.toLowerCase())) {
        return faq; // ← Retorna el PRIMER match, sin scoring
      }
    }
  }
  return null;
}

// PROBLEMA: "cuánto cuesta la bachata" retorna FAQ de precios aunque
// el usuario quiere saber sobre clases de bachata específicamente.
```

**Solución Híbrida:** Query Router que analiza intent + contexto antes de buscar.

---

## Arquitectura Enterprise Propuesta (100% Anthropic)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    LAURA ENTERPRISE v2.0                            │
│                    (100% Anthropic Stack)                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│  │   WhatsApp   │    │  Instagram   │    │    Email     │          │
│  │    Webhook   │    │    Webhook   │    │    Webhook   │          │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘          │
│         │                   │                   │                   │
│         └───────────────────┴───────────────────┘                   │
│                             │                                       │
│                    ┌────────▼────────┐                              │
│                    │   ORCHESTRATOR   │                             │
│                    │   (agent.ts)     │                             │
│                    └────────┬────────┘                              │
│                             │                                       │
│              ┌──────────────┼──────────────┐                        │
│              │              │              │                        │
│              ▼              ▼              ▼                        │
│  ┌─────────────────┐ ┌───────────┐ ┌─────────────┐                 │
│  │  QUERY ROUTER   │ │  Momence  │ │   Booking   │                 │
│  │                 │ │  Service  │ │    Flow     │                 │
│  └────────┬────────┘ └─────┬─────┘ └─────────────┘                 │
│           │                │                                        │
│     ┌─────┴─────┐          │                                        │
│     │           │          │                                        │
│     ▼           ▼          ▼                                        │
│  ┌──────┐  ┌────────┐  ┌───────┐                                   │
│  │HAIKU │  │ SONNET │  │ Redis │                                   │
│  │ Fast │  │ Smart  │  │ Cache │                                   │
│  │ 80%  │  │  20%   │  │       │                                   │
│  └──────┘  └────────┘  └───────┘                                   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    KNOWLEDGE BASE                            │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │   │
│  │  │  FAQs    │ │ Estilos  │ │ Precios  │ │Profesores│        │   │
│  │  │(4 langs) │ │(unificado│ │          │ │(Momence) │        │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Flujo de Decisión del Query Router

```
Usuario envía mensaje
        │
        ▼
┌───────────────────┐
│ Detectar idioma   │
│ Detectar intent   │
└────────┬──────────┘
         │
         ▼
┌────────────────────────────────────────────────────────┐
│                    QUERY ROUTER                         │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ¿Es saludo simple?          → Respuesta template      │
│  ¿Es FAQ conocida?           → Haiku + KB snippet      │
│  ¿Es query de horarios?      → Momence API + Haiku     │
│  ¿Es booking flow?           → Booking state machine   │
│  ¿Es query compleja?         → Sonnet + KB completo    │
│  ¿Es objeción?               → Objection handler       │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## Plan de Implementación: 8 Fases

### Fase 1: Sistema Unificado de Estilos (Día 1-2)

**Objetivo:** UN SOLO archivo con TODOS los estilos usado por todo el sistema.

#### Crear `constants/style-mappings.ts`

```typescript
/**
 * FUENTE ÚNICA DE VERDAD para mapeo de estilos de baile
 *
 * Usado por:
 * - api/clases.ts (detección de estilo en sesiones Momence)
 * - api/lib/ai/agent.ts (detección de intent de schedule)
 * - api/lib/ai/member-lookup.ts (filtrado de sesiones)
 * - api/lib/ai/booking-flow.ts (selección de estilo)
 */

export interface StyleDefinition {
  id: string; // ID único interno
  displayName: {
    // Nombre para mostrar por idioma
    es: string;
    ca: string;
    en: string;
    fr: string;
  };
  keywords: string[]; // Todos los sinónimos/variantes
  category: 'latin' | 'urban' | 'dance' | 'heels' | 'fitness';
  level?: 'all' | 'beginner' | 'intermediate' | 'advanced';
  description?: {
    // Descripción corta por idioma
    es: string;
    ca: string;
    en: string;
    fr: string;
  };
}

export const STYLE_MAPPINGS: StyleDefinition[] = [
  // === DANZA - Específicos primero ===
  {
    id: 'afrocontemporaneo',
    displayName: {
      es: 'Afro Contemporáneo',
      ca: 'Afro Contemporani',
      en: 'Afro Contemporary',
      fr: 'Afro Contemporain',
    },
    keywords: ['afro contemporáneo', 'afro contemporaneo', 'afro contemp', 'afro contemporary'],
    category: 'dance',
  },
  {
    id: 'ballet',
    displayName: { es: 'Ballet', ca: 'Ballet', en: 'Ballet', fr: 'Ballet' },
    keywords: ['ballet', 'ballet clásico', 'ballet clasico', 'ballet classique'],
    category: 'dance',
  },
  {
    id: 'contemporaneo',
    displayName: {
      es: 'Contemporáneo',
      ca: 'Contemporani',
      en: 'Contemporary',
      fr: 'Contemporain',
    },
    keywords: ['contemporáneo', 'contemporaneo', 'contemporary', 'contemp', 'danza contemporánea'],
    category: 'dance',
  },
  {
    id: 'jazz',
    displayName: { es: 'Jazz', ca: 'Jazz', en: 'Jazz', fr: 'Jazz' },
    keywords: ['jazz', 'modern jazz', 'modern-jazz', 'jazz moderne'],
    category: 'dance',
  },

  // === LATINO - Específicos primero ===
  {
    id: 'timba',
    displayName: { es: 'Timba', ca: 'Timba', en: 'Timba', fr: 'Timba' },
    keywords: ['timba', 'timba cubana'],
    category: 'latin',
  },
  {
    id: 'salsaladystyle',
    displayName: {
      es: 'Salsa Lady Style',
      ca: 'Salsa Lady Style',
      en: 'Salsa Lady Style',
      fr: 'Salsa Lady Style',
    },
    keywords: ['salsa lady', 'lady style', 'salsa ladies', 'ladies styling', 'salsa lady style'],
    category: 'latin',
  },
  {
    id: 'salsa',
    displayName: { es: 'Salsa Cubana', ca: 'Salsa Cubana', en: 'Cuban Salsa', fr: 'Salsa Cubaine' },
    keywords: ['salsa cubana', 'salsa', 'casino', 'rueda de casino'],
    category: 'latin',
  },
  {
    id: 'bachata',
    displayName: {
      es: 'Bachata Sensual',
      ca: 'Bachata Sensual',
      en: 'Sensual Bachata',
      fr: 'Bachata Sensuelle',
    },
    keywords: ['bachata', 'bachata sensual', 'bachata lady', 'bachata lady style'],
    category: 'latin',
  },
  {
    id: 'folklore',
    displayName: {
      es: 'Folklore Cubano',
      ca: 'Folklore Cubà',
      en: 'Cuban Folklore',
      fr: 'Folklore Cubain',
    },
    keywords: ['folklore', 'folklore cubano', 'rumba', 'afrocubano'],
    category: 'latin',
  },
  {
    id: 'kizomba',
    displayName: { es: 'Kizomba', ca: 'Kizomba', en: 'Kizomba', fr: 'Kizomba' },
    keywords: ['kizomba', 'kizomba sensual'],
    category: 'latin',
  },

  // === URBANO ===
  {
    id: 'dancehall',
    displayName: { es: 'Dancehall', ca: 'Dancehall', en: 'Dancehall', fr: 'Dancehall' },
    keywords: ['dancehall', 'dance hall', 'jamaican'],
    category: 'urban',
  },
  {
    id: 'hiphopreggaeton',
    displayName: {
      es: 'Hip Hop Reggaeton',
      ca: 'Hip Hop Reggaeton',
      en: 'Hip Hop Reggaeton',
      fr: 'Hip Hop Reggaeton',
    },
    keywords: ['hip hop reggaeton', 'hip-hop reggaeton', 'hiphop reggaeton'],
    category: 'urban',
  },
  {
    id: 'sexyreggaeton',
    displayName: {
      es: 'Sexy Reggaeton',
      ca: 'Sexy Reggaeton',
      en: 'Sexy Reggaeton',
      fr: 'Sexy Reggaeton',
    },
    keywords: ['sexy reggaeton', 'sexy reggaetón', 'perreo'],
    category: 'urban',
  },
  {
    id: 'reparto',
    displayName: {
      es: 'Reggaeton Cubano',
      ca: 'Reggaeton Cubà',
      en: 'Cuban Reggaeton',
      fr: 'Reggaeton Cubain',
    },
    keywords: ['reparto', 'reggaeton', 'reggaetón', 'cubatón', 'reggaeton cubano'],
    category: 'urban',
  },
  {
    id: 'hiphop',
    displayName: { es: 'Hip Hop', ca: 'Hip Hop', en: 'Hip Hop', fr: 'Hip Hop' },
    keywords: ['hip hop', 'hip-hop', 'hiphop', 'urban', 'old school', 'new style'],
    category: 'urban',
  },
  {
    id: 'afro',
    displayName: { es: 'Afrobeat', ca: 'Afrobeat', en: 'Afrobeat', fr: 'Afrobeat' },
    keywords: ['afrobeat', 'afrodance', 'afro dance', 'amapiano', 'ntcham'],
    category: 'urban',
  },
  {
    id: 'girly',
    displayName: { es: 'Girly', ca: 'Girly', en: 'Girly', fr: 'Girly' },
    keywords: ['girly', 'girly style'],
    category: 'urban',
  },
  {
    id: 'kpop',
    displayName: { es: 'K-Pop', ca: 'K-Pop', en: 'K-Pop', fr: 'K-Pop' },
    keywords: ['k-pop', 'kpop', 'k pop', 'coreano', 'bts', 'blackpink'],
    category: 'urban',
  },
  {
    id: 'commercial',
    displayName: {
      es: 'Commercial Dance',
      ca: 'Commercial Dance',
      en: 'Commercial Dance',
      fr: 'Commercial Dance',
    },
    keywords: ['commercial', 'comercial', 'commercial dance'],
    category: 'urban',
  },
  {
    id: 'breaking',
    displayName: { es: 'Breaking', ca: 'Breaking', en: 'Breaking', fr: 'Breaking' },
    keywords: ['breaking', 'breakdance', 'bboy', 'bgirl'],
    category: 'urban',
  },
  {
    id: 'house',
    displayName: { es: 'House', ca: 'House', en: 'House', fr: 'House' },
    keywords: ['house dance', 'house'],
    category: 'urban',
  },
  {
    id: 'locking',
    displayName: { es: 'Locking', ca: 'Locking', en: 'Locking', fr: 'Locking' },
    keywords: ['locking'],
    category: 'urban',
  },
  {
    id: 'popping',
    displayName: { es: 'Popping', ca: 'Popping', en: 'Popping', fr: 'Popping' },
    keywords: ['popping'],
    category: 'urban',
  },
  {
    id: 'waacking',
    displayName: { es: 'Waacking', ca: 'Waacking', en: 'Waacking', fr: 'Waacking' },
    keywords: ['waacking', 'voguing'],
    category: 'urban',
  },

  // === HEELS & FEMININE ===
  {
    id: 'sexystyle',
    displayName: { es: 'Sexy Style', ca: 'Sexy Style', en: 'Sexy Style', fr: 'Sexy Style' },
    keywords: ['sexy style', 'sexy-style'],
    category: 'heels',
  },
  {
    id: 'femmology',
    displayName: { es: 'Femmology', ca: 'Femmology', en: 'Femmology', fr: 'Femmology' },
    keywords: ['femmology', 'femm'],
    category: 'heels',
  },
  {
    id: 'heels',
    displayName: { es: 'Heels', ca: 'Heels', en: 'Heels', fr: 'Heels' },
    keywords: ['heels', 'tacones', 'stiletto', 'heels dance'],
    category: 'heels',
  },
  {
    id: 'twerk',
    displayName: { es: 'Twerk', ca: 'Twerk', en: 'Twerk', fr: 'Twerk' },
    keywords: ['twerk', 'twerkeo', 'twerking'],
    category: 'heels',
  },

  // === FITNESS ===
  {
    id: 'cuerpofit',
    displayName: { es: 'Cuerpo Fit', ca: 'Cos Fit', en: 'Body Fit', fr: 'Corps Fit' },
    keywords: ['cuerpo fit', 'cuerpofit', 'body conditioning', 'body fit'],
    category: 'fitness',
  },
  {
    id: 'bumbum',
    displayName: { es: 'Bum Bum', ca: 'Bum Bum', en: 'Bum Bum', fr: 'Bum Bum' },
    keywords: ['bum bum', 'bumbum', 'glúteos', 'gluteos', 'booty'],
    category: 'fitness',
  },
  {
    id: 'fitness',
    displayName: { es: 'Fitness', ca: 'Fitness', en: 'Fitness', fr: 'Fitness' },
    keywords: ['fitness', 'full body', 'cardio', 'cardio dance'],
    category: 'fitness',
  },
  {
    id: 'stretching',
    displayName: { es: 'Stretching', ca: 'Stretching', en: 'Stretching', fr: 'Stretching' },
    keywords: ['stretching', 'estiramientos', 'flexibilidad', 'flexibility'],
    category: 'fitness',
  },
  {
    id: 'yoga',
    displayName: { es: 'Yoga', ca: 'Ioga', en: 'Yoga', fr: 'Yoga' },
    keywords: ['yoga', 'yoga dance'],
    category: 'fitness',
  },
  {
    id: 'pilates',
    displayName: { es: 'Pilates', ca: 'Pilates', en: 'Pilates', fr: 'Pilates' },
    keywords: ['pilates'],
    category: 'fitness',
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Detectar estilo desde nombre de clase (usado por clases.ts y member-lookup.ts)
 */
export function detectStyleFromName(name: string): string {
  const lowerName = name.toLowerCase();

  // Buscar en orden (específicos primero están al inicio del array)
  for (const style of STYLE_MAPPINGS) {
    if (style.keywords.some(kw => lowerName.includes(kw))) {
      return style.id;
    }
  }

  return 'otros';
}

/**
 * Detectar estilo desde mensaje del usuario (usado por agent.ts)
 */
export function detectStyleFromUserMessage(text: string): string | null {
  const lowerText = text.toLowerCase();

  for (const style of STYLE_MAPPINGS) {
    if (style.keywords.some(kw => lowerText.includes(kw))) {
      return style.id;
    }
  }

  return null;
}

/**
 * Obtener nombre de estilo para mostrar en un idioma
 */
export function getStyleDisplayName(
  styleId: string,
  lang: 'es' | 'ca' | 'en' | 'fr' = 'es'
): string {
  const style = STYLE_MAPPINGS.find(s => s.id === styleId);
  return style?.displayName[lang] || styleId;
}

/**
 * Obtener todos los keywords de un estilo (para regex o búsqueda)
 */
export function getStyleKeywords(styleId: string): string[] {
  const style = STYLE_MAPPINGS.find(s => s.id === styleId);
  return style?.keywords || [];
}

/**
 * Obtener estilos por categoría
 */
export function getStylesByCategory(category: StyleDefinition['category']): StyleDefinition[] {
  return STYLE_MAPPINGS.filter(s => s.category === category);
}

/**
 * Generar objeto Record<string, string[]> para compatibilidad con código legacy
 */
export function getStyleKeywordsMap(): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const style of STYLE_MAPPINGS) {
    map[style.id] = style.keywords;
  }
  return map;
}
```

#### Archivos a Modificar

| Archivo                               | Acción                                    |
| ------------------------------------- | ----------------------------------------- |
| `constants/style-mappings.ts`         | **CREAR** - Fuente única de verdad        |
| `api/clases.ts:114-158`               | **REEMPLAZAR** - Usar import de constants |
| `api/lib/ai/agent.ts:148-161`         | **REEMPLAZAR** - Usar import de constants |
| `api/lib/ai/member-lookup.ts:718-738` | **REEMPLAZAR** - Usar import de constants |

---

### Fase 2: Query Router Inteligente (Día 3-5)

**Objetivo:** Sistema híbrido que usa Haiku para queries simples y Sonnet para complejas.

#### 2.1 Crear Query Router

```typescript
// api/lib/ai/query-router.ts

import Anthropic from '@anthropic-ai/sdk';
import type { SupportedLanguage } from './language-detector.js';
import { FAQS, CENTER_INFO, PRICING, TEACHERS, DANCE_STYLES } from './knowledge-base.js';

const anthropic = new Anthropic();

// Modelos
const MODEL_FAST = 'claude-3-haiku-20240307'; // Rápido, barato
const MODEL_SMART = 'claude-3-5-sonnet-20241022'; // Inteligente, para queries complejas

export type QueryType =
  | 'greeting' // Hola, buenos días
  | 'faq_simple' // ¿Cuánto cuesta? ¿Dónde está?
  | 'schedule_query' // ¿Hay bachata mañana?
  | 'style_comparison' // ¿Diferencia entre salsa y bachata?
  | 'booking_intent' // Quiero reservar
  | 'member_query' // Mis créditos, cancelar
  | 'objection' // Es caro, no tengo tiempo
  | 'complex'; // Todo lo demás

export interface RouteResult {
  queryType: QueryType;
  model: 'haiku' | 'sonnet';
  context?: string; // KB snippet relevante
  shouldUseMomence?: boolean;
  extractedIntent?: {
    style?: string;
    day?: string;
    timeRange?: string;
  };
}

export class QueryRouter {
  /**
   * Analizar query y decidir cómo procesarla
   */
  async route(text: string, lang: SupportedLanguage): Promise<RouteResult> {
    const lowerText = text.toLowerCase();

    // 1. Saludos simples → Template (sin API call)
    if (this.isGreeting(lowerText)) {
      return { queryType: 'greeting', model: 'haiku' };
    }

    // 2. FAQ simple → Haiku + snippet de KB
    const faqMatch = this.findFAQMatch(lowerText, lang);
    if (faqMatch) {
      return {
        queryType: 'faq_simple',
        model: 'haiku',
        context: faqMatch.answer,
      };
    }

    // 3. Query de horarios → Momence + Haiku
    const scheduleIntent = this.detectScheduleIntent(lowerText);
    if (scheduleIntent.isScheduleQuery) {
      return {
        queryType: 'schedule_query',
        model: 'haiku',
        shouldUseMomence: true,
        extractedIntent: {
          style: scheduleIntent.style,
          day: scheduleIntent.day,
          timeRange: scheduleIntent.timeRange,
        },
      };
    }

    // 4. Comparación de estilos → Sonnet (necesita razonamiento)
    if (this.isStyleComparison(lowerText)) {
      return {
        queryType: 'style_comparison',
        model: 'sonnet',
        context: this.getStyleComparisonContext(lowerText),
      };
    }

    // 5. Intent de reserva → Booking flow
    if (this.isBookingIntent(lowerText)) {
      return { queryType: 'booking_intent', model: 'haiku' };
    }

    // 6. Objeciones → Handler especializado
    if (this.isObjection(lowerText)) {
      return { queryType: 'objection', model: 'haiku' };
    }

    // 7. Query compleja → Sonnet + KB completo
    return {
      queryType: 'complex',
      model: 'sonnet',
      context: this.getFullKBContext(lang),
    };
  }

  /**
   * Generar respuesta según el routing
   */
  async generateResponse(
    text: string,
    lang: SupportedLanguage,
    route: RouteResult,
    additionalContext?: string
  ): Promise<string> {
    const model = route.model === 'haiku' ? MODEL_FAST : MODEL_SMART;

    // Construir contexto
    let context = route.context || '';
    if (additionalContext) {
      context += '\n\n' + additionalContext;
    }

    const systemPrompt = this.buildSystemPrompt(lang, context, route.queryType);

    const response = await anthropic.messages.create({
      model,
      max_tokens: route.model === 'haiku' ? 300 : 500,
      system: systemPrompt,
      messages: [{ role: 'user', content: text }],
    });

    const textBlock = response.content.find(b => b.type === 'text');
    return textBlock?.type === 'text' ? textBlock.text : '';
  }

  // ===== DETECTION HELPERS =====

  private isGreeting(text: string): boolean {
    const greetings = ['hola', 'hello', 'hi', 'hey', 'buenas', 'bon dia', 'salut', 'bonjour'];
    return greetings.some(g => text === g || text.startsWith(g + ' ') || text.startsWith(g + '!'));
  }

  private findFAQMatch(text: string, lang: SupportedLanguage): { answer: string } | null {
    const faqs = FAQS[lang] || FAQS.es;

    for (const faq of faqs) {
      // Match por keywords con scoring
      const matchedKeywords = faq.keywords.filter(kw => text.includes(kw.toLowerCase()));
      if (matchedKeywords.length >= 1) {
        return { answer: faq.answer };
      }
    }

    return null;
  }

  private detectScheduleIntent(text: string): {
    isScheduleQuery: boolean;
    style?: string;
    day?: string;
    timeRange?: string;
  } {
    const scheduleKeywords = ['horario', 'clase', 'clases', 'cuando', 'hay', 'schedule', 'hora'];
    const isScheduleQuery = scheduleKeywords.some(kw => text.includes(kw));

    if (!isScheduleQuery) return { isScheduleQuery: false };

    // Detectar estilo
    const { detectStyleFromUserMessage } = require('../../constants/style-mappings.js');
    const style = detectStyleFromUserMessage(text);

    // Detectar día
    let day: string | undefined;
    const days = [
      'hoy',
      'mañana',
      'lunes',
      'martes',
      'miércoles',
      'jueves',
      'viernes',
      'sábado',
      'domingo',
    ];
    for (const d of days) {
      if (text.includes(d)) {
        day = d;
        break;
      }
    }

    // Detectar rango horario
    let timeRange: string | undefined;
    if (text.includes('mañana') && !text.includes('de mañana')) {
      // "mañana" como día, no como "por la mañana"
    } else if (text.includes('mañana') || text.includes('morning')) {
      timeRange = 'morning';
    } else if (text.includes('tarde') || text.includes('afternoon')) {
      timeRange = 'afternoon';
    } else if (text.includes('noche') || text.includes('evening')) {
      timeRange = 'evening';
    }

    return { isScheduleQuery: true, style, day, timeRange };
  }

  private isStyleComparison(text: string): boolean {
    const comparisonKeywords = [
      'diferencia',
      'difference',
      'vs',
      'versus',
      'comparar',
      'mejor',
      'which is better',
    ];
    return comparisonKeywords.some(kw => text.includes(kw));
  }

  private isBookingIntent(text: string): boolean {
    const bookingKeywords = [
      'reservar',
      'apuntar',
      'inscribir',
      'book',
      'sign up',
      'probar',
      'clase de prueba',
    ];
    return bookingKeywords.some(kw => text.includes(kw));
  }

  private isObjection(text: string): boolean {
    const objectionKeywords = [
      'caro',
      'expensive',
      'no tengo tiempo',
      'lejos',
      'far',
      'no sé bailar',
      "can't dance",
    ];
    return objectionKeywords.some(kw => text.includes(kw));
  }

  // ===== CONTEXT BUILDERS =====

  private getStyleComparisonContext(text: string): string {
    // Devolver comparaciones relevantes del KB
    return `
COMPARACIONES DE ESTILOS:

Salsa vs Bachata:
- Salsa: Ritmo rápido, movimientos circulares, origen Cuba
- Bachata: Ritmo lento, movimientos sensuales, origen República Dominicana

Hip Hop vs Reggaeton:
- Hip Hop: Origen USA, técnica de aislamiento, popping, locking
- Reggaeton: Origen latino, movimientos de cadera, perreo

Heels vs Femmology:
- Heels: Con tacones stiletto, técnica de caminar
- Femmology: Empoderamiento femenino, no requiere tacones
    `.trim();
  }

  private getFullKBContext(lang: SupportedLanguage): string {
    // Construir contexto completo (~15KB)
    return `
INFORMACIÓN DEL CENTRO:
- Nombre: ${CENTER_INFO.name}
- Dirección: ${CENTER_INFO.address}, ${CENTER_INFO.city}
- Teléfono: ${CENTER_INFO.phone}
- Metro: Rocafort (L1, 4 min) o Entença (L5, 5 min)

PRECIOS:
- 1 clase/semana: ${PRICING.memberships.oneClassPerWeek.price}€/mes
- 2 clases/semana: ${PRICING.memberships.twoClassesPerWeek.price}€/mes
- 3 clases/semana: ${PRICING.memberships.threeClassesPerWeek.price}€/mes
- Ilimitado: ${PRICING.memberships.unlimited.price}€/mes
- Clase suelta: ${PRICING.singleClass}€
- Matrícula: GRATIS (normalmente ${PRICING.registration.normal}€)
- Primera clase: GRATIS

PROFESORES:
- Yunaisy Farray: Fundadora, Salsa Cubana, Contemporáneo
- Mathias Font: Bachata Sensual, Campeón Mundial
- Eugenia Trujillo: Bachata Sensual, Campeona Mundial
- Sandra Gómez: Twerk, danzas urbanas

25+ ESTILOS: Salsa, Bachata, Reggaeton, Hip Hop, Heels, Twerk, Ballet, Contemporáneo, K-Pop, Afrobeat...
    `.trim();
  }

  private buildSystemPrompt(
    lang: SupportedLanguage,
    context: string,
    queryType: QueryType
  ): string {
    const langInstructions: Record<SupportedLanguage, string> = {
      es: 'Responde en español, tutea, sé cercana.',
      ca: 'Respon en català, tuteja, sigues propera.',
      en: 'Reply in English, be friendly and warm.',
      fr: 'Réponds en français, tutoie, sois chaleureuse.',
    };

    return `Eres Laura, coordinadora de Farray's Dance Center (27 años, bailarina).

PERSONALIDAD:
- Cercana, entusiasta, profesional
- Usas emojis con moderación (1-2 por mensaje)
- Respuestas cortas (máximo 3 párrafos)
- ${langInstructions[lang]}

REGLAS:
- SOLO usa la información proporcionada
- Si no sabes algo, di "tendría que confirmarlo con el equipo"
- Guía hacia reservar clase de prueba GRATIS

${context ? `INFORMACIÓN:\n${context}` : ''}`;
  }
}

// Singleton
let routerInstance: QueryRouter | null = null;
export function getQueryRouter(): QueryRouter {
  if (!routerInstance) routerInstance = new QueryRouter();
  return routerInstance;
}
```

#### 2.2 Integrar en Agent

```typescript
// Modificar agent.ts - método processMessage

import { getQueryRouter, type RouteResult } from './query-router.js';

// En processMessage, después de detectar idioma:

const router = getQueryRouter();
const route = await router.route(text, detectedLang);

// Log para métricas
console.log(`[agent] Route: ${route.queryType} → ${route.model}`);

// Si necesita Momence (schedule queries)
let momenceContext = '';
if (route.shouldUseMomence && route.extractedIntent) {
  const momenceService = getMomenceService(this.redis);
  const sessions = await momenceService.queryClasses({
    style: route.extractedIntent.style,
    dayOfWeek: route.extractedIntent.day,
    timeRange: route.extractedIntent.timeRange as any,
  });
  momenceContext = this.formatSessionsForContext(sessions);
}

// Generar respuesta según routing
const responseText = await router.generateResponse(text, detectedLang, route, momenceContext);
```

#### 2.3 Métricas de Routing

```typescript
// Trackear uso de modelos para optimización
interface RoutingMetrics {
  haiku_calls: number;
  sonnet_calls: number;
  haiku_avg_ms: number;
  sonnet_avg_ms: number;
  query_type_distribution: Record<string, number>;
}

// En Redis
await redis.hincrby(`agent:routing:${today}`, route.model, 1);
await redis.hincrby(`agent:routing:${today}`, `type:${route.queryType}`, 1);
```

---

### Fase 3: Servicio Momence Unificado (Día 6-7)

**Objetivo:** Un solo servicio para consultas de clases con caché inteligente.

#### 3.1 Crear `momence-service.ts`

```typescript
// api/lib/momence-service.ts

import type { Redis } from '@upstash/redis';
import { detectStyleFromName } from '../constants/style-mappings.js';

const MOMENCE_API_URL = 'https://api.momence.com';
const CACHE_TTL_SESSIONS = 30 * 60; // 30 min para sesiones
const CACHE_TTL_TEACHERS = 24 * 60 * 60; // 24h para profesores
const CACHE_TTL_TOKEN = 3500; // ~1 hora para token

export interface MomenceSession {
  id: number;
  name: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  bookingCount: number;
  teacher?: {
    id: number;
    firstName: string;
    lastName: string;
    pictureUrl?: string;
  };
  description?: string;
  inPersonLocation?: string;
}

export interface MomenceTeacher {
  id: number;
  firstName: string;
  lastName: string;
  pictureUrl?: string;
  bio?: string;
  specialties: string[];
}

export interface SessionQuery {
  style?: string; // Filtrar por estilo
  dayOfWeek?: string; // "lunes", "martes", etc.
  timeRange?: 'morning' | 'afternoon' | 'evening';
  instructor?: string; // Nombre del instructor
  level?: string; // "principiante", "intermedio", "avanzado"
  daysAhead?: number; // Días a consultar (default 7)
  includeFullClasses?: boolean;
}

export class MomenceService {
  private redis: Redis | null;

  constructor(redis: Redis | null = null) {
    this.redis = redis;
  }

  /**
   * Query builder: Construye consultas complejas
   * Ejemplo: "bachata los lunes por la mañana"
   */
  async queryClasses(query: SessionQuery): Promise<MomenceSession[]> {
    const {
      style,
      dayOfWeek,
      timeRange,
      instructor,
      level,
      daysAhead = 7,
      includeFullClasses = false,
    } = query;

    // 1. Obtener todas las sesiones del período (desde caché o API)
    const allSessions = await this.fetchSessions(daysAhead);

    // 2. Aplicar filtros
    let filtered = allSessions;

    // Filtrar por estilo
    if (style) {
      const normalizedStyle = style.toLowerCase();
      filtered = filtered.filter(s => {
        const detectedStyle = detectStyleFromName(s.name);
        return detectedStyle === normalizedStyle || s.name.toLowerCase().includes(normalizedStyle);
      });
    }

    // Filtrar por día de la semana
    if (dayOfWeek) {
      const targetDay = this.normalizeDayName(dayOfWeek);
      filtered = filtered.filter(s => {
        const sessionDay = this.getDayOfWeek(s.startsAt);
        return sessionDay === targetDay;
      });
    }

    // Filtrar por rango horario
    if (timeRange) {
      filtered = filtered.filter(s => {
        const hour = new Date(s.startsAt).getHours();
        switch (timeRange) {
          case 'morning':
            return hour >= 9 && hour < 13;
          case 'afternoon':
            return hour >= 13 && hour < 18;
          case 'evening':
            return hour >= 18 && hour < 23;
          default:
            return true;
        }
      });
    }

    // Filtrar por instructor
    if (instructor) {
      const normalizedInstructor = instructor.toLowerCase();
      filtered = filtered.filter(s => {
        if (!s.teacher) return false;
        const teacherName = `${s.teacher.firstName} ${s.teacher.lastName}`.toLowerCase();
        return teacherName.includes(normalizedInstructor);
      });
    }

    // Filtrar por nivel (detectado del nombre)
    if (level) {
      filtered = filtered.filter(s => {
        const name = s.name.toLowerCase();
        if (level === 'principiante') {
          return (
            name.includes('iniciación') ||
            name.includes('principiante') ||
            name.includes('beginner')
          );
        }
        if (level === 'intermedio') {
          return name.includes('intermedio') || name.includes('intermediate');
        }
        if (level === 'avanzado') {
          return name.includes('avanzado') || name.includes('advanced');
        }
        return true;
      });
    }

    // Filtrar clases llenas
    if (!includeFullClasses) {
      filtered = filtered.filter(s => s.bookingCount < s.capacity);
    }

    return filtered;
  }

  /**
   * Obtener sesiones con caché
   */
  async fetchSessions(daysAhead: number = 7): Promise<MomenceSession[]> {
    const cacheKey = `momence:sessions:${daysAhead}`;

    // Intentar caché
    if (this.redis) {
      try {
        const cached = await this.redis.get(cacheKey);
        if (cached) {
          return typeof cached === 'string' ? JSON.parse(cached) : (cached as MomenceSession[]);
        }
      } catch (e) {
        console.warn('[momence] Cache read error:', e);
      }
    }

    // Fetch desde API
    const token = await this.getAccessToken();
    if (!token) throw new Error('No Momence token');

    const now = new Date();
    const futureLimit = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

    const url = new URL(`${MOMENCE_API_URL}/api/v2/host/sessions`);
    url.searchParams.set('page', '0');
    url.searchParams.set('pageSize', '200');
    url.searchParams.set('startAfter', now.toISOString());
    url.searchParams.set('startBefore', futureLimit.toISOString());
    url.searchParams.set('sortBy', 'startsAt');
    url.searchParams.set('sortOrder', 'ASC');

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Momence API error: ${response.status}`);
    }

    const data = await response.json();
    const sessions: MomenceSession[] = data.payload || [];

    // Guardar en caché
    if (this.redis && sessions.length > 0) {
      try {
        await this.redis.setex(cacheKey, CACHE_TTL_SESSIONS, JSON.stringify(sessions));
      } catch (e) {
        console.warn('[momence] Cache write error:', e);
      }
    }

    return sessions;
  }

  /**
   * Sincronizar profesores desde Momence
   */
  async syncTeachers(): Promise<MomenceTeacher[]> {
    const cacheKey = 'momence:teachers';

    // Fetch desde API (siempre fresco para sync)
    const token = await this.getAccessToken();
    if (!token) throw new Error('No Momence token');

    const response = await fetch(`${MOMENCE_API_URL}/api/v2/host/trainers`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Momence trainers API error: ${response.status}`);
    }

    const data = await response.json();
    const trainers = (data.payload || []).map(
      (t: {
        id: number;
        firstName: string;
        lastName: string;
        pictureUrl?: string;
        bio?: string;
      }) => ({
        id: t.id,
        firstName: t.firstName,
        lastName: t.lastName,
        pictureUrl: t.pictureUrl,
        bio: t.bio,
        specialties: [], // Se puede inferir de las clases que imparten
      })
    );

    // Guardar en caché
    if (this.redis) {
      try {
        await this.redis.setex(cacheKey, CACHE_TTL_TEACHERS, JSON.stringify(trainers));
      } catch (e) {
        console.warn('[momence] Teachers cache write error:', e);
      }
    }

    return trainers;
  }

  /**
   * Parsear query natural del usuario
   * "bachata los lunes por la mañana" → SessionQuery
   */
  parseNaturalQuery(text: string): SessionQuery {
    const query: SessionQuery = {};
    const lowerText = text.toLowerCase();

    // Detectar estilo
    const { detectStyleFromUserMessage } = require('../constants/style-mappings.js');
    const detectedStyle = detectStyleFromUserMessage(text);
    if (detectedStyle) {
      query.style = detectedStyle;
    }

    // Detectar día de la semana
    const days = [
      'lunes',
      'martes',
      'miércoles',
      'miercoles',
      'jueves',
      'viernes',
      'sábado',
      'sabado',
      'domingo',
    ];
    for (const day of days) {
      if (lowerText.includes(day)) {
        query.dayOfWeek = day;
        break;
      }
    }

    // Detectar rango horario
    if (lowerText.includes('mañana') || lowerText.includes('morning')) {
      query.timeRange = 'morning';
    } else if (lowerText.includes('tarde') || lowerText.includes('afternoon')) {
      query.timeRange = 'afternoon';
    } else if (lowerText.includes('noche') || lowerText.includes('evening')) {
      query.timeRange = 'evening';
    }

    // Detectar nivel
    if (lowerText.includes('principiante') || lowerText.includes('iniciación')) {
      query.level = 'principiante';
    } else if (lowerText.includes('intermedio')) {
      query.level = 'intermedio';
    } else if (lowerText.includes('avanzado')) {
      query.level = 'avanzado';
    }

    return query;
  }

  // Helper: Obtener día de la semana
  private getDayOfWeek(isoDate: string): string {
    const date = new Date(isoDate);
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    return days[date.getDay()];
  }

  // Helper: Normalizar nombre de día
  private normalizeDayName(day: string): string {
    const normalized: Record<string, string> = {
      lunes: 'lunes',
      martes: 'martes',
      miércoles: 'miércoles',
      miercoles: 'miércoles',
      jueves: 'jueves',
      viernes: 'viernes',
      sábado: 'sábado',
      sabado: 'sábado',
      domingo: 'domingo',
    };
    return normalized[day.toLowerCase()] || day;
  }

  // Helper: Obtener token de acceso
  private async getAccessToken(): Promise<string | null> {
    // Implementación similar a la existente en clases.ts
    // Reutilizar caché de token en Redis
    // ...
    return null; // Placeholder
  }
}

// Singleton
let momenceInstance: MomenceService | null = null;
export function getMomenceService(redis: Redis | null = null): MomenceService {
  if (!momenceInstance) momenceInstance = new MomenceService(redis);
  return momenceInstance;
}
```

---

### Fase 4: FAQs Multi-idioma Completas (Día 8-9)

**Objetivo:** 21 FAQs completas en los 4 idiomas.

#### Script de Traducción con Claude

```typescript
// scripts/translate-faqs.ts

import Anthropic from '@anthropic-ai/sdk';
import { FAQS } from '../api/lib/ai/knowledge-base.js';

const anthropic = new Anthropic();

async function translateFAQ(
  faq: { question: string; answer: string; keywords: string[] },
  targetLang: 'ca' | 'en' | 'fr'
): Promise<{ question: string; answer: string; keywords: string[] }> {
  const langNames = { ca: 'Catalan', en: 'English', fr: 'French' };

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: `Translate this FAQ to ${langNames[targetLang]}.
Keep the same tone (friendly, informal "tú/tu" form) and formatting.
Return ONLY valid JSON with keys: question, answer, keywords.

Spanish FAQ:
Question: ${faq.question}
Answer: ${faq.answer}
Keywords: ${faq.keywords.join(', ')}`,
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  return JSON.parse(text);
}

async function main() {
  const spanishFaqs = FAQS.es;
  const results: Record<string, typeof spanishFaqs> = {
    es: spanishFaqs,
    ca: [],
    en: [],
    fr: [],
  };

  for (const faq of spanishFaqs) {
    console.log(`Translating: ${faq.question.slice(0, 50)}...`);

    for (const lang of ['ca', 'en', 'fr'] as const) {
      const translated = await translateFAQ(faq, lang);
      results[lang].push(translated);
    }
  }

  // Escribir resultado
  console.log(JSON.stringify(results, null, 2));
}

main();
```

---

### Fase 5: Sincronización Automática (Día 10)

**Objetivo:** Cron jobs que mantienen el knowledge base actualizado.

#### Cron: Sincronizar Profesores

```typescript
// api/cron-sync-teachers.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getMomenceService } from './lib/momence-service.js';
import { getRAGService } from './lib/ai/rag-service.js';
import { getRedisClient } from './lib/redis.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verificar cron secret
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const redis = getRedisClient();
  const momence = getMomenceService(redis);
  const rag = getRAGService();

  try {
    // 1. Obtener profesores de Momence
    const teachers = await momence.syncTeachers();
    console.log(`[sync] Found ${teachers.length} teachers in Momence`);

    // 2. Indexar en RAG
    for (const teacher of teachers) {
      for (const lang of ['es', 'ca', 'en', 'fr']) {
        const content = `
Profesor: ${teacher.firstName} ${teacher.lastName}
${teacher.bio || ''}
Especialidades: ${teacher.specialties.join(', ') || 'Varios estilos'}
        `.trim();

        await rag.indexDocument(content, 'teacher', lang, {
          teacherId: teacher.id,
          pictureUrl: teacher.pictureUrl,
        });
      }
    }

    return res.json({
      success: true,
      teachersSynced: teachers.length,
    });
  } catch (error) {
    console.error('[sync] Error:', error);
    return res.status(500).json({ error: 'Sync failed' });
  }
}
```

#### Actualizar vercel.json

```json
{
  "crons": [
    {
      "path": "/api/cron-sync-teachers",
      "schedule": "0 6 * * *"
    }
  ]
}
```

---

### Fase 6: Métricas y Observabilidad (Día 11-12)

**Objetivo:** Dashboard de rendimiento del agente.

#### Métricas a Trackear

| Métrica            | Descripción                 | Redis Key                            |
| ------------------ | --------------------------- | ------------------------------------ |
| Conversaciones/día | Total iniciadas             | `agent:metrics:{date}:conversations` |
| Tiempo respuesta   | ms promedio                 | `agent:metrics:{date}:response_time` |
| RAG hit rate       | % queries con resultado RAG | `agent:metrics:{date}:rag_hits`      |
| Booking completion | % que completan reserva     | `agent:metrics:{date}:conversions`   |
| Idiomas            | Distribución por idioma     | `agent:metrics:{date}:lang:{lang}`   |
| Estilos            | Estilos más consultados     | `agent:metrics:{date}:style:{style}` |

---

### Fase 7: Tests E2E (Día 13-14)

**Objetivo:** Suite de tests que validan el sistema completo.

```typescript
// __tests__/agent-enterprise.test.ts

import { SalesAgent } from '../api/lib/ai/agent.js';
import { getMomenceService } from '../api/lib/momence-service.js';
import { getRAGService } from '../api/lib/ai/rag-service.js';

describe('Enterprise Agent', () => {
  describe('Style Detection Unified', () => {
    it('detects "bachata" in all contexts', async () => {
      // agent.ts, member-lookup.ts, clases.ts deben dar mismo resultado
    });

    it('detects "hip hop reggaeton" as specific style', async () => {
      // Estilo compuesto debe detectarse correctamente
    });
  });

  describe('RAG Search', () => {
    it('finds relevant FAQ by semantic search', async () => {
      // "¿cuánto vale?" debe encontrar FAQ de precios
    });

    it('finds style info for dance comparisons', async () => {
      // "diferencia salsa bachata" debe encontrar comparación
    });
  });

  describe('Complex Queries', () => {
    it('handles "bachata los lunes por la mañana"', async () => {
      // Debe parsear y filtrar correctamente
    });

    it('handles "clases con Yunaisy"', async () => {
      // Filtro por instructor
    });
  });

  describe('Multi-language', () => {
    it('responds in Catalan when user writes in Catalan', async () => {
      // Detectar idioma y responder apropiadamente
    });
  });
});
```

---

### Fase 8: Documentación y Rollout (Día 15)

#### Checklist de Rollout

- [ ] Backup de Redis y Supabase
- [ ] Deploy a staging
- [ ] Tests E2E en staging
- [ ] Verificar métricas
- [ ] Deploy a producción (off-peak hours)
- [ ] Monitorear primeras 24h
- [ ] Documentar lecciones aprendidas

---

## Estimación de Costos

### Infraestructura Mensual (100% Anthropic)

| Servicio      | Uso Estimado                   | Costo          |
| ------------- | ------------------------------ | -------------- |
| Claude Haiku  | 40K mensajes (80% del tráfico) | ~$8/mes        |
| Claude Sonnet | 10K mensajes (20% del tráfico) | ~$30/mes       |
| Redis Upstash | 100K requests                  | $0 (free tier) |
| Supabase      | Solo fichajes (ya pagado)      | $0             |
| **Total**     |                                | **~$38/mes**   |

**Comparación con arquitectura anterior:**

- ❌ OpenAI Embeddings: $10/mes → **ELIMINADO**
- ❌ Supabase pgvector: $25/mes → **ELIMINADO**
- ✅ **Ahorro: ~$35/mes**

### Desarrollo (Tiempo)

| Fase                    | Días        | Complejidad |
| ----------------------- | ----------- | ----------- |
| 1. Style Mappings       | 2           | Baja        |
| 2. Query Router Híbrido | 3           | Media       |
| 3. Momence Service      | 2           | Media       |
| 4. FAQs Multi-idioma    | 2           | Baja        |
| 5. Sync Automático      | 1           | Baja        |
| 6. Métricas             | 2           | Media       |
| 7. Tests                | 2           | Media       |
| 8. Rollout              | 1           | Baja        |
| **Total**               | **15 días** |             |

---

## Resultados Esperados

| Métrica                       | Actual | Esperado | Mejora                |
| ----------------------------- | ------ | -------- | --------------------- |
| Precisión detección estilos   | ~70%   | 95%+     | +35%                  |
| Tiempo respuesta (Haiku)      | 2.5s   | 1.0s     | -60%                  |
| Tiempo respuesta (Sonnet)     | -      | 2.0s     | Solo cuando necesario |
| Uso de Haiku (barato)         | 0%     | 80%+     | Ahorro significativo  |
| FAQs en idiomas no-español    | 24%    | 100%     | +76%                  |
| Queries complejas soportadas  | 0%     | 100%     | +100%                 |
| Costo mensual infraestructura | ~$85   | ~$38     | -55%                  |

---

## Estado Actual de Implementación

| Fase                             | Estado        | Fecha      |
| -------------------------------- | ------------- | ---------- |
| 1. Style Mappings Unificados     | ✅ Completado | -          |
| 2. Query Router (Haiku/Sonnet)   | ✅ Completado | -          |
| 3. Momence Service               | ✅ Completado | -          |
| 4. FAQs Multi-idioma + Políticas | ✅ Completado | -          |
| 4.5. Sistema de Escalación       | ✅ Completado | -          |
| 5. Sync Automático Momence       | ✅ Completado | 2026-02-07 |
| 6. Métricas Avanzadas            | ✅ Completado | 2026-02-07 |
| 7. Tests Enterprise              | ✅ Completado | 2026-02-07 |
| 8. Rollout Producción            | 🔜 Pendiente  | -          |

---

## Tareas Pendientes Post-Deploy

### 🔴 IMPORTANTE: Integrar Sync en el Agente

**Cuando el sync esté validado en producción:**

1. Integrar `getSyncedContext()` en el prompt del agente (`api/lib/ai/agent.ts`)
2. Reemplazar los profesores hardcodeados (líneas 290-294) por datos sincronizados
3. Esto permitirá que el agente tenga información siempre actualizada de profesores

**Cómo probar el sync manualmente:**

```bash
curl https://farrays.com/api/cron-momence-sync?force=true
```

**Archivos involucrados:**

- `api/lib/ai/momence-sync.ts` - Servicio de sincronización
- `api/cron-momence-sync.ts` - Cron job (cada 6 horas)
- `api/lib/ai/agent.ts` - Integrar `getSyncedContext()` aquí

---

## Referencias

- [Anthropic Claude API](https://docs.anthropic.com/claude/reference)
- [Claude Model Comparison](https://docs.anthropic.com/claude/docs/models-overview)
- [Momence API Docs](./integrations/momence/API_ANALYSIS.md)
- [Redis Upstash](https://upstash.com/docs/redis/overall/getstarted)
