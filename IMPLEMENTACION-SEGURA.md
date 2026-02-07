# Estrategia de Implementación Segura

## Protección de Sistemas Críticos

Este documento describe cómo implementar las mejoras de la auditoría **SIN ROMPER** los 4 sistemas críticos:

1. **Widget de Reservas** - Generador de ingresos principal
2. **Fichajes** - Control horario legal obligatorio
3. **Agent Laura** - Conversión de leads via WhatsApp
4. **Farray's Analytics** - Tracking y métricas de negocio

---

## Sistema de Feature Flags

Hemos implementado un sistema de feature flags en Redis que permite:

- ✅ Activar/desactivar features sin redeploy
- ✅ Rollback instantáneo en caso de problemas
- ✅ Kill switches de emergencia por sistema
- ✅ Rollout gradual por porcentaje de usuarios
- ✅ Audit log de todos los cambios

### Flags Disponibles

```typescript
// SEGURIDAD (Fase 1)
CSRF_PROTECTION; // Verificación CSRF en formularios
WEBHOOK_ENFORCEMENT; // Webhooks en modo enforcement
ENHANCED_SANITIZATION; // DOMPurify para sanitización
MX_VALIDATION; // Validación MX en emails

// i18n/SEO (Fase 2)
INTL_DATE_FORMAT; // Intl.DateTimeFormat
INTL_NUMBER_FORMAT; // Intl.NumberFormat
REAL_404; // HTTP 404 real

// ARQUITECTURA (Fase 3)
MODULAR_ROUTES; // Sistema de rutas modular
API_MIDDLEWARE; // Middleware pattern en API

// KILL SWITCHES (Emergencia)
BOOKING_ENABLED; // ON por defecto
FICHAJE_ENABLED; // ON por defecto
AGENT_LAURA_ENABLED; // ON por defecto
ANALYTICS_ENABLED; // ON por defecto
```

### Cómo Usar Feature Flags

```typescript
import { isFeatureEnabled, FEATURES } from './lib/feature-flags';

// En cualquier endpoint o componente:
if (await isFeatureEnabled(FEATURES.CSRF_PROTECTION)) {
  // Nueva implementación con CSRF
  validateCsrfToken(req);
} else {
  // Comportamiento legacy (sin CSRF)
}
```

---

## Comandos de Gestión

### Listar todos los flags

```bash
curl https://www.farrayscenter.com/api/feature-flags \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Activar un flag

```bash
curl -X POST https://www.farrayscenter.com/api/feature-flags \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "enable",
    "flag": "security.csrf_protection",
    "reason": "Deploy CSRF protection",
    "changedBy": "fabio@farrayscenter.com"
  }'
```

### Desactivar un flag (rollback)

```bash
curl -X POST https://www.farrayscenter.com/api/feature-flags \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "disable",
    "flag": "security.csrf_protection",
    "reason": "Rollback - users reporting issues",
    "changedBy": "fabio@farrayscenter.com"
  }'
```

### Crear snapshot (antes de deploy)

```bash
curl -X POST https://www.farrayscenter.com/api/feature-flags \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "snapshot"}'
```

### EMERGENCIA: Desactivar sistema completo

```bash
# Si el booking widget está causando problemas:
curl -X POST https://www.farrayscenter.com/api/feature-flags \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "emergency_disable", "system": "booking"}'
```

---

## Tests de Regresión

**OBLIGATORIO**: Ejecutar antes de cualquier merge a main.

```bash
# Ejecutar solo tests de regresión críticos
npm run test:regression

# Ejecutar todos los tests
npm run test
```

### Qué verifican los tests de regresión:

| Sistema           | Tests                                                        |
| ----------------- | ------------------------------------------------------------ |
| **Booking**       | Validación Zod, emails, teléfonos, GDPR                      |
| **Fichajes**      | Estructura datos, cálculo horas                              |
| **Agent Laura**   | Detección idioma, lead scoring, knowledge base, consent GDPR |
| **Analytics**     | Eventos funnel, data layer, audit logs                       |
| **Feature Flags** | Kill switches ON por defecto, nuevos flags OFF               |

---

## Plan de Implementación por Fases

### FASE 1: Seguridad (Semana 1-2)

```
┌─────────────────────────────────────────────────────────────────┐
│ ✅ DÍA 1: Preparación                                           │
├─────────────────────────────────────────────────────────────────┤
│ ✅ 1. Sistema de Feature Flags implementado                     │
│ ✅ 2. Tests de regresión creados (47 tests)                     │
│ ✅ 3. FEATURE_FLAGS_ADMIN_TOKEN configurado en Vercel           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ ✅ DÍA 2-3: CSRF Protection (Backend)                           │
├─────────────────────────────────────────────────────────────────┤
│ ✅ 1. Implementar /api/csrf endpoint                            │
│ ✅ 2. Implementar api/lib/csrf.ts (generación/validación)       │
│ ✅ 3. Envolver con feature flag                                 │
│ ✅ 4. Deploy a producción (flag OFF - seguro)                   │
│ ✅ 5. Hook useCsrfToken.ts creado para frontend                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 🔜 PENDIENTE: CSRF Protection (Frontend)                        │
├─────────────────────────────────────────────────────────────────┤
│ 1. Integrar useCsrfToken en BookingForm                         │
│ 2. Añadir X-CSRF-Token header en fetch de reservas              │
│ 3. Probar flujo completo localmente                             │
│ 4. Deploy y activar flag gradualmente (10% → 50% → 100%)        │
│ 5. Monitorear errores en Sentry 24h                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ ✅ DÍA 4-5: Webhook Enforcement                                 │
├─────────────────────────────────────────────────────────────────┤
│ ✅ 1. Modificar webhook-momence.ts (modo AUDIT/ENFORCEMENT)     │
│ ✅ 2. Modificar webhook-whatsapp.ts (modo AUDIT/ENFORCEMENT)    │
│ ✅ 3. Envolver verificación con feature flag                    │
│ ✅ 4. Deploy (flag OFF - modo AUDIT por defecto)                │
│ 🔜 5. Monitorear logs 24-48h antes de activar ENFORCEMENT       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ DÍA 6-7: Enhanced Sanitization                                  │
├─────────────────────────────────────────────────────────────────┤
│ 1. Agregar DOMPurify a api/contact.ts                           │
│ 2. Envolver con feature flag                                    │
│ 3. Deploy y activar gradualmente                                │
└─────────────────────────────────────────────────────────────────┘
```

### FASE 2: SEO/i18n (Semana 3-4)

```
┌─────────────────────────────────────────────────────────────────┐
│ Intl.DateTimeFormat & NumberFormat                              │
├─────────────────────────────────────────────────────────────────┤
│ 1. Crear utils/intl-formatters.ts                               │
│ 2. Agregar hook useIntlFormat                                   │
│ 3. Envolver con feature flag                                    │
│ 4. Probar en cada idioma (es, ca, en, fr)                       │
│ 5. Activar gradualmente                                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Real 404 Pages                                                  │
├─────────────────────────────────────────────────────────────────┤
│ 1. Crear componente NotFoundPage                                │
│ 2. Modificar App.tsx con ruta catch-all                         │
│ 3. Configurar vercel.json para 404 real                         │
│ 4. Envolver con feature flag                                    │
│ 5. Probar URLs inexistentes                                     │
└─────────────────────────────────────────────────────────────────┘
```

### FASE 3: Arquitectura (Mes 2)

```
┌─────────────────────────────────────────────────────────────────┐
│ Refactorizar App.tsx                                            │
├─────────────────────────────────────────────────────────────────┤
│ ⚠️ ALTO RIESGO - Más tests requeridos                           │
│                                                                 │
│ 1. Crear src/routes/index.ts                                    │
│ 2. Mover rutas gradualmente (10 rutas/día)                      │
│ 3. Mantener ambas versiones con feature flag                    │
│ 4. Ejecutar E2E tests completos en cada batch                   │
│ 5. Solo activar cuando 100% rutas migradas                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Checklist Pre-Deploy

```markdown
## Antes de cada deploy

- [ ] `npm run test:regression` pasa 100%
- [ ] `npm run test` pasa (o solo fallan tests no relacionados)
- [ ] `npm run build` completa sin errores
- [ ] Feature flag creado para la nueva funcionalidad
- [ ] Código legacy preservado (no eliminado)
- [ ] Snapshot de flags creado
- [ ] Monitoreo de Sentry activo
- [ ] Plan de rollback documentado

## Después de cada deploy

- [ ] Verificar booking widget funciona (crear reserva de prueba)
- [ ] Verificar fichajes funciona (marcar entrada/salida)
- [ ] Verificar Agent Laura responde (enviar WhatsApp de prueba)
- [ ] Verificar analytics dispara eventos (revisar GTM)
- [ ] Revisar Sentry por nuevos errores
- [ ] Activar feature flag gradualmente (10% → 50% → 100%)
```

---

## Rollback de Emergencia

### Opción 1: Desactivar Feature Flag

```bash
# Desactivar la feature específica
curl -X POST .../api/feature-flags \
  -d '{"action": "disable", "flag": "security.csrf_protection"}'
```

**Tiempo de rollback: ~5 segundos**

### Opción 2: Restaurar Snapshot

```bash
# Restaurar todos los flags al estado anterior
curl -X POST .../api/feature-flags \
  -d '{"action": "restore", "snapshotKey": "ff:snapshot:1707321600000"}'
```

**Tiempo de rollback: ~10 segundos**

### Opción 3: Kill Switch de Sistema

```bash
# Si todo el booking está roto:
curl -X POST .../api/feature-flags \
  -d '{"action": "emergency_disable", "system": "booking"}'
```

**Tiempo de rollback: ~5 segundos**
**Efecto: Todo el sistema offline hasta restaurar**

### Opción 4: Revert Git + Redeploy

```bash
git revert HEAD
git push origin main
# Esperar redeploy de Vercel (~2 min)
```

**Tiempo de rollback: ~3-5 minutos**

---

## Monitoreo Durante Deploy

### Métricas a Observar

| Métrica         | Normal | Alerta     | Crítico |
| --------------- | ------ | ---------- | ------- |
| Error rate      | <1%    | 1-5%       | >5%     |
| Booking success | >95%   | 90-95%     | <90%    |
| API latency     | <500ms | 500-1000ms | >1000ms |
| Agent response  | <3s    | 3-5s       | >5s     |

### Comandos de Verificación

```bash
# Verificar booking widget
curl https://www.farrayscenter.com/api/clases

# Verificar Agent Laura responde
# (enviar mensaje de prueba a WhatsApp)

# Verificar métricas
curl https://www.farrayscenter.com/api/metrics

# Ver logs de Vercel
vercel logs --follow
```

---

## Contactos de Emergencia

En caso de problemas graves:

1. **Desactivar feature flag inmediatamente**
2. **Si no funciona: kill switch del sistema afectado**
3. **Notificar al equipo**
4. **Documentar el incidente**

---

## Próximos Pasos

1. **Configurar FEATURE_FLAGS_ADMIN_TOKEN** en Vercel env vars
2. **Agregar npm script** `test:regression` en package.json
3. **Implementar primera mejora** (CSRF) siguiendo el plan
4. **Documentar cada rollout** en el audit log

---

_Documento creado: 2026-02-07_
_Última actualización: 2026-02-07_
