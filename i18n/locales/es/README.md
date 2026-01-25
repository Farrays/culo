# Estructura de Traducciones en Español (es)

Este directorio contiene las traducciones en español divididas por **namespace** para optimizar la carga y el rendimiento de la aplicación.

## Resumen de Distribución

**Total de keys: 13,050**

| Namespace       | Keys  | Tamaño | Tipo de Carga                | Descripción                                    |
| --------------- | ----- | ------ | ---------------------------- | ---------------------------------------------- |
| `common.json`   | 149   | 7.0 KB | **CORE** (Always loaded)     | Nav, header, footer, SEO, breadcrumbs, logos   |
| `booking.json`  | 187   | 12 KB  | **EAGER** (Loaded with core) | Widget de reservas y booking                   |
| `schedule.json` | 235   | 17 KB  | **EAGER** (Loaded with core) | Horarios dinámicos y calendario de clases      |
| `calendar.json` | 43    | 3.1 KB | **EAGER** (Loaded with core) | Calendario de eventos                          |
| `home.json`     | 393   | 37 KB  | **LAZY** (Route-based)       | Homepage (hero, services, testimonials)        |
| `classes.json`  | 202   | 34 KB  | **LAZY** (Route-based)       | Hub de clases y páginas de profesores          |
| `blog.json`     | 890   | 151 KB | **LAZY** (Route-based)       | Artículos del blog                             |
| `faq.json`      | 81    | 26 KB  | **LAZY** (Route-based)       | Preguntas frecuentes                           |
| `about.json`    | 272   | 39 KB  | **LAZY** (Route-based)       | About, Método Farray, Yunaisy                  |
| `contact.json`  | 824   | 59 KB  | **LAZY** (Route-based)       | Formularios, lead modals, exit intents         |
| `pages.json`    | 9,774 | 1.2 MB | **LAZY** (Route-based)       | Páginas específicas (pricing, legal, services) |

## Estrategia de Carga

### CORE (Always loaded - ~50KB total)

Elementos que se cargan inmediatamente al iniciar la aplicación:

**`common.json`** (7.0 KB)

- Navegación (`nav*`, `header*`, `footer*`)
- SEO global (`seo_*`, `meta_*`, `og_*`)
- Breadcrumbs (`breadcrumb_*`)
- CTAs comunes (`bookNow`, `viewSchedule`, `enrollNow`)
- Assets globales (`logo_*`, `teacher_photo_*`, `instagram_post_*`)
- Stats bar (`statsbar_*`)

### EAGER (Loaded with core - ~50KB total)

Componentes críticos que se usan frecuentemente:

**`booking.json`** (12 KB)

- Widget de reservas (`booking_*`, `bookingWidget_*`)

**`schedule.json`** (17 KB)

- Horarios dinámicos (`schedule_*`, `horariosV2_*`)
- Días de la semana (`dayShort_*`, `day_*`)

**`calendar.json`** (3.1 KB)

- Calendario de eventos (`calendar_*`, `calendario_*`)

### LAZY (Route-based - 10-200KB each)

Namespaces que se cargan bajo demanda según la ruta:

**`home.json`** (37 KB) - `/`

- Hero section (`hero_*`, `heroTitle*`, `heroCTA*`)
- Services (`services*`, `service*`)
- Testimonials (`testimonial*`)
- Why choose us (`why*`)
- Class categories (`classCat*`)
- Philosophy & happiness story (`philosophy*`, `happiness*`)

**`classes.json`** (34 KB) - `/clases/*`

- Hub de clases (`danceClassesHub_*`)
- Páginas de profesores (`teacher_*`, `profesor_*`, `instructors_*`)
- Información de clases (`classes_*`)

**`blog.json`** (151 KB) - `/blog/*`

- Todas las keys que empiezan con `blog*`
- Artículos, metadata, TOC, share buttons

**`faq.json`** (26 KB) - `/faq`

- Preguntas frecuentes (`faq_*`)

**`about.json`** (39 KB) - `/sobre-nosotros`

- About page (`about*`)
- Método Farray (`metodoFarray_*`, `metodo_*`)
- Yunaisy Farray (`yunaisyFarray_*`, `yunaisy_*`)

**`contact.json`** (59 KB) - `/contacto` + modals

- Formularios de contacto (`contact_*`, `form_*`)
- Lead modals genéricos (`leadModal_*`)
- Lead modals específicos de clases (`acLeadModal_*`, `dhLeadModal_*`, etc.)
- Exit intents (`*ExitIntent_*`)

**`pages.json`** (1.2 MB) - Páginas específicas

- Pricing (`pricing_*`, `pricingV2_*`)
- Legal (`terms_*`, `privacy_*`, `cookies_*`, `legalNotice_*`)
- Services específicos (`roomRental_*`, `teamBuilding_*`, `estudioGrabacion_*`)
- Páginas de clases específicas (`heelsBarcelona_*`, `danzaBarcelona_*`, etc.)
- Schema markup (`schema_*`)
- Otras páginas (`regalaBaile_*`, `merchandising_*`, `prepFisica_*`, etc.)

## Clasificación de Keys

Las keys se clasifican según estos patrones:

### Common (CORE)

```typescript
nav*, header*, footer*, seo_*, meta_*, og_*, breadcrumb_*,
pageTitle, metaDescription, logo_*, statsbar_*, trustbar_*,
closeButton, home, contact, viewSchedule, bookNow
```

### Booking (EAGER)

```typescript
booking_*, bookingWidget_*
```

### Schedule (EAGER)

```typescript
schedule_*, dayShort_*, day_*, horarios_*, horariosV2_*
```

### Calendar (EAGER)

```typescript
calendar_*, calendario_*
```

### Home (LAZY)

```typescript
hero_*, heroTitle*, heroCTA*, pas_*, offer_*, cta_*,
philosophy*, happiness*, classes (sin _), classCat*,
why*, services*, service*, testimonial*, instructor (sin s),
manifesto_*, homev2_*, home_*
```

### Classes (LAZY)

```typescript
classes_*, instructors_*, teacher_*, profesor_*, danceClassesHub_*
```

### Blog (LAZY)

```typescript
blog* (todas las que empiezan con blog)
```

### FAQ (LAZY)

```typescript
faq_*
```

### About (LAZY)

```typescript
about*, yunaisy_*, yunaisyFarray_*, metodo_*, metodofarray_*, metodoFarray_*
```

### Contact (LAZY)

```typescript
contact_*, form_*, leadModal_*, exitIntent_*,
*LeadModal_* (todos los modals específicos),
*ExitIntent_* (todos los exit intents)
```

### Pages (LAZY - Default)

Todas las demás keys que no coincidan con los patrones anteriores:

```typescript
schema_*, terms_*, pricing_*, privacy_*, cookies_*,
roomRental_*, particularesPage_*, teamBuilding_*,
regalaBaile_*, estudioGrabacion_*, heelsBarcelona_*,
prepFisica_*, danzaBarcelona_*, danzasUrbanas_*,
salsaBachata*, salsaCubana*, etc.
```

## Uso en la Aplicación

### Carga Inicial (CORE + EAGER)

```typescript
// Al iniciar la app, cargar estos namespaces:
import common from '@/i18n/locales/es/common.json';
import booking from '@/i18n/locales/es/booking.json';
import schedule from '@/i18n/locales/es/schedule.json';
import calendar from '@/i18n/locales/es/calendar.json';

// Total: ~50KB (carga inmediata)
```

### Carga Lazy (por ruta)

```typescript
// En cada página, cargar el namespace correspondiente:

// Homepage
const { default: home } = await import('@/i18n/locales/es/home.json');

// Blog
const { default: blog } = await import('@/i18n/locales/es/blog.json');

// About
const { default: about } = await import('@/i18n/locales/es/about.json');

// etc.
```

## Beneficios

1. **Reducción del bundle inicial**: De ~1.6MB a ~50KB (CORE + EAGER)
2. **Carga más rápida**: Solo se carga lo que se necesita por ruta
3. **Mejor caché**: Los namespaces rara vez cambiantes (common, booking) se cachean por más tiempo
4. **Escalabilidad**: Fácil agregar nuevos namespaces sin afectar la carga inicial

## Mantenimiento

Para regenerar estos archivos desde `es.ts`:

```bash
node scripts/split-translations.mjs
```

Este script:

- Lee `i18n/locales/es.ts`
- Extrae todas las keys (13,050)
- Las clasifica según los patrones definidos
- Genera 11 archivos JSON en `i18n/locales/es/`
- Valida que no se pierdan keys en el proceso
