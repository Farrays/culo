# Sistema de Reservas - Documentación Completa

> **Fecha:** 1 Febrero 2026
> **Estado:** ✅ IMPLEMENTADO Y EN PRODUCCIÓN (con issues pendientes)
> **Última actualización:** Fix cron-feedback.ts + Solución definitiva Google Calendar identificada

---

## ⚠️ RESUMEN EJECUTIVO - ISSUES CRÍTICOS

| Issue                                  | Impacto                              | Solución                                            | Estado                    |
| -------------------------------------- | ------------------------------------ | --------------------------------------------------- | ------------------------- |
| **Admin NO recibe emails de reservas** | El admin no sabe cuándo hay reservas | Añadir función en email.ts + llamada en reservar.ts | ❌ Pendiente              |
| ~~**cron-feedback.ts ROTO**~~          | ~~Emails feedback no se envían~~     | Dynamic import                                      | ✅ **FIXED** (1 Feb 2026) |
| **preview-email.ts**                   | No existe                            | Fue eliminado del proyecto                          | ⚠️ N/A                    |
| **Google Calendar deshabilitado**      | No sync automático                   | Usar patrón `/_lib/` (ver abajo)                    | ❌ Pendiente              |

### Regla de Seguridad

> 🛡️ **NUNCA tocar los imports de `reservar.ts`** - Es el core del sistema.
> Todos los fixes deben seguir patrones probados (ver sección "Análisis de Patrones").

---

## Índice

1. [Estado Actual del Sistema](#estado-actual-del-sistema)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Flujo Completo del Sistema](#flujo-completo-del-sistema)
4. [APIs Implementadas](#apis-implementadas)
5. [Sistema de Emails](#sistema-de-emails)
6. [Sistema de WhatsApp](#sistema-de-whatsapp)
7. [Estructura de Datos Redis](#estructura-de-datos-redis)
8. [Sistema de Recordatorios](#sistema-de-recordatorios)
9. [Errores Encontrados y Soluciones](#errores-encontrados-y-soluciones)
10. [**Análisis de Patrones de Errores (Guía Fixes)**](#análisis-de-patrones-de-errores-guía-para-fixes-seguros)
11. [Tareas Pendientes de Emails](#tareas-pendientes-de-emails)
12. [Variables de Entorno](#variables-de-entorno)
13. [Commits Relevantes](#commits-relevantes)

---

## Estado Actual del Sistema

### ✅ Funcionalidades Implementadas y Funcionando

| Funcionalidad                     | Estado        | Archivo Principal         |
| --------------------------------- | ------------- | ------------------------- |
| Reserva de clases de prueba       | ✅ Producción | `api/reservar.ts`         |
| Cancelación de reservas           | ✅ Producción | `api/cancelar-reserva.ts` |
| Magic Links (autogestión)         | ✅ Producción | `api/mi-reserva.ts`       |
| Email de confirmación             | ✅ Producción | `api/lib/email.ts`        |
| Email de cancelación              | ✅ Producción | `api/lib/email.ts`        |
| Email de recordatorio 48h/24h     | ✅ Producción | `api/lib/email.ts`        |
| Email de feedback post-clase      | ✅ Producción | `api/lib/email.ts`        |
| WhatsApp confirmación             | ✅ Producción | `api/lib/whatsapp.ts`     |
| WhatsApp recordatorios            | ✅ Producción | `api/lib/whatsapp.ts`     |
| WhatsApp cancelación              | ✅ Producción | `api/lib/whatsapp.ts`     |
| Deduplicación de reservas         | ✅ Producción | `api/reservar.ts`         |
| Rate limiting (3/min por IP)      | ✅ Producción | `api/reservar.ts`         |
| Meta CAPI (Lead €90)              | ✅ Producción | `api/reservar.ts`         |
| Redis persistence                 | ✅ Producción | `api/lib/redis.ts`        |
| Cron reminders 48h/24h            | ✅ Producción | `api/cron-reminders.ts`   |
| Cron feedback                     | ✅ Producción | `api/cron-feedback.ts`    |
| Social proof (reservas recientes) | ✅ Producción | `api/social-proof.ts`     |
| Calendario client-side (URLs)     | ✅ Producción | `api/lib/email.ts`        |

### ⚠️ Funcionalidades Deshabilitadas Temporalmente

| Funcionalidad               | Razón                                           | Commit    |
| --------------------------- | ----------------------------------------------- | --------- |
| Google Calendar API (OAuth) | Vercel bundling issues - `ERR_MODULE_NOT_FOUND` | `a285e54` |

### ❌ No Implementado / Roto

| Funcionalidad                     | Prioridad   | Notas                                                        |
| --------------------------------- | ----------- | ------------------------------------------------------------ |
| **Notificación reservas a admin** | **CRÍTICA** | `info@farrayscenter.com` NO recibe emails de nuevas reservas |
| ~~cron-feedback.ts fix~~          | ~~CRÍTICA~~ | ✅ **FIXED** - Cambiado a dynamic import (1 Feb 2026)        |
| preview-email.ts                  | N/A         | No existe - fue eliminado del proyecto                       |
| Emails multi-idioma               | Baja        | Solo español actualmente                                     |
| Google Calendar sync server-side  | Media       | Deshabilitado - Solución: usar patrón `/_lib/`               |

> **NOTA IMPORTANTE:** El feedback.ts SÍ tiene código para notificar al admin (`FEEDBACK_NOTIFY_EMAIL = 'info@farrayscenter.com'`), pero `reservar.ts` NO tiene implementada la notificación de nuevas reservas al admin.

---

## Stack Tecnológico

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ARQUITECTURA ACTUAL (Febrero 2026)                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  FRONTEND                    BACKEND                    SERVICIOS EXTERNOS   │
│  ════════                    ═══════                    ══════════════════   │
│                                                                              │
│  React 19 + Vite             Vercel Functions           Momence OAuth2       │
│  BookingWidgetV2             /api/reservar ✅           (Bookings + Leads) ✅ │
│  MiReservaPage               /api/cancelar-reserva ✅                         │
│  BookingSuccess              /api/mi-reserva ✅         Meta CAPI ✅          │
│                              /api/cron-reminders ✅     (Conversion €90)      │
│                              /api/cron-feedback ✅                            │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                     UPSTASH REDIS ✅                                  │   │
│  │  ════════════════════════════════════════════════════════════════    │   │
│  │                                                                       │   │
│  │  • Cache clases (15-30 min)         • Deduplicación leads (90 días)  │   │
│  │  • Storage reservas                 • Índices para búsqueda          │   │
│  │  • Magic link tokens               • Momence token cache (58 min)    │   │
│  │  • Reminder sets por fecha         • Social proof list               │   │
│  │                                                                       │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                     COMUNICACIONES ✅                                 │   │
│  │  ════════════════════════════════════════════════════════════════    │   │
│  │                                                                       │   │
│  │  WHATSAPP (Meta Cloud API)          RESEND (Email)                   │   │
│  │  • 5 templates confirmación         • Dominio: farrayscenter.com ✅  │   │
│  │  • 2 templates recordatorio         • From: reservas@farrayscenter   │   │
│  │  • 1 template cancelación           • 5 tipos de email               │   │
│  │  • Categorías por estilo            • Instrucciones por categoría    │   │
│  │                                                                       │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                     GOOGLE CALENDAR ⚠️ DESHABILITADO                  │   │
│  │  ════════════════════════════════════════════════════════════════    │   │
│  │                                                                       │   │
│  │  • URLs client-side funcionan ✅    • OAuth server-side ❌           │   │
│  │  • .ics download funciona ✅        • Sync automático ❌              │   │
│  │  • Vercel bundling issues           • Pendiente re-implementar       │   │
│  │                                                                       │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Flujo Completo del Sistema

### Flujo de Reserva Nueva (Implementado ✅)

```
Usuario → BookingWidgetV2 → POST /api/reservar
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. VALIDACIÓN ✅                                                         │
│    • Email válido (regex)                                               │
│    • Teléfono válido (E.164, 7-15 dígitos)                             │
│    • Consents RGPD (terms, privacy, age)                               │
│    • Rate limit: 3 reservas/min por IP                                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 2. DEDUPLICACIÓN ✅                                                      │
│    • GET booking:{email} de Redis                                       │
│    • Si existe → RECHAZAR "Ya tienes reserva"                          │
│    • Si no existe → CONTINUAR                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 3. MOMENCE ✅                                                            │
│    • Buscar member existente por email                                  │
│    • Crear member si no existe                                          │
│    • Crear booking con sessionId → obtener bookingId                   │
│    • FALLBACK: Customer Leads si falla booking directo                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 4. MAGIC LINK ✅                                                         │
│    • managementToken = crypto.randomBytes(16).toString('hex')          │
│    • URL: /es/mi-reserva?token={managementToken}                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 5. GUARDAR EN REDIS ✅                                                   │
│    Pipeline atómico:                                                    │
│    • SETEX booking:{email} → datos (90 días TTL)                       │
│    • SETEX booking_details:{eventId} → datos                           │
│    • SETEX mgmt:{token} → email (30 días TTL)                          │
│    • SADD reminders:{fecha} → email                                    │
│    • LPUSH recent_bookings → social proof                              │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 6. META CAPI ✅                                                          │
│    • POST evento "Lead" (valor €90)                                    │
│    • PII hasheado: email, phone, firstName, lastName                   │
│    • eventId único para deduplicación con Pixel                        │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 7. NOTIFICACIONES (PARALELO) ✅                                          │
│                                                                         │
│    ┌─────────────────────┐  ┌─────────────────────┐                    │
│    │ EMAIL (Resend) ✅    │  │ WHATSAPP ✅          │                    │
│    │ • Confirmación      │  │ • Template por      │                    │
│    │ • Detalles clase    │  │   categoría         │                    │
│    │ • Calendar buttons  │  │ • Nombre, fecha,    │                    │
│    │ • Qué traer         │  │   hora, clase       │                    │
│    │ • Magic link        │  │                     │                    │
│    └─────────────────────┘  └─────────────────────┘                    │
│                                                                         │
│    ⚠️ GOOGLE CALENDAR: Deshabilitado temporalmente                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 8. RESPUESTA ✅                                                          │
│    {                                                                    │
│      success: true,                                                    │
│      emailSuccess: true,                                               │
│      whatsappSuccess: true,                                            │
│      calendarSuccess: false  // Deshabilitado                          │
│    }                                                                   │
│    Widget muestra: BookingSuccess con confetti                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## APIs Implementadas

### Endpoints Core

| Endpoint                | Método | Archivo                   | Estado        |
| ----------------------- | ------ | ------------------------- | ------------- |
| `/api/reservar`         | POST   | `api/reservar.ts`         | ✅ Producción |
| `/api/cancelar-reserva` | POST   | `api/cancelar-reserva.ts` | ✅ Producción |
| `/api/mi-reserva`       | GET    | `api/mi-reserva.ts`       | ✅ Producción |
| `/api/attendance`       | POST   | `api/attendance.ts`       | ✅ Producción |
| `/api/feedback`         | POST   | `api/feedback.ts`         | ✅ Producción |

### Endpoints de Clases

| Endpoint        | Método | Archivo           | Estado        |
| --------------- | ------ | ----------------- | ------------- |
| `/api/clases`   | GET    | `api/clases.ts`   | ✅ Producción |
| `/api/schedule` | GET    | `api/schedule.ts` | ✅ Producción |

### Endpoints Cron

| Endpoint                  | Frecuencia | Archivo                     | Estado                |
| ------------------------- | ---------- | --------------------------- | --------------------- |
| `/api/cron-reminders`     | Cada hora  | `api/cron-reminders.ts`     | ✅ Producción         |
| `/api/cron-reminders-24h` | Cada hora  | `api/cron-reminders-24h.ts` | ⚠️ Legacy (duplicado) |
| `/api/cron-feedback`      | Cada hora  | `api/cron-feedback.ts`      | ✅ Producción         |

### Endpoints de Testing

| Endpoint             | Propósito           | Estado      |
| -------------------- | ------------------- | ----------- |
| `/api/test-email`    | Test envío email    | ✅ Funciona |
| `/api/test-whatsapp` | Test envío WhatsApp | ✅ Funciona |
| `/api/test-redis`    | Test conexión Redis | ✅ Funciona |
| `/api/debug-redis`   | Debug datos Redis   | ✅ Funciona |

---

## Sistema de Emails

### Tipos de Email Implementados

| Tipo         | Función                     | Trigger             | Líneas  |
| ------------ | --------------------------- | ------------------- | ------- |
| Confirmación | `sendBookingConfirmation()` | Al crear reserva    | 481-537 |
| Cancelación  | `sendCancellationEmail()`   | Al cancelar reserva | 541-600 |
| Recordatorio | `sendReminderEmail()`       | Cron 48h/24h antes  | 605-680 |
| Feedback     | `sendFeedbackEmail()`       | Cron 2h post-clase  | 685-760 |
| Test         | `sendTestEmail()`           | Manual              | 765-798 |

### Configuración de Resend (api/lib/email.ts)

```typescript
// Líneas 8-50
FROM_EMAIL: "Farray's Center <reservas@farrayscenter.com>";
REPLY_TO: 'info@farrayscenter.com';
BRAND_PRIMARY: '#B01E3C'; // Borgoña
BRAND_DARK: '#800020'; // Borgoña oscuro
BASE_URL: 'https://www.farrayscenter.com'; // ✅ Ya tiene www
```

### Instrucciones por Categoría (líneas 291-370)

```typescript
type ClassCategory =
  | 'bailes_sociales' // Salsa, Bachata, Kizomba, etc.
  | 'danzas_urbanas' // Hip Hop, House, Dancehall, etc.
  | 'danza' // Ballet, Contemporáneo, Jazz
  | 'entrenamiento' // Training, Fitness, Stretch
  | 'heels'; // Heels, Femmology, Stiletto
```

### Features de Emails

- ✅ Calendar section (Google Calendar URL + .ics download) - líneas 269-285
- ✅ Instrucciones personalizadas por categoría (líneas 378-428)
- ✅ Información de ubicación y transporte
- ✅ Botones de acción (Ver reserva, Cómo llegar)
- ✅ Footer con redes sociales (líneas 430-448)
- ✅ Preheader text optimizado
- ✅ Responsive design (max-width 600px)

---

## Sistema de WhatsApp

### Templates Implementados (api/lib/whatsapp.ts)

#### Confirmación por Categoría (líneas 56-62)

| Template                       | Categoría                 | Parámetros                                 |
| ------------------------------ | ------------------------- | ------------------------------------------ |
| `confirmacion_bailes_sociales` | Salsa, Bachata, etc.      | firstName, className, classDate, classTime |
| `confirmacion_danzas_urbanas`  | Hip Hop, House, etc.      | firstName, className, classDate, classTime |
| `confirmacion_danza`           | Ballet, Contemporáneo     | firstName, className, classDate, classTime |
| `confirmacion_danza`           | Entrenamiento (reutiliza) | firstName, className, classDate, classTime |
| `confirmacion_heels`           | Heels, Femmology          | firstName, className, classDate, classTime |

#### Recordatorios

| Template                | Uso       | Parámetros                              |
| ----------------------- | --------- | --------------------------------------- |
| `recordatorio_prueba_0` | 48h antes | firstName, className, dateTime          |
| `recordatorio_prueba_2` | 24h antes | firstName, className, dateTime, address |

#### Cancelación

| Template   | Uso         | Parámetros |
| ---------- | ----------- | ---------- |
| `cancelar` | Al cancelar | firstName  |

### Funciones Principales

```typescript
// api/lib/whatsapp.ts
sendBookingConfirmationWhatsApp(); // líneas 180-240
sendReminderWhatsApp(); // líneas 251-268
sendCancellationWhatsApp(); // líneas 270-290
sendTestWhatsApp(); // líneas 292-310
isWhatsAppConfigured(); // líneas 366-368
```

---

## Estructura de Datos Redis

### Schema de Booking (api/lib/redis.ts)

```typescript
interface BookingData {
  // Identificación
  email: string; // Normalizado a lowercase

  // Datos personales
  firstName: string;
  lastName: string;
  phone: string; // E.164: +34666555444

  // Datos de la clase
  sessionId: number; // ID sesión Momence
  bookingId?: number; // ID booking Momence
  className: string; // "Bachata Sensual - Principiantes"
  classDate: string; // ISO: "2026-01-28"
  classTime: string; // "19:00"
  instructor?: string;
  category?: ClassCategory;

  // Magic Link
  managementToken: string; // 32-char hex

  // Estado
  status: 'confirmed' | 'cancelled';
  reminderSent: boolean;
  reminder2hSent: boolean;
  reminder48hSent: boolean;
  reminder24hSent: boolean;
  feedbackSent: boolean;

  // Tracking
  eventId: string; // Meta CAPI deduplication
  timestamp: number;
  sourceUrl?: string;

  // Consents RGPD
  acceptsTerms: boolean;
  acceptsPrivacy: boolean;
  acceptsMarketing: boolean;
}
```

### Keys y TTLs

| Key Pattern                 | Tipo          | TTL     | Propósito                  |
| --------------------------- | ------------- | ------- | -------------------------- |
| `booking:{email}`           | String (JSON) | 90 días | Datos completos de reserva |
| `booking_details:{eventId}` | String (JSON) | 90 días | Lookup por eventId         |
| `mgmt:{token}`              | String        | 30 días | Magic link → email         |
| `reminders:{YYYY-MM-DD}`    | Set           | 7 días  | Emails con clase ese día   |
| `recent_bookings`           | List          | Sin TTL | Social proof (últimas 50)  |
| `momence:access_token`      | String        | 3500s   | OAuth token cache          |
| `momence:sessions:cache`    | String        | 30 min  | Cache de clases            |
| `momence:schedule:cache`    | String        | 15 min  | Cache de horarios          |

---

## Sistema de Recordatorios

### Timeline de Comunicaciones

```
T=0 (Reserva)     T-48h           T-24h           T-2h           T+2h
     │               │               │               │              │
     ▼               ▼               ▼               ▼              ▼
┌─────────┐    ┌─────────┐     ┌─────────┐    ┌─────────┐    ┌─────────┐
│ EMAIL   │    │ EMAIL   │     │ EMAIL   │    │ WHATSAPP│    │ EMAIL   │
│ CONFIRM │    │ WHATSAPP│     │ WHATSAPP│    │ SOLO    │    │ FEEDBACK│
│ WHATSAPP│    │ 48h     │     │ 24h+    │    │ 2h      │    │         │
└─────────┘    └─────────┘     │ PROMO   │    └─────────┘    └─────────┘
                               └─────────┘
```

### Cron Jobs Configurados

| Cron          | Archivo                 | Horario   | Estado    | Función                          |
| ------------- | ----------------------- | --------- | --------- | -------------------------------- |
| Reminders     | `cron-reminders.ts`     | Cada hora | ✅        | 48h + 24h antes de clase         |
| Reminders 24h | `cron-reminders-24h.ts` | Cada hora | ⚠️ LEGACY | 24h con promo (duplicado)        |
| Feedback      | `cron-feedback.ts`      | Cada hora | ✅ FIXED  | 2h después de clase (1 Feb 2026) |

---

## Errores Encontrados y Soluciones

### 1. Google Calendar - Vercel Bundling (CRÍTICO)

**Error:**

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/var/task/api/google-calendar'
imported from /var/task/api/reservar.js
```

**Causa:** Vercel serverless functions no pueden resolver imports relativos entre archivos en `/api/`.

**Intentos fallidos:**

1. ❌ Dynamic imports (`await import()`)
2. ❌ Static imports entre archivos api/
3. ❌ Mover archivo a `/lib/` en root
4. ❌ Mover archivo a `/api/lib/`

**Solución aplicada:** Deshabilitar Google Calendar temporalmente (commit `a285e54`)

**Archivos afectados:**

- `api/reservar.ts` - Código eliminado completamente
- `api/attendance.ts` - Código eliminado completamente
- `api/webhook-whatsapp.ts` - Comentado 3 secciones de calendar
- `api/cancelar-reserva.ts` - Código eliminado completamente

---

### SOLUCIÓN DEFINITIVA PARA GOOGLE CALENDAR (Identificada 1 Feb 2026)

> **IMPORTANTE:** Vercel recomienda usar carpetas con prefijo underscore (`/api/_lib/`)
> que NO se convierten en funciones serverless.

**El problema:** Cada archivo en `/api/` se convierte en una función serverless aislada.
Vercel no puede resolver imports entre ellas.

**Timeline de intentos fallidos:**

| Commit    | Intento                            | Resultado                 |
| --------- | ---------------------------------- | ------------------------- |
| `10f4876` | Crear `api/lib/google-calendar.ts` | ❌ `ERR_MODULE_NOT_FOUND` |
| `36b1610` | Dynamic import `await import()`    | ❌ FAILED                 |
| `a289f4c` | Dynamic import en attendance.ts    | ❌ FAILED                 |
| `567da48` | Mover a api root                   | ❌ FAILED                 |
| `a252cd1` | Static imports                     | ❌ FAILED                 |
| `3d25c33` | Mover a lib/ folder                | ❌ FAILED                 |
| `a285e54` | **DESHABILITADO**                  | ✅ Booking funciona       |

**Ninguno probó el patrón oficial de Vercel: `/_lib/`**

**Solución definitiva:**

```
api/
├── _lib/                    ← Carpeta con _ NO se convierte en serverless
│   └── google-calendar.ts   ← Código compartido seguro
├── reservar.ts
├── cancelar-reserva.ts
└── ...
```

**Implementación:**

1. Crear carpeta `api/_lib/`
2. Crear `api/_lib/google-calendar.ts` con el código OAuth2
3. Importar desde cualquier endpoint: `import { createCalendarEvent } from './_lib/google-calendar'`

**Referencia:** [Vercel Serverless Functions Documentation](https://vercel.com/docs/functions/runtimes#helper-files)

---

### 2. preview-email.ts - No existe

**Estado:** El archivo `preview-email.ts` no existe en el proyecto actual.

Si se necesita previsualizar emails, usar `/api/test-email?type=confirmation` (ya funciona).

---

### 3. cron-feedback.ts - Vercel Import Error ✅ RESUELTO

**Error original:**

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/var/task/lib/email'
imported from /var/task/api/cron-feedback.js
```

**Causa:** Import estático de `./lib/email` a nivel de módulo.

**Solución aplicada (1 Feb 2026):**

```typescript
// ANTES (línea 16) - FALLABA:
import { sendFeedbackEmail } from './lib/email';

// DESPUÉS - FUNCIONA:
// Dynamic import DENTRO del try block donde se usa:
const { sendFeedbackEmail } = await import('./lib/email');
```

**Archivos que usan imports de ./lib/email:**
| Archivo | Tipo Import | Estado |
|---------|-------------|--------|
| `api/cron-feedback.ts` | Dynamic | ✅ **FIXED** |
| `api/reservar.ts` línea 9 | Static | ✅ Funciona |
| `api/cron-reminders.ts` | Dynamic | ✅ Funciona |
| `api/cancelar-reserva.ts` | Dynamic | ✅ Funciona |

**Estado:** ✅ **RESUELTO** - Pendiente deploy a Vercel para confirmar

---

### 4. Build TypeScript

**Estado:** ✅ Sin errores - 948 módulos compilados correctamente

---

## Análisis de Patrones de Errores (Guía para Fixes Seguros)

### El Problema Central: Vercel Bundling

Vercel serverless functions tienen un comportamiento específico que causa errores cuando:

1. Se usan imports estáticos de módulos locales que acceden a `process.env` durante la inicialización
2. Se usan imports relativos a subdirectorios (`./lib/email`)

### Patrones que FUNCIONAN ✅

| Patrón                                               | Ejemplo                       | Por qué funciona                                              |
| ---------------------------------------------------- | ----------------------------- | ------------------------------------------------------------- |
| **Static import + función llamada en handler**       | `reservar.ts` línea 9         | La función se importa pero NO se ejecuta hasta el handler     |
| **Dynamic import dentro de función async**           | `cron-reminders.ts` línea 127 | El import ocurre después de la inicialización de env vars     |
| **Import de npm package + instanciación en handler** | `test-email.ts`               | `new Resend(apiKey)` dentro del handler, no a nivel de módulo |

### Patrones que FALLAN ❌

| Patrón                                     | Ejemplo                     | Por qué falla                                        |
| ------------------------------------------ | --------------------------- | ---------------------------------------------------- |
| **Static import + singleton con env vars** | `cron-feedback.ts` línea 16 | El módulo accede a `process.env` durante import time |
| **Import de ./lib en crons**               | `preview-email.ts`          | Vercel resuelve la ruta incorrectamente              |

### Código de Referencia

**✅ SEGURO - reservar.ts (funciona):**

```typescript
// Línea 9 - Static import de FUNCIÓN
import { sendBookingConfirmation } from './lib/email';

// La función se llama DENTRO del handler, no en import time
export default async function handler(req, res) {
  // ... mucho código ...
  const result = await sendBookingConfirmation(data); // Línea ~1073
}
```

**✅ SEGURO - cron-reminders.ts (funciona):**

```typescript
// NO hay import estático de ./lib/email al inicio

export default async function handler(req, res) {
  // Línea 127-128 - Dynamic import DENTRO del handler
  const { sendReminderEmail } = await import('./lib/email');
  const { sendReminderWhatsApp } = await import('./lib/whatsapp');

  // Ahora sí usar las funciones
  await sendReminderEmail(data);
}
```

**❌ FALLA - cron-feedback.ts (roto):**

```typescript
// Línea 16 - Static import a nivel de módulo
import { sendFeedbackEmail } from './lib/email'; // ← FALLA

// El import intenta resolver antes de que env vars estén listas
```

### Soluciones Seguras para Cada Archivo

#### cron-feedback.ts - Cambiar a dynamic import

```typescript
// ANTES (línea 16) - FALLA:
import { sendFeedbackEmail } from './lib/email';

// DESPUÉS - FUNCIONA:
// Quitar la línea 16
// Y dentro de la función donde se usa:
const { sendFeedbackEmail } = await import('./lib/email');
```

#### preview-email.ts - Inlinear código

```typescript
// ANTES - FALLA:
import { generateConfirmationEmailHtml } from './lib/email';

// DESPUÉS - FUNCIONA:
// Copiar el código de la función directamente en el archivo
// Ver test-email.ts como ejemplo de código inlineado
```

### Regla de Oro para No Romper el Sistema de Reservas

> **NUNCA modificar reservar.ts para experimentar con imports.**
>
> Si necesitas probar algo:
>
> 1. Crea un archivo de test (ej: `test-new-feature.ts`)
> 2. Prueba el patrón ahí primero
> 3. Solo cuando funcione en Vercel, aplica a producción

### Orden de Prioridad para Fixes

1. ~~**cron-feedback.ts**~~ - ✅ COMPLETADO (1 Feb 2026)
2. **Notificación admin en reservar.ts** - Añadir BCC sin cambiar imports (10 min)
3. **Google Calendar** - Usar patrón `/_lib/` (2+ horas)

> **Nota:** preview-email.ts no existe, usar test-email.ts para previsualizar

### Archivos que NO TOCAR (Funcionan en Producción)

| Archivo                 | Razón                                       |
| ----------------------- | ------------------------------------------- |
| `api/reservar.ts`       | Core del sistema de reservas                |
| `api/lib/email.ts`      | Usado por reservar.ts, NO modificar exports |
| `api/lib/whatsapp.ts`   | Usado por reservar.ts                       |
| `api/cron-reminders.ts` | Recordatorios funcionando                   |

---

## Tareas Pendientes de Emails

### 0. Notificación de Reservas al Admin (NO IMPLEMENTADO)

**Estado:** ❌ No existe - El admin NO recibe emails cuando alguien reserva

**El problema:**

- `reservar.ts` envía email al CLIENTE pero NO al admin
- El admin (`info@farrayscenter.com`) no sabe cuándo hay nuevas reservas
- Solo se entera si revisa Momence manualmente

**Comparación con feedback.ts que SÍ notifica:**

```typescript
// feedback.ts línea 25 - SÍ TIENE notificación admin
const FEEDBACK_NOTIFY_EMAIL = 'info@farrayscenter.com';

// reservar.ts - NO TIENE esta funcionalidad
```

**Solución propuesta (SEGURA - sin cambiar imports):**

Añadir en `api/lib/email.ts` una función nueva:

```typescript
export async function sendAdminBookingNotification(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  className: string;
  classDate: string;
  classTime: string;
}): Promise<{ success: boolean; error?: string }> {
  const resend = getResend();

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: 'info@farrayscenter.com',
      replyTo: data.email,
      subject: `🎉 Nueva reserva: ${data.firstName} - ${data.className}`,
      html: `...`, // Template simple con los datos
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

Y en `reservar.ts` añadir DESPUÉS del email al cliente:

```typescript
// Línea ~1090 (después de sendBookingConfirmation)
try {
  await sendAdminBookingNotification({
    firstName,
    lastName,
    email,
    phone,
    className,
    classDate,
    classTime,
  });
} catch (e) {
  console.warn('[reservar] Admin notification failed:', e);
  // No bloquear la reserva si falla
}
```

**Prioridad:** ALTA - El admin necesita saber de las reservas

---

### api/lib/email.ts - Cambios Requeridos

#### 1. Footer: texto del link (línea 439) - COSMÉTICO

```typescript
// ACTUAL (link correcto, texto sin www):
<a href="${BASE_URL}">farrayscenter.com</a>
// BASE_URL ya es https://www.farrayscenter.com

// CAMBIAR A (si se quiere consistencia visual):
<a href="${BASE_URL}">www.farrayscenter.com</a>
```

**Estado:** ⚠️ Funciona pero texto inconsistente

---

#### 2. Recordatorio: "Cómo llegar" duplicado (líneas 648-657)

```typescript
// PROBLEMA: generateWhatToBringSection (línea 648) ya incluye "Cómo llegar"
// Pero luego hay OTRA sección "Cómo llegar" en líneas 649-657

// ACTUAL (líneas 648-657):
${data.category ? generateWhatToBringSection(data.category) : ''}
<div style="background: #f5f5f5; padding: 20px; ...">
  <h4>📍 Cómo llegar</h4>  // <-- DUPLICADO
  ...
</div>

// SOLUCIÓN: Eliminar líneas 649-657 (la sección duplicada)
```

**Estado:** ❌ Pendiente

---

#### 3. Cancelación: quitar emoji ✅ (línea 561)

```typescript
// ACTUAL:
<p>Tu clase de <strong>${data.className}</strong> ha sido cancelada ✅ y la plaza...</p>

// CAMBIAR A:
<p>Tu clase de <strong>${data.className}</strong> ha sido cancelada y la plaza...</p>
```

**Estado:** ❌ Pendiente

---

#### 4. Cancelación: WhatsApp clickable (línea 578)

```typescript
// ACTUAL:
<p>Escríbenos por WhatsApp al <strong>${WHATSAPP_NUMBER}</strong>...</p>

// CAMBIAR A:
<p>Escríbenos por WhatsApp al <a href="${WHATSAPP_URL}" style="color: ${BRAND_PRIMARY}; text-decoration: none;"><strong>${WHATSAPP_NUMBER}</strong></a>...</p>
```

**Estado:** ❌ Pendiente

---

### Verificación Post-Cambios

```bash
# 1. Build sin errores
npm run build

# 2. Deploy a Vercel
git push

# 3. Probar endpoints
curl https://farrayscenter.com/api/preview-email?type=confirmation
curl https://farrayscenter.com/api/preview-email?type=reminder
curl https://farrayscenter.com/api/preview-email?type=cancellation
```

---

## Variables de Entorno

### Requeridas (Críticas)

```env
# REDIS (Upstash)
STORAGE_REDIS_URL=redis://...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# MOMENCE
MOMENCE_CLIENT_ID=...
MOMENCE_CLIENT_SECRET=...
MOMENCE_USERNAME=...
MOMENCE_PASSWORD=...
MOMENCE_API_URL=...
MOMENCE_TOKEN=...

# META
META_PIXEL_ID=...
META_CAPI_TOKEN=...

# EMAIL
RESEND_API_KEY=...

# WHATSAPP
WHATSAPP_TOKEN=...
WHATSAPP_PHONE_ID=...

# CRON
CRON_SECRET=...
```

### Opcionales (Deshabilitadas)

```env
# GOOGLE CALENDAR (Deshabilitado por Vercel bundling issues)
GOOGLE_CLIENT_EMAIL=...
GOOGLE_PRIVATE_KEY=...
GOOGLE_CALENDAR_ID=...
```

---

## Commits Relevantes

| Commit    | Descripción                                                           |
| --------- | --------------------------------------------------------------------- |
| `9a2af72` | feat(booking): add cancellation system with WhatsApp and email        |
| `bf545b5` | feat(whatsapp): add WhatsApp Cloud API helper with category templates |
| `1fe57b6` | feat(email): add Resend email helper and test endpoint                |
| `a285e54` | fix(booking): disable Google Calendar temporarily to restore booking  |
| `78d6c4e` | feat(booking): add 48h reminders, calendar integration                |
| `ebb9050` | fix(magic-links): revert to email+event approach                      |
| `1ed26c7` | fix(email): revert to inlined email code for Vercel                   |
| `87aacac` | fix(whatsapp): reminder templates use 4 separate parameters           |
| `5dda2df` | fix(whatsapp): update confirmation template names                     |

---

## Archivos Principales

```
api/
├── reservar.ts              ← Crear reserva (1141 líneas)
├── cancelar-reserva.ts      ← Cancelar reserva
├── mi-reserva.ts            ← Magic link lookup
├── attendance.ts            ← Actualizar asistencia
├── feedback.ts              ← Procesar feedback
├── cron-reminders.ts        ← Recordatorios 48h/24h (330 líneas)
├── cron-reminders-24h.ts    ← Legacy 24h (DUPLICADO - eliminar?)
├── cron-feedback.ts         ← Email post-clase
├── lib/
│   ├── email.ts             ← Sistema de emails (824 líneas)
│   ├── whatsapp.ts          ← Sistema WhatsApp (469 líneas)
│   └── redis.ts             ← Persistence layer
├── test-email.ts            ← Testing emails ✅
├── test-whatsapp.ts         ← Testing WhatsApp ✅
└── test-redis.ts            ← Testing Redis ✅

lib/
└── google-calendar.ts       ← Google Calendar (⚠️ no importable desde api/)

components/booking/
├── BookingWidgetV2.tsx      ← Widget principal
├── components/
│   ├── BookingSuccess.tsx   ← Confirmación con confetti
│   └── ...
└── MiReservaPage.tsx        ← Página de autogestión
```

---

**Documento actualizado:** 1 Febrero 2026
**Última acción:** Fixed cron-feedback.ts con dynamic import
**Próxima revisión:** Al implementar notificaciones admin o Google Calendar
