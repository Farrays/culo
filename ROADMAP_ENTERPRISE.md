# Roadmap Enterprise - Farray's Center

> Documento consolidado de roadmap, tareas pendientes y mejoras técnicas.

---

## Estado Actual del Proyecto

- **Stack**: React 19 + Vite 6 + TypeScript
- **Hosting**: Vercel (Free tier)
- **Video**: Bunny.net Stream + YouTube
- **Analytics**: GA4 + Sentry
- **SEO**: Schema markup, prerendering, i18n (4 idiomas)
- **Tests**: 543 tests passing, coverage ~24% líneas
- **Auditoría**: 8.8/10 puntuación global

### Fortalezas Actuales

- [x] Schema.org exhaustivo (Organization, LocalBusiness, Course, Person, Article)
- [x] Multi-idioma perfecto (es, ca, en, fr) con hreflang
- [x] Pre-rendering de 450+ páginas con SEO para LLMs
- [x] E-E-A-T básico: Yunaisy Farray como fundadora
- [x] Certificación CID-UNESCO mencionada
- [x] Datos de contacto verificables (dirección, teléfono, email)
- [x] Legal/GDPR completo (privacidad, cookies, términos)

---

## 1. CHECKLIST PRE-LANZAMIENTO

### Variables de entorno (configurar en Vercel)

- [ ] `VITE_GA_MEASUREMENT_ID` en Vercel
- [ ] `VITE_SENTRY_DSN` en Vercel (opcional)
- [ ] Variables Momence para formulario de contacto
- [ ] Variables Momence para Exit Intent Modal

### Exit Intent Modal (configurar en Momence)

- [ ] Crear Lead Source en Momence para Exit Intent
- [ ] Añadir `MOMENCE_EXIT_INTENT_SOURCE_ID` en Vercel
- [ ] Crear secuencia de emails automatizada:
  - [ ] Email 1 (inmediato): "Tu código de 50% de descuento"
  - [ ] Email 2 (24h): "¿Tienes dudas?"
  - [ ] Email 3 (72h): "Última oportunidad"

### Indexación y visibilidad

- [ ] Registrar en Google Search Console
- [ ] Crear/optimizar Google Business Profile (Maps)
- [ ] Registrar en Bing Webmaster Tools
- [x] Sitemap.xml listo (184 URLs)

### Analytics y tracking

- [x] Google Tag Manager (GTM-TT2V8Z4)
- [ ] Configurar GA4 dentro de GTM (G-DESDZPK1CF)
- [ ] Configurar eventos básicos (page_view, scroll, outbound_clicks)

```
CHECKLIST RÁPIDO:
[x] Legal: Privacy, Terms, Cookies pages
[x] Legal: Cookie banner implementado
[x] i18n: Traducciones ES, CA, EN, FR completas
[x] SEO: Sitemap.xml actualizado (184 URLs)
[ ] SEO: Google Search Console registrado
[ ] SEO: Google Business Profile creado
[x] Formulario contacto: Momence integrado
[x] Exit Intent Modal: Código implementado
[ ] Exit Intent Modal: SourceId creado en Momence
[ ] Analytics: GTM + GA4 configurado
[ ] Conversión: WhatsApp widget activo
[ ] Deploy: Variables de entorno en Vercel
```

---

## 2. PÁGINAS PENDIENTES DE CREAR

### Prioridad Alta - Clases de Niños

Estas páginas tenían tráfico en WordPress:

- [ ] `/es/clases/ballet-ninos` - Ballet para niños
- [ ] `/es/clases/contemporaneo-ninos` - Contemporáneo para niños
- [ ] `/es/clases/hip-hop-ninos` - Hip Hop para niños
- [ ] `/es/clases/jazz-ninos` - Jazz para niños
- [ ] `/es/clases/commercial-dance-ninos` - Commercial Dance
- [ ] `/es/clases/predanza` - Predanza (iniciación)

### Prioridad Media - Estilos de Baile

- [ ] `/es/clases/kizomba-barcelona` - Kizomba
- [ ] `/es/clases/semba-barcelona` - Semba
- [ ] `/es/clases/mens-style-barcelona` - Men's Style
- [ ] `/es/clases/bailes-de-salon-barcelona` - Bailes de Salón

### Prioridad Media - Intensivos de Verano

- [ ] `/es/intensivos-verano` - Página general
- [ ] `/es/intensivos/baile-verano-barcelona`
- [ ] `/es/intensivos/salsa-bachata`
- [ ] `/es/intensivos/urbanos`

### Prioridad Media - Servicios

- [ ] `/es/formacion-danza` - Formación profesional
- [ ] `/es/clases-online` - Clases online

### Prioridad Baja - Páginas Especiales

- [ ] `/es/eventos` - Calendario de eventos
- [ ] `/es/colaboradores` - Partners
- [ ] `/es/cid-unesco` - Certificación CID UNESCO
- [ ] `/es/reparto` - Reparto/casting

### Contenido Pendiente

- [ ] Página de precios clara
- [ ] Página "Método Farray" explicado
- [ ] Página de profesores individual
- [ ] Casos de éxito/transformaciones
- [ ] Galería de fotos/eventos

---

## 3. SEO Y E-E-A-T

> Basado en artículo DinoRank: Google no penaliza contenido IA si es útil. Lo que importa es E-E-A-T.

### 3.1 Testimonios y Reseñas Reales (ALTA PRIORIDAD)

**Problema**: Los schemas ReviewSchema y AggregateReviewsSchema existen pero no se usan activamente.

**Checklist**:

- [ ] Recopilar 5-10 testimonios reales de alumnos
- [ ] Implementar AggregateRatingSchema con puntuación real de Google Reviews
- [ ] Incluir nombres, fotos (con permiso) y fechas

### 3.2 Números Verificables en Homepage

Mostrar en homepage/about:

- [ ] "Más de 15,000 alumnos desde 2015"
- [ ] "10 años de experiencia en Barcelona"
- [ ] "20+ profesores especializados"
- [ ] "4.9 estrellas en Google" (con link a perfil)

### 3.3 Certificaciones Visibles

- [ ] Logo CID-UNESCO visible en footer o about
- [ ] Badge visual de "Método Farray Certificado"

### 3.4 Página de Profesores Enriquecida

Cada profesor debe tener:

- [ ] Foto profesional
- [ ] Bio personal (no genérica)
- [ ] Años de experiencia específicos
- [ ] Especialidades
- [ ] Redes sociales personales
- [ ] Person schema individual

### 3.5 Contenido "Sobre Nosotros" con Historia Real

- [ ] Historia real de Yunaisy: cómo empezó, por qué Barcelona
- [ ] Anécdotas personales
- [ ] Fotos históricas de la escuela (2015 vs hoy)
- [ ] Hitos: número de alumnos formados, eventos realizados

### 3.6 Blog con Experiencia Real

**Estructura de cada artículo**:

- **Experiencia personal**: "En mis 20 años bailando salsa, he visto que..."
- **Ejemplos específicos**: Nombres de alumnos (con permiso)
- **Anécdotas**: Historias de clases, errores comunes
- **Datos propios**: "El 80% de mis alumnas de twerk empezaron sin saber bailar"

**Artículos recomendados**:

- [ ] Tutoriales con video propio
- [ ] Historias de transformación de alumnos
- [ ] Opiniones de experta
- [ ] Contenido local: "Los mejores lugares para bailar salsa en Barcelona"

### 3.7 SEO Local

**Artículos de blog a crear**:

- [ ] "Dónde aprender bachata en Barcelona"
- [ ] "Escuelas de baile cerca de Plaza España"
- [ ] "Clases de salsa en el Eixample"

**Google Business Profile**:

- [ ] Fotos recientes del estudio (mínimo 10)
- [ ] Horarios actuales
- [ ] Posts regulares (eventos, promociones)
- [ ] Responder a TODAS las reseñas

### Señales a Evitar (Patrones IA)

- Frases genéricas: "El baile es una forma de expresión..."
- Listas excesivamente estructuradas sin contexto personal
- Repetición de keywords sin naturalidad
- Contenido sin opinión ni posición clara

### Señales Positivas a Incluir

- Opiniones con fundamento: "Personalmente creo que..."
- Contraargumentos: "Muchos piensan X, pero en mi experiencia..."
- Errores admitidos: "Al principio yo también cometía este error..."
- Humor y personalidad

---

## 4. SEO PARA LLMs (Implementado Ene 2025)

### 4.1 Contexto

Análisis basado en artículo de DinoRank sobre LLMO (LLM Optimization).
El proyecto ya tenía excelente Schema.org y metadata, pero el body de muchas
páginas estaba vacío hasta que React hidrataba.

### 4.2 Implementación: Auto-generación de initialContent

**Archivo:** `prerender.mjs` (líneas 130-185 y 1711-1721)

**Cambio:** En vez de `initialContent: ''` vacío para ~40 páginas, ahora se
genera automáticamente contenido HTML mínimo desde la metadata existente:

```javascript
// ANTES: Los LLMs veían body vacío
dancehall: '',

// DESPUÉS: Los LLMs ven contenido básico
dancehall: '<main id="main-content"><h1>Clases de Dancehall en Barcelona</h1><p>...</p></main>',
```

**Beneficios:**

- Crawlers que no ejecutan JS ven contenido
- Sin trabajo manual de traducción (usa metadata existente)
- Fácilmente reversible si hay problemas

**Páginas excluidas (mantienen '' vacío):**

- `home` - muy dinámica
- `horariosPrecio` - datos en tiempo real
- `calendario` - contenido dinámico
- Páginas legales - tienen contenido manual de mejor calidad

**Tracking:**
El build muestra: `📝 SEO para LLMs: X páginas con contenido pre-renderizado`

### 4.3 Cómo revertir si hay problemas

Si hay errores de hidratación React o problemas visuales:

1. En `prerender.mjs`, cambiar:

```javascript
// DE:
const initialContent = {
  es: generateInitialContentForLang('es', manualOverrides.es),
  ...
};

// A:
const initialContent = {
  es: { ...manualOverrides.es, ...LANDING_CONTENT.es },
  ca: { ...manualOverrides.ca, ...LANDING_CONTENT.ca },
  en: { ...manualOverrides.en, ...LANDING_CONTENT.en },
  fr: { ...manualOverrides.fr, ...LANDING_CONTENT.fr },
};
```

2. O añadir más páginas a `PAGES_TO_EXCLUDE_FROM_AUTO_CONTENT`

### 4.4 Otras mejoras de SEO para LLMs (pendientes)

| Tarea                              | Prioridad | Estado       |
| ---------------------------------- | --------- | ------------ |
| Archivo `llms.txt` en public/      | Baja      | 🔜 Opcional  |
| Tracking referrals desde IA en GA4 | Baja      | 🔜 Opcional  |
| Estadísticas verificables en About | Media     | 🔜 Contenido |

---

## 5. VIDEOS Y MEDIA

### 5.1 Estructura por página de clase

| Posición            | Tipo                | Plataforma | Formato | Duración | Objetivo            |
| ------------------- | ------------------- | ---------- | ------- | -------- | ------------------- |
| Hero/Arriba         | Reel energético     | Bunny      | 9:16    | 15-30s   | Captar atención     |
| Después de "Qué es" | Demo clase          | YouTube    | 16:9    | 1-2 min  | Mostrar experiencia |
| Social proof        | Testimonio          | YouTube    | 16:9    | 30-60s   | Confianza           |
| Final (opcional)    | Fin de curso teatro | YouTube    | 16:9    | 1-2 min  | Aspiración          |

### 5.2 Configuración en código

```typescript
videoSection: {
  enabled: true,
  bunnyVideo: {
    videoId: 'VIDEO-GUID',
    libraryId: '570522',
    aspectRatio: '9:16',
    thumbnailUrl: 'https://vz-c354d67e-cc3.b-cdn.net/VIDEO-GUID/thumbnail.jpg',
  },
  videos: [
    { videoId: 'YOUTUBE-ID-DEMO', title: 'Demo Clase - Estilo' },
    { videoId: 'YOUTUBE-ID-TESTIMONIO', title: 'Testimonio Alumno' },
  ],
},
```

### 5.3 Checklist al subir video

- [ ] Video subido a Bunny/YouTube
- [ ] Thumbnail generado y URL copiada
- [ ] Título SEO optimizado (incluir "Barcelona", estilo, Farray's)
- [ ] Descripción con keywords + link a web
- [ ] aspectRatio correcto (9:16 vertical, 16:9 horizontal)
- [ ] Traducción de VideoTitle y VideoDesc en 4 idiomas
- [ ] Testear en móvil y desktop

### 5.4 Videos a crear por estilo

| Estilo             | Reel | Demo | Testimonio | Teatro |
| ------------------ | ---- | ---- | ---------- | ------ |
| Afro Contemporáneo | ✅   | 🔜   | 🔜         | 🔜     |
| Salsa Cubana       | 🔜   | 🔜   | 🔜         | 🔜     |
| Bachata            | 🔜   | 🔜   | 🔜         | 🔜     |
| Hip Hop            | 🔜   | 🔜   | 🔜         | 🔜     |
| Reggaeton          | 🔜   | 🔜   | 🔜         | 🔜     |

### 5.5 Schema SEO para videos

```json
{
  "@type": "VideoObject",
  "name": "Clase de Salsa Cubana Barcelona",
  "thumbnailUrl": "...",
  "uploadDate": "2024-01-15",
  "duration": "PT2M30S",
  "contentUrl": "...",
  "embedUrl": "..."
}
```

### 5.6 Presencia en Medios

Si han salido en prensa/TV/podcasts:

- [ ] Crear sección "Han hablado de nosotros"
- [ ] Links a menciones externas (backlinks naturales)

---

## 6. MEJORAS DE CONVERSIÓN

### 6.1 Exit-Intent Popup (ALTA PRIORIDAD)

Modal que aparece cuando el usuario va a abandonar la página.

**Trigger:**

- Desktop: Mouse sale del viewport hacia arriba
- Móvil: Scroll rápido hacia arriba o botón atrás

**Contenido:**

- Oferta irresistible: "¡Espera! Tu primera clase GRATIS"
- Formulario de email/WhatsApp
- Contador de urgencia (plazas limitadas)

**Reglas:**

- Solo mostrar 1 vez por sesión
- No mostrar si ya es lead/alumno
- No mostrar en páginas legales

### 6.2 Sticky WhatsApp Button

- [ ] Botón flotante de WhatsApp en todas las páginas
- Posición: bottom-right (no interferir con CTA móvil)
- Mensaje pre-escrito: "Hola, quiero info sobre clases de [estilo]"

### 6.3 Countdown Timer

- "Puertas Abiertas termina en: 2d 14h 32m"
- Persistente entre páginas

### 6.4 Social Proof Notifications

- "María de Barcelona se apuntó hace 5 min"
- Usar datos reales de Momence API
- No fake, solo mostrar si hay inscripciones recientes

### 6.5 Price Anchoring

- "~~60€~~ → 45€/mes (primer mes)"

---

## 7. MEJORAS UX

### 7.1 Booking Directo

- [ ] Integrar calendario de Momence en la web
- [ ] Ver horarios disponibles
- [ ] Reservar sin salir de la página
- [ ] Pago integrado (Stripe)

### 7.2 Calculadora de Precios

Widget interactivo:

- ¿Cuántas clases/semana?
- ¿Bono o mensualidad?
- Resultado: "Tu precio: 85€/mes"

### 7.3 Filtro de Clases

En página de horarios:

- Filtrar por estilo
- Filtrar por nivel
- Filtrar por día
- Filtrar por profesor

### 7.4 Quiz Interactivo

- [ ] "¿Qué estilo de baile va contigo?"
- Captura de lead al final

### 7.5 PWA (Progressive Web App)

- [ ] Crear manifest.json
- [ ] Service worker
- [ ] Instalar como app
- [ ] Notificaciones push
- [ ] Funcionar offline

---

## 8. ANALYTICS Y TRACKING

### 8.1 Funnel Tracking

```
Visit → View Class → Click CTA → Open Modal → Submit Lead → Booking
```

Medir drop-off en cada paso.

### 8.2 Heatmaps

- [ ] Integrar Hotjar o Microsoft Clarity (gratis)
- Ver dónde hacen clic
- Ver scroll depth
- Recordings de sesiones

### 8.3 Event Tracking Granular

```javascript
gtag('event', 'video_play', { video_title, video_duration });
gtag('event', 'cta_click', { cta_location, cta_text });
gtag('event', 'form_start', { form_name });
gtag('event', 'form_submit', { form_name, lead_source });
gtag('event', 'exit_intent_shown', {});
gtag('event', 'exit_intent_converted', {});
```

### 8.4 Funnels en GA4

- [ ] Funnel 1: Conversión a clase (visita → horarios → contacto → reserva)
- [ ] Funnel 2: Interés por estilo (home → categoría → clase → engagement)
- [ ] Funnel 3: Regalo/Bonos (página → selección → checkout → compra)

### 8.5 Pixels de Remarketing

- [ ] Configurar Facebook Pixel (vía GTM)
- [ ] Configurar TikTok Pixel (vía GTM)
- [ ] Crear audiencias de remarketing

### 8.6 Attribution Tracking

UTM parameters en todas las campañas:

- utm_source
- utm_medium
- utm_campaign
- utm_content

---

## 9. INTEGRACIONES

### 9.1 CRM/Email Marketing

- [ ] Mailchimp o Brevo
- [ ] Secuencias automatizadas para leads
- [ ] Newsletter mensual

### 9.2 Retargeting

- [ ] Meta Pixel
- [ ] Google Ads remarketing
- [ ] TikTok Pixel

### 9.3 Chat en vivo

- [ ] Tidio o Crisp
- [ ] Respuestas automáticas FAQ
- [ ] Handoff a humano

### 9.4 Reviews Automation

- [ ] Pedir review después de X clases
- [ ] Widget de Google Reviews en web

### 9.5 Directorios Locales

- [ ] Registrar en Yelp España
- [ ] Registrar en Foursquare
- [ ] Registrar en Páginas Amarillas
- [ ] Registrar en Cylex España

---

## 10. MEJORAS TÉCNICAS

### 10.1 A/B Testing Framework

- [ ] Integrar Vercel Edge Config o similar
- Testear diferentes CTAs
- Testear colores de botones
- Testear copy

### 10.2 Error Tracking Mejorado

Ya tienen Sentry, añadir:

- [ ] Session replay
- [ ] User feedback widget
- [ ] Performance monitoring

### 10.3 E2E Tests con Playwright

- [ ] Tests para flujo de reserva
- [ ] Tests para formulario de contacto
- [ ] Tests para navegación crítica

### 10.4 Edge Functions

- [ ] Lead capture en edge
- [ ] Redirects por geolocation
- [ ] A/B test assignment

---

## 11. BACKLOG TÉCNICO

### 11.1 Preload Warnings (Console)

#### stardust.png ✅ RESUELTO

- **Estado:** ✅ Eliminado completamente
- **Beneficio:** ~100KB bandwidth ahorrado por visita

#### style-\*.css - Preload duplicado de Vite

- **Severidad:** Baja (solo ruido en consola)
- **Solución:** Dejar como está o configurar `modulePreload: false`

### 11.2 Pendiente - Opcional

| Tarea                           | Prioridad | Esfuerzo | Impacto     |
| ------------------------------- | --------- | -------- | ----------- |
| E2E tests con Playwright        | Media     | Alto     | QA          |
| Dividir bundles i18n por página | Baja      | Alto     | Performance |
| Eliminar `unsafe-eval` en CSP   | Baja      | Alto     | Seguridad   |
| React Query para data fetching  | Baja      | Medio    | DX          |

### 11.3 NO Hacer (Descartado)

- ❌ Purge CSS verificar: Tailwind 3.x ya lo hace automáticamente
- ❌ Dark mode toggle: El sitio ya es dark mode, sin demanda
- ❌ Coverage 80% global: Config actual enfocada en hooks/utils/shared

---

## 12. AUDITORÍA WEB (Dic 2024)

### 12.1 Puntuación Global: 8.8/10

| Categoría                   | Puntuación | Estado           |
| --------------------------- | ---------- | ---------------- |
| SEO                         | 9.2/10     | ✅ Excelente     |
| GEO/Local SEO               | 9.5/10     | ✅ Sobresaliente |
| Accesibilidad (a11y)        | 8.8/10     | ✅ Muy bueno     |
| Rendimiento                 | 8.5/10     | ✅ Muy bueno     |
| Buenas Prácticas React/Vite | 9.0/10     | ✅ Excelente     |
| Seguridad                   | 9.3/10     | ✅ Excelente     |
| CSS/Tailwind                | 8.7/10     | ✅ Muy bueno     |
| Testing                     | 7.5/10     | 🟡 Bueno         |
| Internacionalización (i18n) | 9.0/10     | ✅ Excelente     |

### 12.2 Correcciones Aplicadas ✅

- [x] `<meta name="author">` en páginas de blog
- [x] Contraste de color WCAG AA
- [x] Jerarquía H1-H6
- [x] BreadcrumbList Schema
- [x] Landings Facebook Ads con noindex/nofollow

### 12.3 Tests Añadidos

**Estado: 543 tests passing | Coverage: ~24% líneas, 71% branches, 60% funciones**

---

## 13. OPTIMIZACIÓN TEXT-SHADOW 3D (Ene 2025)

### 13.1 Problema Identificado

El efecto holográfico original usaba 7 capas de text-shadow con blur:

- Problemas de legibilidad con `font-bold`
- Impacto en rendimiento (paint time elevado)
- FPS inestables en móviles

### 13.2 Solución Implementada

```css
/* DESPUÉS: 3D Sutil con 3 capas */
.holographic-text {
  text-shadow:
    1px 1px 0 #c82260,
    2px 2px 0 #a01d4d,
    3px 3px 3px rgba(0, 0, 0, 0.3);
}
```

### 13.3 Mejoras

| Métrica           | Antes | Después | Mejora   |
| ----------------- | ----- | ------- | -------- |
| Capas text-shadow | 7     | 3       | **-57%** |
| Blur calculations | 5     | 1       | **-80%** |
| Paint time        | ~100% | ~35-40% | **~60%** |
| Legibilidad       | 7/10  | 10/10   | **+43%** |

### 13.4 Cómo Revertir

Ver documentación en `CAMBIOS-COLOR-HOLOGRAFICO.md`

---

## PRIORIDADES ACTUALIZADAS (Enero 2025)

### Inmediato (Pre-lanzamiento)

1. ✅ Auditoría web completada
2. ✅ Tests críticos añadidos (543 tests)
3. ✅ SEO para LLMs implementado
4. ✅ Optimización text-shadow 3D
5. 🔜 Contenido de videos pendientes
6. 🔜 Review final de traducciones
7. 🔜 Google Search Console + Business Profile

### Post-lanzamiento

8. WhatsApp widget flotante
9. Exit-Intent Modal con Momence
10. E2E tests con Playwright
11. Analytics avanzado (Hotjar/Clarity)

### Futuro (Cuando haya tracción)

12. PWA completa
13. Booking directo integrado
14. Calculadora de precios
15. Páginas de niños (si hay demanda)

---

## MÉTRICAS DE ÉXITO

### Conversión

| Métrica         | Actual | Objetivo  |
| --------------- | ------ | --------- |
| Conversion Rate | ~2%    | 5%+       |
| Bounce Rate     | ~50%   | <40%      |
| Time on Page    | 1:30   | 3:00+     |
| Video Play Rate | ?      | 30%+      |
| Lead to Booking | ?      | 20%+      |
| Core Web Vitals | Good   | All Green |

### SEO

| Métrica                              | Herramienta    | Objetivo |
| ------------------------------------ | -------------- | -------- |
| CTR keywords principales             | Search Console | +20%     |
| Posición "clases [estilo] Barcelona" | Search Console | Top 5    |
| Reseñas Google                       | Business       | +10/mes  |
| Tiempo en página blog                | Analytics      | >3 min   |

### Lighthouse

| Categoría      | Target |
| -------------- | ------ |
| Performance    | > 90   |
| Accessibility  | > 95   |
| Best Practices | > 95   |
| SEO            | > 95   |

---

## NOTAS TÉCNICAS

### Bunny.net Configuration

- Library ID: 570522
- Pull Zone: vz-c354d67e-cc3.b-cdn.net
- Thumbnail URL pattern: `https://vz-c354d67e-cc3.b-cdn.net/{VIDEO_ID}/thumbnail.jpg`

### Vercel Upgrade Triggers

Pasar a Pro ($20/mes) cuando:

- Bandwidth > 80GB/mes
- Builds en cola frecuentemente
- Necesites password protection
- Equipo > 1 developer

### Archivos Clave

| Archivo                           | Propósito                |
| --------------------------------- | ------------------------ |
| `components/SEO/SchemaMarkup.tsx` | Schemas principales      |
| `components/SEO/BlogSchemas.tsx`  | Schemas de blog          |
| `prerender.mjs`                   | Metadata SEO + LLM       |
| `i18n/locales/*.ts`               | Traducciones             |
| `CAMBIOS-COLOR-HOLOGRAFICO.md`    | Doc cambios text-shadow  |
| `test-3d-text.html`               | Test alternativas efecto |

---

## RECURSOS ÚTILES

### Herramientas gratuitas

- [Google Search Console](https://search.google.com/search-console)
- [Google Business Profile](https://business.google.com)
- [Google Tag Manager](https://tagmanager.google.com)
- [Microsoft Clarity](https://clarity.microsoft.com) - Heatmaps gratis
- [PageSpeed Insights](https://pagespeed.web.dev)
- [Schema Validator](https://validator.schema.org)

---

_Última actualización: 2025-01-14 (Roadmap consolidado)_
