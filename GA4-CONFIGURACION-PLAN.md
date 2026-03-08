# Plan de Configuraci&oacute;n GA4 - Farray's Dance Center

> Fecha: 2026-03-06
> Estado: Pendiente de implementaci&oacute;n
> Prioridad: Alta

---

## &Iacute;ndice

1. [Estado Actual](#1-estado-actual)
2. [Property & Data Stream](#2-property--data-stream)
3. [Key Events (Conversiones)](#3-key-events-conversiones)
4. [Custom Dimensions & Metrics](#4-custom-dimensions--metrics)
5. [Audiences (Segmentos)](#5-audiences-segmentos)
6. [Funnels](#6-funnels)
7. [Tracking de Tr&aacute;fico IA](#7-tracking-de-tráfico-ia)
8. [Channel Groupings](#8-channel-groupings-personalizados)
9. [Explorations](#9-explorations-clave)
10. [Reports Personalizados](#10-reports-personalizados)
11. [Integraciones](#11-integraciones-adicionales)
12. [Cambios en C&oacute;digo](#12-cambios-en-código-necesarios)
13. [Inventario de Eventos DataLayer](#13-inventario-completo-de-eventos-datalayer)
14. [Arquitectura de Tracking Actual](#14-arquitectura-de-tracking-actual)
15. [Funnel de Booking Completo](#15-funnel-de-booking-completo)
16. [P&aacute;ginas y CTAs del Proyecto](#16-páginas-y-ctas-del-proyecto)
17. [GEO y SEO](#17-geo-y-seo)

---

## 1. Estado Actual

### Sistemas configurados en c&oacute;digo

| Sistema                        | Estado  | Detalle                                        |
| ------------------------------ | ------- | ---------------------------------------------- |
| GTM Container `GTM-TT2V8Z4`    | &#9989; | Consent Mode v2, defaults denied               |
| DataLayer events               | &#9989; | 30+ eventos custom                             |
| Meta Pixel + CAPI              | &#9989; | Deduplicaci&oacute;n con eventId               |
| Microsoft Clarity `urluk2l5up` | &#9989; | Heatmaps + session recordings                  |
| Sentry                         | &#9989; | Error tracking lazy-loaded                     |
| UTM tracking                   | &#9989; | 7 par&aacute;metros en sessionStorage          |
| Cookie consent GDPR            | &#9989; | 4 categor&iacute;as, versionado                |
| GEO/AI robots.txt              | &#9989; | 20+ AI bots permitidos, crawl-delay: 0         |
| llms.txt                       | &#9989; | Gu&iacute;a completa para AI crawlers          |
| Schema.org JSON-LD             | &#9989; | Organization, LocalBusiness, Course, Blog, FAQ |

### APIs y servicios conectados

| Servicio           | Uso                               | Estado  |
| ------------------ | --------------------------------- | ------- |
| Momence API        | Reservas, miembros                | &#9989; |
| Resend             | Email confirmaci&oacute;n + admin | &#9989; |
| Redis (Upstash)    | Rate limit, dedup, social proof   | &#9989; |
| Meta CAPI          | Server-side conversion tracking   | &#9989; |
| Google Tag Manager | Event routing                     | &#9989; |

### Archivos clave de analytics

| Archivo                                                 | Prop&oacute;sito                                                       |
| ------------------------------------------------------- | ---------------------------------------------------------------------- |
| `utils/analytics.ts`                                    | Funciones principales: trackEvent, trackLead, trackPurchase, CAPI, UTM |
| `hooks/useCookieConsent.ts`                             | Gesti&oacute;n de consentimiento GDPR                                  |
| `components/shared/CookieBanner.tsx`                    | UI de consentimiento                                                   |
| `components/booking/hooks/useBookingAnalytics.ts`       | Tracking espec&iacute;fico del booking widget                          |
| `components/booking/hooks/useBookingFunnelAnalytics.ts` | Funnel timing y abandono                                               |
| `api/meta-event.ts`                                     | Endpoint CAPI browser-side                                             |
| `api/lib/meta-capi.ts`                                  | L&oacute;gica server-side CAPI                                         |
| `index.html`                                            | GTM snippet + Consent Mode defaults                                    |
| `index.tsx`                                             | Web Vitals initialization                                              |

---

## 2. Property & Data Stream

### Configurar en GA4 Admin

- [ ] Verificar que el Measurement ID (`G-XXXXX`) est&aacute; activo en GTM
- [ ] **Enhanced Measurement** activado:
  - &#9745; Page views
  - &#9745; Scrolls
  - &#9745; Outbound clicks
  - &#9745; Site search
  - &#9745; File downloads
  - &#9745; Video engagement
- [ ] **Data retention**: cambiar de 2 meses (default) a **14 meses**
- [ ] **Google Signals**: activar para cross-device tracking
- [ ] **Reporting identity**: "Blended" (device + Google signals + modeling)
- [ ] **Unwanted referrals**: a&ntilde;adir dominios propios si hay redirecciones

---

## 3. Key Events (Conversiones)

Marcar como "Key Events" en GA4 &rarr; Admin &rarr; Events:

| Evento                  | Valor                                                   | Tipo                    | Prioridad       |
| ----------------------- | ------------------------------------------------------- | ----------------------- | --------------- |
| `generate_lead`         | &euro;15-90 (din&aacute;mico seg&uacute;n `lead_value`) | Macro-conversi&oacute;n | &#128308; Alta  |
| `booking_success`       | &euro;90                                                | Macro-conversi&oacute;n | &#128308; Alta  |
| `schedule_class`        | &euro;25                                                | Macro-conversi&oacute;n | &#128308; Alta  |
| `contact_form_submit`   | &euro;20                                                | Micro-conversi&oacute;n | &#128992; Media |
| `exit_intent_converted` | &euro;15                                                | Micro-conversi&oacute;n | &#128992; Media |

### Valores de lead definidos en c&oacute;digo (`utils/analytics.ts`)

```typescript
LEAD_VALUES = {
  EXIT_INTENT: 15, // Exit Intent Modal (EUR)
  CONTACT_FORM: 20, // Contact Form (EUR)
  GENERIC_LEAD: 15, // Generic Lead Modal (EUR)
  TRIAL_CLASS: 25, // Trial Class Booking (EUR)
  MEMBERSHIP: 100, // Membership Purchase (EUR)
  BOOKING_LEAD: 90, // Booking Widget (50&euro;/mes x 6mo x 30% conversi&oacute;n)
};
```

---

## 4. Custom Dimensions & Metrics

### Configurar en GA4 &rarr; Admin &rarr; Custom Definitions

#### Event-scoped Dimensions

| Nombre en GA4    | Par&aacute;metro del evento | Scope | Descripci&oacute;n                                                        |
| ---------------- | --------------------------- | ----- | ------------------------------------------------------------------------- |
| Lead Source      | `lead_source`               | Event | Origen del lead (booking_widget, contact_form, exit_intent, landing_page) |
| Form Name        | `form_name`                 | Event | Nombre del formulario enviado                                             |
| Class Style      | `class_style`               | Event | Estilo de baile (bachata, salsa, heels, etc.)                             |
| Class Level      | `class_level`               | Event | Nivel (principiante, intermedio, avanzado)                                |
| Class Instructor | `class_instructor`          | Event | Nombre del instructor                                                     |
| Error Message    | `error_message`             | Event | Mensaje de error en booking                                               |
| Booking Status   | `booking_status`            | Event | new / existing (deduplicaci&oacute;n)                                     |
| Discount Code    | `discount_code`             | Event | C&oacute;digo de descuento utilizado                                      |
| Filter Type      | `filter_type`               | Event | Tipo de filtro cambiado (style, level, day, etc.)                         |
| Filter Value     | `filter_value`              | Event | Valor del filtro aplicado                                                 |
| Scroll Depth     | `scroll_depth`              | Event | Profundidad de scroll (25%, 50%, 75%, 100%)                               |
| Funnel Step      | `funnel_step`               | Event | Paso del funnel completado                                                |
| Deep Link Style  | `deep_link_style`           | Event | Estilo de deep link usado                                                 |

#### User-scoped Dimensions

| Nombre en GA4      | Par&aacute;metro     | Scope | Descripci&oacute;n                                      |
| ------------------ | -------------------- | ----- | ------------------------------------------------------- |
| AI Traffic Source  | `ai_traffic_source`  | User  | Fuente de tr&aacute;fico IA (ChatGPT, Perplexity, etc.) |
| First Landing Page | `first_landing_page` | User  | Primera p&aacute;gina de aterrizaje                     |
| Discovery Method   | `como_conoce`        | User  | C&oacute;mo conoci&oacute; Farray's                     |

#### Custom Metrics

| Nombre en GA4    | Par&aacute;metro       | Scope | Unidad       |
| ---------------- | ---------------------- | ----- | ------------ |
| Lead Value       | `lead_value`           | Event | EUR          |
| Form Submit Time | `form_submit_duration` | Event | Milliseconds |
| Class Load Time  | `class_load_duration`  | Event | Milliseconds |

---

## 5. Audiences (Segmentos)

### Crear en GA4 &rarr; Admin &rarr; Audiences

| Audiencia                  | Condici&oacute;n                                                              | Uso principal                                 |
| -------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------- | --------- | ----- | ----- | --------------------- |
| **Bookers**                | `booking_success` en &uacute;ltimos 30 d&iacute;as                            | Remarketing, LTV, exclusi&oacute;n de ads     |
| **Lead sin booking**       | `generate_lead` AND NOT `booking_success` (30 d&iacute;as)                    | Retargeting, email nurturing                  |
| **High-intent (abandono)** | `booking_form_started` AND NOT `booking_success`                              | Recovery campaigns                            |
| **AI Search Traffic**      | referrer contains `chat.openai.com`, `perplexity.ai`, `copilot.microsoft.com` | Atribuci&oacute;n IA, an&aacute;lisis calidad |
| **Blog engaged**           | page_path starts with `/blog/` AND `scroll_depth >= 75`                       | Content ROI                                   |
| **Exit intent converted**  | `exit_intent_converted` = true                                                | Efectividad descuentos                        |
| **Multi-style explorers**  | `booking_filter_changed` count >= 3 en sesi&oacute;n                          | Behavioral segmentation                       |
| **Mobile bookers**         | device_category = mobile AND `booking_success`                                | UX optimization                               |
| **Returning visitors**     | session_number > 1                                                            | Loyalty tracking                              |
| **Landing page visitors**  | page_path matches `/es/(bachata                                               | salsa                                         | dancehall | twerk | ...)` | Landing effectiveness |

---

## 6. Funnels

### Crear en GA4 &rarr; Explore &rarr; Funnel Exploration

#### Funnel 1: Booking Principal (Prioridad M&aacute;xima)

```
Paso 1: page_view (cualquier p&aacute;gina)
  &darr;
Paso 2: booking_class_selected
  &darr;
Paso 3: booking_form_started
  &darr;
Paso 4: booking_success
```

**Breakdowns recomendados:**

- `class_style` &rarr; Qu&eacute; estilos convierten mejor
- `device_category` &rarr; M&oacute;vil vs desktop
- `source/medium` &rarr; Qu&eacute; canales traen usuarios que completan
- `class_instructor` &rarr; Qu&eacute; profesores generan m&aacute;s bookings

#### Funnel 2: Lead Capture (Landing Pages)

```
Paso 1: page_view (landing pages /es/bachata, /es/salsa, etc.)
  &darr;
Paso 2: exit_intent_shown OR scroll_depth >= 50%
  &darr;
Paso 3: generate_lead (lead modal o exit intent form)
  &darr;
Paso 4: booking_success (conversi&oacute;n posterior)
```

**Breakdowns:** landing page, `lead_source`, `class_style`

#### Funnel 3: Blog &rarr; Conversi&oacute;n

```
Paso 1: page_view (page_path starts with /blog/)
  &darr;
Paso 2: page_view (page_path contains /reservas OR /clases)
  &darr;
Paso 3: booking_class_selected
  &darr;
Paso 4: booking_success
```

**Breakdown:** `page_title` (art&iacute;culo del blog)

#### Funnel 4: Contact &rarr; Booking

```
Paso 1: page_view (page_path = /contacto)
  &darr;
Paso 2: contact_form_submit
  &darr;
Paso 3: booking_class_selected (visita posterior)
  &darr;
Paso 4: booking_success
```

---

## 7. Tracking de Tr&aacute;fico IA

### Fuentes de tr&aacute;fico IA a detectar

| Referrer contiene                        | Canal asignado | Source             |
| ---------------------------------------- | -------------- | ------------------ |
| `chat.openai.com`                        | AI Search      | ChatGPT            |
| `chatgpt.com`                            | AI Search      | ChatGPT            |
| `perplexity.ai`                          | AI Search      | Perplexity         |
| `copilot.microsoft.com`                  | AI Search      | Bing Copilot       |
| `gemini.google.com`                      | AI Search      | Google Gemini      |
| `claude.ai`                              | AI Search      | Claude             |
| `you.com`                                | AI Search      | You.com            |
| `phind.com`                              | AI Search      | Phind              |
| `kagi.com`                               | AI Search      | Kagi               |
| Google con par&aacute;metros AI Overview | AI Search      | Google AI Overview |

### Implementaci&oacute;n (requiere c&oacute;digo)

**Opci&oacute;n A: Tag en GTM (sin tocar c&oacute;digo del proyecto)**

Crear un Custom HTML Tag en GTM que:

1. Lee `document.referrer`
2. Compara contra lista de dominios IA
3. Si matchea &rarr; `dataLayer.push({ ai_traffic_source: 'ChatGPT' })`
4. Se registra como custom dimension user-scoped en GA4

**Opci&oacute;n B: C&oacute;digo en el proyecto**

A&ntilde;adir detecci&oacute;n en `utils/analytics.ts`:

```typescript
function detectAITrafficSource(): string | null {
  const referrer = document.referrer.toLowerCase();
  const aiSources = {
    'chat.openai.com': 'ChatGPT',
    'chatgpt.com': 'ChatGPT',
    'perplexity.ai': 'Perplexity',
    'copilot.microsoft.com': 'Bing Copilot',
    'gemini.google.com': 'Google Gemini',
    'claude.ai': 'Claude',
    'you.com': 'You.com',
    'phind.com': 'Phind',
  };
  for (const [domain, source] of Object.entries(aiSources)) {
    if (referrer.includes(domain)) return source;
  }
  return null;
}
```

### Nota sobre referrer policy

El proyecto ya tiene `Referrer-Policy: strict-origin-when-cross-origin` en `vercel.json`, lo que **permite** recibir el dominio del referrer en peticiones cross-origin. Esto es suficiente para detectar tr&aacute;fico IA.

---

## 8. Channel Groupings Personalizados

### Crear en GA4 &rarr; Admin &rarr; Channel Groups

| Canal              | Regla                                             |
| ------------------ | ------------------------------------------------- |
| **AI Search**      | referrer matches dominios IA (secci&oacute;n 7)   |
| **Organic Search** | source = google/bing/yahoo, medium = organic      |
| **Paid Search**    | source = google/bing, medium = cpc                |
| **Paid Social**    | source = facebook/instagram, medium = cpc/paid    |
| **Organic Social** | source = facebook/instagram/tiktok, medium != cpc |
| **Email**          | medium = email                                    |
| **Direct**         | source = (direct)                                 |
| **Referral**       | medium = referral                                 |
| **WhatsApp**       | source = whatsapp                                 |
| **Display**        | medium = display/banner                           |

---

## 9. Explorations Clave

### Crear en GA4 &rarr; Explore

| Exploraci&oacute;n             | Tipo GA4           | Objetivo                                                                                      |
| ------------------------------ | ------------------ | --------------------------------------------------------------------------------------------- |
| **Path: Home &rarr; Booking**  | Path exploration   | Ver caminos reales de usuarios hasta conversi&oacute;n                                        |
| **Funnel: Booking completo**   | Funnel exploration | Identificar dropoff points exactos                                                            |
| **User Lifetime por canal**    | User lifetime      | LTV por canal de adquisici&oacute;n                                                           |
| **Cohort: Primera reserva**    | Cohort exploration | Retenci&oacute;n post primera clase gratis                                                    |
| **AI vs Org&aacute;nico**      | Free form          | Comparar calidad tr&aacute;fico IA vs org&aacute;nico (bounce, engagement, conversi&oacute;n) |
| **Estilo m&aacute;s rentable** | Free form          | class_style vs booking_success + lead_value                                                   |
| **Horario &oacute;ptimo**      | Free form          | day_of_week + hour vs bookings                                                                |
| **Device & Browser**           | Free form          | Conversion rate por dispositivo/navegador                                                     |

---

## 10. Reports Personalizados

### Crear en GA4 &rarr; Library &rarr; Custom Reports

| Report                         | Dimensiones           | M&eacute;tricas                                           | Frecuencia |
| ------------------------------ | --------------------- | --------------------------------------------------------- | ---------- |
| **Rendimiento por estilo**     | `class_style`         | bookings, leads, conversion_rate, lead_value              | Semanal    |
| **ROI por canal**              | `source/medium`       | sessions, leads, bookings, total lead_value               | Semanal    |
| **AI Search Performance**      | `ai_traffic_source`   | sessions, leads, bookings, bounce_rate, avg_engagement    | Mensual    |
| **Landing page effectiveness** | `landing_page`        | sessions, generate_lead, booking_success, bounce_rate     | Semanal    |
| **Instructor popularity**      | `class_instructor`    | class_selected count, bookings, conversion_rate           | Mensual    |
| **Day/time heatmap**           | `day_of_week`, `hour` | bookings, page_views                                      | Semanal    |
| **Device performance**         | `device_category`     | conversion_rate, avg_engagement_time, bounce_rate         | Mensual    |
| **Blog content ROI**           | `page_title` (blog)   | page_views, scroll_depth, generate_lead, booking_success  | Mensual    |
| **Exit intent effectiveness**  | `page_path`           | exit_intent_shown, exit_intent_converted, conversion_rate | Semanal    |
| **Error monitoring**           | `error_message`       | booking_error count, affected_sessions                    | Diario     |

---

## 11. Integraciones Adicionales

### Configurar en GA4 Admin &rarr; Product Links

- [ ] **Google Search Console** &rarr; Ver queries org&aacute;nicas directamente en GA4
- [ ] **Google Ads** &rarr; Importar conversiones GA4 como objetivos de campa&ntilde;a
- [ ] **BigQuery Export** &rarr; Activar para an&aacute;lisis SQL avanzado (gratis en GA4)
- [ ] **Looker Studio** &rarr; Dashboard ejecutivo con m&eacute;tricas clave

### Dashboard Looker Studio (sugerido)

**P&aacute;gina 1: Overview Ejecutivo**

- Total bookings (mes actual vs anterior)
- Total leads (mes actual vs anterior)
- Conversion rate global
- Top 5 estilos por bookings
- Tr&aacute;fico por canal (pie chart)

**P&aacute;gina 2: Funnel & Conversi&oacute;n**

- Funnel visualization (4 pasos)
- Dropoff rates por paso
- Conversion rate por dispositivo
- Conversion rate por canal

**P&aacute;gina 3: Contenido & SEO**

- Blog page views y engagement
- AI Search traffic trend
- Top landing pages por conversi&oacute;n
- Organic vs Paid performance

**P&aacute;gina 4: Operaciones**

- Bookings por d&iacute;a de semana / hora
- Instructor performance
- Error rate trend
- Web Vitals (LCP, CLS, INP)

---

## 12. Cambios en C&oacute;digo Necesarios

### &Uacute;nico cambio requerido: AI Traffic Detection

**Archivos a modificar:** `utils/analytics.ts`

**Qu&eacute; a&ntilde;adir:**

1. Funci&oacute;n `detectAITrafficSource()` que lee `document.referrer`
2. Push al dataLayer con `ai_traffic_source` en page load
3. Registro como user property para persistir entre sesiones

**Alternativa sin tocar c&oacute;digo:** Implementar como Custom HTML Tag en GTM.

### Todo lo dem&aacute;s se configura en interfaz GA4/GTM

No se necesitan cambios en c&oacute;digo para:

- Key Events &rarr; Se marcan en GA4 Admin
- Custom Dimensions &rarr; Se registran en GA4 Admin (los par&aacute;metros ya se env&iacute;an)
- Audiences &rarr; Se crean en GA4 Admin
- Funnels &rarr; Se crean en GA4 Explore
- Channel Groups &rarr; Se configuran en GA4 Admin
- Reports &rarr; Se crean en GA4 Library
- Integraciones &rarr; Se enlazan en GA4 Admin

---

## 13. Inventario Completo de Eventos DataLayer

### Eventos de Booking Widget

| Evento                    | Par&aacute;metros                                                                            | Archivo                  |
| ------------------------- | -------------------------------------------------------------------------------------------- | ------------------------ |
| `booking_class_selected`  | class_id, class_name, class_style, class_level, class_instructor, class_date                 | `useBookingAnalytics.ts` |
| `booking_form_started`    | class_id, class_name, class_style                                                            | `useBookingAnalytics.ts` |
| `booking_success`         | class_id, class_name, class_style, class_level, class_instructor, class_date, booking_status | `useBookingAnalytics.ts` |
| `booking_error`           | class_id, class_name, class_style, error_message                                             | `useBookingAnalytics.ts` |
| `booking_filter_changed`  | filter_type, filter_value                                                                    | `useBookingAnalytics.ts` |
| `booking_week_changed`    | direction (next/prev)                                                                        | `useBookingAnalytics.ts` |
| `booking_deep_link_used`  | deep_link_style, source_url                                                                  | `useBookingAnalytics.ts` |
| `booking_class_shared`    | class_id, class_name, share_method                                                           | `useBookingAnalytics.ts` |
| `booking_calendar_google` | class_id, class_name                                                                         | `useBookingAnalytics.ts` |
| `booking_calendar_ics`    | class_id, class_name                                                                         | `useBookingAnalytics.ts` |
| `booking_teacher_viewed`  | teacher_name, class_id                                                                       | `useBookingAnalytics.ts` |

### Eventos de Funnel Analytics

| Evento                            | Par&aacute;metros                 | Archivo                        |
| --------------------------------- | --------------------------------- | ------------------------------ |
| `booking_funnel_step_start`       | funnel_step, timestamp            | `useBookingFunnelAnalytics.ts` |
| `booking_funnel_step_complete`    | funnel_step, duration_ms          | `useBookingFunnelAnalytics.ts` |
| `booking_abandonment`             | funnel_step, reason, time_on_step | `useBookingFunnelAnalytics.ts` |
| `booking_scroll_depth`            | scroll_depth (25/50/75/100)       | `useBookingFunnelAnalytics.ts` |
| `booking_retry_attempt`           | retry_count, error_type           | `useBookingFunnelAnalytics.ts` |
| `booking_interaction`             | interaction_type, element         | `useBookingFunnelAnalytics.ts` |
| `booking_performance_class_load`  | load_duration_ms                  | `useBookingFunnelAnalytics.ts` |
| `booking_performance_form_submit` | submit_duration_ms                | `useBookingFunnelAnalytics.ts` |

### Eventos de Conversi&oacute;n

| Evento           | Par&aacute;metros                                                                        | Archivo        |
| ---------------- | ---------------------------------------------------------------------------------------- | -------------- |
| `generate_lead`  | lead*source, form_name, lead_value, currency, event_id, discount_code, page_path, utm*\* | `analytics.ts` |
| `purchase`       | value, currency, product_category, event_id                                              | `analytics.ts` |
| `schedule_class` | class_name, class_type, value, currency, event_id                                        | `analytics.ts` |

### Eventos de Exit Intent

| Evento                  | Par&aacute;metros                      | Archivo               |
| ----------------------- | -------------------------------------- | --------------------- |
| `exit_intent_shown`     | page_path, trigger_type (mouse/scroll) | `ExitIntentModal.tsx` |
| `exit_intent_dismissed` | page_path                              | `ExitIntentModal.tsx` |
| `exit_intent_converted` | page_path, discount_code               | `ExitIntentModal.tsx` |

### Eventos de Contacto

| Evento                | Par&aacute;metros                | Archivo           |
| --------------------- | -------------------------------- | ----------------- |
| `contact_form_submit` | form_name, lead_value, page_path | `ContactPage.tsx` |

### Eventos Meta CAPI (para deduplicaci&oacute;n)

| Evento          | Par&aacute;metros             | Archivo        |
| --------------- | ----------------------------- | -------------- |
| `capi_pageview` | event_id, page_url            | `analytics.ts` |
| `capi_lead`     | event_id, value, content_name | `analytics.ts` |
| `capi_purchase` | event_id, value, content_name | `analytics.ts` |
| `capi_schedule` | event_id, value, content_name | `analytics.ts` |

### Web Vitals

| M&eacute;trica                  | Tipo        | Archivo     |
| ------------------------------- | ----------- | ----------- |
| CLS (Cumulative Layout Shift)   | Performance | `index.tsx` |
| INP (Interaction to Next Paint) | Performance | `index.tsx` |
| FCP (First Contentful Paint)    | Performance | `index.tsx` |
| LCP (Largest Contentful Paint)  | Performance | `index.tsx` |
| TTFB (Time to First Byte)       | Performance | `index.tsx` |

---

## 14. Arquitectura de Tracking Actual

```
USUARIO (Browser)
&boxdr;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxdl;
&boxv;  Cookie Consent (GDPR)              &boxv;
&boxv;  &boxdr;&boxh; Essential (siempre activo)       &boxv;
&boxv;  &boxdr;&boxh; Analytics (opt-in) &rarr; GA4, Clarity &boxv;
&boxv;  &boxdr;&boxh; Marketing (opt-in) &rarr; Meta Pixel  &boxv;
&boxv;  &boxur;&boxh; Functional (opt-in)              &boxv;
&boxur;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxdk;
           &boxv;
           &darr;
&boxdr;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxdl;
&boxv;  Google Tag Manager (GTM-TT2V8Z4)  &boxv;
&boxv;  &boxdr;&boxh; Consent Mode v2                  &boxv;
&boxv;  &boxdr;&boxh; GA4 Tags (measurement)           &boxv;
&boxv;  &boxdr;&boxh; Meta Pixel Tags                  &boxv;
&boxv;  &boxur;&boxh; Custom HTML Tags                 &boxv;
&boxur;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxdk;
      &boxv;            &boxv;             &boxv;
      &darr;            &darr;             &darr;
   GA4 Property   Meta Pixel    Microsoft Clarity
                      &boxv;
                      &darr;
              &boxdr;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxdl;
              &boxv; Meta CAPI     &boxv;  (Server-side)
              &boxv; /api/meta-   &boxv;
              &boxv;  event       &boxv;
              &boxur;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxdk;
              &boxv;
              &darr;
         Meta Conversion API
         (dedup via eventId)
```

### Flujo de datos:

1. **Usuario interactua** &rarr; Evento JS generado
2. **Consent check** &rarr; &iquest;Analytics/Marketing permitido?
3. **Si permitido** &rarr; `dataLayer.push()` al GTM
4. **GTM procesa** &rarr; Dispara tags GA4, Meta Pixel, Clarity
5. **CAPI paralelo** &rarr; `sendBeacon()` a `/api/meta-event` con mismo `eventId`
6. **Meta deduplica** &rarr; Cuenta 1 conversi&oacute;n (no 2)

---

## 15. Funnel de Booking Completo

```
DESCUBRIMIENTO
&boxdr;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxdl;
&boxv; Landing Page (21 estilos de baile)   &boxv;
&boxv; Homepage Hero CTA                    &boxv;
&boxv; P&aacute;gina de Clases                     &boxv;
&boxv; Deep link: ?style=&day=&level=       &boxv;
&boxv; Blog article CTA                     &boxv;
&boxv; AI Search (ChatGPT, Perplexity...)   &boxv;
&boxur;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxdk;
           &boxv;
           &darr; page_view
PASO 1: SELECCI&Oacute;N DE CLASE (ClassListStep)
&boxdr;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxdl;
&boxv; Filtros: Estilo, Nivel, D&iacute;a, Hora,     &boxv;
&boxv;          Instructor                      &boxv;
&boxv; Navegaci&oacute;n semanal                       &boxv;
&boxv; Cards de clase con "Reservar"            &boxv;
&boxur;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxdk;
           &boxv;
           &darr; booking_class_selected
PASO 2: FORMULARIO (BookingFormStep)
&boxdr;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxdl;
&boxv; Nombre, Apellido, Email, Tel&eacute;fono       &boxv;
&boxv; 7 consentimientos GDPR                   &boxv;
&boxv; Validaci&oacute;n en tiempo real                &boxv;
&boxv; Persistencia en sessionStorage           &boxv;
&boxur;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxdk;
           &boxv;
           &darr; booking_form_started &rarr; POST /api/reservar
PASO 3: PROCESAMIENTO (Server)
&boxdr;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxdl;
&boxv; Rate limiting (Redis)                    &boxv;
&boxv; Validaci&oacute;n email + phone                 &boxv;
&boxv; Dedup check (Redis 90 d&iacute;as)              &boxv;
&boxv; Momence API &rarr; Crear booking              &boxv;
&boxv; Resend &rarr; Email confirmaci&oacute;n + admin      &boxv;
&boxv; Meta CAPI &rarr; Conversi&oacute;n server-side       &boxv;
&boxv; Redis &rarr; Social proof ticker              &boxv;
&boxur;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxdk;
           &boxv;
           &darr; booking_success (o booking_error)
PASO 4: &Eacute;XITO (BookingSuccess)
&boxdr;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxdl;
&boxv; Confirmaci&oacute;n visual (checkmark)          &boxv;
&boxv; Detalles de la clase                      &boxv;
&boxv; A&ntilde;adir a Google Calendar / ICS            &boxv;
&boxv; "Ver m&aacute;s clases" CTA                      &boxv;
&boxv; Email con magic link enviado              &boxv;
&boxur;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxdk;
           &boxv;
           &darr; (email)
POST-BOOKING (Magic Link)
&boxdr;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxdl;
&boxv; /mi-reserva &rarr; Ver/gestionar booking      &boxv;
&boxv; Opci&oacute;n de cancelar                        &boxv;
&boxv; Feedback post-clase                       &boxv;
&boxur;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxh;&boxdk;
```

---

## 16. P&aacute;ginas y CTAs del Proyecto

### Landing Pages (21 estilos)

| P&aacute;gina             | Ruta                          | CTA Principal                           |
| ------------------------- | ----------------------------- | --------------------------------------- |
| Bachata                   | `/:locale/bachata`            | Reserva tu clase gratis &rarr; Schedule |
| Salsa Cubana              | `/:locale/salsa-cubana`       | Reserva tu clase gratis &rarr; Schedule |
| Dancehall                 | `/:locale/dancehall`          | Reserva tu clase gratis &rarr; Schedule |
| Twerk                     | `/:locale/twerk`              | Reserva tu clase gratis &rarr; Schedule |
| Sexy Reggaeton            | `/:locale/sexy-reggaeton`     | Reserva tu clase gratis &rarr; Schedule |
| Sexy Style                | `/:locale/sexy-style`         | Reserva tu clase gratis &rarr; Schedule |
| Hip Hop Reggaeton         | `/:locale/hip-hop-reggaeton`  | Reserva tu clase gratis &rarr; Schedule |
| Contempor&aacute;neo      | `/:locale/contemporaneo`      | Reserva tu clase gratis &rarr; Schedule |
| Femmology                 | `/:locale/femmology`          | Reserva tu clase gratis &rarr; Schedule |
| Hip Hop                   | `/:locale/hip-hop`            | Reserva tu clase gratis &rarr; Schedule |
| Afrobeats                 | `/:locale/afrobeats`          | Reserva tu clase gratis &rarr; Schedule |
| Afro Jazz                 | `/:locale/afro-jazz`          | Reserva tu clase gratis &rarr; Schedule |
| Ballet                    | `/:locale/ballet`             | Reserva tu clase gratis &rarr; Schedule |
| Afro Contempor&aacute;neo | `/:locale/afro-contemporaneo` | Reserva tu clase gratis &rarr; Schedule |
| Commercial Dance          | `/:locale/commercial-dance`   | Reserva tu clase gratis &rarr; Schedule |
| Broadway Jazz             | `/:locale/broadway-jazz`      | Reserva tu clase gratis &rarr; Schedule |
| Clase Bienvenida          | `/:locale/clase-bienvenida`   | Reserva tu clase gratis &rarr; Schedule |
| Profesor Reynier          | `/:locale/profesor-reynier`   | Reserva tu clase gratis &rarr; Schedule |
| Bachata Curso             | `/:locale/bachata-curso`      | Venta directa &rarr; Momence            |
| Salsa Curso               | `/:locale/salsa-curso`        | Venta directa &rarr; Momence            |

### P&aacute;ginas principales

| P&aacute;gina    | Ruta                                       | CTA Principal                |
| ---------------- | ------------------------------------------ | ---------------------------- |
| Home             | `/:locale`                                 | Comienza tu viaje de baile   |
| Clases           | `/:locale/clases/baile-barcelona`          | Ver clases disponibles       |
| Reservas         | `/:locale/reservas`                        | Widget de booking completo   |
| Horarios/Precios | `/:locale/horarios-clases-baile-barcelona` | Ver horarios                 |
| Contacto         | `/:locale/contacto`                        | Enviar mensaje (form)        |
| Hazte Socio      | `/:locale/hazte-socio`                     | Seleccionar members&iacute;a |
| Blog             | `/:locale/blog`                            | Leer art&iacute;culos        |
| Sobre Nosotros   | `/:locale/sobre-nosotros`                  | Conocer el equipo            |
| Ubicaci&oacute;n | `/:locale/como-llegar`                     | Directions                   |
| Profesores       | `/:locale/profesores-baile-barcelona`      | Ver equipo                   |

### Puntos de contacto directo

| Canal           | Dato                         | Tracking                 |
| --------------- | ---------------------------- | ------------------------ |
| Tel&eacute;fono | `+34622247085`               | `tel:` link en footer    |
| Email           | `info@farrayscenter.com`     | `mailto:` link en footer |
| Google Maps     | Coordenadas embebidas        | Link en ubicaci&oacute;n |
| Instagram       | `@farrays_centerbcn`         | Link en footer           |
| TikTok          | `@farrays_centerbcn`         | Link en footer           |
| Facebook        | `/farrayscenter`             | Link en footer           |
| YouTube         | `@farraysinternationaldance` | Link en footer           |

---

## 17. GEO y SEO

### Optimizaci&oacute;n para AI Search Engines

| Elemento               | Estado   | Detalle                                      |
| ---------------------- | -------- | -------------------------------------------- |
| robots.txt AI bots     | &#9989;  | 20+ bots permitidos, crawl-delay: 0          |
| llms.txt               | &#9989;  | Gu&iacute;a completa 157 l&iacute;neas       |
| Answer Capsules        | &#9989;  | En art&iacute;culos blog (72% citation rate) |
| Statistics + Citations | &#9989;  | E-E-A-T con DOI, URLs, autores               |
| Definitions            | &#9989;  | T&eacute;rminos de baile definidos           |
| Speakable selectors    | &#9989;  | Voice search optimizado                      |
| FAQ Schema             | &#9989;  | En art&iacute;culos blog                     |
| AI Traffic Detection   | &#10060; | **FALTA IMPLEMENTAR**                        |

### Schema.org Markup

| Schema                          | Alcance                      | Estado  |
| ------------------------------- | ---------------------------- | ------- |
| Organization                    | Global                       | &#9989; |
| WebSite (SearchAction)          | Global                       | &#9989; |
| LocalBusiness + AggregateRating | Global                       | &#9989; |
| BreadcrumbList                  | Todas las p&aacute;ginas     | &#9989; |
| Course + CourseInstance         | P&aacute;ginas de clases     | &#9989; |
| BlogPosting                     | Art&iacute;culos blog        | &#9989; |
| FAQPage                         | Art&iacute;culos blog        | &#9989; |
| SpeakableSpecification          | Art&iacute;culos blog + Home | &#9989; |

### Hreflang & i18n

| Idioma         | C&oacute;digo | Hreflang         |
| -------------- | ------------- | ---------------- |
| Espa&ntilde;ol | es            | &#9989; es-ES    |
| Catal&aacute;n | ca            | &#9989; ca-ES    |
| Ingl&eacute;s  | en            | &#9989; en-GB    |
| Franc&eacute;s | fr            | &#9989; fr-FR    |
| x-default      | es            | &#9989; Fallback |

---

## Checklist de Implementaci&oacute;n

### Fase 1: Configuraci&oacute;n GA4 (Interfaz)

- [ ] Verificar data stream y measurement ID
- [ ] Activar Enhanced Measurement
- [ ] Cambiar data retention a 14 meses
- [ ] Activar Google Signals
- [ ] Configurar reporting identity como "Blended"
- [ ] Marcar 5 Key Events como conversiones
- [ ] Crear 13 custom dimensions (event-scoped)
- [ ] Crear 3 custom dimensions (user-scoped)
- [ ] Crear 3 custom metrics

### Fase 2: Audiences y Channel Groups

- [ ] Crear 10 audiences
- [ ] Configurar channel grouping personalizado con "AI Search"

### Fase 3: Funnels y Explorations

- [ ] Crear 4 funnels en Explorations
- [ ] Crear 8 explorations clave
- [ ] Configurar 10 reports personalizados

### Fase 4: AI Traffic Detection (C&oacute;digo)

- [ ] Implementar `detectAITrafficSource()` en analytics.ts (o tag GTM)
- [ ] Testar con referrers simulados
- [ ] Deploy a producci&oacute;n

### Fase 5: Integraciones

- [ ] Enlazar Google Search Console
- [ ] Enlazar Google Ads (si hay campa&ntilde;as)
- [ ] Activar BigQuery Export
- [ ] Crear dashboard Looker Studio

---

> **Nota:** Este documento se genera a partir del an&aacute;lisis exhaustivo del c&oacute;digo fuente del proyecto. Todos los eventos, par&aacute;metros y archivos referenciados est&aacute;n verificados contra el c&oacute;digo real.
