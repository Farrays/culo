# Roadmap Enterprise - Farray's Center

## Estado Actual del Proyecto

- **Stack**: React 19 + Vite 6 + TypeScript
- **Hosting**: Vercel (Free tier)
- **Video**: Bunny.net Stream + YouTube
- **Analytics**: GA4 + Sentry
- **SEO**: Schema markup, prerendering, i18n (4 idiomas)

---

## 1. CONFIGURACIÓN PERFECTA DE VIDEOS

### Estructura por página de clase:

| Posición            | Tipo                | Plataforma | Formato | Duración | Objetivo            |
| ------------------- | ------------------- | ---------- | ------- | -------- | ------------------- |
| Hero/Arriba         | Reel energético     | Bunny      | 9:16    | 15-30s   | Captar atención     |
| Después de "Qué es" | Demo clase          | YouTube    | 16:9    | 1-2 min  | Mostrar experiencia |
| Social proof        | Testimonio          | YouTube    | 16:9    | 30-60s   | Confianza           |
| Final (opcional)    | Fin de curso teatro | YouTube    | 16:9    | 1-2 min  | Aspiración          |

### Configuración en código:

```typescript
videoSection: {
  enabled: true,
  // 1. Reel energético (Bunny - vertical)
  bunnyVideo: {
    videoId: 'VIDEO-GUID',
    libraryId: '570522',
    aspectRatio: '9:16',
    thumbnailUrl: 'https://vz-c354d67e-cc3.b-cdn.net/VIDEO-GUID/thumbnail.jpg',
  },
  // 2-3. Videos YouTube (horizontal)
  videos: [
    { videoId: 'YOUTUBE-ID-DEMO', title: 'Demo Clase - Estilo' },
    { videoId: 'YOUTUBE-ID-TESTIMONIO', title: 'Testimonio Alumno' },
  ],
},
```

### Checklist al subir video:

- [ ] Video subido a Bunny/YouTube
- [ ] Thumbnail generado y URL copiada
- [ ] Título SEO optimizado (incluir "Barcelona", estilo, Farray's)
- [ ] Descripción con keywords + link a web
- [ ] aspectRatio correcto (9:16 vertical, 16:9 horizontal)
- [ ] Traducción de VideoTitle y VideoDesc en 4 idiomas
- [ ] Testear en móvil y desktop

### Videos a crear por estilo (prioridad):

| Estilo             | Reel | Demo | Testimonio | Teatro |
| ------------------ | ---- | ---- | ---------- | ------ |
| Afro Contemporáneo | ✅   | 🔜   | 🔜         | 🔜     |
| Salsa Cubana       | 🔜   | 🔜   | 🔜         | 🔜     |
| Bachata            | 🔜   | 🔜   | 🔜         | 🔜     |
| Hip Hop            | 🔜   | 🔜   | 🔜         | 🔜     |
| Reggaeton          | 🔜   | 🔜   | 🔜         | 🔜     |

---

## 2. MEJORAS DE CONVERSIÓN

### 2.1 Exit-Intent Popup (ALTA PRIORIDAD)

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

**Implementación:**

```typescript
// hooks/useExitIntent.ts
// components/ExitIntentModal.tsx
```

### 2.2 Sticky WhatsApp Button

Botón flotante de WhatsApp en todas las páginas.

- Posición: bottom-right (no interferir con CTA móvil)
- Mensaje pre-escrito: "Hola, quiero info sobre clases de [estilo]"

### 2.3 Countdown Timer

Para ofertas y promociones.

- "Puertas Abiertas termina en: 2d 14h 32m"
- Persistente entre páginas

### 2.4 Social Proof Notifications

Notificaciones tipo "María de Barcelona se apuntó hace 5 min"

- Usar datos reales de Momence API
- No fake, solo mostrar si hay inscripciones recientes

### 2.5 Price Anchoring

Mostrar precio tachado vs precio actual.

- "~~60€~~ → 45€/mes (primer mes)"

---

## 3. MEJORAS SEO

### 3.1 VideoObject Schema para todos los videos

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

### 3.2 Review Snippets mejorados

Implementar AggregateRating en todas las páginas de clase.

### 3.3 Event Schema para cada clase semanal

```json
{
  "@type": "Event",
  "name": "Clase de Salsa - Nivel Intermedio",
  "startDate": "2024-01-20T19:00",
  "location": {...},
  "offers": {...}
}
```

### 3.4 Blog SEO

- Posts optimizados para long-tail keywords
- "Cómo aprender salsa en Barcelona siendo principiante"
- "Beneficios del baile para la salud mental"
- Internal linking a páginas de clase

### 3.5 Local SEO

- Google Business Profile optimizado
- Citations en directorios de baile
- Reviews en Google Maps

---

## 4. MEJORAS UX

### 4.1 Booking Directo

Integrar calendario de Momence en la web.

- Ver horarios disponibles
- Reservar sin salir de la página
- Pago integrado (Stripe)

### 4.2 Calculadora de Precios

Widget interactivo:

- ¿Cuántas clases/semana?
- ¿Bono o mensualidad?
- Resultado: "Tu precio: 85€/mes"

### 4.3 Filtro de Clases

En página de horarios:

- Filtrar por estilo
- Filtrar por nivel
- Filtrar por día
- Filtrar por profesor

### 4.4 Modo Oscuro/Claro

Toggle para preferencia de usuario.
(Ya tienen diseño oscuro, pero opción de claro podría ser útil)

### 4.5 PWA (Progressive Web App)

- Instalar como app
- Notificaciones push
- Funcionar offline (cache de páginas visitadas)

---

## 5. MEJORAS TÉCNICAS

### 5.1 Service Worker

```javascript
// Cache de assets estáticos
// Precache de páginas críticas
// Background sync para formularios
```

### 5.2 A/B Testing Framework

Integrar Vercel Edge Config o similar.

- Testear diferentes CTAs
- Testear colores de botones
- Testear copy

### 5.3 Error Tracking Mejorado

Ya tienen Sentry, añadir:

- Session replay
- User feedback widget
- Performance monitoring

### 5.4 E2E Tests con Playwright

Tests automatizados para:

- Flujo de reserva
- Formulario de contacto
- Navegación crítica

### 5.5 Edge Functions

Mover lógica a edge para menor latencia:

- Lead capture
- Redirects por geolocation
- A/B test assignment

---

## 6. ANALYTICS AVANZADO

### 6.1 Funnel Tracking

```
Visit → View Class → Click CTA → Open Modal → Submit Lead → Booking
```

Medir drop-off en cada paso.

### 6.2 Heatmaps

Integrar Hotjar o Microsoft Clarity.

- Ver dónde hacen clic
- Ver scroll depth
- Recordings de sesiones

### 6.3 Event Tracking Granular

```javascript
// Eventos a trackear:
gtag('event', 'video_play', { video_title, video_duration });
gtag('event', 'cta_click', { cta_location, cta_text });
gtag('event', 'form_start', { form_name });
gtag('event', 'form_submit', { form_name, lead_source });
gtag('event', 'exit_intent_shown', {});
gtag('event', 'exit_intent_converted', {});
```

### 6.4 Attribution Tracking

UTM parameters en todas las campañas.

- utm_source
- utm_medium
- utm_campaign
- utm_content

---

## 7. CONTENIDO PENDIENTE

### 7.1 Páginas faltantes

- [ ] Página de precios clara
- [ ] Página "Método Farray" explicado
- [ ] Página de profesores individual
- [ ] Casos de éxito/transformaciones
- [ ] Galería de fotos/eventos

### 7.2 Testimonios en video

Grabar testimonios de alumnos reales:

- Antes/después
- Por qué eligieron Farray's
- Qué han logrado

### 7.3 Behind the scenes

Contenido que humaniza:

- Día típico en la escuela
- Preparación de fin de curso
- Profesores fuera de clase

---

## 8. INTEGRACIONES

### 8.1 CRM/Email Marketing

- Mailchimp o Brevo
- Secuencias automatizadas para leads
- Newsletter mensual

### 8.2 Retargeting

- Meta Pixel
- Google Ads remarketing
- TikTok Pixel

### 8.3 Chat en vivo

- Tidio o Crisp
- Respuestas automáticas FAQ
- Handoff a humano

### 8.4 Reviews Automation

- Pedir review después de X clases
- Widget de Google Reviews en web

---

## PRIORIDADES (Orden de implementación)

### Fase 1: Quick Wins (1-2 semanas)

1. ✅ Videos Bunny optimizados
2. 🔜 Exit-Intent Popup
3. 🔜 WhatsApp Button flotante
4. 🔜 Event tracking mejorado

### Fase 2: Conversión (2-4 semanas)

5. Más videos por página de clase
6. Countdown timer promociones
7. Social proof notifications
8. A/B testing básico

### Fase 3: SEO & Contenido (1-2 meses)

9. VideoObject Schema en todos los videos
10. Blog con posts SEO
11. Testimonios en video
12. Casos de éxito

### Fase 4: Enterprise (2-3 meses)

13. PWA completa
14. Booking directo integrado
15. Calculadora de precios
16. Dashboard de analytics propio

---

## MÉTRICAS DE ÉXITO

| Métrica         | Actual | Objetivo  |
| --------------- | ------ | --------- |
| Conversion Rate | ~2%    | 5%+       |
| Bounce Rate     | ~50%   | <40%      |
| Time on Page    | 1:30   | 3:00+     |
| Video Play Rate | ?      | 30%+      |
| Lead to Booking | ?      | 20%+      |
| Core Web Vitals | Good   | All Green |

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

---

## 9. BACKLOG - CORRECCIONES TÉCNICAS

### 9.1 Preload Warnings (Console)

**Problema identificado:** Warnings repetidos en consola sobre recursos precargados no utilizados.

#### 9.1.1 ~~stardust.png - Discrepancia de URLs~~ ✅ RESUELTO

- **Estado:** ✅ Eliminado completamente
- **Solución aplicada:** Se eliminó la textura stardust.png de toda la web (preload, ~48 ocurrencias en componentes, y archivo físico)
- **Beneficio:** ~100KB bandwidth ahorrado por visita, código más limpio, sin dependencias externas

#### 9.1.2 style-\*.css - Preload duplicado de Vite

- **Severidad:** Baja
- **Síntoma:** `The resource .../style-EHBsYaPp.css was preloaded but not used`
- **Causa raíz:**
  - `vite.config.ts:95-97` tiene `modulePreload.polyfill: true`
  - `cssCodeSplit: false` genera un CSS global referenciado por múltiples chunks
  - Timing del preload no coincide con el uso real
- **Impacto:** Solo ruido en consola, no afecta performance
- **Solución propuesta:**
  - Opción A: Configurar `modulePreload: false` si no es necesario
  - Opción B: Dejar como está (solo cosmético)

---

_Última actualización: 2024-12_
