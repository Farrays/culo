# Auditoría Técnica — Tareas Verificadas (Feb 2026)

> Generado el 18/02/2026 mediante análisis automatizado con 16 agentes de verificación cruzada.
> Cada hallazgo fue contrastado contra el código real. Se eliminaron falsos positivos.
> **Última actualización (18/02/2026):** Revisión manual de cada tarea con el código fuente real.
> Muchas tareas de Semana 2 resultaron ser falsos positivos o riesgo > beneficio.
> Semana 1 completada (branch `fix/week1-audit-zero-blast-radius`).

---

## Resumen Ejecutivo

| Área            | Nota inicial | Nota revisada | Comentario                                                                             |
| --------------- | ------------ | ------------- | -------------------------------------------------------------------------------------- |
| Seguridad       | 5.5/10       | **7.5/10**    | Muchos hallazgos eran teóricos. reservar.ts ya tiene rate limit + CSRF + dedup         |
| Código muerto   | 7/10         | **8.5/10**    | Semana 1 limpió 8 archivos + dead code. JornadaPuertasAbiertas restaurada (uso futuro) |
| Type Safety     | 6.5/10       | 6.5/10        | Sin cambios — `as unknown as T` sigue presente pero bajo riesgo real                   |
| Testing         | 6/10         | 6/10          | Sin cambios — API/cron sin cobertura                                                   |
| Build & Deps    | 8.5/10       | 8.5/10        | Sin cambios — excelente                                                                |
| Fichaje (legal) | 7/10         | **8/10**      | ip_firma corregido. Timezone era falso positivo                                        |
| Routing/SEO     | 7.5/10       | **8.5/10**    | yr-project rewrite ya existía. Ruta duplicada eliminada                                |

---

## ZONAS DE PELIGRO — NO TOCAR SIN LEER ESTO

### Archivos que NO se pueden modificar sin testing exhaustivo

| Archivo                          | Por qué                                                                      | Qué se rompe                                                     |
| -------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `api/reservar.ts`                | Revenue principal. 2000+ líneas, cadena de 7 servicios externos              | Reservas dejan de funcionar → pérdida de ingresos                |
| `api/lib/feature-flags.ts`       | Controla los 4 sistemas críticos (booking, fichaje, Laura, analytics)        | Kill switches dejan de funcionar                                 |
| `BookingWidgetV2.tsx`            | 975 líneas, formulario de reserva activo en producción                       | Widget de reservas roto para usuarios                            |
| `api/webhook-whatsapp.ts`        | 1200+ líneas, recibe TODOS los mensajes WhatsApp (bookings, fichajes, Laura) | Agent Laura no responde, fichajes por WhatsApp rotos             |
| `api/cron-fichaje.ts`            | 1005 líneas, sincroniza Momence → fichajes cada 5 min                        | Profesores no ven clases para fichar → incumplimiento legal      |
| `api/fichaje-fichajes.ts`        | Tabla legal de fichajes. Tiene `motivo_edicion` obligatorio (línea 526)      | Si se quita el check → ediciones sin auditoría = sanción laboral |
| `api/fichaje-resumen-mensual.ts` | Check de inmutabilidad en línea 289-296 (firmado = true)                     | Si se quita → resúmenes firmados se pueden modificar = fraude    |
| `prerender.mjs`                  | 2791 líneas, genera 550+ páginas pre-renderizadas en 4 idiomas               | SEO roto, páginas en blanco para Google                          |
| `vercel.json`                    | 2567 líneas, 2242 redirects + 25 rewrites + headers de seguridad             | Un error de sintaxis rompe TODAS las rutas                       |
| `App.tsx`                        | 85+ rutas React. `isPromoLanding` hardcodeado (líneas 329-349)               | Rutas 404, landings con header/footer incorrecto                 |
| `bookingSchema.ts`               | Validación Zod del formulario de reserva                                     | Reservas inválidas aceptadas o válidas rechazadas                |
| `api/lib/ai/agent.ts`            | 949 líneas, cerebro de Agent Laura con system prompt                         | Laura deja de responder o responde mal                           |

### Reglas de seguridad del fichaje (LEGALES, NO ELIMINAR)

| Regla                                     | Archivo:Línea                        | Ley                             |
| ----------------------------------------- | ------------------------------------ | ------------------------------- |
| `motivo_edicion` obligatorio en ediciones | `fichaje-fichajes.ts:526`            | Art. 34.9 ET — trazabilidad     |
| `editado_admin` estado obligatorio        | `fichaje-fichajes.ts:597-608`        | Auditoría de inspección laboral |
| Inmutabilidad de resúmenes firmados       | `fichaje-resumen-mensual.ts:289-296` | RD-ley 8/2019 — prueba digital  |
| Doble-fichaje prevenido                   | `fichaje-fichajes.ts:285-290`        | Control duplicados              |
| `UNIQUE(profesor_id, fecha, hora_inicio)` | Schema BD Supabase                   | Constraint de integridad        |

### Interdependencias críticas entre sistemas

```
BOOKING WIDGET → api/reservar.ts → Momence API + Redis + Resend + WhatsApp + Google Calendar + Meta CAPI
                                    ↑ Si Momence cae, TODO el booking falla
                                    ↑ Si Redis cae, rate limiting bypassed + dedup roto

FICHAJE → api/cron-fichaje.ts → Momence API (clases) + Supabase (fichajes) + WhatsApp (alertas)
                                 ↑ Si nombre profesor no coincide con Momence → clase asignada a nadie
                                 ↑ Si Supabase cae → sistema entero caído

AGENT LAURA → api/webhook-whatsapp.ts → Claude API + Momence + Redis (Upstash) + WhatsApp
                                         ↑ Si Claude API limitada → Laura no responde (tiers 1-5 siguen)
                                         ↑ Si Redis Upstash cae → pierde estado de conversaciones

ANALYTICS → GTM → GA4 + Meta Pixel + Clarity + Sentry
                   ↑ Si GTM no carga → 0 tracking
```

---

## TIER 1: CRITICO — Hacer antes del próximo deploy

### 1.1 Race condition en deduplicación de reservas

- **Archivo:** `api/reservar.ts` (líneas ~1777-2058)
- **Problema:** Patrón GET + SETEX no atómico. Dos requests simultáneos pueden crear reservas duplicadas.
- **Estado:** ⏸️ **DEPRIORITIZADO** — Revisión manual (18/02/2026):
  - El frontend ya deshabilita el botón al hacer clic (previene doble-submit)
  - Momence API tiene su propia deduplicación (rechaza duplicados)
  - El SETEX guarda datos completos (sessionId, className, eventId), no un flag simple → SET NX requiere reestructurar la lógica
  - **Riesgo de tocar reservar.ts (2000+ líneas, revenue directo) > beneficio teórico**
  - Si se detectan reservas duplicadas reales en logs → reconsiderar

### 1.2 `debug-redis.ts` expuesto sin autenticación

- **Archivo:** `api/debug-redis.ts`
- **Estado:** ✅ **COMPLETADO** (18/02/2026) — Archivo eliminado en branch `fix/week1-audit-zero-blast-radius`

### 1.3 Siete endpoints test-\* en producción

- **Archivos:** 7 archivos `api/test-*.ts` + config en `vercel.json`
- **Estado:** ✅ **COMPLETADO** (18/02/2026) — 7 archivos eliminados + config vercel.json limpiada

### 1.4 Autenticación Momence fail-open

- **Archivo:** `api/lib/momence-auth-middleware.ts` (líneas 14-17)
- **Estado:** ⏸️ **DEPRIORITIZADO** — Revisión manual (18/02/2026):
  - `MOMENCE_API_KEY` está configurada en Vercel → el código fail-open (línea 15-17) **nunca se ejecuta**
  - Estos endpoints `/api/momence/*` NO los llama ningún componente frontend ni cron
  - El middleware ya permite requests del mismo dominio (referer check, línea 26-30)
  - Si la env var se borra accidentalmente, el fail-open es mejor que romper todo

### 1.5 Webhook signature enforcement desactivado

- **Archivo:** `api/webhook-whatsapp.ts` (líneas 576-595)
- **Estado:** ⏸️ **DEPRIORITIZADO** — Revisión manual (18/02/2026):
  - Si `WHATSAPP_APP_SECRET` no está en Vercel → `verifyWebhookSignature()` siempre retorna `valid: false` → con enforcement ON, **todos los mensajes WhatsApp rechazados** (Laura, fichajes, bookings)
  - Meta desactiva webhooks tras múltiples 401s consecutivos → reactivar tarda horas
  - Antes de activar: 1) verificar WHATSAPP_APP_SECRET en Vercel, 2) probar firma con mensaje test, 3) documentar proceso de reactivación Meta

### 1.6 (NUEVO) Bug legal: IP no guardada en firma de resumen

- **Archivo:** `api/fichaje-firma-resumen.ts` (línea 128)
- **Estado:** ✅ **COMPLETADO** (18/02/2026) — Añadido `ip_firma: ip` al `.update()`. Línea 129.

### 1.7 (NUEVO) `/yr-project` sin rewrite en vercel.json

- **Estado:** ❌ **FALSO POSITIVO** — La rewrite ya existía en `vercel.json:2372`. Ruta duplicada en App.tsx eliminada.

---

## TIER 2: ALTO — Próxima semana

### 2.1 Security middleware `withSecurity()` solo en 1 endpoint

- **Estado:** ⏸️ **DEPRIORITIZADO** — Revisión manual (18/02/2026):
  - `reservar.ts` ya tiene: rate limiting Redis (línea 1654), CSRF validation (línea 1659), CORS headers (línea 1645)
  - `withSecurity()` añadiría origin validation que bloquearía Vercel preview deploys (`*.vercel.app` no está en whitelist)
  - En producción `NODE_ENV=production` → localhost no está en `ALLOWED_ORIGINS` → desarrollo roto
  - **Si se quiere avanzar:** Empezar solo con lead.ts/contact.ts/feedback.ts (Fase 1). NUNCA en reservar.ts sin testing exhaustivo

### 2.2 CSRF desactivado por defecto

- **Archivo:** `api/lib/security/middleware.ts` (línea 96)
- **Blast radius:** ALTO si se activa sin frontend — El frontend NO envía tokens CSRF. Activar `requireCsrf: true` sin implementar el envío = TODAS las peticiones POST rechazadas.
- **FIX:** Primero implementar envío de tokens desde frontend, DESPUÉS activar el flag.
- **Estado:** [ ] Pendiente

### 2.3 Cero schemas Zod para APIs externas

- **Estado:** ⏸️ **DEPRIORITIZADO** — Revisión manual (18/02/2026):
  - El beneficio es solo debugging (detectar cambios en API Momence)
  - Momence no ha cambiado la estructura de su API en años
  - El sistema de caché Redis (30 min TTL) ya actúa como fallback
  - Un `.parse()` sin `.safeParse()` en `api/clases.ts` = widget vacío = 0 ingresos
  - Nice-to-have para el futuro, pero riesgo > beneficio ahora

### 2.4 `momence-client.ts` devuelve `{} as T`

- **Archivo:** `api/lib/momence-client.ts` (línea 220)
- **Blast radius:** MEDIO — Callers acceden a propiedades de `{}` → `undefined` silencioso.
- **FIX:** Retornar `null` y manejar en callers.
- **CUIDADO:** Verificar TODOS los callers de `request<T>()` que esperan resultado no-null.
- **Estado:** [ ] Pendiente

### 2.5 Cero tests para 11 cron jobs

- **Blast radius:** CERO — Añadir tests no modifica código existente.
- **Priorizar:** `cron-fichaje` (legal), `cron-reminders` (revenue), `cron-backup` (data safety).
- **Estado:** [ ] Pendiente

### 2.6 Cero tests para integraciones core

- **Blast radius:** CERO — Añadir tests no modifica código existente.
- **Priorizar:** `momence-client.ts`, `momence-service.ts`.
- **Estado:** [ ] Pendiente

### 2.7 Sanitización insuficiente

- **Estado:** ⏸️ **DEPRIORITIZADO** — Revisión manual (18/02/2026):
  - No hay vector XSS real: los datos van backend-to-backend (Momence API, Redis, Resend, Meta CAPI)
  - Ningún input de usuario se inyecta directamente en HTML que vea otro usuario
  - Mejorar la sanitización arriesga romper nombres internacionales (José, Núria, O'Brien, François)
  - La sanitización actual (trim + truncar) es suficiente para el uso real

### 2.8 (NUEVO) Fichaje: Falta constraint DB en inmutabilidad de firmas

- **Archivo:** Schema Supabase `resumenes_mensuales`
- **Problema:** La inmutabilidad de resúmenes firmados SOLO se verifica en API (línea 289-296). No hay trigger DB que bloquee updates cuando `firmado = true`. Un query directo a Supabase puede sobreescribir.
- **FIX:** Crear trigger `BEFORE UPDATE ON resumenes_mensuales WHEN (OLD.firmado = true) → REJECT`.
- **Estado:** [ ] Pendiente

### 2.9 (NUEVO) Fichaje: Timezone mismatch en cron-alertas

- **Estado:** ❌ **FALSO POSITIVO** — Revisión manual (18/02/2026):
  - El código NO usa `new Date()` con strings concatenados
  - Usa aritmética de minutos puros: `minutosActuales = horaAMinutos(getHoraAhoraEspana())` vs `minutosInicio = horaAMinutos(fichaje.hora_inicio)`
  - `getHoraAhoraEspana()` usa `timeZone: 'Europe/Madrid'` (supabase.ts:299)
  - `fichaje.hora_inicio` se guarda en hora Madrid por `cron-fichaje.ts`
  - Ambos valores están en la misma zona horaria. No hay bug.

### 2.10 (NUEVO) Booking: Teléfono no normalizado a E.164 antes de Momence

- **Estado:** ❌ **FALSO POSITIVO** — Revisión manual (18/02/2026):
  - `BookingWidgetV2.tsx:575` YA llama `formatPhoneForAPI(phone, countryCode)` con `libphonenumber-js`
  - `CountryPhoneInput.tsx:333-347` exporta `formatPhoneForAPI()` que convierte a E.164
  - `api/reservar.ts:1047-1051` tiene `formatPhoneForMomence()` como segunda capa (redundante pero segura)
  - El flujo completo: input → `libphonenumber-js` → `+34622247085` → API → re-format → Momence
  - Sistema de teléfono funciona correctamente con doble validación

---

## TIER 3: MEDIO — 2-4 semanas

### 3.1 CSP con `unsafe-eval`

- **Archivo:** `vercel.json` (línea ~2525)
- **Estado:** [ ] Pendiente

### 3.2 Ruta duplicada `/yr-project` en App.tsx

- **Estado:** ✅ **COMPLETADO** (18/02/2026) — Eliminada segunda definición (línea 1357)

### 3.3 Tres rutas test en producción

- **Archivo:** `App.tsx` (test-home-v2, offer-test, test-paid-selector)
- **Nota:** `OfferTestLanding.tsx` tiene comentario: "SOLO PARA TESTING - Eliminar despues de aprobar el diseno"
- **Estado:** [ ] Pendiente

### 3.4 Once namespaces i18n tipados como `any`

- **Archivo:** `i18n/types/i18next.d.ts`
- **Estado:** [ ] Pendiente

### 3.5 Landing pages hardcodeadas en App.tsx

- **Archivo:** `App.tsx` (líneas 329-349)
- **Problema:** `isPromoLanding` tiene 18 checks hardcodeados que DEBEN sincronizarse con `LANDING_SLUGS` en `prerender.mjs`. Si se añade nueva landing a prerender.mjs pero no a App.tsx → landing muestra header/footer incorrecto.
- **FIX:** Extraer LANDING_SLUGS a constante compartida, usar `.some()` dinámico.
- **Estado:** [ ] Pendiente

### 3.6 Blog categories en 3 sitios distintos

- **Archivos:** BlogArticlePage config, prerender.mjs (líneas 810-893), vercel.json (líneas 159-246)
- **Problema:** Si se renombra categoría en uno pero no en los otros → URLs rotas + SEO perdido.
- **FIX:** Centralizar en `constants/blog-config.ts`.
- **Estado:** [ ] Pendiente

### 3.7 Componentes huérfanos confirmados

- ~~`JornadaPuertasAbiertasLanding` + config~~ → **RESTAURADA** — Preparada para uso futuro (Jornada Puertas Abiertas)
- `App.tsx` línea 53 → ✅ Comentario `SalsaLadyStylePageV2` eliminado
- `App.tsx` líneas 663-673 → ✅ Bloque route comentado eliminado
- `constants/test-class.ts` → No existe (ya estaba borrado)
- `About.tsx`, `Services.tsx` → Pendiente verificar si siguen siendo huérfanos
- **Estado:** [x] Parcialmente completado

### 3.8 (NUEVO) Fichaje: Professor name matching silencioso

- **Archivo:** `api/cron-fichaje.ts` (líneas 572-612)
- **Problema:** Si nombre en Momence no coincide con `nombre_momence` en BD → clase asignada a nadie (silencioso). Si hay dos "María" en BD, partial match asigna a la primera encontrada (podría ser la incorrecta).
- **Impacto:** Profesor trabaja pero no se le registran horas → no cobra.
- **FIX:** Alertar cuando no hay match en vez de ignorar silenciosamente.
- **Estado:** [ ] Pendiente

### 3.9 (NUEVO) Fichaje: 50 llamadas extra a Momence API por ejecución de cron

- **Archivo:** `api/cron-fichaje.ts` (líneas 243-267)
- **Problema:** `enrichSessionsWithAdditionalTeachers()` hace 1 call por sesión para obtener profesores adicionales. 50 clases = 50 calls. El cron de 5 min podría hacer timeout.
- **FIX:** Batch fetch o cache de la respuesta.
- **Estado:** [ ] Pendiente

---

## TIER 4: BAJO — Limpieza técnica

### 4.1 `VITE_BASE_URL` en código servidor

- **Archivo:** `api/feedback.ts` (línea 26)
- **Estado:** [ ] Pendiente

### 4.2 Falta campo `engines` en package.json

- **Estado:** [ ] Pendiente

### 4.3 Coverage thresholds muy bajos (21% statements)

- **Estado:** [ ] Pendiente

### 4.4 20+ instancias de `as unknown as T` en código Supabase

- **Estado:** [ ] Pendiente

### 4.5 50+ comentarios `@ts-expect-error` / `@ts-ignore`

- **Estado:** [ ] Pendiente

### 4.6 (NUEVO) OG images sin validación en build

- **Archivo:** `prerender.mjs` (líneas 159-280)
- **Problema:** `OG_IMAGE_MAP` mapea 40+ imágenes. Si se borra una imagen, no hay warning en build → social sharing roto.
- **FIX:** Añadir validación `existsSync()` en prerender.mjs.
- **Estado:** [ ] Pendiente

### 4.7 (NUEVO) Landing content vacío = intencional (documentar)

- **Archivo:** `prerender.mjs` (líneas 126-141)
- **Problema:** Landing pages pre-renderizan contenido VACÍO intencionalmente (evitar hydration mismatch React). Si un dev no sabe esto y añade HTML → Error #418.
- **FIX:** Añadir comentario explicativo en el código.
- **Estado:** [ ] Pendiente

---

## Guía de Implementación Segura por Tarea

### Para cada tarea, sigue ESTE orden:

```
1. Leer el código completo del archivo afectado
2. Identificar qué otros archivos importan/dependen de él
3. Crear branch: feature/audit-{numero}-{descripcion}
4. Hacer el cambio mínimo necesario
5. npm run test:regression
6. npm run test:pre-deploy
7. Test manual del flujo afectado
8. PR + review
9. Confirmar con usuario antes de merge
```

### Estado de implementación:

```
SEMANA 1 ✅ COMPLETADA (18/02/2026, branch fix/week1-audit-zero-blast-radius):
  ✅ 1.2 Borrado debug-redis.ts
  ✅ 1.3 Borrados 7 test-*.ts + config vercel.json
  ✅ 1.6 Añadido ip_firma en firma-resumen.ts
  ❌ 1.7 yr-project rewrite ya existía (falso positivo)
  ✅ 3.2 Eliminada ruta duplicada /yr-project en App.tsx
  ✅ 3.7 Eliminado SalsaLadyStylePageV2 comentado (JornadaPuertasAbiertas restaurada)

SEMANA 2 — REVISADA (18/02/2026) — Mayoría descartada tras revisión manual:
  ⏸️ 1.1 SET NX → Riesgo > beneficio. Momence ya deduplica. Botón ya se deshabilita.
  ⏸️ 1.4 Fail-closed → Nunca se ejecuta en producción.
  ⏸️ 1.5 Webhook enforce → Sin WHATSAPP_APP_SECRET verificado. Meta desactiva webhooks.
  ⏸️ 2.7 Sanitización → No hay vector XSS (todo backend-to-backend).
  ❌ 2.9 Timezone → FALSO POSITIVO (usa minutos puros, ambos en Madrid).
  ❌ 2.10 E.164 → FALSO POSITIVO (formatPhoneForAPI ya existe y se usa).

PRÓXIMAS TAREAS CON VALOR REAL (cuando se quiera avanzar):
  [ ] 2.5-2.6 Tests para crons e integraciones (blast radius CERO)
  [ ] 2.8 Trigger DB para inmutabilidad fichaje (cambio en Supabase, no código)
  [ ] 3.5 Landing pages dinámicas (extraer LANDING_SLUGS a constante compartida)
  [ ] 3.8 Alertar cuando nombre profesor no matchea en Momence
  [ ] 2.1 withSecurity() Fase 1 solo en lead/contact/feedback (bajo riesgo)
```

---

## Lo que funciona BIEN (verificado, NO tocar)

| Aspecto                   | Detalle                                                                 |
| ------------------------- | ----------------------------------------------------------------------- |
| Memory leaks              | 0 detectados. 7/7 intervals + 10+ listeners con cleanup                 |
| Dependencias circulares   | 0 detectadas                                                            |
| Console.log en producción | Eliminados via Terser (`drop_console: true`)                            |
| Chunk splitting           | Excelente: react-vendor, router-vendor, constants-media, blog-constants |
| Feature flags             | Tipado perfecto con `as const` + `keyof typeof` + kill switches         |
| Booking form validation   | Gold standard con Zod (`bookingSchema.ts`)                              |
| Test files                | 97 archivos reales                                                      |
| Regression suite          | 622 líneas, 100+ test cases, 8 sistemas                                 |
| CI/CD                     | 6 quality gates (lint, types, test, build, lighthouse, a11y)            |
| ErrorBoundary             | App-level + boundary dedicado para booking                              |
| Accessibility             | `LazyImage` fuerza `alt` obligatorio. pa11y-ci configurado              |
| Prerendering              | 550+ páginas, 4 idiomas, alineado con App.tsx                           |
| i18n                      | Sin strings hardcoded en español (excepto ErrorBoundary, intencional)   |
| Env vars                  | Ningún secreto con prefijo VITE\_                                       |
| Cache headers             | Jerarquía correcta: immutable para assets, revalidate para HTML         |
| Security headers          | HSTS, X-Frame-Options, X-Content-Type-Options, Permissions-Policy       |
| Redirects                 | 2242 reglas de migración WordPress correctas                            |
| ServiceWorker             | Workbox con estrategias correctas por tipo de asset                     |
| `googleapis`              | Activamente usado en google-calendar, reservar, cancelar-reserva        |
| Testimonials components   | Dos componentes distintos, ambos necesarios                             |
| Fichaje soft-delete       | Profesores se desactivan, nunca se borran (preserva historial)          |
| Fichaje audit log         | Trigger automático en INSERT/UPDATE/DELETE de fichajes                  |
| Agent Laura               | 6-tier intent detection + lead scoring + follow-up automático           |
| Email retry queue         | Redis con 3 intentos + backoff via cron cada 15 min                     |
| Booking dedup             | Por email (90d TTL) + por teléfono                                      |

---

## Falsos positivos descartados

### De la auditoría inicial (16 agentes):

| Hallazgo inicial                               | Por qué es falso                                                                   |
| ---------------------------------------------- | ---------------------------------------------------------------------------------- |
| `googleapis` (50MB) sin usar                   | SE USA en google-calendar.ts, google-contacts.ts, reservar.ts, cancelar-reserva.ts |
| `Testimonials.tsx` duplicado                   | Son componentes diferentes: uno hardcoded para homepage, otro genérico con props   |
| `debug-teachers.ts` sin auth                   | SÍ tiene check de `CRON_SECRET`                                                    |
| `JSON.parse` sin try-catch en `clases.ts`      | SÍ tiene try-catch con fallback a Momence                                          |
| `JSON.parse` sin try-catch en `cron-backup.ts` | SÍ tiene try-catch por cada key                                                    |
| 0 tests para security middleware               | CSRF tiene 11 tests, rate-limit 8, webhook 5                                       |
| 58 archivos de test                            | Son 97 archivos reales                                                             |
| `homev2/` solo para test                       | Componentes individuales son reutilizables                                         |
| Rate limiting no aplicado a clases.ts          | clases.ts tiene su propia lógica de cache (30 min TTL)                             |

### Descubiertos en revisión manual (18/02/2026):

| Hallazgo                                  | Por qué es falso o innecesario                                                           |
| ----------------------------------------- | ---------------------------------------------------------------------------------------- |
| **2.10** Teléfono sin E.164               | `formatPhoneForAPI()` en BookingWidgetV2.tsx:575 YA usa `libphonenumber-js` para E.164   |
| **2.9** Timezone mismatch en cron-alertas | Código usa `horaAMinutos()` con minutos puros, ambos en hora Madrid. No hay `new Date()` |
| **1.7** yr-project sin rewrite            | La rewrite YA existía en vercel.json:2372                                                |
| **1.1** Race condition crítico            | Momence deduplica + botón se deshabilita + SETEX guarda datos complejos (no un flag)     |
| **1.4** Auth fail-open peligroso          | `MOMENCE_API_KEY` existe en Vercel → código fail-open nunca se ejecuta                   |
| **2.7** Sanitización insuficiente (XSS)   | No hay vector XSS: datos van backend-to-backend (Momence, Redis, Resend, Meta CAPI)      |
| **2.1** reservar.ts sin withSecurity      | Ya tiene rate limiting + CSRF + dedup. Origin validation bloquearía preview deploys      |
| **2.3** Zod schemas urgentes              | Nice-to-have, pero Momence API estable. Mal implementado = widget vacío                  |

---

## Variables de entorno CRÍTICAS (si falta alguna)

| Variable                                     | Impacto si falta                                          |
| -------------------------------------------- | --------------------------------------------------------- |
| `MOMENCE_CLIENT_ID/SECRET/USERNAME/PASSWORD` | TODAS las reservas fallan con 500                         |
| `STORAGE_REDIS_URL`                          | Rate limiting bypassed + dedup roto + email queue perdida |
| `UPSTASH_REDIS_REST_URL/TOKEN`               | Agent Laura pierde estado de conversaciones               |
| `WHATSAPP_TOKEN`                             | No se envían confirmaciones ni recordatorios              |
| `RESEND_API_KEY`                             | Emails no se envían (queued pero no procesados)           |
| `ANTHROPIC_API_KEY`                          | Agent Laura no puede usar Claude (tiers 1-5 siguen)       |
| `SUPABASE_URL/SERVICE_ROLE_KEY`              | Fichaje completamente caído                               |
| `FEATURE_FLAGS_ADMIN_TOKEN`                  | No se pueden gestionar feature flags                      |

---

## Comandos de referencia

```bash
# Tests de regresión (sistemas críticos)
npm run test:regression

# Pre-deploy completo (regression + all tests + build)
npm run test:pre-deploy

# Kill switch de emergencia
curl -X POST /api/feature-flags \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"action":"emergency_disable","system":"booking"}'

# Restaurar sistema
curl -X POST /api/feature-flags \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"action":"emergency_restore","system":"booking"}'

# Snapshot antes de deploy
curl -X POST /api/feature-flags \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"action":"snapshot"}'
```

---

_Documento generado por auditoría automatizada con 16 agentes + revisión manual detallada (18/02/2026)._
_La auditoría inicial exageró la gravedad de varias tareas. Los agentes reportaron problemas teóricos sin verificar las protecciones ya implementadas._
_Tras revisión manual con el código real: nota de seguridad subió de 5.5/10 a 7.5/10. 8 de las 17 tareas originales resultaron ser falsos positivos o riesgo > beneficio._
